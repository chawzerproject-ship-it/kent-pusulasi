import { AlertTriangle, BadgeCheck, IdCard, Vote } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";

const stages = [
  {
    icon: IdCard,
    stage: "İlk sürüm",
    title: "Öneri",
    description:
      "İkamet doğrulanmadan, \"doğrulanmadı\" etiketiyle yayınlanır.",
  },
  {
    icon: BadgeCheck,
    stage: "Pilot",
    title: "Doğrulama",
    description:
      "Telefon, belge veya kurum onaylı hemşehri statüsü ile güçlendirilir.",
  },
  {
    icon: Vote,
    stage: "Yaygınlaşma",
    title: "Temsil",
    description:
      "e-Devlet seçeneği eklenir; doğrulanmış görüşler ayrı raporlanır.",
  },
];

export function TrustModel() {
  return (
    <section id="katilim" className="bg-navy-50/60 py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Katılım güven modeli"
          title="Aşamalı açılma"
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {stages.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border-subtle bg-white p-6">
                <Badge variant="outline" className="mb-4">
                  {s.stage}
                </Badge>
                <s.icon className="h-6 w-6 text-navy-700" />
                <h3 className="mt-3 text-base font-semibold text-navy-950">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-100/40 p-4 text-sm text-navy-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
            <p>
              Hakaret, kişisel veri, siyasi propaganda ve doğrulanmamış
              suçlama yayımlanmaz.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
