import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { getProductById } from "@/data/products";

interface RitualLog {
  id: string;
  product_id: string;
  logged_at: string;
  feeling_score: number;
  notes: string | null;
}

interface UserRitual {
  id: string;
  product_id: string;
  schedule_slot: string | null;
  is_paused: boolean;
}

interface Props {
  logs: RitualLog[];
  rituals: UserRitual[];
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const scoreColor = (score: number) => {
  if (score >= 5) return "hsl(168,76%,42%)";
  if (score >= 4) return "hsl(168,60%,50%)";
  if (score >= 3) return "hsl(42,80%,55%)";
  if (score >= 2) return "hsl(30,80%,55%)";
  return "hsl(0,65%,55%)";
};

const RitualCalendar = ({ logs, rituals }: Props) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Build a map: dateKey (YYYY-MM-DD) -> logs
  const logsByDate = useMemo(() => {
    const map: Record<string, RitualLog[]> = {};
    for (const log of logs) {
      const key = log.logged_at.split("T")[0];
      if (!map[key]) map[key] = [];
      map[key].push(log);
    }
    return map;
  }, [logs]);

  // Calendar grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Adjust so week starts on Monday (0=Mon)
  const startOffset = (firstDay + 6) % 7;

  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return dayNum;
  });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);
    if (next <= today) setViewDate(next);
  };
  const canGoNext = new Date(year, month + 1, 1) <= today;

  const selectedLogs = selectedDay ? (logsByDate[selectedDay] || []) : [];
  const selectedDateDisplay = selectedDay
    ? new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : null;

  const activeRituals = rituals.filter(r => !r.is_paused);
  const totalActive = activeRituals.length;

  return (
    <div className="glass-card rounded-xl border border-border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground">
          Ritual History
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth}
            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            <ChevronLeft size={13} />
          </button>
          <span className="text-xs font-medium text-foreground min-w-[100px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} disabled={!canGoNext}
            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[9px] tracking-[0.1em] uppercase text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayLogs = logsByDate[dateKey] || [];
          const isToday = dateKey === today.toISOString().split("T")[0];
          const isFuture = new Date(dateKey) > today;
          const isSelected = dateKey === selectedDay;
          const hasLogs = dayLogs.length > 0;
          const avgScore = hasLogs
            ? dayLogs.reduce((s, l) => s + l.feeling_score, 0) / dayLogs.length
            : 0;
          const coverage = totalActive > 0 ? Math.min(1, dayLogs.length / totalActive) : 0;

          return (
            <motion.button
              key={i}
              whileHover={!isFuture ? { scale: 1.08 } : {}}
              whileTap={!isFuture ? { scale: 0.95 } : {}}
              onClick={() => !isFuture && setSelectedDay(isSelected ? null : dateKey)}
              disabled={isFuture}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                isFuture ? "opacity-20 cursor-default" :
                isSelected ? "border border-primary/60 bg-primary/10" :
                hasLogs ? "border border-border hover:border-primary/30 cursor-pointer" :
                "border border-dashed border-border/40 hover:border-border cursor-pointer"
              }`}
              style={hasLogs && !isSelected ? {
                background: `${scoreColor(avgScore)}14`,
                borderColor: `${scoreColor(avgScore)}40`,
              } : {}}
            >
              <span className={`text-[10px] font-medium ${
                isToday ? "text-primary" :
                hasLogs ? "text-foreground" :
                "text-muted-foreground/50"
              }`}>
                {day}
              </span>
              {hasLogs && (
                <div className="flex gap-[2px] mt-0.5">
                  {Array.from({ length: Math.min(dayLogs.length, 3) }).map((_, j) => (
                    <div key={j} className="w-[4px] h-[4px] rounded-full"
                      style={{ background: scoreColor(dayLogs[j]?.feeling_score || 3) }} />
                  ))}
                </div>
              )}
              {isToday && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: scoreColor(5) }} />
          <span className="text-[9px] text-muted-foreground">Excellent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: scoreColor(3) }} />
          <span className="text-[9px] text-muted-foreground">Good</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: scoreColor(1) }} />
          <span className="text-[9px] text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-[9px] text-muted-foreground">Today</span>
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-3 border-t border-border space-y-2"
        >
          <p className="text-[11px] font-semibold text-foreground">{selectedDateDisplay}</p>
          {selectedLogs.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">No check-ins logged this day.</p>
          ) : (
            <div className="space-y-1.5">
              {selectedLogs.map(log => {
                const product = getProductById(log.product_id);
                return (
                  <div key={log.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: product?.color_tag.primary || scoreColor(log.feeling_score) }} />
                    <span className="text-[11px] text-foreground flex-1">
                      {product?.name || "Unknown"}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className="w-2.5 h-2.5 rounded-sm"
                          style={{ background: s <= log.feeling_score ? scoreColor(log.feeling_score) : "hsl(var(--border))" }} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{log.feeling_score}/5</span>
                  </div>
                );
              })}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {selectedLogs.length} of {totalActive || "?"} formula{totalActive !== 1 ? "s" : ""} logged
                </span>
                <span className="text-[10px] text-primary font-medium">
                  Avg: {(selectedLogs.reduce((s, l) => s + l.feeling_score, 0) / selectedLogs.length).toFixed(1)}/5
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RitualCalendar;
