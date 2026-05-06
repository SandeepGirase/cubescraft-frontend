# Production Deployment Guide

## Prerequisites

- Node.js 16+ and npm 7+
- A backend API server running at the configured `VITE_API_BASE_URL`

## Environment Configuration

### 1. Create Production Environment File

Create `.env.production` file (or update the existing one):

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=error
VITE_ENABLE_CONSOLE_LOG=false
```

Replace `https://api.yourdomain.com/api` with your production API endpoint.

## Building for Production

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Run Linting

```bash
npm run lint
```

Fix any linting errors before proceeding.

### Step 3: Build the Application

```bash
npm run build
```

This will create an optimized production build in the `dist/` directory with:
- Minified JavaScript and CSS
- Code splitting for better caching
- Optimized vendor bundles
- Removed console logs and debuggers
- Hashed filenames for cache busting

### Step 4: Test the Production Build Locally

```bash
npm run preview
```

This starts a local preview server to test the production build before deployment.

## Deployment

### Static Hosting (Recommended)

For platforms like Netlify, Vercel, or AWS S3 + CloudFront:

1. Upload the `dist/` directory contents to your hosting provider
2. Configure the server to serve `index.html` for all routes (SPA routing)
3. Set appropriate cache headers:
   - `js/` and `css/` files: Long cache (1 year)
   - `index.html`: No cache (Cache-Control: no-cache)
   - Other assets: Medium cache (1 month)

### Docker Deployment

See `Dockerfile` and `docker-compose.yml` for containerized deployment.

## Security Checklist

- [ ] API endpoints use HTTPS only
- [ ] CORS is properly configured on the backend
- [ ] Authentication tokens are stored securely (HttpOnly cookies preferred)
- [ ] Environment variables are not exposed in the build
- [ ] CSP (Content Security Policy) headers are configured on the server
- [ ] HSTS (HTTP Strict Transport Security) is enabled
- [ ] Sensitive console logs are removed in production builds
- [ ] Error messages don't expose sensitive information

## Monitoring & Logging

### Error Tracking

Configure error tracking service (e.g., Sentry) in `src/utils/logger.js`:

```javascript
// In _sendToMonitoring method
import * as Sentry from "@sentry/react";

Sentry.captureException(error);
```

### Application Performance Monitoring

Add APM tools like New Relic, Datadog, or similar in `src/utils/logger.js`.

## Performance Optimization

### Check Build Size

```bash
npm run build -- --analyze
```

### Recommended Metrics

- **Largest JS Bundle:** < 500 KB (gzipped)
- **Largest CSS:** < 100 KB (gzipped)
- **First Contentful Paint (FCP):** < 2 seconds
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **Cumulative Layout Shift (CLS):** < 0.1

## Rollback Strategy

1. Keep previous `dist/` builds tagged with version numbers
2. Maintain git tags for each production release
3. Have a quick rollback procedure for critical issues

## Troubleshooting

### Build Fails
- Clear `node_modules/` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 16+)

### API Connection Issues
- Verify `VITE_API_BASE_URL` is correct
- Check CORS headers on backend
- Verify firewall/network access

### White Screen / 404 Errors
- Ensure server redirects all routes to `index.html`
- Check browser console for JavaScript errors
- Verify `dist/index.html` exists after build

## Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - name: Deploy
        run: |
          # Add your deployment command here
          # e.g., aws s3 sync dist/ s3://your-bucket/
```

## Support

For issues or questions, contact the development team or check the project repository.
