// ============================================================
// data.js — Pure Turbo C OS Lab Algorithms Dataset
// Topics, Syntaxes, Shortcuts
// ============================================================

const topicsData = [
  {
    id: "fcfs-sched",
    category: "CPU Scheduling",
    title: "FCFS Scheduling",
    description: "First-Come, First-Served scheduling executes processes in their order of arrival. It is non-preemptive and simple to implement.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Variables and Buffers:</strong> We declare arrays <code>bt[20]</code> (Burst Time), <code>wt[20]</code> (Waiting Time), and <code>tat[20]</code> (Turnaround Time) to store process metrics. The integer <code>n</code> holds the total count of processes.</p>
        <p><strong>2. Initializing the Queue:</strong> The first process in the queue (index 0) has a waiting time of exactly zero: <code>wt[0] = 0</code>, as it executes immediately upon arrival.</p>
        <p><strong>3. Computing Waiting Times:</strong> We use a loop running from index <code>i = 1</code> to <code>n-1</code>. The waiting time for the current process is the sum of the waiting time and burst time of the preceding process: <code>wt[i] = wt[i-1] + bt[i-1]</code>. This builds the timeline sequentially.</p>
        <p><strong>4. Calculating Turnaround Times:</strong> For each process <code>i</code>, the turnaround time is computed by adding its own burst time to its waiting time: <code>tat[i] = wt[i] + bt[i]</code>. This represents the total elapsed time from arrival to completion.</p>
        <p><strong>5. Averages Accumulator:</strong> We sum the elements of <code>wt</code> and <code>tat</code> inside a loop, storing the results in <code>totalWT</code> and <code>totalTAT</code>, then divide by <code>n</code> to find the average values.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>FCFS processes CPU tasks using a simple FIFO queue structure. The CPU execution timeline starts at time 0. Each process holds the CPU until its burst time expires, allowing the next process in the queue to begin execution. This algorithm is prone to the 'convoy effect', where short processes wait a long time behind a single CPU-bound process.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C++ 3.0. Variable declarations must be at the top of the function.</div>`,
    code: `#include <stdio.h>

int main() {
    int bt[20], wt[20], tat[20], n, i;
    float wt_avg = 0, tat_avg = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++) {
        printf("Enter burst time for P%d: ", i + 1);
        scanf("%d", &bt[i]);
    }

    /* First process waits 0 units */
    wt[0] = 0;
    tat[0] = bt[0];
    wt_avg = 0;
    tat_avg = tat[0];

    /* Calculate waiting & turnaround times */
    for (i = 1; i < n; i++) {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
        wt_avg += wt[i];
        tat_avg += tat[i];
    }

    printf("\\nProcess\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n");
    for (i = 0; i < n; i++) {
        printf("P%d\\t\\t%d\\t\\t%d\\t\\t%d\\n", i + 1, bt[i], wt[i], tat[i]);
    }

    printf("\\nAverage Waiting Time: %.2f\\n", wt_avg / n);
    printf("Average Turnaround Time: %.2f\\n", tat_avg / n);

    return 0;
}`
  },

  {
    id: "sjf-sched",
    category: "CPU Scheduling",
    title: "SJF Scheduling",
    description: "Shortest Job First schedules processes based on the length of their burst times. Non-preemptive implementation sorting jobs before execution.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Data Structures:</strong> We maintain arrays for process numbers <code>p[20]</code>, burst times <code>bt[20]</code>, waiting times <code>wt[20]</code>, and turnaround times <code>tat[20]</code>.</p>
        <p><strong>2. Bubble Sort Logic:</strong> To implement SJF, processes must be sorted by burst time. We use nested loops with indices <code>i</code> and <code>j</code>. If <code>bt[i] > bt[j]</code>, we swap their burst times, and crucially, swap their process numbers in <code>p[i]</code> to keep track of process identities.</p>
        <p><strong>3. Sequenced Calculations:</strong> Once sorted, the execution order is determined. The waiting time for the first sorted process is set to zero: <code>wt[0] = 0</code>.</p>
        <p><strong>4. Running Averages:</strong> We compute <code>wt[i] = wt[i-1] + bt[i-1]</code> and <code>tat[i] = wt[i] + bt[i]</code> sequentially. Summing these arrays yields total scheduling overhead, which is divided by <code>n</code>.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>SJF minimizes average waiting time by prioritizing shorter jobs. By running the shortest tasks first, waiting processes complete quickly, reducing queue congestion. The algorithm requires advance knowledge of CPU burst times, which makes it ideal for batch processing systems.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C++ 3.0.</div>`,
    code: `#include <stdio.h>

int main() {
    int p[20], bt[20], wt[20], tat[20], n, i, j, temp;
    float wt_avg = 0, tat_avg = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++) {
        p[i] = i + 1;
        printf("Enter burst time for P%d: ", p[i]);
        scanf("%d", &bt[i]);
    }

    /* Sort processes by burst time (Bubble Sort) */
    for (i = 0; i < n - 1; i++) {
        for (j = i + 1; j < n; j++) {
            if (bt[i] > bt[j]) {
                /* Swap Burst Times */
                temp = bt[i];
                bt[i] = bt[j];
                bt[j] = temp;

                /* Swap Process IDs */
                temp = p[i];
                p[i] = p[j];
                p[j] = temp;
            }
        }
    }

    wt[0] = 0;
    tat[0] = bt[0];
    tat_avg = tat[0];

    for (i = 1; i < n; i++) {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
        wt_avg += wt[i];
        tat_avg += tat[i];
    }

    printf("\\nProcess\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n");
    for (i = 0; i < n; i++) {
        printf("P%d\\t\\t%d\\t\\t%d\\t\\t%d\\n", p[i], bt[i], wt[i], tat[i]);
    }

    printf("\\nAverage Waiting Time: %.2f\\n", wt_avg / n);
    printf("Average Turnaround Time: %.2f\\n", tat_avg / n);

    return 0;
}`
  },

  {
    id: "rr-sched",
    category: "CPU Scheduling",
    title: "Round Robin",
    description: "Round Robin distributes CPU time in equal time slices (quanta) among active processes using a preemptive round-robin queue.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Tracking Remnants:</strong> We keep a copy of the burst times in <code>rem_bt[20]</code>. As execution cycles progress, we decrease values in <code>rem_bt</code> to track remaining execution needs.</p>
        <p><strong>2. Timeline Clock Tracker:</strong> An integer variable <code>sq</code> tracks the accumulated elapsed time (timeline clock). Another counter <code>count</code> counts how many processes have finished execution (when their <code>rem_bt[i] == 0</code>).</p>
        <p><strong>3. Time Slicing Loop:</strong> While <code>count</code> is less than <code>n</code>, the program loops through all processes. If process <code>i</code> has <code>rem_bt[i] > 0</code>, we slice it:
          <ul>
            <li>If <code>rem_bt[i] > tq</code> (Time Quantum), it consumes <code>tq</code> time. We update <code>sq += tq</code> and decrement <code>rem_bt[i] -= tq</code>.</li>
            <li>Else, it finishes. We update <code>sq += rem_bt[i]</code>, set <code>wt[i] = sq - bt[i]</code>, compute turnaround <code>tat[i] = sq</code>, set <code>rem_bt[i] = 0</code>, and increment completed processes: <code>count++</code>.</li>
          </ul>
        </p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Round Robin is designed for time-sharing systems. The algorithm slices process execution cycles using a time quantum. Preemption occurs if a job does not complete within its time slice, moving the process back to the end of the ready queue. This ensures fair distribution of CPU resources.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C++ 3.0. Variable declarations must be grouped at the start of main().</div>`,
    code: `#include <stdio.h>

int main() {
    int bt[20], wt[20], tat[20], rem_bt[20];
    int n, i, tq, count = 0, sq = 0;
    float wt_avg = 0, tat_avg = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++) {
        printf("Enter burst time for P%d: ", i + 1);
        scanf("%d", &bt[i]);
        rem_bt[i] = bt[i]; /* Copy burst times */
    }

    printf("Enter time quantum: ");
    scanf("%d", &tq);

    while (1) {
        int done = 1;
        for (i = 0; i < n; i++) {
            if (rem_bt[i] > 0) {
                done = 0; /* There is a pending process */
                if (rem_bt[i] > tq) {
                    sq += tq;
                    rem_bt[i] -= tq;
                } else {
                    sq += rem_bt[i];
                    wt[i] = sq - bt[i];
                    tat[i] = sq;
                    rem_bt[i] = 0;
                    count++;
                }
            }
        }
        if (done == 1) break;
    }

    printf("\\nProcess\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n");
    for (i = 0; i < n; i++) {
        wt_avg += wt[i];
        tat_avg += tat[i];
        printf("P%d\\t\\t%d\\t\\t%d\\t\\t%d\\n", i + 1, bt[i], wt[i], tat[i]);
    }

    printf("\\nAverage Waiting Time: %.2f\\n", wt_avg / n);
    printf("Average Turnaround Time: %.2f\\n", tat_avg / n);

    return 0;
}`
  },

  {
    id: "priority-sched",
    category: "CPU Scheduling",
    title: "Priority Scheduling",
    description: "Schedules processes based on priority ratings. Lower priority numbers indicate higher scheduling precedence.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Data Fields:</strong> We add an integer array <code>pri[20]</code> to store priority values alongside burst times <code>bt[20]</code> and process indices <code>p[20]</code>.</p>
        <p><strong>2. Priority Ordering:</strong> We sort the process arrays by priority value. A nested bubble-sort comparison <code>pri[i] > pri[j]</code> triggers swaps. When swapping priorities, we also swap burst times and process IDs in their respective arrays.</p>
        <p><strong>3. Execution Sequence:</strong> Once sorted, the execution sequence follows index order. The process at index 0 runs immediately (waiting time = 0).</p>
        <p><strong>4. Final Metrics:</strong> We compute waiting times <code>wt[i] = wt[i-1] + bt[i-1]</code> and turnaround times <code>tat[i] = wt[i] + bt[i]</code>, accumulating totals to determine the averages.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Priority scheduling allocates CPU access based on priority ranks. Higher-priority processes run first. A major drawback of this algorithm is 'starvation', where low-priority processes wait indefinitely. This is resolved in production kernels using 'aging' techniques.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C++ 3.0.</div>`,
    code: `#include <stdio.h>

int main() {
    int p[20], bt[20], pri[20], wt[20], tat[20], n, i, j, temp;
    float wt_avg = 0, tat_avg = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++) {
        p[i] = i + 1;
        printf("Enter burst time for P%d: ", p[i]);
        scanf("%d", &bt[i]);
        printf("Enter priority for P%d (lower = higher priority): ", p[i]);
        scanf("%d", &pri[i]);
    }

    /* Sort processes by priority (Bubble Sort) */
    for (i = 0; i < n - 1; i++) {
        for (j = i + 1; j < n; j++) {
            if (pri[i] > pri[j]) {
                /* Swap Priorities */
                temp = pri[i];
                pri[i] = pri[j];
                pri[j] = temp;

                /* Swap Burst Times */
                temp = bt[i];
                bt[i] = bt[j];
                bt[j] = temp;

                /* Swap Process IDs */
                temp = p[i];
                p[i] = p[j];
                p[j] = temp;
            }
        }
    }

    wt[0] = 0;
    tat[0] = bt[0];
    tat_avg = tat[0];

    for (i = 1; i < n; i++) {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
        wt_avg += wt[i];
        tat_avg += tat[i];
    }

    printf("\\nProcess\\tPriority\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n");
    for (i = 0; i < n; i++) {
        printf("P%d\\t\\t%d\\t\\t%d\\t\\t%d\\t\\t%d\\n", p[i], pri[i], bt[i], wt[i], tat[i]);
    }

    printf("\\nAverage Waiting Time: %.2f\\n", wt_avg / n);
    printf("Average Turnaround Time: %.2f\\n", tat_avg / n);

    return 0;
}`
  },

  {
    id: "first-fit",
    category: "Memory Allocation",
    title: "First Fit",
    description: "Allocates each process to the first available memory block that is large enough. Simple but can lead to fragmentation.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Memory Structures:</strong> Memory partition sizes are stored in <code>blocks[50]</code>, and memory needs for incoming processes are stored in <code>processes[50]</code>.</p>
        <p><strong>2. Allocation Search Loops:</strong> An outer loop iterates through each process <code>i</code>. For each process, an inner loop scans partitions <code>j</code> from 0 to <code>nb-1</code>.</p>
        <p><strong>3. Match and Deduct:</strong> If <code>blocks[j] >= processes[i]</code>, we allocate the process here. We update <code>allocated = blocks[j]</code>, subtract the requested memory from the partition: <code>blocks[j] -= processes[i]</code>, and immediately exit the inner loop using <code>break</code>.</p>
        <p><strong>4. Output Table:</strong> If a partition was allocated, we print the partition size. If no partition was found, we output 'Can\'t be allocated'.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>First Fit allocates memory partitions sequentially. It assigns a process to the first block of sufficient size. This method is fast but can cause memory fragmentation at the beginning of the partition list.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C.</div>`,
    code: `#include <stdio.h>

int main() {
    int blocks[50], processes[50];
    int nb, np, i, j, allocated;

    printf("Enter number of blocks: ");
    scanf("%d", &nb);
    for (i = 0; i < nb; i++) {
        printf("Enter size of Block %d: ", i + 1);
        scanf("%d", &blocks[i]);
    }

    printf("Enter number of processes: ");
    scanf("%d", &np);
    for (i = 0; i < np; i++) {
        printf("Enter size of Process %d: ", i + 1);
        scanf("%d", &processes[i]);
    }

    printf("\\nAfter Allocation:\\n");
    printf("Process No\\tProcess Size\\tBlock Size\\n");

    for (i = 0; i < np; i++) {
        allocated = -1;
        for (j = 0; j < nb; j++) {
            if (blocks[j] >= processes[i]) {
                allocated = blocks[j];
                blocks[j] -= processes[i];
                break;
            }
        }
        if (allocated != -1)
            printf("%d\\t\\t%d\\t\\t%d\\n", i + 1, processes[i], allocated);
        else
            printf("%d\\t\\t%d\\t\\tCan't be allocated\\n", i + 1, processes[i]);
    }
    return 0;
}`
  },

  {
    id: "best-fit",
    category: "Memory Allocation",
    title: "Best Fit",
    description: "Allocates each process to the smallest block that is still large enough. Minimizes wasted space but requires a full scan.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Best Match Index:</strong> For each process <code>i</code>, we initialize a tracker variable <code>bestIdx = -1</code> to store the best block index found so far.</p>
        <p><strong>2. Full Partition Scan:</strong> The inner loop scans all partitions <code>j</code>. If partition <code>j</code> fits (<code>blocks[j] >= processes[i]</code>), we compare it:
          <ul>
            <li>If <code>bestIdx == -1</code>, this is our first potential fit. We set <code>bestIdx = j</code>.</li>
            <li>Else, if the current block is smaller than the previously tracked best fit (<code>blocks[bestIdx] > blocks[j]</code>), we update <code>bestIdx = j</code> to minimize fragmentation.</li>
          </ul>
        </p>
        <p><strong>3. Executing Allocation:</strong> After scanning all partitions, if <code>bestIdx != -1</code>, we assign the process, subtract the memory: <code>blocks[bestIdx] -= processes[i]</code>, and print the allocated partition size.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Best Fit searches for the partition that minimizes leftover space. It requires scanning the entire partition table, which increases processing time. This approach can also leave behind very small, unusable fragments of free memory.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C.</div>`,
    code: `#include <stdio.h>

int main() {
    int blocks[50], processes[50];
    int nb, np, i, j, bestIdx;

    printf("Enter number of blocks: ");
    scanf("%d", &nb);
    for (i = 0; i < nb; i++) {
        printf("Enter size of Block %d: ", i + 1);
        scanf("%d", &blocks[i]);
    }

    printf("Enter number of processes: ");
    scanf("%d", &np);
    for (i = 0; i < np; i++) {
        printf("Enter size of Process %d: ", i + 1);
        scanf("%d", &processes[i]);
    }

    printf("\\nAfter Allocation:\\n");
    printf("Process No\\tProcess Size\\tBlock Size\\n");

    for (i = 0; i < np; i++) {
        bestIdx = -1;
        for (j = 0; j < nb; j++) {
            if (blocks[j] >= processes[i]) {
                if (bestIdx == -1 || blocks[bestIdx] > blocks[j])
                    bestIdx = j;
            }
        }
        if (bestIdx != -1) {
            printf("%d\\t\\t%d\\t\\t%d\\n", i + 1, processes[i], blocks[bestIdx]);
            blocks[bestIdx] -= processes[i];
        } else {
            printf("%d\\t\\t%d\\t\\tCan't be allocated\\n", i + 1, processes[i]);
        }
    }
    return 0;
}`
  },

  {
    id: "worst-fit",
    category: "Memory Allocation",
    title: "Worst Fit",
    description: "Allocates each process to the largest available block. Leaves the largest leftover fragments, potentially useful for future allocations.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Maximum Gap Index:</strong> We initialize <code>worstIdx = -1</code> to track the largest block partition that can accommodate the current process.</p>
        <p><strong>2. Maximizing left over memory:</strong> We scan all partition partitions. If a partition fits, we check:
          <ul>
            <li>If <code>worstIdx == -1</code>, we store this block index.</li>
            <li>Else, if the current block size is larger than the previously tracked worst fit (<code>blocks[worstIdx] < blocks[j]</code>), we update <code>worstIdx = j</code>.</li>
          </ul>
        </p>
        <p><strong>3. Subtracting allocation:</strong> If <code>worstIdx</code> is valid after the scan, we allocate the process, subtract the memory size: <code>blocks[worstIdx] -= processes[i]</code>, and move to the next process.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Worst Fit allocates processes to the largest available memory partition. The goal is to leave behind a leftover block that is large enough to be useful for subsequent processes. Like Best Fit, it requires scanning the entire partition list.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C.</div>`,
    code: `#include <stdio.h>

int main() {
    int blocks[50], processes[50];
    int nb, np, i, j, worstIdx;

    printf("Enter number of blocks: ");
    scanf("%d", &nb);
    for (i = 0; i < nb; i++) {
        printf("Enter size of Block %d: ", i + 1);
        scanf("%d", &blocks[i]);
    }

    printf("Enter number of processes: ");
    scanf("%d", &np);
    for (i = 0; i < np; i++) {
        printf("Enter size of Process %d: ", i + 1);
        scanf("%d", &processes[i]);
    }

    printf("\\nAfter Allocation:\\n");
    printf("Process No\\tProcess Size\\tBlock Size\\n");

    for (i = 0; i < np; i++) {
        worstIdx = -1;
        for (j = 0; j < nb; j++) {
            if (blocks[j] >= processes[i]) {
                if (worstIdx == -1 || blocks[worstIdx] < blocks[j])
                    worstIdx = j;
            }
        }
        if (worstIdx != -1) {
            printf("%d\\t\\t%d\\t\\t%d\\n", i + 1, processes[i], blocks[worstIdx]);
            blocks[worstIdx] -= processes[i];
        } else {
            printf("%d\\t\\t%d\\t\\tCan't be allocated\\n", i + 1, processes[i]);
        }
    }
    return 0;
}`
  },

  {
    id: "prod-cons",
    category: "Synchronization",
    title: "Producer-Consumer",
    description: "Simulates a circular buffer shared between a producer and consumer. Demonstrates semaphore-based synchronization concepts.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Bounded Buffer Setup:</strong> The queue is implemented as a fixed-size array: <code>buffer[5]</code>, with a capacity limit defined by <code>n = 5</code>. We track operations using read/write pointers: <code>in</code> (write position) and <code>out</code> (read position).</p>
        <p><strong>2. Check for Buffer Full:</strong> Before adding an item, we check if the next write position matches the read position: <code>if ((out + 1) % n == in)</code>. If true, the buffer is full, and the write operation is blocked.</p>
        <p><strong>3. Write and Wrap Around:</strong> If space is available, the program prompts for input, moves the write pointer forward using modulo arithmetic: <code>out = (out + 1) % n</code>, and stores the item at that index.</p>
        <p><strong>4. Check for Buffer Empty:</strong> Before removing an item, we check if the pointers match: <code>if (out == in)</code>. If true, the buffer is empty, and the read operation is blocked.</p>
        <p><strong>5. Read and Wrap Around:</strong> If items exist, the program moves the read pointer forward: <code>in = (in + 1) % n</code>, retrieves the item, and clears the read slot.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>This program uses modulo arithmetic to implement a circular queue. This structure allows memory reuse without shifting elements. In standard operating systems, semaphores and mutexes are used to coordinate access between producer and consumer processes.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Pure C implementation. Fully compatible with Turbo C++ 3.0.</div>`,
    code: `#include <stdio.h>
#define n 5

int buffer[n];
int in = 0, out = 0;

void produce() {
    int item;
    if ((out + 1) % n == in) {
        printf("Buffer is Full! Baker is sleeping.\\n");
        return;
    }
    printf("Enter integer item to produce: ");
    scanf("%d", &item);
    out = (out + 1) % n;
    buffer[out] = item;
    printf("Produced item: %d at slot %d\\n", buffer[out], out);
}

void consume() {
    if (out == in) {
        printf("Buffer is Empty! Customer is sleeping.\\n");
        return;
    }
    in = (in + 1) % n;
    printf("Consumed item: %d from slot %d\\n", buffer[in], in);
    buffer[in] = 0;
}

int main() {
    int choice;
    while (1) {
        printf("\\n1. Produce Item   2. Consume Item   3. Exit\\n");
        printf("Choose option: ");
        scanf("%d", &choice);
        if (choice == 1) produce();
        else if (choice == 2) consume();
        else break;
    }
    return 0;
}`
  },

  {
    id: "fifo-page",
    category: "Page Replacement",
    title: "FIFO Page Replacement",
    description: "The oldest page in memory is replaced first. Simple to implement but can suffer from Bélády's anomaly.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Memory Frames Buffer:</strong> The array <code>temp[10]</code> simulates physical memory slots, initialized to <code>-1</code> to indicate empty frames.</p>
        <p><strong>2. Scan for Hit:</strong> For each incoming page in the reference string, we scan the frame buffer. If a match is found (<code>refStr[m] == temp[j]</code>), we mark it as a hit (<code>hit = 1</code>) and skip replacement.</p>
        <p><strong>3. Queue-Based Eviction:</strong> If a page fault occurs, we determine the replacement index using modulo arithmetic: <code>pagefaults % nf</code>, where <code>nf</code> is the number of frames. This replaces the oldest page in the queue.</p>
        <p><strong>4. Tracking Faults:</strong> The page fault counter is incremented, and we output the current frame state to display the replacement process.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>FIFO page replacement manages memory frames as a queue. The page at the head of the queue is evicted when a page fault occurs and all frames are full. This algorithm can experience Bélády's anomaly, where adding more memory frames increases the page fault rate.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C++ 3.0.</div>`,
    code: `#include <stdio.h>

int main() {
    int refStr[50], temp[10];
    int np, nf, i, j, m, pagefaults = 0;
    int hit;

    printf("Enter the number of Pages: ");
    scanf("%d", &np);
    for (i = 0; i < np; i++) {
        printf("Enter page value [%d]: ", i + 1);
        scanf("%d", &refStr[i]);
    }

    printf("What are the total number of frames: ");
    scanf("%d", &nf);

    for (i = 0; i < nf; i++) temp[i] = -1;

    printf("\\n");
    for (m = 0; m < np; m++) {
        hit = 0;
        for (j = 0; j < nf; j++) {
            if (refStr[m] == temp[j]) { hit = 1; break; }
        }
        if (!hit) {
            temp[pagefaults % nf] = refStr[m];
            pagefaults++;
            printf("Ref Page [%d] -> Fault\\n", refStr[m]);
        } else {
            printf("Ref Page [%d] -> Hit\\n", refStr[m]);
        }
    }

    printf("\\nTotal page faults: %d\\n", pagefaults);
    return 0;
}`
  },

  {
    id: "lru-page",
    category: "Page Replacement",
    title: "LRU Page Replacement",
    description: "Replaces the page that has not been used for the longest period of time. Gives better performance than FIFO but requires tracking usage history.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Last-Used Timestamps:</strong> We maintain an array <code>t[10]</code> to store access order timestamps for each frame. An integer counter <code>counter</code> is incremented with each page reference.</p>
        <p><strong>2. Handling a Hit:</strong> If the page is already in a frame (<code>hitIdx != -1</code>), we update its access time in <code>t[hitIdx]</code> to the current counter value.</p>
        <p><strong>3. Empty Frame Check:</strong> If the page is missing, we first scan for empty frames. If found, we load the page and set its timestamp.</p>
        <p><strong>4. Least Recently Used Search:</strong> If all frames are full, we scan the timestamp array to find the minimum value: <code>if (t[j] < t[lruIdx])</code>. The index with the smallest value represents the page that has not been accessed for the longest time, which is then evicted.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>LRU approximates optimal page replacement by assuming that pages accessed recently are likely to be accessed again soon. The algorithm evicts the page with the oldest access timestamp. While efficient, it requires hardware support or runtime overhead to track timestamps.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C++ 3.0.</div>`,
    code: `#include <stdio.h>

int main() {
    int refStr[50], frames[10], t[10];
    int np, nf, i, j, faults = 0, counter = 0;
    int hitIdx, emptyIdx, lruIdx;

    printf("Enter the number of pages: ");
    scanf("%d", &np);
    for (i = 0; i < np; i++) {
        printf("Enter page value [%d]: ", i + 1);
        scanf("%d", &refStr[i]);
    }

    printf("Enter the number of frames: ");
    scanf("%d", &nf);
    for (i = 0; i < nf; i++) { frames[i] = -1; t[i] = 0; }

    printf("\\n");
    for (i = 0; i < np; i++) {
        counter++;
        hitIdx = -1;
        for (j = 0; j < nf; j++) {
            if (frames[j] == refStr[i]) { hitIdx = j; break; }
        }

        if (hitIdx != -1) {
            t[hitIdx] = counter;
            printf("Ref Page [%d] -> Hit\\n", refStr[i]);
        } else {
            emptyIdx = -1;
            for (j = 0; j < nf; j++) {
                if (frames[j] == -1) { emptyIdx = j; break; }
            }
            if (emptyIdx != -1) {
                frames[emptyIdx] = refStr[i];
                t[emptyIdx] = counter;
            } else {
                lruIdx = 0;
                for (j = 1; j < nf; j++)
                    if (t[j] < t[lruIdx]) lruIdx = j;
                frames[lruIdx] = refStr[i];
                t[lruIdx] = counter;
            }
            faults++;
            printf("Ref Page [%d] -> Fault\\n", refStr[i]);
        }
    }

    printf("\\nTotal page faults = %d\\n", faults);
    return 0;
}`
  },

  {
    id: "bankers",
    category: "Deadlock Avoidance",
    title: "Banker's Algorithm",
    description: "Determines if a system is in a safe state by computing a safe sequence using the Banker's safety algorithm.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Resource Matrices:</strong> We declare matrices <code>alloc[10][10]</code> (allocated resources), <code>max[10][10]</code> (maximum requirements), and <code>need[10][10]</code> (remaining needs: <code>max - alloc</code>). The array <code>avail[10]</code> tracks available system resources.</p>
        <p><strong>2. Completion Flags:</strong> The array <code>finish[10]</code> tracks process completion, initialized to <code>0</code> (not finished) for all processes.</p>
        <p><strong>3. Safety Evaluation Loop:</strong> We loop up to <code>np</code> times to find a process that can execute. A process is eligible if it is not finished (<code>!finish[i]</code>) and its resource needs do not exceed available resources: <code>need[i][j] <= avail[j]</code> for all resource types <code>j</code>.</p>
        <p><strong>4. Allocation Release:</strong> When an eligible process completes, we reclaim its allocated resources: <code>avail[j] += alloc[i][j]</code>, mark it finished (<code>finish[i] = 1</code>), and add it to the safe sequence.</p>
        <p><strong>5. Safety Verification:</strong> If a full loop execution occurs without finding any eligible process, the system cannot guarantee safe execution, and we report a potential deadlock risk.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>The Banker's algorithm is a deadlock avoidance method. It models resource allocation requests to check if granting them would leave the system in a safe state. A state is safe if there is at least one sequence in which all processes can run to completion.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with Turbo C++ 3.0. Max array dimension is 10x10.</div>`,
    code: `#include <stdio.h>

int main() {
    int alloc[10][10], max[10][10], need[10][10], avail[10];
    int finish[10], safeSeq[10];
    int np, nr, i, j, k, count = 0;

    printf("Enter number of processes: ");
    scanf("%d", &np);
    printf("Enter number of resources: ");
    scanf("%d", &nr);

    printf("Enter Allocation matrix:\\n");
    for (i = 0; i < np; i++)
        for (j = 0; j < nr; j++)
            scanf("%d", &alloc[i][j]);

    printf("Enter Max matrix:\\n");
    for (i = 0; i < np; i++)
        for (j = 0; j < nr; j++)
            scanf("%d", &max[i][j]);

    printf("Enter Available resources:\\n");
    for (j = 0; j < nr; j++) scanf("%d", &avail[j]);

    for (i = 0; i < np; i++) {
        finish[i] = 0;
        for (j = 0; j < nr; j++)
            need[i][j] = max[i][j] - alloc[i][j];
    }

    while (count < np) {
        int found = 0;
        for (i = 0; i < np; i++) {
            if (!finish[i]) {
                int ok = 1;
                for (j = 0; j < nr; j++)
                    if (need[i][j] > avail[j]) { ok = 0; break; }
                if (ok) {
                    for (j = 0; j < nr; j++) avail[j] += alloc[i][j];
                    safeSeq[count++] = i;
                    finish[i] = 1;
                    found = 1;
                }
            }
        }
        if (!found) { printf("System is NOT in safe state!\\n"); return 0; }
    }

    printf("Safe Sequence is: ");
    for (k = 0; k < np; k++)
        printf("P%d%s", safeSeq[k], k < np - 1 ? " -> " : "\\n");
    printf("System is in SAFE STATE!\\n");
    return 0;
}`
  }
];

const syntaxesData = {
  description: "C Standard Library calls and operations commonly used in algorithmic OS Lab programs.",
  items: [
    {
      id: "syn-printf",
      title: "printf()",
      syntax: "#include <stdio.h>\nint printf(const char *format, ...);",
      desc: "Prints formatted output to stdout. Format specifiers: %d (integer), %f (float), \\tab (tabulator), \\n (newline)."
    },
    {
      id: "syn-scanf",
      title: "scanf()",
      syntax: "#include <stdio.h>\nint scanf(const char *format, ...);",
      desc: "Reads formatted input from stdin. Requires passing addresses of variables: scanf(\"%d\", &variable)."
    },
    {
      id: "syn-modulo",
      title: "Modulo Operator (%)",
      syntax: "result = dividend % divisor;",
      desc: "Returns the integer remainder of division. Crucial in circular queues and FIFO buffers: index = (index + 1) % size."
    },
    {
      id: "syn-for-loop",
      title: "C89 Loop Structure",
      syntax: "int i;\nfor (i = 0; i < n; i++) {\n    /* code */\n}",
      desc: "Turbo C follows the C89 standard. Loop control variables must be declared at the top of the function, not within the for statement itself."
    }
  ]
};

const shortcutsData = {
  description: "Keyboard shortcuts used in the simulated Turbo C++ 3.0 IDE.",
  shortcuts: [
    { key: "F2", action: "Save", desc: "Simulates saving the source file to C:\\TC\\BIN\\ directory." },
    { key: "F3", action: "Open", desc: "Triggers a simulated file selection dialog." },
    { key: "Alt + F9", action: "Compile", desc: "Runs static code checks for Turbo C compatibility issues (Unix calls, VLAs, C99 style loops)." },
    { key: "F9", action: "Compile (Quick)", desc: "Quick compile shortcut." },
    { key: "Ctrl + F9", action: "Run", desc: "Compiles and executes the algorithm inside the simulated DOSBox terminal." },
    { key: "Alt + F5", action: "User Screen", desc: "Toggles between the editor and terminal output screen." },
    { key: "ESC", action: "Return/Close", desc: "Closes the current terminal overlay or compiler message window." }
  ],
  mismatches: [
    {
      title: "Variable Length Arrays (VLAs) in C89",
      desc: "Turbo C follows C89 which does not support Variable Length Arrays (e.g. declaring int arr[n] where n is a runtime variable). Always define arrays with a fixed upper limit constant (e.g. int arr[50]) or allocate memory dynamically."
    },
    {
      title: "Loop Declarations",
      desc: "Declaring loop counters directly inside the loop structure (e.g. for (int i = 0; i < n; i++)) is a C99 standard feature. In Turbo C, all variables must be declared at the top of the scope block."
    },
    {
      title: "Data Type Limits",
      desc: "In 16-bit DOS (Turbo C), the default 'int' is 16-bit, with values ranging from -32,768 to 32,767. If your calculation can exceed this range, declare variables as 'long int' (32-bit)."
    }
  ]
};
