import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  invert = false,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  invert?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            invert
              ? "bg-white/10 text-orange-300"
              : "bg-navy-100 text-navy-700"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-2xl font-bold sm:text-3xl",
          invert ? "text-white" : "text-navy-950"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 text-base",
            invert ? "text-navy-100/70" : "text-slate-600"
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
