import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Pilot Talebi — KentPusula",
  description:
    "Belediyeniz için 90 günlük KentPusula pilot çalışmasına başvurun.",
};

const steps = [
  { range: "1–30 gün", title: "Veriyi kur" },
  { range: "31–60 gün", title: "Ürünü aç" },
  { range: "61–90 gün", title: "Sonucu ölç" },
];

export default function PilotPage() {
  return (
    <div className="section-shell py-20">
      <SectionHeading
        eyebrow="Pilot başvurusu"
        title="Bir pilot belediye. Bir veri sorumlusu. Doksan günlük çalışma."
        description="Belediyeniz adına pilot sürece katılmak için aşağıdaki formu doldurun. Ekibimiz sizinle iletişime geçecek."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border-subtle bg-white p-5"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                  {step.range}
                </span>
                <h3 className="mt-1 text-base font-semibold text-navy-950">
                  {step.title}
                </h3>
              </div>
            ))}
            <p className="text-sm text-slate-500">
              Pilot başarı ölçütleri: veri tamlığı • öneri kalitesi • kurum
              yanıt süresi • kullanıcı güveni
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Card>
            <ContactForm />
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
