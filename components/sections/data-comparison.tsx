"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Card } from "@/components/ui/card";
import { SourceBadge } from "@/components/source-badge";
import type { MunicipalityProfile } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function DataComparison({
  pilotMunicipalities,
}: {
  pilotMunicipalities: MunicipalityProfile[];
}) {
  const withPilot = pilotMunicipalities.filter((m) => m.pilot);
  if (withPilot.length === 0) return null;

  const budgetData = withPilot.map((m) => ({
    name: m.name,
    gider: m.pilot!.budget2025 / 1_000_000,
  }));
  const perCapitaData = withPilot.map((m) => ({
    name: m.name,
    kisiBasi: m.pilot!.perCapitaSpend,
  }));
  const sources = withPilot.flatMap((m) => m.pilot!.sources);

  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow={`${withPilot.length} pilot belediye — gerçek veri`}
        title="2025 gerçekleşen gider nasıl kıyaslanır?"
        description="Aşağıdaki grafikler, faaliyet raporunu KentPusula'ya bağladığımız pilot belediyelerin tamamını gösterir — tek bir örnek değil. Kalan 968 ilçe pilot sürece dahil olduğunda burada da görünecek."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-navy-950">
                2025 gerçekleşen gider
              </h3>
              <SourceBadge sources={sources} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}M`}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)} M TL`, "Gider"]}
                />
                <Bar dataKey="gider" fill="#154871" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Reveal>

        <Reveal delay={0.08}>
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-navy-950">
              Kişi başına gider
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={perCapitaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [`${formatNumber(Number(v))} TL`, "Kişi başı"]}
                />
                <Bar dataKey="kisiBasi" fill="#ea8a45" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={0.16}>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-100/40 p-4 text-sm text-navy-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <p>
            Bu rakamlar tek başına hüküm vermez; hizmet alanı, yatırım türü
            ve mali yapı birlikte okunmalıdır.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
