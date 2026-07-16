# fork() with Loop

## What is Concurrent Execution?

When two processes are running at the same time, we call them **concurrent**. The CPU does not literally run both at the exact same nanosecond — instead, the OS switches between them so rapidly (hundreds of times per second) that they appear simultaneous. This switching is called **context switching**, and the time each process gets is called a **time slice**.

Think of a single waiter serving two tables. They are not at both tables at once — they alternate quickly enough that both tables feel attended to.

## Where Does This Fit?

This program extends the basic `fork()` concept by showing **what concurrency looks like in practice**. Both parent and child processes run a loop 50 times. Because the OS schedules them alternately, their output lines interleave unpredictably.

This directly demonstrates **CPU time-sharing** — the same mechanism behind all multi-process operating system behaviour.

## The Algorithm — Plain Steps

1. Declare two helper functions: `ChildProcess()` and `ParentProcess()`.
2. Call `fork()` to create two processes.
3. The child process (fork returns 0) calls `ChildProcess()`.
4. The parent process (fork returns positive) calls `ParentProcess()`.
5. `ChildProcess()` loops 50 times printing "This line is from child, value = i".
6. `ParentProcess()` loops 50 times printing "This line is from parent, value = i".
7. Both loops run simultaneously. The OS decides when to switch between them.
8. Output from both processes appears interleaved in the terminal.

## Why C Looks Different

The algorithm just says "run two loops in parallel." But C has no built-in parallelism — you must explicitly create a second process using `fork()`, then route each process to its own function using the fork return value.

The `#define MAX_COUNT 50` is a **preprocessor macro** — it tells the C compiler to replace every occurrence of `MAX_COUNT` in the code with the number `50` before compiling. This is common in C for defining constants cleanly.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>    // printf()
#include <sys/types.h> // pid_t
#include <unistd.h>   // fork()
```

### Key Pattern: Function-based process routing
```c
pid_t pid = fork();
if (pid == 0)
    ChildProcess();   // only child runs this
else
    ParentProcess();  // only parent runs this
```

### Why Output Order Is Unpredictable
The exact interleaving of child and parent output changes every time the program runs. This is **non-determinism** — a fundamental property of concurrent systems. The OS scheduler decides the order, and it depends on system load, CPU state, and other factors you cannot control.

### Common Mistake
Students expect consistent output order. It will not be consistent. That is the point of the program — to demonstrate that two processes run independently with no guaranteed order.

## Official References

- **POSIX fork Specification**: [POSIX fork Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/fork.html)
- **Linux fork(2) Man Page**: [Linux fork(2) Man Page](https://man7.org/linux/man-pages/man2/fork.2.html)
