---
title: "PROCESS INJECTION ON LINUX: A DEEP DIVE"
slug: "process-injection-on-linux-a-deep-dive"
category: "LINUX"
date: "November 2025"
excerpt: "Exploring ptrace, /proc/mem, and shared library injection for post-exploitation on Linux systems."
displayOrder: 6
---

Process injection on Linux is less exotic than its Windows cousin, and that makes it a clean subject to study.
The primitives are all documented kernel interfaces - `ptrace`, `/proc/<pid>/mem`, the dynamic linker - and understanding them is what lets defenders instrument the right places.

## The primitives, ranked by noise

Each injection route trades stealth for reliability, and each leaves a different footprint:

- **`ptrace(PT_ATTACH)`** is the loud, reliable path. One process attaching to another that it did not fork is a strong signal on its own.
- **`/proc/<pid>/mem`** lets a sufficiently privileged process write another's address space directly, bypassing the ptrace API but not its permission model.
- **`LD_PRELOAD`** is not injection into a running process at all - it is hijacking the loader at launch, and it is trivially audited via the environment.

## What attaching actually looks like

The `ptrace` attach-and-detach dance is the core of most runtime injectors.
Seen from a detection standpoint, the `PTRACE_ATTACH` request is the tripwire.

```c
#include <sys/ptrace.h>
#include <sys/wait.h>

/* Attach, let the tracee stop, then (in a real tool) read/write regs. */
if (ptrace(PTRACE_ATTACH, target_pid, NULL, NULL) == -1)
    perror("attach");   /* fails without CAP_SYS_PTRACE or matching uid */
waitpid(target_pid, NULL, 0);   /* wait for the tracee to actually stop */

/* ... manipulate registers / memory here ... */

ptrace(PTRACE_DETACH, target_pid, NULL, NULL);
```

Note the permission gate: without `CAP_SYS_PTRACE` or a matching UID (and subject to the Yama `ptrace_scope` sysctl), the attach simply fails.
That sysctl is the single most effective mitigation, and most hardened builds set it to `2` or `3`.

## Detection

The defensive story is straightforward: audit `ptrace` syscalls, watch for writes to `/proc/*/mem`, and log `LD_PRELOAD` in process environments.

_Detailed write-up coming soon._
