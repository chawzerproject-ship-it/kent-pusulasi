import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/source-badge";
import type { MunicipalityProfile } from "@/lib/types";

export function GoodPractices({
  municipalities,
}: {
  municipalities: MunicipalityProfile[];
}) {
  const gallery = municipalities.flatMap((m) =>
    (m.pilot?.goodPractices ?? []).map((practice) => ({
      municipality: m.name,
      ...practice,
    }))
  );

  return (
    <section className="bg-navy-50/60 py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="İyi uygulamalar"
          title="Ölçülebilir uygulama galerisi"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.06}>
              <Card className="flex h-full flex-col">
                <Badge variant="navy" className="mb-3 w-fit">
                  {item.municipality}
                </Badge>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardContent className="mt-2 flex-1">
                  {item.description}
                </CardContent>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {item.sourceNote}
                  </span>
                  <SourceBadge
                    sources={[{ label: item.sourceNote, url: null }]}
                  />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm font-medium text-slate-600">
          Platform fotoğrafı habere değil, ölçülebilir uygulama kartına
          dönüştürür.
        </p>
      </div>
    </section>
  );
}
