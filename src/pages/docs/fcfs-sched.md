# FCFS Scheduling

## What is CPU Scheduling?

At any given moment, a computer may have dozens of processes ready to run, but the CPU can only execute **one process at a time**. The OS must decide: which process runs next, for how long, and in what order? This decision-making is called **CPU scheduling**.

Think of it like a ticket counter — people queue up, and the staff member serves them one at a time. The scheduling policy determines the order of service.

## Types of Scheduling

Scheduling algorithms fall into two major categories:

**Non-Preemptive (Run to Completion):** Once a process starts, it runs until it finishes or blocks. The CPU cannot be taken away. Simpler to implement.

**Preemptive (Can Interrupt):** The OS can stop a running process in the middle and give the CPU to another. More responsive but complex.

In this syllabus:
- **Non-Preemptive:** FCFS, SJF
- **Preemptive / Configurable:** Round Robin, Priority

## The Algorithm — Plain Steps

FCFS = First Come, First Served. Processes are served in the order they arrive.

1. Input the number of processes.
2. For each process, input: Process ID, Arrival Time (when it is ready), Burst Time (how long it needs the CPU).
3. Sort all processes by Arrival Time (earliest first).
4. Simulate the CPU executing one process at a time:
   - Current time starts at 0.
   - Pick the process with the earliest arrival that has not yet run.
   - If CPU is idle (no process arrived yet), advance time to next arrival.
   - **Waiting Time** = time process starts running - its arrival time.
   - **Finish Time** = start time + burst time.
   - **Turnaround Time** = finish time - arrival time.
5. Calculate average waiting time and average turnaround time.
6. Print the scheduling table.

## Why C Looks Different

The algorithm treats processes as abstract objects with properties. In C, there are no objects — you use a `struct` to group related data:
```c
struct Process {
    int pid, arrival, burst, waiting, turnaround;
};
```

Sorting in pseudocode is one line ("sort by arrival"). In C, you write a nested loop manually (or use `qsort()` with a comparator function). The inner loop performs a bubble sort — it compares adjacent elements and swaps if out of order.

The `printf` format string `"%-5d %-10d %-10d %-10d %-10d\n"` creates a table by using **field widths** — `%-5d` means print an integer left-aligned in a 5-character wide column. The minus sign means left-align.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
```

### Key struct
```c
struct Process {
    int pid;         // process identifier
    int arrival;     // arrival time
    int burst;       // CPU burst time needed
    int waiting;     // calculated: start_time - arrival
    int turnaround;  // calculated: waiting + burst
};
```

### Sorting by arrival time (bubble sort pattern)
```c
for (int i = 0; i < n-1; i++) {
    for (int j = 0; j < n-i-1; j++) {
        if (p[j].arrival > p[j+1].arrival) {
            struct Process temp = p[j];
            p[j] = p[j+1];
            p[j+1] = temp;
        }
    }
}
```

### Calculating waiting and turnaround
```c
int current_time = 0;
for (int i = 0; i < n; i++) {
    if (current_time < p[i].arrival)
        current_time = p[i].arrival; // CPU was idle, jump to arrival
    p[i].waiting = current_time - p[i].arrival;
    current_time += p[i].burst;
    p[i].turnaround = p[i].waiting + p[i].burst;
}
```

### Known Limitation: Convoy Effect
FCFS suffers from the **convoy effect** — if a long process arrives first, all short processes wait behind it. This wastes CPU time and increases average waiting time. SJF was invented to solve this problem.

## Official References

- **Wikipedia: CPU Scheduling**: [Wikipedia: CPU Scheduling](https://en.wikipedia.org/wiki/Scheduling_(computing))
- **Wikipedia: FIFO Scheduling**: [Wikipedia: FIFO Scheduling](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)#Scheduling)
- **GeeksforGeeks: CPU Scheduling in Operating Systems**: [GeeksforGeeks: CPU Scheduling in Operating Systems](https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/)
