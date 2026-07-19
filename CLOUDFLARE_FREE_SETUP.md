# Cloudflare Workers Free Tier Setup Guide

This document describes how to configure the OS Lab Reference Platform to host on the Cloudflare Free Tier using GitHub Actions.

---

## Capabilities and Limits

The Cloudflare Free Tier provides:
- **100,000 requests per day**: Sufficient for active classroom lab use.
- **Global CDN caching**: High-speed edge distribution for assets.
- **Static Asset Serving**: High reliability and low latency serving.

---

## GitHub Actions Automated Deployment

You can automate deployments so that pushing code changes to GitHub triggers a build and publishes to Cloudflare.

### Step 1: Configure Repository Secrets
In your GitHub repository settings, navigate to **Settings > Secrets and variables > Actions** and define the following repository secrets:
- `CLOUDFLARE_API_TOKEN`: An API token created from the Cloudflare Dashboard with permission to edit Workers.
- `CLOUDFLARE_ACCOUNT_ID`: The Account ID retrieved from your Cloudflare Dashboard.

### Step 2: Push Configuration
Commit and push files to GitHub. The workflow file located at `.github/workflows/deploy.yml` handles the pipeline automation steps:
1. Runs `npm install` to download build dependencies.
2. Runs `npm run build` to compile comment-free assets to the `/dist` directory.
3. Uses the Wrangler Action to deploy the `./dist` folder content to Cloudflare.
