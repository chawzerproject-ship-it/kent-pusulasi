"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Camera,
  GraduationCap,
  Hospital,
  Landmark,
  Library,
  Map as MapIcon,
  Palette,
  Pill,
  School,
  Trees,
  Users,
} from "lucide-react";
import {
  getDistrictInfrastructure,
  type AttractionCategory,
  type DistrictInfrastructure,
} from "@/lib/overpass";
import type { BoundingBox } from "@/lib/geocode";
import { formatNumber } from "@/lib/utils";

const ATTRACTION_ICONS: Record<AttractionCategory, typeof Users> = {
  muze: Landmark,
  tarihi: MapIcon,
  gezilecek: Camera,
  manzara: Camera,
  sanat: Palette,
};

const ATTRACTION_CATEGORY_ORDER: AttractionCategory[] = [
  "muze",
  "tarihi",
  "gezilecek",
  "manzara",
  "sanat",
];

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-2 text-xl font-bold text-navy-950">{value}</p>
    </div>
  );
}

function StatCardSkeleton() {
  return <div className="h-[84px] animate-pulse rounded-2xl bg-navy-50" />;
}

/**
 * Fetches live OSM infrastructure/attraction data directly from the
 * browser rather than through our own server — Overpass's public
 * instances are reachable from an end user's browser even on networks
 * where the app's own Node server can't reach them (a common asymmetry:
 * outbound firewall/AV rules on Windows often trust browsers but not
 * background processes), so doing the fetch client-side is materially
 * more reliable, not just a stylistic choice.
 */
export function DistrictInfrastructure({
  bbox,
  municipalityName,
}: {
  bbox: BoundingBox;
  municipalityName: string;
}) {
  const [state, setState] = useState<
    "loading" | "error" | DistrictInfrastructure
  >("loading");
  // Dev-mode StrictMode mounts effects twice; without this guard that means
  // two concurrent Overpass requests per page view, which needlessly eats
  // into the shared public rate limit. Caching the in-flight promise per
  // bbox collapses both invocations into a single network request.
  const inFlight = useRef<Promise<DistrictInfrastructure | null> | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!inFlight.current) {
      inFlight.current = getDistrictInfrastructure(bbox);
    }
    inFlight.current.then((result) => {
      if (cancelled) return;
      setState(result ?? "error");
    });
    return () => {
      cancelled = true;
    };
  }, [bbox]);

  const amenities = state !== "loading" && state !== "error" ? state.amenities : null;
  const attractions = state !== "loading" && state !== "error" ? state.attractions : [];

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-950">Yerel altyapı</h2>
        <span className="text-xs text-slate-400">
          Kaynak: OpenStreetMap (topluluk tarafından işaretlenen veri)
        </span>
      </div>
      {state === "loading" && (
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 11 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      )}
      {state === "error" && (
        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-100/40 p-4 text-sm text-navy-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <p>
            Yerel altyapı verisi şu anda alınamadı (OpenStreetMap servisi
            meşgul olabilir) — sayfayı yenileyerek tekrar deneyebilirsiniz.
          </p>
        </div>
      )}
      {amenities && (
        <>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <StatCard icon={Landmark} label="Cami" value={formatNumber(amenities.mosques)} />
            <StatCard icon={School} label="Anaokulu" value={formatNumber(amenities.preschools + amenities.kindergartens)} />
            <StatCard icon={School} label="İlkokul" value={formatNumber(amenities.primarySchools)} />
            <StatCard icon={School} label="Ortaokul" value={formatNumber(amenities.middleSchools)} />
            <StatCard icon={GraduationCap} label="Lise" value={formatNumber(amenities.highSchools)} />
            <StatCard icon={GraduationCap} label="Üniversite" value={formatNumber(amenities.universities)} />
            <StatCard icon={Library} label="Kütüphane" value={formatNumber(amenities.libraries)} />
            <StatCard icon={Hospital} label="Hastane" value={formatNumber(amenities.hospitals)} />
            <StatCard icon={Pill} label="Eczane" value={formatNumber(amenities.pharmacies)} />
            <StatCard icon={Trees} label="Park" value={formatNumber(amenities.parks)} />
            <StatCard icon={Building2} label="Spor tesisi" value={formatNumber(amenities.sportsFacilities)} />
          </div>
        </>
      )}
      {state !== "loading" && state !== "error" && (
        <p className="-mt-6 mb-10 text-xs text-slate-400">
          Bu sayılar OpenStreetMap&apos;te işaretlenmiş yapıları yansıtır;
          resmî bir sayım değildir ve haritalama yoğunluğuna göre eksik
          olabilir. Okul seviyeleri OSM etiketlerinden (isced:level / ad)
          çıkarımla ayrıştırılır — seviyesi belirlenemeyen okullar bu
          kırılıma dahil değildir.
        </p>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-950">
          Gezilecek yerler, müzeler ve tarihi yerler
        </h2>
        <span className="text-xs text-slate-400">
          Kaynak: OpenStreetMap (topluluk tarafından işaretlenen veri)
        </span>
      </div>
      {state === "loading" && (
        <div className="mb-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[60px] animate-pulse rounded-2xl bg-navy-50" />
          ))}
        </div>
      )}
      {state === "error" && (
        <div className="mb-2 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-100/40 p-4 text-sm text-navy-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <p>
            Gezilecek yer verisi şu anda alınamadı (OpenStreetMap servisi
            meşgul olabilir) — sayfayı yenileyerek tekrar deneyebilirsiniz.
          </p>
        </div>
      )}
      {state !== "loading" && state !== "error" && (
        <>
          {attractions.length > 0 ? (
            <div className="mb-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ATTRACTION_CATEGORY_ORDER.flatMap((category) =>
                attractions
                  .filter((a) => a.category === category)
                  .map((a) => {
                    const Icon = ATTRACTION_ICONS[a.category];
                    return (
                      <div
                        key={`${a.category}:${a.name}`}
                        className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-white p-4"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
                        <div>
                          <p className="text-sm font-semibold text-navy-950">
                            {a.name}
                          </p>
                          <p className="text-xs text-slate-400">{a.label}</p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          ) : (
            <p className="mb-2 text-sm text-slate-500">
              {municipalityName} için OpenStreetMap&apos;te işaretlenmiş bir
              müze, tarihi yer veya gezilecek yer bulunamadı — bu, ilçede
              böyle bir yer olmadığı anlamına gelmez, yalnızca OSM&apos;de
              henüz işaretlenmediği anlamına gelir.
            </p>
          )}
        </>
      )}
      <p className="mb-10 text-xs text-slate-400">
        Bu liste OpenStreetMap&apos;te müze, tarihi eser ya da gezi noktası
        olarak işaretlenmiş yerleri yansıtır; resmî bir turizm envanteri
        değildir.
      </p>
    </>
  );
}
