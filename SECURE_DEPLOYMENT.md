# Secure Deployment Guidelines

This document outlines the procedures for executing a secure production deployment of the OS Lab Reference Platform on Cloudflare.

---

## Code Preparation and Compilation

To minimize package size and protect implementation integrity, source files must be compiled into clean, comment-free production documents.

### 1. Build Compilation
Run the local compiler utility:
```bash
npm run build
```
This utility:
- Cleans the `/dist` directory.
- Copies static reference pages and vendor libraries.
- Compiles the application stylesheet and controller scripts, stripping single-line (`//`) and block (`/* */`) comments.

### 2. Validation Checks
Ensure all files are structurally intact and contain no syntax conflicts:
```bash
node verify_project.js
```

---

## Deployment Configuration

Production deployment utilizes the configuration file located at `config/wrangler.toml`. This configuration directs Cloudflare to serve the compiled documents straight from the output directory without invoking external middleware.

### 1. Wrangler Target Parameters
Confirm the `wrangler.toml` file contains the following block:
```toml
name = "c-docs-app"
compatibility_date = "2026-07-19"

[assets]
directory = "./dist"
binding = "ASSETS"
```

### 2. Authentication and Push
Log in to your Cloudflare account and deploy the distribution assets:
```bash
npx wrangler login
npm run deploy
```

---

## Production Security Measures

### Cloudflare Edge Protection
- **HTTPS Enforcement**: All web traffic is routed over secure Transport Layer Security (TLS) protocol by default.
- **DDoS Mitigation**: Automated Layer 3/4/7 threat shielding handles resource exhaustion attacks at the Edge network interface.
- **Resource Boundary Isolation**: Compiled static assets reside in an isolated storage container, preventing arbitrary execution of server-side scripts.
