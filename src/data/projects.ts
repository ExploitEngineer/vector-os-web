import { COLORS } from "@/lib/theme";

export type ProjectStatus = "active" | "coming-soon" | "classified";

export type BootLine = { text: string; color: string };

export type Project = {
  slug: string;
  name: string;
  short: string;
  lang: string;
  stars: number;
  status: ProjectStatus;
  tags: string[];
  /** Marquee duration for the card's scrolling bootlog. */
  scrollSpeed: string;
  bootlog: BootLine[];
  url: string;
};

const { cyan, green, red, muted } = COLORS;

export const PROJECTS: Project[] = [
  {
    slug: "vector-os-distro",
    name: "VECTOR OS DISTRO",
    short:
      "Custom Linux distribution. Currently in early development — not ready for use.",
    lang: "C",
    stars: 9,
    status: "coming-soon",
    tags: ["VECTOR OS", "LINUX", "KERNEL"],
    scrollSpeed: "8s",
    bootlog: [
      { text: "[ IN DEVELOPMENT ]", color: cyan },
      { text: "// not ready for use", color: muted },
      { text: "// contributions welcome", color: cyan },
      { text: "[  0.000] Booting Vector OS v0.3.1...", color: muted },
      { text: "[  0.182] Loading kernel modules...", color: muted },
      { text: "[  0.441] Mounting filesystems...", color: muted },
      { text: "[ IN DEVELOPMENT ]", color: cyan },
      { text: "// not ready for use", color: muted },
      { text: "// contributions welcome", color: cyan },
      { text: "[  0.000] Booting Vector OS v0.3.1...", color: muted },
      { text: "[  0.182] Loading kernel modules...", color: muted },
      { text: "[  0.441] Mounting filesystems...", color: muted },
    ],
    url: "https://github.com/Vector-OS",
  },
  {
    slug: "vector-rat",
    name: "VECTOR RAT",
    short:
      "Remote access tool engineered for Windows. Full system control, low footprint.",
    lang: "C#",
    stars: 38,
    status: "active",
    tags: ["C#", "WINDOWS", "RAT"],
    scrollSpeed: "7s",
    bootlog: [
      { text: "> Initializing Vector-RAT v2.1", color: cyan },
      { text: "> Connecting to C2 server...", color: muted },
      { text: "> Session established", color: green },
      { text: "> Enumerating processes...", color: muted },
      { text: "> Keylogger: ACTIVE", color: green },
      { text: "> Screencap module: READY", color: green },
      { text: "> Shell access: GRANTED", color: green },
      { text: "> Awaiting commands...", color: cyan },
      { text: "> Initializing Vector-RAT v2.1", color: cyan },
      { text: "> Connecting to C2 server...", color: muted },
      { text: "> Session established", color: green },
      { text: "> Enumerating processes...", color: muted },
    ],
    url: "https://github.com/Vector-OS",
  },
  {
    slug: "storm-kitty",
    name: "STORM KITTY BUILDER",
    short:
      "Payload generation toolkit. Customizable, extensible, built for red teamers.",
    lang: "Python",
    stars: 14,
    status: "active",
    tags: ["STORM KITTY", "VECTOR OS", "VECTOR TECH"],
    scrollSpeed: "9s",
    bootlog: [
      { text: "$ storm-kitty --init", color: cyan },
      { text: "Loading payload modules...", color: muted },
      { text: "Template: reverse_shell", color: green },
      { text: "Encoding: base64+xor", color: green },
      { text: "Obfuscation level: 3", color: green },
      { text: "Target OS: Windows x64", color: green },
      { text: "Generating payload...", color: muted },
      { text: "Output: payload_x64.exe ✓", color: cyan },
      { text: "$ storm-kitty --init", color: cyan },
      { text: "Loading payload modules...", color: muted },
      { text: "Template: reverse_shell", color: green },
      { text: "Encoding: base64+xor", color: green },
    ],
    url: "https://github.com/Vector-OS",
  },
  {
    slug: "dll2so",
    name: "DLL2SO TOOLKIT",
    short:
      "Convert Windows DLLs to Linux shared objects. Cross-platform bridging utility.",
    lang: "Python",
    stars: 6,
    status: "active",
    tags: ["PYTHON", "DLL", "CROSS-PLATFORM"],
    scrollSpeed: "8.5s",
    bootlog: [
      { text: "$ dll2so --input lib.dll", color: cyan },
      { text: "Parsing PE headers...", color: muted },
      { text: "Extracting exports: 47 symbols", color: green },
      { text: "Resolving dependencies...", color: muted },
      { text: "Generating ELF stubs...", color: green },
      { text: "Patching relocations...", color: muted },
      { text: "Linking: libout.so", color: green },
      { text: "Conversion complete ✓", color: cyan },
      { text: "$ dll2so --input lib.dll", color: cyan },
      { text: "Parsing PE headers...", color: muted },
      { text: "Extracting exports: 47 symbols", color: green },
      { text: "Resolving dependencies...", color: muted },
    ],
    url: "https://github.com/Vector-OS",
  },
  {
    slug: "port-scanner",
    name: "PORT SCANNER",
    short:
      "High-speed network analysis. Stealth mode. Async I/O. Built for recon.",
    lang: "Python",
    stars: 0,
    status: "coming-soon",
    tags: ["PYTHON", "NETWORK", "RECON"],
    scrollSpeed: "7.5s",
    bootlog: [
      { text: "$ vscan --target 0.0.0.0/24", color: muted },
      { text: "Mode: SYN stealth", color: muted },
      { text: "Threads: 512", color: muted },
      { text: "[ DROPPING SOON ]", color: cyan },
      { text: "ETA: Q3 2026", color: muted },
      { text: "Stay tuned.", color: muted },
      { text: "$ vscan --target 0.0.0.0/24", color: muted },
      { text: "Mode: SYN stealth", color: muted },
      { text: "Threads: 512", color: muted },
      { text: "[ DROPPING SOON ]", color: cyan },
      { text: "ETA: Q3 2026", color: muted },
      { text: "Stay tuned.", color: muted },
    ],
    url: "https://github.com/Vector-OS",
  },
  {
    slug: "ai-tools",
    name: "AI TOOLS SUITE",
    short:
      "ML-powered utilities for real-world offensive and defensive security problems.",
    lang: "Python",
    stars: 0,
    status: "classified",
    tags: ["AI", "ML", "PYTHON"],
    scrollSpeed: "6s",
    bootlog: [
      { text: "$ vector-ai --boot", color: muted },
      { text: "Initializing...", color: muted },
      { text: "[ ACCESS DENIED ]", color: red },
      { text: "CLEARANCE REQUIRED", color: red },
      { text: "STATUS: CLASSIFIED", color: red },
      { text: "// details redacted", color: muted },
      { text: "[ ACCESS DENIED ]", color: red },
      { text: "CLEARANCE REQUIRED", color: red },
      { text: "$ vector-ai --boot", color: muted },
      { text: "Initializing...", color: muted },
      { text: "[ ACCESS DENIED ]", color: red },
      { text: "CLEARANCE REQUIRED", color: red },
    ],
    url: "https://github.com/Vector-OS",
  },
];
