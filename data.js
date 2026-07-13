// ============================================================
// data.js — Complete 18 OS Lab Algorithms Dataset for Linux
// Topics, Syntaxes, "How to Run" Help
// ============================================================

const topicsData = [
  {
    id: "fork-basic",
    category: "System Calls",
    title: "Basic fork()",
    description: "Using the fork() system call to create a single child process. The child is an exact copy of the parent process, getting its own memory space.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Header Inclusions:</strong> We include <code>&lt;sys/types.h&gt;</code> and <code>&lt;unistd.h&gt;</code> which declare POSIX system calls such as <code>fork()</code> and process identifiers.</p>
        <p><strong>2. Process Creation:</strong> Inside <code>main()</code>, calling <code>fork()</code> instructs the OS kernel to duplicate the current process. The call returns a process ID of type <code>pid_t</code>.</p>
        <p><strong>3. Child Branch Logic:</strong> The variable <code>id</code> is checked. If <code>id == 0</code>, the current code execution is inside the newly spawned child process. The child prints its own PID using <code>getpid()</code> and its parent's PID using <code>getppid()</code>.</p>
        <p><strong>4. Parent Branch Logic:</strong> If <code>id &gt; 0</code>, the execution is inside the parent process. The value of <code>id</code> contains the child's PID. The parent prints its own PID and its parent process's PID.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>When <code>fork()</code> executes, the process splits into two concurrent branches. Both processes start running from the line immediately following the fork call. Because the PID value returned differs (0 in the child, child's PID in the parent), we use conditional branching to guide their execution path.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC. Requires a Linux/POSIX environment to compile.</div>`,
    code: `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>

int main()
{
    pid_t id;
    id = fork();

    if (id == 0)
    {
        printf("PID of child is %d\\n", getpid());
        printf("PID of parent of child is %d\\n", getppid());
    }
    if (id > 0)
    {
        printf("PID of parent is %d\\n", getpid());
        printf("PID of parent of parent is %d\\n", getppid());
    }
    return 0;
}`
  },

  {
    id: "fork-loop",
    category: "System Calls",
    title: "fork() with Loop",
    description: "Demonstrates interleaved parent and child execution using a loop, simulating time-sliced CPU scheduling behavior.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Parallel Functions:</strong> We declare two helper functions <code>ChildProcess()</code> and <code>ParentProcess()</code> to isolate the execution paths of the two processes.</p>
        <p><strong>2. Fork Execution:</strong> After calling <code>fork()</code>, we check the return value. If it is 0, we call <code>ChildProcess()</code>, otherwise the parent calls <code>ParentProcess()</code>.</p>
        <p><strong>3. Loop Interleaving:</strong> Both helper functions run a loop 50 times. Because they run concurrently, their standard output lines interleave as the OS scheduler switches CPU execution slices between them.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>This program demonstrates process concurrency. Since the child and parent run in parallel, their output lines interlace dynamically, illustrating how the OS schedules processes on the CPU in a time-shared environment.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> GCC Linux compliant.</div>`,
    code: `#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>

#define MAX_COUNT 50

void ChildProcess();
void ParentProcess();

int main(void)
{
    pid_t pid;
    pid = fork();
    if (pid == 0)
        ChildProcess();
    else
        ParentProcess();
    return 0;
}

void ChildProcess()
{
    int i;
    for (i = 1; i <= MAX_COUNT; i++)
    {
        printf("This line is from child, value = %d\\n", i);
    }
    printf("***Child process is done***\\n");
}

void ParentProcess()
{
    int i;
    for (i = 1; i <= MAX_COUNT; i++)
    {
        printf("This line is from parent, value = %d\\n", i);
    }
    printf("***Parent process is done***\\n");
}`
  },

  {
    id: "execv-call",
    category: "System Calls",
    title: "execv() Call",
    description: "Demonstrates how execv() replaces the current process image with a new one. The first.c program is called by the second.c program.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Setting Arguments:</strong> In <code>second.c</code>, we declare a string array <code>args[]</code>. The first element is the path to the executable, and the array must end with a <code>NULL</code> pointer.</p>
        <p><strong>2. Executing the Binary:</strong> The function <code>execv(args[0], args)</code> is called. This tells the OS to replace the current running code space with the compiled binary <code>first</code>.</p>
        <p><strong>3. Discarded Statements:</strong> Any lines of code written after the <code>execv()</code> statement are ignored on success, because the original process code is completely overwritten in memory.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p><code>execv</code> is used to execute a separate program inside an existing process. When it executes, the OS loads the new binary file into memory, overlaying the previous instructions, variables, and registers.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Compile first.c as 'first' before running second.c.</div>`,
    code: `// --- first.c ---
#include <stdio.h>
int main()
{
    printf("I am first.c called by execv()");
    printf("\\n");
    return 0;
}

// --- second.c ---
#include <stdio.h>
#include <unistd.h>

int main()
{
    /* A null terminated array of character pointers */
    char *args[] = {"./first", NULL};
    printf("Before execv-----\\n");
    execv(args[0], args);
    
    /* This statement is ignored after execv() */
    printf("Ending-----\\n");
    return 0;
}`
  },

  {
    id: "dir-search",
    category: "System Calls",
    title: "Directory Search",
    description: "Search for a file by name within a given directory using POSIX directory streams (opendir, readdir, closedir).",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Directory Streams:</strong> We declare a directory pointer <code>DIR *dirptr</code> and a structure pointer <code>struct dirent *entry</code> to hold individual file entries.</p>
        <p><strong>2. Opening Streams:</strong> We open the path using <code>opendir(dir)</code>. If it returns <code>NULL</code>, the directory does not exist.</p>
        <p><strong>3. Directory Iteration:</strong> A loop reads entries sequentially: <code>entry = readdir(dirptr)</code>. The name of the file is compared against the target using <code>strcmp()</code>. If a match is found, the search terminates.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>The program queries the OS directory stream. By looping through the returned structures, it reads every filename node in the directory sector and checks for matches.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Requires &lt;dirent.h&gt; header.</div>`,
    code: `#include <string.h>
#include <sys/types.h>
#include <dirent.h>
#include <stdio.h>

int search(char dir[], char file[])
{
    DIR *dirptr;
    struct dirent *entry;
    dirptr = opendir(dir);
    if (dirptr == NULL)
        return 1;
    entry = readdir(dirptr);
    while (entry != NULL)
    {
        if (strcmp(entry->d_name, file) == 0)
            return 0;
        entry = readdir(dirptr);
    }
    return 1;
}

int main()
{
    char s[20], f[20];
    int r;
    printf("Enter directory name: ");
    scanf("%s", s);
    printf("Enter file name: ");
    scanf("%s", f);
    r = search(s, f);
    if (r == 0)
        printf("File name %s is present in directory %s\\n", f, s);
    else
        printf("File name %s is not present in directory %s\\n", f, s);
    return 0;
}`
  },

  {
    id: "file-stat",
    category: "System Calls",
    title: "File stat()",
    description: "Retrieve file metadata (size, permissions, timestamps) using the stat() system call.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Struct stat:</strong> We declare <code>struct stat s</code> to hold file property fields.</p>
        <p><strong>2. Querying metadata:</strong> We pass the filename to <code>stat(f, &amp;s)</code>. The OS queries the file's inode block and populates the struct.</p>
        <p><strong>3. Extracting attributes:</strong> We print file properties: size (<code>s.st_size</code>), modified time (<code>s.st_mtime</code>), access time (<code>s.st_atime</code>), and mode permission octals (<code>s.st_mode</code>).</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>The <code>stat</code> call retrieves filesystem metadata without actually opening the file. This allows fast checking of permissions, directory status, and file size details.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> GCC Linux compliant.</div>`,
    code: `#include <sys/types.h>
#include <sys/stat.h>
#include <stdio.h>

int main()
{
    char f[20];
    struct stat s;
    printf("Enter file name: ");
    scanf("%s", f);
    stat(f, &s);
    printf("The file name is %s\\n", f);
    printf("dir = %d\\n", S_ISDIR(s.st_mode));
    printf("File size is %ld in bytes\\n", s.st_size);
    printf("Last modified time is %ld in seconds\\n", s.st_mtime);
    printf("Last access time is %ld in seconds\\n", s.st_atime);
    printf("The mode of the file is %o\\n", s.st_mode);
    return 0;
}`
  },

  {
    id: "shm-even-odd",
    category: "IPC",
    title: "Shared Memory: Even/Odd",
    description: "Two processes communicate through shared memory. A writer process stores numbers, a reader process reads them and separates even/odd.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. IPC segment allocation:</strong> We allocate memory using <code>shmget(key, size, flags)</code>. The key acts as an identifier.</p>
        <p><strong>2. Attaching segments:</strong> <code>shmat(shmid, NULL, 0)</code> attaches the allocated segment to the process address space. We map this to a pointer variable <code>shm</code>.</p>
        <p><strong>3. Synchronization Handshake:</strong> The writer process inputs numbers and writes them to the memory array. Once done, it writes a termination character <code>*</code> to indicate completion. The reader process waits for this token before printing even and odd values.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Shared memory allows multiple processes to read and write to the same physical memory space. This bypasses file I/O operations, providing high-performance inter-process communication.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Execute the writer first, then compile and run the reader program.</div>`,
    code: `// --- writer.c ---
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <unistd.h>
#define SHMSIZE 27

int main()
{
    int i, a;
    int shmid, n;
    key_t key;
    char *shm, *s;
    key = 5678;
    shmid = shmget(key, SHMSIZE, IPC_CREAT | 0666);
    shm = (char *)shmat(shmid, NULL, 0);
    s = shm;
    printf("Enter the limit: ");
    scanf("%d", &n);
    *s = n;
    s++;
    printf("Enter numbers\\n");
    for (i = 0; i < n; i++)
    {
        scanf("%d", &a);
        *s = a;
        s++;
    }
    while (*shm != '*')
        sleep(1);
    return 0;
}

// --- reader.c ---
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#define SHMSIZE 27

int main()
{
    int shmid, n, a[20], i;
    key_t key;
    char *shm, *s;
    key = 5678;
    shmid = shmget(key, SHMSIZE, 0666);
    shm = (char *)shmat(shmid, NULL, 0);
    s = shm;
    n = *s;
    s++;
    for (i = 0; i < n; i++)
    {
        a[i] = *s;
        s++;
    }
    printf("\\nEven numbers are:\\n");
    for (i = 0; i < n; i++)
    {
        if (a[i] % 2 == 0)
            printf("%d\\n", a[i]);
    }
    printf("\\nOdd numbers are:\\n");
    for (i = 0; i < n; i++)
    {
        if (a[i] % 2 == 1)
            printf("%d\\n", a[i]);
    }
    *shm = '*';
    printf("\\nIts done from client.\\n");
    return 0;
}`
  },

  {
    id: "msg-queue",
    category: "IPC",
    title: "Message Queue Chat",
    description: "A simple client-server chat using POSIX message queues (msgget, msgsnd, msgrcv). Type 'exit' to terminate.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Queue Initialization:</strong> We create a message queue with a key using <code>msgget(key, flags)</code>, returning a queue ID.</p>
        <p><strong>2. Defining Structures:</strong> We declare a structured message buffer <code>struct mymsg</code> containing a long field (message type) and data buffers.</p>
        <p><strong>3. Communication loop:</strong> The client sends messages via <code>msgsnd()</code> and waits for the server response using <code>msgrcv()</code>. The server processes the queue concurrently.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Message queues provide a reliable queue of data packets managed by the OS kernel. Instead of shared memory, the OS synchronizes readers and writers automatically, ensuring sequential delivery.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> GCC Linux compliant. Requires sys/msg.h.</div>`,
    code: `// --- client.c ---
#include <stdio.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/stat.h>
#include <sys/msg.h>
#include <unistd.h>

struct mymsg
{
    long type;
    char msg[30];
    char from[10];
};

struct mymsg m, r;

int main()
{
    key_t key;
    int mqid;
    char buff[30];
    key = ftok(".", 1);
    mqid = msgget(key, IPC_CREAT | 0666);
    while (1)
    {
        sleep(1);
        printf("Enter msg: ");
        gets(buff);
        strcpy(m.msg, buff);
        m.type = 1;
        strcpy(m.from, "Client");
        msgsnd(mqid, &m, sizeof(struct mymsg), 0);
        sleep(1);
        msgrcv(mqid, &r, sizeof(struct mymsg), 1, 0);
        printf("Received msg: %s is from %s\\n", r.msg, r.from);
    }
    return 0;
}`
  },

  {
    id: "fcfs-sched",
    category: "CPU Scheduling",
    title: "FCFS Scheduling",
    description: "First-Come, First-Served scheduling executes processes in their order of arrival. It is non-preemptive and simple to implement.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Initialization:</strong> The first process (index 0) has a waiting time of exactly zero: <code>wt[0] = 0</code>.</p>
        <p><strong>2. Accumulating Wait Times:</strong> A loop runs from index <code>i = 1</code> to <code>n-1</code>. The waiting time for the current process is calculated by adding the waiting time and burst time of the preceding process: <code>wt[i] = wt[i-1] + bt[i-1]</code>.</p>
        <p><strong>3. Computing Turnaround:</strong> For each process, we calculate turnaround time as <code>tat[i] = wt[i] + bt[i]</code>.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>FCFS processes CPU tasks using a simple FIFO queue structure. The CPU execution timeline starts at time 0. Each process holds the CPU until its burst time expires, allowing the next process in the queue to begin execution. This algorithm is prone to the 'convoy effect', where short processes wait a long time behind a single CPU-bound process.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int bt[20], wt[20], tat[20], n, i;
    float wt_avg = 0, tat_avg = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++)
    {
        printf("Enter burst time for P%d: ", i + 1);
        scanf("%d", &bt[i]);
    }

    wt[0] = 0;
    tat[0] = bt[0];
    wt_avg = 0;
    tat_avg = tat[0];

    for (i = 1; i < n; i++)
    {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
        wt_avg += wt[i];
        tat_avg += tat[i];
    }

    printf("\\nProcess\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n");
    for (i = 0; i < n; i++)
    {
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
        <p><strong>1. Sorting Jobs:</strong> We use a nested bubble-sort loop to arrange processes by ascending burst times (<code>bt[i] &gt; bt[j]</code>). When swapping burst times, we also swap process IDs in the <code>p[]</code> array to maintain correct labels.</p>
        <p><strong>2. Math Processing:</strong> After sorting, waiting time and turnaround time are computed sequentially just like FCFS.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>SJF minimizes average waiting time by prioritizing shorter jobs. By running the shortest tasks first, waiting processes complete quickly, reducing queue congestion. The algorithm requires advance knowledge of CPU burst times, which makes it ideal for batch processing systems.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int p[20], bt[20], wt[20], tat[20], n, i, j, temp;
    float wt_avg = 0, tat_avg = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++)
    {
        p[i] = i + 1;
        printf("Enter burst time for P%d: ", p[i]);
        scanf("%d", &bt[i]);
    }

    for (i = 0; i < n - 1; i++)
    {
        for (j = i + 1; j < n; j++)
        {
            if (bt[i] > bt[j])
            {
                temp = bt[i];
                bt[i] = bt[j];
                bt[j] = temp;

                temp = p[i];
                p[i] = p[j];
                p[j] = temp;
            }
        }
    }

    wt[0] = 0;
    tat[0] = bt[0];
    tat_avg = tat[0];

    for (i = 1; i < n; i++)
    {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
        wt_avg += wt[i];
        tat_avg += tat[i];
    }

    printf("\\nProcess\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n");
    for (i = 0; i < n; i++)
    {
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
        <p><strong>1. Remaining Time:</strong> We copy original burst times into <code>rem_bt[]</code> to track remaining execution needs.</p>
        <p><strong>2. Time Quantum Slicing:</strong> In a loop, if <code>rem_bt[i]</code> is larger than the time quantum <code>tq</code>, we execute the process for <code>tq</code> seconds and reduce <code>rem_bt[i]</code> accordingly. If the process is close to completion (<code>rem_bt[i] &lt;= tq</code>), we run it to completion and calculate waiting and turnaround times based on the elapsed time.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Round Robin is designed for time-sharing systems. The algorithm slices process execution cycles using a time quantum. Preemption occurs if a job does not complete within its time slice, moving the process back to the end of the ready queue. This ensures fair distribution of CPU resources.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int bt[20], wt[20], tat[20], rem_bt[20];
    int n, i, tq, count = 0, sq = 0;
    float wt_avg = 0, tat_avg = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++)
    {
        printf("Enter burst time for P%d: ", i + 1);
        scanf("%d", &bt[i]);
        rem_bt[i] = bt[i];
    }

    printf("Enter time quantum: ");
    scanf("%d", &tq);

    while (1)
    {
        int done = 1;
        for (i = 0; i < n; i++)
        {
            if (rem_bt[i] > 0)
            {
                done = 0;
                if (rem_bt[i] > tq)
                {
                    sq += tq;
                    rem_bt[i] -= tq;
                }
                else
                {
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
    for (i = 0; i < n; i++)
    {
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
        <p><strong>1. Priority Sorting:</strong> We use bubble-sort to sort processes by ascending priority values (<code>pri[i] &gt; pri[j]</code>). Lower values represent higher priority.</p>
        <p><strong>2. Metrics Calculation:</strong> Once sorted, we calculate waiting and turnaround times sequentially.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Priority scheduling allocates CPU access based on priority ranks. Higher-priority processes run first. A major drawback of this algorithm is 'starvation', where low-priority processes wait indefinitely. This is resolved in production kernels using 'aging' techniques.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int p[20], bt[20], pri[20], wt[20], tat[20], n, i, j, temp;
    float wt_avg = 0, tat_avg = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++)
    {
        p[i] = i + 1;
        printf("Enter burst time for P%d: ", p[i]);
        scanf("%d", &bt[i]);
        printf("Enter priority for P%d (lower = higher priority): ", p[i]);
        scanf("%d", &pri[i]);
    }

    for (i = 0; i < n - 1; i++)
    {
        for (j = i + 1; j < n; j++)
        {
            if (pri[i] > pri[j])
            {
                temp = pri[i];
                pri[i] = pri[j];
                pri[j] = temp;

                temp = bt[i];
                bt[i] = bt[j];
                bt[j] = temp;

                temp = p[i];
                p[i] = p[j];
                p[j] = temp;
            }
        }
    }

    wt[0] = 0;
    tat[0] = bt[0];
    tat_avg = tat[0];

    for (i = 1; i < n; i++)
    {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
        wt_avg += wt[i];
        tat_avg += tat[i];
    }

    printf("\\nProcess\\tPriority\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n");
    for (i = 0; i < n; i++)
    {
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
        <p><strong>1. Searching Blocks:</strong> For each process <code>i</code>, we scan memory blocks <code>j</code> from 0 to <code>nb-1</code>.</p>
        <p><strong>2. Space Allocation:</strong> If <code>block[j] &gt;= process[i]</code>, we allocate the process here: we assign <code>allocation[i] = block[j]</code> and subtract the allocated memory: <code>block[j] = block[j] - process[i]</code>. We then break the loop to process the next request.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>First Fit allocates memory partitions sequentially. It assigns a process to the first block of sufficient size. This method is fast but can cause memory fragmentation at the beginning of the partition list.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int no_of_process, no_of_blocks;
    int block[10], process[10], allocation[10];
    int i, j;

    printf("Enter number of blocks: ");
    scanf("%d", &no_of_blocks);
    printf("Enter size of each block: ");
    for (i = 0; i < no_of_blocks; i++)
        scanf("%d", &block[i]);

    printf("Enter number of processes: ");
    scanf("%d", &no_of_process);
    printf("Enter size of each process: ");
    for (i = 0; i < no_of_process; i++)
    {
        scanf("%d", &process[i]);
        allocation[i] = -1;
    }

    for (i = 0; i < no_of_process; i++)
    {
        for (j = 0; j < no_of_blocks; j++)
        {
            if (block[j] >= process[i])
            {
                allocation[i] = block[j];
                block[j] = block[j] - process[i];
                break;
            }
        }
    }

    printf("After Allocation:\\n");
    printf("Process No\\tProcess Size\\tBlock Size\\n");
    for (i = 0; i < no_of_process; i++)
    {
        if (allocation[i] != -1)
            printf("%d\\t\\t%d\\t\\t%d\\n", i + 1, process[i], allocation[i]);
        else
            printf("%d\\t\\t%d\\t\\tCan't be allocated\\n", i + 1, process[i]);
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
        <p><strong>1. Best Index Tracker:</strong> For each process, we initialize <code>bestindex = -1</code>.</p>
        <p><strong>2. Scan for tightest fit:</strong> We check all blocks. If <code>block[j] &gt;= process[i]</code>, we check if it is the first fit found (<code>bestindex == -1</code>) or if it leaves less wasted space than our current tracker (<code>block[bestindex] &gt; block[j]</code>). If so, we update <code>bestindex = j</code>.</p>
        <p><strong>3. Execution:</strong> After the loop, we complete the allocation on <code>bestindex</code>.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Best Fit searches for the partition that minimizes leftover space. It requires scanning the entire partition table, which increases processing time. This approach can also leave behind very small, unusable fragments of free memory.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int no_of_process, no_of_blocks;
    int block[10], process[10], allocation[10];
    int i, j, bestindex = -1;

    printf("Enter number of blocks: ");
    scanf("%d", &no_of_blocks);
    printf("Enter size of each block: ");
    for (i = 0; i < no_of_blocks; i++)
        scanf("%d", &block[i]);

    printf("Enter number of processes: ");
    scanf("%d", &no_of_process);
    printf("Enter size of each process: ");
    for (i = 0; i < no_of_process; i++)
    {
        scanf("%d", &process[i]);
        allocation[i] = -1;
    }

    for (i = 0; i < no_of_process; i++)
    {
        bestindex = -1;
        for (j = 0; j < no_of_blocks; j++)
        {
            if (block[j] >= process[i])
            {
                if (bestindex == -1)
                    bestindex = j;
                else if (block[bestindex] > block[j])
                    bestindex = j;
            }
        }
        if (bestindex != -1)
        {
            allocation[i] = block[bestindex];
            block[bestindex] = block[bestindex] - process[i];
        }
    }

    printf("After Allocation:\\n");
    printf("Process No\\tProcess Size\\tBlock Size\\n");
    for (i = 0; i < no_of_process; i++)
    {
        if (allocation[i] != -1)
            printf("%d\\t\\t%d\\t\\t%d\\n", i + 1, process[i], allocation[i]);
        else
            printf("%d\\t\\t%d\\t\\tCan't be allocated\\n", i + 1, process[i]);
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
        <p><strong>1. Worst Index Tracker:</strong> Initialize <code>worstindex = -1</code> for each process.</p>
        <p><strong>2. Scan for largest fit:</strong> We compare fitting blocks to find the largest available partition: <code>block[worstindex] &lt; block[j]</code>. If found, we update <code>worstindex = j</code>.</p>
        <p><strong>3. Execution:</strong> We allocate the block and subtract the process size from the partition.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>Worst Fit allocates processes to the largest available memory partition. The goal is to leave behind a leftover block that is large enough to be useful for subsequent processes. Like Best Fit, it requires scanning the entire partition list.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int no_of_process, no_of_blocks;
    int block[10], process[10], allocation[10];
    int i, j, worstindex = -1;

    printf("Enter number of blocks: ");
    scanf("%d", &no_of_blocks);
    printf("Enter size of each block: ");
    for (i = 0; i < no_of_blocks; i++)
        scanf("%d", &block[i]);

    printf("Enter number of processes: ");
    scanf("%d", &no_of_process);
    printf("Enter size of each process: ");
    for (i = 0; i < no_of_process; i++)
    {
        scanf("%d", &process[i]);
        allocation[i] = -1;
    }

    for (i = 0; i < no_of_process; i++)
    {
        worstindex = -1;
        for (j = 0; j < no_of_blocks; j++)
        {
            if (block[j] >= process[i])
            {
                if (worstindex == -1)
                    worstindex = j;
                else if (block[worstindex] < block[j])
                    worstindex = j;
            }
        }
        if (worstindex != -1)
        {
            allocation[i] = block[worstindex];
            block[worstindex] = block[worstindex] - process[i];
        }
    }

    printf("After Allocation:\\n");
    printf("Process No\\tProcess Size\\tBlock Size\\n");
    for (i = 0; i < no_of_process; i++)
    {
        if (allocation[i] != -1)
            printf("%d\\t\\t%d\\t\\t%d\\n", i + 1, process[i], allocation[i]);
        else
            printf("%d\\t\\t%d\\t\\tCan't be allocated\\n", i + 1, process[i]);
    }
    return 0;
}`
  },

  {
    id: "prod-cons",
    category: "Process Synchronization",
    title: "Producer-Consumer",
    description: "Simulates a circular buffer shared between a producer and consumer. Demonstrates semaphore-based synchronization concepts.",
    mismatch_alert: null,
    deconstruction: `
      <div class="doc-section">
        <h4>Step-by-Step Code Deconstruction</h4>
        <p><strong>1. Pointers mapping:</strong> Shared memory pointers mapping: <code>in</code> (write index), <code>out</code> (read index), and <code>buff</code> (buffer start) are assigned offsets in the segment.</p>
        <p><strong>2. Check for Buffer Full:</strong> If <code>(*out + 1) % n == *in</code>, the circular queue is full, and we block (call <code>sleep(3)</code>).</p>
        <p><strong>3. Circular Write:</strong> If space exists, we prompt for input, increment the write index (<code>*out = (*out + 1) % n</code>), and write the item.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>This program uses modulo arithmetic to implement a circular queue. This structure allows memory reuse without shifting elements. In standard operating systems, semaphores and mutexes are used to coordinate access between producer and consumer processes.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Compile and run the producer and consumer programs in separate terminals.</div>`,
    code: `// --- producer.c ---
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main()
{
    int shm_id;
    key_t SomeKey;
    int *shm, *in, *out, *buff;
    int item;
    int n = 10;
    SomeKey = ftok(".", 'a');
    shm_id = shmget(SomeKey, 12 * sizeof(int), IPC_CREAT | 0666);
    if (shm_id < 0)
    {
        printf("shmget error\\n");
        exit(1);
    }
    shm = (int *)shmat(shm_id, NULL, 0);
    if (shm == (int *)-1)
    {
        printf("shmat error\\n");
        exit(1);
    }
    in = shm;
    out = shm + 1;
    buff = shm + 2;
    *in = 0;
    *out = 0;
    while (1)
    {
        if ((*out + 1) % n == *in)
            sleep(3);
        else
        {
            printf("\\nEnter an item: ");
            scanf("%d", &item);
            *out = (*out + 1) % n;
            buff[*out] = item;
            printf("\\nOUT = %d IN = %d\\n", *out, *in);
        }
    }
    shmdt(shm);
    shmctl(shm_id, IPC_RMID, NULL);
    return 0;
}

// --- consumer.c ---
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main()
{
    int shm_id;
    key_t SomeKey;
    int *shm, *in, *out, *buff;
    int n = 10;
    SomeKey = ftok(".", 'a');
    shm_id = shmget(SomeKey, 12 * sizeof(int), 0666);
    if (shm_id < 0)
    {
        printf("shmget error\\n");
        exit(1);
    }
    shm = (int *)shmat(shm_id, NULL, 0);
    if (shm == (int *)-1)
    {
        printf("shmat error\\n");
        exit(1);
    }
    in = shm;
    out = shm + 1;
    buff = shm + 2;
    while (1)
    {
        if (*out == *in)
            sleep(3);
        else
        {
            *in = (*in + 1) % n;
            printf("\\nReceived item: %d", buff[*in]);
            printf("\\nOUT = %d IN = %d\\n", *out, *in);
        }
    }
    shmdt(shm);
    shmctl(shm_id, IPC_RMID, NULL);
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
        <p><strong>1. Temporary Frame list:</strong> Array <code>temp[]</code> tracks current memory frames, initialized to -1.</p>
        <p><strong>2. Scan for Hit:</strong> For each page reference, if it exists in the frame array, we set hit flag <code>s = 1</code> and decrement the fault counter to balance the increment that follows.</p>
        <p><strong>3. FIFO Eviction:</strong> If a fault occurs (<code>s == 0</code>), we evict the oldest page in circular order using: <code>(pagefaults - 1) % frames</code>.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>FIFO page replacement manages memory frames as a queue. The page at the head of the queue is evicted when a page fault occurs and all frames are full. This algorithm can experience Bélády's anomaly, where adding more memory frames increases the page fault rate.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int referenceString[10];
    int pagefaults = 0;
    int m, n, s, pages, frames;
    printf("\\nEnter the number of Pages:\\t");
    scanf("%d", &pages);
    printf("\\nEnter reference string values:\\n");
    for (m = 0; m < pages; m++)
    {
        printf("Value No. [%d]:\\t", m + 1);
        scanf("%d", &referenceString[m]);
    }
    printf("\\nWhat are the total number of frames:\\t");
    scanf("%d", &frames);
    int temp[frames];
    for (m = 0; m < frames; m++)
        temp[m] = -1;
    for (m = 0; m < pages; m++)
    {
        s = 0;
        for (n = 0; n < frames; n++)
        {
            if (referenceString[m] == temp[n])
            {
                s++;
                pagefaults--;
            }
        }
        pagefaults++;
        if ((pagefaults <= frames) && (s == 0))
        {
            temp[m] = referenceString[m];
        }
        else if (s == 0)
        {
            temp[(pagefaults - 1) % frames] = referenceString[m];
        }
        printf("\\n");
        for (n = 0; n < frames; n++)
        {
            printf("%d\\t", temp[n]);
        }
    }
    printf("\\nTotal page faults:\\t%d\\n", pagefaults);
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
        <p><strong>1. Least Recently Used helper:</strong> <code>findLRU(time, n)</code> scans access times to find the index with the minimum value, representing the least recently used frame position.</p>
        <p><strong>2. Access Order Tracking:</strong> On page hit, we update the timestamp <code>time[j] = counter</code>.</p>
        <p><strong>3. Replacement:</strong> On page fault, if all frames are full, we call <code>findLRU</code> to locate and replace the oldest timestamp page.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>LRU approximates optimal page replacement by assuming that pages accessed recently are likely to be accessed again soon. The algorithm evicts the page with the oldest access timestamp. While efficient, it requires hardware support or runtime overhead to track timestamps.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int findLRU(int time[], int n)
{
    int i, minimum = time[0], pos = 0;
    for (i = 1; i < n; ++i)
    {
        if (time[i] < minimum)
        {
            minimum = time[i];
            pos = i;
        }
    }
    return pos;
}

int main()
{
    int nf, np, frames[10], pages[30];
    int counter = 0, time[10];
    int flag1, flag2, i, j, pos, faults = 0;
    printf("Enter the number of frames: ");
    scanf("%d", &nf);
    printf("Enter the number of pages: ");
    scanf("%d", &np);
    printf("Enter reference string : ");
    for (i = 0; i < np; i++)
        scanf("%d", &pages[i]);
    for (i = 0; i < nf; ++i)
        frames[i] = -1;
    for (i = 0; i < np; ++i)
    {
        flag1 = flag2 = 0;
        for (j = 0; j < nf; ++j)
        {
            if (frames[j] == pages[i])
            {
                counter++;
                time[j] = counter;
                flag1 = flag2 = 1;
                break;
            }
        }
        if (flag1 == 0)
        {
            for (j = 0; j < nf; ++j)
            {
                if (frames[j] == -1)
                {
                    counter++;
                    faults++;
                    frames[j] = pages[i];
                    time[j] = counter;
                    flag2 = 1;
                    break;
                }
            }
        }
        if (flag2 == 0)
        {
            pos = findLRU(time, nf);
            counter++;
            faults++;
            frames[pos] = pages[i];
            time[pos] = counter;
        }
        printf("\\n");
        for (j = 0; j < nf; ++j)
            printf("%d\\t", frames[j]);
    }
    printf("\\n\\nTotal page faults = %d\\n", faults);
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
        <p><strong>1. Safety Matrices:</strong> We declare allocation, max, and need (<code>max - allocation</code>) matrices to track resource variables.</p>
        <p><strong>2. Safety Evaluation:</strong> We loop through processes. If <code>finish[i] == 0</code> and the process's remaining resource requirements do not exceed current available resources (<code>need[i][r] &lt;= work[r]</code>), we simulate execution. We add the process's allocated resources to the working pool (<code>work[r] += allocation[i][r]</code>), mark it finished (<code>finish[i] = 1</code>), and record it in the safe sequence.</p>
      </div>
    `,
    explanation: `
      <div class="doc-section">
        <h4>Core Logic Flow</h4>
        <p>The Banker's algorithm is a deadlock avoidance method. It models resource allocation requests to check if granting them would leave the system in a safe state. A state is safe if there is at least one sequence in which all processes can run to completion.</p>
      </div>
    `,
    compatibility: `<div class="doc-compat-note"><strong>Note:</strong> Fully compatible with GCC.</div>`,
    code: `#include <stdio.h>

int main()
{
    int no_of_process, no_of_resource;
    int available[10], work[10];
    int max[10][10], need[10][10], allocation[10][10];
    int i, j, flag = 0, ss[10], k = 0, finish[10];

    printf("Enter the number of processes and resources: ");
    scanf("%d%d", &no_of_process, &no_of_resource);
    printf("Enter allocation matrix\\n");
    for (i = 0; i < no_of_process; i++)
        for (j = 0; j < no_of_resource; j++)
            scanf("%d", &allocation[i][j]);

    printf("Enter max matrix\\n");
    for (i = 0; i < no_of_process; i++)
        for (j = 0; j < no_of_resource; j++)
            scanf("%d", &max[i][j]);

    printf("Enter available resources\\n");
    for (i = 0; i < no_of_resource; i++)
    {
        scanf("%d", &available[i]);
        work[i] = available[i];
    }

    for (i = 0; i < no_of_process; i++)
        finish[i] = 0;

    for (i = 0; i < no_of_process; i++)
        for (j = 0; j < no_of_resource; j++)
            need[i][j] = max[i][j] - allocation[i][j];

    printf("Need Matrix is\\n");
    for (i = 0; i < no_of_process; i++)
    {
        for (j = 0; j < no_of_resource; j++)
            printf("%d ", need[i][j]);
        printf("\\n");
    }

    for (j = 0; j < no_of_process; j++)
    {
        for (i = 0; i < no_of_process; i++)
        {
            flag = 0;
            if (finish[i] == 0)
            {
                for (int r = 0; r < no_of_resource; r++)
                {
                    if (need[i][r] > work[r])
                    {
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0)
                {
                    for (int r = 0; r < no_of_resource; r++)
                        work[r] += allocation[i][r];
                    ss[k] = i;
                    k++;
                    finish[i] = 1;
                }
            }
        }
    }

    flag = 1;
    for (i = 0; i < no_of_process; i++)
    {
        if (finish[i] == 0)
        {
            flag = 0;
            printf("System is not safe\\n");
            break;
        }
    }

    if (flag == 1)
    {
        printf("Safe Sequence is: ");
        for (i = 0; i < no_of_process - 1; i++)
            printf("P%d -> ", ss[i]);
        printf("P%d\\n", ss[no_of_process - 1]);
    }
    return 0;
}`
  }
];

const syntaxesData = {
  description: "C Standard Library calls and operations commonly used in Linux GCC OS Lab programs.",
  items: [
    {
      id: "syn-fork",
      title: "fork()",
      syntax: "#include <unistd.h>\n#include <sys/types.h>\npid_t fork(void);",
      desc: "Creates a child process. Returns child PID to parent, 0 to child, -1 on error."
    },
    {
      id: "syn-execv",
      title: "execv()",
      syntax: "#include <unistd.h>\nint execv(const char *path, char *const argv[]);",
      desc: "Replaces the current process image with a new one. argv[] must be NULL-terminated."
    },
    {
      id: "syn-shmget",
      title: "shmget() / shmat()",
      syntax: "#include <sys/ipc.h>\n#include <sys/shm.h>\nint shmget(key_t key, size_t size, int shmflg);\nvoid *shmat(int shmid, const void *shmaddr, int shmflg);",
      desc: "Creates shared memory (shmget) and attaches it to the process (shmat). Use shmdt() to detach."
    },
    {
      id: "syn-stat",
      title: "stat()",
      syntax: "#include <sys/stat.h>\n#include <sys/types.h>\nint stat(const char *path, struct stat *buf);",
      desc: "Fills buf with file metadata: size (st_size), mode (st_mode), timestamps (st_mtime, st_atime)."
    }
  ]
};

const shortcutsData = {
  description: "Linux Shell commands used to write, compile, and run C code in your lab.",
  shortcuts: [
    { key: "gedit filename.c", action: "Open Gedit Text Editor", desc: "Opens the C code in the Gedit editor tab. Type your code here." },
    { key: "Save Button", action: "Save code to file system", desc: "You must click the green 'Save' button in Gedit. Compilation only reads the saved file!" },
    { key: "gcc filename.c -o a", action: "Compile Code", desc: "Uses GCC to compile the saved C file into an executable file named 'a'. Errors/warnings print to terminal." },
    { key: "./a", action: "Run Executable", desc: "Runs the compiled executable program directly inside the active terminal." },
    { key: "clear", action: "Clear Terminal Screen", desc: "Clears all terminal output lines." },
    { key: "help", action: "Print command help", desc: "Prints these command guidelines." }
  ],
  mismatches: [
    {
      title: "POSIX/Linux Headers",
      desc: "Headers like <unistd.h>, <sys/types.h>, <sys/shm.h>, <dirent.h>, and <sys/msg.h> are POSIX/UNIX headers. They are fully supported in your Linux/GCC lab environment."
    },
    {
      title: "Variable Length Arrays (VLAs)",
      desc: "In modern GCC (C99 and later), dynamically-sized arrays (e.g. int temp[frames] where frames is a variable) are fully supported. However, using fixed bounds (e.g. int temp[20]) remains best practice."
    },
    {
      title: "C99 Loop Declarations",
      desc: "Declaring loop counters directly inside the loop structure (e.g. for (int i = 0; ...)) is supported by GCC. If you want to force C89 compliance, compile with: gcc filename.c -o a -std=c89."
    }
  ]
};
