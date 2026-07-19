# LRU Page Replacement

## What is LRU?

**Least Recently Used (LRU)** page replacement evicts the page that has not been accessed for the **longest time**. The intuition: if a page has not been used recently, it is probably not needed soon either. This is based on the **principle of temporal locality** — programs tend to access the same pages repeatedly over short time windows.

LRU is the most widely studied page replacement algorithm because it approximates the theoretically optimal algorithm very closely while being practically implementable.

## Where Does This Fit?

LRU is one step above FIFO in the page replacement hierarchy:

| Algorithm | Evicts | Quality |
|---|---|---|
| FIFO | Oldest loaded page | Simple, but Belady's anomaly |
| **LRU** | **Least recently accessed page** | **Good, no Belady's anomaly** |
| Optimal | Page not used longest in future | Perfect, impossible in real-time |

LRU is used (approximated) in real operating systems, including Linux, via hardware reference bits and clock algorithms.

## The Algorithm — Plain Steps

1. Input the number of frames and the page reference string.
2. Maintain the set of pages in RAM.
3. For each page reference:
   - **Hit:** page is already in RAM. Update its **last-used time** to current step.
   - **Fault:** page is not in RAM.
     - If frames are available: load the page, record its last-used time.
     - If RAM is full: find the page with the **oldest last-used time** (LRU page), evict it, load the new page.
4. Count and print total page faults.

## Why C Looks Different

The "last used time" is tracked with a separate array `int last_used[MAX_FRAMES]`. Each time a page is accessed (hit or loaded), its entry in `last_used` is updated to the current step number. When eviction is needed, you scan `last_used` to find the minimum value — that frame is the LRU victim.

This counter-based approach is the standard simulation method. Real hardware uses reference bits that the OS reads periodically, which is more efficient but conceptually the same idea.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
```

### Key state
```c
int frames[MAX_FRAMES];       // pages currently in RAM
int last_used[MAX_FRAMES];    // step number when each frame was last accessed
int frame_count = 0;
int page_faults = 0;
```

### Hit: update last used time
```c
for (int j = 0; j < frame_count; j++) {
    if (frames[j] == page) {
        last_used[j] = step;  // reset recency counter
        hit = 1;
        break;
    }
}
```

### Fault: find LRU frame to evict
```c
int lru_idx = 0;
for (int j = 1; j < frame_count; j++) {
    if (last_used[j] < last_used[lru_idx]) {
        lru_idx = j;  // found a less recently used frame
    }
}
frames[lru_idx] = page;
last_used[lru_idx] = step;
page_faults++;
```

### LRU vs FIFO Performance
LRU generally produces fewer page faults than FIFO because it makes smarter eviction decisions. Most importantly, LRU does **not** suffer from Belady's anomaly — adding more frames never increases page faults.

### Implementation Cost
The weakness of LRU: tracking "last used time" for every page requires hardware support or software overhead. Real OS implementations use approximations (like the Not-Recently-Used clock algorithm) rather than true LRU, because perfect LRU would require hardware counters on every memory access.

## Official References

- **Wikipedia: Least Recently Used (LRU) Page Replacement**: [Wikipedia: Least Recently Used (LRU) Page Replacement](https://en.wikipedia.org/wiki/Page_replacement_algorithm#Least_recently_used)
- **GeeksforGeeks: Page Replacement Algorithms in OS**: [GeeksforGeeks: Page Replacement Algorithms in OS](https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/)
