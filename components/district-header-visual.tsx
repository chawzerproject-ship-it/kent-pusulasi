"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, Image as ImageIcon } from "lucide-react";
import type { DistrictWiki } from "@/lib/wikipedia";

export function DistrictHeaderVisual({
  wiki,
  districtName,
  provinceName,
}: {
  wiki: DistrictWiki | null;
  districtName: string;
  provinceName: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!wiki) return null;

  const showImage = wiki.imageUrl && !imageError;

  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-br from-white via-navy-50/30 to-navy-50/60 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-600">
            <BookOpen className="h-4 w-4" />
            <span>Vikipedi İlçe Tanıtımı</span>
          </div>

          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            {wiki.extract}
          </p>

          <div className="pt-2">
            <a
              href={wiki.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-800 underline decoration-navy-300 underline-offset-4 transition-colors hover:text-orange-600 hover:decoration-orange-400"
            >
              <span>Vikipedi&apos;de {wiki.title || districtName} maddesini incele</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {showImage && (
          <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl border border-border-subtle bg-slate-100 shadow-sm sm:h-56 lg:h-44 lg:w-72">
            <img
              src={wiki.imageUrl!}
              alt={`${districtName}, ${provinceName}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-white/90 drop-shadow">
              <span className="flex items-center gap-1 truncate">
                <ImageIcon className="h-3 w-3 shrink-0" />
                {wiki.title}
              </span>
              <span className="shrink-0 text-[10px] text-white/70">Wikimedia</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

