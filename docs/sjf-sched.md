# SJF Scheduling

## What is SJF?

**Shortest Job First** (SJF) is a CPU scheduling algorithm that always selects the process with the **smallest burst time** (least CPU time needed) from the set of currently available processes. It is like a supermarket queue where a cashier always serves the customer with the fewest items next — minimising average wait time across all customers.

SJF is proven to give the **minimum average waiting time** of any non-preemptive algorithm, making it theoretically optimal for that metric.

## Where Does This Fit?

SJF is a **non-preemptive** scheduling algorithm — once a process starts, it runs to completion. It is compared alongside FCFS, Round Robin, and Priority in the scheduling family:

| Algorithm | Preemptive | Selection Criteria |
|---|---|---|
| FCFS | No | Earliest arrival |
| **SJF** | **No** | **Shortest burst** |
| Round Robin | Yes | Circular queue |
| Priority | Optional | Highest priority |

## The Algorithm — Plain Steps

1. Input number of processes, each with arrival time and burst time.
2. Sort processes by arrival time.
3. Simulate time step by step:
   - At each scheduling point, find all processes that have **arrived** (arrival ≤ current time) and **not yet run**.
   - From these ready processes, pick the one with the **smallest burst time**.
   - If no process is ready yet, advance time to the next arrival.
4. Run the selected process to completion (non-preemptive).
5. Calculate waiting time = start time − arrival time.
6. Calculate turnaround time = waiting time + burst time.
7. Print the scheduling table with averages.

## Why C Looks Different

The key challenge: at each scheduling point, you need to find the process with minimum burst time **among those that have already arrived**. In C, this requires two nested loops — outer loop iterates through scheduling rounds, inner loop scans all unfinished processes to find the minimum burst among arrived ones.

There is no built-in "find minimum in subset" — you initialise a variable to a large value (like 9999) and scan manually, replacing it whenever you find something smaller.

The "not yet run" tracking is done using a boolean-like int array: `int completed[MAX] = {0}` — set to 1 when a process finishes.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
#include <limits.h>  // INT_MAX (optional, for clean initialisation)
```

### Finding the shortest available job
```c
int min_burst = 9999, selected = -1;
for (int i = 0; i < n; i++) {
    if (!done[i] && p[i].arrival <= current_time) {
        if (p[i].burst < min_burst) {
            min_burst = p[i].burst;
            selected = i;
        }
    }
}
```

### Handling CPU idle time
```c
if (selected == -1) {
    // No process is ready yet — advance to the next arrival
    current_time++;
    continue;
}
```

### Starvation Problem
SJF can cause **starvation** — if short processes keep arriving, a long process may wait indefinitely. This is the main disadvantage compared to FCFS (which guarantees every process eventually runs). The solution is **aging** — increasing priority over time — but that is implemented in the Priority Scheduling algorithm.

## Official References

- **Wikipedia: Shortest Job Next**: [Wikipedia: Shortest Job Next](https://en.wikipedia.org/wiki/Shortest_job_next)
- **GeeksforGeeks: Shortest Job First Scheduling**: [GeeksforGeeks: Shortest Job First Scheduling](https://www.geeksforgeeks.org/program-for-shortest-job-first-sjf-scheduling-set-1-non-preemptive/)
