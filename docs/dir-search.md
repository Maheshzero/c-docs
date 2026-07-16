# Directory Search

## What is a Filesystem Directory?

A directory (folder) is a special file in Linux that contains a list of entries — each entry being a filename paired with metadata about where that file's data lives on disk. When you run `ls` in a terminal, the OS is reading this list and printing the names.

Linux treats directories as **streams** you can open, read one entry at a time, and close — just like reading a text file line by line.

## Where Does This Fit?

This program uses **POSIX directory stream functions** — part of the standard C library for filesystem access:
- `opendir()` — open a directory for reading
- `readdir()` — read the next entry from the directory
- `closedir()` — close the directory stream

These are the same functions your file manager uses internally when it lists the contents of a folder.

## The Algorithm — Plain Steps

1. Ask the user for a directory path and a filename to search for.
2. Open the directory using `opendir(path)`. If it fails, report error and exit.
3. Read the first entry using `readdir()`. This returns a struct with the entry's name.
4. Compare the entry name against the search filename using `strcmp()`.
5. If they match — file found. Return success.
6. If not — read the next entry with `readdir()` again.
7. Repeat until either a match is found or `readdir()` returns NULL (end of directory).
8. Print whether the file was found or not.

## Why C Looks Different

In pseudocode: "loop through all files in the directory." In C, there is no array of filenames to loop through. You use a **stream model**: open the directory, then repeatedly call `readdir()` which returns one entry at a time until it returns `NULL` signaling the end.

Each call to `readdir()` returns a pointer to a `struct dirent`. To get the filename from it, you access the `d_name` field: `entry->d_name`. The arrow (`->`) is C's way of accessing a field through a pointer. This is equivalent to `(*entry).d_name` but cleaner.

`strcmp()` returns 0 when strings are equal (not 1 — this confuses many students). So `if (strcmp(a, b) == 0)` means "if a equals b."

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>    // printf(), scanf()
#include <string.h>   // strcmp()
#include <sys/types.h> // DIR type
#include <dirent.h>   // opendir(), readdir(), closedir(), struct dirent
```

### Key Types and Functions
```c
DIR *dirptr = opendir(path);      // opens directory, returns NULL on failure
struct dirent *entry;             // holds one directory entry
entry = readdir(dirptr);          // reads next entry, returns NULL at end
entry->d_name                     // the filename string of the current entry
closedir(dirptr);                 // always close when done
```

### The strcmp() Return Value
```c
strcmp("hello", "hello")  // returns 0 (equal)
strcmp("a", "b")          // returns negative (a < b alphabetically)
strcmp("b", "a")          // returns positive (b > a alphabetically)
```

### Common Mistakes
- Checking `if (strcmp(...))` instead of `if (strcmp(...) == 0)` — this is reversed logic and will never detect equality.
- Not checking if `opendir()` returned NULL before calling `readdir()`.
- Forgetting that `.` and `..` (current and parent directory) are always the first two entries returned by `readdir()`.

## Official References

- **POSIX opendir Specification**: [POSIX opendir Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/opendir.html)
- **POSIX readdir Specification**: [POSIX readdir Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/readdir.html)
- **Linux opendir(3) Man Page**: [Linux opendir(3) Man Page](https://man7.org/linux/man-pages/man3/opendir.3.html)
- **Linux readdir(3) Man Page**: [Linux readdir(3) Man Page](https://man7.org/linux/man-pages/man3/readdir.3.html)
