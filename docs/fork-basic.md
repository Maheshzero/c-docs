# Basic fork()

## What is a Process?

When you run a program on Linux, the OS creates a **process** — an isolated running instance of your program with its own memory space, its own variables, and its own execution state. Think of it like opening the same application twice: both windows run independently, each with separate data.

The OS manages dozens of processes at once by rapidly switching between them. This is called **multitasking**.

## Where Does fork() Fit?

`fork()` is a **system call** — a request your program makes directly to the OS kernel. It belongs to the category of **process creation** system calls defined in the POSIX standard.

System Calls in this syllabus:
- **fork()** — duplicate a process
- **execv()** — replace a process image with a new program
- **stat()** — query file metadata
- **opendir/readdir** — read directory contents

## The Algorithm — Plain Steps

1. The running program calls `fork()`.
2. The OS makes an **exact duplicate** of the current process — same code, same variables, same position in execution.
3. Now **two processes** exist, running the same code from the same point.
4. The OS tells them apart by the **return value** of `fork()`:
   - The **child process** receives `0`.
   - The **parent process** receives the child's PID (a positive number).
5. Each process checks this return value and takes a different branch.
6. Both processes run and print their own PID using `getpid()` and their parent's PID using `getppid()`.

## Why C Looks Different

In pseudocode you might write: `if process is child, do X`. But C has no concept of "which process am I?" — instead, fork() encodes that answer in its return value. So the C code checks `if (id == 0)` to know it is the child, and `if (id > 0)` to know it is the parent. This is not immediately obvious but is the standard POSIX idiom.

Also: in pseudocode `pid` is an abstract label. In C it is a concrete type `pid_t` — an integer type defined in `<sys/types.h>` that is large enough to hold any valid process ID on the system.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>     // printf()
#include <unistd.h>    // fork(), getpid(), getppid()
#include <sys/types.h> // pid_t type
#include <sys/wait.h>  // wait() — good practice even if unused here
```

### Key Function: fork()
```c
pid_t id = fork();
```
- Returns `0` inside the child process.
- Returns the child's PID (positive) inside the parent.
- Returns `-1` if the fork failed (out of resources).

### Key Functions: getpid() and getppid()
- `getpid()` — returns the PID of the calling process.
- `getppid()` — returns the PID of the calling process's parent.

### Common Mistake
Students often forget that **both branches run the same program**. After fork(), there are two copies of the program running. Each copy reaches the `if` statements and takes its respective branch. They do not "split" in the sense that one runs and the other stops — both are alive simultaneously.

## Official References

- **POSIX fork Specification**: [POSIX fork Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/fork.html)
- **Linux fork(2) Man Page**: [Linux fork(2) Man Page](https://man7.org/linux/man-pages/man2/fork.2.html)
