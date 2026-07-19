# Priority Scheduling

## What is Priority Scheduling?

Priority Scheduling assigns each process a **priority number**. The CPU always runs the highest-priority process available. It is like emergency services triage — critical patients are treated first regardless of who arrived first.

In this implementation, a **lower number means higher priority** (priority 1 is served before priority 2). This is the convention used in most OS textbooks, though some systems reverse it.

## Where Does This Fit?

Priority Scheduling is the most flexible algorithm — FCFS and SJF can be seen as special cases:
- FCFS: all processes have equal priority, arrivals determine order.
- SJF: priority = 1/burst (shortest burst = highest priority).
- **Priority: explicit numeric priority assigned per process.**

Priority can be implemented in two modes:
- **Non-preemptive:** selected process runs to completion.
- **Preemptive (SRTF-style):** if a higher-priority process arrives mid-execution, it preempts the current process.

This syllabus implementation is non-preemptive.

## The Algorithm — Plain Steps

1. Input each process's: arrival time, burst time, and priority number.
2. Sort processes first by arrival time.
3. At each scheduling point, find all processes that have **arrived** and **not yet run**.
4. From the ready set, select the process with the **lowest priority number** (highest urgency).
5. If tie in priority, prefer the one that arrived earlier.
6. Run that process to completion (non-preemptive).
7. Advance current time by its burst time.
8. Calculate waiting time = start − arrival; turnaround = waiting + burst.
9. Repeat until all processes are done.

## Why C Looks Different

Finding "the arrived process with minimum priority number" requires scanning all unfinished processes. This is similar to SJF but comparing `priority` instead of `burst`. The completed array tracks which processes are done.

Two conditions must both be true for a process to be a candidate:
```c
if (!done[i] && p[i].arrival <= current_time)
```
Both conditions joined with `&&` (AND). This is a fundamental pattern in scheduling simulations.

Tie-breaking (same priority, different arrival) requires an additional comparison nested inside the minimum-finding loop.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>  // printf(), scanf()
```

### Key struct addition
```c
struct Process {
    int pid, arrival, burst, priority;
    int waiting, turnaround;
};
```

### Selecting highest priority from ready processes
```c
int min_priority = 9999, selected = -1;
for (int i = 0; i < n; i++) {
    if (!done[i] && p[i].arrival <= current_time) {
        if (p[i].priority < min_priority ||
           (p[i].priority == min_priority && p[i].arrival < p[selected].arrival)) {
            min_priority = p[i].priority;
            selected = i;
        }
    }
}
```

### Starvation and Aging
**Starvation:** Low-priority processes may wait indefinitely if high-priority processes keep arriving. This is a real problem in systems using pure priority scheduling.

**Aging solution:** Every N time units, increase the priority of waiting processes by 1 (lower number). This guarantees that even the lowest-priority process eventually reaches priority 1 and gets the CPU. Aging is not implemented in the basic version shown here but is important to know for exams.

## Official References

- **Wikipedia: Priority Scheduling**: [Wikipedia: Priority Scheduling](https://en.wikipedia.org/wiki/Scheduling_(computing)#Priority_scheduling)
- **GeeksforGeeks: Priority CPU Scheduling**: [GeeksforGeeks: Priority CPU Scheduling](https://www.geeksforgeeks.org/program-for-priority-scheduling-set-1/)
