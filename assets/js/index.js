function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
  }

  function checkCoverage() {
    const area = document.getElementById('coverageArea')?.value || '';
    const need = document.getElementById('coverageNeed')?.value || 'Home Internet';
    const result = document.getElementById('coverageResult');
    const waBtn = document.getElementById('coverageWhatsAppBtn');
    if (!result || !waBtn) return;

    if (!area) {
      result.className = 'coverage-result';
      result.innerHTML = '<strong>Select your area to start</strong><span>We will show a quick guide and prepare a WhatsApp message for a faster response from the CyCom team.</span>';
      waBtn.href = 'https://wa.me/254710504940?text=Hi%20CyCom%2C%20I%20want%20to%20check%20coverage%20in%20my%20area.';
      return;
    }

    const priorityAreas = ['Nairobi CBD', 'Westlands / Kilimani', 'Embakasi / Donholm', 'Kasarani / Roysambu', 'Kiambu / Thika Road'];
    const expandingAreas = ['Kitale', 'Kisumu', 'Kakamega'];
    let title = 'Coverage check ready';
    let text = `We can confirm ${need.toLowerCase()} availability in ${area} and recommend the best next step.`;
    let stateClass = 'coverage-result';

    if (priorityAreas.includes(area)) {
      title = 'Good news — priority coverage area';
      text = `${area} is one of our faster-response zones. CyCom can usually confirm ${need.toLowerCase()} quickly and help schedule installation sooner.`;
      stateClass = 'coverage-result is-good';
    } else if (expandingAreas.includes(area)) {
      title = 'Expanding coverage zone';
      text = `CyCom is actively handling requests around ${area}. Send your location and we will confirm the best ${need.toLowerCase()} option for you.`;
      stateClass = 'coverage-result is-expand';
    } else {
      title = 'Manual coverage confirmation needed';
      text = `Your request for ${area} may need a quick manual confirmation from our team, and we can still advise on ${need.toLowerCase()} availability.`;
      stateClass = 'coverage-result is-check';
    }

    result.className = stateClass;
    result.innerHTML = `<strong>${title}</strong><span>${text}</span>`;

    const message = encodeURIComponent(`Hi CyCom, I want to check coverage for ${need} in ${area}. Please confirm availability and installation time.`);
    waBtn.href = `https://wa.me/254710504940?text=${message}`;
  }

  function heroCheckCoverage(form) {
    const heroArea = form.querySelector('#heroCoverageArea');
    const area = heroArea?.value || '';
    if (!area) { heroArea?.focus(); return false; }

    const target = document.getElementById('coverageArea');
    if (target) target.value = area;
    if (typeof checkCoverage === 'function') checkCoverage();

    document.getElementById('coverage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return false;
  }

  function isAdminMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('admin') === '1' || localStorage.getItem('cycom_admin_mode') === '1';
  }

  async function initAdminAnalytics() {
    const panel = document.getElementById('adminStatsPanel');
    const countEl = document.getElementById('adminViewsCount');
    const noteEl = document.getElementById('adminStatsNote');
    if (!panel || !countEl || !noteEl) return;

    const params = new URLSearchParams(window.location.search);
    const adminEnabled = isAdminMode();

    if (params.get('admin') === '1') {
      localStorage.setItem('cycom_admin_mode', '1');
    }

    if (!adminEnabled) return;

    panel.style.display = 'block';

    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = function() {
        localStorage.removeItem('cycom_admin_mode');
        const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
        window.location.replace(cleanUrl);
      };
    }

    try {
      const namespace = 'cycom-africa';
      const key = 'landing-page-views';
      const sessionKey = 'cycom_page_view_counted';
      const hasCounted = sessionStorage.getItem(sessionKey) === '1';
      const endpoint = hasCounted
        ? `https://api.countapi.xyz/get/${namespace}/${key}`
        : `https://api.countapi.xyz/hit/${namespace}/${key}`;

      const response = await fetch(endpoint, { cache: 'no-store' });
      const data = await response.json();
      const totalViews = typeof data.value === 'number' ? data.value : 0;

      if (!hasCounted) {
        sessionStorage.setItem(sessionKey, '1');
      }

      countEl.textContent = totalViews.toLocaleString();
      noteEl.textContent = 'Admin mode active (?admin=1).';
    } catch (error) {
      countEl.textContent = 'N/A';
      noteEl.textContent = 'Unable to load analytics right now.';
    }
  }

  initAdminAnalytics();

  // Admin-editable product catalog defaults.
  const SHOP_PRODUCTS_DEFAULT = [
    {
      id: 'router-dual',
      category: 'wifi',
      tag: 'Wi-Fi 6E',
      name: 'TP-Link Archer AXE300 (AXE16000)',
      price: 34999,
      media: '📶',
      image: 'images/archer-axe300-01.jpg',
      images: [
        'images/archer-axe300-01.jpg',
        'images/archer-axe300-02.jpg',
        'images/archer-axe300-03.jpg',
        'images/archer-axe300-04.jpg',
        'images/archer-axe300-05.jpg',
        'images/archer-axe300-06.jpg'
      ],
      stock: 'in',
      qty: 12,
      description: 'AXE16000 Quad-Band 16-Stream Wi-Fi 6E router with ultra-fast throughput and multi-gig connectivity for premium homes and offices.',
      features: ['Up to 15.6 Gbps quad-band Wi-Fi performance', '2× 10G WAN/LAN ports (RJ45 + RJ45/SFP+ combo)', '1× 2.5G WAN/LAN + 4× Gigabit LAN', 'Dedicated 6 GHz Wi-Fi 6E band for low-latency traffic', 'USB 3.0 port for high-speed file sharing', 'TP-Link HomeShield security suite', 'VPN client/server support for secure remote access']
    },
    {
      id: 'wifi-extender',
      category: 'wifi',
      tag: 'Outdoor AP',
      name: 'TP-Link Omada EAP113-Outdoor',
      price: 5999,
      media: '📡',
      image: 'images/eap113-outdoor-01.png',
      images: [
        'images/eap113-outdoor-01.png',
        'images/eap113-outdoor-02.jpg',
        'images/eap113-outdoor-03.jpg',
        'images/eap113-outdoor-04.png',
        'images/eap113-outdoor-05.jpg',
        'images/eap113-outdoor-06.jpg'
      ],
      stock: 'low',
      qty: 3,
      description: '300Mbps Wireless N Outdoor Access Point designed for stable outdoor Wi-Fi with weatherproof construction and centralized Omada management.',
      features: ['IP65 weatherproof enclosure for outdoor deployments', 'Up to 300Mbps Wi-Fi with 2×2 MIMO', 'Long-range coverage with high-power amplifier and professional antennas', 'Integrated into Omada SDN for centralized cloud management', 'Supports both 802.3af PoE and 48V Passive PoE', 'Secure guest network with portal and multiple authentication options']
    },
    {
      id: 'outdoor-cpe',
      category: 'network',
      tag: 'Outdoor',
      name: 'TP-Link Omada Outdoor PoE Switch (SG2005P-PD)',
      price: 6999,
      media: '🛰️',
      image: 'images/sg2005p-pd-01.jpg',
      images: [
        'images/sg2005p-pd-01.jpg',
        'images/sg2005p-pd-02.jpg',
        'images/sg2005p-pd-03.jpg',
        'images/sg2005p-pd-04.jpg',
        'images/sg2005p-pd-05.jpg',
        'images/sg2005p-pd-06.jpg'
      ],
      stock: 'in',
      qty: 8,
      description: 'TP-Link Omada 5-Port Gigabit Smart Switch with 1-Port PoE++ In and 4-Port PoE+ Out. IP55 weatherproof outdoor enclosure with 200m PoE range and cloud management.',
      features: ['Up to 200m PoE distance via passthrough', '1× PoE++ in, 4× PoE+ out (64W/44W budget)', 'IP55 weatherproof, -40°C to 60°C rated', '4KV lightning protection', 'Omada SDN cloud managed', 'ACL, QoS & VLAN support', 'Wall or pole mount kit included']
    },
    {
      id: 'eap215-bridge-kit',
      category: 'network',
      tag: 'Bridge Kit',
      name: 'TP-Link Omada EAP215-Bridge-KIT',
      price: 6000,
      media: 'BR',
      image: 'images/eap215-bridge-kit-01.jpg',
      images: [
        'images/eap215-bridge-kit-01.jpg',
        'images/eap215-bridge-kit-02.jpg',
        'images/eap215-bridge-kit-03.jpg',
        'images/eap215-bridge-kit-04.jpg'
      ],
      stock: 'in',
      qty: 5,
      description: '5GHz AC867 long-range wireless bridge kit designed for PtP and PtMP links across sites, CCTV backhaul, and remote network extension. Gallery includes real deployment scenes.',
      features: ['Up to 5 km (3.1 mi) transmission distance', 'Wi-Fi 5 AC867 wireless bridge performance', 'Preconfigured kit with auto-pairing', 'Supports 1-to-4 multi-bridge auto-pairing', '3× Gigabit Ethernet ports for cameras and endpoints', 'IP65 weatherproof enclosure with 6 kV lightning protection', '802.3af PoE, 24V passive PoE, or 12V DC power input']
    },
    {
      id: 'poe-switch',
      category: 'network',
      tag: 'Network',
      name: '8-Port PoE Switch',
      price: 4999,
      media: '🔌',
      stock: 'in',
      qty: 9,
      bestValue: true,
      description: 'Power and connect your cameras and access points from one switch.',
      features: ['8 PoE-enabled ports', 'Plug-and-play setup', 'Ideal for CCTV deployments']
    },
    {
      id: 'camera-5mp',
      category: 'cctv',
      tag: 'Security',
      name: '5MP IP CCTV Camera',
      price: 3999,
      media: '📷',
      stock: 'low',
      qty: 2,
      description: 'High-clarity indoor/outdoor camera for homes, shops, and offices.',
      features: ['5MP image quality', 'Night vision support', 'Metal weatherproof body']
    },
    {
      id: 'hdd-1tb',
      category: 'cctv',
      tag: 'Storage',
      name: '1TB Surveillance HDD',
      price: 5499,
      media: '💽',
      stock: 'out',
      qty: 0,
      description: 'Reliable hard drive designed for continuous camera recording workloads.',
      features: ['24/7 recording support', 'Optimized for DVR/NVR use', 'Low-noise operation']
    }
  ];

  const DELIVERY_FEES = {
    'Nairobi CBD': 0,
    'Westlands / Kilimani': 200,
    'Embakasi / Donholm': 250,
    'Kasarani / Roysambu': 300,
    'Kiambu / Thika Road': 350,
    'Outside Nairobi': 700
  };

  // To enable ads:
  // 1) Set ADSENSE_CLIENT to your publisher ID (example: ca-pub-1234567890123456)
  // 2) Set each ad slot ID below using your AdSense ad unit IDs
  const ADSENSE_CLIENT = 'ca-pub-6662163998857192';
  const AD_SLOT_IDS = {
    topBanner: '4164373887',
    betweenHeroFeatures: '4164373887',
    betweenShopPlans: '6234201708',
    beforeContact: '3960493204',
    footerBanner: '3960493204'
  };
  const PAYSTACK_PUBLIC_KEY = 'pk_live_2ae809fce170bbd23bd1aabf92ace804422af70d';
  const PAYSTACK_CURRENCY = 'KES';
  const PAYSTACK_VERIFY_ENDPOINT = '/api/paystack/verify';
  const CYCOM_BUILD_ID = '2026-04-10-paystack-live';

  const SHOP_CART_KEY = 'cycom_shop_cart';
  const SHOP_PRODUCTS_KEY = 'cycom_shop_catalog';
  const PLAN_ACTIVATION_ENDPOINT = '/api/subscriptions/activate';
  const ACTIVE_PLAN_STORAGE_KEY = 'cycom_active_plan';
  const PLAN_CATALOG = {
    'starter-5':    { code: 'starter-5',    name: 'Starter',          price: 1100, speed: '5 Mbps',   audience: 'Home' },
    'basic-15':     { code: 'basic-15',     name: 'Basic Home',       price: 1500, speed: '15 Mbps',  audience: 'Home' },
    'standard-20':  { code: 'standard-20',  name: 'Standard Home',    price: 2500, speed: '20 Mbps',  audience: 'Home' },
    'homeplus-40':  { code: 'homeplus-40',  name: 'Home Plus',        price: 3500, speed: '40 Mbps',  audience: 'Home' },
    'biz-60':       { code: 'biz-60',       name: 'Business Starter', price: 5000, speed: '60 Mbps',  audience: 'Business' },
    'biz-pro-100':  { code: 'biz-pro-100',  name: 'Business Pro',     price: 8000, speed: '100 Mbps', audience: 'Business' }
  };
  let selectedPlanCode = '';
  let shopCart = [];
  let shopProducts = [];
  let activeShopFilter = 'all';

  function formatKsh(value) {
    return `KSh ${Number(value).toLocaleString()}`;
  }

  function loadShopCart() {
    try {
      const raw = localStorage.getItem(SHOP_CART_KEY);
      shopCart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(shopCart)) shopCart = [];
    } catch (error) {
      shopCart = [];
    }
  }

  function saveShopCart() {
    localStorage.setItem(SHOP_CART_KEY, JSON.stringify(shopCart));
  }

  function loadShopProducts() {
    try {
      const raw = localStorage.getItem(SHOP_PRODUCTS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length) {
        shopProducts = SHOP_PRODUCTS_DEFAULT.map((product) => {
          const saved = parsed.find((p) => p.id === product.id);
          const merged = saved ? { ...product, ...saved } : { ...product };

          // Keep older saved catalogs from breaking TP-Link image visibility.
          if (merged.id === 'outdoor-cpe') {
            const defaultGallery = [
              'images/sg2005p-pd-01.jpg',
              'images/sg2005p-pd-02.jpg',
              'images/sg2005p-pd-03.jpg',
              'images/sg2005p-pd-04.jpg',
              'images/sg2005p-pd-05.jpg',
              'images/sg2005p-pd-06.jpg'
            ];
            if (!merged.image || String(merged.image).includes('static.tp-link.com')) {
              merged.image = 'images/sg2005p-pd-01.jpg';
            }
            if (!Array.isArray(merged.images) || !merged.images.length) {
              merged.images = defaultGallery;
            }
          }

          if (merged.id === 'router-dual') {
            const defaultGallery = [
              'images/archer-axe300-01.jpg',
              'images/archer-axe300-02.jpg',
              'images/archer-axe300-03.jpg',
              'images/archer-axe300-04.jpg',
              'images/archer-axe300-05.jpg',
              'images/archer-axe300-06.jpg'
            ];
            if (!merged.image || String(merged.image).includes('static.tp-link.com') || String(merged.image).includes('hero-network-team')) {
              merged.image = 'images/archer-axe300-01.jpg';
            }
            if (!Array.isArray(merged.images) || !merged.images.length) {
              merged.images = defaultGallery;
            }
          }

          if (merged.id === 'wifi-extender') {
            const defaultGallery = [
              'images/eap113-outdoor-01.png',
              'images/eap113-outdoor-02.jpg',
              'images/eap113-outdoor-03.jpg',
              'images/eap113-outdoor-04.png',
              'images/eap113-outdoor-05.jpg',
              'images/eap113-outdoor-06.jpg'
            ];
            if (!merged.image || String(merged.image).includes('static.tp-link.com') || String(merged.image).includes('hero-students-group')) {
              merged.image = 'images/eap113-outdoor-01.png';
            }
            if (!Array.isArray(merged.images) || !merged.images.length) {
              merged.images = defaultGallery;
            }
          }

          if (merged.id === 'eap215-bridge-kit') {
            const defaultGallery = [
              'images/eap215-bridge-kit-01.jpg',
              'images/eap215-bridge-kit-02.jpg',
              'images/eap215-bridge-kit-03.jpg',
              'images/eap215-bridge-kit-04.jpg'
            ];
            if (!merged.image || String(merged.image).includes('static.tp-link.com')) {
              merged.image = 'images/eap215-bridge-kit-01.jpg';
            }
            if (!Array.isArray(merged.images) || !merged.images.length) {
              merged.images = defaultGallery;
            }
          }

          return merged;
        });
      } else {
        shopProducts = JSON.parse(JSON.stringify(SHOP_PRODUCTS_DEFAULT));
      }
    } catch (error) {
      shopProducts = JSON.parse(JSON.stringify(SHOP_PRODUCTS_DEFAULT));
    }
  }

  function saveShopProducts() {
    localStorage.setItem(SHOP_PRODUCTS_KEY, JSON.stringify(shopProducts));
  }

  function slugifyProductName(name) {
    return String(name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  let productViewAutoTimer = null;
  let productLightboxGallery = [];
  let productLightboxIndex = 0;
  let productSwipeStartX = 0;
  let productSwipeDeltaX = 0;

  function clearProductViewAuto() {
    if (productViewAutoTimer) {
      window.clearInterval(productViewAutoTimer);
      productViewAutoTimer = null;
    }
  }

  function renderProductLightbox() {
    const imageEl = document.getElementById('productLightboxImage');
    const countEl = document.getElementById('productLightboxCount');
    const prevBtn = document.querySelector('.plb-nav-prev');
    const nextBtn = document.querySelector('.plb-nav-next');
    if (!imageEl || !countEl) return;
    if (!productLightboxGallery.length) {
      imageEl.removeAttribute('src');
      countEl.textContent = '0 / 0';
      return;
    }
    productLightboxIndex = (productLightboxIndex + productLightboxGallery.length) % productLightboxGallery.length;
    imageEl.src = productLightboxGallery[productLightboxIndex];
    countEl.textContent = (productLightboxIndex + 1) + ' / ' + productLightboxGallery.length;
    const multi = productLightboxGallery.length > 1;
    if (prevBtn) prevBtn.style.display = multi ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = multi ? 'flex' : 'none';
  }

  function openProductLightbox(gallery, index) {
    productLightboxGallery = Array.isArray(gallery) ? gallery.slice() : [];
    productLightboxIndex = Number(index || 0);
    renderProductLightbox();
    const overlay = document.getElementById('productLightboxOverlay');
    if (overlay) overlay.classList.add('open');
  }

  function closeProductLightbox() {
    const overlay = document.getElementById('productLightboxOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  function stepProductLightbox(step) {
    if (!productLightboxGallery.length) return;
    productLightboxIndex += step;
    renderProductLightbox();
  }

  function getDeliveryFee() {
    const area = (document.getElementById('shopDeliveryArea') || {}).value || '';
    return DELIVERY_FEES[area] || 0;
  }

  function updatePaystackStatus(message, isError = false) {
    const statusEl = document.getElementById('shopPaystackStatus');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.style.color = isError ? '#b91c1c' : 'var(--text3)';
    statusEl.style.background = isError ? 'rgba(185, 28, 28, 0.05)' : 'rgba(20,184,166,0.08)';
    statusEl.style.borderColor = isError ? 'rgba(185, 28, 28, 0.16)' : 'rgba(20,184,166,0.16)';
  }

  function isPaystackReady() {
    return !!PAYSTACK_PUBLIC_KEY && !PAYSTACK_PUBLIC_KEY.includes('replace_with_your_key');
  }

  function buildShopOrderDetails(forcedPaymentMethod = '') {
    const buyerNameEl = document.getElementById('shopBuyerName');
    const buyerPhoneEl = document.getElementById('shopBuyerPhone');
    const buyerEmailEl = document.getElementById('shopBuyerEmail');
    const paymentEl = document.getElementById('shopPaymentMethod');
    const areaEl = document.getElementById('shopDeliveryArea');

    const buyerName = buyerNameEl ? buyerNameEl.value.trim() : '';
    const buyerPhone = buyerPhoneEl ? buyerPhoneEl.value.trim() : '';
    const buyerEmail = buyerEmailEl ? buyerEmailEl.value.trim() : '';
    const payment = forcedPaymentMethod || (paymentEl ? paymentEl.value : '');
    const area = areaEl ? areaEl.value : '';

    if (!shopCart.length) {
      alert('Your cart is empty. Please add items first.');
      return null;
    }

    if (!buyerName || !buyerPhone || !area) {
      alert('Please fill in your name, phone number, and delivery area.');
      return null;
    }

    if (!payment) {
      alert('Please choose a payment method.');
      return null;
    }

    const lines = shopCart.map((item) => `- ${item.name} x${item.qty} (${formatKsh(item.price * item.qty)})`);
    const subtotal = shopCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const deliveryFee = getDeliveryFee();
    const grandTotal = subtotal + deliveryFee;
    const summaryText = `Name: ${buyerName}\nPhone: ${buyerPhone}\n${buyerEmail ? `Email: ${buyerEmail}\n` : ''}Payment Method: ${payment}\nDelivery Area: ${area}\n\nItems:\n${lines.join('\n')}\n\nSubtotal: ${formatKsh(subtotal)}\nDelivery Fee: ${formatKsh(deliveryFee)}\nGrand Total: ${formatKsh(grandTotal)}`;

    return {
      buyerName,
      buyerPhone,
      buyerEmail,
      payment,
      area,
      lines,
      subtotal,
      deliveryFee,
      grandTotal,
      summaryText
    };
  }

  function openShopWhatsAppCheckout() {
    const order = buildShopOrderDetails();
    if (!order) return;

    const message = encodeURIComponent(
      `Hi CyCom, I'd like to place a shop order.\n\n${order.summaryText}\n\nPlease confirm availability and delivery options.`
    );

    window.open(`https://wa.me/254710504940?text=${message}`, '_blank');
  }

  async function verifyPaystackPayment(reference, order) {
    const response = await fetch(PAYSTACK_VERIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reference,
        deliveryArea: order.area,
        cart: shopCart.map((item) => ({
          id: item.id,
          qty: item.qty
        }))
      })
    });

    let result = null;
    try {
      result = await response.json();
    } catch (error) {
      result = null;
    }

    if (!response.ok || !result?.verified) {
      throw new Error(result?.message || 'Payment verification could not be completed right now.');
    }

    return result;
  }

  async function refreshPaystackStatus() {
    if (!isPaystackReady()) {
      updatePaystackStatus('Paystack checkout has been added. Replace PAYSTACK_PUBLIC_KEY with your real public key to start receiving live payments.');
      return;
    }

    try {
      const response = await fetch(PAYSTACK_VERIFY_ENDPOINT, { method: 'OPTIONS' });
      if (response.ok || response.status === 204 || response.status === 405) {
        updatePaystackStatus('Paystack checkout is active with secure server verification for paid orders.');
        return;
      }
    } catch (error) {
      // Fall through to the manual review notice below.
    }

    updatePaystackStatus('Paystack checkout is active. If secure server verification is not available yet, CyCom will confirm the payment manually from the Paystack dashboard.', true);
  }

  function startPaystackCheckout() {
    const paymentEl = document.getElementById('shopPaymentMethod');
    if (paymentEl) paymentEl.value = 'Paystack';

    const order = buildShopOrderDetails('Paystack');
    if (!order) return;

    if (!order.buyerEmail) {
      updatePaystackStatus('Add an email address so Paystack can send the customer receipt.', true);
      alert('Please enter your email address to receive the Paystack receipt.');
      return;
    }

    if (!window.PaystackPop) {
      updatePaystackStatus('Paystack could not load on this page. Please refresh and try again.', true);
      alert('Paystack could not load. Please refresh the page and try again.');
      return;
    }

    if (!isPaystackReady()) {
      updatePaystackStatus('Add your real Paystack public key in PAYSTACK_PUBLIC_KEY to activate live payments.', true);
      alert('Paystack has been added, but the public key still needs to be set before it can accept payments.');
      return;
    }

    updatePaystackStatus(`Opening secure Paystack checkout for ${formatKsh(order.grandTotal)}...`);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: order.buyerEmail,
      amount: Math.round(order.grandTotal * 100),
      currency: PAYSTACK_CURRENCY,
      ref: `CYCOM-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: order.buyerName
          },
          {
            display_name: 'Customer Phone',
            variable_name: 'customer_phone',
            value: order.buyerPhone
          },
          {
            display_name: 'Delivery Area',
            variable_name: 'delivery_area',
            value: order.area
          }
        ]
      },
      callback: async function(response) {
        updatePaystackStatus(`Payment received. Verifying securely for reference ${response.reference}...`);

        try {
          const verification = await verifyPaystackPayment(response.reference, order);
          updatePaystackStatus(`Payment verified successfully. Reference: ${verification.reference}`);

          const paidMessage = encodeURIComponent(
            `Hi CyCom, I have completed and verified my Paystack payment.\n\n${order.summaryText}\nPayment Reference: ${verification.reference}\n\nPlease confirm my order and delivery timeline.`
          );

          shopCart = [];
          saveShopCart();
          renderShopCart();
          window.open(`https://wa.me/254710504940?text=${paidMessage}`, '_blank');
        } catch (error) {
          const fallbackMessage = encodeURIComponent(
            `Hi CyCom, I completed a Paystack payment but secure verification needs manual review.\n\n${order.summaryText}\nPayment Reference: ${response.reference}\n\nPlease confirm this payment from your Paystack dashboard and finalize my order.`
          );

          updatePaystackStatus(error.message || 'Secure verification is still pending. Please contact CyCom for manual confirmation.', true);
          alert(`Payment was received, but secure verification is still pending. Please share this reference with CyCom: ${response.reference}`);
          window.open(`https://wa.me/254710504940?text=${fallbackMessage}`, '_blank');
        }
      },
      onClose: function() {
        updatePaystackStatus('Payment window was closed before completion. You can try again or use WhatsApp checkout.', true);
      }
    });

    handler.openIframe();
  }

  function getCustomerTypeLabel(customerType) {
    return customerType === 'existing-customer' ? 'Existing Customer Renewal' : 'New Installation';
  }

  function getSavedActivePlan() {
    try {
      const raw = localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && parsed.planCode ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function saveActivePlan(record) {
    localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, JSON.stringify(record));
  }

  function updatePlanModalStatus(message, tone = 'default') {
    const statusEl = document.getElementById('planModalStatus');
    if (!statusEl) return;

    statusEl.textContent = message;
    const palette = {
      default: {
        color: 'var(--text3)',
        background: 'rgba(20,184,166,0.08)',
        borderColor: 'rgba(20,184,166,0.16)'
      },
      success: {
        color: '#166534',
        background: 'rgba(22,163,74,0.08)',
        borderColor: 'rgba(22,163,74,0.16)'
      },
      error: {
        color: '#b91c1c',
        background: 'rgba(185,28,28,0.05)',
        borderColor: 'rgba(185,28,28,0.16)'
      }
    };
    const style = palette[tone] || palette.default;
    statusEl.style.color = style.color;
    statusEl.style.background = style.background;
    statusEl.style.borderColor = style.borderColor;
  }

  function renderPlanActivationStatus() {
    const banner = document.getElementById('planActivationBanner');
    const activePlan = getSavedActivePlan();
    if (banner) {
      if (activePlan && PLAN_CATALOG[activePlan.planCode]) {
        const stateLabel = activePlan.serviceState === 'live' ? 'Active' : 'Queued for installation';
        const timeLabel = activePlan.activatedAt ? new Date(activePlan.activatedAt).toLocaleString() : 'just now';
        banner.classList.add('active');
        banner.innerHTML = `<div class="plan-activation-title">${activePlan.planName} — ${stateLabel}</div><span>Reference: ${activePlan.reference || 'Pending'}${activePlan.activationId ? ` • Activation ID: ${activePlan.activationId}` : ''} • Updated: ${timeLabel}</span>`;
      } else {
        banner.classList.remove('active');
        banner.innerHTML = '<div class="plan-activation-title">No active plan yet</div><span>Select a package below to subscribe and pay securely.</span>';
      }
    }

    document.querySelectorAll('.plan-subscribe-btn').forEach((btn) => {
      const planCode = btn.getAttribute('data-plan-code') || '';
      if (!btn.dataset.defaultLabel) {
        btn.dataset.defaultLabel = btn.textContent.trim();
      }

      if (activePlan && activePlan.planCode === planCode) {
        btn.textContent = activePlan.serviceState === 'live' ? 'Active on this device ✓' : 'Activation queued ✓';
      } else {
        btn.textContent = btn.dataset.defaultLabel;
      }
    });
  }

  function openPlanActivationModal(planCode) {
    const plan = PLAN_CATALOG[planCode];
    const overlay = document.getElementById('planActivationOverlay');
    if (!plan || !overlay) return;

    selectedPlanCode = planCode;
    const nameEl = document.getElementById('planCustomerName');
    const phoneEl = document.getElementById('planCustomerPhone');
    const emailEl = document.getElementById('planCustomerEmail');
    const areaEl = document.getElementById('planCustomerArea');
    const shopNameEl = document.getElementById('shopBuyerName');
    const shopPhoneEl = document.getElementById('shopBuyerPhone');
    const shopEmailEl = document.getElementById('shopBuyerEmail');
    const shopAreaEl = document.getElementById('shopDeliveryArea');

    document.getElementById('planModalPlanName').textContent = plan.name;
    document.getElementById('planModalPlanMeta').textContent = `${plan.speed} • ${formatKsh(plan.price)} / month`;
    document.getElementById('planModalTitle').textContent = `Activate ${plan.name}`;
    document.getElementById('planModalSubtitle').textContent = `Complete your payment for the ${plan.speed} ${plan.audience.toLowerCase()} package and trigger automatic activation.`;

    if (nameEl && !nameEl.value && shopNameEl?.value) nameEl.value = shopNameEl.value;
    if (phoneEl && !phoneEl.value && shopPhoneEl?.value) phoneEl.value = shopPhoneEl.value;
    if (emailEl && !emailEl.value && shopEmailEl?.value) emailEl.value = shopEmailEl.value;
    if (areaEl && !areaEl.value && shopAreaEl?.value) areaEl.value = shopAreaEl.value;

    updatePlanModalStatus('Pay securely with Paystack to activate this package. Existing customer renewals go live faster after verification.');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePlanActivationModal() {
    const overlay = document.getElementById('planActivationOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function buildPlanSubscriptionDetails() {
    const plan = PLAN_CATALOG[selectedPlanCode];
    if (!plan) {
      alert('Please choose a plan first.');
      return null;
    }

    const fullName = (document.getElementById('planCustomerName') || {}).value?.trim() || '';
    const phone = (document.getElementById('planCustomerPhone') || {}).value?.trim() || '';
    const email = (document.getElementById('planCustomerEmail') || {}).value?.trim() || '';
    const customerType = (document.getElementById('planCustomerType') || {}).value || 'new-installation';
    const area = (document.getElementById('planCustomerArea') || {}).value || '';
    const accountNumber = (document.getElementById('planCustomerAccount') || {}).value?.trim() || '';
    const address = (document.getElementById('planCustomerAddress') || {}).value?.trim() || '';

    if (!fullName || !phone || !email || !area || !address) {
      alert('Please fill in your name, phone, email, area, and installation address.');
      return null;
    }

    if (customerType === 'existing-customer' && !accountNumber) {
      alert('Please provide your existing CyCom account number for instant renewal activation.');
      return null;
    }

    const customerTypeLabel = getCustomerTypeLabel(customerType);
    const summaryText = `Plan: ${plan.name}\nSpeed: ${plan.speed}\nPrice: ${formatKsh(plan.price)} / month\nCustomer Type: ${customerTypeLabel}\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nArea: ${area}\nAddress: ${address}${accountNumber ? `\nAccount Number: ${accountNumber}` : ''}`;

    return {
      planCode: plan.code,
      planName: plan.name,
      speed: plan.speed,
      amount: plan.price,
      audience: plan.audience,
      fullName,
      phone,
      email,
      customerType,
      customerTypeLabel,
      area,
      address,
      accountNumber,
      summaryText
    };
  }

  async function verifyPlanSubscriptionPayment(reference, subscription) {
    const response = await fetch(PAYSTACK_VERIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentType: 'plan',
        reference,
        planCode: subscription.planCode,
        planAmount: subscription.amount,
        area: subscription.area,
        customerType: subscription.customerType
      })
    });

    let result = null;
    try {
      result = await response.json();
    } catch (error) {
      result = null;
    }

    if (!response.ok || !result?.verified) {
      throw new Error(result?.message || 'Payment verification could not be completed right now.');
    }

    return result;
  }

  async function activatePlanSubscription(subscription, verification) {
    const response = await fetch(PLAN_ACTIVATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reference: verification.reference,
        planCode: subscription.planCode,
        planName: subscription.planName,
        speed: subscription.speed,
        amount: subscription.amount,
        fullName: subscription.fullName,
        phone: subscription.phone,
        email: subscription.email,
        customerType: subscription.customerType,
        accountNumber: subscription.accountNumber,
        area: subscription.area,
        address: subscription.address
      })
    });

    let result = null;
    try {
      result = await response.json();
    } catch (error) {
      result = null;
    }

    if (!response.ok || !result?.activated) {
      throw new Error(result?.message || 'The package payment was received, but automatic activation could not be completed yet.');
    }

    return result;
  }

  function initPlanCheckout() {
    document.querySelectorAll('.plan-subscribe-btn').forEach((btn) => {
      if (!btn.dataset.defaultLabel) {
        btn.dataset.defaultLabel = btn.textContent.trim();
      }
      btn.onclick = function() {
        openPlanActivationModal(this.getAttribute('data-plan-code') || '');
      };
    });

    const payBtn = document.getElementById('planPayNowBtn');
    if (payBtn) {
      payBtn.onclick = startPlanSubscriptionCheckout;
    }

    renderPlanActivationStatus();
  }

  function startPlanSubscriptionCheckout() {
    const plan = PLAN_CATALOG[selectedPlanCode];
    if (!plan) {
      alert('Please select a plan first.');
      return;
    }

    if (!window.PaystackPop) {
      updatePlanModalStatus('Paystack could not load on this page. Please refresh and try again.', 'error');
      alert('Paystack could not load. Please refresh the page and try again.');
      return;
    }

    if (!isPaystackReady()) {
      updatePlanModalStatus('The Paystack public key is not active yet. Please update the key first.', 'error');
      alert('Paystack is not fully configured yet.');
      return;
    }

    const subscription = buildPlanSubscriptionDetails();
    if (!subscription) return;

    updatePlanModalStatus(`Opening Paystack checkout for ${subscription.planName} — ${formatKsh(subscription.amount)} / month...`);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: subscription.email,
      amount: Math.round(subscription.amount * 100),
      currency: PAYSTACK_CURRENCY,
      ref: `CYPLAN-${subscription.planCode.toUpperCase()}-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Plan Name',
            variable_name: 'plan_name',
            value: subscription.planName
          },
          {
            display_name: 'Customer Type',
            variable_name: 'customer_type',
            value: subscription.customerTypeLabel
          },
          {
            display_name: 'Coverage Area',
            variable_name: 'coverage_area',
            value: subscription.area
          },
          {
            display_name: 'Customer Phone',
            variable_name: 'customer_phone',
            value: subscription.phone
          }
        ]
      },
      callback: async function(response) {
        updatePlanModalStatus(`Payment received for ${subscription.planName}. Verifying securely...`);

        try {
          const verification = await verifyPlanSubscriptionPayment(response.reference, subscription);
          const activation = await activatePlanSubscription(subscription, verification);
          const activationRecord = {
            planCode: subscription.planCode,
            planName: subscription.planName,
            speed: subscription.speed,
            price: subscription.amount,
            reference: verification.reference,
            activationId: activation.activationId || '',
            activatedAt: activation.activatedAt || new Date().toISOString(),
            serviceState: activation.serviceState || (subscription.customerType === 'existing-customer' ? 'live' : 'pending-installation')
          };

          saveActivePlan(activationRecord);
          renderPlanActivationStatus();
          updatePlanModalStatus(activation.message || `${subscription.planName} has been activated successfully.`, 'success');

          const activationMessage = encodeURIComponent(
            `Hi CyCom, I have paid for the ${subscription.planName} plan and the activation flow completed successfully.\n\n${subscription.summaryText}\nPayment Reference: ${verification.reference}\nActivation ID: ${activation.activationId || 'Auto-generated'}\nService Status: ${activation.serviceState || 'active'}`
          );
          window.open(`https://wa.me/254710504940?text=${activationMessage}`, '_blank');
          window.setTimeout(closePlanActivationModal, 1200);
        } catch (error) {
          const pendingMessage = encodeURIComponent(
            `Hi CyCom, I paid for the ${subscription.planName} package but activation still needs manual confirmation.\n\n${subscription.summaryText}\nPayment Reference: ${response.reference}\n\nPlease confirm the payment and activate my package.`
          );
          updatePlanModalStatus(error.message || 'Payment was received, but automatic activation is still pending.', 'error');
          alert(`Payment was received, but automatic activation is still pending. Please share this reference with CyCom: ${response.reference}`);
          window.open(`https://wa.me/254710504940?text=${pendingMessage}`, '_blank');
        }
      },
      onClose: function() {
        updatePlanModalStatus('Payment window was closed before completion. You can try again whenever you are ready.', 'error');
      }
    });

    handler.openIframe();
  }

  function getStockMeta(stock) {
    if (stock === 'out') return { label: 'Out of Stock', className: 'out-stock' };
    if (stock === 'low') return { label: 'Low Stock', className: 'low-stock' };
    return { label: 'In Stock', className: 'in-stock' };
  }

  function getProductMedia(id) {
    const mediaMap = {
      'router-dual': 'images/archer-axe300-01.jpg',
      'wifi-extender': 'images/eap113-outdoor-01.png',
      'outdoor-cpe': 'images/sg2005p-pd.jpg',
      'eap215-bridge-kit': 'images/eap215-bridge-kit-01.jpg',
      'poe-switch': 'images/bg/contact-tech-setup.jpg',
      'camera-5mp': 'images/bg/contact-tech-setup.jpg',
      'hdd-1tb': 'images/bg/hero-college-collage.jpg'
    };
    return mediaMap[id] || 'images/bg/hero-network-team.jpg';
  }

  function handleImgError(img) {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.style.visibility = 'hidden';
    img.insertAdjacentHTML('afterend', '<div class="media-fallback-note media-fallback-inline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Photo coming soon</span></div>');
  }

  function verifyMediaImages(root) {
    if (!root) return;
    const fallbackNote = '<div class="media-fallback-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Photo coming soon</span></div>';
    root.querySelectorAll('[data-media-src]').forEach((el) => {
      const src = el.getAttribute('data-media-src');
      if (!src) return;
      const probe = new Image();
      probe.onerror = () => {
        el.classList.add('media-fallback');
        el.insertAdjacentHTML('beforeend', fallbackNote);
      };
      probe.src = src;
    });
  }

  function renderTopShopPicks() {
    const picksEl = document.getElementById('topShopPicksGrid');
    if (!picksEl) return;

    const picks = shopProducts.slice(0, 4);
    picksEl.innerHTML = picks.map((product) => {
      const displayPrice = Number(product.price) > 0 ? formatKsh(product.price) : 'Contact for price';
      const mediaSrc = product.image || getProductMedia(product.id);
      return `
        <article class="top-shop-item">
          <div class="top-shop-item-media" data-media-src="${mediaSrc}" style="background-image:url('${mediaSrc}');" aria-hidden="true"></div>
          <div class="top-shop-item-name">${product.name}</div>
          <div class="top-shop-item-meta">
            <span class="top-shop-item-price">${displayPrice}</span>
            <span class="top-shop-item-category">${product.category}</span>
          </div>
        </article>
      `;
    }).join('');
    verifyMediaImages(picksEl);
  }

  function renderShopProducts() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    const filtered = shopProducts.filter((product) => activeShopFilter === 'all' || product.category === activeShopFilter);
    grid.innerHTML = filtered.map((product) => {
      const stockMeta = getStockMeta(product.stock);
      const outOfStock = product.stock === 'out';
      const buyMsg = encodeURIComponent(`Hi CyCom, I want to buy the ${product.name} (${formatKsh(product.price)}).`);
      const mediaSrc = product.image || getProductMedia(product.id);

      return `
        <div class="shop-card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-stock="${product.stock}">
          <div class="shop-top">
            <span class="shop-tag">${product.tag}</span>
            <div class="shop-price">${formatKsh(product.price)}</div>
          </div>
          <div class="shop-media" data-media-src="${mediaSrc}" style="background-image:url('${mediaSrc}');" aria-hidden="true">
            <span class="shop-media-chip">${product.category}</span>
            ${product.bestValue ? '<span class="shop-best-value">Best Value</span>' : ''}
          </div>
          <span class="shop-stock ${stockMeta.className}">${stockMeta.label}</span>
          ${product.stock === 'low' ? `<span class="shop-urgency">Only ${Math.max(1, Number(product.qty || 0))} left in stock</span>` : ''}
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <ul class="shop-list">
            ${product.features.map((feature) => `<li>${feature}</li>`).join('')}
          </ul>
          <button type="button" class="shop-view-btn" data-view-id="${product.id}">&#128269; View Details</button>
          <div class="shop-card-actions">
            <button type="button" class="plan-cta primary shop-add-btn ${outOfStock ? 'is-disabled' : ''}" ${outOfStock ? 'disabled' : ''}>${outOfStock ? 'Unavailable' : 'Add to Cart'}</button>
            <a href="https://wa.me/254710504940?text=${buyMsg}" class="plan-cta secondary ${outOfStock ? 'is-disabled' : ''}" target="_blank" rel="noopener noreferrer">Buy Now</a>
          </div>
        </div>
      `;
    }).join('');
    verifyMediaImages(grid);

    Array.from(grid.querySelectorAll('.shop-card')).forEach((card) => {
      const addBtn = card.querySelector('.shop-add-btn');
      if (addBtn && !addBtn.disabled) {
        addBtn.onclick = function() {
          const id = card.getAttribute('data-id') || '';
          const name = card.getAttribute('data-name') || 'Shop Item';
          const price = Number(card.getAttribute('data-price') || '0');
          const stock = card.getAttribute('data-stock') || 'in';
          if (stock === 'out') return;
          addToShopCart({ id, name, price });
        };
      }
      const viewBtn = card.querySelector('.shop-view-btn');
      if (viewBtn) {
        viewBtn.onclick = function() {
          openProductView(viewBtn.getAttribute('data-view-id'));
        };
      }
    });

    renderTopShopPicks();
  }

  function openProductView(productId) {
    const product = shopProducts.find(p => p.id === productId);
    if (!product) return;
    clearProductViewAuto();
    const stockMeta = getStockMeta(product.stock);
    const outOfStock = product.stock === 'out';
    const buyMsg = encodeURIComponent('Hi CyCom, I want to buy the ' + product.name + ' (' + formatKsh(product.price) + ').');

    // tag row
    document.getElementById('pvTagRow').innerHTML =
      '<span class="shop-tag">' + product.tag + '</span>' +
      '<span class="shop-stock ' + stockMeta.className + '">' + stockMeta.label + '</span>' +
      (product.bestValue ? '<span class="shop-best-value" style="position:static">Best Value</span>' : '');

    // image gallery
    const imgWrap = document.getElementById('pvImgWrap');
    const thumbsWrap = document.getElementById('pvThumbs');
    const gallery = Array.isArray(product.images) && product.images.length
      ? product.images
      : (product.image ? [product.image] : []);
    if (gallery.length) {
      let activeIndex = 0;
      const startAuto = function() {
        clearProductViewAuto();
        if (gallery.length <= 1) return;
        productViewAutoTimer = window.setInterval(function() {
          renderMain(activeIndex + 1);
        }, 3200);
      };

      const pauseAuto = function() {
        clearProductViewAuto();
      };

      const renderMain = function(index) {
        activeIndex = (index + gallery.length) % gallery.length;
        const navButtons = gallery.length > 1
          ? '<button type="button" class="pv-nav pv-nav-prev" aria-label="Previous image">&#10094;</button>' +
            '<button type="button" class="pv-nav pv-nav-next" aria-label="Next image">&#10095;</button>'
          : '';
        const galleryCount = gallery.length > 1
          ? '<div class="pv-gallery-count">' + (activeIndex + 1) + ' / ' + gallery.length + '</div>'
          : '';
        imgWrap.innerHTML = navButtons + '<img class="pv-main-image" src="' + gallery[activeIndex] + '" alt="' + product.name + '" onerror="handleImgError(this)"><div class="pv-zoom-lens"></div>' + galleryCount;

        const prevBtn = imgWrap.querySelector('.pv-nav-prev');
        const nextBtn = imgWrap.querySelector('.pv-nav-next');
        const mainImage = imgWrap.querySelector('.pv-main-image');
        const zoomLens = imgWrap.querySelector('.pv-zoom-lens');
        if (prevBtn) {
          prevBtn.onclick = function() {
            renderMain(activeIndex - 1);
            startAuto();
          };
        }
        if (nextBtn) {
          nextBtn.onclick = function() {
            renderMain(activeIndex + 1);
            startAuto();
          };
        }

        if (mainImage) {
          mainImage.onclick = function() {
            openProductLightbox(gallery, activeIndex);
          };
        }

        if (zoomLens && mainImage) {
          imgWrap.onmousemove = function(event) {
            if (window.matchMedia('(hover: hover)').matches === false) return;
            const rect = mainImage.getBoundingClientRect();
            const lensSize = 120;
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
              zoomLens.style.display = 'none';
              return;
            }
            const lx = Math.max(lensSize / 2, Math.min(rect.width - lensSize / 2, x));
            const ly = Math.max(lensSize / 2, Math.min(rect.height - lensSize / 2, y));
            const bx = (lx / rect.width) * 100;
            const by = (ly / rect.height) * 100;
            zoomLens.style.display = 'block';
            zoomLens.style.left = (lx - lensSize / 2) + 'px';
            zoomLens.style.top = (ly - lensSize / 2) + 'px';
            zoomLens.style.backgroundImage = 'url("' + gallery[activeIndex] + '")';
            zoomLens.style.backgroundSize = '260% 260%';
            zoomLens.style.backgroundPosition = bx + '% ' + by + '%';
          };
        }

        imgWrap.onmouseenter = pauseAuto;
        imgWrap.onmouseleave = function() {
          const lens = imgWrap.querySelector('.pv-zoom-lens');
          if (lens) lens.style.display = 'none';
          startAuto();
        };
        imgWrap.ontouchstart = function(event) {
          if (!event.touches || !event.touches.length) return;
          pauseAuto();
          productSwipeStartX = event.touches[0].clientX;
          productSwipeDeltaX = 0;
        };
        imgWrap.ontouchmove = function(event) {
          if (!event.touches || !event.touches.length) return;
          productSwipeDeltaX = event.touches[0].clientX - productSwipeStartX;
        };
        imgWrap.ontouchend = function() {
          if (Math.abs(productSwipeDeltaX) > 40) {
            renderMain(productSwipeDeltaX < 0 ? activeIndex + 1 : activeIndex - 1);
          }
          productSwipeStartX = 0;
          productSwipeDeltaX = 0;
          startAuto();
        };

        if (thumbsWrap) {
          Array.from(thumbsWrap.querySelectorAll('.pv-thumb')).forEach((btn, i) => {
            btn.classList.toggle('is-active', i === activeIndex);
          });
        }
      };

      if (thumbsWrap) {
        thumbsWrap.innerHTML = gallery.map((src, index) =>
          '<button type="button" class="pv-thumb' + (index === 0 ? ' is-active' : '') + '" data-index="' + index + '" aria-label="Product image ' + (index + 1) + '" style="--delay:' + (index * 0.04) + 's">' +
            '<img src="' + src + '" alt="' + product.name + ' thumbnail ' + (index + 1) + '" onerror="handleImgError(this)">' +
          '</button>'
        ).join('');
        thumbsWrap.querySelectorAll('.pv-thumb').forEach((btn) => {
          btn.onclick = function() {
            const index = Number(btn.getAttribute('data-index') || '0');
            if (!Number.isNaN(index) && gallery[index]) {
              renderMain(index);
              startAuto();
            }
          };
        });
        thumbsWrap.onmouseenter = pauseAuto;
        thumbsWrap.onmouseleave = startAuto;
      }
      renderMain(activeIndex);
      startAuto();
    } else {
      imgWrap.innerHTML = '<div class="pv-img-placeholder">' + (product.media || '📦') + '</div>';
      if (thumbsWrap) thumbsWrap.innerHTML = '';
    }

    document.getElementById('pvName').textContent = product.name;
    document.getElementById('pvPrice').textContent = formatKsh(product.price);
    document.getElementById('pvDesc').textContent = product.description;
    document.getElementById('pvFeatures').innerHTML = product.features.map((feature, index) => '<li style="--delay:' + ((index * 0.06) + 0.08) + 's">' + feature + '</li>').join('');
    const featureTitle = document.getElementById('pvFeatures').previousElementSibling;
    if (featureTitle && featureTitle.classList.contains('pv-features-title')) {
      featureTitle.innerHTML = 'What\'s included<div class="pv-autoplay-note">Gallery auto-slides every 3.2 seconds. Hover to pause.</div>';
    }

    document.getElementById('pvActions').innerHTML =
      '<button type="button" class="plan-cta primary' + (outOfStock ? ' is-disabled' : '') + '" id="pvAddBtn" ' + (outOfStock ? 'disabled' : '') + '>' + (outOfStock ? 'Unavailable' : 'Add to Cart') + '</button>' +
      '<a href="https://wa.me/254710504940?text=' + buyMsg + '" class="plan-cta secondary' + (outOfStock ? ' is-disabled' : '') + '" target="_blank" rel="noopener noreferrer">Buy Now</a>';

    const pvAddBtn = document.getElementById('pvAddBtn');
    if (pvAddBtn && !pvAddBtn.disabled) {
      pvAddBtn.onclick = function() {
        addToShopCart({ id: product.id, name: product.name, price: product.price });
        closeProductView();
      };
    }

    document.getElementById('productViewOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProductView() {
    clearProductViewAuto();
    closeProductLightbox();
    document.getElementById('productViewOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function(event) {
    const planModalOpen = document.getElementById('planActivationOverlay')?.classList.contains('open');
    if (planModalOpen && event.key === 'Escape') {
      closePlanActivationModal();
      return;
    }

    const lightboxOpen = document.getElementById('productLightboxOverlay')?.classList.contains('open');
    if (!lightboxOpen) return;
    if (event.key === 'Escape') closeProductLightbox();
    if (event.key === 'ArrowLeft') stepProductLightbox(-1);
    if (event.key === 'ArrowRight') stepProductLightbox(1);
  });

  function renderShopCart() {
    const itemsEl = document.getElementById('shopCartItems');
    const emptyEl = document.getElementById('shopCartEmpty');
    const totalEl = document.getElementById('shopCartTotal');
    const deliveryEl = document.getElementById('shopDeliveryFee');
    const grandEl = document.getElementById('shopGrandTotal');
    const countEl = document.getElementById('shopCartCount');
    const mobileCountEl = document.getElementById('mobileCartCount');
    const mobileTotalEl = document.getElementById('mobileCartTotal');
    const mobileStick = document.getElementById('mobileCartStick');
    if (!itemsEl || !emptyEl || !totalEl || !deliveryEl || !grandEl || !countEl) return;

    itemsEl.innerHTML = '';

    let itemCount = 0;
    let subtotal = 0;

    shopCart.forEach((item, index) => {
      itemCount += item.qty;
      subtotal += item.price * item.qty;

      const li = document.createElement('li');
      li.innerHTML = `<span>${item.name} x${item.qty}</span><span>${formatKsh(item.price * item.qty)} <button type="button" class="shop-cart-btn" data-remove-index="${index}">Remove</button></span>`;
      itemsEl.appendChild(li);
    });

    emptyEl.style.display = itemCount ? 'none' : 'block';
    countEl.textContent = String(itemCount);
    totalEl.textContent = formatKsh(subtotal);
    const deliveryFee = getDeliveryFee();
    deliveryEl.textContent = formatKsh(deliveryFee);
    grandEl.textContent = formatKsh(subtotal + deliveryFee);

    if (mobileCountEl) mobileCountEl.textContent = String(itemCount);
    if (mobileTotalEl) mobileTotalEl.textContent = formatKsh(subtotal + deliveryFee);
    if (mobileStick) mobileStick.style.display = itemCount > 0 ? 'block' : 'none';

    itemsEl.querySelectorAll('[data-remove-index]').forEach((btn) => {
      btn.onclick = function() {
        const index = Number(this.getAttribute('data-remove-index'));
        if (Number.isNaN(index)) return;
        shopCart.splice(index, 1);
        saveShopCart();
        renderShopCart();
      };
    });
  }

  function addToShopCart(item) {
    const existing = shopCart.find((entry) => entry.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      shopCart.push({ ...item, qty: 1 });
    }
    saveShopCart();
    renderShopCart();
  }

  function initShop() {
    const filterBtns = Array.from(document.querySelectorAll('.shop-filter'));

    filterBtns.forEach((btn) => {
      btn.onclick = function() {
        activeShopFilter = this.getAttribute('data-filter') || 'all';
        filterBtns.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        renderShopProducts();
      };
    });

    const clearBtn = document.getElementById('shopClearCartBtn');
    if (clearBtn) {
      clearBtn.onclick = function() {
        shopCart = [];
        saveShopCart();
        renderShopCart();
      };
    }

    const areaSelect = document.getElementById('shopDeliveryArea');
    if (areaSelect) {
      areaSelect.onchange = function() {
        renderShopCart();
      };
    }

    const checkoutBtn = document.getElementById('shopCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.onclick = openShopWhatsAppCheckout;
    }

    const paystackBtn = document.getElementById('shopPaystackBtn');
    if (paystackBtn) {
      paystackBtn.onclick = startPaystackCheckout;
    }

    refreshPaystackStatus();

    const mobileStick = document.getElementById('mobileCartStick');
    if (mobileStick) {
      mobileStick.onclick = function() {
        const cart = document.getElementById('shopCart');
        if (cart) {
          cart.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    }

    renderShopProducts();
    loadShopCart();
    renderShopCart();
  }

  function initAds() {
    const adContainers = Array.from(document.querySelectorAll('.ad-slot'));
    if (!adContainers.length) return;

    const hasClient = typeof ADSENSE_CLIENT === 'string' && ADSENSE_CLIENT.trim().length > 0;
    if (!hasClient) return;

    adContainers.forEach((container) => {
      const adKey = container.getAttribute('data-ad-key') || '';
      const slotId = AD_SLOT_IDS[adKey] || '';
      const adFormat = container.getAttribute('data-ad-format') || 'auto';
      const minHeight = container.getAttribute('data-ad-min-height') || (container.classList.contains('ad-slot-banner') ? '120' : '90');
      if (!slotId) return;

      container.classList.add('ad-live');
      container.innerHTML = `<ins class="adsbygoogle" style="display:block;width:100%;min-height:${minHeight}px;" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="${slotId}" data-ad-format="${adFormat}" data-full-width-responsive="true"></ins>`;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        container.innerHTML = '<span class="ad-label">Ad failed to load</span>';
      }
    });
  }

  function renderAdminShopEditor() {
    const panel = document.getElementById('adminShopEditor');
    const listEl = document.getElementById('adminShopEditorList');
    if (!panel || !listEl) return;

    if (!isAdminMode()) {
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'block';
    listEl.innerHTML = shopProducts.map((product) => {
      const safeName = String(product.name || '').replace(/"/g, '&quot;');
      const safeTag = String(product.tag || '').replace(/"/g, '&quot;');
      const safeImage = String(product.image || '').replace(/"/g, '&quot;');
      const safeDescription = String(product.description || '').replace(/</g, '&lt;');
      const safeFeatures = (Array.isArray(product.features) ? product.features.join(', ') : '').replace(/</g, '&lt;');

      return `
      <div class="admin-shop-item" data-id="${product.id}">
        <b>${product.name}</b>
        <div class="admin-shop-grid">
          <input type="text" data-field="name" value="${safeName}" aria-label="${product.name} name">
          <input type="text" data-field="tag" value="${safeTag}" aria-label="${product.name} tag">
          <select data-field="category" aria-label="${product.name} category">
            <option value="wifi" ${product.category === 'wifi' ? 'selected' : ''}>WiFi</option>
            <option value="cctv" ${product.category === 'cctv' ? 'selected' : ''}>CCTV</option>
            <option value="network" ${product.category === 'network' ? 'selected' : ''}>Network</option>
          </select>
          <input type="number" min="0" step="1" data-field="price" value="${Number(product.price)}" aria-label="${product.name} price">
          <select data-field="stock" aria-label="${product.name} stock">
            <option value="in" ${product.stock === 'in' ? 'selected' : ''}>In Stock</option>
            <option value="low" ${product.stock === 'low' ? 'selected' : ''}>Low Stock</option>
            <option value="out" ${product.stock === 'out' ? 'selected' : ''}>Out of Stock</option>
          </select>
          <input type="number" min="0" step="1" data-field="qty" value="${Number(product.qty || 0)}" aria-label="${product.name} quantity">
          <input type="text" data-field="image" value="${safeImage}" placeholder="Image URL (optional)" aria-label="${product.name} image url">
          <label class="admin-inline-check"><input type="checkbox" data-field="bestValue" ${product.bestValue ? 'checked' : ''}>Best Value</label>
          <textarea data-field="description" aria-label="${product.name} description">${safeDescription}</textarea>
          <textarea data-field="features" aria-label="${product.name} features">${safeFeatures}</textarea>
        </div>
      </div>
    `;
    }).join('');

    const saveBtn = document.getElementById('adminShopSaveBtn');
    const resetBtn = document.getElementById('adminShopResetBtn');
    const addBtn = document.getElementById('adminAddProductBtn');

    if (saveBtn) {
      saveBtn.onclick = function() {
        Array.from(listEl.querySelectorAll('.admin-shop-item')).forEach((row) => {
          const id = row.getAttribute('data-id');
          const nameInput = row.querySelector('[data-field="name"]');
          const tagInput = row.querySelector('[data-field="tag"]');
          const categorySelect = row.querySelector('[data-field="category"]');
          const priceInput = row.querySelector('[data-field="price"]');
          const stockSelect = row.querySelector('[data-field="stock"]');
          const qtyInput = row.querySelector('[data-field="qty"]');
          const imageInput = row.querySelector('[data-field="image"]');
          const bestValueInput = row.querySelector('[data-field="bestValue"]');
          const descriptionInput = row.querySelector('[data-field="description"]');
          const featuresInput = row.querySelector('[data-field="features"]');
          const product = shopProducts.find((p) => p.id === id);
          if (!product) return;

          const nextName = (nameInput?.value || '').trim();
          const nextTag = (tagInput?.value || '').trim();
          const nextCategory = categorySelect?.value || product.category;
          const nextPrice = Number(priceInput?.value || product.price);
          const nextQty = Number(qtyInput?.value || product.qty || 0);
          const nextImage = (imageInput?.value || '').trim();
          const nextDescription = (descriptionInput?.value || '').trim();
          const nextFeatures = (featuresInput?.value || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

          if (nextName) product.name = nextName;
          if (nextTag) product.tag = nextTag;
          if (['wifi', 'cctv', 'network'].includes(nextCategory)) {
            product.category = nextCategory;
          }
          product.price = Number.isFinite(nextPrice) && nextPrice >= 0 ? Math.round(nextPrice) : product.price;
          product.stock = ['in', 'low', 'out'].includes(stockSelect?.value || '') ? stockSelect.value : product.stock;
          product.qty = Number.isFinite(nextQty) && nextQty >= 0 ? Math.round(nextQty) : (product.qty || 0);
          product.image = nextImage;
          if (nextDescription) product.description = nextDescription;
          if (nextFeatures.length) product.features = nextFeatures;
          product.bestValue = Boolean(bestValueInput?.checked);
        });

        saveShopProducts();
        renderAdminShopEditor();
        renderShopProducts();
        renderShopCart();
        alert('Shop products updated successfully.');
      };
    }

    if (resetBtn) {
      resetBtn.onclick = function() {
        localStorage.removeItem(SHOP_PRODUCTS_KEY);
        shopProducts = JSON.parse(JSON.stringify(SHOP_PRODUCTS_DEFAULT));
        renderAdminShopEditor();
        renderShopProducts();
        renderShopCart();
      };
    }

    if (addBtn) {
      addBtn.onclick = async function() {
        const nameEl = document.getElementById('adminNewProductName');
        const priceEl = document.getElementById('adminNewProductPrice');
        const categoryEl = document.getElementById('adminNewProductCategory');
        const stockEl = document.getElementById('adminNewProductStock');
        const qtyEl = document.getElementById('adminNewProductQty');
        const tagEl = document.getElementById('adminNewProductTag');
        const descEl = document.getElementById('adminNewProductDesc');
        const featuresEl = document.getElementById('adminNewProductFeatures');
        const imageUrlEl = document.getElementById('adminNewProductImageUrl');
        const imageFileEl = document.getElementById('adminNewProductImageFile');

        const name = nameEl?.value.trim() || '';
        const price = Number(priceEl?.value || '0');
        const category = categoryEl?.value || 'wifi';
        const stock = stockEl?.value || 'in';
        const qty = Math.max(0, Number(qtyEl?.value || '0'));
        const tag = tagEl?.value.trim() || 'New';
        const description = descEl?.value.trim() || 'Newly uploaded product.';
        const features = (featuresEl?.value || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

        if (!name || !Number.isFinite(price) || price <= 0) {
          alert('Please provide a valid product name and price.');
          return;
        }

        const productId = `${slugifyProductName(name) || 'product'}-${Date.now()}`;

        let image = imageUrlEl?.value.trim() || '';
        const file = imageFileEl?.files && imageFileEl.files[0] ? imageFileEl.files[0] : null;
        if (file) {
          try {
            image = await readFileAsDataURL(file);
          } catch (error) {
            alert('Could not read uploaded image. Try again with a smaller file.');
            return;
          }
        }

        shopProducts.unshift({
          id: productId,
          category,
          tag,
          name,
          price: Math.round(price),
          media: '🛍️',
          stock: ['in', 'low', 'out'].includes(stock) ? stock : 'in',
          qty: Math.round(qty),
          description,
          features: features.length ? features : ['Details available on request'],
          image
        });

        saveShopProducts();
        renderAdminShopEditor();
        renderShopProducts();
        renderShopCart();
        alert('Product uploaded successfully.');
      };
    }
  }

  function applyTplinkStyleSectionOrder() {
    const body = document.body;
    if (!body) {
      return;
    }

    // Reorder homepage sections to a TP-Link-like flow: products, solutions, support, contact.
    const orderedSelectors = [
      '.hero',
      '#products',
      '#betweenHeroAd',
      '#shop',
      '#features',
      '#sms',
      '#cctv',
      '.cctv-mini-strip',
      '#plans',
      '#coverage',
      '#speedtest',
      '#how',
      '#testimonials',
      '#gallery',
      '#faq',
      '#ctaBannerSection',
      '#beforeContactAd',
      '#contact',
      '#footerBannerAd',
      'footer'
    ];

    orderedSelectors.forEach((selector) => {
      const section = document.querySelector(selector);
      if (section && section.parentElement === body) {
        body.appendChild(section);
      }
    });
  }

  applyTplinkStyleSectionOrder();
  loadShopProducts();
  initShop();
  initPlanCheckout();
  initAds();
  renderAdminShopEditor();

  function submitEnquiry() {
    const fname = document.getElementById('cf-fname').value.trim();
    const lname = document.getElementById('cf-lname').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const interest = document.getElementById('cf-interest').value;
    const msg = document.getElementById('cf-msg').value.trim();
    const statusEl = document.getElementById('cf-msg-status');

    statusEl.className = 'form-msg';

    if (!fname || !phone) {
      statusEl.textContent = 'Please fill in your name and phone number.';
      statusEl.className = 'form-msg error';
      return;
    }

    // Build a WhatsApp pre-filled message as the submission action
    const text = encodeURIComponent(
      `Hi CyCom! I'd like to enquire about your services/products.\n\nName: ${fname} ${lname}\nPhone: ${phone}\nInterested in: ${interest || 'general enquiry'}\nMessage: ${msg || 'Please contact me.'}`
    );
    window.open(`https://wa.me/254710504940?text=${text}`, '_blank');

    statusEl.textContent = "Thanks! We've opened WhatsApp with your message pre-filled. Hit send to reach us instantly.";
    statusEl.className = 'form-msg success';
  }

document.addEventListener('DOMContentLoaded', function () {
    const cctvSliderImages = [
      'https://www.zdnet.com/a/img/resize/962a748f7e73e367596d9e7ee348c3693f144c89/2014/04/08/d83b218c-1d17-11e4-8c7f-00505685119a/security-cameras-thumb.jpg?width=770&height=578&fit=crop&auto=webp',
      'https://media.istockphoto.com/photos/camera-security-the-green-park-picture-id1263779991?k=20&m=1263779991&s=612x612&w=0&h=XzHesk9IUI1WdbdJCCOgdKC1KdepcAHQpjlwYRjP64c=',
      'https://media.istockphoto.com/id/467211804/photo/camera-tower.jpg?s=170667a&w=0&k=20&c=CfXVtPGUq3zh0k7ed3P_eKjn0_DzEAv6XS0iteKe_w8='
    ];

    const cctvSliderImg = document.getElementById('cctvSliderImg');
    const cctvSliderPrev = document.getElementById('cctvSliderPrev');
    const cctvSliderNext = document.getElementById('cctvSliderNext');
    if (!cctvSliderImg || !cctvSliderPrev || !cctvSliderNext) {
      return;
    }

    let cctvSliderIndex = 0;
    let cctvSliderTimer = null;

    function showCctvSlide(index) {
      cctvSliderImg.style.opacity = '0.3';
      setTimeout(function () {
        cctvSliderImg.src = cctvSliderImages[index];
        cctvSliderImg.style.opacity = '1';
      }, 200);
    }

    function startCctvAutoSlide() {
      cctvSliderTimer = setInterval(function () {
        cctvSliderIndex = (cctvSliderIndex + 1) % cctvSliderImages.length;
        showCctvSlide(cctvSliderIndex);
      }, 4000);
    }

    function resetCctvAutoSlide() {
      if (cctvSliderTimer) {
        clearInterval(cctvSliderTimer);
      }
      startCctvAutoSlide();
    }

    cctvSliderPrev.addEventListener('click', function () {
      cctvSliderIndex = (cctvSliderIndex - 1 + cctvSliderImages.length) % cctvSliderImages.length;
      showCctvSlide(cctvSliderIndex);
      resetCctvAutoSlide();
    });

    cctvSliderNext.addEventListener('click', function () {
      cctvSliderIndex = (cctvSliderIndex + 1) % cctvSliderImages.length;
      showCctvSlide(cctvSliderIndex);
      resetCctvAutoSlide();
    });

    startCctvAutoSlide();
  });

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./service-worker.js');
    });
  }
