# COUNTRY DRIVE — PRODUCTION DEPLOYMENT CHECKLIST

**Target Environment**: Production / Staging  
**Application**: React.js + Vite Customer Frontend (`Frontend/User/`)  
**Artifact Output**: `Frontend/User/dist/`  

---

## 1. Pre-Deployment Configuration Checklist

| Item | Configuration | Status | Notes |
|---|---|---|---|
| **Vite Production Build** | `npm run build` | **READY** | Generates production bundle with content hashes |
| **SPA Route Rewrites** | `public/_redirects` & `vercel.json` | **READY** | Prevents 404 on direct subroute refreshes |
| **API Base URL** | `VITE_API_BASE_URL` | **CONFIGURABLE** | Set in production hosting dashboard or `.env` |
| **Razorpay Production Key**| `VITE_RAZORPAY_KEY_ID` | **CONFIGURABLE** | Replace `rzp_test_...` with live production key |
| **Google Sign-In Client ID**| `VITE_GOOGLE_CLIENT_ID` | **OPTIONAL** | Required only if Google OAuth button is enabled |
| **Asset Caching** | Immutable content hashes | **READY** | Static chunks can be cached for 1 year (`31536000`) |
| **HTML Cache Control** | `no-cache` / `must-revalidate`| **RECOMMENDED**| Ensure `index.html` is never cached permanently |

---

## 2. Backend CORS Requirements for Production

The backend Fastify server must configure `@fastify/cors` with the production frontend domain:

```typescript
// Required in backend/src/plugins/cors.ts or app.ts:
app.register(fastifyCors, {
  origin: [
    'https://countrydrive.in',
    'https://www.countrydrive.in',
    'https://app.countrydrive.in',
    // Staging / Preview domains if applicable
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400, // 24 hours pre-flight cache
});
```

---

## 3. Platform-Specific Deployment Instructions

### Option A: Vercel
1. Set Root Directory to `Frontend/User`.
2. Build Command: `npm run build`.
3. Output Directory: `dist`.
4. Environment Variables:
   - `VITE_API_BASE_URL=https://api.countrydrive.in/api/v1`
   - `VITE_RAZORPAY_KEY_ID=rzp_live_...`
5. The committed `vercel.json` automatically manages SPA rewrites to `/index.html`.

### Option B: Netlify / Cloudflare Pages
1. Set Base Directory to `Frontend/User`.
2. Build Command: `npm run build`.
3. Publish Directory: `Frontend/User/dist`.
4. The committed `public/_redirects` ensures all routes return `index.html` with HTTP 200.

### Option C: NGINX / Docker (Self-Hosted)
Use the following NGINX server block:
```nginx
server {
    listen 80;
    server_name countrydrive.in www.countrydrive.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name countrydrive.in www.countrydrive.in;

    ssl_certificate /etc/letsencrypt/live/countrydrive.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/countrydrive.in/privkey.pem;

    root /var/www/countrydrive/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Static assets with long-term cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }
}
```

---

## 4. Post-Deployment Smoke Test Checklist

- [ ] Open homepage and verify hero image and banner load without console errors.
- [ ] Perform phone number login / registration; verify session token stores in `localStorage`.
- [ ] Open `/vehicles`, filter by category, and click "Near Me (GPS)" to verify geolocation prompt.
- [ ] Click vehicle card and verify details, specifications, and reviews render.
- [ ] Click heart icon on vehicle card and verify item count updates in Navbar and `/wishlist`.
- [ ] Proceed to `/checkout`, input coupon code `WELCOME50`, and verify fare recalculates.
- [ ] Verify Razorpay modal triggers on payment proceed.
- [ ] Open `/my-bookings` and verify active, upcoming, and past reservations.
- [ ] Open `/active-rental/:id` and test 6-photo inspection checklist slots.
- [ ] Open `/support` and verify ticket creation form.
- [ ] Refresh page on any deep route (e.g. `/my-bookings/some-id`) and ensure no 404 occurs.
