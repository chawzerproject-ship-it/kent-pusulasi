import { Eye, GitCompareArrows, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  {
    icon: Eye,
    title: "GÖRÜR",
    description:
      "Nüfus, bütçe, faaliyet ve sonuçları tek bir belediye profilinde toplar.",
  },
  {
    icon: GitCompareArrows,
    title: "KIYASLAR",
    description:
      "Yalnızca benzer ölçek ve şartlardaki belediyeleri karşılaştırır.",
  },
  {
    icon: GraduationCap,
    title: "ÖĞRENİR",
    description:
      "İyi uygulamanın maliyetini, insan kaynağını ve taşınma şartlarını gösterir.",
  },
];

export function Solution() {
  return (
    <section id="kiyaslama" className="bg-navy-50/60 py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Çözüm"
          title="KentPusula üç işi aynı yerde yapar"
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <Card className="h-full">
                <CardHeader>
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>{item.description}</CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm font-medium text-slate-600">
          Amaç belediyeleri yarıştırmak değil; benzer şartlarda neyin mümkün
          olduğunu görünür kılmak.
        </p>
      </div>
    </section>
  );
}
