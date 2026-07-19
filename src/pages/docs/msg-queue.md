# Message Queue Chat

## What is a Message Queue?

A message queue is an IPC mechanism where the OS maintains an **ordered queue of messages**. One process puts messages in (sends), another takes messages out (receives). The OS guarantees that messages arrive in the order they were sent, and it handles all the synchronisation automatically.

Think of it like a post box — one person drops letters in, another collects them. The post box (OS) ensures the letters stay in order and are not lost.

## Where Does This Fit?

Message queues are one of the three classic **System V IPC** mechanisms alongside shared memory and semaphores. Unlike shared memory (which requires manual synchronisation), message queues are inherently safe — the OS queues messages atomically.

IPC types compared:
- **Shared Memory** — fastest, but you synchronise manually
- **Message Queues** — OS-managed ordering, moderate speed
- **Pipes** — simple byte stream, only between related processes

## The Algorithm — Plain Steps

**Client:**
1. Create/access a message queue with a known key using `msgget()`.
2. Loop: read a message string from the user.
3. Package the message into a struct (type + content + sender name).
4. Send it using `msgsnd()`.
5. Wait to receive a reply from the server using `msgrcv()`.
6. Print the reply.
7. If the user typed "exit", terminate.

**Server:**
1. Access the same message queue using the same key.
2. Loop: receive a message from the client using `msgrcv()`.
3. Print the received message.
4. If message is "exit", terminate.
5. Otherwise, package and send a reply using `msgsnd()`.

## Why C Looks Different

The message is not sent as a plain string — it must be wrapped in a **struct** with a `long` type field as the first member. This is a hard requirement of the message queue API; the type field is used to filter messages when receiving (`msgrcv` can receive only messages of a specific type).

The `ftok()` function is often used to generate a key from a file path and a number. This is more robust than hardcoding a number because it generates unique keys that do not clash with other programs.

## C Implementation Guide

### Required Headers
```c
#include <stdio.h>    // printf(), scanf()
#include <string.h>   // strcpy(), strcmp()
#include <sys/types.h> // key_t
#include <sys/ipc.h>  // IPC_CREAT
#include <sys/msg.h>  // msgget(), msgsnd(), msgrcv()
#include <unistd.h>   // getpid()
```

### The Message Struct (mandatory format)
```c
struct mymsg {
    long type;    // MUST be first field, MUST be > 0
    char msg[30]; // message content
    char from[10]; // sender identifier
};
```

### Key Functions
```c
// Create or access queue
int qid = msgget(key, IPC_CREAT | 0666);

// Send a message
msgsnd(qid, &message, sizeof(message) - sizeof(long), 0);
// Note: size excludes the long type field

// Receive a message
msgrcv(qid, &message, sizeof(message) - sizeof(long), type, 0);
// type: 0 = receive any message
```

### Common Mistakes
- Struct's first field must be `long type` — any other arrangement breaks the API.
- Message size passed to msgsnd/msgrcv should be `sizeof(struct) - sizeof(long)` to exclude the type field.
- Using the same message type for both directions causes client to receive its own messages — use type 1 for client-to-server and type 2 for server-to-client.

## Official References

- **POSIX msgget Specification**: [POSIX msgget Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/msgget.html)
- **POSIX msgsnd Specification**: [POSIX msgsnd Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/msgsnd.html)
- **POSIX msgrcv Specification**: [POSIX msgrcv Specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/msgrcv.html)
- **Linux msgget(2) Man Page**: [Linux msgget(2) Man Page](https://man7.org/linux/man-pages/man2/msgget.2.html)
- **Linux msgsnd(2) Man Page**: [Linux msgsnd(2) Man Page](https://man7.org/linux/man-pages/man2/msgsnd.2.html)
- **Linux msgrcv(2) Man Page**: [Linux msgrcv(2) Man Page](https://man7.org/linux/man-pages/man2/msgrcv.2.html)
