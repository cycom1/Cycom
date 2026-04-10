const DELIVERY_FEES = {
  'Nairobi CBD': 0,
  'Westlands / Kilimani': 200,
  'Embakasi / Donholm': 250,
  'Kasarani / Roysambu': 300,
  'Kiambu / Thika Road': 350,
  'Outside Nairobi': 700
};

const PRODUCT_PRICES = {
  'router-dual': 34999,
  'wifi-extender': 5999,
  'outdoor-cpe': 6999,
  'poe-switch': 4999,
  'camera-5mp': 3999,
  'hdd-1tb': 5499
};

const PLAN_PRICES = {
  'basic-home': 999,
  'standard-home': 1999,
  'business-pro': 4499
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'https://www.cycom.africa');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function calculateExpectedTotal(cart, deliveryArea) {
  if (!Array.isArray(cart) || !cart.length) return 0;

  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = PRODUCT_PRICES[item.id];
    const quantity = Number(item.qty || 0);

    if (!unitPrice || quantity <= 0) return sum;
    return sum + (unitPrice * quantity);
  }, 0);

  return subtotal + (DELIVERY_FEES[deliveryArea] || 0);
}

function calculateExpectedPlanTotal(planCode) {
  return PLAN_PRICES[String(planCode || '').trim()] || 0;
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, {
      verified: false,
      message: 'Method not allowed. Use POST.'
    });
    return;
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    sendJson(res, 500, {
      verified: false,
      message: 'PAYSTACK_SECRET_KEY is not configured on the server.'
    });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const paymentType = String(body.paymentType || 'shop').trim().toLowerCase();
    const reference = String(body.reference || '').trim();
    const deliveryArea = String(body.deliveryArea || body.area || '').trim();
    const cart = Array.isArray(body.cart) ? body.cart : [];
    const planCode = String(body.planCode || '').trim();

    if (!reference) {
      sendJson(res, 400, {
        verified: false,
        message: 'Missing Paystack transaction reference.'
      });
      return;
    }

    const expectedTotal = paymentType === 'plan'
      ? calculateExpectedPlanTotal(planCode)
      : calculateExpectedTotal(cart, deliveryArea);

    if (!expectedTotal) {
      sendJson(res, 400, {
        verified: false,
        message: 'Unable to calculate the expected payment total for verification.'
      });
      return;
    }

    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const paystackPayload = await paystackResponse.json();
    const transaction = paystackPayload && paystackPayload.data ? paystackPayload.data : null;

    if (!paystackResponse.ok || !transaction) {
      sendJson(res, 502, {
        verified: false,
        message: paystackPayload && paystackPayload.message ? paystackPayload.message : 'Could not reach Paystack verification service.'
      });
      return;
    }

    const paidAmount = Number(transaction.amount || 0);
    const expectedAmount = expectedTotal * 100;
    const paidCurrency = String(transaction.currency || '').toUpperCase();
    const isVerified = transaction.status === 'success' && paidCurrency === 'KES' && paidAmount === expectedAmount;

    sendJson(res, isVerified ? 200 : 400, {
      verified: isVerified,
      paymentType,
      reference: transaction.reference,
      transactionStatus: transaction.status,
      paidAt: transaction.paid_at || null,
      channel: transaction.channel || null,
      paidAmount,
      expectedAmount,
      currency: paidCurrency,
      message: isVerified
        ? 'Payment verified successfully.'
        : 'Payment was found, but the amount or currency did not match the expected total.'
    });
  } catch (error) {
    sendJson(res, 500, {
      verified: false,
      message: error && error.message ? error.message : 'Unexpected server error while verifying payment.'
    });
  }
};
