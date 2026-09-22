"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Shuffle, Users } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRandomMunicipalities } from "@/lib/municipalities";
import type { MunicipalityProfile } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function RandomMunicipalities({
  all,
  initialPicks,
}: {
  all: MunicipalityProfile[];
  initialPicks: MunicipalityProfile[];
}) {
  // The first slide set is chosen server-side (once per ISR revalidation)
  // and passed in as `initialPicks`, so client and server render the same
  // markup on hydration. The "Karıştır" button reshuffles purely
  // client-side from the full `all` list already in props — no refetch.
  const [picks, setPicks] = useState<MunicipalityProfile[]>(initialPicks);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({
      left: direction * 288,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-navy-50/60 py-20">
      <div className="section-shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="973 ilçe arasından"
            title="Türkiye'yi keşfedin"
            description="Her yenilemede Türkiye'nin 973 ilçesinden rastgele bir seçki — nüfus ve yüzölçümü TurkiyeAPI'den canlı."
            className="mb-0"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPicks(getRandomMunicipalities(all, 12))}
            >
              <Shuffle className="h-3.5 w-3.5" />
              Karıştır
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollBy(-1)}
              aria-label="Geri"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollBy(1)}
              aria-label="İleri"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {picks.map((m) => (
            <Link
              key={m.id}
              href={`/ilce/${m.id}`}
              className="w-64 shrink-0 snap-start rounded-2xl border border-border-subtle bg-white p-5 transition-colors hover:border-navy-600"
            >
              <div className="flex items-center justify-between">
                <Badge variant={m.isMetropolitan ? "navy" : "outline"}>
                  {m.isMetropolitan ? "Büyükşehir" : "İlçe"}
                </Badge>
                {m.hasPilotData && <Badge variant="green">Pilot</Badge>}
              </div>
              <h3 className="mt-3 text-lg font-bold text-navy-950">
                {m.name}
              </h3>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3 w-3" />
                {m.province} • {m.region}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
                <Users className="h-3.5 w-3.5 text-navy-400" />
                {formatNumber(m.population)} nüfus
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
