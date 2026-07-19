# Round Robin Scheduling

## What is Round Robin?

Round Robin (RR) is a **preemptive** scheduling algorithm designed for fair time-sharing. Every process gets a fixed slice of CPU time called a **time quantum** (or time slice). When a process's quantum expires, it is moved to the back of the queue, and the next process gets its turn.

Think of it like a game of hot potato — everyone gets the potato for exactly 3 seconds, then must pass it along regardless of whether they are done. No one waits too long, and everyone gets a turn.

## Where Does This Fit?

Round Robin is the standard algorithm used by most general-purpose operating systems for interactive workloads. It balances:
- **Fairness** — all processes get equal CPU time slices
- **Responsiveness** — no single process monopolises the CPU
- **Context switching overhead** — more preemptions = more overhead

Compared to other algorithms:
- FCFS: non-preemptive, unfair for long jobs
- SJF: optimal average waiting but can starve long jobs
- **RR: fair to all, good for interactive systems**
- Priority: based on importance, can starve low-priority

## The Algorithm — Plain Steps

1. Input processes with arrival time, burst time, and a time quantum value.
2. Use a queue (or array with front/rear pointers) to hold ready processes.
3. At time 0, add all processes with arrival time 0 to the queue.
4. Take the front process from the queue.
5. Run it for **min(quantum, remaining_burst_time)** units.
6. Advance current time by that amount.
7. Add any newly arrived processes to the queue (those with arrival ≤ current_time).
8. If the process still has remaining burst > 0, add it back to the end of the queue.
9. If it finished, record its completion time.
10. Calculate waiting time = turnaround time − burst time; turnaround = finish − arrival.
11. Repeat until queue is empty.

## Why C Looks Different

A queue in pseudocode is an abstract data structure. In C, you simulate it with an array and two integer indices: `front` and `rear`. Enqueue: `queue[rear++] = process_index`. Dequeue: `index = queue[front++]`.

"Remaining burst time" requires a separate array to track how much CPU time each process still needs, updated each round.

The `int rem[MAX]` array is initialised to each process's burst time and decremented by `quantum` (or set to 0 if less than quantum remains). This is the key state that differs from FCFS/SJF.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>  // printf(), scanf()
```

### Key additional state (compared to FCFS)
```c
int rem[MAX];        // remaining burst time for each process
int queue[MAX*10];   // circular queue of process indices
int front = 0, rear = 0;
int quantum;         // the time slice value (input from user)
```

### Queue operations
```c
// Enqueue process i
queue[rear++] = i;

// Dequeue
int current = queue[front++];
```

### Running one quantum
```c
int time_slice = (rem[current] < quantum) ? rem[current] : quantum;
current_time += time_slice;
rem[current] -= time_slice;

if (rem[current] == 0) {
    // Process finished
    finish[current] = current_time;
    turnaround[current] = finish[current] - p[current].arrival;
    waiting[current] = turnaround[current] - p[current].burst;
} else {
    // Not done, re-enqueue
    queue[rear++] = current;
}
```

### Choosing the Quantum
- Too small: too many context switches, CPU wastes time saving/restoring state.
- Too large: approaches FCFS behaviour, long processes block others.
- Typical real OS quantum: 10–100 milliseconds.

## Official References

- **Wikipedia: Round Robin Scheduling**: [Wikipedia: Round Robin Scheduling](https://en.wikipedia.org/wiki/Round-robin_scheduling)
- **GeeksforGeeks: Round Robin CPU Scheduling**: [GeeksforGeeks: Round Robin CPU Scheduling](https://www.geeksforgeeks.org/program-round-robin-scheduling-set-1/)
