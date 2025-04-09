# BookMind AI Studio - Production Deployment Guide

## Overview
This document provides step-by-step instructions for deploying the BookMind AI Studio application to a production environment using Cloudflare Pages and D1 database.

## Prerequisites
- Cloudflare account with Pages and D1 access
- GitHub account for repository hosting
- Node.js 18+ installed locally for development and testing

## Step 1: Repository Setup

1. Create a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/bookmind-ai-studio.git
   git push -u origin main
   ```

2. Set up GitHub repository secrets:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages and D1 permissions
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## Step 2: Cloudflare Setup

1. Create a D1 database:
   ```bash
   wrangler d1 create bookmind_production
   ```
   - Note the database ID returned by this command

2. Update the `wrangler.toml` file with your production database ID:
   - Replace `${PRODUCTION_DB_ID}` with the actual database ID

3. Create a KV namespace for caching:
   ```bash
   wrangler kv:namespace create CACHE
   ```
   - Note the namespace ID returned by this command
   - Update the `wrangler.toml` file with your KV namespace ID

4. Create a Cloudflare Pages project:
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your GitHub repository
   - Configure build settings:
     - Framework preset: Next.js
     - Build command: `npm run build`
     - Build output directory: `.next`
     - Root directory: `/`
   - Add environment variables:
     - `NODE_ENV`: `production`
     - `OPENROUTER_API_KEY`: Your OpenRouter API key

## Step 3: Database Migration

1. Apply database migrations to production:
   ```bash
   wrangler d1 migrations apply bookmind_production --remote
   ```

2. Verify migrations were applied successfully:
   ```bash
   wrangler d1 execute bookmind_production --remote --command="SELECT name FROM sqlite_master WHERE type='table'"
   ```

## Step 4: Manual Deployment

For manual deployment (without GitHub Actions):

1. Build the application locally:
   ```bash
   npm run build
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   wrangler pages deploy .next --project-name=bookmind-ai-studio
   ```

## Step 5: Automated Deployment with GitHub Actions

The repository includes a GitHub Actions workflow file (`.github/workflows/deploy.yml`) that automates the deployment process:

1. Push changes to the main branch:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```

2. The GitHub Actions workflow will automatically:
   - Install dependencies
   - Build the application
   - Deploy to Cloudflare Pages
   - Apply database migrations

3. Monitor the deployment in GitHub:
   - Go to your GitHub repository → Actions tab
   - Click on the latest workflow run to see details

## Step 6: Post-Deployment Verification

1. Access your deployed application:
   - URL: `https://bookmind-ai-studio.pages.dev`
   - Verify all pages load correctly
   - Test core functionality

2. Check for any errors in Cloudflare logs:
   - Go to Cloudflare Dashboard → Pages → bookmind-ai-studio → Logs

3. Monitor application performance:
   - Go to Cloudflare Dashboard → Pages → bookmind-ai-studio → Analytics

## Step 7: Custom Domain Setup (Optional)

1. Add a custom domain to your Cloudflare Pages project:
   - Go to Cloudflare Dashboard → Pages → bookmind-ai-studio → Custom domains
   - Click "Set up a custom domain"
   - Enter your domain name and follow the instructions

2. Update environment variables with the new domain:
   - Go to Cloudflare Dashboard → Pages → bookmind-ai-studio → Settings → Environment variables
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in GitHub Actions or Cloudflare Pages
   - Verify all dependencies are correctly installed
   - Ensure environment variables are properly set

2. **Database Connection Issues**
   - Verify database ID in `wrangler.toml`
   - Check database permissions
   - Ensure migrations have been applied

3. **API Errors**
   - Check Cloudflare function logs
   - Verify API routes are correctly configured
   - Test endpoints with tools like Postman

## Maintenance

1. Regular updates:
   ```bash
   npm update
   git add .
   git commit -m "Update dependencies"
   git push origin main
   ```

2. Database backups:
   ```bash
   wrangler d1 backup bookmind_production --output=backup.sql
   ```

3. Monitoring:
   - Set up Cloudflare Analytics
   - Configure alerts for errors and performance issues

## Security Considerations

1. Keep API keys and secrets secure:
   - Use GitHub secrets for sensitive information
   - Never commit `.env` files to the repository

2. Regular security updates:
   - Keep dependencies updated
   - Apply security patches promptly

3. Access control:
   - Limit access to Cloudflare dashboard
   - Use strong passwords and 2FA

## Conclusion

Following this production deployment guide will ensure that the BookMind AI Studio application is properly deployed and configured for production use. The application is now ready to help independent authors and small publishers develop full-length non-fiction books using AI assistance.
