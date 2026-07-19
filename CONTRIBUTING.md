# Contributing Guidelines

Thank you for your interest in contributing to the OS Lab Reference Platform.

---

## Code of Conduct

We request that all contributors maintain professional, respectful communication and collaboration practices in all project spaces.

---

## Directory Architecture

This repository uses a structured Universal Web Architecture. When making changes, please ensure files are placed in their respective locations:

*   `/src/pages/` - HTML layout views and syllabus docs directories.
*   `/src/components/` - Styling modules and layout stylesheets.
*   `/src/core/` - Business logic, controllers, and C compiler simulator engines.
*   `/public/` - Static third-party assets and fonts.
*   `/config/` - Project build scripts and deployment manifests.

---

## Local Development Workflow

Follow these steps to develop, compile, and validate changes locally:

### 1. Setup
Install project dependencies:
```bash
npm install
```

### 2. Implementation & Compilation
After updating source files, run the build compiler to bundle assets into the distribution package (`/dist`):
```bash
npm run build
```

### 3. Local Preview
Test your modifications using the local Python server:
```bash
npm run dev
```
Open `http://localhost:8000` to review the rendered application interface.

### 4. Code Validation
Ensure all automated syntax, script loading, and variables cleanup validations pass without errors:
```bash
node verify_project.js
```

---

## Submitting Pull Requests

1. Fork the repository and create a feature branch off `main`.
2. Implement your changes, keeping coding style clean, standard, and comment-friendly in source files.
3. Verify that `npm run build` succeeds and `node verify_project.js` reports zero failures.
4. Commit your changes with descriptive, conventional commit messages.
5. Push to your fork and submit a Pull Request.
