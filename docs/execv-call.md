# execv() Call

## What is Process Image Replacement?

Every running process has a **process image** — the code, data, and stack currently loaded in memory for that process. Normally this image stays the same for the life of the process.

`execv()` is the exception. It **replaces** the entire process image with a new program. After execv() succeeds, the process is running completely different code — it is like swapping the engine of a running car while it is moving. The process ID stays the same, but everything else is replaced.

## Where Does This Fit?

`execv()` belongs to the `exec` family of system calls (`execl`, `execv`, `execvp`, etc.). They all do the same thing — replace the process image — but differ in how they accept arguments.

In a real OS, `fork()` + `exec()` is the standard way to launch a new program:
- `fork()` creates a copy of the current process.
- `exec()` replaces that copy with the desired new program.
- This is exactly how your shell (bash) launches every command you type.

## The Algorithm — Plain Steps

1. `second.c` is the launcher program.
2. It declares a string array `args[]` containing the path to the target binary (`./first`) and a `NULL` terminator.
3. It prints "Before execv-----".
4. It calls `execv(args[0], args)`.
5. The OS **completely replaces** the running code with the `first` binary.
6. `first.c` runs and prints its message.
7. Any code in `second.c` after the `execv()` line is **never reached** on success.

## Why C Looks Different

The pseudocode says "run a different program." In C, you must:
1. Prepare a `NULL`-terminated array of strings (the argument vector).
2. Pass it to `execv()` along with the path to the executable.

The `NULL` at the end of the args array is mandatory — it tells execv() where the list ends. Forgetting it causes undefined behaviour (the function reads garbage memory looking for the terminator).

Also note: the executable (`./first`) must already be compiled before `second.c` is run. This is a real dependency that students must handle manually.

## C Implementation Guide

### Required Headers
```c
// first.c
#include <stdio.h>   // printf()

// second.c
#include <stdio.h>   // printf()
#include <unistd.h>  // execv()
```

### Key Function: execv()
```c
char *args[] = {"./first", NULL};
execv(args[0], args);
```
- First argument: path to the executable file.
- Second argument: the argument vector array (must end with NULL).
- On success: **never returns** — the calling code is gone.
- On failure: returns `-1` and sets `errno`.

### Compilation Order
```
gcc first.c -o first    # compile the target first
gcc second.c -o second  # compile the launcher
./second                # run the launcher
```

### Common Mistakes
- Forgetting to compile `first.c` before running `second.c` — execv() will fail with "No such file or directory".
- Forgetting the `NULL` terminator in the args array.
- Expecting the line after `execv()` to run — it will not if execv() succeeds.

## Official References

- **POSIX execv Specification**: [POSIX execv Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/exec.html)
- **Linux exec(3) Man Page**: [Linux exec(3) Man Page](https://man7.org/linux/man-pages/man3/exec.3.html)
