---
title: "BUILDING VECTOR OS FROM THE KERNEL UP"
slug: "building-vector-os-from-the-kernel-up"
category: "LINUX"
date: "May 2026"
excerpt: "How we approached building a custom Linux distribution from scratch - kernel configuration, init systems, and what we learned along the way."
displayOrder: 0
---

Most "custom" Linux distributions are a re-skin of Debian or Arch with a themed wallpaper and a curated package list.
Vector OS started from a harder question: what does the smallest defensible system that still boots on real hardware actually look like?
This is the story of building it from the kernel up - the decisions, the dead ends, and the parts we would do the same way again.

## Why build from scratch at all

You do not build a distribution from scratch to save time.
You do it to *understand* the system, and to remove everything you cannot justify.
For a security-focused OS that means three concrete goals:

- **A minimal attack surface.** Every daemon that ships is a daemon that can be exploited. The default install should contain almost nothing.
- **A reproducible build.** The same sources and toolchain must produce a bit-for-bit identical image, so a compromised build machine is detectable.
- **A readable system.** An operator should be able to trace any running process back to the file that started it.

Those three goals drive nearly every decision below.

## Configuring the kernel

We build a monolithic-ish kernel with a deliberately short module list.
The starting point is a `tinyconfig`, not the distro `defconfig` - you add what you need instead of pruning what you do not.

```bash
# Start from the smallest possible working config
make tinyconfig

# Turn on just the subsystems this hardware needs
make menuconfig

# Reproducible builds: pin the timestamp and toolchain
export KBUILD_BUILD_TIMESTAMP='@1700000000'
export KBUILD_BUILD_USER='vector'
export KBUILD_BUILD_HOST='builder'

make -j"$(nproc)" bzImage
```

A few options matter more than the rest for a hardened target:

- `CONFIG_MODULES=n` where the hardware allows it. No loadable modules means no `insmod`-based persistence.
- `CONFIG_STRICT_KERNEL_RWX=y` and `CONFIG_STRICT_MODULE_RWX=y`. Executable memory is never writable.
- `CONFIG_RANDOMIZE_BASE=y` for KASLR.
- `CONFIG_SECURITY_LOCKDOWN_LSM=y`, booted in `confidentiality` mode, to cut off `/dev/mem`, kprobes on production images, and raw kernel access.

The lesson here: `menuconfig` is not a checklist, it is a threat model.
Every `y` is a promise that you understand what that code does.

## The init question

`systemd` is powerful and, for a minimal security appliance, far too large.
We wanted an init we could read in an afternoon.
The first working image used a hand-written PID 1 whose entire job was: mount the pseudo-filesystems, start the supervisor, and reap zombies.

```c
/* pid1.c - the smallest init that is still honest about its job */
#include <sys/mount.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    mount("proc", "/proc", "proc", 0, NULL);
    mount("sysfs", "/sys", "sysfs", 0, NULL);
    mount("devtmpfs", "/dev", "devtmpfs", 0, NULL);

    if (fork() == 0)
        execl("/sbin/supervisor", "supervisor", (char *)NULL);

    /* PID 1 must never exit, and must reap orphans forever */
    for (;;)
        wait(NULL);
    return 0;
}
```

That is not a production init - it has no service dependencies, no socket activation, no logging.
But writing it taught the team exactly which responsibilities a real init actually owns, and we ported those responsibilities to a small supervisor (`runit`-style) rather than adopting a large one.

## Userland and the root filesystem

The base image is a BusyBox userland on a read-only squashfs root, with a small writable overlay for state.
Read-only root is the single highest-value hardening decision we made:

- Persistence via file modification is dramatically harder when the filesystem rejects writes.
- Integrity checking is trivial - the root hash is fixed and can be verified with dm-verity at boot.
- Recovery is `reboot`. The system returns to a known-good state every time.

## What we would do the same, and what we would not

Things that paid off:

1. Starting from `tinyconfig`. It forced understanding.
2. Read-only root with an explicit overlay for state.
3. Reproducible builds from day one, not bolted on later.

Things that cost more than they were worth:

1. The hand-rolled PID 1 in production. Educational, but a small audited supervisor is the right long-term answer.
2. Being religious about `CONFIG_MODULES=n` on developer laptops - it made hardware bring-up miserable. We keep modules on dev images and off release images.

Building from the kernel up is slower, and that is the point.
The distribution you end up with is one you can actually reason about, and for a security platform that is worth more than any feature you could have shipped in the time.
