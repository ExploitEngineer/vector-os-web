import { TICKER_ITEMS } from "@/data/ticker";

const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

/** Continuously scrolling marquee of project / topic labels (the "slider"). */
export default function TickerStrip() {
  return (
    <div className="mask-fade-x relative h-20 w-full overflow-hidden border-y border-white/[0.06] bg-vos-panel max-[900px]:h-16 max-[480px]:h-14">
      <div className="absolute left-0 top-1/2 w-full -translate-y-1/2">
        <div className="inline-flex flex-shrink-0 items-center whitespace-nowrap [animation:ticker-scroll_55s_linear_infinite] [will-change:transform] max-[900px]:[animation-duration:45s] max-[480px]:[animation-duration:38s]">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-[14px] pr-8 max-[900px]:gap-[11px] max-[900px]:pr-6 max-[480px]:gap-[9px] max-[480px]:pr-5"
            >
              <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-vos-cyan shadow-[0_0_6px_rgba(0,229,255,0.9)] max-[900px]:h-1.5 max-[900px]:w-1.5 max-[480px]:h-[5px] max-[480px]:w-[5px]" />
              <span className="select-none font-oswald text-[26px] font-bold uppercase leading-none tracking-[0.07em] text-white max-[900px]:text-[20px] max-[900px]:tracking-[0.06em] max-[480px]:text-[16px] max-[480px]:tracking-[0.05em]">
                {item}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
