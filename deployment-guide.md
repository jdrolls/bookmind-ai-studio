# BookMind AI Studio - Deployment Guide

## Overview
This document outlines the deployment process for the BookMind AI Studio application, a Next.js application designed to help independent authors and small publishers develop full-length non-fiction books using AI assistance.

## Prerequisites
- Node.js 18+ installed
- Access to Cloudflare account (for Cloudflare Pages deployment)
- Git repository for version control

## Configuration Updates

### 1. Update Next.js Configuration
To ensure the application works properly when deployed, update the `next.config.ts` file:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Cloudflare Pages
  output: 'standalone',
  
  // Configure allowed hosts
  experimental: {
    serverComponentsExternalPackages: ['@opennextjs/cloudflare'],
  },
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 2. Update Database Configuration
Ensure the database connection is properly configured for production:

1. Update the `wrangler.toml` file to include production database bindings:

```toml
name = "bookmind-ai-studio"
compatibility_date = "2023-12-01"

[[d1_databases]]
binding = "DB"
database_name = "bookmind_production"
database_id = "your-database-id"
```

2. Apply database migrations to production:

```bash
wrangler d1 migrations apply DB --remote
```

## Build Process

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Test the production build locally:
```bash
npm run start
```

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

1. Connect your Git repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Node.js version: 18+
3. Configure environment variables:
   - `NODE_ENV=production`
4. Deploy the application

### Option 2: Static Export

For simpler hosting options:

1. Update `next.config.ts` to use static export:
```typescript
const nextConfig = {
  output: 'export',
  // other configurations...
};
```

2. Build the static export:
```bash
npm run build
```

3. The static files will be in the `out` directory, which can be deployed to any static hosting service.

## Post-Deployment Steps

1. Verify the application is working correctly
2. Set up custom domain (if applicable)
3. Configure SSL certificates
4. Set up monitoring and analytics

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify database credentials
   - Check network connectivity
   - Ensure database migrations have been applied

2. **API Endpoint Errors**
   - Check server logs
   - Verify API routes are correctly configured
   - Test endpoints with tools like Postman

3. **Static Asset Loading Issues**
   - Check path configurations
   - Verify assets are included in the build

## Maintenance

1. Regular updates:
   - Keep dependencies updated
   - Apply security patches

2. Database maintenance:
   - Regular backups
   - Performance optimization

3. Monitoring:
   - Set up uptime monitoring
   - Configure error tracking

## Conclusion

Following this deployment guide will ensure that the BookMind AI Studio application is properly configured and deployed for production use. The application provides a comprehensive solution for authors to develop full-length non-fiction books using AI assistance.
