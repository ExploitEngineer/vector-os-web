export type MissionLine = {
  label: string;
  /** White lead word. */
  pre: string;
  /** Cyan-accented trailing word. */
  post: string;
};

/** "OUR MISSION" stacked headline on the home page. */
export const MISSION_LINES: MissionLine[] = [
  { label: "01", pre: "OPEN", post: "SOURCE." },
  { label: "02", pre: "COMMUNITY", post: "DRIVEN." },
  { label: "03", pre: "ZERO", post: "LIMITS." },
];
