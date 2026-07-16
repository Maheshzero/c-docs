# First Fit Memory Allocation

## What is Memory Allocation?

When a program runs, the OS must find a free area of RAM large enough to hold it. Physical RAM is divided into **partitions** (also called holes or blocks) — some occupied by existing processes, some free. The OS must decide which free partition to assign to a new process.

Think of RAM like a parking lot with differently-sized spaces. A new car arrives needing a spot. The allocation algorithm decides which empty space to put it in.

## Types of Memory Allocation Strategies

All three strategies (First Fit, Best Fit, Worst Fit) use the same input — a list of memory partition sizes and a list of process sizes — but differ in how they choose:

| Strategy | Rule | Speed | Fragmentation |
|---|---|---|---|
| **First Fit** | Use the first hole that fits | Fastest | Fragments beginning of memory |
| Best Fit | Use the smallest hole that fits | Slow (scan all) | Leaves tiny useless fragments |
| Worst Fit | Use the largest hole | Slow (scan all) | Leaves large reusable fragments |

## The Algorithm — Plain Steps

1. Input the number of memory partitions and each partition's size.
2. Input the number of processes and each process's memory requirement.
3. Create an array tracking which partition is allocated to each process (initialise to -1 = unallocated).
4. For each process, scan partitions from the beginning:
   - If the partition is free AND large enough for the process: allocate it.
   - Mark that partition as occupied (so it is not given to another process).
   - Move to the next process.
   - If no partition fits: process remains unallocated.
5. Print the allocation table showing which process got which partition.

## Why C Looks Different

"Find the first free partition large enough" translates to a `for` loop with a `break` statement — scan from index 0, stop as soon as a suitable partition is found.

The "is this partition free?" check uses a separate boolean array: `int allocated_partition[MAX]` initialised to 0, set to 1 when used. This prevents two processes from being assigned to the same partition.

The allocation result is stored in `int process_partition[MAX]` where index is the process number and value is the partition number assigned (-1 if none found).

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
```

### Key arrays
```c
int partition[MAX];           // sizes of memory partitions
int process[MAX];             // sizes of processes (memory needed)
int part_used[MAX] = {0};     // 1 if partition is already allocated
int allocation[MAX];          // partition assigned to each process (-1 = none)
```

### First fit inner loop
```c
for (int i = 0; i < n_process; i++) {
    allocation[i] = -1;  // initialise as unallocated
    for (int j = 0; j < n_partition; j++) {
        if (!part_used[j] && partition[j] >= process[i]) {
            allocation[i] = j;      // allocate partition j to process i
            part_used[j] = 1;       // mark partition as used
            break;                  // stop scanning — first fit done
        }
    }
}
```

### Internal vs External Fragmentation
**Internal Fragmentation:** Wasted space inside an allocated partition (e.g. process needs 50 KB, partition is 100 KB — 50 KB wasted inside). First Fit causes this.

**External Fragmentation:** Many small free partitions that cannot serve any process because none is large enough individually. All three strategies cause this over time.

## Official References

- **Wikipedia: Memory Management**: [Wikipedia: Memory Management](https://en.wikipedia.org/wiki/Memory_management)
- **GeeksforGeeks: Partition Allocation Method**: [GeeksforGeeks: Partition Allocation Method](https://www.geeksforgeeks.org/partition-allocation-method-in-operating-system/)
