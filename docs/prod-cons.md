# Producer-Consumer Problem

## What is Process Synchronisation?

When two processes share data, they must coordinate carefully. If both try to read and write shared data simultaneously without coordination, the result is unpredictable — this is called a **race condition**. Process synchronisation is the set of techniques that prevent race conditions by controlling access to shared resources.

The classic analogy: a chef (producer) makes food and puts it on a conveyor belt. A cashier (consumer) takes food from the belt and packages it. If the chef puts food on a full belt, it falls off. If the cashier takes from an empty belt, nothing happens. They must coordinate.

## Where Does This Fit?

The Producer-Consumer Problem is the foundational **synchronisation problem** in operating systems. All real synchronisation problems — database transactions, network buffers, print queues — are variations of this pattern.

Key concepts introduced:
- **Critical Section:** code that accesses shared data — only one process should run it at a time.
- **Mutex / Lock:** mechanism to enforce mutual exclusion in the critical section.
- **Circular Buffer:** a fixed-size buffer that wraps around, used as the shared storage.
- **Counting variable:** tracks how many items are in the buffer.

## The Algorithm — Plain Steps

**Shared state:**
- A circular buffer of MAX slots.
- `in` pointer: where the producer inserts next.
- `out` pointer: where the consumer removes next.
- `count`: current number of items in buffer.

**Producer:**
1. Produce an item (generate a value).
2. **Wait** if buffer is full (`count == MAX`).
3. Insert item into buffer at position `in`.
4. Advance `in = (in + 1) % MAX` (wrap around).
5. Increment `count`.

**Consumer:**
1. **Wait** if buffer is empty (`count == 0`).
2. Remove item from buffer at position `out`.
3. Advance `out = (out + 1) % MAX`.
4. Decrement `count`.
5. Consume the item (print/use it).

## Why C Looks Different

The circular wraparound `in = (in + 1) % MAX` is the key C idiom. The modulo operator `%` ensures that when `in` reaches MAX, it wraps back to 0. This turns a linear array into a logical ring. Without this, you would go out of bounds.

In pseudocode, "wait if full" is a one-liner. In C (without threads), it is simulated as a check — real production code would use semaphores (`sem_wait`, `sem_post`) or mutexes from `<pthread.h>` to properly block and wake processes. The lab version uses a simplified simulation.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
```

### Key variables
```c
#define MAX 5              // buffer capacity
int buffer[MAX];           // shared circular buffer
int in = 0, out = 0;      // insertion and removal pointers
int count = 0;             // number of items currently in buffer
```

### Producer insert
```c
if (count < MAX) {         // only if buffer not full
    buffer[in] = item;
    in = (in + 1) % MAX;   // circular wrap
    count++;
}
```

### Consumer remove
```c
if (count > 0) {           // only if buffer not empty
    int item = buffer[out];
    out = (out + 1) % MAX; // circular wrap
    count--;
    // use item here
}
```

### Why % MAX Works
With MAX = 5, and in = 4: `(4 + 1) % 5 = 0`. The buffer wraps back to the start. This is the mathematical trick that makes a linear array behave as a circular ring without any special data structure.

### The Real Synchronisation Problem
In a real multi-threaded or multi-process version, `count++` and `count--` are not atomic — they involve read, modify, write operations that can interleave. This is the actual race condition. In real systems, semaphores or mutexes protect these operations. This lab version demonstrates the concept without full thread synchronisation.

## Official References

- **Wikipedia: Producer-Consumer Problem**: [Wikipedia: Producer-Consumer Problem](https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem)
- **POSIX sem_init Specification**: [POSIX sem_init Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/sem_init.html)
- **Linux sem_init(3) Man Page**: [Linux sem_init(3) Man Page](https://man7.org/linux/man-pages/man3/sem_init.3.html)
