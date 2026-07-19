# FIFO Page Replacement

## What is Virtual Memory?

Your computer may have 8 GB of RAM, but each program thinks it has access to much more. This illusion is created by **virtual memory** — the OS uses disk space as an extension of RAM. Programs work with virtual **pages** (fixed-size chunks of address space, typically 4 KB). Physical RAM holds only the pages currently needed — the rest stay on disk.

When a program accesses a page that is not in RAM, a **page fault** occurs: the OS must load that page from disk. If RAM is full, it must **evict** (remove) an existing page to make room. Which page to evict is the **page replacement** problem.

## Where Does This Fit?

Page replacement algorithms decide which page to kick out when RAM is full:

| Algorithm | Eviction Rule | Performance |
|---|---|---|
| **FIFO** | Evict oldest loaded page | Simple, but Belady's anomaly |
| LRU | Evict least recently used | Better, harder to implement |
| Optimal | Evict page used farthest in future | Best possible, not implementable in real-time |

## The Algorithm — Plain Steps

1. Input the number of physical frames (slots in RAM) and the page reference string (sequence of page numbers accessed).
2. Maintain a queue of pages currently in RAM — oldest at the front, newest at the back.
3. For each page in the reference string:
   - **If the page is already in RAM (hit):** do nothing, count as a hit.
   - **If the page is not in RAM (fault):**
     - If RAM has empty frames: load the page into an empty frame.
     - If RAM is full: remove the page at the front of the queue (oldest loaded), load the new page.
   - Increment the page fault counter.
4. Print the number of page faults.

## Why C Looks Different

A queue in pseudocode is abstract. In C, the frame queue is typically implemented as a fixed array of frame slots. To check if a page is already in a frame, you scan the entire frame array — `O(n)` scan per page reference.

The "oldest page" in FIFO is tracked using a `front` index that cycles: when a frame is replaced, it is always `frames[front]`, and `front = (front + 1) % n_frames`.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>   // printf(), scanf()
```

### Key state
```c
int frames[MAX_FRAMES];     // pages currently in RAM
int frame_count = 0;        // how many frames are currently filled
int front = 0;              // index of the oldest frame (next to evict)
int page_faults = 0;        // counter
```

### Check if page is already loaded (hit check)
```c
int found = 0;
for (int j = 0; j < n_frames; j++) {
    if (frames[j] == page) {
        found = 1;
        break;
    }
}
```

### Handle a page fault
```c
if (!found) {
    frames[front] = page;          // replace the oldest slot
    front = (front + 1) % n_frames; // advance the circular pointer
    page_faults++;
}
```

### Belady's Anomaly
FIFO has a strange property called **Belady's Anomaly**: adding more frames can sometimes **increase** page faults. This is counterintuitive and is unique to FIFO. LRU and Optimal do not have this problem. It is a common exam question.

Example: Reference string 1,2,3,4,1,2,5,1,2,3,4,5
- 3 frames -> 9 page faults
- 4 frames -> 10 page faults (more faults with more RAM!)

## Official References

- **Wikipedia: Page Replacement Algorithm**: [Wikipedia: Page Replacement Algorithm](https://en.wikipedia.org/wiki/Page_replacement_algorithm)
- **GeeksforGeeks: Page Replacement Algorithms in OS**: [GeeksforGeeks: Page Replacement Algorithms in OS](https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/)
