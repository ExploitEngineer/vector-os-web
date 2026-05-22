"use client";

type Option = { value: string; label: string };

export default function Dropdown({
  label,
  value,
  options,
  dotColors,
  onSelect,
  open,
  onToggle,
}: {
  label: string;
  value: string;
  options: Option[];
  dotColors?: Record<string, string>;
  onSelect: (v: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const isActive = value !== "ALL" && value !== "DEFAULT";

  return (
    <div className="relative flex-shrink-0" style={{ zIndex: open ? 9999 : 1 }}>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex h-[34px] items-center gap-[5px] whitespace-nowrap rounded-md border px-3 font-mono text-[11px] tracking-[0.08em] transition-[border-color,color,background] duration-150 max-[900px]:h-8 max-[900px]:px-2.5 max-[900px]:text-[10px] ${
          open
            ? "border-vos-cyan/40 bg-[#111] text-white shadow-[0_0_0_3px_rgba(0,229,255,0.07)]"
            : isActive
              ? "border-white/20 bg-[#0d0d0d] text-white"
              : "border-white/[0.12] bg-[#0d0d0d] text-white/55 hover:border-white/25 hover:text-white/90"
        }`}
      >
        {label}
        {isActive && value !== "DEFAULT" && (
          <span className="text-[10px] text-white/40 max-[900px]:hidden">
            : {options.find((o) => o.value === value)?.label ?? value}
          </span>
        )}
        <span className="ml-px text-[9px] text-white/30">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-[9999] min-w-[200px] overflow-hidden rounded-lg border border-white/[0.12] bg-[#111] shadow-[0_8px_32px_rgba(0,0,0,0.8)] animate-[dropdown-in_0.15s_ease_both]">
          <div className="border-b border-white/[0.06] px-3.5 pb-2 pt-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
            {label}
          </div>
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`flex w-full items-center gap-2 border-b border-white/[0.03] px-3.5 py-2 text-left transition-colors duration-[120ms] last:border-none hover:bg-white/5 ${
                value === opt.value ? "bg-vos-cyan/[0.05]" : ""
              }`}
            >
              <span className="w-3.5 flex-shrink-0 text-[10px] text-vos-cyan">
                {value === opt.value ? "✓" : ""}
              </span>
              {dotColors && opt.value !== "ALL" && (
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{
                    background: dotColors[opt.value] || "rgba(255,255,255,0.3)",
                  }}
                />
              )}
              <span
                className={`font-mono text-[11px] tracking-[0.06em] ${
                  value === opt.value ? "text-white" : "text-white/65"
                }`}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
