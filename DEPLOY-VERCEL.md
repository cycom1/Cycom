# Deploy CyCom on Vercel

This repo is now ready to run as a **static website + serverless API** on Vercel.

## 1) Import the GitHub repo
- Open Vercel and choose **Add New Project**
- Import `cycom1/Cycom`
- Keep the root directory as the repo root

## 2) Set environment variables
In the Vercel project settings, add:

```env
PAYSTACK_SECRET_KEY=your_real_paystack_secret_key
ALLOWED_ORIGIN=https://www.cycom.africa
ACTIVATION_WEBHOOK_URL=https://your-isp-system.example.com/api/activate-plan
ACTIVATION_WEBHOOK_BEARER_TOKEN=your_backend_token_if_needed
```

> Do **not** put the secret key in `index.html`. It must stay only in Vercel environment variables.
> `ACTIVATION_WEBHOOK_URL` should point to the real CyCom backend, CRM, MikroTik/RADIUS bridge, or billing system endpoint that actually enables the customer package after payment.

## 3) Deploy
After saving the environment variables, redeploy the project.

## 4) Connect your domain
To make secure verification work on your live site, point your production domain to Vercel:
- `www.cycom.africa`
- optionally the apex domain `cycom.africa`

Once the site is served by Vercel, the frontend will use:

```text
/api/paystack/verify
/api/subscriptions/activate
```

and the secure verification plus automatic package activation will work on the same domain once your backend webhook is connected.

## 5) Test the API
After deployment, check:

```text
https://www.cycom.africa/api/paystack/verify
```

Expected behavior:
- `OPTIONS` request should return `204`
- `POST` requests from the checkout flow should verify Paystack transactions

## Optional: keep the current static host
If you keep the website on a separate static host and only deploy the API to Vercel, update `PAYSTACK_VERIFY_ENDPOINT` in `index.html` to the full Vercel URL, for example:

```js
const PAYSTACK_VERIFY_ENDPOINT = 'https://your-project.vercel.app/api/paystack/verify';
```
