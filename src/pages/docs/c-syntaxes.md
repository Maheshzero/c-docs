# C Language Lab Syntax Reference

This reference sheet explains the key syntax features, structure keywords, and operations used across all 18 Operating Systems lab programs.

---

## 1. Variables & Data Types <a id="syntax-variables"></a>

Every variable in C must be declared with a data type before it can be used.

### Basic Types
*   `int`: Stores integers (whole numbers). Used for loop indices, page counts, and resource limits.
    *   *Example:* `int n = 5;`
*   `float` / `double`: Stores real decimal numbers. Used for calculated averages (e.g. turnaround time).
    *   *Example:* `float avg_waiting = 12.5;`
*   `char`: Stores a single byte/character. A character array is used to store strings.
    *   *Example:* `char filename[20];`

### Systems-Specific Types
*   `pid_t`: Process ID descriptor. It is an integer type used to store process identifiers.
    *   *Used in:* [Basic fork()](#fork-basic) and [execv() Call](#execv-call).
*   `key_t`: IPC key descriptor. An integer used to identify shared memory segments or message queues.
    *   *Used in:* [Shared Memory](#shm-even-odd) and [Message Queue](#msg-queue).

---

## 2. Control Flow & Branching <a id="syntax-loops"></a>

### If-Else Conditionals
Used to partition execution paths. In `fork()` programs, it checks the return value to separate parent and child logic:
```c
pid_t id = fork();
if (id == 0) {
    // Code here is executed ONLY by the child process
} else if (id > 0) {
    // Code here is executed ONLY by the parent process
}
```

### For Loops (Array Traversal)
Used extensively in scheduling algorithms to step through lists of processes:
```c
for (int i = 0; i < n; i++) {
    // Access process details using p[i]
}
```

### Nested Loops (Bubble Sort)
SJF, Priority, and FCFS sorting algorithms use nested loops to arrange processes by arrival time or priority:
```c
for (int i = 0; i < n-1; i++) {
    for (int j = 0; j < n-i-1; j++) {
        if (p[j].arrival > p[j+1].arrival) {
            // Swap processes p[j] and p[j+1]
        }
    }
}
```

---

## 3. Structs (Grouped Variables) <a id="syntax-structs"></a>

A `struct` is a custom data type that lets you group related variables under a single name. 

### Why we use it
Instead of keeping separate arrays for process IDs, arrival times, and burst times, we define a single `Process` struct:
```c
struct Process {
    int pid;
    int arrival;
    int burst;
    int waiting;
    int turnaround;
};
```
We then declare an array of these structures to represent the entire process list:
```c
struct Process p[20];
```
Accessing members is done via the dot operator: `p[i].arrival = 5;`.

---

## 4. Pointers & Address Arithmetic <a id="syntax-pointers"></a>

A pointer is a variable that stores the memory address of another variable.

### Pointer Operators
*   `&` (Address-of): Retrieves the memory address of a variable.
    *   *Used in:* `stat(filename, &s)` where stat writes metadata directly into `s`'s address.
*   `*` (Dereference): Accesses the value stored at the address pointed to.
    *   *Used in:* Shared Memory pointer dereferencing: `*s = 10;` (writes the value 10 to the shared memory segment).

### Pointer Increment (`s++`)
Used in [Shared Memory Even/Odd](#shm-even-odd) to write sequential bytes to a shared memory block:
```c
char *shm, *s;
shm = (char *)shmat(shmid, NULL, 0); // Attach memory
s = shm;                            // Pointer copy
*s = limit;                         // Write limit in first byte
s++;                                // Move to next byte
```

---

## 5. POSIX System Calls & Functions <a id="syntax-functions"></a>

These system calls communicate directly with the operating system kernel.

### Process Functions (`<unistd.h>`)
*   `fork()`: Duplicates the running process. The child gets return value `0`, parent gets child's positive PID.
*   `getpid()`: Returns the process ID of the calling process.
*   `getppid()`: Returns the parent process ID of the calling process.

### Directory Functions (`<dirent.h>`)
*   `opendir(path)`: Opens a directory stream. Returns a pointer of type `DIR *`.
*   `readdir(dirptr)`: Reads the next entry in the directory stream. Returns a `struct dirent *` containing `d_name` (filename).

### IPC Shared Memory (`<sys/shm.h>`)
*   `shmget(key, size, flags)`: Allocates a shared memory segment.
*   `shmat(shmid, addr, flags)`: Attaches the allocated segment, returning a pointer.