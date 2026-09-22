"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Camera,
  ExternalLink,
  GraduationCap,
  Hospital,
  Landmark,
  Library,
  Map as MapIcon,
  MapPin,
  Palette,
  Pill,
  Ruler,
  School,
  Search,
  ShieldCheck,
  Trees,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getDistrictInfrastructure,
  type AttractionCategory,
  type DistrictInfrastructure,
} from "@/lib/overpass";
import type { BoundingBox } from "@/lib/geocode";
import type { MunicipalityProfile } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; infrastructure: DistrictInfrastructure | null };

const ATTRACTION_ICONS: Record<AttractionCategory, typeof Users> = {
  muze: Landmark,
  tarihi: MapIcon,
  gezilecek: Camera,
  manzara: Camera,
  sanat: Palette,
};

function AmenityStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-white p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-navy-400" />
      <p className="mt-1.5 text-lg font-bold text-navy-950">
        {formatNumber(value)}
      </p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

export function ExploreWidget({
  allMunicipalities,
}: {
  allMunicipalities: MunicipalityProfile[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MunicipalityProfile | null>(null);
  const [state, setState] = useState<FetchState>({ status: "idle" });

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLocaleLowerCase("tr");
    return allMunicipalities
      .filter(
        (m) =>
          m.name.toLocaleLowerCase("tr").includes(q) ||
          m.province.toLocaleLowerCase("tr").includes(q)
      )
      .slice(0, 8);
  }, [query, allMunicipalities]);

  async function handleSelect(m: MunicipalityProfile) {
    setSelected(m);
    setQuery("");
    setState({ status: "loading" });
    try {
      // Step 1: resolve the district's bounding box server-side (Nominatim
      // geocoding — cached, works fine from the server).
      const res = await fetch(`/api/amenities/${m.id}`);
      if (!res.ok) throw new Error("request failed");
      const { bbox } = (await res.json()) as { bbox: BoundingBox };

      // Step 2: query Overpass directly from the browser. Public Overpass
      // instances are reachable from an end user's browser even on
      // networks where this app's own Node server can't reach them, so
      // this call intentionally runs client-side rather than through our
      // own API route.
      const infrastructure = await getDistrictInfrastructure(bbox);
      setState({ status: "ready", infrastructure });
    } catch {
      setState({ status: "error" });
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-border-subtle px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bir ilçe veya il adı yazın (ör. Karacabey, Konya, Kadıköy)"
            className="w-full text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        {results.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-72 overflow-y-auto rounded-xl border border-border-subtle bg-white shadow-lg">
            {results.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(m)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-navy-50"
                >
                  <span className="font-medium text-navy-950">{m.name}</span>
                  <span className="text-xs text-slate-400">{m.province}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!selected && (
        <p className="mt-6 text-center text-sm text-slate-400">
          Türkiye&apos;deki 973 ilçenin herhangi birini seçin — nüfus,
          yüzölçümü ve yerel altyapı (cami, okul, kütüphane, hastane...)
          sayıları o an canlı olarak çekilir.
        </p>
      )}

      {selected && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-navy-950">
                {selected.name}
              </h3>
              <p className="flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {selected.province} • {selected.region}
              </p>
            </div>
            <Badge variant={selected.isMetropolitan ? "navy" : "outline"}>
              {selected.isMetropolitan ? "Büyükşehir ilçesi" : "İlçe belediyesi"}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <AmenityStat icon={Users} label="Nüfus" value={selected.population} />
            <AmenityStat
              icon={Ruler}
              label="Yüzölçümü (km²)"
              value={Math.round(selected.area)}
            />
            <AmenityStat
              icon={ShieldCheck}
              label="Yoğunluk (kişi/km²)"
              value={Math.round(selected.population / selected.area)}
            />
          </div>

          <div className="mt-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Yerel altyapı (OpenStreetMap, canlı)
            </h4>

            {state.status === "loading" && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[68px] animate-pulse rounded-xl bg-navy-50"
                  />
                ))}
              </div>
            )}

            {state.status === "error" && (
              <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-100/40 p-4 text-sm text-navy-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                <p>Altyapı verisi alınamadı, lütfen tekrar deneyin.</p>
              </div>
            )}

            {state.status === "ready" && state.infrastructure === null && (
              <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-100/40 p-4 text-sm text-navy-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                <p>
                  OpenStreetMap servisi şu an meşgul olabilir — altyapı
                  verisi alınamadı, tekrar seçmeyi deneyin.
                </p>
              </div>
            )}

            {state.status === "ready" && state.infrastructure && (
              <>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  <AmenityStat icon={Landmark} label="Cami" value={state.infrastructure.amenities.mosques} />
                  <AmenityStat icon={School} label="Anaokulu" value={state.infrastructure.amenities.preschools + state.infrastructure.amenities.kindergartens} />
                  <AmenityStat icon={School} label="İlkokul" value={state.infrastructure.amenities.primarySchools} />
                  <AmenityStat icon={School} label="Ortaokul" value={state.infrastructure.amenities.middleSchools} />
                  <AmenityStat icon={GraduationCap} label="Lise" value={state.infrastructure.amenities.highSchools} />
                  <AmenityStat icon={GraduationCap} label="Üniversite" value={state.infrastructure.amenities.universities} />
                  <AmenityStat icon={Library} label="Kütüphane" value={state.infrastructure.amenities.libraries} />
                  <AmenityStat icon={Hospital} label="Hastane" value={state.infrastructure.amenities.hospitals} />
                  <AmenityStat icon={Pill} label="Eczane" value={state.infrastructure.amenities.pharmacies} />
                  <AmenityStat icon={Trees} label="Park" value={state.infrastructure.amenities.parks} />
                  <AmenityStat icon={Building2} label="Spor tesisi" value={state.infrastructure.amenities.sportsFacilities} />
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Bu sayılar OpenStreetMap&apos;te işaretlenmiş yapıları
                  yansıtır; resmî bir sayım değildir ve haritalama
                  yoğunluğuna göre eksik olabilir. Okul seviyeleri OSM
                  etiketlerinden (isced:level / ad) çıkarımla ayrıştırılır —
                  seviyesi belirlenemeyen okullar bu kırılıma dahil değildir.
                </p>
              </>
            )}
          </div>

          {state.status === "ready" && state.infrastructure && (
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Gezilecek yerler, müzeler, tarihi yerler
              </h4>
              {state.infrastructure.attractions.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {state.infrastructure.attractions.slice(0, 12).map((a) => {
                    const Icon = ATTRACTION_ICONS[a.category];
                    return (
                      <div
                        key={`${a.category}:${a.name}`}
                        className="flex items-start gap-2.5 rounded-xl border border-border-subtle bg-white p-3"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
                        <div>
                          <p className="text-sm font-medium text-navy-950">
                            {a.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {a.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  OpenStreetMap&apos;te işaretlenmiş bir müze, tarihi yer
                  veya gezilecek yer bulunamadı — bu, yer olmadığı anlamına
                  gelmez, yalnızca OSM&apos;de henüz işaretlenmediği
                  anlamına gelir.
                </p>
              )}
              {state.infrastructure.attractions.length > 12 && (
                <p className="mt-2 text-xs text-slate-400">
                  +{state.infrastructure.attractions.length - 12} yer daha —
                  tam liste için {selected.name} profilini açın.
                </p>
              )}
            </div>
          )}

          <Link
            href={`/ilce/${selected.id}`}
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            {selected.name} için tam profili gör
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </Card>
  );
}
