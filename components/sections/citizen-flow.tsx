import { CheckCircle2, Compass, FileSearch, Send } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

const steps = [
  {
    icon: Compass,
    title: "Belediyesini seçer",
    description: "Profil ve güncel verilere tek noktadan ulaşır.",
  },
  {
    icon: FileSearch,
    title: "Benzer belediyeyi görür",
    description: "Aynı ölçekte, adil bir kıyasla karşılaştırır.",
  },
  {
    icon: CheckCircle2,
    title: "Uygulamayı inceler",
    description: "Maliyet, ekip ve mevzuat şartlarını görür.",
  },
  {
    icon: Send,
    title: "Kendi kenti için önerir",
    description: "Önerisi desteklenir ve belediye tarafından cevaplanır.",
  },
];

export function CitizenFlow() {
  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow="Vatandaş akışı"
        title="Sorudan uygulanabilir öneriye"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08}>
            <div className="relative rounded-2xl border border-border-subtle bg-white p-6">
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <step.icon className="mt-2 h-6 w-6 text-navy-700" />
              <h3 className="mt-4 text-base font-semibold text-navy-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-sm font-medium text-slate-600">
        Siyasete üye olmadan, kişiye değil hizmete odaklanan katılım.
      </p>
    </section>
  );
}
