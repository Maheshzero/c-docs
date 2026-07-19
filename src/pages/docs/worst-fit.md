# Worst Fit Memory Allocation

## What is Worst Fit?

Worst Fit is a memory allocation strategy that assigns each process to the **largest available partition**. The name "Worst Fit" is counterintuitive — it does not mean it is the worst strategy overall. The theory is: by using the largest partition, the leftover fragment is also large, and large fragments are more likely to be reusable by future processes.

Imagine filling a jar with rocks. Worst Fit says: always put the rock into the biggest open space. The leftover space in that jar section is maximised — useful for the next rock.

## Where Does This Fit?

Worst Fit is the third of the three classic contiguous memory allocation strategies, alongside First Fit and Best Fit. Real operating systems rarely use it in practice, but it is important conceptually because it demonstrates the trade-offs in fragmentation strategies.

## The Algorithm — Plain Steps

1. Input partition sizes and process sizes.
2. For each process:
   - Scan **all** free partitions.
   - Find the partition with the **largest size** that is still big enough to hold the process.
   - Allocate that partition to the process.
   - Mark it as used.
3. If no partition is large enough, the process is not allocated.
4. Print the result table.

## Why C Looks Different

Like Best Fit, Worst Fit scans all partitions without breaking early. The difference is the comparison:
- Best Fit tracks the **minimum** fitting partition size.
- Worst Fit tracks the **maximum** fitting partition size.

```c
int max_size = -1, worst = -1;
for (int j = 0; j < n_part; j++) {
    if (!used[j] && partition[j] >= process[i]) {
        if (partition[j] > max_size) {
            max_size = partition[j];
            worst = j;
        }
    }
}
```

The variable is initialised to `-1` (not 0 or 9999) because we are looking for the maximum — any valid partition size will be larger than -1. This is the standard pattern for finding a maximum: start at the lowest possible value.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
```

### Full worst fit allocation loop
```c
for (int i = 0; i < n_process; i++) {
    int max_size = -1, worst_j = -1;
    
    for (int j = 0; j < n_part; j++) {
        if (!used[j] && partition[j] >= process[i]) {
            if (partition[j] > max_size) {
                max_size = partition[j];
                worst_j = j;
            }
        }
    }
    
    if (worst_j != -1) {
        allocation[i] = worst_j;
        used[worst_j] = 1;
    } else {
        allocation[i] = -1; // not allocated
    }
}
```

### Comparing All Three
| Process needs: 30 KB. Partitions: 35 KB, 100 KB, 40 KB (all free). |
|---|
| **First Fit** -> assigns 35 KB (first one that fits). Leftover: 5 KB. |
| **Best Fit** -> assigns 35 KB (smallest that fits). Leftover: 5 KB. |
| **Worst Fit** -> assigns 100 KB (largest available). Leftover: 70 KB. |

The 70 KB leftover from Worst Fit can serve a 60 KB process later. The 5 KB leftover from First/Best Fit cannot serve much.

## Official References

- **Wikipedia: Memory Management**: [Wikipedia: Memory Management](https://en.wikipedia.org/wiki/Memory_management)
- **GeeksforGeeks: Partition Allocation Method**: [GeeksforGeeks: Partition Allocation Method](https://www.geeksforgeeks.org/partition-allocation-method-in-operating-system/)
