# os-uce — OS Lab Reference

An interactive, responsive C documentation and Linux command-line terminal simulator designed for Operating Systems lab programs at the University College of Engineering (UCE), Kariavattom.

> [!NOTE]
> This entire web application interface, documentation dataset, and terminal simulation engine was fully generated via **Antigravity** (Google DeepMind's Advanced Agentic Coding AI).

---

## Features
- **Tabbed Gedit & Terminal Workspace**: Simulates the exact workspace of the lab exam, comprising an interactive Ubuntu Bash Shell and a custom Gedit Editor (with dirty tab status tracking and compile-time warnings).
- **Interactive Compile & Run Buttons**: Allows quick compilation and execution shortcuts built directly into the terminal.
- **Syllabus-Aligned Experiments (18 Topics)**:
  - **System Calls**: Process creation (`fork`), loop execution, process overlay (`execv`), directory streaming (`opendir`/`readdir`), and metadata query (`stat`).
  - **IPC**: Shared Memory, Message Queue Chat.
  - **CPU Scheduling**: FCFS, SJF, Round Robin, and Priority Scheduling.
  - **Memory Allocation**: First Fit, Best Fit, and Worst Fit algorithms.
  - **Synchronization**: Producer-Consumer circular buffer.
  - **Page Replacement**: FIFO and LRU.
  - **Deadlock Avoidance**: Banker's safety algorithm.

---

## Deployment & Production Build

This repository is optimized for deployment on **Cloudflare Pages**. 

### 1. Security Headers and Rate Limiting
A custom serverless function middleware is provided at `functions/_middleware.js`. It runs in the Cloudflare Page environment to secure the application:
- **Bot Blocking**: Restricts automated scrape bots (curl, wget, selenium, scrapy, playwright).
- **IP-Based Token Bucket Rate Limiting**: Limit of 60 requests per minute per IP address with rotating salts to ensure anonymity.
- **CSP Hardening**: Inject security headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) to secure code inputs.
- **Header Anonymization**: Scrubs infrastructure disclosure headers (`Server`, `CF-Ray`, `X-Powered-By`).

### 2. Static Deploy Steps
1. Push the main branch to GitHub.
2. Link your GitHub repository to Cloudflare Pages.
3. Keep the **Build Command** blank, and set the **Build Directory** as the root directory `./` (pure HTML/CSS/JS frontend).
4. Cloudflare will automatically build, apply the functions middleware, and deploy the application.
