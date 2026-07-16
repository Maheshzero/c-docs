document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. CONFIGURATION & STATIC DICTIONARIES
  // =========================================================================
  const Config = {
    topicFilenames: {
      "fork-basic": "fork_basic.c",
      "fork-loop": "fork_loop.c",
      "execv-call": "second.c",
      "dir-search": "dir_search.c",
      "file-stat": "file_stat.c",
      "shm-even-odd": "reader.c",
      "msg-queue": "client.c",
      "fcfs-sched": "fcfs_sched.c",
      "sjf-sched": "sjf_sched.c",
      "rr-sched": "rr_sched.c",
      "priority-sched": "priority_sched.c",
      "first-fit": "first_fit.c",
      "best-fit": "best_fit.c",
      "worst-fit": "worst_fit.c",
      "prod-cons": "prod_cons.c",
      "fifo-page": "fifo_page.c",
      "lru-page": "lru_page.c",
      "bankers": "bankers.c"
    },

    topicCrossLinks: {
      "fork-basic": [
        { phrase: "fork() with Loop",  target: "fork-loop" },
        { phrase: "execv()",           target: "execv-call" }
      ],
      "fork-loop": [
        { phrase: "Basic fork()",      target: "fork-basic" },
        { phrase: "Round Robin",       target: "rr-sched" },
        { phrase: "execv()",           target: "execv-call" }
      ],
      "execv-call": [
        { phrase: "fork()",            target: "fork-basic" }
      ],
      "dir-search": [
        { phrase: "File stat()",       target: "file-stat" },
        { phrase: "stat()",            target: "file-stat" }
      ],
      "file-stat": [
        { phrase: "opendir()",         target: "dir-search" },
        { phrase: "Directory Search",  target: "dir-search" }
      ],
      "fcfs-sched": [
        { phrase: "Shortest Job First", target: "sjf-sched" },
        { phrase: "Round Robin",        target: "rr-sched" },
        { phrase: "Priority Scheduling",target: "priority-sched" },
        { phrase: "SJF",               target: "sjf-sched" }
      ],
      "sjf-sched": [
        { phrase: "Priority Scheduling", target: "priority-sched" },
        { phrase: "Round Robin",         target: "rr-sched" },
        { phrase: "aging",               target: "priority-sched" },
        { phrase: "FCFS",               target: "fcfs-sched" }
      ],
      "rr-sched": [
        { phrase: "Priority",           target: "priority-sched" },
        { phrase: "FCFS",              target: "fcfs-sched" },
        { phrase: "SJF",               target: "sjf-sched" }
      ],
      "priority-sched": [
        { phrase: "Round Robin",        target: "rr-sched" },
        { phrase: "FCFS",              target: "fcfs-sched" },
        { phrase: "SJF",               target: "sjf-sched" }
      ],
      "shm-even-odd": [
        { phrase: "Message Queue",      target: "msg-queue" },
        { phrase: "Producer-Consumer",  target: "prod-cons" }
      ],
      "msg-queue": [
        { phrase: "Shared Memory",      target: "shm-even-odd" },
        { phrase: "Producer-Consumer",  target: "prod-cons" }
      ],
      "prod-cons": [
        { phrase: "Shared Memory",      target: "shm-even-odd" },
        { phrase: "Message Queue",      target: "msg-queue" },
        { phrase: "shmget",             target: "shm-even-odd" }
      ],
      "first-fit": [
        { phrase: "Best Fit",           target: "best-fit" },
        { phrase: "Worst Fit",          target: "worst-fit" }
      ],
      "best-fit": [
        { phrase: "First Fit",          target: "first-fit" },
        { phrase: "Worst Fit",          target: "worst-fit" }
      ],
      "worst-fit": [
        { phrase: "First Fit",          target: "first-fit" },
        { phrase: "Best Fit",           target: "best-fit" }
      ],
      "fifo-page": [
        { phrase: "LRU",               target: "lru-page" }
      ],
      "lru-page": [
        { phrase: "FIFO",              target: "fifo-page" }
      ]
    },

    syntaxCrossLinks: [
      { token: "fork()",   cardId: "section-5-posix-system-calls-functions" },
      { token: "execv()",  cardId: "section-5-posix-system-calls-functions" },
      { token: "shmget()", cardId: "section-5-posix-system-calls-functions" },
      { token: "shmat()",  cardId: "section-5-posix-system-calls-functions" },
      { token: "stat()",   cardId: "section-5-posix-system-calls-functions" }
    ],

    relatedTopicsMap: {
      "fork-basic":     [ { id: "fork-loop",      label: "fork() with Loop" },
                          { id: "execv-call",     label: "execv() Call" } ],
      "fork-loop":      [ { id: "fork-basic",     label: "Basic fork()" },
                          { id: "rr-sched",       label: "Round Robin" } ],
      "execv-call":     [ { id: "fork-basic",     label: "Basic fork()" } ],
      "dir-search":     [ { id: "file-stat",      label: "File stat()" } ],
      "file-stat":      [ { id: "dir-search",     label: "Directory Search" } ],
      "fcfs-sched":     [ { id: "sjf-sched",      label: "SJF Scheduling" },
                          { id: "rr-sched",       label: "Round Robin" },
                          { id: "priority-sched", label: "Priority Scheduling" } ],
      "sjf-sched":      [ { id: "fcfs-sched",     label: "FCFS Scheduling" },
                          { id: "rr-sched",       label: "Round Robin" },
                          { id: "priority-sched", label: "Priority Scheduling" } ],
      "rr-sched":       [ { id: "fcfs-sched",     label: "FCFS Scheduling" },
                          { id: "sjf-sched",      label: "SJF Scheduling" },
                          { id: "priority-sched", label: "Priority Scheduling" } ],
      "priority-sched": [ { id: "fcfs-sched",     label: "FCFS Scheduling" },
                          { id: "sjf-sched",      label: "SJF Scheduling" },
                          { id: "rr-sched",       label: "Round Robin" } ],
      "shm-even-odd":   [ { id: "msg-queue",      label: "Message Queue" },
                          { id: "prod-cons",      label: "Producer-Consumer" } ],
      "msg-queue":      [ { id: "shm-even-odd",   label: "Shared Memory" },
                          { id: "prod-cons",      label: "Producer-Consumer" } ],
      "prod-cons":      [ { id: "shm-even-odd",   label: "Shared Memory" },
                          { id: "msg-queue",      label: "Message Queue" } ],
      "first-fit":      [ { id: "best-fit",       label: "Best Fit" },
                          { id: "worst-fit",      label: "Worst Fit" } ],
      "best-fit":       [ { id: "first-fit",      label: "First Fit" },
                          { id: "worst-fit",      label: "Worst Fit" } ],
      "worst-fit":      [ { id: "first-fit",      label: "First Fit" },
                          { id: "best-fit",       label: "Best Fit" } ],
      "fifo-page":      [ { id: "lru-page",       label: "LRU Page Replacement" } ],
      "lru-page":       [ { id: "fifo-page",      label: "FIFO Page Replacement" } ]
    }
  };

  // =========================================================================
  // 1.5 NOTIFICATION & INPUT VALIDATION SYSTEM
  // =========================================================================
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `;
    
    if (type === "error") {
      notification.style.background = "#ef4444";
      notification.style.color = "#fff";
    } else if (type === "success") {
      notification.style.background = "#10b981";
      notification.style.color = "#fff";
    } else {
      notification.style.background = "#3b82f6";
      notification.style.color = "#fff";
    }
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }

  function validateStdinInput(input, expectedType = "string") {
    input = input.trim();
    
    if (expectedType === "int" || expectedType === "integer") {
      if (!/^-?\d+$/.test(input)) {
        return { valid: false, error: "Expected an integer, got: '" + input + "'" };
      }
      return { valid: true, value: parseInt(input) };
    }
    
    if (expectedType === "float" || expectedType === "double") {
      if (!/^-?\d*\.?\d+$/.test(input)) {
        return { valid: false, error: "Expected a decimal number, got: '" + input + "'" };
      }
      return { valid: true, value: parseFloat(input) };
    }
    
    return { valid: true, value: input };
  }

  function detectInputTypeFromCode(code) {
    const nextScanf = code.match(/scanf\s*\(\s*"([^"]+)"/);
    if (!nextScanf) return "string";
    
    const format = nextScanf[1];
    if (format.includes("%d") || format.includes("%i")) return "int";
    if (format.includes("%f") || format.includes("%lf")) return "float";
    if (format.includes("%s")) return "string";
    
    return "string";
  }

  // =========================================================================
  // 2. CENTRAL STATE MANAGER
  // =========================================================================
  const State = {
    activeTopicId: "fork-basic",
    activeWorkspaceTab: "terminal",
    workspacePanelCollapsed: false,
    activeFilename: "fork_basic.c",

    // Virtual Filesystem (VFS)
    virtualFS: {},
    savedCode: {},
    isCompiled: {},
    compiledBinarySource: "",
    binarySourceMap: {},

    // Terminal session data
    terminalUsername: "guest",
    terminalHostname: "uce",
    terminalIsInteractive: false,
    activePromptCallback: null,
    commandHistory: [],
    historyIndex: -1,

    getTopicFilename(topic) {
      if (!topic) return "program.c";
      return Config.topicFilenames[topic.id] || (topic.title.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".c");
    },

    isSyllabusTopicFile(filename) {
      return Object.values(Config.topicFilenames).includes(filename) || 
             filename === "first.c" || filename === "writer.c";
    },

    extractFilesFromCode(code) {
      if (!code) return null;
      const files = {};
      const regex = /\/\/\s*---\s*([a-zA-Z0-9_\-\.]+)\s*---\r?\n([\s\S]*?)(?=\/\/\s*---\s*[a-zA-Z0-9_\-\.]+\s*---\r?\n|$)/g;
      let match;
      let found = false;
      while ((match = regex.exec(code)) !== null) {
        found = true;
        State.virtualFS[match[1]] = ""; // ensure entry exists in VFS schema mapping
        files[match[1]] = match[2].trim();
      }
      if (!found) return null;
      return files;
    },

    initVFS() {
      topicsData.forEach(topic => {
        this.savedCode[topic.id] = topic.code;
        this.isCompiled[topic.id] = false;
        
        const splitFiles = this.extractFilesFromCode(topic.code);
        if (splitFiles) {
          Object.entries(splitFiles).forEach(([fn, content]) => {
            this.virtualFS[fn] = "";
          });
        } else {
          const filename = this.getTopicFilename(topic);
          this.virtualFS[filename] = "";
        }
      });
      this.loadVfsFromLocalStorage();
    },

    loadVfsFromLocalStorage() {
      try {
        const storedVfs = JSON.parse(localStorage.getItem("vfs") || "{}");
        Object.entries(storedVfs).forEach(([name, content]) => {
          this.virtualFS[name] = content;
        });
      } catch (e) {
        console.error("Failed to load VFS state from localStorage:", e);
        showNotification("⚠️ Could not restore previous session", "error");
      }
    },

    saveVfsToLocalStorage() {
      try {
        localStorage.setItem("vfs", JSON.stringify(this.virtualFS));
      } catch (e) {
        console.error("Failed to save VFS state to localStorage:", e);
        showNotification("⚠️ Your changes may not be saved (storage quota exceeded)", "error");
      }
    }
  };

  // --- Initialize Central VFS immediately ---
  State.initVFS();

  // =========================================================================
  // 3. DOM ELEMENT CACHE
  // =========================================================================
  const DOM = {
    sidebarMenu: document.getElementById("sidebar-menu-list"),
    docCategory: document.getElementById("doc-category"),
    docTitle: document.getElementById("doc-title"),
    docDesc: document.getElementById("doc-description"),
    docBody: document.getElementById("doc-body"),
    docCodeFilename: document.getElementById("doc-code-filename"),
    copyBtn: document.getElementById("copy-code-btn"),
    compatibilityAlert: document.getElementById("compatibility-alert"),
    warningText: document.getElementById("warning-text"),
    mobileActiveTopic: document.getElementById("mobile-active-topic"),
    floatingCodeBtn: document.getElementById("floating-code-btn"),
    docCodeWrapper: document.getElementById("doc-code-wrapper"),
    docCodeContainer: document.getElementById("doc-code-container"),
    docPanel: document.getElementById("doc-panel"),
    
    // Workspace tabs and views
    workspaceTabTerminal: document.getElementById("workspace-tab-terminal"),
    workspaceTabGedit: document.getElementById("workspace-tab-gedit"),
    viewTerminal: document.getElementById("view-terminal"),
    viewGedit: document.getElementById("view-gedit"),
    geditFilenameTab: document.getElementById("gedit-filename-tab"),
    geditSaveBtn: document.getElementById("gedit-save-btn"),
    editorTextarea: document.getElementById("editor-textarea"),
    
    // Terminal elements
    terminalLines: document.getElementById("terminal-lines"),
    terminalInput: document.getElementById("terminal-input"),
    terminalPromptLabel: document.getElementById("terminal-prompt-label"),
    terminalShell: document.getElementById("terminal-shell"),
    
    // Triggers and panels
    compileTriggerBtn: document.getElementById("compile-trigger-btn"),
    workspaceToggleBtn: document.getElementById("workspace-toggle-btn"),
    rightPanel: document.getElementById("right-panel"),
    themeToggleBtn: document.getElementById("theme-toggle-btn"),
    
    // Mobile controls
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    mobileTerminalToggle: document.getElementById("mobile-terminal-toggle"),
    mobileTabDocs: document.getElementById("mobile-tab-docs"),
    mobileTabIde: document.getElementById("mobile-tab-ide"),
    sidebarBackdrop: document.getElementById("sidebar-backdrop")
  };

  // =========================================================================
  // 4. UI RENDERER CONTROLLER
  // =========================================================================
  const UIManager = {
    escapeHTML(str) {
      return str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
    },

    setupMarkedRenderer() {
      if (window.marked) {
        const renderer = new marked.Renderer();
        renderer.heading = function(text, level) {
          const slug = text.toLowerCase().replace(/[^a-z0-9_]+/g, "-").replace(/(^-|-$)/g, "");
          if (text.includes("id=")) {
            const idMatch = text.match(/id="([^"]+)"/);
            const cleanText = text.replace(/<a[^>]+>.*?<\/a>/g, "").trim();
            const idAttr = idMatch ? idMatch[1] : slug;
            return `<h${level} id="${idAttr}">${cleanText}</h${level}>`;
          }
          return `<h${level} id="${slug}">${text}</h${level}>`;
        };
        marked.setOptions({ renderer: renderer });
      }
    },

    populateSidebar() {
      const categories = {};
      topicsData.forEach(topic => {
        if (!categories[topic.category]) {
          categories[topic.category] = [];
        }
        categories[topic.category].push(topic);
      });

      let menuHTML = "";
      for (const cat in categories) {
        menuHTML += `<div class="menu-category">${cat}</div>`;
        categories[cat].forEach(topic => {
          menuHTML += `
            <a href="#" class="menu-item ${topic.id === State.activeTopicId ? 'active' : ''}" data-id="${topic.id}">
              ${topic.title}
            </a>
          `;
        });
      }

      menuHTML += `
        <div class="menu-category">Help &amp; Reference</div>
        <a href="#" class="menu-item ${State.activeTopicId === 'help-guide' ? 'active' : ''}" data-id="help-guide">Student Guide</a>
        <a href="#" class="menu-item ${State.activeTopicId === 'c-syntaxes' ? 'active' : ''}" data-id="c-syntaxes">C Syntaxes</a>
      `;

      DOM.sidebarMenu.innerHTML = menuHTML;

      // Attach click events to items
      document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const topicId = e.target.getAttribute("data-id");
          this.selectTopic(topicId);
          this.closeSidebarDrawer();
        });
      });
    },

    renderCodeLines(codeText) {
      if (!DOM.docCodeContainer) return;
      DOM.docCodeContainer.innerHTML = "";
      
      const lines = codeText.split("\n");
      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const row = document.createElement("div");
        row.className = "code-line-row";
        row.id = `line-L${lineNum}`;
        
        const numSpan = document.createElement("span");
        numSpan.className = "code-line-number";
        numSpan.innerText = lineNum;
        
        const codeSpan = document.createElement("span");
        codeSpan.className = "code-line-text";
        codeSpan.innerText = line;
        
        row.appendChild(numSpan);
        row.appendChild(codeSpan);
        DOM.docCodeContainer.appendChild(row);
      });
    },

    fetchAndRenderMarkdown(topicId) {
      const docMdContainer = document.getElementById("doc-markdown-content");
      docMdContainer.innerHTML = `<div class="doc-loading">Loading documentation...</div>`;
      
      let markdownText = docsContent[topicId] || "";
      if (markdownText) {
        markdownText = markdownText.replace(/^#\s+.+$/m, "");

        let renderedHtml = "";
        if (window.marked && window.marked.parse) {
          renderedHtml = window.marked.parse(markdownText);
        } else {
          renderedHtml = `<pre style="white-space: pre-wrap;">${this.escapeHTML(markdownText)}</pre>`;
        }
        
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = renderedHtml;
        
        const finalWrapper = document.createElement("div");
        finalWrapper.className = "doc-sections-wrapper";

        function cardTypeFromHeading(text) {
          const t = text.toLowerCase();
          if (t.includes("what is") || t.startsWith("what")) return "card-what";
          if (t.includes("where") || t.includes("fit")) return "card-where";
          if (t.includes("algorithm") || t.includes("how does") || t.includes("plain steps")) return "card-how";
          if (t.includes("why c") || t.includes("why does c") || t.includes("different")) return "card-why";
          if (t.includes("implementation") || t.includes("compile") || t.includes("guide")) return "card-impl";
          if (t.includes("reference") || t.includes("documentation") || t.includes("official")) return "card-ref";
          return "card-default";
        }
        
        let currentCard = null;
        Array.from(tempDiv.children).forEach(child => {
          if (child.tagName === 'H2' || child.tagName === 'H1') {
            currentCard = document.createElement("div");
            const typeClass = cardTypeFromHeading(child.textContent || "");
            currentCard.className = `doc-section-card ${typeClass}`;
            if (child.id) currentCard.id = `section-${child.id}`;
            finalWrapper.appendChild(currentCard);
          }
          if (currentCard) {
            currentCard.appendChild(child);
          } else {
            const introCard = document.createElement("div");
            introCard.className = "doc-section-card card-what";
            introCard.appendChild(child);
            finalWrapper.appendChild(introCard);
            currentCard = introCard;
          }
        });

        // Inject cross-topic links
        const links = Config.topicCrossLinks[topicId] || [];
        if (links.length > 0) {
          const walker = document.createTreeWalker(
            finalWrapper,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode(node) {
                let p = node.parentElement;
                while (p && p !== finalWrapper) {
                  const tag = p.tagName.toUpperCase();
                  if (tag === 'CODE' || tag === 'PRE' || tag === 'A') return NodeFilter.FILTER_REJECT;
                  p = p.parentElement;
                }
                return NodeFilter.FILTER_ACCEPT;
              }
            }
          );

          const textNodes = [];
          let n;
          while ((n = walker.nextNode())) textNodes.push(n);

          const sortedLinks = [...links].sort((a, b) => b.phrase.length - a.phrase.length);
          const escapedPhrases = sortedLinks.map(l =>
            l.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          );
          const re = new RegExp(`(${escapedPhrases.join('|')})`, 'g');

          textNodes.forEach(textNode => {
            const orig = textNode.nodeValue;
            if (!re.test(orig)) return;
            re.lastIndex = 0;

            const frag = document.createDocumentFragment();
            let lastIdx = 0;
            let m;
            re.lastIndex = 0;
            while ((m = re.exec(orig)) !== null) {
              if (m.index > lastIdx) {
                frag.appendChild(document.createTextNode(orig.slice(lastIdx, m.index)));
              }
              const matchedPhrase = m[0];
              const linkDef = sortedLinks.find(l => l.phrase === matchedPhrase);
              if (linkDef) {
                const a = document.createElement("a");
                a.className = "doc-crosslink";
                a.textContent = matchedPhrase;
                a.dataset.topicTarget = linkDef.target;
                a.title = `Go to: ${linkDef.target.replace(/-/g, ' ')}`;
                frag.appendChild(a);
              } else {
                frag.appendChild(document.createTextNode(matchedPhrase));
              }
              lastIdx = m.index + m[0].length;
            }
            if (lastIdx < orig.length) {
              frag.appendChild(document.createTextNode(orig.slice(lastIdx)));
            }
            textNode.parentNode.replaceChild(frag, textNode);
          });
        }

        // Inject syntax cross-links
        finalWrapper.querySelectorAll("code").forEach(codeEl => {
          if (codeEl.closest("pre")) return;
          const text = codeEl.textContent.trim();
          const match = Config.syntaxCrossLinks.find(s => text === s.token);
          if (match) {
            const a = document.createElement("a");
            a.className = "syntax-crosslink";
            a.textContent = text;
            a.dataset.syntaxCard = match.cardId;
            a.title = `View syntax: ${text}`;
            codeEl.parentNode.replaceChild(a, codeEl);
          }
        });

        // Append Related Topics Bar to bottom of doc-body
        const related = Config.relatedTopicsMap[topicId];
        if (related && related.length > 0) {
          const bar = document.createElement("div");
          bar.className = "related-topics-bar";
          const label = document.createElement("span");
          label.className = "related-topics-label";
          label.textContent = "See also";
          bar.appendChild(label);

          related.forEach(rel => {
            const chip = document.createElement("button");
            chip.className = "topic-chip";
            chip.textContent = rel.label;
            chip.dataset.topicTarget = rel.id;
            chip.title = `Navigate to ${rel.label}`;
            bar.appendChild(chip);
          });
          finalWrapper.appendChild(bar);
        }
        
        docMdContainer.innerHTML = "";
        docMdContainer.appendChild(finalWrapper);
      } else {
        const matchingTopic = topicsData.find(t => t.id === topicId);
        if (matchingTopic) {
          docMdContainer.innerHTML = `
            <div class="doc-section-card">
              <h2>Overview</h2>
              <p>${this.escapeHTML(matchingTopic.description)}</p>
            </div>
          `;
        } else {
          docMdContainer.innerHTML = `<div class="doc-loading">No documentation content found.</div>`;
        }
      }
    },

    selectTopic(topicId, restoreScrollTop) {
      State.activeTopicId = topicId;

      document.querySelectorAll(".menu-item").forEach(item => {
        if (item.getAttribute("data-id") === topicId) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });

      const isHelpFile = (topicId === "help-guide" || topicId === "c-syntaxes");

      if (isHelpFile) {
        DOM.docCategory.innerText = "Reference";
        DOM.docTitle.innerText = (topicId === "help-guide") ? "Student Guide" : "C Syntaxes";
        DOM.docDesc.innerText = (topicId === "help-guide") ? "Platform usage instructions." : "C Language loops, structs, and pointers.";
        
        if (DOM.mobileActiveTopic) {
          DOM.mobileActiveTopic.innerText = (topicId === "help-guide") ? "Student Guide" : "C Syntaxes";
        }

        this.fetchAndRenderMarkdown(topicId);
        DOM.docCodeWrapper.style.display = "none";
        DOM.floatingCodeBtn.style.display = "none";
      } else {
        const topic = topicsData.find(t => t.id === topicId);
        if (!topic) return;

        DOM.docCategory.innerText = topic.category;
        DOM.docTitle.innerText = topic.title;
        DOM.docDesc.innerText = topic.description;

        if (DOM.mobileActiveTopic) {
          DOM.mobileActiveTopic.innerText = topic.title;
        }

        this.fetchAndRenderMarkdown(topicId);
        DOM.docCodeWrapper.style.display = "block";
        DOM.floatingCodeBtn.style.display = "flex";

        const filename = State.getTopicFilename(topic);
        DOM.docCodeFilename.innerText = filename;
        this.renderCodeLines(State.savedCode[topicId]);

        State.activeFilename = filename;
        const currentEditorFile = DOM.geditFilenameTab.textContent.replace(/^\*/, "");
        if (currentEditorFile !== State.activeFilename) {
          DOM.editorTextarea.value = State.virtualFS[State.activeFilename] || "";
        }
        Editor.updateGeditFilenameTabState();
      }

      if (typeof restoreScrollTop === "number") {
        setTimeout(() => { DOM.docPanel.scrollTop = restoreScrollTop; }, 60);
      } else {
        DOM.docPanel.scrollTop = 0;
      }
    },

    highlightSyntaxCard(cardId) {
      this.selectTopic("c-syntaxes");
      this.closeSidebarDrawer();
      setTimeout(() => {
        const card = document.getElementById(cardId);
        if (card) {
          const containerTop = DOM.docPanel.getBoundingClientRect().top;
          const cardTop = card.getBoundingClientRect().top;
          const relativeTop = cardTop - containerTop + DOM.docPanel.scrollTop;
          DOM.docPanel.scrollTo({ top: relativeTop - 40, behavior: "smooth" });
          card.classList.add("highlight");
          setTimeout(() => card.classList.remove("highlight"), 1800);
        }
      }, 120);
    },

    // Sidebar drawers
    openSidebarDrawer() {
      document.querySelector(".sidebar").classList.add("open");
      DOM.sidebarBackdrop.classList.add("active");
    },

    closeSidebarDrawer() {
      document.querySelector(".sidebar").classList.remove("open");
      DOM.sidebarBackdrop.classList.remove("active");
    },

    // Workspace panels
    openWorkspacePanel() {
      State.workspacePanelCollapsed = false;
      DOM.rightPanel.classList.remove("collapsed");
      DOM.workspaceToggleBtn.classList.add("active-panel");
      localStorage.setItem("workspace_collapsed", "false");
    },

    closeWorkspacePanel() {
      State.workspacePanelCollapsed = true;
      DOM.rightPanel.classList.add("collapsed");
      DOM.workspaceToggleBtn.classList.remove("active-panel");
      localStorage.setItem("workspace_collapsed", "true");
    },

    toggleWorkspacePanel() {
      if (State.workspacePanelCollapsed) {
        this.openWorkspacePanel();
      } else {
        this.closeWorkspacePanel();
      }
    },

    setWorkspaceTab(tab) {
      State.activeWorkspaceTab = tab;
      if (window.innerWidth > 768 && State.workspacePanelCollapsed) {
        this.openWorkspacePanel();
      }

      if (tab === "terminal") {
        DOM.workspaceTabTerminal.classList.add("active");
        DOM.workspaceTabGedit.classList.remove("active");
        DOM.viewTerminal.classList.add("active");
        DOM.viewGedit.classList.remove("active");
        setTimeout(() => DOM.terminalInput.focus(), 60);
      } else {
        if (DOM.workspaceTabGedit) {
          DOM.workspaceTabGedit.style.display = "inline-block";
        }
        DOM.workspaceTabTerminal.classList.remove("active");
        DOM.workspaceTabGedit.classList.add("active");
        DOM.viewTerminal.classList.remove("active");
        DOM.viewGedit.classList.add("active");
        setTimeout(() => DOM.editorTextarea.focus(), 60);
      }
    },

    setMobileTab(tab) {
      const contentArea = document.querySelector(".content-area");
      if (tab === "docs") {
        DOM.mobileTabDocs.classList.add("active");
        DOM.mobileTabIde.classList.remove("active");
        contentArea.classList.add("view-docs");
        contentArea.classList.remove("view-ide");
      } else {
        DOM.mobileTabDocs.classList.remove("active");
        DOM.mobileTabIde.classList.add("active");
        contentArea.classList.add("view-ide");
        contentArea.classList.remove("view-docs");
        
        if (State.activeWorkspaceTab === "terminal") {
          DOM.terminalInput.focus();
        } else {
          DOM.editorTextarea.focus();
        }
      }
    }
  };

  // =========================================================================
  // 5. EDITOR CONTROLLER
  // =========================================================================
  const Editor = {
    updateGeditFilenameTabState() {
      const isDirty = DOM.editorTextarea.value !== (State.virtualFS[State.activeFilename] || "");
      DOM.geditFilenameTab.innerText = (isDirty ? "*" : "") + State.activeFilename;
    },

    saveFile() {
      const code = DOM.editorTextarea.value;
      State.virtualFS[State.activeFilename] = code;

      const activeTopic = topicsData.find(t => {
        if (State.getTopicFilename(t) === State.activeFilename) return true;
        const splitFiles = State.extractFilesFromCode(t.code);
        return splitFiles && Object.keys(splitFiles).includes(State.activeFilename);
      });

      if (activeTopic) {
        if (DOM.docCodeFilename.innerText === State.activeFilename) {
          UIManager.renderCodeLines(code);
        }
        State.isCompiled[activeTopic.id] = false;
      }

      this.updateGeditFilenameTabState();
      State.saveVfsToLocalStorage();

      // Show saved indicator on button
      const prevText = DOM.geditSaveBtn.innerText;
      DOM.geditSaveBtn.innerText = "Saved!";
      DOM.geditSaveBtn.style.backgroundColor = "var(--accent-bg)";
      DOM.geditSaveBtn.style.borderColor = "var(--accent)";
      DOM.geditSaveBtn.style.color = "var(--accent)";
      setTimeout(() => {
        DOM.geditSaveBtn.innerText = prevText;
        DOM.geditSaveBtn.style.backgroundColor = "";
        DOM.geditSaveBtn.style.borderColor = "";
        DOM.geditSaveBtn.style.color = "";
      }, 1000);

      Terminal.writeTerminalTextLine(`[Disk] Saved file ${State.activeFilename}`);
    }
  };

  // =========================================================================
  // 6. TERMINAL & SIMULATION ENGINE
  // =========================================================================
  const Terminal = {
    writeTerminalTextLine(text) {
      const line = document.createElement("div");
      line.className = "terminal-line";
      line.innerText = text;
      DOM.terminalLines.appendChild(line);
      DOM.terminalShell.scrollTop = DOM.terminalShell.scrollHeight;
    },

    writeTerminalHtmlLine(html) {
      const line = document.createElement("div");
      line.className = "terminal-line";
      line.innerHTML = html;
      DOM.terminalLines.appendChild(line);
      DOM.terminalShell.scrollTop = DOM.terminalShell.scrollHeight;
    },

    clearTerminal() {
      DOM.terminalLines.innerHTML = "";
    },

    updatePromptLabel() {
      if (DOM.terminalPromptLabel) {
        DOM.terminalPromptLabel.innerHTML = `<span class="prompt-user">${State.terminalUsername}@${State.terminalHostname}</span>:<span class="prompt-dir">~/os_lab</span>$&nbsp;`;
      }
    },

    simulateTypingAndEnter(commandText, callback) {
      let index = 0;
      DOM.terminalInput.value = "";
      DOM.terminalInput.disabled = true;
      
      const typeNextChar = () => {
        if (index < commandText.length) {
          DOM.terminalInput.value += commandText.charAt(index);
          index++;
          DOM.terminalInput.focus();
          DOM.terminalShell.scrollTop = DOM.terminalShell.scrollHeight;
          setTimeout(typeNextChar, 18 + Math.random() * 12);
        } else {
          DOM.terminalInput.disabled = false;
          const val = DOM.terminalInput.value;
          DOM.terminalInput.value = "";
          
          if (State.terminalIsInteractive) {
            this.writeTerminalHtmlLine(`<span class="prompt-user">${State.terminalUsername}@${State.terminalHostname}</span>:<span class="prompt-dir">~/os_lab</span>$&nbsp;${UIManager.escapeHTML(val)}`);
            if (State.activePromptCallback) {
              const cb = State.activePromptCallback;
              State.terminalIsInteractive = false;
              State.activePromptCallback = null;
              cb(val);
            }
          } else {
            this.executeShellCommand(val);
          }
          
          if (callback) {
            setTimeout(callback, 200);
          }
        }
      };
      typeNextChar();
    },

    // Command Actions Map
    commands: {
      clear: () => {
        Terminal.clearTerminal();
      },
      cd: (args) => {
        const target = args[0];
        if (!target || target === "~" || target === "/" || target === ".." || target === ".") {
          Terminal.writeTerminalTextLine("Already in the main workspace directory (~/os_lab). No need to navigate elsewhere.");
        } else {
          Terminal.writeTerminalTextLine(`cd: ${target}: access denied. The OS lab environment isolates all files in the active ~/os_lab workspace.`);
        }
      },
      help: () => {
        Terminal.writeTerminalTextLine("os-uce Terminal Help Commands:");
        Terminal.writeTerminalTextLine("  gedit <filename>  - Open/create a C source file in Gedit editor");
        Terminal.writeTerminalTextLine("  gcc <file> -o a   - Compile a file (GCC reads saved code from virtual disk)");
        Terminal.writeTerminalTextLine("  ./a               - Run the compiled simulator binary");
        Terminal.writeTerminalTextLine("  ls                - List files (source files grey, binaries in green)");
        Terminal.writeTerminalTextLine("  cat <file>        - Print the contents of a file directly to the console");
        Terminal.writeTerminalTextLine("  rm <file>         - Delete a file from the filesystem");
        Terminal.writeTerminalTextLine("  cd [dir]          - Check workspace directory status");
        Terminal.writeTerminalTextLine("  name <new_name>   - Change username in the prompt");
        Terminal.writeTerminalTextLine("  clear             - Clear the screen logs");
      },
      name: (args) => {
        const newName = args[0];
        if (!newName) {
          Terminal.writeTerminalTextLine("usage: name <new_username>");
          return;
        }
        State.terminalUsername = newName;
        Terminal.updatePromptLabel();
        Terminal.writeTerminalTextLine(`Prompt updated. Welcome, ${newName}!`);
      },
      ls: () => {
        const files = Object.keys(State.virtualFS);
        if (files.length === 0) {
          Terminal.writeTerminalTextLine("Directory is empty.");
          return;
        }
        let outputHtml = "";
        files.forEach(f => {
          if (f === "a") {
            outputHtml += `<span style="color: var(--accent); font-weight: bold;">a</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
          } else {
            outputHtml += `<span>${f}</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
          }
        });
        Terminal.writeTerminalHtmlLine(outputHtml);
      },
      cat: (args) => {
        const filename = args[0];
        if (!filename) {
          Terminal.writeTerminalTextLine("cat: missing file operand");
          return;
        }
        if (State.virtualFS[filename] !== undefined) {
          if (filename === "a") {
            Terminal.writeTerminalTextLine("[Binary Executable Content]");
          } else {
            const content = State.virtualFS[filename];
            content.split("\n").forEach(line => Terminal.writeTerminalTextLine(line));
          }
        } else {
          Terminal.writeTerminalTextLine(`cat: ${filename}: No such file or directory`);
        }
      },
      rm: (args) => {
        const filename = args[0];
        if (!filename) {
          Terminal.writeTerminalTextLine("rm: missing operand");
          return;
        }
        if (State.virtualFS[filename] !== undefined) {
          delete State.virtualFS[filename];
          if (filename === "a") {
            State.compiledBinarySource = "";
          }
          Terminal.writeTerminalTextLine(`Removed file ${filename}`);
          State.saveVfsToLocalStorage();
        } else {
          Terminal.writeTerminalTextLine(`rm: cannot remove '${filename}': No such file or directory`);
        }
      },
      gedit: (args) => {
        const filename = args[0];
        if (!filename) {
          Terminal.writeTerminalTextLine("gedit: missing file operand");
          return;
        }
        
        if (State.virtualFS[filename] === undefined) {
          State.virtualFS[filename] = "";
          State.saveVfsToLocalStorage();
        }
        
        State.activeFilename = filename;
        
        const matchingTopic = topicsData.find(t => State.getTopicFilename(t) === filename);
        if (matchingTopic) {
          State.activeTopicId = matchingTopic.id;
          document.querySelectorAll(".menu-item").forEach(item => {
            if (item.getAttribute("data-id") === State.activeTopicId) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });
        } else {
          State.activeTopicId = null;
          document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
        }
        
        DOM.editorTextarea.value = State.virtualFS[State.activeFilename] || "";
        Editor.updateGeditFilenameTabState();
        if (DOM.workspaceTabGedit) {
          DOM.workspaceTabGedit.style.display = "inline-block";
        }
        UIManager.setWorkspaceTab("gedit");
        if (window.innerWidth <= 768) UIManager.setMobileTab("ide");
        Terminal.writeTerminalTextLine(`Opened ${filename} in editor.`);
      },
      gcc: (args) => {
        const fileArg = args[0] || "";
        const hasOutFlag = args.includes("-o");
        const outVal = hasOutFlag ? args[args.indexOf("-o") + 1] : "";

        if (!fileArg) {
          Terminal.writeTerminalTextLine("gcc: fatal error: no input files");
          return;
        }

        if (State.virtualFS[fileArg] === undefined) {
          Terminal.writeTerminalTextLine(`gcc: error: ${fileArg}: No such file or directory`);
          return;
        }

        if (!hasOutFlag || !outVal) {
          Terminal.writeTerminalTextLine("gcc: error: compilation requires output flag '-o <binary>'");
          return;
        }

        Terminal.writeTerminalTextLine(`compiling ${fileArg}...`);
        
        const isDirty = (State.activeFilename === fileArg) && (DOM.editorTextarea.value !== (State.virtualFS[State.activeFilename] || ""));
        if (isDirty) {
          Terminal.writeTerminalHtmlLine(`<span style="color: var(--warn-text);">warning: You have unsaved changes in Gedit. Compiling previously saved version!</span>`);
        }

        setTimeout(() => {
          const fileContent = State.virtualFS[fileArg];
          const matchingTopic = topicsData.find(t => State.getTopicFilename(t) === fileArg);
          const compileId = matchingTopic ? matchingTopic.id : "sandbox";

          const result = compiler.compile(compileId, fileContent);
          
          if (result.success) {
            result.warnings.forEach(w => {
              Terminal.writeTerminalHtmlLine(`<span style="color: var(--warn-text);">${fileArg}:${w.line}: warning: ${w.msg}</span>`);
            });
            State.compiledBinarySource = fileArg;
            State.binarySourceMap[outVal] = fileArg;
            State.virtualFS[outVal] = "[Binary Executable]";
            Terminal.writeTerminalHtmlLine(`<span style="color: var(--accent); font-weight: bold;">Compilation successful. Output written to '${outVal}'</span>`);
          } else {
            result.errors.forEach(err => {
              Terminal.writeTerminalHtmlLine(`<span style="color: var(--danger);">${fileArg}:${err.line}: ${err.msg}</span>`);
            });
            if (State.virtualFS[outVal]) {
              delete State.virtualFS[outVal];
              delete State.binarySourceMap[outVal];
              State.compiledBinarySource = "";
            }
          }

          if (result.smartReports && result.smartReports.length > 0) {
            Terminal.writeTerminalHtmlLine(`<div class="smart-compiler-report"><strong>Smart Static Analyzer:</strong>`);
            result.smartReports.forEach(r => {
              const linePrefix = r.line ? `[Line ${r.line}] ` : "";
              Terminal.writeTerminalHtmlLine(`<div style="margin-top:2px;">&nbsp;&nbsp;* ${linePrefix}${UIManager.escapeHTML(r.msg)}</div>`);
              if (r.hint) {
                Terminal.writeTerminalHtmlLine(`<div style="margin-top:2px; margin-left:20px; color: #fbbf24;">💡 Hint: ${UIManager.escapeHTML(r.hint)}</div>`);
              }
            });
            Terminal.writeTerminalHtmlLine(`</div>`);
          }
        }, 500);
      }
    },

    executeShellCommand(cmdString) {
      const rawCmd = cmdString.trim();
      if (rawCmd) {
        State.commandHistory.push(rawCmd);
      }
      State.historyIndex = -1;

      this.writeTerminalHtmlLine(`<span class="prompt-user">${State.terminalUsername}@${State.terminalHostname}</span>:<span class="prompt-dir">~/os_lab</span>$&nbsp;${UIManager.escapeHTML(rawCmd)}`);

      if (!rawCmd) return;

      if (rawCmd.startsWith("./")) {
        const binaryName = rawCmd.substring(2).trim();
        if (State.virtualFS[binaryName] === undefined) {
          this.writeTerminalTextLine(`bash: ./${binaryName}: No such file or directory (did you compile it?)`);
          return;
        }
        
        const srcFile = State.binarySourceMap[binaryName] || State.compiledBinarySource || "sandbox.c";
        State.terminalIsInteractive = true;
        this.writeTerminalTextLine(`Executing binary image ./${binaryName} (compiled from ${srcFile})...`);
        
        const matchingTopic = topicsData.find(t => State.getTopicFilename(t) === srcFile);
        const compileId = matchingTopic ? matchingTopic.id : "sandbox";
        const codeToRun = State.virtualFS[srcFile] || "";
        
        setTimeout(() => {
          compiler.runSimulation(compileId, codeToRun, {
            writeLine: (text) => this.writeTerminalTextLine(text),
            prompt: (lbl, cb) => {
              this.writeTerminalTextLine(lbl);
              State.activePromptCallback = cb;
              State.terminalIsInteractive = true;
            }
          }, () => {
            State.terminalIsInteractive = false;
            State.activePromptCallback = null;
            this.writeTerminalTextLine("Process exited with code 0.");
            this.writeTerminalTextLine("");
          });
        }, 400);
        return;
      }

      const parts = [];
      const argRegex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
      let match;
      while ((match = argRegex.exec(rawCmd)) !== null) {
        parts.push(match[1] !== undefined ? match[1] : (match[2] !== undefined ? match[2] : match[0]));
      }
      
      if (parts.length === 0) return;
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      if (this.commands[command]) {
        this.commands[command](args);
      } else {
        this.writeTerminalTextLine(`bash: ${command}: command not found. Type 'help' to review commands.`);
      }
    }
  };

  // =========================================================================
  // 7. EVENT BINDINGS & APP INITIALIZATION
  // =========================================================================
  const App = {
    updateThemeIcon() {
      const isLight = document.body.classList.contains("light-theme");
      DOM.themeToggleBtn.innerHTML = isLight ? `
        <svg class="theme-icon moon-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      ` : `
        <svg class="theme-icon sun-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      `;
    },

    bindEvents() {
      // Gedit save
      DOM.geditSaveBtn.addEventListener("click", () => Editor.saveFile());

      // Editor dirty tracking
      DOM.editorTextarea.addEventListener("input", () => Editor.updateGeditFilenameTabState());

      // Copy source code
      DOM.copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(State.virtualFS[State.activeFilename] || "").then(() => {
          const prev = DOM.copyBtn.innerText;
          DOM.copyBtn.innerText = "Copied!";
          setTimeout(() => { DOM.copyBtn.innerText = prev; }, 1200);
        });
      });

      // Terminal focus on click
      if (DOM.terminalShell) {
        DOM.terminalShell.addEventListener("click", () => DOM.terminalInput.focus());
      }

      // Terminal key listener
      DOM.terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const val = DOM.terminalInput.value;
          DOM.terminalInput.value = "";
          
          if (State.terminalIsInteractive) {
            Terminal.writeTerminalHtmlLine(`<span class="prompt-user">${State.terminalUsername}@${State.terminalHostname}</span>:<span class="prompt-dir">~/os_lab</span>$&nbsp;${UIManager.escapeHTML(val)}`);
            if (State.activePromptCallback) {
              const cb = State.activePromptCallback;
              State.terminalIsInteractive = false;
              State.activePromptCallback = null;
              cb(val);
            }
          } else {
            Terminal.executeShellCommand(val);
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (State.commandHistory.length > 0 && State.historyIndex < State.commandHistory.length - 1) {
            State.historyIndex++;
            DOM.terminalInput.value = State.commandHistory[State.commandHistory.length - 1 - State.historyIndex];
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (State.historyIndex > 0) {
            State.historyIndex--;
            DOM.terminalInput.value = State.commandHistory[State.commandHistory.length - 1 - State.historyIndex];
          } else if (State.historyIndex === 0) {
            State.historyIndex = -1;
            DOM.terminalInput.value = "";
          }
        }
      });

      // Floating jump to code
      if (DOM.floatingCodeBtn && DOM.docCodeWrapper) {
        DOM.floatingCodeBtn.addEventListener("click", () => {
          const containerTop = DOM.docPanel.getBoundingClientRect().top;
          const blockTop = DOM.docCodeWrapper.getBoundingClientRect().top;
          const relativeTop = blockTop - containerTop + DOM.docPanel.scrollTop;
          DOM.docPanel.scrollTo({ top: relativeTop - 20, behavior: "smooth" });
        });
      }

      // Markdown links, crosslinks, chips clicks delegator
      DOM.docBody.addEventListener("click", (e) => {
        const crossLink = e.target.closest(".doc-crosslink");
        if (crossLink) {
          e.preventDefault();
          const targetId = crossLink.dataset.topicTarget;
          if (targetId) { UIManager.selectTopic(targetId); UIManager.closeSidebarDrawer(); }
          return;
        }

        const syntaxLink = e.target.closest(".syntax-crosslink");
        if (syntaxLink) {
          e.preventDefault();
          const cardId = syntaxLink.dataset.syntaxCard;
          if (cardId) UIManager.highlightSyntaxCard(cardId);
          return;
        }

        const chip = e.target.closest(".topic-chip");
        if (chip) {
          e.preventDefault();
          const targetId = chip.dataset.topicTarget;
          if (targetId) { UIManager.selectTopic(targetId); UIManager.closeSidebarDrawer(); }
          return;
        }

        const a = e.target.closest("a");
        if (!a) return;
        const href = a.getAttribute("href");
        if (!href) return;

        if (href.startsWith("http://") || href.startsWith("https://")) {
          e.preventDefault();
          window.open(href, '_blank');
          return;
        }

        if (href.startsWith("#line-")) {
          e.preventDefault();
          const lineNum = href.split("-")[1];
          const targetRow = document.getElementById(`line-L${lineNum}`);
          if (targetRow) {
            const containerTop = DOM.docPanel.getBoundingClientRect().top;
            const rowTop = targetRow.getBoundingClientRect().top;
            const relativeTop = rowTop - containerTop + DOM.docPanel.scrollTop;
            DOM.docPanel.scrollTo({ top: relativeTop - 120, behavior: "smooth" });
            targetRow.classList.add("active-highlight");
            setTimeout(() => targetRow.classList.remove("active-highlight"), 1500);
          } else {
            DOM.docCodeWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        else if (href.startsWith("#syntax-")) {
          e.preventDefault();
          UIManager.selectTopic("c-syntaxes");
          UIManager.closeSidebarDrawer();
          setTimeout(() => {
            const idTag = href.substring(1);
            const targetElement = document.getElementById(idTag);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
              targetElement.style.backgroundColor = "rgba(37, 99, 235, 0.1)";
              setTimeout(() => { targetElement.style.backgroundColor = ""; }, 1500);
            }
          }, 100);
        }
        else if (href.startsWith("#") && document.querySelector(`.menu-item[data-id="${href.substring(1)}"]`)) {
          e.preventDefault();
          UIManager.selectTopic(href.substring(1));
          UIManager.closeSidebarDrawer();
        }
      });

      // Compile and Run Trigger
      if (DOM.compileTriggerBtn) {
        DOM.compileTriggerBtn.addEventListener("click", () => {
          if (!State.activeTopicId || State.activeTopicId === "help-guide" || State.activeTopicId === "c-syntaxes") return;
          
          // Reset any running terminal simulation prompts to prevent collisions
          State.terminalIsInteractive = false;
          State.activePromptCallback = null;

          const refCode = State.savedCode[State.activeTopicId] || "";
          const splitFiles = State.extractFilesFromCode(refCode);

          DOM.compileTriggerBtn.classList.add("running");
          DOM.compileTriggerBtn.textContent = "$ running...";

          UIManager.setWorkspaceTab("terminal");

          if (splitFiles) {
            Object.entries(splitFiles).forEach(([fn, content]) => {
              if (!State.virtualFS[fn]) {
                State.virtualFS[fn] = content;
              }
            });
            DOM.editorTextarea.value = State.virtualFS[State.activeFilename] || "";
            Editor.updateGeditFilenameTabState();
            State.saveVfsToLocalStorage();

            if (State.activeTopicId === "execv-call") {
              setTimeout(() => {
                Terminal.simulateTypingAndEnter("gcc first.c -o first", () => {
                  setTimeout(() => {
                    Terminal.simulateTypingAndEnter("gcc second.c -o a", () => {
                      setTimeout(() => {
                        Terminal.simulateTypingAndEnter("./a", () => {
                          DOM.compileTriggerBtn.classList.remove("running");
                          DOM.compileTriggerBtn.textContent = "$ Compile & Run";
                        });
                      }, 600);
                    });
                  }, 600);
                });
              }, 350);
            } else if (State.activeTopicId === "shm-even-odd") {
              setTimeout(() => {
                Terminal.simulateTypingAndEnter("gcc writer.c -o writer", () => {
                  setTimeout(() => {
                    Terminal.simulateTypingAndEnter("gcc reader.c -o a", () => {
                      setTimeout(() => {
                        Terminal.simulateTypingAndEnter("./a", () => {
                          DOM.compileTriggerBtn.classList.remove("running");
                          DOM.compileTriggerBtn.textContent = "$ Compile & Run";
                        });
                      }, 600);
                    });
                  }, 600);
                });
              }, 350);
            }
          } else {
            const currentVal = DOM.editorTextarea.value.trim();
            if (!currentVal && refCode) {
              DOM.editorTextarea.value = refCode;
              State.virtualFS[State.activeFilename] = refCode;
              State.saveVfsToLocalStorage();
            }
            Editor.updateGeditFilenameTabState();

            setTimeout(() => {
              Terminal.simulateTypingAndEnter(`gcc ${State.activeFilename} -o a`, () => {
                setTimeout(() => {
                  Terminal.simulateTypingAndEnter("./a", () => {
                    DOM.compileTriggerBtn.classList.remove("running");
                    DOM.compileTriggerBtn.textContent = "$ Compile & Run";
                  });
                }, 600);
              });
            }, 350);
          }
        });
      }

      // Workspace Toggle
      if (DOM.workspaceToggleBtn) {
        DOM.workspaceToggleBtn.addEventListener("click", () => UIManager.toggleWorkspacePanel());
      }

      // Tab navigators
      if (DOM.workspaceTabTerminal) {
        DOM.workspaceTabTerminal.addEventListener("click", () => UIManager.setWorkspaceTab("terminal"));
      }
      if (DOM.workspaceTabGedit) {
        DOM.workspaceTabGedit.addEventListener("click", () => UIManager.setWorkspaceTab("gedit"));
      }

      // Close tab button
      const geditTabClose = document.getElementById("gedit-tab-close");
      if (geditTabClose) {
        geditTabClose.addEventListener("click", (e) => {
          e.stopPropagation();
          if (DOM.workspaceTabGedit) {
            DOM.workspaceTabGedit.style.display = "none";
          }
          UIManager.setWorkspaceTab("terminal");
        });
      }

      // Mobile navigations
      DOM.mobileMenuBtn.addEventListener("click", () => UIManager.openSidebarDrawer());
      DOM.sidebarBackdrop.addEventListener("click", () => UIManager.closeSidebarDrawer());
      
      if (DOM.mobileTerminalToggle) {
        DOM.mobileTerminalToggle.addEventListener("click", () => {
          const contentArea = document.querySelector(".content-area");
          if (contentArea.classList.contains("view-ide")) {
            UIManager.setMobileTab("docs");
          } else {
            UIManager.setMobileTab("ide");
          }
        });
      }

      DOM.mobileTabDocs.addEventListener("click", () => UIManager.setMobileTab("docs"));
      DOM.mobileTabIde.addEventListener("click", () => UIManager.setMobileTab("ide"));

      // Light/Dark mode toggler
      DOM.themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        this.updateThemeIcon();
      });

      // Compatibility elements triggers (Automated tests click proxies)
      const compatCompileBtn = document.getElementById("ws-compile-btn");
      const compatRunBtn = document.getElementById("ws-run-btn");
      if (compatCompileBtn) {
        compatCompileBtn.addEventListener("click", () => {
          if (DOM.compileTriggerBtn) DOM.compileTriggerBtn.click();
        });
      }
      if (compatRunBtn) {
        compatRunBtn.addEventListener("click", () => {
          Terminal.executeShellCommand("./a");
        });
      }

      // Scroll observer to hide floating code button
      if (DOM.docPanel && DOM.floatingCodeBtn && DOM.docCodeWrapper) {
        DOM.docPanel.addEventListener("scroll", () => {
          if (DOM.docCodeWrapper.style.display !== "none") {
            const wrapperRect = DOM.docCodeWrapper.getBoundingClientRect();
            const panelRect = DOM.docPanel.getBoundingClientRect();
            if (wrapperRect.top < panelRect.bottom - 40) {
              DOM.floatingCodeBtn.style.opacity = "0";
              DOM.floatingCodeBtn.style.pointerEvents = "none";
            } else {
              DOM.floatingCodeBtn.style.opacity = "1";
              DOM.floatingCodeBtn.style.pointerEvents = "auto";
            }
          }
        });
      }
    },

    bootstrap() {
      // 1. Setup marked headings slugifier
      UIManager.setupMarkedRenderer();
      
      // 2. Initialize terminal prompts
      Terminal.updatePromptLabel();

      // 3. Load user theme settings
      const savedTheme = localStorage.getItem("theme") || "dark";
      if (savedTheme === "light") {
        document.body.classList.add("light-theme");
      }
      this.updateThemeIcon();

      // 4. Load panel collapse state
      const isCollapsed = localStorage.getItem("workspace_collapsed") === "true";
      if (isCollapsed && window.innerWidth > 768) {
        UIManager.closeWorkspacePanel();
      } else {
        UIManager.openWorkspacePanel();
      }

      // 5. Populate Sidebar elements
      UIManager.populateSidebar();

      // 6. Bind events
      this.bindEvents();

      // 7. Select initial topic
      UIManager.selectTopic("fork-basic");
    }
  };

  // Run the app bootstrap routine
  App.bootstrap();
});
