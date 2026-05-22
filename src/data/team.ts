export type TeamMember = {
  name: string;
  handle: string;
  role: string;
  focus: string;
  tags: string[];
  avatar: string;
  github: string;
  index: string;
};

/** Tags rendered with the cyan "special" accent in the team cards. */
export const SPECIAL_TAGS = ["C", "KERNEL", "LINUX", "LOW-LEVEL"];

export const MEMBERS: TeamMember[] = [
  {
    name: "Zain Ul Abideen",
    handle: "ZainulabdeenOfficial",
    role: "Founder & Lead Engineer",
    focus:
      "Kernel development, low-level systems, full-stack platforms & AI integrations",
    tags: ["C", "KERNEL", "LINUX", "PYTHON", "FULL-STACK", "AI/ML"],
    avatar: "https://github.com/ZainulabdeenOfficial.png",
    github: "https://github.com/ZainulabdeenOfficial",
    index: "01",
  },
  {
    name: "Abdul Rafay",
    handle: "ExploitEngineer",
    role: "Co-Founder & Security Engineer",
    focus:
      "Red teaming, reverse engineering, security research & offensive tooling",
    tags: [
      "RED TEAM",
      "REVERSE ENGINEER",
      "SECURITY RESEARCHER",
      "C",
      "KERNEL",
    ],
    avatar: "https://github.com/ExploitEngineer.png",
    github: "https://github.com/ExploitEngineer",
    index: "02",
  },
];
