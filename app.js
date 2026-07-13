document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const sidebarMenu = document.getElementById("sidebar-menu-list");
  const docCategory = document.getElementById("doc-category");
  const docTitle = document.getElementById("doc-title");
  const docDesc = document.getElementById("doc-description");
  const docBody = document.getElementById("doc-body");
  const docCodeFilename = document.getElementById("doc-code-filename");
  const docCodeCode = document.getElementById("doc-code-code");
  const copyBtn = document.getElementById("copy-code-btn");
  const compatibilityAlert = document.getElementById("compatibility-alert");
  const warningText = document.getElementById("warning-text");

  // Turbo C IDE elements
  const editorTextarea = document.getElementById("editor-textarea");
  const tcFileTitle = document.getElementById("tc-file-title");
  const messageWindow = document.getElementById("message-window");
  const messageWindowContent = document.getElementById("message-window-content");

  // DOSBox Terminal elements
  const terminalWindow = document.getElementById("terminal-window");
  const terminalLines = document.getElementById("terminal-lines");
  const terminalCloseBtn = document.getElementById("terminal-close-btn");

  // Tab elements
  const tabBtnSyntax = document.getElementById("tab-btn-syntax");
  const tabBtnShortcuts = document.getElementById("tab-btn-shortcuts");
  const tabContentSyntax = document.getElementById("tab-content-syntax");
  const tabContentShortcuts = document.getElementById("tab-content-shortcuts");
  const syntaxItemsList = document.getElementById("syntax-items-list");
  const shortcutsPanelContent = document.getElementById("shortcuts-panel-content");

  // Menu/status actions
  const menuCompile = document.getElementById("tc-menu-compile");
  const menuRun = document.getElementById("tc-menu-run");
  const btnHelp = document.getElementById("tc-status-help");
  const btnSave = document.getElementById("tc-status-save");
  const btnOpen = document.getElementById("tc-status-open");
  const btnCompile = document.getElementById("tc-status-compile");
  const btnRun = document.getElementById("tc-status-run");
  const btnScreen = document.getElementById("tc-status-screen");

  // State variables
  let activeTopicId = "fcfs-sched";
  let activeTab = "syntax";
  let terminalIsRunning = false;
  let lastOutputLines = [];

  // --- Populate UI Panels ---

  // 1. Sidebar Category-based population
  function populateSidebar() {
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
          <a class="menu-item ${topic.id === activeTopicId ? 'active' : ''}" data-id="${topic.id}">
            ${topic.title}
          </a>
        `;
      });
    }
    sidebarMenu.innerHTML = menuHTML;

    // Attach click events
    document.querySelectorAll(".menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        const topicId = e.target.getAttribute("data-id");
        selectTopic(topicId);
      });
    });
  }

  // 2. Syntax Tab population
  function populateSyntaxTab() {
    let syntaxHTML = "";
    syntaxesData.items.forEach(item => {
      syntaxHTML += `
        <div class="syntax-card" id="${item.id}">
          <h4>${item.title}</h4>
          <div class="syntax-preview">${escapeHTML(item.syntax)}</div>
          <div class="syntax-desc">${item.desc}</div>
        </div>
      `;
    });
    syntaxItemsList.innerHTML = syntaxHTML;
    document.getElementById("syntax-panel-desc").innerText = syntaxesData.description;
  }

  // 3. Shortcuts & Mismatch Tab population
  function populateShortcutsTab() {
    let shortcutsHTML = `
      <p class="shortcut-intro">${shortcutsData.description}</p>
      <h4>Keyboard Shortcuts</h4>
      <div class="shortcut-grid">
    `;

    shortcutsData.shortcuts.forEach(s => {
      shortcutsHTML += `
        <div class="shortcut-key">${s.key}</div>
        <div class="shortcut-details">
          <h5>${s.action}</h5>
          <p>${s.desc}</p>
        </div>
      `;
    });

    shortcutsHTML += `
      </div>
      <h4 style="margin-top:24px; margin-bottom:12px;">DOSBox Mismatches & Errors</h4>
    `;

    shortcutsData.mismatches.forEach(m => {
      shortcutsHTML += `
        <div class="mismatch-item">
          <h5>${m.title}</h5>
          <p>${m.desc}</p>
        </div>
      `;
    });

    shortcutsPanelContent.innerHTML = shortcutsHTML;
  }

  // --- Core Actions ---

  // Selects and renders a topic's documentation
  function selectTopic(topicId) {
    activeTopicId = topicId;
    
    // Close mobile drawer if open
    const sidebarEl = document.querySelector(".sidebar");
    const backdropEl = document.getElementById("sidebar-backdrop");
    if (sidebarEl && sidebarEl.classList.contains("open")) {
      sidebarEl.classList.remove("open");
      if (backdropEl) backdropEl.classList.remove("active");
    }

    // Update sidebar styles
    document.querySelectorAll(".menu-item").forEach(item => {
      if (item.getAttribute("data-id") === topicId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    const topic = topicsData.find(t => t.id === topicId);
    if (!topic) return;

    // Update Doc panel
    docCategory.innerText = topic.category;
    docTitle.innerText = topic.title;
    docDesc.innerText = topic.description;
    
    // Deconstruction & explanation combination
    docBody.innerHTML = `
      ${topic.deconstruction}
      ${topic.explanation}
      ${topic.compatibility}
    `;

    // Bind syntax links dynamically
    bindSyntaxHyperlinks();

    // Code files settings
    let extension = ".c";
    let baseFilename = topic.id.replace("-", "_").toUpperCase() + extension;
    docCodeFilename.innerText = baseFilename.toLowerCase();
    docCodeCode.innerText = topic.code;

    // Load into Editor
    editorTextarea.value = topic.code;
    tcFileTitle.innerText = baseFilename;

    // Hide message window on topic change
    messageWindow.style.display = "none";

    // Set warnings
    if (topic.mismatch_alert) {
      compatibilityAlert.style.display = "flex";
      warningText.innerText = topic.mismatch_alert;
    } else {
      compatibilityAlert.style.display = "none";
    }

    // Scroll doc view back to top
    document.getElementById("doc-panel").scrollTop = 0;
  }

  // Intercept and bind clicks inside dynamic documentation HTML
  function bindSyntaxHyperlinks() {
    document.querySelectorAll(".syntax-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        switchToTab("syntax");
        
        // Find target syntax card and scroll to it
        const targetCard = document.getElementById(targetId);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
          
          // Highlights momentarily
          targetCard.classList.add("highlight");
          setTimeout(() => {
            targetCard.classList.remove("highlight");
          }, 1500);
        }
      });
    });
  }

  // Handle Tab Switch
  function switchToTab(tabName) {
    activeTab = tabName;
    if (tabName === "syntax") {
      tabBtnSyntax.classList.add("active");
      tabBtnShortcuts.classList.remove("active");
      tabContentSyntax.classList.add("active");
      tabContentShortcuts.classList.remove("active");
    } else {
      tabBtnSyntax.classList.remove("active");
      tabBtnShortcuts.classList.add("active");
      tabContentSyntax.classList.remove("active");
      tabContentShortcuts.classList.add("active");
    }
  }

  // Copy code utility
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(docCodeCode.innerText).then(() => {
      const origText = copyBtn.innerHTML;
      copyBtn.innerHTML = `<span style="color:var(--success);">✓ Copied!</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = origText;
      }, 2000);
    });
  });

  // --- Compiler Actions ---

  // Trigger compilation check
  function triggerCompile() {
    const code = editorTextarea.value;
    const result = compiler.compile(activeTopicId, code);
    
    messageWindowContent.innerHTML = "";
    
    if (result.success) {
      messageWindowContent.innerHTML = `
        <div style="color: var(--success); font-weight: bold; margin-bottom: 4px;">Compilation Successful</div>
        <div>File: ${tcFileTitle.innerText}</div>
        <div>Code size: ${code.length} bytes</div>
        <div style="margin-top: 8px; color: var(--text-dim);">Press ESC to dismiss this window.</div>
      `;
      messageWindow.style.display = "flex";
      return true;
    } else {
      let errHTML = `
        <div style="color: var(--danger); font-weight: bold; margin-bottom: 6px;">
          Compilation Failed: ${result.errors.length} Error(s)
        </div>
      `;
      result.errors.forEach(err => {
        errHTML += `
          <div class="tc-error-line" data-line="${err.line}">
            Line ${err.line}: ${err.msg}
          </div>
        `;
      });
      messageWindowContent.innerHTML = errHTML;
      messageWindow.style.display = "flex";

      // Bind error line focus clicks
      document.querySelectorAll(".tc-error-line").forEach(el => {
        el.addEventListener("click", () => {
          const lineNum = parseInt(el.getAttribute("data-line"));
          focusEditorOnLine(lineNum);
        });
      });
      return false;
    }
  }

  // Highlights/Focuses cursor on line with error
  function focusEditorOnLine(lineNum) {
    const text = editorTextarea.value;
    const lines = text.split("\n");
    let charOffset = 0;
    
    for (let i = 0; i < Math.min(lineNum - 1, lines.length); i++) {
      charOffset += lines[i].length + 1;
    }

    editorTextarea.focus();
    editorTextarea.setSelectionRange(charOffset, charOffset + (lines[lineNum - 1] ? lines[lineNum - 1].length : 0));
  }

  // Emulates Running Program
  function triggerRun() {
    // Compile first
    const isCompiled = triggerCompile();
    if (!isCompiled) return; // Stop if compile fails

    // Wait a brief second to simulate compilation flash, then open terminal
    setTimeout(() => {
      messageWindow.style.display = "none";
      terminalWindow.style.display = "flex";
      terminalIsRunning = true;
      
      // Start emulation script
      compiler.runSimulation(activeTopicId, terminalController, () => {
        terminalIsRunning = false;
        terminalController.writeLine("");
        terminalController.writeLine("Process completed. Press any key to return to editor...", "cursor-blink");
      });
    }, 800);
  }

  // --- Terminal Controller API ---
  const terminalController = {
    clear: function() {
      terminalLines.innerHTML = "";
    },
    writeLine: function(text, className = "") {
      const line = document.createElement("div");
      line.className = `terminal-line ${className}`;
      line.innerText = text;
      terminalLines.appendChild(line);
      terminalLines.scrollTop = terminalLines.scrollHeight;
      
      // Preserve terminal buffer for user screen view (Alt+F5)
      lastOutputLines.push({text, className});
    },
    prompt: function(message, callback) {
      const promptLine = document.createElement("div");
      promptLine.className = "terminal-input-line";
      
      const promptText = document.createElement("span");
      promptText.className = "terminal-prompt";
      promptText.innerText = message;
      
      const input = document.createElement("input");
      input.type = "text";
      input.className = "terminal-input";
      
      promptLine.appendChild(promptText);
      promptLine.appendChild(input);
      terminalLines.appendChild(promptLine);
      terminalLines.scrollTop = terminalLines.scrollHeight;
      
      input.focus();
      
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const value = input.value;
          // Freeze prompt line with value
          promptLine.innerHTML = "";
          promptText.innerText = message + value;
          promptLine.appendChild(promptText);
          
          lastOutputLines.push({text: message + value, className: ""});
          callback(value);
        }
      });
    }
  };

  // Close Terminal
  function closeTerminal() {
    terminalWindow.style.display = "none";
    terminalIsRunning = false;
    editorTextarea.focus();
  }

  terminalCloseBtn.addEventListener("click", closeTerminal);

  // Toggle user screen view (Alt+F5 emulation)
  function toggleUserScreen() {
    if (terminalWindow.style.display === "flex") {
      closeTerminal();
    } else {
      terminalWindow.style.display = "flex";
      terminalController.clear();
      lastOutputLines.forEach(l => {
        const line = document.createElement("div");
        line.className = `terminal-line ${l.className}`;
        line.innerText = l.text;
        terminalLines.appendChild(line);
      });
      terminalLines.scrollTop = terminalLines.scrollHeight;
      terminalController.writeLine("");
      terminalController.writeLine("[Viewing User Output Screen - Press ESC to Return]");
    }
  }

  // Save Code Simulation
  function triggerSave() {
    const origBg = btnSave.style.background;
    btnSave.style.background = "#fff";
    setTimeout(() => {
      btnSave.style.background = origBg;
      alert(`Saving code file ${tcFileTitle.innerText} to emulated DOS directory C:\\TC\\BIN\\ successfully.`);
    }, 150);
  }

  // --- Bind Event Listeners ---
  tabBtnSyntax.addEventListener("click", () => switchToTab("syntax"));
  tabBtnShortcuts.addEventListener("click", () => switchToTab("shortcuts"));

  // IDE menu clicks
  menuCompile.addEventListener("click", triggerCompile);
  menuRun.addEventListener("click", triggerRun);

  // Status bar clicks
  btnHelp.addEventListener("click", () => {
    switchToTab("shortcuts");
    alert("Help triggered! The keyboard shortcuts tab has been highlighted on the bottom right.");
  });
  btnSave.addEventListener("click", triggerSave);
  btnOpen.addEventListener("click", () => {
    alert("Dialog simulation: Load program. To switch code files, use the modern menu in the left panel!");
  });
  btnCompile.addEventListener("click", triggerCompile);
  btnRun.addEventListener("click", triggerRun);
  btnScreen.addEventListener("click", toggleUserScreen);

  // Key combinations within the page
  window.addEventListener("keydown", (e) => {
    // ESC closes popups
    if (e.key === "Escape") {
      if (messageWindow.style.display === "flex") {
        messageWindow.style.display = "none";
        editorTextarea.focus();
      }
      if (terminalWindow.style.display === "flex") {
        closeTerminal();
      }
    }

    // Capture hotkeys in textarea focus or general document
    // F2: Save
    if (e.key === "F2") {
      e.preventDefault();
      triggerSave();
    }

    // F3: Open
    if (e.key === "F3") {
      e.preventDefault();
      alert("Open file dialog triggered.");
    }

    // Alt+F9: Compile
    if (e.altKey && e.key === "F9") {
      e.preventDefault();
      triggerCompile();
    }

    // F9 compile shortcut also
    if (e.key === "F9" && !e.altKey) {
      e.preventDefault();
      triggerCompile();
    }

    // Ctrl+F9: Run
    if (e.ctrlKey && e.key === "F9") {
      e.preventDefault();
      triggerRun();
    }

    // Alt+F5: User Screen
    if (e.altKey && e.key === "F5") {
      e.preventDefault();
      toggleUserScreen();
    }

    // If terminal is finished, pressing any key returns to editor
    if (terminalWindow.style.display === "flex" && !terminalIsRunning && e.key !== "Escape") {
      closeTerminal();
    }
  });

  // --- Mobile Navigation Setup ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileRunBtn = document.getElementById("mobile-run-btn");
  const mobileTabDocs = document.getElementById("mobile-tab-docs");
  const mobileTabIde = document.getElementById("mobile-tab-ide");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const sidebar = document.querySelector(".sidebar");
  const contentArea = document.querySelector(".content-area");

  // Set default view on mobile content area container
  if (contentArea) {
    contentArea.classList.add("view-docs");
  }

  // Toggle Sidebar Drawer
  if (mobileMenuBtn && sidebar && sidebarBackdrop) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      sidebarBackdrop.classList.toggle("active");
    });

    sidebarBackdrop.addEventListener("click", () => {
      sidebar.classList.remove("open");
      sidebarBackdrop.classList.remove("active");
    });
  }

  // Quick Run Button on Mobile Top Header
  if (mobileRunBtn) {
    mobileRunBtn.addEventListener("click", () => {
      // Force switch to IDE tab view so they can see the terminal open
      if (mobileTabIde) mobileTabIde.click();
      triggerRun();
    });
  }

  // Switch Between Docs & IDE Views (Bottom Tab Bar)
  if (mobileTabDocs && mobileTabIde && contentArea) {
    mobileTabDocs.addEventListener("click", () => {
      mobileTabDocs.classList.add("active");
      mobileTabIde.classList.remove("active");
      contentArea.classList.add("view-docs");
      contentArea.classList.remove("view-ide");
    });

    mobileTabIde.addEventListener("click", () => {
      mobileTabIde.classList.add("active");
      mobileTabDocs.classList.remove("active");
      contentArea.classList.add("view-ide");
      contentArea.classList.remove("view-docs");
    });
  }

  // --- Draggable Resizer Setup ---
  const resizeHandle = document.getElementById("tc-resize-handle");
  const tcIde = document.querySelector(".tc-ide");
  const rightPanel = document.querySelector(".right-panel");

  if (resizeHandle && tcIde && rightPanel) {
    let isDragging = false;

    const startDrag = (e) => {
      isDragging = true;
      resizeHandle.classList.add("dragging");
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
      
      // Prevent text/iframe selection issues
      if (e.cancelable) e.preventDefault();
    };

    const doDrag = (e) => {
      if (!isDragging) return;

      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (!clientY) return;

      const panelRect = rightPanel.getBoundingClientRect();
      let newHeight = clientY - panelRect.top;

      // Sizing constraints (header + menus + status = approx 100px)
      const minHeight = 90;
      const maxHeight = panelRect.height - 80; // leave at least 80px for tabs

      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;

      tcIde.style.height = newHeight + "px";
    };

    const stopDrag = () => {
      if (isDragging) {
        isDragging = false;
        resizeHandle.classList.remove("dragging");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    // Mouse events
    resizeHandle.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);

    // Touch events for mobile/tablet resizing
    resizeHandle.addEventListener("touchstart", startDrag);
    window.addEventListener("touchmove", doDrag, { passive: false });
    window.addEventListener("touchend", stopDrag);
  }

  // --- Initializer Run ---
  populateSidebar();
  populateSyntaxTab();
  populateShortcutsTab();
  
  // Select first topic
  selectTopic(activeTopicId);
});

// Helper to escape HTML tags
function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
