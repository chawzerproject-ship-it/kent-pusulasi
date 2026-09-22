import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { SourceBadge } from "@/components/source-badge";
import { Badge } from "@/components/ui/badge";

const example = ["Yenişehir", "İznik", "Karacabey"];

export function Problem() {
  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow="Problem"
        title="Bilgi var; fakat karşılaştırılabilir durumda değil"
        description="Faaliyet raporları, bütçeler ve proje sonuçları farklı sitelerde, farklı formatlarda ve farklı yıllarda yayımlanıyor. Bu da vatandaşın ve belediyenin kendisinin bile adil bir kıyas yapmasını zorlaştırıyor."
      />
      <Reveal>
        <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-navy-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-600">
              Örnek belediyeler:
            </span>
            {example.map((name) => (
              <Badge key={name} variant="navy">
                {name}
              </Badge>
            ))}
          </div>
          <SourceBadge
            sources={[
              { label: "Yenişehir Belediyesi Faaliyet Raporu", url: null },
              { label: "İznik Belediyesi Faaliyet Raporu", url: null },
              { label: "Karacabey Belediyesi Faaliyet Raporu", url: null },
            ]}
          />
        </div>
      </Reveal>
    </section>
  );
}
