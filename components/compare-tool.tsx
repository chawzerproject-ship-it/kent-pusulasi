"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, MapPin, Users, Ruler, ShieldCheck, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { MunicipalityProfile } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

function MunicipalityPicker({
  label,
  allMunicipalities,
  selected,
  onSelect,
  excludeId,
}: {
  label: string;
  allMunicipalities: MunicipalityProfile[];
  selected: MunicipalityProfile | null;
  onSelect: (m: MunicipalityProfile | null) => void;
  excludeId?: number;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLocaleLowerCase("tr");
    return allMunicipalities
      .filter(
        (m) =>
          m.id !== excludeId &&
          (m.name.toLocaleLowerCase("tr").includes(q) ||
            m.province.toLocaleLowerCase("tr").includes(q))
      )
      .slice(0, 8);
  }, [query, allMunicipalities, excludeId]);

  if (selected) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </span>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="rounded-full p-1 text-slate-400 hover:bg-navy-50 hover:text-navy-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-lg font-bold text-navy-950">
          {selected.name}
        </p>
        <p className="flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {selected.province}
        </p>
        <Link
          href={`/ilce/${selected.id}`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-navy-900"
        >
          Ayrıntılı profili gör
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-border-subtle bg-white p-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-border-subtle px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İlçe veya il adı yazın (ör. Yenişehir, Bursa)"
          className="w-full text-sm outline-none placeholder:text-slate-400"
        />
      </div>
      {results.length > 0 && (
        <ul className="absolute inset-x-4 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border-subtle bg-white shadow-lg">
          {results.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(m);
                  setQuery("");
                }}
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
  );
}

function ComparisonRow({
  label,
  a,
  b,
  icon: Icon,
}: {
  label: string;
  a: string;
  b: string;
  icon?: typeof Users;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border-subtle py-4 last:border-0">
      <span className="text-right text-sm font-medium text-navy-950">{a}</span>
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      <span className="text-left text-sm font-medium text-navy-950">{b}</span>
    </div>
  );
}

export function CompareTool({
  allMunicipalities,
  initialA,
  initialB,
}: {
  allMunicipalities: MunicipalityProfile[];
  initialA?: number;
  initialB?: number;
}) {
  const [a, setA] = useState<MunicipalityProfile | null>(
    () => allMunicipalities.find((m) => m.id === initialA) ?? null
  );
  const [b, setB] = useState<MunicipalityProfile | null>(
    () => allMunicipalities.find((m) => m.id === initialB) ?? null
  );

  const bothPilot = Boolean(a?.pilot && b?.pilot);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MunicipalityPicker
          label="1. Belediye"
          allMunicipalities={allMunicipalities}
          selected={a}
          onSelect={setA}
          excludeId={b?.id}
        />
        <MunicipalityPicker
          label="2. Belediye"
          allMunicipalities={allMunicipalities}
          selected={b}
          onSelect={setB}
          excludeId={a?.id}
        />
      </div>

      {a && b && (
        <Card className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-navy-950">
              {a.name} — {b.name}
            </h3>
            <Badge variant={bothPilot ? "green" : "outline"}>
              {bothPilot
                ? "Tüm göstergeler mevcut"
                : "Yalnızca nüfus/alan verisi mevcut"}
            </Badge>
          </div>
          <div className="mt-4">
            <ComparisonRow
              icon={MapPin}
              label="İl / Bölge"
              a={`${a.province} • ${a.region}`}
              b={`${b.province} • ${b.region}`}
            />
            <ComparisonRow
              icon={Users}
              label="Nüfus"
              a={formatNumber(a.population)}
              b={formatNumber(b.population)}
            />
            <ComparisonRow
              icon={Ruler}
              label="Yüzölçümü"
              a={`${formatNumber(a.area)} km²`}
              b={`${formatNumber(b.area)} km²`}
            />
            <ComparisonRow
              icon={ShieldCheck}
              label="Belediye türü"
              a={a.isMetropolitan ? "Büyükşehir ilçesi" : "İlçe belediyesi"}
              b={b.isMetropolitan ? "Büyükşehir ilçesi" : "İlçe belediyesi"}
            />
            {a.pilot && b.pilot ? (
              <>
                <ComparisonRow
                  label="2025 gerçekleşen gider"
                  a={formatCurrency(a.pilot.budget2025)}
                  b={formatCurrency(b.pilot.budget2025)}
                />
                <ComparisonRow
                  label="Kişi başına gider"
                  a={`~${formatNumber(a.pilot.perCapitaSpend)} TL`}
                  b={`~${formatNumber(b.pilot.perCapitaSpend)} TL`}
                />
              </>
            ) : (
              <p className="pt-4 text-center text-sm text-slate-500">
                {[!a.pilot && a.name, !b.pilot && b.name]
                  .filter(Boolean)
                  .join(" ve ")}{" "}
                için faaliyet raporu verisi henüz KentPusula&apos;ya
                eklenmedi — bu belediyeler pilot sürecine dahil olduğunda
                bütçe ve performans göstergeleri burada görünecek.
              </p>
            )}
          </div>

          {a.pilot && a.pilot.goals.length > 0 && (
            <div className="mt-6 border-t border-border-subtle pt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {a.name} hedef / gerçekleşen
              </h4>
              <div className="space-y-3">
                {a.pilot.goals.map((goal) => (
                  <div key={goal.label}>
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>{goal.label}</span>
                      <span>
                        {formatNumber(goal.actual)} / {formatNumber(goal.target)}{" "}
                        {goal.unit}
                      </span>
                    </div>
                    <Progress value={goal.actual} max={goal.target} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {b.pilot && b.pilot.goals.length > 0 && (
            <div className="mt-6 border-t border-border-subtle pt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {b.name} hedef / gerçekleşen
              </h4>
              <div className="space-y-3">
                {b.pilot.goals.map((goal) => (
                  <div key={goal.label}>
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>{goal.label}</span>
                      <span>
                        {formatNumber(goal.actual)} / {formatNumber(goal.target)}{" "}
                        {goal.unit}
                      </span>
                    </div>
                    <Progress value={goal.actual} max={goal.target} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {(!a || !b) && (
        <p className="mt-6 text-center text-sm text-slate-400">
          Karşılaştırmayı görmek için iki belediye seçin.
        </p>
      )}
    </div>
  );
}
