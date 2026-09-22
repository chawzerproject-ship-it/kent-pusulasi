import { Reveal } from "@/components/reveal";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";

export function ClosingCta() {
  return (
    <section id="pilot" className="section-shell py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <div>
            <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
              Kapanış
            </span>
            <h2 className="mt-4 text-2xl font-bold text-navy-950 sm:text-3xl">
              Bir pilot belediye. Bir veri sorumlusu. Doksan günlük çalışma.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              KentPusula • Belediyeler için ortak gelişim zemini
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Card>
            <ContactForm />
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
