"use client";

import { useEffect, useRef, useState } from "react";

export interface HeatmapProps {
  dateCounts: Record<string, number>;
  totalPosts: number;
  yearPosts: number;
  currentStreak: number;
  longestStreak: number;
}

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CELL        = 15;
const DAY_LABEL_W = 28;
const MIN_WEEKS   = 8;
const MAX_WEEKS   = 260;

function cellClass(count: number, future: boolean): string {
  if (future)    return "bg-transparent";
  if (count > 0) return "bg-accent";
  return "bg-secondary hover:bg-border";
}

export function PostHeatmap({ dateCounts, totalPosts, yearPosts, currentStreak, longestStreak }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [weeks, setWeeks] = useState(52);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 32 - DAY_LABEL_W;
      setWeeks(Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, Math.floor(available / CELL))));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const startDate = new Date(startOfWeek);
  startDate.setDate(startDate.getDate() - (weeks - 1) * 7);

  const pad = (n: number) => String(n).padStart(2, "0");
  const localDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  type Cell = { date: string; count: number; future: boolean };
  const cells: Cell[] = Array.from({ length: weeks * 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return { date: localDate(d), count: dateCounts[localDate(d)] ?? 0, future: d > today };
  });

  type MonthLabel = { label: string; col: number };
  const monthLabels: MonthLabel[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + w * 7);
    const m = d.getMonth();
    if (m !== lastMonth) {
      // A label needs ~3 columns of room; drop the previous (partial) month's
      // label if this one starts too close to it, otherwise they overlap.
      const prev = monthLabels[monthLabels.length - 1];
      if (prev && w - prev.col < 3) monthLabels.pop();
      monthLabels.push({ label: MONTHS[m]!, col: w });
      lastMonth = m;
    }
  }

  const stats = [
    { num: totalPosts,     label: "篇文章" },
    { num: yearPosts,      label: "篇今年" },
    { num: currentStreak,  label: "週連續" },
    { num: longestStreak,  label: "週最長連續" },
  ];

  return (
    <div className="p-5">

      {/* Stats row */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4 text-sm">
        {stats.map(s => (
          <span key={s.label}>
            <span className="font-bold text-foreground">{s.num}</span>
            <span className="text-muted-foreground ml-1">{s.label}</span>
          </span>
        ))}
      </div>

      {/* Grid */}
      <div ref={cardRef}>
        {/* Month labels */}
        <div className="flex gap-[3px] mb-1" style={{ paddingLeft: `${DAY_LABEL_W}px` }}>
          {Array.from({ length: weeks }).map((_, col) => {
            const lbl = monthLabels.find(m => m.col === col);
            return (
              <div key={col} className="w-3 shrink-0 text-[0.65rem] text-muted-foreground h-4 overflow-visible whitespace-nowrap">
                {lbl?.label ?? ""}
              </div>
            );
          })}
        </div>

        {/* Day labels + columns */}
        <div className="flex gap-[3px]">
          <div className="flex flex-col gap-[3px] mr-1 shrink-0 w-6">
            {DAYS.map((day, i) => (
              <div key={day} className="h-3 text-[0.6rem] text-muted-foreground flex items-center justify-end pr-1 leading-none">
                {i === 1 || i === 3 || i === 5 ? day[0] : ""}
              </div>
            ))}
          </div>

          {Array.from({ length: weeks }).map((_, week) => (
            <div key={week} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, day) => {
                const cell = cells[week * 7 + day];
                if (!cell) return <div key={day} className="w-3 h-3" />;
                return (
                  <div
                    key={day}
                    className={`w-3 h-3 rounded-full transition-colors cursor-default ${cellClass(cell.count, cell.future)}`}
                    onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, date: cell.date, count: cell.count })}
                    onMouseMove={e => setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-2 justify-end select-none">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-[0.7rem] text-muted-foreground mr-2">沒有</span>
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-[0.7rem] text-muted-foreground">有發文</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-popover border border-border rounded-lg shadow-md text-xs px-2.5 py-1.5"
          style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}
        >
          <span className="font-semibold text-link">{tooltip.count > 0 ? `${tooltip.count} post${tooltip.count > 1 ? "s" : ""}` : "no posts"}</span>
          <span className="text-muted-foreground ml-1">· {tooltip.date}</span>
        </div>
      )}
    </div>
  );
}
