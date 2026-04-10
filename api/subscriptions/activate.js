const PLAN_CATALOG = {
  'basic-home': { name: 'Basic Home', speed: '5 Mbps' },
  'standard-home': { name: 'Standard Home', speed: '20 Mbps' },
  'business-pro': { name: 'Business Pro', speed: '50 Mbps' }
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'https://www.cycom.africa');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
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
      activated: false,
      message: 'Method not allowed. Use POST.'
    });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const reference = String(body.reference || '').trim();
    const planCode = String(body.planCode || '').trim();
    const fullName = String(body.fullName || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim();
    const customerType = String(body.customerType || 'new-installation').trim();
    const area = String(body.area || '').trim();
    const address = String(body.address || '').trim();
    const accountNumber = String(body.accountNumber || '').trim();
    const plan = PLAN_CATALOG[planCode];

    if (!reference || !plan || !fullName || !phone || !email || !area || !address) {
      sendJson(res, 400, {
        activated: false,
        message: 'Missing required activation details. Please confirm the customer and plan information.'
      });
      return;
    }

    if (customerType === 'existing-customer' && !accountNumber) {
      sendJson(res, 400, {
        activated: false,
        message: 'Existing customer renewals require the CyCom account number for instant activation.'
      });
      return;
    }

    if (!process.env.ACTIVATION_WEBHOOK_URL) {
      sendJson(res, 503, {
        activated: false,
        message: 'Payment is verified, but true automatic package activation needs ACTIVATION_WEBHOOK_URL configured for your ISP or billing system.'
      });
      return;
    }

    const activationPayload = {
      reference,
      planCode,
      planName: plan.name,
      speed: plan.speed,
      fullName,
      phone,
      email,
      customerType,
      area,
      address,
      accountNumber,
      source: 'cycom.africa'
    };

    const webhookHeaders = {
      'Content-Type': 'application/json'
    };

    if (process.env.ACTIVATION_WEBHOOK_BEARER_TOKEN) {
      webhookHeaders.Authorization = `Bearer ${process.env.ACTIVATION_WEBHOOK_BEARER_TOKEN}`;
    }

    const webhookResponse = await fetch(process.env.ACTIVATION_WEBHOOK_URL, {
      method: 'POST',
      headers: webhookHeaders,
      body: JSON.stringify(activationPayload)
    });

    let webhookResult = null;
    try {
      webhookResult = await webhookResponse.json();
    } catch (error) {
      webhookResult = null;
    }

    if (!webhookResponse.ok) {
      sendJson(res, 502, {
        activated: false,
        message: webhookResult && webhookResult.message
          ? webhookResult.message
          : 'The activation backend did not accept the request.'
      });
      return;
    }

    const activationId = (webhookResult && webhookResult.activationId) || `CY-ACT-${Date.now().toString(36).toUpperCase()}`;
    const activatedAt = (webhookResult && webhookResult.activatedAt) || new Date().toISOString();
    const serviceState = (webhookResult && webhookResult.serviceState) || (customerType === 'existing-customer' ? 'live' : 'pending-installation');

    sendJson(res, 200, {
      activated: true,
      activationId,
      activatedAt,
      serviceState,
      planName: plan.name,
      planSpeed: plan.speed,
      reference,
      message: (webhookResult && webhookResult.message)
        ? webhookResult.message
        : `Payment confirmed and ${plan.name} was sent to the activation backend successfully.`
    });
  } catch (error) {
    sendJson(res, 500, {
      activated: false,
      message: error && error.message ? error.message : 'Unexpected error while activating the paid package.'
    });
  }
};
