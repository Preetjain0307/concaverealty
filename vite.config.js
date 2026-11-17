import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sendOtpEmail, sendOtpWhatsApp, verifyOtpCode } from './server/otpService.js';
import {
  checkRateLimit,
  sanitizePayload,
  verifyWebhookSignature,
  ENTERPRISE_SECURITY_HEADERS,
  validateFileUpload,
  generatePresignedUrl,
  verifyPresignedToken,
  logAdminAction
} from './server/securityService.js';

// Allowed origins for strict CORS lockdown
const ALLOWED_ORIGINS = new Set([
  'https://concaverealty.com',
  'https://www.concaverealty.com',
  'http://localhost:5180',
  'http://localhost:5173',
  'http://127.0.0.1:5180',
  'http://127.0.0.1:5173'
]);

function enterpriseSecurityPlugin() {
  return {
    name: 'enterprise-security-plugin',
    configureServer(server) {
      // 1. Global Security Middleware (Headers, CORS Lockdown, Rate Limiting)
      server.middlewares.use((req, res, next) => {
        const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1').toString();
        const origin = req.headers.origin;

        // Apply Enterprise Security Headers
        Object.entries(ENTERPRISE_SECURITY_HEADERS).forEach(([header, val]) => {
          res.setHeader(header, val);
        });

        // Strict CORS Enforcement
        if (origin && ALLOWED_ORIGINS.has(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
          res.setHeader('Access-Control-Allow-Credentials', 'true');
        } else if (!origin) {
          // Same-origin request
          res.setHeader('Access-Control-Allow-Origin', '*');
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Webhook-Signature');
        res.setHeader('Access-Control-Max-Age', '86400');

        // Handle CORS Pre-flight
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        // Apply Sliding-Window Rate Limiting on /api/* routes
        if (req.url?.startsWith('/api/')) {
          const isAuthRoute = req.url.includes('otp') || req.url.includes('admin') || req.url.includes('auth');
          const maxReq = isAuthRoute ? 15 : 60; // Strict 15/min for auth, 60/min for others
          const rateCheck = checkRateLimit(clientIp, req.url.split('?')[0], maxReq, 60000);

          if (!rateCheck.allowed) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Retry-After', rateCheck.retryAfter.toString());
            res.end(JSON.stringify({
              error: 'Too Many Requests',
              reason: rateCheck.reason,
              message: rateCheck.message,
              retryAfter: rateCheck.retryAfter
            }));
            return;
          }
        }

        next();
      });

      // 2. POST /api/send-otp (Email Priority #1)
      server.middlewares.use('/api/send-otp', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const rawData = JSON.parse(body || '{}');
            const data = sanitizePayload(rawData); // Never trust frontend: deep sanitization
            const result = await sendOtpEmail(data);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ 
              success: false, 
              code: err.code || 'ERROR',
              remainingSeconds: err.remainingSeconds,
              message: err.message 
            }));
          }
        });
      });

      // 3. POST /api/send-whatsapp-otp (Alternative Option)
      server.middlewares.use('/api/send-whatsapp-otp', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const rawData = JSON.parse(body || '{}');
            const data = sanitizePayload(rawData);
            const result = await sendOtpWhatsApp(data);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ 
              success: false, 
              code: err.code || 'ERROR',
              remainingSeconds: err.remainingSeconds,
              message: err.message 
            }));
          }
        });
      });

      // 4. POST /api/verify-otp
      server.middlewares.use('/api/verify-otp', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const rawData = JSON.parse(body || '{}');
            const data = sanitizePayload(rawData);
            const result = verifyOtpCode(data);
            res.statusCode = result.success ? 200 : 400;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, message: err.message }));
          }
        });
      });

      // 5. POST /api/webhook (Timing-Safe Webhook Verification)
      server.middlewares.use('/api/webhook', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        const signature = req.headers['x-hub-signature-256'] || req.headers['x-webhook-signature'];
        const webhookSecret = process.env.WEBHOOK_SECRET || 'concave_webhook_secret_key_2026';

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          const isVerified = verifyWebhookSignature(body, signature, webhookSecret);
          if (!isVerified) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized: Invalid webhook signature' }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ received: true, status: 'verified' }));
        });
      });

      // 6. POST /api/vault/presign (Private Storage Presigned URL Generator)
      server.middlewares.use('/api/vault/presign', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        // Require Admin/Caller Auth Token Header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Unauthorized: Authentication required for vault access' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const { key, ttlSeconds } = JSON.parse(body || '{}');
            if (!key) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing object key' }));
              return;
            }
            const presigned = generatePresignedUrl(key, ttlSeconds || 300);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, ...presigned }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Vault token generation failed' }));
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), enterpriseSecurityPlugin()],
  // Turn off debug mode, console.log and debuggers in production builds
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none'
  },
  build: {
    sourcemap: false, // Prevent exposing source code in production
    chunkSizeWarningLimit: 1200
  },
  server: {
    port: 5180,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 5176,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
}));
