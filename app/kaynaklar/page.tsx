import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getPilotMunicipalities } from "@/lib/municipalities";

export const metadata: Metadata = {
  title: "Kaynaklar — KentPusula",
  description:
    "KentPusula sitesinde geçen tüm veri iddialarının kaynak listesi.",
};

export default async function KaynaklarPage() {
  const pilotMunicipalities = await getPilotMunicipalities();

  const sourcesByLabel = new Map<
    string,
    { label: string; url: string | null; municipalities: string[] }
  >();

  for (const m of pilotMunicipalities) {
    for (const s of m.pilot?.sources ?? []) {
      const existing = sourcesByLabel.get(s.label);
      if (existing) {
        existing.municipalities.push(m.name);
      } else {
        sourcesByLabel.set(s.label, {
          label: s.label,
          url: s.url,
          municipalities: [m.name],
        });
      }
    }
  }

  const faaliyetKaynaklari = Array.from(sourcesByLabel.values());

  return (
    <div className="section-shell py-20">
      <SectionHeading
        eyebrow="Kaynaklar"
        title="Sitede geçen tüm kaynaklar"
        description="Nüfus ve alan verileri canlı bir açık API'den, faaliyet verileri ise belediyelerin kendi faaliyet raporlarından gelir."
      />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Canlı veri kaynağı
      </h2>
      <div className="mb-10 overflow-hidden rounded-2xl border border-border-subtle bg-white">
        <div className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-navy-950">
              TurkiyeAPI — Türkiye idari birimler veri seti
            </p>
            <p className="text-xs text-slate-500">
              81 il ve 973 ilçenin nüfus, yüzölçümü, bölge ve büyükşehir
              durumu bilgileri bu açık API&apos;den anlık olarak çekilir.
            </p>
          </div>
          <a
            href="https://turkiyeapi.dev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            Kaynağa git
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="flex flex-col gap-1 border-t border-border-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-navy-950">
              OpenStreetMap / Nominatim — harita ve konum
            </p>
            <p className="text-xs text-slate-500">
              İlçe profil sayfalarındaki gömülü harita ve konum verisi,
              açık kaynaklı OpenStreetMap ve Nominatim adres çözümleme
              servisinden gelir.
            </p>
          </div>
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            Kaynağa git
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Faaliyet raporu kaynakları (pilot belediyeler)
      </h2>
      <div className="overflow-hidden rounded-2xl border border-border-subtle">
        <ul className="divide-y divide-border-subtle">
          {faaliyetKaynaklari.map((source) => (
            <Reveal key={source.label}>
              <li className="flex flex-col gap-1 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-navy-950">
                    {source.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {source.municipalities.length > 1
                      ? `İlgili belediyeler: ${source.municipalities.join(", ")}`
                      : `İlgili belediye: ${source.municipalities[0]}`}
                  </p>
                </div>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900"
                  >
                    Kaynağa git
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">
                    Kaynak linki pilot aşamasında eklenecektir
                  </span>
                )}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
      <p className="mt-6 max-w-2xl text-xs text-slate-400">
        Diğer 968 ilçe için nüfus ve alan verisi canlı API&apos;den gösterilir;
        bütçe ve performans göstergeleri, ilgili belediye pilot sürece dahil
        olup faaliyet raporunu paylaştığında eklenecektir.
      </p>
    </div>
  );
}
