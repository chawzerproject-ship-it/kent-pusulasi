import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileText,
  MapPin,
  Ruler,
  Trees,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/source-badge";
import { Progress } from "@/components/ui/progress";
import { DistrictMap } from "@/components/district-map";
import { DistrictCharts } from "@/components/district-charts";
import { DistrictInfrastructure } from "@/components/district-infrastructure";
import {
  getAllMunicipalities,
  getNationalAverages,
  getPeers,
  getProvinceAverages,
} from "@/lib/municipalities";
import {
  getNeighborhoodsByDistrict,
  getProvinces,
  getVillagesByDistrict,
} from "@/lib/turkiye-api";
import { getDistrictLocation, resolveBoundingBox } from "@/lib/geocode";
import { formatNumber } from "@/lib/utils";

export async function generateMetadata(
  props: PageProps<"/ilce/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const all = await getAllMunicipalities();
  const municipality = all.find((m) => m.id === Number(id));
  if (!municipality) return {};
  return {
    title: `${municipality.name} (${municipality.province}) — KentPusula`,
    description: `${municipality.name} ilçesinin nüfus, yüzölçümü, mahalle sayısı ve emsal karşılaştırma verileri.`,
  };
}

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

export default async function IlcePage(props: PageProps<"/ilce/[id]">) {
  const { id } = await props.params;
  const districtId = Number(id);
  if (!Number.isFinite(districtId)) notFound();

  const all = await getAllMunicipalities();
  const municipality = all.find((m) => m.id === districtId);
  if (!municipality) notFound();

  const provinces = await getProvinces();
  const province = provinces.find((p) => p.id === municipality.provinceId);

  const location = await getDistrictLocation(
    municipality.name,
    municipality.province,
    province?.coordinates ?? { latitude: 39, longitude: 35 }
  );
  const bbox = resolveBoundingBox(location);

  const [neighborhoods, villages] = await Promise.all([
    getNeighborhoodsByDistrict(districtId),
    getVillagesByDistrict(districtId),
  ]);

  const peers = getPeers(municipality, all, 3);
  const national = getNationalAverages(all);
  const provinceAvg = getProvinceAverages(
    all,
    municipality.provinceId,
    municipality.id
  );
  const density = municipality.population / municipality.area;
  const pilot = municipality.pilot;

  const populationComparison = [
    { name: municipality.name, value: municipality.population },
    { name: "İl ortalaması", value: Math.round(provinceAvg.population) },
    { name: "Türkiye ortalaması", value: Math.round(national.population) },
  ];
  const densityComparison = [
    { name: municipality.name, value: Math.round(density) },
    { name: "İl ortalaması", value: Math.round(provinceAvg.density) },
    { name: "Türkiye ortalaması", value: Math.round(national.density) },
  ];
  const settlementBreakdown = [
    { name: "Mahalle", value: neighborhoods.length },
    { name: "Köy", value: villages.length },
  ];
  const peerComparison = [
    { name: municipality.name, value: municipality.population },
    ...peers.map((p) => ({ name: p.name, value: p.population })),
  ];

  const sources = [
    { label: "TurkiyeAPI — nüfus, alan, mahalle/köy verisi", url: "https://turkiyeapi.dev" },
    { label: "OpenStreetMap — harita ve konum", url: "https://www.openstreetmap.org/copyright" },
    { label: "OpenStreetMap Overpass — cami, okul (seviye kırılımıyla), kütüphane, hastane, eczane, park, spor tesisi sayıları ve müze/tarihi yer listesi", url: "https://www.openstreetmap.org/copyright" },
    ...(pilot?.sources ?? []),
  ];

  return (
    <div className="section-shell py-16">
      <Link
        href="/karsilastir"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Karşılaştırmaya dön
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-navy-950">
              {municipality.name}
            </h1>
            <Badge variant="navy">{municipality.province}</Badge>
            <Badge variant="outline">{municipality.region}</Badge>
            {municipality.isCoastal && <Badge variant="green">Kıyı ili</Badge>}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {municipality.isMetropolitan
              ? "Büyükşehir ilçesi"
              : "İlçe belediyesi"}
          </p>
        </div>
        <SourceBadge sources={sources} />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Users} label="Nüfus" value={formatNumber(municipality.population)} />
        <StatCard icon={Ruler} label="Yüzölçümü" value={`${formatNumber(municipality.area)} km²`} />
        <StatCard icon={Building2} label="Yoğunluk" value={`${formatNumber(Math.round(density))} kişi/km²`} />
        <StatCard icon={MapPin} label="Mahalle" value={formatNumber(neighborhoods.length)} />
        <StatCard icon={Trees} label="Köy" value={formatNumber(villages.length)} />
      </div>

      <div className="mb-8">
        <DistrictMap districtName={municipality.name} location={location} />
      </div>

      <DistrictInfrastructure bbox={bbox} municipalityName={municipality.name} />

      <h2 className="mb-4 text-lg font-semibold text-navy-950">
        Karşılaştırmalı analiz
      </h2>
      <div className="mb-10">
        <DistrictCharts
          populationComparison={populationComparison}
          densityComparison={densityComparison}
          settlementBreakdown={settlementBreakdown}
          peerComparison={peerComparison}
        />
      </div>

      {neighborhoods.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-navy-950">
            Mahalleler ({neighborhoods.length})
          </h2>
          <Card className="max-h-96 overflow-y-auto !p-0">
            <ul className="divide-y divide-border-subtle">
              {neighborhoods.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center justify-between px-5 py-2.5 text-sm"
                >
                  <span className="font-medium text-navy-950">{n.name}</span>
                  <span className="text-slate-500">
                    {formatNumber(n.population)} kişi
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-navy-950">
        Faaliyet ve performans verisi
      </h2>
      {pilot ? (
        <div className="mb-10 space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                2025 gerçekleşen gider
              </span>
              <SourceBadge sources={pilot.sources} />
            </div>
            <p className="text-2xl font-bold text-navy-950">
              {formatNumber(pilot.budget2025)} TL
            </p>
            <p className="text-sm text-slate-500">
              Kişi başına ~{formatNumber(pilot.perCapitaSpend)} TL
            </p>
          </Card>
          {pilot.faaliyetRaporlari.length > 0 && (
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                  <FileText className="h-4 w-4 text-slate-400" />
                  Yayınlanmış faaliyet raporları
                </h3>
                <span className="text-sm font-medium text-slate-500">
                  {pilot.faaliyetRaporlari.length} adet
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pilot.faaliyetRaporlari
                  .slice()
                  .sort((a, b) => a.year - b.year)
                  .map((report) => (
                    <a
                      key={report.year}
                      href={report.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-border-subtle px-3 py-1 text-sm font-medium text-navy-700 transition-colors hover:border-navy-600 hover:text-navy-900"
                    >
                      {report.year}
                    </a>
                  ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Belediyenin kendi sitesinde şu anda erişilebilir faaliyet
                raporu sayısı; kurumun tüm kurumsal arşivini değil,
                bugün kamuya açık olanı yansıtır.
              </p>
            </Card>
          )}
          {pilot.goals.length > 0 && (
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-navy-950">
                Hedef / gerçekleşen
              </h3>
              <div className="space-y-4">
                {pilot.goals.map((goal) => (
                  <div key={goal.label}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium text-navy-950">
                        {goal.label}
                      </span>
                      <span className="text-slate-500">
                        {formatNumber(goal.actual)} / {formatNumber(goal.target)}{" "}
                        {goal.unit}
                      </span>
                    </div>
                    <Progress value={goal.actual} max={goal.target} />
                  </div>
                ))}
              </div>
            </Card>
          )}
          {pilot.goodPractices.length > 0 && (
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-navy-950">
                İyi uygulamalar
              </h3>
              <div className="space-y-3">
                {pilot.goodPractices.map((p) => (
                  <div key={p.title} className="rounded-xl border border-border-subtle p-4">
                    <p className="font-medium text-navy-950">{p.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{p.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {pilot.weaknesses.length > 0 && (
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-navy-950">
                Belediyenin kendi zayıflıkları
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {pilot.weaknesses.map((w) => (
                  <div key={w.title} className="rounded-xl border border-border-subtle p-4">
                    <p className="font-medium text-navy-950">{w.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{w.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="mb-10">
          <p className="text-sm text-slate-600">
            <strong className="text-navy-900">{municipality.name}</strong> için
            faaliyet raporu verisi henüz KentPusula&apos;ya eklenmedi. Bu
            belediye pilot sürecine dahil olduğunda bütçe, hedef/gerçekleşen
            ve iyi uygulama göstergeleri burada görünecek.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/pilot">Bu belediye için pilot öner</Link>
          </Button>
        </Card>
      )}

      {peers.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-navy-950">
            Benzer belediyeler
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {peers.map((peer) => (
              <Link
                key={peer.id}
                href={`/ilce/${peer.id}`}
                className="rounded-2xl border border-border-subtle bg-white p-4 transition-colors hover:border-navy-600"
              >
                <p className="font-semibold text-navy-950">{peer.name}</p>
                <p className="text-xs text-slate-400">{peer.province}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {formatNumber(peer.population)} nüfus
                </p>
              </Link>
            ))}
          </div>
          <Button asChild variant="primary" className="mt-6">
            <Link href={`/karsilastir?a=${municipality.id}&b=${peers[0].id}`}>
              {municipality.name} — {peers[0].name} karşılaştır
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
