# Best Fit Memory Allocation

## What is Best Fit?

Best Fit is a memory allocation strategy that searches **all** available partitions and assigns the process to the **smallest partition that is still large enough** to hold it. The reasoning: use the tightest possible fit to waste as little space as possible.

Imagine you are packing boxes into a truck. Best Fit says: find the smallest box that still fits the item. This minimises wasted space per packing decision — but it tends to leave many tiny leftover spaces that cannot be reused.

## Where Does This Fit?

Best Fit is one of three classic **contiguous memory allocation strategies**:
- **First Fit:** take the first hole that is big enough. Fast, fragments the start.
- **Best Fit:** take the smallest sufficient hole. Minimises waste per allocation, but creates many small unusable fragments over time.
- **Worst Fit:** take the largest hole. Leaves larger (potentially reusable) leftovers.

## The Algorithm — Plain Steps

1. Input partition sizes and process sizes.
2. For each process:
   - Scan **all** partitions.
   - Track the index of the partition that fits (size ≥ process requirement) AND has the smallest size among fitting partitions.
   - After scanning all: if a best fit was found, allocate it.
   - Mark that partition as used.
3. If no partition fits the process, it remains unallocated.
4. Print the allocation result.

## Why C Looks Different

Unlike First Fit (which breaks on the first fit), Best Fit must scan **all** partitions before deciding. No `break` statement — the full scan always completes.

The "smallest fit so far" is tracked with a variable initialised to a very large number (`INT_MAX` or `9999`). Each time a fitting partition is found, check if it is smaller than the current best. If so, update the best.

```c
int min_size = 9999, best = -1;
for (int j = 0; j < n_partition; j++) {
    if (!used[j] && partition[j] >= process[i]) {
        if (partition[j] < min_size) {
            min_size = partition[j];
            best = j;
        }
    }
}
// After loop: if best != -1, allocate partition[best] to process[i]
```

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
```

### Key difference from First Fit
```c
// First Fit: break as soon as a fitting partition is found
// Best Fit: NO break — scan all, track the minimum fitting partition

int best_j = -1, min_diff = 9999;
for (int j = 0; j < n_part; j++) {
    if (!used[j] && partition[j] >= process[i]) {
        int diff = partition[j] - process[i]; // how much space is wasted
        if (diff < min_diff) {
            min_diff = diff;
            best_j = j;
        }
    }
}
if (best_j != -1) {
    allocation[i] = best_j;
    used[best_j] = 1;
}
```

### Why Best Fit Can Be Worse in Practice

Best Fit sounds optimal but has a practical problem: it creates many **tiny fragments**. For example, if processes need 40 KB each and partitions are 41 KB each — perfect allocation. But after a few allocations and deallocations, you are left with 1 KB fragments everywhere that are useless. This makes Best Fit worse than First Fit in long-running systems.

## Official References

- **Wikipedia: Memory Management**: [Wikipedia: Memory Management](https://en.wikipedia.org/wiki/Memory_management)
- **GeeksforGeeks: Partition Allocation Method**: [GeeksforGeeks: Partition Allocation Method](https://www.geeksforgeeks.org/partition-allocation-method-in-operating-system/)
