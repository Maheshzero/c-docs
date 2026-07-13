const compiler = {
  // Analyze C code for Turbo C / DOSBox compatibility issues
  compile: function(topicId, code) {
    const errors = [];
    const warnings = [];

    // 1. Check for modern headers not supported in Turbo C (POSIX headers)
    const unsupportedHeaders = [
      { header: "unistd.h", name: "POSIX standard library" },
      { header: "sys/ipc.h", name: "System V IPC" },
      { header: "sys/shm.h", name: "Shared Memory" },
      { header: "sys/msg.h", name: "Message Queues" },
      { header: "dirent.h", name: "POSIX directory streams" },
      { header: "sys/wait.h", name: "POSIX wait APIs" }
    ];

    unsupportedHeaders.forEach(item => {
      const regex = new RegExp(`#include\\s*<${item.header}>`, "i");
      if (regex.test(code)) {
        errors.push({
          line: this.getLineNumber(code, regex),
          msg: `Fatal error: '${item.header}' is a UNIX header. It does not exist in 16-bit MS-DOS (Turbo C).`
        });
      }
    });

    // 2. Check for VLA (Variable Length Array) - specifically "temp[frames]" or similar
    // Check if we declare an array size using a variable inside main
    const vlaRegex = /int\s+\w+\s*\[\s*(frames|pages|np|nf|no_of_process|no_of_blocks|n)\s*\]/i;
    if (vlaRegex.test(code)) {
      errors.push({
        line: this.getLineNumber(code, vlaRegex),
        msg: "Error: Constant expression required. Turbo C (C89) does not support Variable Length Arrays (VLAs). Use a static size like [50] instead."
      });
    }

    // 3. Check for C99 loop variable declaration: for (int i = ...
    const c99LoopRegex = /for\s*\(\s*int\s+\w+\s*=/;
    if (c99LoopRegex.test(code)) {
      errors.push({
        line: this.getLineNumber(code, c99LoopRegex),
        msg: "Error: Declaration of loop variables inside 'for' statement is a C99 feature. In Turbo C, declare variables at the top of the function."
      });
    }

    // 4. Check for variable declarations after statements (C89 restriction)
    // Basic check: if we see an assignment or function call followed by a variable declaration
    // We can do a simple heuristic check, or leave it for specific files.
    
    return {
      success: errors.length === 0,
      errors: errors,
      warnings: warnings
    };
  },

  getLineNumber: function(code, regex) {
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        return i + 1;
      }
    }
    return 1;
  },

  // Runs the interactive terminal simulation of an algorithm
  runSimulation: function(topicId, terminal, onFinish) {
    terminal.clear();
    terminal.writeLine("Turbo C++ Version 3.0");
    terminal.writeLine("Copyright (c) 1990, 1992 by Borland International, Inc.");
    terminal.writeLine("DOSBox emulated environment running code...");
    terminal.writeLine("");

    const sim = this.simulations[topicId];
    if (sim) {
      sim(terminal, onFinish);
    } else {
      terminal.writeLine("No simulation available for this topic.");
      onFinish();
    }
  },

  // Simulations for each of the 13 algorithms
  simulations: {
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
            }, 1000);
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
              // Sort by burst time
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
            }, 1000);
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
                const queue = [...processes];
                
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
              }, 1000);
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
            t.writeLine("\nSorting processes by priority value...");
            setTimeout(() => {
              // Sort by priority value (ascending order, so lower number is higher priority)
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
            }, 1000);
          }
        };
        getBurst(0);
      });
    },

    "first-fit": function(t, done) {
      t.prompt("Enter number of blocks: ", (nbStr) => {
        const nb = parseInt(nbStr) || 3;
        const blocks = [];
        
        const getBlocks = (idx) => {
          if (idx < nb) {
            t.prompt(`Enter size of Block ${idx + 1}: `, (size) => {
              blocks.push(parseInt(size) || 0);
              getBlocks(idx + 1);
            });
          } else {
            t.prompt("Enter number of processes: ", (npStr) => {
              const np = parseInt(npStr) || 3;
              const processes = [];
              
              const getProcesses = (pIdx) => {
                if (pIdx < np) {
                  t.prompt(`Enter size of Process ${pIdx + 1}: `, (size) => {
                    processes.push(parseInt(size) || 0);
                    getProcesses(pIdx + 1);
                  });
                } else {
                  t.writeLine("\nRunning First Fit Memory Allocation...");
                  setTimeout(() => {
                    t.writeLine("\nAfter Allocation:");
                    t.writeLine("Process No\tProcess Size\tBlock Size");
                    
                    // Run first fit logic
                    for (let i = 0; i < np; i++) {
                      let allocatedBlockSize = -1;
                      for (let j = 0; j < nb; j++) {
                        if (blocks[j] >= processes[i]) {
                          allocatedBlockSize = blocks[j];
                          blocks[j] -= processes[i]; // shrink block
                          break;
                        }
                      }
                      if (allocatedBlockSize !== -1) {
                        t.writeLine(`${i + 1}\t\t${processes[i]}\t\t${allocatedBlockSize}`);
                      } else {
                        t.writeLine(`${i + 1}\t\t${processes[i]}\t\tCan't be allocated`);
                      }
                    }
                    done();
                  }, 1000);
                }
              };
              getProcesses(0);
            });
          }
        };
        getBlocks(0);
      });
    },

    "best-fit": function(t, done) {
      t.prompt("Enter number of blocks: ", (nbStr) => {
        const nb = parseInt(nbStr) || 3;
        const blocks = [];
        
        const getBlocks = (idx) => {
          if (idx < nb) {
            t.prompt(`Enter size of Block ${idx + 1}: `, (size) => {
              blocks.push(parseInt(size) || 0);
              getBlocks(idx + 1);
            });
          } else {
            t.prompt("Enter number of processes: ", (npStr) => {
              const np = parseInt(npStr) || 3;
              const processes = [];
              
              const getProcesses = (pIdx) => {
                if (pIdx < np) {
                  t.prompt(`Enter size of Process ${pIdx + 1}: `, (size) => {
                    processes.push(parseInt(size) || 0);
                    getProcesses(pIdx + 1);
                  });
                } else {
                  t.writeLine("\nRunning Best Fit Memory Allocation...");
                  setTimeout(() => {
                    t.writeLine("\nAfter Allocation:");
                    t.writeLine("Process No\tProcess Size\tBlock Size");
                    
                    for (let i = 0; i < np; i++) {
                      let bestIdx = -1;
                      for (let j = 0; j < nb; j++) {
                        if (blocks[j] >= processes[i]) {
                          if (bestIdx === -1) {
                            bestIdx = j;
                          } else if (blocks[bestIdx] > blocks[j]) {
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
                  }, 1000);
                }
              };
              getProcesses(0);
            });
          }
        };
        getBlocks(0);
      });
    },

    "worst-fit": function(t, done) {
      t.prompt("Enter number of blocks: ", (nbStr) => {
        const nb = parseInt(nbStr) || 3;
        const blocks = [];
        
        const getBlocks = (idx) => {
          if (idx < nb) {
            t.prompt(`Enter size of Block ${idx + 1}: `, (size) => {
              blocks.push(parseInt(size) || 0);
              getBlocks(idx + 1);
            });
          } else {
            t.prompt("Enter number of processes: ", (npStr) => {
              const np = parseInt(npStr) || 3;
              const processes = [];
              
              const getProcesses = (pIdx) => {
                if (pIdx < np) {
                  t.prompt(`Enter size of Process ${pIdx + 1}: `, (size) => {
                    processes.push(parseInt(size) || 0);
                    getProcesses(pIdx + 1);
                  });
                } else {
                  t.writeLine("\nRunning Worst Fit Memory Allocation...");
                  setTimeout(() => {
                    t.writeLine("\nAfter Allocation:");
                    t.writeLine("Process No\tProcess Size\tBlock Size");
                    
                    for (let i = 0; i < np; i++) {
                      let worstIdx = -1;
                      for (let j = 0; j < nb; j++) {
                        if (blocks[j] >= processes[i]) {
                          if (worstIdx === -1) {
                            worstIdx = j;
                          } else if (blocks[worstIdx] < blocks[j]) {
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
                  }, 1000);
                }
              };
              getProcesses(0);
            });
          }
        };
        getBlocks(0);
      });
    },

    "prod-cons": function(t, done) {
      t.writeLine("Circular Buffer Size n = 5 slots.");
      const buffer = new Array(5).fill(-1);
      let inIdx = 0;
      let outIdx = 0;
      
      const menu = () => {
        t.writeLine(`Buffer slots: [ ${buffer.map(x => x === -1 ? "_" : x).join(" | ")} ]`);
        t.writeLine(`Indices: IN = ${inIdx}, OUT = ${outIdx}`);
        t.writeLine("1. Produce Item   2. Consume Item   3. Exit");
        t.prompt("Choose option: ", (opt) => {
          if (opt === "1") {
            // Buffer full check
            if ((outIdx + 1) % 5 === inIdx) {
              t.writeLine("Buffer is Full! Baker is sleeping.");
              t.writeLine("");
              menu();
            } else {
              t.prompt("Enter integer item to produce: ", (item) => {
                outIdx = (outIdx + 1) % 5;
                buffer[outIdx] = parseInt(item) || 1;
                t.writeLine(`Produced item: ${buffer[outIdx]} at slot ${outIdx}`);
                t.writeLine("");
                menu();
              });
            }
          } else if (opt === "2") {
            // Buffer empty check
            if (outIdx === inIdx) {
              t.writeLine("Buffer is Empty! Customer is sleeping.");
              t.writeLine("");
              menu();
            } else {
              inIdx = (inIdx + 1) % 5;
              const val = buffer[inIdx];
              buffer[inIdx] = -1; // clear slot
              t.writeLine(`Consumed item: ${val} from slot ${inIdx}`);
              t.writeLine("");
              menu();
            }
          } else {
            t.writeLine("Exiting Producer-Consumer.");
            done();
          }
        });
      };
      menu();
    },

    "fifo-page": function(t, done) {
      t.prompt("Enter the number of Pages: ", (npStr) => {
        const np = parseInt(npStr) || 5;
        const refStr = [];
        
        const getRef = (idx) => {
          if (idx < np) {
            t.prompt(`Enter page value [${idx + 1}]: `, (val) => {
              refStr.push(parseInt(val) || 0);
              getRef(idx + 1);
            });
          } else {
            t.prompt("What are the total number of frames: ", (nfStr) => {
              const nf = parseInt(nfStr) || 3;
              t.writeLine("\nSimulating FIFO Page Replacement...");
              setTimeout(() => {
                const temp = new Array(nf).fill(-1);
                let pagefaults = 0;
                
                for (let m = 0; m < np; m++) {
                  let hit = false;
                  for (let n = 0; n < nf; n++) {
                    if (refStr[m] === temp[n]) {
                      hit = true;
                    }
                  }
                  
                  if (!hit) {
                    temp[pagefaults % nf] = refStr[m];
                    pagefaults++;
                  }
                  
                  t.writeLine(`Ref Page [${refStr[m]}] -> \t[ ${temp.map(x => x === -1 ? "-" : x).join("\t")} ]${!hit ? " (Fault)" : ""}`);
                }
                
                t.writeLine(`\nTotal page faults: ${pagefaults}`);
                done();
              }, 1000);
            });
          }
        };
        getRef(0);
      });
    },

    "lru-page": function(t, done) {
      t.prompt("Enter the number of pages: ", (npStr) => {
        const np = parseInt(npStr) || 5;
        const refStr = [];
        
        const getRef = (idx) => {
          if (idx < np) {
            t.prompt(`Enter page value [${idx + 1}]: `, (val) => {
              refStr.push(parseInt(val) || 0);
              getRef(idx + 1);
            });
          } else {
            t.prompt("Enter the number of frames: ", (nfStr) => {
              const nf = parseInt(nfStr) || 3;
              t.writeLine("\nSimulating LRU Page Replacement...");
              setTimeout(() => {
                const frames = new Array(nf).fill(-1);
                const time = new Array(nf).fill(0);
                let counter = 0;
                let faults = 0;
                
                for (let i = 0; i < np; i++) {
                  counter++;
                  let hitIdx = -1;
                  for (let j = 0; j < nf; j++) {
                    if (frames[j] === refStr[i]) {
                      hitIdx = j;
                      break;
                    }
                  }
                  
                  if (hitIdx !== -1) {
                    time[hitIdx] = counter;
                  } else {
                    // Check for empty slots first
                    let emptyIdx = -1;
                    for (let j = 0; j < nf; j++) {
                      if (frames[j] === -1) {
                        emptyIdx = j;
                        break;
                      }
                    }
                    
                    if (emptyIdx !== -1) {
                      frames[emptyIdx] = refStr[i];
                      time[emptyIdx] = counter;
                      faults++;
                    } else {
                      // LRU replace
                      let lruIdx = 0;
                      let minTime = time[0];
                      for (let j = 1; j < nf; j++) {
                        if (time[j] < minTime) {
                          minTime = time[j];
                          lruIdx = j;
                        }
                      }
                      frames[lruIdx] = refStr[i];
                      time[lruIdx] = counter;
                      faults++;
                    }
                  }
                  
                  t.writeLine(`Ref Page [${refStr[i]}] -> \t[ ${frames.map(x => x === -1 ? "-" : x).join("\t")} ]${hitIdx === -1 ? " (Fault)" : ""}`);
                }
                
                t.writeLine(`\nTotal page faults = ${faults}`);
                done();
              }, 1000);
            });
          }
        };
        getRef(0);
      });
    },

    "bankers": function(t, done) {
      t.prompt("Enter number of processes: ", (npStr) => {
        const np = parseInt(npStr) || 5;
        t.prompt("Enter number of resources: ", (nrStr) => {
          const nr = parseInt(nrStr) || 3;
          t.writeLine(`Using default Bankers matrix allocation for ${np} processes and ${nr} resources.`);
          t.writeLine("Allocation Matrix:");
          t.writeLine("P0: 0 1 0   P1: 2 0 0   P2: 3 0 2   P3: 2 1 1   P4: 0 0 2");
          t.writeLine("Max Matrix:");
          t.writeLine("P0: 7 5 3   P1: 3 2 2   P2: 9 0 2   P3: 2 2 2   P4: 4 3 3");
          t.writeLine("Available Resources:");
          t.writeLine("3 3 2");
          t.writeLine("");
          
          t.writeLine("Calculating Need Matrix (Max - Allocation)...");
          setTimeout(() => {
            t.writeLine("Need Matrix is:");
            t.writeLine("P0: 7 4 3");
            t.writeLine("P1: 1 2 2");
            t.writeLine("P2: 6 0 0");
            t.writeLine("P3: 0 1 1");
            t.writeLine("P4: 4 3 1");
            t.writeLine("");
            t.writeLine("Running banker safety validation algorithm...");
            
            setTimeout(() => {
              t.writeLine("Safe Sequence is: P1 -> P3 -> P4 -> P0 -> P2");
              t.writeLine("System is in SAFE STATE!");
              done();
            }, 1200);
          }, 1000);
        });
      });
    }
  }
};
