import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

const phases = [
  {
    range: "1–30 gün",
    title: "Veriyi kur",
    description:
      "Belediye verilerini toplar, doğrular ve profil yapısına aktarır.",
  },
  {
    range: "31–60 gün",
    title: "Ürünü aç",
    description:
      "Belediye profili ve kıyaslama ekranlarını vatandaşla paylaşır.",
  },
  {
    range: "61–90 gün",
    title: "Sonucu ölç",
    description:
      "Öneri kalitesini, kurum yanıt süresini ve kullanıcı güvenini değerlendirir.",
  },
];

export function PilotTimeline() {
  return (
    <section className="bg-navy-950 py-20 text-white">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Pilot takvimi"
          title="90 günlük pilot takvimi"
          invert
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {phases.map((phase, i) => (
            <Reveal key={phase.title} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-400">
                  {phase.range}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{phase.title}</h3>
                <p className="mt-2 text-sm text-navy-100/70">
                  {phase.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-sm text-navy-100/70">
          Pilot başarı ölçütleri: veri tamlığı • öneri kalitesi • kurum yanıt
          süresi • kullanıcı güveni
        </p>
      </div>
    </section>
  );
}
