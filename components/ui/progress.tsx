import { cn } from "@/lib/utils";

export function Progress({
  value,
  max,
  className,
  barClassName,
}: {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-navy-100",
        className
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-orange-500 transition-all",
          pct >= 100 && "bg-green-500",
          barClassName
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
