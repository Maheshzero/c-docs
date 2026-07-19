# Banker's Safety Algorithm

## What is a Deadlock?

In a multi-processing operating system, processes share resources like printers, file locks, or memory regions. A **deadlock** is a situation where two or more processes are blocked forever, each waiting for a resource that the other process holds. 

Imagine two people wanting to draw. Person A has a pencil but needs paper. Person B has paper but needs a pencil. Neither is willing to give up what they have, and both wait forever. This is circular wait, and it completely halts system execution.

To avoid this, we can use safety check algorithms that analyze resource requests before granting them.

## Where Does This Fit?

The **Banker's Algorithm** is a classic **deadlock avoidance** algorithm. It is modeled after a banker who decides whether to extend credit (grant resources) based on whether the bank's remaining cash is sufficient to satisfy the maximum demands of all current clients.

The safety algorithm determines if a state is **safe**:
- **Safe State:** The OS can allocate resources to each process in some sequence such that all can eventually finish.
- **Unsafe State:** There is a possibility that processes will request resources in a way that leads to a deadlock.

## The Algorithm — Plain Steps

1. Input matrices:
   - `Allocation[i][j]`: Resources currently allocated to process `i` of resource type `j`.
   - `Max[i][j]`: Maximum resource demand of process `i` of resource type `j`.
   - `Available[j]`: Quantity of resource type `j` currently free.
2. Calculate the `Need` matrix:
   - `Need[i][j] = Max[i][j] - Allocation[i][j]` (remaining resources process `i` may request).
3. Initialize a helper array `Finish[i] = 0` for all processes (0 means not finished).
4. Initialize a temporary vector `Work` equal to `Available`.
5. Find a process `i` such that:
   - `Finish[i] == 0` (it is not done yet) AND
   - `Need[i][j] <= Work[j]` for all resource types `j` (its remaining needs can be met by the work resources).
6. If such a process `i` exists:
   - Assume it runs to completion, releases its allocated resources.
   - Update `Work[j] = Work[j] + Allocation[i][j]`.
   - Mark `Finish[i] = 1`.
   - Add `i` to the **Safe Sequence** array.
   - Go back to step 5.
7. If all processes have `Finish[i] == 1`, the system is in a **safe state**. Print the safe sequence.
8. If any `Finish[i] == 0` remains and no process can satisfy step 5, the state is **unsafe** (deadlock possible).

## Why C Looks Different

The algorithm performs arithmetic comparisons over entire matrices. In C, you cannot do matrix operations directly like `Need[i] <= Work` — you must write a loop that checks each element:
```c
int possible = 1;
for (int j = 0; j < n_resources; j++) {
    if (need[i][j] > work[j]) {
        possible = 0;
        break;
    }
}
```
This requires nested multi-dimensional array iteration (loops within loops).

We also need to track the safe sequence list. We use an array `safe_seq[MAX]` and an index counter `ind` to store the order in which processes can safely execute.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
```

### Key Arrays & Variables
```c
int allocation[MAX_P][MAX_R]; // Allocation matrix
int max_demand[MAX_P][MAX_R]; // Max matrix
int need[MAX_P][MAX_R];       // Need matrix (calculated)
int available[MAX_R];         // Available resources
int finish[MAX_P] = {0};      // Process completion state
int work[MAX_R];              // Work vector
int safe_seq[MAX_P];          // Safe sequence order
```

### The Safety Loop
```c
int count = 0;
while (count < n_processes) {
    int found = 0;
    for (int i = 0; i < n_processes; i++) {
        if (finish[i] == 0) {
            int j;
            for (j = 0; j < n_resources; j++) {
                if (need[i][j] > work[j])
                    break;
            }
            if (j == n_resources) { // Process i's needs can be met
                for (int k = 0; k < n_resources; k++)
                    work[k] += allocation[i][k];
                safe_seq[count++] = i;
                finish[i] = 1;
                found = 1;
            }
        }
    }
    if (found == 0) {
        printf("The system is unsafe!\n");
        return 0;
    }
}
```

### Common Mistakes
- Confusing the `Max` demand with the `Need` matrix. You must calculate `Need = Max - Allocation` before running the safety checks.
- Forgetting to reset the `Work` vector to `Available` at the start of the check.
- Using `<` instead of `<=` when comparing `Need` with `Work`. If need is exactly equal to available work resources, the request can be safely granted.

## Official References

- **Wikipedia: Banker's Algorithm**: [Wikipedia: Banker's Algorithm](https://en.wikipedia.org/wiki/Banker%27s_algorithm)
- **GeeksforGeeks: Banker's Algorithm in Operating System**: [GeeksforGeeks: Banker's Algorithm in Operating System](https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system/)
