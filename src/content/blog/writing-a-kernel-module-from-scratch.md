---
title: "WRITING A KERNEL MODULE FROM SCRATCH"
slug: "writing-a-kernel-module-from-scratch"
category: "LINUX"
date: "January 2026"
excerpt: "Step-by-step walkthrough of building a Linux kernel module - hooking syscalls, managing memory, and avoiding panics."
displayOrder: 4
---

A kernel module is the smallest unit of code that runs with ring-0 privileges on Linux.
Writing one is the fastest way to understand what "the kernel" actually is: an API surface you link against, with no safety net.
This post is a gentle on-ramp - the lifecycle, the build, and the mistakes that panic a box.

## The two functions that define a module

Every module is bracketed by an init and an exit hook.
The init returns 0 on success or a negative errno; the exit must undo *everything* init did, in reverse order, or the kernel leaks.

```c
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init vos_init(void) {
    pr_info("vos: module loaded\n");
    return 0;   /* non-zero here aborts the load cleanly */
}

static void __exit vos_exit(void) {
    pr_info("vos: module unloaded\n");
}

module_init(vos_init);
module_exit(vos_exit);
MODULE_LICENSE("GPL");
```

`MODULE_LICENSE("GPL")` is not decoration - without it the kernel taints and hides GPL-only symbols from you.

## Rules that keep the box alive

Kernel code has no `malloc` and no forgiveness. A few non-negotiables:

- **Never sleep in atomic context.** Holding a spinlock and calling something that can block is an instant deadlock.
- **Match every allocation with a free** on every exit path, including error paths in init.
- **Validate everything from userspace** with `copy_from_user`; a raw pointer deref is an oops.
- **Test in a VM.** A panic is a hard reboot, and you will cause panics.

The mechanics of hooking syscalls and walking kernel structures build on exactly this lifecycle.

_Detailed write-up coming soon._
