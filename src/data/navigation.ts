export type NavLink = { label: string; href: string };

export const GITHUB_URL = "https://github.com/Vector-OS";
export const SUPPORT_EMAIL = "support@vectoros.dpdns.org";

/** Primary nav (navbar + footer "navigate" column). */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blogs" },
  { label: "About", href: "/about" },
];

/** Footer "connect" column — external links. */
export const CONNECT_LINKS: NavLink[] = [
  { label: "GitHub", href: GITHUB_URL },
  { label: "LinkedIn", href: "https://linkedin.com/company/vector-os" },
  { label: "Email", href: `mailto:${SUPPORT_EMAIL}` },
];

/** Footer "legal" column — static labels. */
export const LEGAL_ITEMS = ["MIT License", "Open Source", "Est. 2024"];

export const BRAND = {
  name: "Vector Operating System",
  description:
    "A collective of engineers building open source security tools and low-level software at the boundary of possibility.",
  email: SUPPORT_EMAIL,
} as const;
