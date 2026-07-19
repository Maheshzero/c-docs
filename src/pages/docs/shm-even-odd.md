# Shared Memory: Even/Odd

## What is Inter-Process Communication (IPC)?

Processes are isolated — each has its own private memory. A variable in Process A cannot be read or changed by Process B. This isolation is a security feature, but sometimes two processes genuinely need to share data.

**Inter-Process Communication (IPC)** is the set of mechanisms the OS provides so processes can exchange data safely. Think of it like giving two separate buildings a shared mailbox — the buildings remain independent, but they have a defined channel to pass notes.

## Types of IPC

Linux provides several IPC mechanisms:
- **Shared Memory** — fastest; both processes map the same physical RAM segment
- **Message Queues** — OS-managed queues; ordered delivery
- **Pipes** — unidirectional byte stream between related processes
- **Sockets** — network-capable, even for local IPC

**Shared Memory** is the fastest because there is no copying — both processes literally read and write the same physical memory locations.

## The Algorithm — Plain Steps

**Writer process:**
1. Create a shared memory segment with a known key (5678) using `shmget()`.
2. Attach it to the process's address space using `shmat()` — get a pointer to it.
3. Ask the user how many numbers to input, store the count in the first byte.
4. Loop, reading each number and writing it into the shared memory sequentially.
5. Wait (in a loop) until the reader signals it is done by writing `'*'` into the first byte.

**Reader process:**
1. Connect to the same shared memory segment using the same key.
2. Attach it using `shmat()`.
3. Read the count from the first byte.
4. Read all numbers from the subsequent bytes.
5. Print all even numbers, then all odd numbers.
6. Write `'*'` into the first byte to signal the writer it is done.

## Why C Looks Different

The shared memory is accessed as a raw `char *` pointer — a pointer to a byte array. Numbers are stored as individual bytes by dereferencing and incrementing the pointer (`*s = value; s++;`). This is because shared memory is typed as raw bytes; C requires you to manage the layout manually.

The `key_t` type is just an integer used as an identifier for the shared memory segment. Any two processes using the same key number connect to the same segment — like a shared lock combination.

The waiting loop `while (*shm != '*') sleep(1);` is a **busy-wait / polling** synchronisation — crude but simple for this example. Real code would use semaphores.

## C Implementation Guide

### Required Headers
```c
#include <sys/types.h> // key_t
#include <sys/ipc.h>   // IPC_CREAT, IPC_PRIVATE constants
#include <sys/shm.h>   // shmget(), shmat(), shmdt(), shmctl()
#include <stdio.h>     // printf(), scanf()
#include <unistd.h>    // sleep()
```

### Key Functions
```c
// Create or access a shared memory segment
int shmid = shmget(key, size, IPC_CREAT | 0666);
// key: identifier (5678 here)
// size: bytes to allocate
// flags: IPC_CREAT creates if not exists; 0666 = read/write for all

// Attach to process address space
char *shm = (char *)shmat(shmid, NULL, 0);
// Returns a pointer — treat it like an array

// Detach when done
shmdt(shm);
```

### Compilation and Run Order
```
gcc writer.c -o writer
gcc reader.c -o reader
./writer    # run first, enter numbers
./reader    # run in another terminal simultaneously
```

### Common Mistakes
- Running reader before writer creates the segment — reader's `shmget()` will fail.
- Using different key values in writer and reader — they will connect to different segments.
- Not waiting for reader to finish before writer exits — segment may be destroyed prematurely.

## Official References

- **POSIX shmget Specification**: [POSIX shmget Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/shmget.html)
- **POSIX shmat Specification**: [POSIX shmat Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/shmat.html)
- **Linux shmget(2) Man Page**: [Linux shmget(2) Man Page](https://man7.org/linux/man-pages/man2/shmget.2.html)
- **Linux shmat(2) Man Page**: [Linux shmat(2) Man Page](https://man7.org/linux/man-pages/man2/shmat.2.html)
