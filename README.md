# OS Lab Reference Platform

An interactive, responsive C documentation and Linux command-line terminal simulator designed for Operating Systems lab courses at the University College of Engineering (UCE).

---

## Directory Structure

This project conforms to the Universal Web Architecture layout:

```
├── config/
│   ├── build.js            # Custom static build and compilation utility
│   ├── wrangler.toml       # Cloudflare deployment configuration
│   ├── wrangler.jsonc      # Development schema specification
│   └── wrangler.secure.toml # Production secure deployment parameters
├── public/
│   ├── css2/               # Local font assets
│   ├── lib/                # Static vendor libraries (xterm.js, xterm-addon-fit.js)
│   ├── favicon.svg         # Site icon asset
│   └── marked.min.js       # Markdown parser library
├── src/
│   ├── components/
│   │   └── style.css       # Core layout and component styles
│   ├── core/
│   │   ├── app.js          # Terminal and interface controller logic
│   │   ├── compiler.js     # Simulated C compiler and analyzer
│   │   ├── data.js         # Syllabus topic definitions
│   │   └── docs_content.js # Markdown documentation data source
│   ├── middleware/
│   │   └── _middleware.js  # Serverless edge function routing
│   └── pages/
│       ├── index.html      # Main application page
│       └── docs/           # Individual syllabus reference files
├── dist/                   # Compiled production-ready distribution (build target)
├── package.json            # Node project configuration and script definitions
└── verify_project.js       # Automated validation script
```

---

## Local Development

Follow these steps to set up and preview the project locally:

### 1. Installation
Install the required development tools and dependencies:
```bash
npm install
```

### 2. Build Generation
Compile, clean, and bundle the assets into the distribution directory (`/dist`):
```bash
npm run build
```
This utility removes comments, handles whitespace compression, and copies resources from the development folders into the distribution package.

### 3. Local Preview
Start the local HTTP preview server:
```bash
npm run dev
```
Navigate to `http://localhost:8000` in your browser to inspect the application.

### 4. Code Validation
Run the test suite to verify script ordering, syntax cleanliness, and structural alignment:
```bash
node verify_project.js
```

---

## Production Deployment

This project is configured to deploy as a static site via Cloudflare Pages or Cloudflare Workers Assets.

### 1. Build Verification
Ensure the distribution folder is populated with clean assets by running:
```bash
npm run build
```

### 2. Deployment Command
Deploy to Cloudflare using the Wrangler CLI:
```bash
npm run deploy
```
Wrangler will load the configuration from `config/wrangler.toml` and synchronize the `./dist` directory contents directly to the edge network.
