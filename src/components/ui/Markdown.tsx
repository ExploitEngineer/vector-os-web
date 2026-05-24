import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 mb-4 font-display text-[34px] uppercase leading-tight tracking-[0.01em] text-white">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-9 mb-3 font-display text-[26px] uppercase leading-tight tracking-[0.01em] text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-7 mb-2.5 font-mono text-[15px] font-semibold uppercase tracking-[0.1em] text-vos-cyan/80">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-4 font-mono text-[13px] leading-[1.9] text-white/55">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-vos-cyan underline decoration-vos-cyan/30 underline-offset-2 transition-colors hover:decoration-vos-cyan"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-5 list-disc space-y-1.5 font-mono text-[13px] leading-[1.8] text-white/55 marker:text-vos-cyan/50">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-5 list-decimal space-y-1.5 font-mono text-[13px] leading-[1.8] text-white/55 marker:text-vos-cyan/50">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 border-l-2 border-vos-cyan/40 bg-white/[0.02] py-1 pl-4 font-mono text-[13px] italic text-white/45">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = (className ?? "").includes("language-");
    if (isBlock) {
      return (
        <code className="font-mono text-[12px] leading-[1.8] text-vos-green">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-vos-cyan">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto rounded-md border border-white/[0.08] bg-[#050505] p-4">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-white/[0.08]" />,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      // biome-ignore lint/performance/noImgElement: arbitrary markdown image hosts aren't in the next/image allowlist
      <img
        src={src}
        alt={alt ?? ""}
        className="my-5 rounded-md border border-white/[0.08]"
      />
    ) : null,
};

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
