const compiler = {
  // Analyze C code for Linux GCC compatibility, syntax errors, and logical bugs
  compile: function(topicId, code) {
    const errors = [];
    const warnings = [];
    const smartReports = [];

    // --- Standard GCC-style checks ---
    // Strip block comments /* ... */ while preserving newlines to keep line count accurate
    let cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      return match.replace(/[^\r\n]/g, " ");
    });

    const lines = cleanCode.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Strip trailing line comments
      const doubleSlashIdx = line.indexOf("//");
      if (doubleSlashIdx !== -1) {
        line = line.substring(0, doubleSlashIdx).trim();
      }
      
      // Skip empty lines, preprocessors
      if (line && 
          !line.startsWith("#") && 
          !line.endsWith(";") && 
          !line.endsWith("{") && 
          !line.endsWith("}") && 
          !line.endsWith(",") && 
          !line.endsWith(")") && 
          !line.endsWith(":") && 
          !line.startsWith("for") && 
          !line.startsWith("if") && 
          !line.startsWith("while") && 
          !line.startsWith("void") && 
          !line.startsWith("int main") &&
          !line.startsWith("else")) {
        errors.push({
          line: i + 1,
          msg: `error: expected ';' before end of line`
        });
      }
    }

    // Implicit declarations check
    if (code.includes("fork") && !/#include\s*<unistd.h>/i.test(code)) {
      warnings.push({
        line: 1,
        msg: `warning: implicit declaration of function 'fork' [-Wimplicit-function-declaration]`
      });
    }
    if (code.includes("execv") && !/#include\s*<unistd.h>/i.test(code)) {
      warnings.push({
        line: 1,
        msg: `warning: implicit declaration of function 'execv' [-Wimplicit-function-declaration]`
      });
    }
    if (code.includes("opendir") && !/#include\s*<dirent.h>/i.test(code)) {
      warnings.push({
        line: 1,
        msg: `warning: implicit declaration of function 'opendir' [-Wimplicit-function-declaration]`
      });
    }
    if (code.includes("stat") && !/#include\s*<sys\/stat.h>/i.test(code)) {
      warnings.push({
        line: 1,
        msg: `warning: implicit declaration of function 'stat' [-Wimplicit-function-declaration]`
      });
    }
    if (code.includes("shmget") && !/#include\s*<sys\/shm.h>/i.test(code)) {
      warnings.push({
        line: 1,
        msg: `warning: implicit declaration of function 'shmget' [-Wimplicit-function-declaration]`
      });
    }
    if (code.includes("msgget") && !/#include\s*<sys\/msg.h>/i.test(code)) {
      warnings.push({
        line: 1,
        msg: `warning: implicit declaration of function 'msgget' [-Wimplicit-function-declaration]`
      });
    }

    // --- SMART COMPILER STATIC ANALYSIS ---

    // 1. Bracket & Parentheses Mismatch (using state machine to ignore comments/strings)
    let curlyCount = 0, parenCount = 0, squareCount = 0;
    let inString = false;
    let inChar = false;
    let inLineComment = false;
    let inBlockComment = false;
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const nextChar = code[i + 1] || "";
      
      if (inBlockComment) {
        if (char === '*' && nextChar === '/') {
          inBlockComment = false;
          i++;
        }
        continue;
      }
      if (inLineComment) {
        if (char === '\n' || char === '\r') {
          inLineComment = false;
        }
        continue;
      }
      if (inString) {
        if (char === '\\') {
          i++;
        } else if (char === '"') {
          inString = false;
        }
        continue;
      }
      if (inChar) {
        if (char === '\\') {
          i++;
        } else if (char === "'") {
          inChar = false;
        }
        continue;
      }
      
      if (char === '/' && nextChar === '*') {
        inBlockComment = true;
        i++;
        continue;
      }
      if (char === '/' && nextChar === '/') {
        inLineComment = true;
        i++;
        continue;
      }
      if (char === '"') {
        inString = true;
        continue;
      }
      if (char === "'") {
        inChar = true;
        continue;
      }
      
      if (char === '{') curlyCount++;
      else if (char === '}') curlyCount--;
      else if (char === '(') parenCount++;
      else if (char === ')') parenCount--;
      else if (char === '[') squareCount++;
      else if (char === ']') squareCount--;
    }
    
    if (curlyCount !== 0) {
      smartReports.push({
        type: "error",
        msg: `mismatched curly braces '{ }' (found ${curlyCount > 0 ? "unclosed open brace" : "extra closing brace"})`
      });
    }
    if (parenCount !== 0) {
      smartReports.push({
        type: "error",
        msg: `mismatched parentheses '( )' (found ${parenCount > 0 ? "unclosed open parenthesis" : "extra closing parenthesis"})`
      });
    }
    if (squareCount !== 0) {
      smartReports.push({
        type: "error",
        msg: `mismatched square brackets '[ ]'`
      });
    }

    // 2. Unclosed quotes check
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const doubleSlashIdx = line.indexOf("//");
      if (doubleSlashIdx !== -1) {
        line = line.substring(0, doubleSlashIdx);
      }
      // Strip char literals to prevent single quote mismatches (e.g. '\'')
      line = line.replace(/'(?:[^'\\]|\\.)*'/g, " ");
      
      const doubleQuotesCount = (line.match(/"/g) || []).length;
      if (doubleQuotesCount % 2 !== 0) {
        smartReports.push({
          line: i + 1,
          type: "error",
          msg: `unclosed double quote character (")`
        });
      }
    }

    // 3. Bad control flows (e.g. if x == 0)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("if ") || line.startsWith("if(")) {
        // check if has parenthesis after if
        if (!/\bif\s*\(/i.test(line)) {
          smartReports.push({
            line: i + 1,
            type: "error",
            msg: `syntax error: 'if' condition must be enclosed in parentheses (e.g., 'if (condition)')`
          });
        }
      }
      if (line.startsWith("while ") || line.startsWith("while(")) {
        if (!/\bwhile\s*\(/i.test(line)) {
          smartReports.push({
            line: i + 1,
            type: "error",
            msg: `syntax error: 'while' condition must be enclosed in parentheses`
          });
        }
      }
    }

    // 4. Uninitialized Variables & Undeclared Variables Analysis
    const declaredVars = new Set();
    const initializedVars = new Set();
    const usedVars = [];

    // Simple C regex parser for variable declarations
    // Matches: int x, y = 10, z;
    const typeRegex = /\b(int|float|double|char|pid_t)\s+([^;]+);/;
    lines.forEach((line, lineIdx) => {
      const match = line.match(typeRegex);
      if (match) {
        const decls = match[2].split(",");
        decls.forEach(decl => {
          const parts = decl.split("=");
          const varName = parts[0].trim().replace(/^\*+/, ""); // strip pointer prefix
          if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
            declaredVars.add(varName);
            if (parts[1]) {
              initializedVars.add(varName);
            }
          }
        });
      }
    });

    // Parse usage
    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed.startsWith("/*")) return;

      // Check assignments like: x = 10; or scanf("%d", &x);
      declaredVars.forEach(vName => {
        // match variable on the left side of assignments
        const assignRegex = new RegExp(`\\b${vName}\\s*=[^=]`);
        const scanfRegex = new RegExp(`&${vName}\\b`);
        if (assignRegex.test(line) || scanfRegex.test(line)) {
          initializedVars.add(vName);
        }

        // match usage on right side or inside function args
        const useRegex = new RegExp(`[^&a-zA-Z0-9_]${vName}\\b`);
        if (useRegex.test(line) && !line.includes(`${vName} =`) && !line.includes(`&${vName}`)) {
          usedVars.push({ name: vName, line: lineIdx + 1 });
        }
      });
    });

    // Generate uninitialized warnings
    usedVars.forEach(usage => {
      if (!initializedVars.has(usage.name)) {
        smartReports.push({
          line: usage.line,
          type: "warning",
          msg: `variable '${usage.name}' may be used uninitialized in this function`
        });
        // Avoid duplicate warnings for same variable
        initializedVars.add(usage.name);
      }
    });

    // 5. Infinite Loops Check (while(1) / for(;;))
    let inInfiniteLoop = false;
    let loopStartLine = 0;
    let hasExitCondition = false;
    let braceLevel = 0;

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      if (/\bwhile\s*\(\s*1\s*\)/i.test(trimmed) || /\bfor\s*\(\s*;\s*;\s*\)/i.test(trimmed)) {
        inInfiniteLoop = true;
        loopStartLine = lineIdx + 1;
        hasExitCondition = false;
        braceLevel = 0;
      }

      if (inInfiniteLoop) {
        if (trimmed.includes("{")) braceLevel++;
        if (trimmed.includes("}")) {
          braceLevel--;
          if (braceLevel <= 0) {
            // reached loop end
            if (!hasExitCondition) {
              smartReports.push({
                line: loopStartLine,
                type: "warning",
                msg: `infinite loop detected: loop has no apparent exit condition (break, return, or exit)`
              });
            }
            inInfiniteLoop = false;
          }
        }
        if (/\b(break|return|exit)\b/.test(trimmed)) {
          hasExitCondition = true;
        }
      }
    });

    // 6. Unreachable Code
    let afterUnreachableCmd = false;
    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      if (afterUnreachableCmd) {
        if (trimmed && trimmed !== "}" && !trimmed.startsWith("case") && !trimmed.startsWith("default")) {
          smartReports.push({
            line: lineIdx + 1,
            type: "warning",
            msg: `unreachable code: statement is located after a return, exit, or execv call`
          });
          afterUnreachableCmd = false; // report once per block
        }
      }
      if (/\b(return|exit|execv)\b/.test(trimmed)) {
        afterUnreachableCmd = true;
      }
      if (trimmed.includes("}")) {
        afterUnreachableCmd = false;
      }
    });

    // 7. IPC/Threading Mismatch Warnings
    if (code.includes("pthread_join") && !code.includes("pthread_create")) {
      smartReports.push({
        type: "warning",
        msg: `threading bug: 'pthread_join' is called but 'pthread_create' was not found`,
        hint: `Add '#include <pthread.h>' at top of file and compile with: gcc -pthread program.c -o program`
      });
    }
    if ((code.includes("shmat") || code.includes("shmdt")) && !code.includes("shmget")) {
      smartReports.push({
        type: "warning",
        msg: `IPC bug: shared memory attachment/detachment called without a preceding 'shmget'`,
        hint: `Call shmget() first to create/get the shared memory segment before attaching with shmat()`
      });
    }

    return {
      success: errors.length === 0,
      errors: errors,
      warnings: warnings,
      smartReports: smartReports
    };
  },

  // Runs the interactive terminal simulation of an algorithm
  runSimulation: function(topicId, code, terminal, onFinish) {
    const sim = this.simulations[topicId];
    if (sim) {
      sim(terminal, onFinish);
    } else if (code) {
      // Sandbox simulation!
      terminal.writeLine("Executing compiled sandbox binary...");
      terminal.writeLine("Analyzing code capabilities...");
      setTimeout(() => {
        if (code.includes("fork")) {
          terminal.writeLine("- Found fork() process spawning logic!");
          terminal.writeLine("- Simulating process lifecycle...");
          terminal.writeLine("PID of parent is 6128");
          terminal.writeLine("PID of parent of parent is 2997");
          terminal.writeLine("PID of child is 6129");
          terminal.writeLine("PID of parent of child is 6128");
          terminal.writeLine("Process completed successfully.");
        } else if (code.includes("shmget") || code.includes("shmat")) {
          terminal.writeLine("- Found Shared Memory IPC logic!");
          terminal.writeLine("- Initializing memory segments...");
          terminal.writeLine("Attached segment ID 32768 at address 0x7f9a12bc");
          terminal.writeLine("Data read/write complete.");
        } else if (code.includes("msgget")) {
          terminal.writeLine("- Found Message Queue IPC logic!");
          terminal.writeLine("- Creating queue ID 16384...");
          terminal.writeLine("Messages sent and received successfully.");
        } else if (code.includes("pthread_create")) {
          terminal.writeLine("- Found pthread multithreading logic!");
          terminal.writeLine("- Spawning thread threads...");
          terminal.writeLine("Thread 1 executing...");
          terminal.writeLine("Thread 2 executing...");
          terminal.writeLine("Threads joined successfully.");
        } else {
          terminal.writeLine("- Code contains standard main entry point.");
          const printfRegex = /printf\s*\(\s*"(.*?)"\s*(?:,\s*.*?)?\)/g;
          let match;
          let printed = false;
          while ((match = printfRegex.exec(code)) !== null) {
            let outputText = match[1];
            outputText = outputText.replace(/\\n/g, "").replace(/\\t/g, "    ");
            terminal.writeLine(outputText);
            printed = true;
          }
          if (!printed) {
            terminal.writeLine("Program executed successfully with exit code 0.");
          }
        }
        terminal.writeLine("");
        onFinish();
      }, 1000);
    } else {
      terminal.writeLine("No execution logic found.");
      onFinish();
    }
  },

  // Interactive simulations for all 18 OS Lab programs
  simulations: {
    "fork-basic": function(t, done) {
      t.writeLine("PID of parent is 4056");
      t.writeLine("PID of parent of parent is 2997");
      t.writeLine("PID of child is 4057");
      t.writeLine("PID of parent of child is 4056");
      t.writeLine("");
      done();
    },

    "fork-loop": function(t, done) {
      t.writeLine("Simulating concurrent child/parent output...");
      let i = 1;
      const interval = setInterval(() => {
        if (i <= 10) {
          if (Math.random() > 0.5) {
            t.writeLine(`This line is from parent, value = ${i}`);
          } else {
            t.writeLine(`This line is from child, value = ${i}`);
          }
          i++;
        } else {
          clearInterval(interval);
          t.writeLine("***Parent process is done***");
          t.writeLine("***Child process is done***");
          done();
        }
      }, 200);
    },

    "execv-call": function(t, done) {
      t.writeLine("Before execv-----");
      setTimeout(() => {
        t.writeLine("I am first.c called by execv()");
        t.writeLine("");
        done();
      }, 1000);
    },

    "dir-search": function(t, done) {
      t.prompt("Enter directory name: ", (dir) => {
        t.prompt("Enter file name: ", (file) => {
          t.writeLine("Searching directory path...");
          setTimeout(() => {
            const files = ["file.c", "main.c", "record.pdf", "shm.c", "first.c", "second.c"];
            if (files.includes(file.toLowerCase())) {
              t.writeLine(`File name ${file} is present in directory ${dir}`);
            } else {
              t.writeLine(`File name ${file} is not present in directory ${dir}`);
            }
            done();
          }, 800);
        });
      });
    },

    "file-stat": function(t, done) {
      t.prompt("Enter file name: ", (file) => {
        t.writeLine(`stat("${file}", &s) resolving metadata...`);
        setTimeout(() => {
          t.writeLine(`The file name is ${file}`);
          t.writeLine("dir = 0");
          t.writeLine("File size is 472 in bytes");
          t.writeLine("Last modified time is 1455217494 in seconds");
          t.writeLine("Last access time is 1455217499 in seconds");
          t.writeLine("The mode of the file is 100664");
          done();
        }, 800);
      });
    },

    "shm-even-odd": function(t, done) {
      t.writeLine("--- SHARED MEMORY: EVEN / ODD PROCESSOR ---");
      t.prompt("Enter the limit: ", (limitStr) => {
        const limit = parseInt(limitStr) || 3;
        const numbers = [];
        
        const getNum = (idx) => {
          if (idx < limit) {
            t.prompt(`Enter number [${idx + 1}]: `, (num) => {
              numbers.push(parseInt(num) || 0);
              getNum(idx + 1);
            });
          } else {
            t.writeLine("\n[Writer] Writing values to segment Key 5678...");
            t.writeLine("[Reader] Attaching to segment Key 5678...");
            setTimeout(() => {
              t.writeLine("\nEven numbers are:");
              numbers.filter(n => n % 2 === 0).forEach(n => t.writeLine(n));
              t.writeLine("\nOdd numbers are:");
              numbers.filter(n => n % 2 !== 0).forEach(n => t.writeLine(n));
              t.writeLine("\nIts done from client.");
              done();
            }, 1000);
          }
        };
        getNum(0);
      });
    },

    "msg-queue": function(t, done) {
      t.writeLine("--- MESSAGE QUEUE CHAT (Client <-> Server) ---");
      t.writeLine("Enter messages. Type 'exit' to terminate.");
      
      const chatLoop = () => {
        t.prompt("Client: ", (msg) => {
          if (msg.toLowerCase() === "exit") {
            t.writeLine("Closing message queue.");
            done();
            return;
          }
          t.writeLine("Sending message to MQID 16384...");
          setTimeout(() => {
            t.writeLine(`[Server] Received msg: ${msg} from Client`);
            let reply = "Acknowledged.";
            if (msg.toLowerCase() === "hello" || msg.toLowerCase() === "hai") {
              reply = "Hello Client! How are you?";
            }
            t.writeLine(`Server: Enter msg: ${reply}`);
            t.writeLine(`[Client] Received msg: ${reply} from Server`);
            t.writeLine("");
            chatLoop();
          }, 800);
        });
      };
      chatLoop();
    },

    "fcfs-sched": function(t, done) {
      t.writeLine("--- FCFS CPU SCHEDULING SIMULATION ---");
      t.prompt("Enter number of processes: ", (npStr) => {
        const np = parseInt(npStr) || 3;
        const burstTimes = [];
        
        const getBurst = (idx) => {
          if (idx < np) {
            t.prompt(`Enter burst time for P${idx + 1}: `, (bt) => {
              burstTimes.push(parseInt(bt) || 1);
              getBurst(idx + 1);
            });
          } else {
            t.writeLine("\nScheduling CPU Execution via FCFS...");
            setTimeout(() => {
              t.writeLine("\nProcess\tBurst Time\tWaiting Time\tTurnaround Time");
              let wt = 0;
              let totalWT = 0;
              let totalTAT = 0;
              
              for (let i = 0; i < np; i++) {
                const tat = wt + burstTimes[i];
                t.writeLine(`P${i + 1}\t\t${burstTimes[i]}\t\t${wt}\t\t${tat}`);
                totalWT += wt;
                totalTAT += tat;
                wt += burstTimes[i];
              }
              
              t.writeLine(`\nAverage Waiting Time: ${(totalWT / np).toFixed(2)}`);
              t.writeLine(`Average Turnaround Time: ${(totalTAT / np).toFixed(2)}`);
              done();
            }, 800);
          }
        };
        getBurst(0);
      });
    },

    "sjf-sched": function(t, done) {
      t.writeLine("--- SJF CPU SCHEDULING SIMULATION (Non-Preemptive) ---");
      t.prompt("Enter number of processes: ", (npStr) => {
        const np = parseInt(npStr) || 3;
        const processes = [];
        
        const getBurst = (idx) => {
          if (idx < np) {
            t.prompt(`Enter burst time for P${idx + 1}: `, (bt) => {
              processes.push({ id: idx + 1, bt: parseInt(bt) || 1 });
              getBurst(idx + 1);
            });
          } else {
            t.writeLine("\nSorting processes by burst time (SJF)...");
            setTimeout(() => {
              processes.sort((a, b) => a.bt - b.bt);
              t.writeLine("\nProcess\tBurst Time\tWaiting Time\tTurnaround Time");
              let wt = 0;
              let totalWT = 0;
              let totalTAT = 0;
              
              for (let i = 0; i < np; i++) {
                const tat = wt + processes[i].bt;
                t.writeLine(`P${processes[i].id}\t\t${processes[i].bt}\t\t${wt}\t\t${tat}`);
                totalWT += wt;
                totalTAT += tat;
                wt += processes[i].bt;
              }
              
              t.writeLine(`\nAverage Waiting Time: ${(totalWT / np).toFixed(2)}`);
              t.writeLine(`Average Turnaround Time: ${(totalTAT / np).toFixed(2)}`);
              done();
            }, 800);
          }
        };
        getBurst(0);
      });
    },

    "rr-sched": function(t, done) {
      t.writeLine("--- ROUND ROBIN CPU SCHEDULING SIMULATION ---");
      t.prompt("Enter number of processes: ", (npStr) => {
        const np = parseInt(npStr) || 3;
        const processes = [];
        
        const getBurst = (idx) => {
          if (idx < np) {
            t.prompt(`Enter burst time for P${idx + 1}: `, (bt) => {
              processes.push({ id: idx + 1, bt: parseInt(bt) || 1, remaining: parseInt(bt) || 1, wt: 0, tat: 0 });
              getBurst(idx + 1);
            });
          } else {
            t.prompt("Enter time quantum: ", (tqStr) => {
              const tq = parseInt(tqStr) || 2;
              t.writeLine("\nSimulating Round Robin Execution...");
              
              setTimeout(() => {
                let time = 0;
                let doneCount = 0;
                
                t.writeLine("\nGantt Chart Execution Timeline:");
                t.writeLine("--------------------------------");
                
                while (doneCount < np) {
                  let executed = false;
                  for (let i = 0; i < np; i++) {
                    const p = processes[i];
                    if (p.remaining > 0) {
                      executed = true;
                      const slice = Math.min(p.remaining, tq);
                      t.writeLine(`[Time ${time} -> ${time + slice}] P${p.id} executes`);
                      time += slice;
                      p.remaining -= slice;
                      
                      if (p.remaining === 0) {
                        doneCount++;
                        p.tat = time;
                        p.wt = p.tat - p.bt;
                      }
                    }
                  }
                  if (!executed) break;
                }
                
                t.writeLine("--------------------------------");
                t.writeLine("\nProcess\tBurst Time\tWaiting Time\tTurnaround Time");
                let totalWT = 0;
                let totalTAT = 0;
                for (let i = 0; i < np; i++) {
                  const p = processes[i];
                  t.writeLine(`P${p.id}\t\t${p.bt}\t\t${p.wt}\t\t${p.tat}`);
                  totalWT += p.wt;
                  totalTAT += p.tat;
                }
                
                t.writeLine(`\nAverage Waiting Time: ${(totalWT / np).toFixed(2)}`);
                t.writeLine(`Average Turnaround Time: ${(totalTAT / np).toFixed(2)}`);
                done();
              }, 800);
            });
          }
        };
        getBurst(0);
      });
    },

    "priority-sched": function(t, done) {
      t.writeLine("--- PRIORITY CPU SCHEDULING SIMULATION ---");
      t.prompt("Enter number of processes: ", (npStr) => {
        const np = parseInt(npStr) || 3;
        const processes = [];
        
        const getBurst = (idx) => {
          if (idx < np) {
            t.prompt(`Enter burst time for P${idx + 1}: `, (bt) => {
              t.prompt(`Enter priority for P${idx + 1} (lower = higher priority): `, (pri) => {
                processes.push({ id: idx + 1, bt: parseInt(bt) || 1, priority: parseInt(pri) || 1 });
                getBurst(idx + 1);
              });
            });
          } else {
            t.writeLine("\nSorting processes by priority...");
            setTimeout(() => {
              processes.sort((a, b) => a.priority - b.priority);
              t.writeLine("\nProcess\tPriority\tBurst Time\tWaiting Time\tTurnaround Time");
              let wt = 0;
              let totalWT = 0;
              let totalTAT = 0;
              
              for (let i = 0; i < np; i++) {
                const tat = wt + processes[i].bt;
                t.writeLine(`P${processes[i].id}\t\t${processes[i].priority}\t\t${processes[i].bt}\t\t${wt}\t\t${tat}`);
                totalWT += wt;
                totalTAT += tat;
                wt += processes[i].bt;
              }
              
              t.writeLine(`\nAverage Waiting Time: ${(totalWT / np).toFixed(2)}`);
              t.writeLine(`Average Turnaround Time: ${(totalTAT / np).toFixed(2)}`);
              done();
            }, 800);
          }
        };
        getBurst(0);
      });
    },

    "first-fit": function(t, done) {
      t.writeLine("--- FIRST FIT MEMORY ALLOCATION ---");
      t.prompt("Enter number of blocks: ", (nbStr) => {
        const nb = parseInt(nbStr) || 3;
        const blocks = [];
        
        const getBlock = (idx) => {
          if (idx < nb) {
            t.prompt(`Enter size of Block ${idx + 1}: `, (size) => {
              blocks.push(parseInt(size) || 0);
              getBlock(idx + 1);
            });
          } else {
            t.prompt("Enter number of processes: ", (npStr) => {
              const np = parseInt(npStr) || 2;
              const processes = [];
              
              const getProcess = (pidx) => {
                if (pidx < np) {
                  t.prompt(`Enter size of Process ${pidx + 1}: `, (psize) => {
                    processes.push(parseInt(psize) || 0);
                    getProcess(pidx + 1);
                  });
                } else {
                  t.writeLine("\nRunning allocation loop...");
                  setTimeout(() => {
                    t.writeLine("Process No\tProcess Size\tBlock Size");
                    for (let i = 0; i < np; i++) {
                      let allocated = -1;
                      for (let j = 0; j < nb; j++) {
                        if (blocks[j] >= processes[i]) {
                          allocated = blocks[j];
                          blocks[j] -= processes[i];
                          break;
                        }
                      }
                      if (allocated !== -1) {
                        t.writeLine(`${i + 1}\t\t${processes[i]}\t\t${allocated}`);
                      } else {
                        t.writeLine(`${i + 1}\t\t${processes[i]}\t\tCan't be allocated`);
                      }
                    }
                    done();
                  }, 800);
                }
              };
              getProcess(0);
            });
          }
        };
        getBlock(0);
      });
    },

    "best-fit": function(t, done) {
      t.writeLine("--- BEST FIT MEMORY ALLOCATION ---");
      t.prompt("Enter number of blocks: ", (nbStr) => {
        const nb = parseInt(nbStr) || 3;
        const blocks = [];
        
        const getBlock = (idx) => {
          if (idx < nb) {
            t.prompt(`Enter size of Block ${idx + 1}: `, (size) => {
              blocks.push(parseInt(size) || 0);
              getBlock(idx + 1);
            });
          } else {
            t.prompt("Enter number of processes: ", (npStr) => {
              const np = parseInt(npStr) || 2;
              const processes = [];
              
              const getProcess = (pidx) => {
                if (pidx < np) {
                  t.prompt(`Enter size of Process ${pidx + 1}: `, (psize) => {
                    processes.push(parseInt(psize) || 0);
                    getProcess(pidx + 1);
                  });
                } else {
                  t.writeLine("\nRunning best-fit allocation search...");
                  setTimeout(() => {
                    t.writeLine("Process No\tProcess Size\tBlock Size");
                    for (let i = 0; i < np; i++) {
                      let bestIdx = -1;
                      for (let j = 0; j < nb; j++) {
                        if (blocks[j] >= processes[i]) {
                          if (bestIdx === -1 || blocks[bestIdx] > blocks[j]) {
                            bestIdx = j;
                          }
                        }
                      }
                      if (bestIdx !== -1) {
                        t.writeLine(`${i + 1}\t\t${processes[i]}\t\t${blocks[bestIdx]}`);
                        blocks[bestIdx] -= processes[i];
                      } else {
                        t.writeLine(`${i + 1}\t\t${processes[i]}\t\tCan't be allocated`);
                      }
                    }
                    done();
                  }, 800);
                }
              };
              getProcess(0);
            });
          }
        };
        getBlock(0);
      });
    },

    "worst-fit": function(t, done) {
      t.writeLine("--- WORST FIT MEMORY ALLOCATION ---");
      t.prompt("Enter number of blocks: ", (nbStr) => {
        const nb = parseInt(nbStr) || 3;
        const blocks = [];
        
        const getBlock = (idx) => {
          if (idx < nb) {
            t.prompt(`Enter size of Block ${idx + 1}: `, (size) => {
              blocks.push(parseInt(size) || 0);
              getBlock(idx + 1);
            });
          } else {
            t.prompt("Enter number of processes: ", (npStr) => {
              const np = parseInt(npStr) || 2;
              const processes = [];
              
              const getProcess = (pidx) => {
                if (pidx < np) {
                  t.prompt(`Enter size of Process ${pidx + 1}: `, (psize) => {
                    processes.push(parseInt(psize) || 0);
                    getProcess(pidx + 1);
                  });
                } else {
                  t.writeLine("\nRunning worst-fit allocation search...");
                  setTimeout(() => {
                    t.writeLine("Process No\tProcess Size\tBlock Size");
                    for (let i = 0; i < np; i++) {
                      let worstIdx = -1;
                      for (let j = 0; j < nb; j++) {
                        if (blocks[j] >= processes[i]) {
                          if (worstIdx === -1 || blocks[worstIdx] < blocks[j]) {
                            worstIdx = j;
                          }
                        }
                      }
                      if (worstIdx !== -1) {
                        t.writeLine(`${i + 1}\t\t${processes[i]}\t\t${blocks[worstIdx]}`);
                        blocks[worstIdx] -= processes[i];
                      } else {
                        t.writeLine(`${i + 1}\t\t${processes[i]}\t\tCan't be allocated`);
                      }
                    }
                    done();
                  }, 800);
                }
              };
              getProcess(0);
            });
          }
        };
        getBlock(0);
      });
    },

    "prod-cons": function(t, done) {
      t.writeLine("--- PRODUCER-CONSUMER PROBLEM (Shared Memory) ---");
      let inPtr = 0;
      let outPtr = 0;
      let n = 10;
      let count = 0;

      const menu = () => {
        t.writeLine("\n1. Produce Item   2. Consume Item   3. Exit");
        t.prompt("Choose option: ", (choice) => {
          if (choice === "1") {
            if ((outPtr + 1) % n === inPtr) {
              t.writeLine("Buffer is Full! sleep(3) called.");
              menu();
            } else {
              t.prompt("Enter integer item to produce: ", (item) => {
                outPtr = (outPtr + 1) % n;
                t.writeLine(`OUT = ${outPtr} IN = ${inPtr}`);
                menu();
              });
            }
          } else if (choice === "2") {
            if (outPtr === inPtr) {
              t.writeLine("Buffer is Empty! sleep(3) called.");
              menu();
            } else {
              inPtr = (inPtr + 1) % n;
              t.writeLine(`Received item. OUT = ${outPtr} IN = ${inPtr}`);
              menu();
            }
          } else {
            done();
          }
        });
      };
      menu();
    },

    "fifo-page": function(t, done) {
      t.writeLine("--- FIFO PAGE REPLACEMENT ALGORITHM ---");
      t.prompt("Enter the number of Pages: ", (pagesStr) => {
        const pages = parseInt(pagesStr) || 5;
        const refStr = [];
        
        const getPage = (idx) => {
          if (idx < pages) {
            t.prompt(`Value No. [${idx + 1}]: `, (val) => {
              refStr.push(parseInt(val) || 0);
              getPage(idx + 1);
            });
          } else {
            t.prompt("What are the total number of frames: ", (framesStr) => {
              const frames = parseInt(framesStr) || 3;
              t.writeLine("\nSimulating FIFO replacement...");
              setTimeout(() => {
                const temp = Array(frames).fill(-1);
                let faults = 0;
                let s = 0;
                
                for (let m = 0; m < pages; m++) {
                  s = 0;
                  for (let n = 0; n < frames; n++) {
                    if (refStr[m] === temp[n]) {
                      s++;
                      faults--;
                    }
                  }
                  faults++;
                  if ((faults <= frames) && (s === 0)) {
                    temp[m] = refStr[m];
                  } else if (s === 0) {
                    temp[(faults - 1) % frames] = refStr[m];
                  }
                  
                  // Print frame status
                  t.writeLine(temp.map(val => val === -1 ? "-1" : val).join("\t"));
                }
                t.writeLine(`\nTotal page faults: ${faults}`);
                done();
              }, 800);
            });
          }
        };
        getPage(0);
      });
    },

    "lru-page": function(t, done) {
      t.writeLine("--- LRU PAGE REPLACEMENT ALGORITHM ---");
      t.prompt("Enter the number of frames: ", (nfStr) => {
        const nf = parseInt(nfStr) || 3;
        t.prompt("Enter the number of pages: ", (npStr) => {
          const np = parseInt(npStr) || 5;
          const pages = [];
          
          const getPage = (idx) => {
            if (idx < np) {
              t.prompt(`Enter page value [${idx + 1}]: `, (val) => {
                pages.push(parseInt(val) || 0);
                getPage(idx + 1);
              });
            } else {
              t.writeLine("\nSimulating LRU replacement...");
              setTimeout(() => {
                const frames = Array(nf).fill(-1);
                const time = Array(nf).fill(0);
                let faults = 0;
                let counter = 0;
                
                for (let i = 0; i < np; i++) {
                  let flag1 = 0, flag2 = 0;
                  for (let j = 0; j < nf; j++) {
                    if (frames[j] === pages[i]) {
                      counter++;
                      time[j] = counter;
                      flag1 = flag2 = 1;
                      break;
                    }
                  }
                  
                  if (flag1 === 0) {
                    for (let j = 0; j < nf; j++) {
                      if (frames[j] === -1) {
                        counter++;
                        faults++;
                        frames[j] = pages[i];
                        time[j] = counter;
                        flag2 = 1;
                        break;
                      }
                    }
                  }
                  
                  if (flag2 === 0) {
                    // Find LRU position
                    let minTime = time[0], pos = 0;
                    for (let j = 1; j < nf; j++) {
                      if (time[j] < minTime) {
                        minTime = time[j];
                        pos = j;
                      }
                    }
                    counter++;
                    faults++;
                    frames[pos] = pages[i];
                    time[pos] = counter;
                  }
                  
                  t.writeLine(frames.join("\t"));
                }
                t.writeLine(`\nTotal page faults = ${faults}`);
                done();
              }, 800);
            }
          };
          getPage(0);
        });
      });
    },

    "bankers": function(t, done) {
      t.writeLine("--- BANKER'S SAFETY ALGORITHM ---");
      t.prompt("Enter number of processes: ", (npStr) => {
        const np = parseInt(npStr) || 3;
        t.prompt("Enter number of resources: ", (nrStr) => {
          const nr = parseInt(nrStr) || 3;
          t.writeLine("\nConfiguring safety simulator...");
          setTimeout(() => {
            // Mock safety calculations
            t.writeLine("\nNeed Matrix is:");
            t.writeLine("7 4 3");
            t.writeLine("1 2 2");
            t.writeLine("6 0 0");
            t.writeLine("\nSafe Sequence is: P1 -> P3 -> P2");
            t.writeLine("System is in SAFE STATE!");
            done();
          }, 1000);
        });
      });
    }
  }
};
