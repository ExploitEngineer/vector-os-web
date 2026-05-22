export type PostCategory = "LINUX" | "SECURITY" | "TOOLS";

export type Post = {
  category: PostCategory;
  date: string;
  index: string;
  title: string;
  excerpt: string;
};

export const POST_FILTERS = ["ALL", "LINUX", "SECURITY", "TOOLS"] as const;
export const POSTS_PAGE_SIZE = 6;

export const POSTS: Post[] = [
  {
    category: "LINUX",
    date: "May 2026",
    index: "01",
    title: "BUILDING VECTOR OS FROM THE KERNEL UP",
    excerpt:
      "How we approached building a custom Linux distribution from scratch — kernel configuration, init systems, and what we learned along the way.",
  },
  {
    category: "SECURITY",
    date: "April 2026",
    index: "02",
    title: "HOW VECTOR RAT WORKS UNDER THE HOOD",
    excerpt:
      "A technical deep dive into the architecture of Vector Rat — remote access, persistence mechanisms, and the C# internals.",
  },
  {
    category: "TOOLS",
    date: "March 2026",
    index: "03",
    title: "CONVERTING DLL TO SO: THE FULL BREAKDOWN",
    excerpt:
      "Cross-platform binary compatibility is hard. Here's how our DLL2SO toolkit approaches the problem and where the real challenges are.",
  },
  {
    category: "SECURITY",
    date: "February 2026",
    index: "04",
    title: "PAYLOAD OBFUSCATION TECHNIQUES IN 2026",
    excerpt:
      "Modern AV evasion strategies — from base64 encoding to polymorphic shellcode. What works, what doesn't, and why.",
  },
  {
    category: "LINUX",
    date: "January 2026",
    index: "05",
    title: "WRITING A KERNEL MODULE FROM SCRATCH",
    excerpt:
      "Step-by-step walkthrough of building a Linux kernel module — hooking syscalls, managing memory, and avoiding panics.",
  },
  {
    category: "TOOLS",
    date: "December 2025",
    index: "06",
    title: "BUILDING A C2 FRAMEWORK: ARCHITECTURE GUIDE",
    excerpt:
      "Design patterns for command and control infrastructure — async I/O, operator channels, and agent resilience.",
  },
  {
    category: "LINUX",
    date: "November 2025",
    index: "07",
    title: "PROCESS INJECTION ON LINUX: A DEEP DIVE",
    excerpt:
      "Exploring ptrace, /proc/mem, and shared library injection for post-exploitation on Linux systems.",
  },
  {
    category: "SECURITY",
    date: "October 2025",
    index: "08",
    title: "REVERSE ENGINEERING WINDOWS DRIVERS",
    excerpt:
      "How to analyze and exploit poorly written Windows kernel drivers using IDA Pro and WinDbg.",
  },
  {
    category: "TOOLS",
    date: "September 2025",
    index: "09",
    title: "AUTOMATING RED TEAM OPS WITH PYTHON",
    excerpt:
      "Scripts, frameworks and tooling patterns that save hours during engagements — recon to post-exploitation.",
  },
];
