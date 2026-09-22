import {
  Building2,
  Landmark,
  Ruler,
  ShieldCheck,
  TreePine,
  Wallet,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

const criteria = [
  {
    icon: Building2,
    title: "Belediye türü",
    description: "Büyükşehir • il • ilçe • belde",
  },
  {
    icon: Ruler,
    title: "Ölçek",
    description: "Nüfus • yüzölçümü • bütçe",
  },
  {
    icon: TreePine,
    title: "Yerel yapı",
    description: "Tarım • sanayi • turizm",
  },
  {
    icon: Landmark,
    title: "Hizmet yükü",
    description: "Mahalle sayısı • mevsimsel nüfus",
  },
  {
    icon: Wallet,
    title: "Mali kapasite",
    description: "Gelir yapısı • kişi başı kaynak",
  },
  {
    icon: ShieldCheck,
    title: "Veri güveni",
    description: "Kaynak • yıl • doğrulama durumu",
  },
];

export function FairCriteria() {
  return (
    <section className="bg-navy-50/60 py-20">
      <div className="section-shell">
        <SectionHeading eyebrow="Yöntem" title="Adil kıyas kriterleri" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="flex items-start gap-4 rounded-2xl border border-border-subtle bg-white p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-800">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-navy-950">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {c.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm font-medium text-slate-600">
          Sonuç: tek bir &ldquo;başarı puanı&rdquo; yerine kategori bazında,
          açıklanabilir göstergeler.
        </p>
      </div>
    </section>
  );
}
