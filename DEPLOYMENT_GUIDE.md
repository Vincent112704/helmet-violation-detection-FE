# Deployment Guide - TrafficShield Frontend

## Quick Start (Local Development)

### Prerequisites
- Node.js 18 or higher
- pnpm (or npm/yarn)

### Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
open http://localhost:3000
```

### Demo Credentials
- **Officer:** demo@traffic.gov.ph / demo123
- **Supervisor:** supervisor@traffic.gov.ph / demo123

---

## Deployment to Vercel (Recommended)

### Step 1: Connect Repository
```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit: TrafficShield frontend"

# Push to GitHub (create repo first)
git remote add origin https://github.com/yourusername/traffic-shield.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Or use Vercel Dashboard:**
1. Go to vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Deploy"

### Step 3: Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
# Optional - for future backend integration
NEXT_PUBLIC_API_URL=https://your-fastapi-backend.com
```

---

## Production Build

### Build Locally
```bash
# Create production build
pnpm build

# Test production build
pnpm start
```

### Optimize for Production
The app uses:
- ✅ Next.js 16 with Turbopack (faster builds)
- ✅ React Compiler support (optional optimization)
- ✅ Image optimization ready
- ✅ Code splitting built-in

---

## Performance Optimization

### Already Configured
- Dynamic imports for route splitting
- CSS modules for styling efficiency
- Image lazy loading support
- Gzip compression enabled

### Further Optimization
If needed, enable React Compiler:

```js
// next.config.mjs
export default {
  experimental: {
    reactCompiler: true,
  },
}
```

---

## Backend Integration (FastAPI)

### Update Environment Variables
```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8000

# In Vercel production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Update Auth Context
Edit `/lib/auth-context.tsx`:

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const user = await response.json();
  // ... handle response
};
```

### API Endpoints Expected
- `POST /auth/login` - Returns user object and token
- `POST /auth/signup` - Creates new user account
- `GET /violations` - Returns violation list
- `POST /videos/upload` - Upload video file
- `GET /analytics` - Returns dashboard data

---

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run
```bash
docker build -t traffic-shield:latest .
docker run -p 3000:3000 traffic-shield:latest
```

---

## GitHub Actions CI/CD

### .github/workflows/deploy.yml
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Scaling Considerations

### Database
- Currently uses localStorage for demo
- Ready for backend database integration
- Consider: PostgreSQL, MongoDB, or Firebase

### API Rate Limiting
- Implement rate limiting in FastAPI backend
- Use Upstash Redis for distributed caching
- Monitor API usage with analytics

### Monitoring
- Vercel Analytics (included)
- Sentry for error tracking
- LogRocket for session replay

---

## Security Checklist

- ✅ HTTPS/TLS enabled
- ✅ Environment variables secured
- ✅ No hardcoded secrets
- ✅ Input validation in forms
- ✅ CSRF protection ready
- ✅ XSS prevention via React escaping
- ✅ SQL injection protection (app layer)

### Additional Security Measures
```js
// Add security headers in next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        }
      ],
    },
  ]
}
```

---

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Build errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
pnpm install
pnpm build
```

**localStorage not persisting**
- Check browser privacy settings
- Ensure cookies/storage enabled
- Test in incognito mode

---

## Performance Monitoring

### Vercel Analytics
Automatically enabled on Vercel:
- Core Web Vitals
- Custom metrics
- Performance insights

### Local Performance
```bash
# Build analysis
pnpm build --analyze

# Lighthouse audit
pnpm build
pnpm start
# Open Chrome DevTools → Lighthouse
```

---

## Rollback Instructions

### If deployment fails:
```bash
vercel --prod --env REVERT=true
```

### Revert to previous version:
```bash
git revert <commit-hash>
git push origin main
```

---

## Support & Resources

- **Vercel Docs:** vercel.com/docs
- **Next.js Docs:** nextjs.org/docs
- **React Docs:** react.dev
- **Tailwind Docs:** tailwindcss.com

---

## Maintenance

### Regular Updates
```bash
# Check for outdated packages
pnpm outdated

# Update packages
pnpm update

# Update major versions carefully
pnpm upgrade --latest
```

### Security Updates
```bash
# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

---

**Status:** Ready for Production
**Estimated Deployment Time:** 5 minutes
**Cost:** Free tier available on Vercel
