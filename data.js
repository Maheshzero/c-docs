// ============================================================
// data.js — Cleaned 18 OS Lab Algorithms Dataset
// Topics, Syntaxes, "How to Run" Help
// ============================================================

const topicsData = [
  {
    "id": "fork-basic",
    "category": "System Calls",
    "title": "Basic fork()",
    "description": "Using the fork() system call to create a single child process. The child is an exact copy of the parent process, getting its own memory space.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n#include <unistd.h>\n#include <sys/wait.h>\n#include <sys/types.h>\n\nint main()\n{\n    pid_t id;\n    id = fork();\n\n    if (id == 0)\n    {\n        printf(\"PID of child is %d\\n\", getpid());\n        printf(\"PID of parent of child is %d\\n\", getppid());\n    }\n    if (id > 0)\n    {\n        printf(\"PID of parent is %d\\n\", getpid());\n        printf(\"PID of parent of parent is %d\\n\", getppid());\n    }\n    return 0;\n}"
  },
  {
    "id": "fork-loop",
    "category": "System Calls",
    "title": "fork() with Loop",
    "description": "Demonstrates interleaved parent and child execution using a loop, simulating time-sliced CPU scheduling behavior.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n#include <sys/types.h>\n#include <unistd.h>\n\n#define MAX_COUNT 50\n\nvoid ChildProcess();\nvoid ParentProcess();\n\nint main(void)\n{\n    pid_t pid;\n    pid = fork();\n    if (pid == 0)\n        ChildProcess();\n    else\n        ParentProcess();\n    return 0;\n}\n\nvoid ChildProcess()\n{\n    int i;\n    for (i = 1; i <= MAX_COUNT; i++)\n    {\n        printf(\"This line is from child, value = %d\\n\", i);\n    }\n    printf(\"***Child process is done***\\n\");\n}\n\nvoid ParentProcess()\n{\n    int i;\n    for (i = 1; i <= MAX_COUNT; i++)\n    {\n        printf(\"This line is from parent, value = %d\\n\", i);\n    }\n    printf(\"***Parent process is done***\\n\");\n}"
  },
  {
    "id": "execv-call",
    "category": "System Calls",
    "title": "execv() Call",
    "description": "Demonstrates how execv() replaces the current process image with a new one. The first.c program is called by the second.c program.",
    "mismatch_alert": null,
    "code": "// --- first.c ---\n#include <stdio.h>\nint main()\n{\n    printf(\"I am first.c called by execv()\");\n    printf(\"\\n\");\n    return 0;\n}\n\n// --- second.c ---\n#include <stdio.h>\n#include <unistd.h>\n\nint main()\n{\n    /* A null terminated array of character pointers */\n    char *args[] = {\"./first\", NULL};\n    printf(\"Before execv-----\\n\");\n    execv(args[0], args);\n    \n    /* This statement is ignored after execv() */\n    printf(\"Ending-----\\n\");\n    return 0;\n}"
  },
  {
    "id": "dir-search",
    "category": "System Calls",
    "title": "Directory Search",
    "description": "Search for a file by name within a given directory using POSIX directory streams (opendir, readdir, closedir).",
    "mismatch_alert": null,
    "code": "#include <string.h>\n#include <sys/types.h>\n#include <dirent.h>\n#include <stdio.h>\n\nint search(char dir[], char file[])\n{\n    DIR *dirptr;\n    struct dirent *entry;\n    dirptr = opendir(dir);\n    if (dirptr == NULL)\n        return 1;\n    entry = readdir(dirptr);\n    while (entry != NULL)\n    {\n        if (strcmp(entry->d_name, file) == 0)\n            return 0;\n        entry = readdir(dirptr);\n    }\n    return 1;\n}\n\nint main()\n{\n    char s[20], f[20];\n    int r;\n    printf(\"Enter directory name: \");\n    scanf(\"%s\", s);\n    printf(\"Enter file name: \");\n    scanf(\"%s\", f);\n    r = search(s, f);\n    if (r == 0)\n        printf(\"File name %s is present in directory %s\\n\", f, s);\n    else\n        printf(\"File name %s is not present in directory %s\\n\", f, s);\n    return 0;\n}"
  },
  {
    "id": "file-stat",
    "category": "System Calls",
    "title": "File stat()",
    "description": "Retrieve file metadata (size, permissions, timestamps) using the stat() system call.",
    "mismatch_alert": null,
    "code": "#include <sys/types.h>\n#include <sys/stat.h>\n#include <stdio.h>\n\nint main()\n{\n    char f[20];\n    struct stat s;\n    printf(\"Enter file name: \");\n    scanf(\"%s\", f);\n    stat(f, &s);\n    printf(\"The file name is %s\\n\", f);\n    printf(\"dir = %d\\n\", S_ISDIR(s.st_mode));\n    printf(\"File size is %ld in bytes\\n\", s.st_size);\n    printf(\"Last modified time is %ld in seconds\\n\", s.st_mtime);\n    printf(\"Last access time is %ld in seconds\\n\", s.st_atime);\n    printf(\"The mode of the file is %o\\n\", s.st_mode);\n    return 0;\n}"
  },
  {
    "id": "shm-even-odd",
    "category": "IPC",
    "title": "Shared Memory: Even/Odd",
    "description": "Two processes communicate through shared memory. A writer process stores numbers, a reader process reads them and separates even/odd.",
    "mismatch_alert": null,
    "code": "// --- writer.c ---\n#include <sys/types.h>\n#include <sys/ipc.h>\n#include <sys/shm.h>\n#include <stdio.h>\n#include <unistd.h>\n#define SHMSIZE 27\n\nint main()\n{\n    int i, a;\n    int shmid, n;\n    key_t key;\n    char *shm, *s;\n    key = 5678;\n    shmid = shmget(key, SHMSIZE, IPC_CREAT | 0666);\n    shm = (char *)shmat(shmid, NULL, 0);\n    s = shm;\n    printf(\"Enter the limit: \");\n    scanf(\"%d\", &n);\n    *s = n;\n    s++;\n    printf(\"Enter numbers\\n\");\n    for (i = 0; i < n; i++)\n    {\n        scanf(\"%d\", &a);\n        *s = a;\n        s++;\n    }\n    while (*shm != '*')\n        sleep(1);\n    return 0;\n}\n\n// --- reader.c ---\n#include <sys/types.h>\n#include <sys/ipc.h>\n#include <sys/shm.h>\n#include <stdio.h>\n#define SHMSIZE 27\n\nint main()\n{\n    int shmid, n, a[20], i;\n    key_t key;\n    char *shm, *s;\n    key = 5678;\n    shmid = shmget(key, SHMSIZE, 0666);\n    shm = (char *)shmat(shmid, NULL, 0);\n    s = shm;\n    n = *s;\n    s++;\n    for (i = 0; i < n; i++)\n    {\n        a[i] = *s;\n        s++;\n    }\n    printf(\"\\nEven numbers are:\\n\");\n    for (i = 0; i < n; i++)\n    {\n        if (a[i] % 2 == 0)\n            printf(\"%d\\n\", a[i]);\n    }\n    printf(\"\\nOdd numbers are:\\n\");\n    for (i = 0; i < n; i++)\n    {\n        if (a[i] % 2 == 1)\n            printf(\"%d\\n\", a[i]);\n    }\n    *shm = '*';\n    printf(\"\\nIts done from client.\\n\");\n    return 0;\n}"
  },
  {
    "id": "msg-queue",
    "category": "IPC",
    "title": "Message Queue Chat",
    "description": "A simple client-server chat using POSIX message queues (msgget, msgsnd, msgrcv). Type 'exit' to terminate.",
    "mismatch_alert": null,
    "code": "// --- client.c ---\n#include <stdio.h>\n#include <string.h>\n#include <sys/types.h>\n#include <sys/ipc.h>\n#include <sys/stat.h>\n#include <sys/msg.h>\n#include <unistd.h>\n\nstruct mymsg\n{\n    long type;\n    char msg[30];\n    char from[10];\n};\n\nstruct mymsg m, r;\n\nint main()\n{\n    key_t key;\n    int mqid;\n    char buff[30];\n    key = ftok(\".\", 1);\n    mqid = msgget(key, IPC_CREAT | 0666);\n    while (1)\n    {\n        sleep(1);\n        printf(\"Enter msg: \");\n        fgets(buff, sizeof(buff), stdin);\n        buff[strcspn(buff, \"\\n\")] = '\\0';\n        strcpy(m.msg, buff);\n        m.type = 1;\n        strcpy(m.from, \"Client\");\n        msgsnd(mqid, &m, sizeof(struct mymsg), 0);\n        sleep(1);\n        msgrcv(mqid, &r, sizeof(struct mymsg), 1, 0);\n        printf(\"Received msg: %s is from %s\\n\", r.msg, r.from);\n    }\n    return 0;\n}"
  },
  {
    "id": "fcfs-sched",
    "category": "CPU Scheduling",
    "title": "FCFS Scheduling",
    "description": "First-Come, First-Served scheduling executes processes in their order of arrival. It is non-preemptive and simple to implement.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int bt[20], wt[20], tat[20], n, i;\n    float wt_avg = 0, tat_avg = 0;\n\n    printf(\"Enter number of processes: \");\n    scanf(\"%d\", &n);\n\n    for (i = 0; i < n; i++)\n    {\n        printf(\"Enter burst time for P%d: \", i + 1);\n        scanf(\"%d\", &bt[i]);\n    }\n\n    wt[0] = 0;\n    tat[0] = bt[0];\n    wt_avg = 0;\n    tat_avg = tat[0];\n\n    for (i = 1; i < n; i++)\n    {\n        wt[i] = wt[i - 1] + bt[i - 1];\n        tat[i] = wt[i] + bt[i];\n        wt_avg += wt[i];\n        tat_avg += tat[i];\n    }\n\n    printf(\"\\nProcess\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n\");\n    for (i = 0; i < n; i++)\n    {\n        printf(\"P%d\\t\\t%d\\t\\t%d\\t\\t%d\\n\", i + 1, bt[i], wt[i], tat[i]);\n    }\n\n    printf(\"\\nAverage Waiting Time: %.2f\\n\", wt_avg / n);\n    printf(\"Average Turnaround Time: %.2f\\n\", tat_avg / n);\n    return 0;\n}"
  },
  {
    "id": "sjf-sched",
    "category": "CPU Scheduling",
    "title": "SJF Scheduling",
    "description": "Shortest Job First schedules processes based on the length of their burst times. Non-preemptive implementation sorting jobs before execution.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int p[20], bt[20], wt[20], tat[20], n, i, j, temp;\n    float wt_avg = 0, tat_avg = 0;\n\n    printf(\"Enter number of processes: \");\n    scanf(\"%d\", &n);\n\n    for (i = 0; i < n; i++)\n    {\n        p[i] = i + 1;\n        printf(\"Enter burst time for P%d: \", p[i]);\n        scanf(\"%d\", &bt[i]);\n    }\n\n    for (i = 0; i < n - 1; i++)\n    {\n        for (j = i + 1; j < n; j++)\n        {\n            if (bt[i] > bt[j])\n            {\n                temp = bt[i];\n                bt[i] = bt[j];\n                bt[j] = temp;\n\n                temp = p[i];\n                p[i] = p[j];\n                p[j] = temp;\n            }\n        }\n    }\n\n    wt[0] = 0;\n    tat[0] = bt[0];\n    tat_avg = tat[0];\n\n    for (i = 1; i < n; i++)\n    {\n        wt[i] = wt[i - 1] + bt[i - 1];\n        tat[i] = wt[i] + bt[i];\n        wt_avg += wt[i];\n        tat_avg += tat[i];\n    }\n\n    printf(\"\\nProcess\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n\");\n    for (i = 0; i < n; i++)\n    {\n        printf(\"P%d\\t\\t%d\\t\\t%d\\t\\t%d\\n\", p[i], bt[i], wt[i], tat[i]);\n    }\n\n    printf(\"\\nAverage Waiting Time: %.2f\\n\", wt_avg / n);\n    printf(\"Average Turnaround Time: %.2f\\n\", tat_avg / n);\n    return 0;\n}"
  },
  {
    "id": "rr-sched",
    "category": "CPU Scheduling",
    "title": "Round Robin",
    "description": "Round Robin distributes CPU time in equal time slices (quanta) among active processes using a preemptive round-robin queue.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int bt[20], wt[20], tat[20], rem_bt[20];\n    int n, i, tq, count = 0, sq = 0;\n    float wt_avg = 0, tat_avg = 0;\n\n    printf(\"Enter number of processes: \");\n    scanf(\"%d\", &n);\n\n    for (i = 0; i < n; i++)\n    {\n        printf(\"Enter burst time for P%d: \", i + 1);\n        scanf(\"%d\", &bt[i]);\n        rem_bt[i] = bt[i];\n    }\n\n    printf(\"Enter time quantum: \");\n    scanf(\"%d\", &tq);\n\n    while (1)\n    {\n        int done = 1;\n        for (i = 0; i < n; i++)\n        {\n            if (rem_bt[i] > 0)\n            {\n                done = 0;\n                if (rem_bt[i] > tq)\n                {\n                    sq += tq;\n                    rem_bt[i] -= tq;\n                }\n                else\n                {\n                    sq += rem_bt[i];\n                    wt[i] = sq - bt[i];\n                    tat[i] = sq;\n                    rem_bt[i] = 0;\n                    count++;\n                }\n            }\n        }\n        if (done == 1) break;\n    }\n\n    printf(\"\\nProcess\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n\");\n    for (i = 0; i < n; i++)\n    {\n        wt_avg += wt[i];\n        tat_avg += tat[i];\n        printf(\"P%d\\t\\t%d\\t\\t%d\\t\\t%d\\n\", i + 1, bt[i], wt[i], tat[i]);\n    }\n\n    printf(\"\\nAverage Waiting Time: %.2f\\n\", wt_avg / n);\n    printf(\"Average Turnaround Time: %.2f\\n\", tat_avg / n);\n    return 0;\n}"
  },
  {
    "id": "priority-sched",
    "category": "CPU Scheduling",
    "title": "Priority Scheduling",
    "description": "Schedules processes based on priority ratings. Lower priority numbers indicate higher scheduling precedence.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int p[20], bt[20], pri[20], wt[20], tat[20], n, i, j, temp;\n    float wt_avg = 0, tat_avg = 0;\n\n    printf(\"Enter number of processes: \");\n    scanf(\"%d\", &n);\n\n    for (i = 0; i < n; i++)\n    {\n        p[i] = i + 1;\n        printf(\"Enter burst time for P%d: \", p[i]);\n        scanf(\"%d\", &bt[i]);\n        printf(\"Enter priority for P%d (lower = higher priority): \", p[i]);\n        scanf(\"%d\", &pri[i]);\n    }\n\n    for (i = 0; i < n - 1; i++)\n    {\n        for (j = i + 1; j < n; j++)\n        {\n            if (pri[i] > pri[j])\n            {\n                temp = pri[i];\n                pri[i] = pri[j];\n                pri[j] = temp;\n\n                temp = bt[i];\n                bt[i] = bt[j];\n                bt[j] = temp;\n\n                temp = p[i];\n                p[i] = p[j];\n                p[j] = temp;\n            }\n        }\n    }\n\n    wt[0] = 0;\n    tat[0] = bt[0];\n    tat_avg = tat[0];\n\n    for (i = 1; i < n; i++)\n    {\n        wt[i] = wt[i - 1] + bt[i - 1];\n        tat[i] = wt[i] + bt[i];\n        wt_avg += wt[i];\n        tat_avg += tat[i];\n    }\n\n    printf(\"\\nProcess\\tPriority\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n\");\n    for (i = 0; i < n; i++)\n    {\n        printf(\"P%d\\t\\t%d\\t\\t%d\\t\\t%d\\t\\t%d\\n\", p[i], pri[i], bt[i], wt[i], tat[i]);\n    }\n\n    printf(\"\\nAverage Waiting Time: %.2f\\n\", wt_avg / n);\n    printf(\"Average Turnaround Time: %.2f\\n\", tat_avg / n);\n    return 0;\n}"
  },
  {
    "id": "first-fit",
    "category": "Memory Allocation",
    "title": "First Fit",
    "description": "Allocates each process to the first available memory block that is large enough. Simple but can lead to fragmentation.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int no_of_process, no_of_blocks;\n    int block[10], process[10], allocation[10];\n    int i, j;\n\n    printf(\"Enter number of blocks: \");\n    scanf(\"%d\", &no_of_blocks);\n    printf(\"Enter size of each block: \");\n    for (i = 0; i < no_of_blocks; i++)\n        scanf(\"%d\", &block[i]);\n\n    printf(\"Enter number of processes: \");\n    scanf(\"%d\", &no_of_process);\n    printf(\"Enter size of each process: \");\n    for (i = 0; i < no_of_process; i++)\n    {\n        scanf(\"%d\", &process[i]);\n        allocation[i] = -1;\n    }\n\n    for (i = 0; i < no_of_process; i++)\n    {\n        for (j = 0; j < no_of_blocks; j++)\n        {\n            if (block[j] >= process[i])\n            {\n                allocation[i] = block[j];\n                block[j] = block[j] - process[i];\n                break;\n            }\n        }\n    }\n\n    printf(\"After Allocation:\\n\");\n    printf(\"Process No\\tProcess Size\\tBlock Size\\n\");\n    for (i = 0; i < no_of_process; i++)\n    {\n        if (allocation[i] != -1)\n            printf(\"%d\\t\\t%d\\t\\t%d\\n\", i + 1, process[i], allocation[i]);\n        else\n            printf(\"%d\\t\\t%d\\t\\tCan't be allocated\\n\", i + 1, process[i]);\n    }\n    return 0;\n}"
  },
  {
    "id": "best-fit",
    "category": "Memory Allocation",
    "title": "Best Fit",
    "description": "Allocates each process to the smallest block that is still large enough. Minimizes wasted space but requires a full scan.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int no_of_process, no_of_blocks;\n    int block[10], process[10], allocation[10];\n    int i, j, bestindex = -1;\n\n    printf(\"Enter number of blocks: \");\n    scanf(\"%d\", &no_of_blocks);\n    printf(\"Enter size of each block: \");\n    for (i = 0; i < no_of_blocks; i++)\n        scanf(\"%d\", &block[i]);\n\n    printf(\"Enter number of processes: \");\n    scanf(\"%d\", &no_of_process);\n    printf(\"Enter size of each process: \");\n    for (i = 0; i < no_of_process; i++)\n    {\n        scanf(\"%d\", &process[i]);\n        allocation[i] = -1;\n    }\n\n    for (i = 0; i < no_of_process; i++)\n    {\n        bestindex = -1;\n        for (j = 0; j < no_of_blocks; j++)\n        {\n            if (block[j] >= process[i])\n            {\n                if (bestindex == -1)\n                    bestindex = j;\n                else if (block[bestindex] > block[j])\n                    bestindex = j;\n            }\n        }\n        if (bestindex != -1)\n        {\n            allocation[i] = block[bestindex];\n            block[bestindex] = block[bestindex] - process[i];\n        }\n    }\n\n    printf(\"After Allocation:\\n\");\n    printf(\"Process No\\tProcess Size\\tBlock Size\\n\");\n    for (i = 0; i < no_of_process; i++)\n    {\n        if (allocation[i] != -1)\n            printf(\"%d\\t\\t%d\\t\\t%d\\n\", i + 1, process[i], allocation[i]);\n        else\n            printf(\"%d\\t\\t%d\\t\\tCan't be allocated\\n\", i + 1, process[i]);\n    }\n    return 0;\n}"
  },
  {
    "id": "worst-fit",
    "category": "Memory Allocation",
    "title": "Worst Fit",
    "description": "Allocates each process to the largest available block. Leaves the largest leftover fragments, potentially useful for future allocations.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int no_of_process, no_of_blocks;\n    int block[10], process[10], allocation[10];\n    int i, j, worstindex = -1;\n\n    printf(\"Enter number of blocks: \");\n    scanf(\"%d\", &no_of_blocks);\n    printf(\"Enter size of each block: \");\n    for (i = 0; i < no_of_blocks; i++)\n        scanf(\"%d\", &block[i]);\n\n    printf(\"Enter number of processes: \");\n    scanf(\"%d\", &no_of_process);\n    printf(\"Enter size of each process: \");\n    for (i = 0; i < no_of_process; i++)\n    {\n        scanf(\"%d\", &process[i]);\n        allocation[i] = -1;\n    }\n\n    for (i = 0; i < no_of_process; i++)\n    {\n        worstindex = -1;\n        for (j = 0; j < no_of_blocks; j++)\n        {\n            if (block[j] >= process[i])\n            {\n                if (worstindex == -1)\n                    worstindex = j;\n                else if (block[worstindex] < block[j])\n                    worstindex = j;\n            }\n        }\n        if (worstindex != -1)\n        {\n            allocation[i] = block[worstindex];\n            block[worstindex] = block[worstindex] - process[i];\n        }\n    }\n\n    printf(\"After Allocation:\\n\");\n    printf(\"Process No\\tProcess Size\\tBlock Size\\n\");\n    for (i = 0; i < no_of_process; i++)\n    {\n        if (allocation[i] != -1)\n            printf(\"%d\\t\\t%d\\t\\t%d\\n\", i + 1, process[i], allocation[i]);\n        else\n            printf(\"%d\\t\\t%d\\t\\tCan't be allocated\\n\", i + 1, process[i]);\n    }\n    return 0;\n}"
  },
  {
    "id": "prod-cons",
    "category": "Process Synchronization",
    "title": "Producer-Consumer",
    "description": "Simulates a circular buffer shared between a producer and consumer. Demonstrates semaphore-based synchronization concepts.",
    "mismatch_alert": null,
    "code": "// --- producer.c ---\n#include <sys/types.h>\n#include <sys/ipc.h>\n#include <sys/shm.h>\n#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\n\nint main()\n{\n    int shm_id;\n    key_t SomeKey;\n    int *shm, *in, *out, *buff;\n    int item;\n    int n = 10;\n    SomeKey = ftok(\".\", 'a');\n    shm_id = shmget(SomeKey, 12 * sizeof(int), IPC_CREAT | 0666);\n    if (shm_id < 0)\n    {\n        printf(\"shmget error\\n\");\n        exit(1);\n    }\n    shm = (int *)shmat(shm_id, NULL, 0);\n    if (shm == (int *)-1)\n    {\n        printf(\"shmat error\\n\");\n        exit(1);\n    }\n    in = shm;\n    out = shm + 1;\n    buff = shm + 2;\n    *in = 0;\n    *out = 0;\n    while (1)\n    {\n        if ((*out + 1) % n == *in)\n            sleep(3);\n        else\n        {\n            printf(\"\\nEnter an item: \");\n            scanf(\"%d\", &item);\n            *out = (*out + 1) % n;\n            buff[*out] = item;\n            printf(\"\\nOUT = %d IN = %d\\n\", *out, *in);\n        }\n    }\n    shmdt(shm);\n    shmctl(shm_id, IPC_RMID, NULL);\n    return 0;\n}\n\n// --- consumer.c ---\n#include <sys/types.h>\n#include <sys/ipc.h>\n#include <sys/shm.h>\n#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\n\nint main()\n{\n    int shm_id;\n    key_t SomeKey;\n    int *shm, *in, *out, *buff;\n    int n = 10;\n    SomeKey = ftok(\".\", 'a');\n    shm_id = shmget(SomeKey, 12 * sizeof(int), 0666);\n    if (shm_id < 0)\n    {\n        printf(\"shmget error\\n\");\n        exit(1);\n    }\n    shm = (int *)shmat(shm_id, NULL, 0);\n    if (shm == (int *)-1)\n    {\n        printf(\"shmat error\\n\");\n        exit(1);\n    }\n    in = shm;\n    out = shm + 1;\n    buff = shm + 2;\n    while (1)\n    {\n        if (*out == *in)\n            sleep(3);\n        else\n        {\n            *in = (*in + 1) % n;\n            printf(\"\\nReceived item: %d\", buff[*in]);\n            printf(\"\\nOUT = %d IN = %d\\n\", *out, *in);\n        }\n    }\n    shmdt(shm);\n    shmctl(shm_id, IPC_RMID, NULL);\n    return 0;\n}"
  },
  {
    "id": "fifo-page",
    "category": "Page Replacement",
    "title": "FIFO Page Replacement",
    "description": "The oldest page in memory is replaced first. Simple to implement but can suffer from Bélády's anomaly.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int referenceString[30];\n    int pagefaults = 0;\n    int m, n, s, pages, frames, front = 0;\n    printf(\"\\nEnter the number of Pages:\\t\");\n    scanf(\"%d\", &pages);\n    printf(\"\\nEnter reference string values:\\n\");\n    for (m = 0; m < pages; m++)\n    {\n        printf(\"Value No. [%d]:\\t\", m + 1);\n        scanf(\"%d\", &referenceString[m]);\n    }\n    printf(\"\\nWhat are the total number of frames:\\t\");\n    scanf(\"%d\", &frames);\n    int temp[frames];\n    for (m = 0; m < frames; m++)\n        temp[m] = -1;\n    for (m = 0; m < pages; m++)\n    {\n        s = 0;\n        for (n = 0; n < frames; n++)\n        {\n            if (referenceString[m] == temp[n])\n            {\n                s = 1;\n                break;\n            }\n        }\n        if (s == 0)\n        {\n            temp[front] = referenceString[m];\n            front = (front + 1) % frames;\n            pagefaults++;\n        }\n        printf(\"\\n\");\n        for (n = 0; n < frames; n++)\n        {\n            if (temp[n] != -1)\n                printf(\"%d\\t\", temp[n]);\n            else\n                printf(\"-\\t\");\n        }\n    }\n    printf(\"\\nTotal page faults:\\t%d\\n\", pagefaults);\n    return 0;\n}"
  },
  {
    "id": "lru-page",
    "category": "Page Replacement",
    "title": "LRU Page Replacement",
    "description": "Replaces the page that has not been used for the longest period of time. Gives better performance than FIFO but requires tracking usage history.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint findLRU(int time[], int n)\n{\n    int i, minimum = time[0], pos = 0;\n    for (i = 1; i < n; ++i)\n    {\n        if (time[i] < minimum)\n        {\n            minimum = time[i];\n            pos = i;\n        }\n    }\n    return pos;\n}\n\nint main()\n{\n    int nf, np, frames[10], pages[30];\n    int counter = 0, time[10];\n    int flag1, flag2, i, j, pos, faults = 0;\n    printf(\"Enter the number of frames: \");\n    scanf(\"%d\", &nf);\n    printf(\"Enter the number of pages: \");\n    scanf(\"%d\", &np);\n    printf(\"Enter reference string : \");\n    for (i = 0; i < np; i++)\n        scanf(\"%d\", &pages[i]);\n    for (i = 0; i < nf; ++i)\n        frames[i] = -1;\n    for (i = 0; i < np; ++i)\n    {\n        flag1 = flag2 = 0;\n        for (j = 0; j < nf; ++j)\n        {\n            if (frames[j] == pages[i])\n            {\n                counter++;\n                time[j] = counter;\n                flag1 = flag2 = 1;\n                break;\n            }\n        }\n        if (flag1 == 0)\n        {\n            for (j = 0; j < nf; ++j)\n            {\n                if (frames[j] == -1)\n                {\n                    counter++;\n                    faults++;\n                    frames[j] = pages[i];\n                    time[j] = counter;\n                    flag2 = 1;\n                    break;\n                }\n            }\n        }\n        if (flag2 == 0)\n        {\n            pos = findLRU(time, nf);\n            counter++;\n            faults++;\n            frames[pos] = pages[i];\n            time[pos] = counter;\n        }\n        printf(\"\\n\");\n        for (j = 0; j < nf; ++j)\n            printf(\"%d\\t\", frames[j]);\n    }\n    printf(\"\\n\\nTotal page faults = %d\\n\", faults);\n    return 0;\n}"
  },
  {
    "id": "bankers",
    "category": "Deadlock Avoidance",
    "title": "Banker's Algorithm",
    "description": "Determines if a system is in a safe state by computing a safe sequence using the Banker's safety algorithm.",
    "mismatch_alert": null,
    "code": "#include <stdio.h>\n\nint main()\n{\n    int no_of_process, no_of_resource;\n    int available[10], work[10];\n    int max[10][10], need[10][10], allocation[10][10];\n    int i, j, flag = 0, ss[10], k = 0, finish[10];\n\n    printf(\"Enter the number of processes and resources: \");\n    scanf(\"%d%d\", &no_of_process, &no_of_resource);\n    printf(\"Enter allocation matrix\\n\");\n    for (i = 0; i < no_of_process; i++)\n        for (j = 0; j < no_of_resource; j++)\n            scanf(\"%d\", &allocation[i][j]);\n\n    printf(\"Enter max matrix\\n\");\n    for (i = 0; i < no_of_process; i++)\n        for (j = 0; j < no_of_resource; j++)\n            scanf(\"%d\", &max[i][j]);\n\n    printf(\"Enter available resources\\n\");\n    for (i = 0; i < no_of_resource; i++)\n    {\n        scanf(\"%d\", &available[i]);\n        work[i] = available[i];\n    }\n\n    for (i = 0; i < no_of_process; i++)\n        finish[i] = 0;\n\n    for (i = 0; i < no_of_process; i++)\n        for (j = 0; j < no_of_resource; j++)\n            need[i][j] = max[i][j] - allocation[i][j];\n\n    printf(\"Need Matrix is\\n\");\n    for (i = 0; i < no_of_process; i++)\n    {\n        for (j = 0; j < no_of_resource; j++)\n            printf(\"%d \", need[i][j]);\n        printf(\"\\n\");\n    }\n\n    for (j = 0; j < no_of_process; j++)\n    {\n        for (i = 0; i < no_of_process; i++)\n        {\n            flag = 0;\n            if (finish[i] == 0)\n            {\n                for (int r = 0; r < no_of_resource; r++)\n                {\n                    if (need[i][r] > work[r])\n                    {\n                        flag = 1;\n                        break;\n                    }\n                }\n                if (flag == 0)\n                {\n                    for (int r = 0; r < no_of_resource; r++)\n                        work[r] += allocation[i][r];\n                    ss[k] = i;\n                    k++;\n                    finish[i] = 1;\n                }\n            }\n        }\n    }\n\n    flag = 1;\n    for (i = 0; i < no_of_process; i++)\n    {\n        if (finish[i] == 0)\n        {\n            flag = 0;\n            printf(\"System is not safe\\n\");\n            break;\n        }\n    }\n\n    if (flag == 1)\n    {\n        printf(\"Safe Sequence is: \");\n        for (i = 0; i < no_of_process - 1; i++)\n            printf(\"P%d -> \", ss[i]);\n        printf(\"P%d\\n\", ss[no_of_process - 1]);\n    }\n    return 0;\n}"
  }
];

const syntaxesData = {
  "description": "C Standard Library calls and operations commonly used in Linux GCC OS Lab programs.",
  "items": [
    {
      "id": "syn-fork",
      "title": "fork()",
      "syntax": "#include <unistd.h>\n#include <sys/types.h>\npid_t fork(void);",
      "desc": "Creates a child process. Returns child PID to parent, 0 to child, -1 on error."
    },
    {
      "id": "syn-execv",
      "title": "execv()",
      "syntax": "#include <unistd.h>\nint execv(const char *path, char *const argv[]);",
      "desc": "Replaces the current process image with a new one. argv[] must be NULL-terminated."
    },
    {
      "id": "syn-shmget",
      "title": "shmget() / shmat()",
      "syntax": "#include <sys/ipc.h>\n#include <sys/shm.h>\nint shmget(key_t key, size_t size, int shmflg);\nvoid *shmat(int shmid, const void *shmaddr, int shmflg);",
      "desc": "Creates shared memory (shmget) and attaches it to the process (shmat). Use shmdt() to detach."
    },
    {
      "id": "syn-stat",
      "title": "stat()",
      "syntax": "#include <sys/stat.h>\n#include <sys/types.h>\nint stat(const char *path, struct stat *buf);",
      "desc": "Fills buf with file metadata: size (st_size), mode (st_mode), timestamps (st_mtime, st_atime)."
    }
  ]
};

const shortcutsData = {
  "description": "Linux Shell commands used to write, compile, and run C code in your lab.",
  "shortcuts": [
    {
      "key": "gedit filename.c",
      "action": "Open Gedit Text Editor",
      "desc": "Opens the C code in the Gedit editor tab. Type your code here."
    },
    {
      "key": "Save Button",
      "action": "Save code to file system",
      "desc": "You must click the green 'Save' button in Gedit. Compilation only reads the saved file!"
    },
    {
      "key": "gcc filename.c -o a",
      "action": "Compile Code",
      "desc": "Uses GCC to compile the saved C file into an executable file named 'a'. Errors/warnings print to terminal."
    },
    {
      "key": "./a",
      "action": "Run Executable",
      "desc": "Runs the compiled executable program directly inside the active terminal."
    },
    {
      "key": "clear",
      "action": "Clear Terminal Screen",
      "desc": "Clears all terminal output lines."
    },
    {
      "key": "help",
      "action": "Print command help",
      "desc": "Prints these command guidelines."
    }
  ],
  "mismatches": [
    {
      "title": "POSIX/Linux Headers",
      "desc": "Headers like <unistd.h>, <sys/types.h>, <sys/shm.h>, <dirent.h>, and <sys/msg.h> are POSIX/UNIX headers. They are fully supported in your Linux/GCC lab environment."
    },
    {
      "title": "Variable Length Arrays (VLAs)",
      "desc": "In modern GCC (C99 and later), dynamically-sized arrays (e.g. int temp[frames] where frames is a variable) are fully supported. However, using fixed bounds (e.g. int temp[20]) remains best practice."
    },
    {
      "title": "C99 Loop Declarations",
      "desc": "Declaring loop counters directly inside the loop structure (e.g. for (int i = 0; ...)) is supported by GCC. If you want to force C89 compliance, compile with: gcc filename.c -o a -std=c89."
    }
  ]
};
