# File stat()

## What is File Metadata?

Every file on Linux has two parts: its **contents** (the actual data) and its **metadata** (information about the file — its size, who owns it, when it was last changed, what permissions it has). This metadata is stored separately in a data structure called an **inode**.

You can think of the inode as the file's identity card. The filename is just a label that points to the inode. `stat()` is the system call that reads this identity card.

## Where Does This Fit?

`stat()` is a **file metadata system call**. It is used whenever you need information about a file without actually reading its contents. The `ls -l` command uses stat() internally to display file sizes, permissions, and timestamps.

## The Algorithm — Plain Steps

1. Ask the user to enter a filename.
2. Call `stat(filename, &struct_variable)` to query the OS for the file's metadata.
3. The OS fills in the `struct stat` variable with all the file's properties.
4. Print the filename.
5. Print whether the path is a directory using `S_ISDIR(mode)`.
6. Print the file size in bytes from `st_size`.
7. Print the last modified time from `st_mtime`.
8. Print the last access time from `st_atime`.
9. Print the file permission mode (in octal) from `st_mode`.

## Why C Looks Different

In pseudocode: "get file properties." In C, properties are not returned one by one — they are all written into a single `struct stat` variable that you pass to `stat()` by address (using `&`). This is C's way of returning multiple values from a function — pass a pointer to a struct and let the function fill it in.

The `&s` in `stat(f, &s)` means "the address of variable s." The function writes directly into your variable's memory location. This pattern (output via pointer parameter) appears constantly in systems programming.

Timestamps are stored as `time_t` — an integer counting seconds since January 1, 1970 (Unix epoch). The raw number looks strange but tools like `ctime()` can convert it to readable dates.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>    // printf(), scanf()
#include <sys/types.h> // mode_t, off_t, time_t types
#include <sys/stat.h>  // stat(), struct stat, S_ISDIR()
```

### Key struct: struct stat
Important fields used in this program:
```c
struct stat s;
s.st_size   // file size in bytes (type: off_t)
s.st_mtime  // last modification time (type: time_t, seconds since epoch)
s.st_atime  // last access time
s.st_mode   // file type and permission bits
```

### Key Macro: S_ISDIR()
```c
S_ISDIR(s.st_mode)  // returns 1 if path is a directory, 0 if it is a file
```

### Printing Mode in Octal
```c
printf("%o", s.st_mode);  // %o prints as octal (base-8)
// e.g. 100644 = regular file with read/write for owner, read for others
```

### Common Mistakes
- Forgetting `&s` in the stat() call — passing `s` instead of `&s` will not compile or will crash.
- Using `%d` instead of `%ld` for `st_size` and timestamps — these are long integers.
- Expecting readable date strings — the timestamps are raw second counts, not formatted dates.

## Official References

- **POSIX stat Specification**: [POSIX stat Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/stat.html)
- **Linux stat(2) Man Page**: [Linux stat(2) Man Page](https://man7.org/linux/man-pages/man2/stat.2.html)
