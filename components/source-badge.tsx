"use client";

import { ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SourceRef } from "@/lib/types";

export function SourceBadge({
  sources,
  className,
}: {
  sources: SourceRef[];
  className?: string;
}) {
  if (!sources?.length) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-white px-3 py-1 text-xs font-medium text-slate-500 transition-colors hover:border-navy-600 hover:text-navy-700 ${className ?? ""}`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Kaynak
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Bu bölümdeki verilerin kaynağı</DialogTitle>
        <DialogDescription>
          KentPusula her veri iddiasının izlenebilir olmasını ilke edinir.
        </DialogDescription>
        <ul className="mt-4 space-y-3">
          {sources.map((source) => (
            <li
              key={source.label}
              className="rounded-xl border border-border-subtle p-3 text-sm"
            >
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-navy-700 underline decoration-navy-200 underline-offset-2 hover:text-navy-900"
                >
                  {source.label}
                </a>
              ) : (
                <div>
                  <span className="font-medium text-navy-950">
                    {source.label}
                  </span>
                  <p className="mt-1 text-xs text-slate-500">
                    Kaynak linki pilot aşamasında eklenecektir.
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
