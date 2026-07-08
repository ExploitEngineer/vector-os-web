---
title: "CONVERTING DLL TO SO: THE FULL BREAKDOWN"
slug: "converting-dll-to-so-the-full-breakdown"
category: "TOOLS"
date: "March 2026"
excerpt: "Cross-platform binary compatibility is hard. Here's how our DLL2SO toolkit approaches the problem and where the real challenges are."
displayOrder: 2
---

"Just convert the DLL to a shared object" is one of those sentences that sounds like a checkbox and turns out to be a research project.
A Windows `.dll` and a Linux `.so` both hold machine code, but almost everything *around* that code differs.
This is a breakdown of what the DLL2SO toolkit actually has to reconcile.

## The two file formats are not the same shape

A DLL is a **PE** (Portable Executable) file.
A shared object is an **ELF** (Executable and Linkable Format) file.
They solve the same problem - "here is code and data other programs can link against" - with different layouts.

```bash
# Inspect a PE export table
objdump -x sample.dll | grep -A20 'Export Address Table'

# Inspect an ELF's dynamic symbols
readelf --dyn-syms sample.so
```

At minimum a converter has to map:

- **Section semantics** - PE `.text/.rdata/.data` vs ELF `.text/.rodata/.data/.bss`.
- **Export tables** - PE's export directory vs ELF's `.dynsym` + `.dynstr`.
- **Relocations** - PE base relocations vs ELF relocation entries (`R_X86_64_*`).
- **Imports** - PE import-address-table thunks vs ELF's PLT/GOT.

If the two formats were the whole story, this would be a mechanical rewrite. They are not.

## The ABI is where it actually hurts

The file format is syntax. The **ABI** is meaning, and it diverges hard.

### Calling conventions

64-bit Windows and the System V AMD64 ABI (Linux) pass arguments in *different registers*:

```c
/* Same C signature, different register assignment at the machine level */
long compute(long a, long b, long c, long d);

/* Windows x64:   a=RCX  b=RDX  c=R8   d=R9
   System V x64:  a=RDI  b=RSI  c=RDX  d=RCX  */
```

Any function that is called across the boundary, or that calls back out, needs a thunk that shuffles registers and fixes up stack alignment (Windows reserves 32 bytes of shadow space; System V does not).
There is no way to do this purely at the file-format level - you are rewriting call sites or wrapping them.

### The runtime the code assumes

This is the real wall.
A DLL was compiled against `kernel32`, `msvcrt`, the Windows loader, structured exception handling, and TLS callbacks.
An `.so` runs against glibc, the ELF loader, and DWARF-based unwinding.
Code that calls `CreateFileW` does not become portable because you changed its container - the symbol simply is not there.

DLL2SO handles this in three tiers:

1. **Pure computational code** - no OS calls. Fully convertible; this is the happy path.
2. **Thin-runtime code** - a small, well-known set of imports. We provide shim `.so`s that implement the Windows call in terms of POSIX.
3. **Deeply OS-coupled code** - SEH, COM, graphics, driver interfaces. Honest answer: not convertible without emulation, and we say so instead of pretending.

## Where the toolkit draws the line

The most important feature we built was not a converter - it was an **analyzer** that classifies a binary into those three tiers *before* anyone wastes a day on a conversion that cannot work.

```bash
dll2so analyze sample.dll
# → 41 imports across 3 libraries
# → tier: THIN-RUNTIME (37 shimmable, 4 unsupported: SEH)
# → estimate: convertible with the seh-fallback shim
```

Cross-platform binary compatibility is not one problem, it is a stack of them: format, ABI, and runtime, in increasing order of difficulty.
The engineering lesson from DLL2SO is that the valuable tool is the one that tells you *which* of those walls you are about to hit, and refuses to promise what the format alone can never deliver.
