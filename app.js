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

  // Gedit & Terminal Workspace Elements
  const workspaceTabTerminal = document.getElementById("workspace-tab-terminal");
  const workspaceTabGedit = document.getElementById("workspace-tab-gedit");
  const viewTerminal = document.getElementById("view-terminal");
  const viewGedit = document.getElementById("view-gedit");
  
  const geditFilenameTab = document.getElementById("gedit-filename-tab");
  const geditSaveBtn = document.getElementById("gedit-save-btn");
  const editorTextarea = document.getElementById("editor-textarea");

  const terminalLines = document.getElementById("terminal-lines");
  const terminalInput = document.getElementById("terminal-input");

  // Bottom Tabs Panel
  const tabBtnSyntax = document.getElementById("tab-btn-syntax");
  const tabBtnShortcuts = document.getElementById("tab-btn-shortcuts");
  const tabBtnGuide = document.getElementById("tab-btn-guide");
  const tabContentSyntax = document.getElementById("tab-content-syntax");
  const tabContentShortcuts = document.getElementById("tab-content-shortcuts");
  const tabContentGuide = document.getElementById("tab-content-guide");
  const syntaxItemsList = document.getElementById("syntax-items-list");
  const shortcutsPanelContent = document.getElementById("shortcuts-panel-content");

  // Mobile navigation
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const wsCompileBtn = document.getElementById("ws-compile-btn");
  const wsRunBtn = document.getElementById("ws-run-btn");
  const mobileTabDocs = document.getElementById("mobile-tab-docs");
  const mobileTabIde = document.getElementById("mobile-tab-ide");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");

  // Sizer resize handle
  const tcResizeHandle = document.getElementById("tc-resize-handle");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  // --- State Variables ---
  let activeTopicId = "fork-basic";
  let activeWorkspaceTab = "terminal";
  let activeHelpTab = "syntax";

  // Code state tracking (saved vs current draft)
  const savedCode = {};
  const isCompiled = {};
  const compiledTopicId = {};

  // --- Virtual Filesystem (VFS) State ---
  const virtualFS = {};
  let activeFilename = "fork_basic.c"; // active file in Gedit
  let compiledBinarySource = "";       // filename compiled to binary 'a'

  const topicFilenames = {
    "fork-basic": "fork_basic.c",
    "fork-loop": "fork_loop.c",
    "execv-call": "execv_call.c",
    "dir-search": "dir_search.c",
    "file-stat": "file_stat.c",
    "shm-even-odd": "shm_even_odd.c",
    "msg-queue": "msg_queue.c",
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
  };

  // Terminal interactive state
  let terminalIsInteractive = false;
  let activePromptCallback = null;
  const commandHistory = [];
  let historyIndex = -1;

  // Initialize file states & VFS
  topicsData.forEach(topic => {
    savedCode[topic.id] = topic.code;
    isCompiled[topic.id] = false;
    const filename = getTopicFilename(topic);
    virtualFS[filename] = topic.code;
  });

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
        // On mobile, close drawer on item selection
        closeSidebarDrawer();
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

  // 3. How to Run Tab population
  function populateShortcutsTab() {
    let shortcutsHTML = `
      <div class="shortcuts-section">
        <h4>Steps to Run Code in Linux Terminal</h4>
        <table class="shortcuts-table">
          <thead>
            <tr>
              <th>Command</th>
              <th>Action</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    shortcutsData.shortcuts.forEach(item => {
      shortcutsHTML += `
        <tr>
          <td><code class="terminal-cmd-highlight">${item.key}</code></td>
          <td><strong>${item.action}</strong></td>
          <td>${item.desc}</td>
        </tr>
      `;
    });

    shortcutsHTML += `
          </tbody>
        </table>
      </div>
      <hr class="section-divider" />
      <div class="shortcuts-section">
        <h4>Linux GCC Environment Notes</h4>
    `;

    shortcutsData.mismatches.forEach(item => {
      shortcutsHTML += `
        <div class="mismatch-card">
          <h5>${item.title}</h5>
          <p>${item.desc}</p>
        </div>
      `;
    });

    shortcutsHTML += `</div>`;
    shortcutsPanelContent.innerHTML = shortcutsHTML;
  }

  // Helper: Escape HTML characters
  function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  }

  // --- Topic Selection ---
  function selectTopic(topicId) {
    activeTopicId = topicId;

    // Highlight menu
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
    
    // Assemble body sections
    let bodyHTML = "";
    if (topic.deconstruction) bodyHTML += topic.deconstruction;
    if (topic.explanation) bodyHTML += topic.explanation;
    if (topic.compatibility) bodyHTML += topic.compatibility;
    docBody.innerHTML = bodyHTML;

    // Update file card code representation
    const filename = getTopicFilename(topic);
    docCodeFilename.innerText = filename;
    docCodeCode.innerText = savedCode[topicId];

    // Update Gedit editor contents
    activeFilename = filename;
    editorTextarea.value = virtualFS[activeFilename] || "";
    updateGeditFilenameTabState();
  }

  function getTopicFilename(topic) {
    if (!topic) return "program.c";
    return topicFilenames[topic.id] || (topic.title.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".c");
  }

  function updateGeditFilenameTabState() {
    const isDirty = editorTextarea.value !== (virtualFS[activeFilename] || "");
    geditFilenameTab.innerText = (isDirty ? "*" : "") + activeFilename;
  }

  // --- Tab Swapping (Workspace & Bottom Panel) ---

  function setWorkspaceTab(tab) {
    activeWorkspaceTab = tab;
    if (tab === "terminal") {
      workspaceTabTerminal.classList.add("active");
      workspaceTabGedit.classList.remove("active");
      viewTerminal.classList.add("active");
      viewGedit.classList.remove("active");
      // Auto-focus terminal input
      terminalInput.focus();
    } else {
      workspaceTabTerminal.classList.remove("active");
      workspaceTabGedit.classList.add("active");
      viewTerminal.classList.remove("active");
      viewGedit.classList.add("active");
      editorTextarea.focus();
    }
  }

  function setHelpTab(tab) {
    activeHelpTab = tab;
    // Reset active states
    tabBtnSyntax.classList.remove("active");
    tabBtnShortcuts.classList.remove("active");
    tabBtnGuide.classList.remove("active");
    tabContentSyntax.classList.remove("active");
    tabContentShortcuts.classList.remove("active");
    tabContentGuide.classList.remove("active");

    if (tab === "syntax") {
      tabBtnSyntax.classList.add("active");
      tabContentSyntax.classList.add("active");
    } else if (tab === "shortcuts") {
      tabBtnShortcuts.classList.add("active");
      tabContentShortcuts.classList.add("active");
    } else if (tab === "guide") {
      tabBtnGuide.classList.add("active");
      tabContentGuide.classList.add("active");
    }
  }

  // --- Gedit Editor Handlers ---

  editorTextarea.addEventListener("input", (e) => {
    updateGeditFilenameTabState();
  });

  geditSaveBtn.addEventListener("click", () => {
    const code = editorTextarea.value;
    virtualFS[activeFilename] = code;

    // Check if Gedit active file matches currently selected syllabus topic
    const activeTopic = topicsData.find(t => t.id === activeTopicId);
    const expectedFilename = activeTopic ? getTopicFilename(activeTopic) : "";

    if (activeFilename === expectedFilename && activeTopicId) {
      savedCode[activeTopicId] = code;
      docCodeCode.innerText = code;
      isCompiled[activeTopicId] = false;
    }

    updateGeditFilenameTabState();

    // Show temporary saved indicator
    const prevText = geditSaveBtn.innerText;
    geditSaveBtn.innerText = "Saved!";
    geditSaveBtn.style.backgroundColor = "#2e7d32";
    geditSaveBtn.style.borderColor = "#388e3c";
    geditSaveBtn.style.color = "#ffffff";
    setTimeout(() => {
      geditSaveBtn.innerText = prevText;
      geditSaveBtn.style.backgroundColor = "";
      geditSaveBtn.style.borderColor = "";
      geditSaveBtn.style.color = "";
    }, 1000);

    writeTerminalTextLine(`[Disk] Saved file ${activeFilename}`);
  });

  // --- Terminal Command Engine ---

  function writeTerminalTextLine(text) {
    const line = document.createElement("div");
    line.className = "terminal-line";
    line.innerText = text;
    terminalLines.appendChild(line);
    // Scroll to bottom
    terminalLines.scrollTop = terminalLines.scrollHeight;
  }

  function writeTerminalHtmlLine(html) {
    const line = document.createElement("div");
    line.className = "terminal-line";
    line.innerHTML = html;
    terminalLines.appendChild(line);
    // Scroll to bottom
    terminalLines.scrollTop = terminalLines.scrollHeight;
  }

  function clearTerminal() {
    terminalLines.innerHTML = "";
  }

  // Mock terminal interface for simulations
  const terminalInterface = {
    writeLine: function(text) {
      writeTerminalTextLine(text);
    },
    clear: function() {
      clearTerminal();
    },
    prompt: function(text, callback) {
      writeTerminalTextLine(text);
      terminalIsInteractive = true;
      activePromptCallback = callback;
    }
  };

  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = terminalInput.value;
      terminalInput.value = "";
      
      if (terminalIsInteractive) {
        // Feed direct input to active algorithm prompt callback
        writeTerminalTextLine(`user@uce-lab:~/os_lab$ ${val}`);
        if (activePromptCallback) {
          const cb = activePromptCallback;
          // Deactivate prompt state first so callback can re-prompt if needed
          terminalIsInteractive = false;
          activePromptCallback = null;
          cb(val);
        }
      } else {
        // Execute normal shell command
        executeShellCommand(val);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
      } else if (historyIndex === 0) {
        historyIndex = -1;
        terminalInput.value = "";
      }
    }
  });

  // --- Modularized Command Map ---
  const commands = {
    clear: () => {
      clearTerminal();
    },
    help: () => {
      writeTerminalTextLine("Operating Systems Lab Simulator Help:");
      writeTerminalTextLine("  gedit <filename>  - Opens the file in the Gedit editor tab");
      writeTerminalTextLine("  gcc <file> -o a   - Compiles the file (reads saved version on disk)");
      writeTerminalTextLine("  ./a               - Runs the compiled binary");
      writeTerminalTextLine("  ls                - Lists files in the current workspace directory");
      writeTerminalTextLine("  cat <file>        - Displays the content of a file");
      writeTerminalTextLine("  rm <file>         - Removes/deletes a file from the workspace");
      writeTerminalTextLine("  clear             - Clears the terminal screen");
    },
    ls: () => {
      const files = Object.keys(virtualFS);
      if (files.length === 0) {
        writeTerminalTextLine("Directory is empty.");
        return;
      }
      // Highlight "a" green in columns output
      let outputHtml = "";
      files.forEach(f => {
        if (f === "a") {
          outputHtml += `<span style="color: #22c55e; font-weight: bold;">a</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
        } else {
          outputHtml += `<span>${f}</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
        }
      });
      writeTerminalHtmlLine(outputHtml);
    },
    cat: (args) => {
      const filename = args[0];
      if (!filename) {
        writeTerminalTextLine("cat: missing file operand");
        return;
      }
      if (virtualFS[filename] !== undefined) {
        if (filename === "a") {
          writeTerminalTextLine("[Binary Executable Content]");
        } else {
          const content = virtualFS[filename];
          content.split("\n").forEach(line => writeTerminalTextLine(line));
        }
      } else {
        writeTerminalTextLine(`cat: ${filename}: No such file or directory`);
      }
    },
    rm: (args) => {
      const filename = args[0];
      if (!filename) {
        writeTerminalTextLine("rm: missing operand");
        return;
      }
      if (virtualFS[filename] !== undefined) {
        delete virtualFS[filename];
        if (filename === "a") {
          compiledBinarySource = "";
        }
        writeTerminalTextLine(`Removed file ${filename}`);
      } else {
        writeTerminalTextLine(`rm: cannot remove '${filename}': No such file or directory`);
      }
    },
    gedit: (args) => {
      const filename = args[0];
      if (!filename) {
        writeTerminalTextLine("gedit: missing file operand");
        return;
      }
      
      // Create new file if it doesn't exist in VFS
      if (virtualFS[filename] === undefined) {
        virtualFS[filename] = "";
      }
      
      activeFilename = filename;
      
      // Match against existing syllabus topic
      const matchingTopic = topicsData.find(t => getTopicFilename(t) === filename);
      if (matchingTopic) {
        activeTopicId = matchingTopic.id;
        document.querySelectorAll(".menu-item").forEach(item => {
          if (item.getAttribute("data-id") === activeTopicId) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
      } else {
        activeTopicId = null;
        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
      }
      
      // Load editor content
      editorTextarea.value = virtualFS[activeFilename] || "";
      updateGeditFilenameTabState();
      setWorkspaceTab("gedit");
      writeTerminalTextLine(`Opened Gedit editor tab for ${filename}`);
    },
    gcc: (args) => {
      const fileArg = args[0] || "";
      const hasOutFlag = args.includes("-o");
      const outVal = args[args.indexOf("-o") + 1] || "";

      if (!fileArg) {
        writeTerminalTextLine("gcc: fatal error: no input files");
        return;
      }

      if (virtualFS[fileArg] === undefined) {
        writeTerminalTextLine(`gcc: error: ${fileArg}: No such file or directory`);
        return;
      }

      if (!hasOutFlag || outVal !== "a") {
        writeTerminalTextLine("gcc: error: compilation requires output flag '-o a'");
        return;
      }

      writeTerminalTextLine(`compiling ${fileArg}...`);
      
      // Check for unsaved changes in current active Gedit view
      const isDirty = (activeFilename === fileArg) && (editorTextarea.value !== (virtualFS[activeFilename] || ""));
      if (isDirty) {
        writeTerminalHtmlLine(`<span style="color: #fbbf24;">warning: You have unsaved changes in Gedit. Compiling previously saved version!</span>`);
      }

      setTimeout(() => {
        const fileContent = virtualFS[fileArg];
        // If it's a syllabus topic, compile using its ID. Else compile sandbox template.
        const matchingTopic = topicsData.find(t => getTopicFilename(t) === fileArg);
        const compileId = matchingTopic ? matchingTopic.id : "sandbox";

        const result = compiler.compile(compileId, fileContent);
        
        if (result.success) {
          result.warnings.forEach(w => {
            writeTerminalHtmlLine(`<span style="color: #fbbf24;">${fileArg}:${w.line}: warning: ${w.msg}</span>`);
          });
          compiledBinarySource = fileArg;
          virtualFS["a"] = "[Binary Executable]";
          writeTerminalHtmlLine(`<span style="color: #34d399; font-weight: bold;">Compilation successful. Output written to 'a'</span>`);
        } else {
          result.errors.forEach(err => {
            writeTerminalHtmlLine(`<span style="color: #f87171;">${fileArg}:${err.line}: ${err.msg}</span>`);
          });
          if (virtualFS["a"]) {
            delete virtualFS["a"];
            compiledBinarySource = "";
          }
        }
      }, 500);
    }
  };

  // --- Executive Command Dispatcher ---
  function executeShellCommand(cmdString) {
    const rawCmd = cmdString.trim();
    if (rawCmd) {
      commandHistory.push(rawCmd);
    }
    historyIndex = -1;

    // Write command prefix to log
    writeTerminalTextLine(`user@uce-lab:~/os_lab$ ${rawCmd}`);

    if (!rawCmd) return;

    // Check if running executable ./a
    if (rawCmd === "./a") {
      if (virtualFS["a"] === undefined || !compiledBinarySource) {
        writeTerminalTextLine("bash: ./a: No such file or directory (did you compile it?)");
        return;
      }
      
      // Execute compiled binary simulation
      terminalIsInteractive = true;
      writeTerminalTextLine(`Executing binary image ./a (compiled from ${compiledBinarySource})...`);
      
      const matchingTopic = topicsData.find(t => getTopicFilename(t) === compiledBinarySource);
      const compileId = matchingTopic ? matchingTopic.id : "sandbox";
      const codeToRun = virtualFS[compiledBinarySource];
      
      setTimeout(() => {
        compiler.runSimulation(compileId, codeToRun, {
          writeLine: (text) => writeTerminalTextLine(text),
          prompt: (lbl, cb) => {
            writeTerminalTextLine(lbl);
            activePromptCallback = cb;
          }
        }, () => {
          terminalIsInteractive = false;
          activePromptCallback = null;
          writeTerminalTextLine("Process exited with code 0.");
          writeTerminalTextLine("");
        });
      }, 400);
      return;
    }

    const parts = rawCmd.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (commands[command]) {
      commands[command](args);
    } else {
      writeTerminalTextLine(`bash: ${command}: command not found. Type 'help' to review commands.`);
    }
  }

  // --- Automated Run button handler (for teaching commands) ---
  
  function triggerAutoRunSequence() {
    setWorkspaceTab("terminal");
    const topic = topicsData.find(t => t.id === activeTopicId);
    if (!topic) return;
    const filename = getTopicFilename(topic);

    writeTerminalTextLine("\n[Auto-Run Helper Triggered]");
    
    // Simulate typing gedit -> gcc -> ./a sequentially
    setTimeout(() => {
      executeShellCommand(`gedit ${filename}`);
      
      setTimeout(() => {
        setWorkspaceTab("terminal");
        // Save automatically if they click Run
        virtualFS[filename] = editorTextarea.value;
        savedCode[activeTopicId] = editorTextarea.value;
        docCodeCode.innerText = editorTextarea.value;
        updateGeditFilenameTabState();
        
        executeShellCommand(`gcc ${filename} -o a`);
        
        setTimeout(() => {
          executeShellCommand("./a");
        }, 800);
      }, 1000);
    }, 400);
  }

  // --- Interactive Drag Resizer Handle ---
  let isDragging = false;

  function initResize(e) {
    isDragging = true;
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  }

  function handleResize(e) {
    if (!isDragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rightPanel = document.querySelector(".right-panel");
    const rect = rightPanel.getBoundingClientRect();
    
    // Calculate new height for upper workspace panel
    const newWorkspaceHeight = clientY - rect.top;
    const minHeight = 90;
    const maxHeight = rect.height - 80;
    
    if (newWorkspaceHeight >= minHeight && newWorkspaceHeight <= maxHeight) {
      document.querySelector(".workspace-panel").style.height = `${newWorkspaceHeight}px`;
    }
  }

  function endResize() {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }

  // Resizer Event Listeners
  tcResizeHandle.addEventListener("mousedown", initResize);
  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", endResize);

  // Touch support for mobile resizing
  tcResizeHandle.addEventListener("touchstart", (e) => {
    initResize(e);
  });
  document.addEventListener("touchmove", (e) => {
    handleResize(e);
  });
  document.addEventListener("touchend", endResize);

  // --- Click Listeners for Sidebar & Headers ---
  
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(virtualFS[activeFilename] || "").then(() => {
      const prev = copyBtn.innerText;
      copyBtn.innerText = "Copied!";
      setTimeout(() => {
        copyBtn.innerText = prev;
      }, 1200);
    });
  });

  workspaceTabTerminal.addEventListener("click", () => setWorkspaceTab("terminal"));
  workspaceTabGedit.addEventListener("click", () => setWorkspaceTab("gedit"));

  tabBtnSyntax.addEventListener("click", () => setHelpTab("syntax"));
  tabBtnShortcuts.addEventListener("click", () => setHelpTab("shortcuts"));
  tabBtnGuide.addEventListener("click", () => setHelpTab("guide"));

  // Mobile Top Menu / Backdrop Drawer Actions
  mobileMenuBtn.addEventListener("click", openSidebarDrawer);
  sidebarBackdrop.addEventListener("click", closeSidebarDrawer);

  function openSidebarDrawer() {
    document.querySelector(".sidebar").classList.add("open");
    sidebarBackdrop.classList.add("active");
  }

  function closeSidebarDrawer() {
    document.querySelector(".sidebar").classList.remove("open");
    sidebarBackdrop.classList.remove("active");
  }

  // Workspace Action Buttons (Compile and Run)
  wsCompileBtn.addEventListener("click", () => {
    setMobileTab("ide");
    setWorkspaceTab("terminal");
    executeShellCommand(`gcc ${activeFilename} -o a`);
  });

  wsRunBtn.addEventListener("click", () => {
    setMobileTab("ide");
    setWorkspaceTab("terminal");
    executeShellCommand("./a");
  });

  // Mobile Bottom Tab View Switching
  mobileTabDocs.addEventListener("click", () => setMobileTab("docs"));
  mobileTabIde.addEventListener("click", () => setMobileTab("ide"));

  function setMobileTab(tab) {
    const contentArea = document.querySelector(".content-area");
    if (tab === "docs") {
      mobileTabDocs.classList.add("active");
      mobileTabIde.classList.remove("active");
      contentArea.classList.add("view-docs");
      contentArea.classList.remove("view-ide");
    } else {
      mobileTabDocs.classList.remove("active");
      mobileTabIde.classList.add("active");
      contentArea.classList.add("view-ide");
      contentArea.classList.remove("view-docs");
      // Focus input field when entering terminal tab
      if (activeWorkspaceTab === "terminal") {
        terminalInput.focus();
      }
    }
  }

  // Focus terminal input if clicking anywhere inside the terminal area
  viewTerminal.addEventListener("click", () => {
    terminalInput.focus();
  });

  // Theme Toggle (Light/Dark mode)
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Initialize Populations
  populateSidebar();
  populateSyntaxTab();
  populateShortcutsTab();
  
  // Select initial topic FCFS
  selectTopic("fork-basic");
  setWorkspaceTab("terminal");
});
