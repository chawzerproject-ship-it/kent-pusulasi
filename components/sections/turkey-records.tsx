import Link from "next/link";
import type { ReactNode } from "react";
import { Building2, Gauge, MapPinned, Ruler, Users } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Card } from "@/components/ui/card";
import type { ApiNeighborhood, ApiProvince } from "@/lib/turkiye-api";
import type { MunicipalityProfile } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

function RecordCard({
  icon: Icon,
  label,
  name,
  sub,
  value,
  href,
}: {
  icon: typeof Users;
  label: string;
  name: string;
  sub?: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <Card className="h-full transition-colors hover:border-navy-600">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-3 text-lg font-bold text-navy-950">{name}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
      <p className="mt-2 text-sm font-semibold text-navy-700">{value}</p>
    </Card>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function TurkeyRecords({
  topProvince,
  topMunicipality,
  topNeighborhood,
  topNeighborhoodDistrict,
  largestArea,
  densest,
}: {
  topProvince: ApiProvince;
  topMunicipality: MunicipalityProfile;
  topNeighborhood: ApiNeighborhood;
  topNeighborhoodDistrict: MunicipalityProfile | undefined;
  largestArea: MunicipalityProfile;
  densest: MunicipalityProfile;
}): ReactNode {
  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow="Türkiye rekorları"
        title="81 il, 973 ilçenin tamamı üzerinden gerçek rekorlar"
        description="Bu bir pilot belediyeye özel örnek değil — TurkiyeAPI'deki 81 ilin ve 973 ilçenin hepsi karşılaştırılarak canlı hesaplanır."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal>
          <RecordCard
            icon={Users}
            label="En kalabalık il"
            name={topProvince.name}
            value={`${formatNumber(topProvince.population)} nüfus`}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <RecordCard
            icon={Building2}
            label="En kalabalık ilçe / belediye"
            name={topMunicipality.name}
            sub={topMunicipality.province}
            value={`${formatNumber(topMunicipality.population)} nüfus`}
            href={`/ilce/${topMunicipality.id}`}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <RecordCard
            icon={MapPinned}
            label="En kalabalık mahalle"
            name={topNeighborhood.name}
            sub={
              topNeighborhoodDistrict
                ? `${topNeighborhoodDistrict.name}, ${topNeighborhoodDistrict.province}`
                : undefined
            }
            value={`${formatNumber(topNeighborhood.population)} nüfus`}
            href={
              topNeighborhoodDistrict
                ? `/ilce/${topNeighborhoodDistrict.id}`
                : undefined
            }
          />
        </Reveal>
        <Reveal delay={0.15}>
          <RecordCard
            icon={Ruler}
            label="En büyük yüzölçümü (ilçe)"
            name={largestArea.name}
            sub={largestArea.province}
            value={`${formatNumber(Math.round(largestArea.area))} km²`}
            href={`/ilce/${largestArea.id}`}
          />
        </Reveal>
        <Reveal delay={0.2}>
          <RecordCard
            icon={Gauge}
            label="En yüksek nüfus yoğunluğu"
            name={densest.name}
            sub={densest.province}
            value={`${formatNumber(Math.round(densest.population / densest.area))} kişi/km²`}
            href={`/ilce/${densest.id}`}
          />
        </Reveal>
      </div>
      <p className="mt-6 max-w-2xl text-xs text-slate-400">
        Nüfus ve yüzölçümü rekorları TurkiyeAPI&apos;den, 973 ilçenin tamamı
        taranarak hesaplanır. Cami, okul, kütüphane gibi altyapı sayıları için
        Türkiye genelinde tek bir &quot;rekor&quot; henüz hesaplanmıyor — bunun
        için 973 ilçenin hepsini aynı anda OpenStreetMap&apos;e sorgulamak
        gerekir ki bu, Overpass&apos;ın kullanım politikasını aşar; bu sayılar
        yukarıdaki &quot;Herhangi bir belediyeyi seçin&quot; aracında ilçe
        bazında canlı olarak sorgulanabiliyor.
      </p>
    </section>
  );
}
