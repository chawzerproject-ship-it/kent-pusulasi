import { CalendarClock, MapPinned, MessageSquareText, Target } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const items = [
  {
    icon: Target,
    title: "Öncelik haritası",
    description:
      "Hangi hizmet alanının en çok geride kaldığını veriyle gösterir.",
  },
  {
    icon: MapPinned,
    title: "Emsal uygulamalar",
    description: "Benzer belediyelerin uyguladığı çözümleri derler.",
  },
  {
    icon: MessageSquareText,
    title: "Kurumsal cevap",
    description: "Vatandaş önerilerine yapılandırılmış yanıt akışı sunar.",
  },
  {
    icon: CalendarClock,
    title: "Aylık rapor",
    description: "İlerlemeyi ve öneri durumunu düzenli olarak özetler.",
  },
];

export function ValueProposition() {
  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow="Belediye için değer"
        title="Belediye için değer önerisi"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <Card className="h-full">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <item.icon className="h-5 w-5" />
              </span>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardContent className="mt-2">{item.description}</CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 max-w-2xl text-sm font-medium text-slate-600">
        Platform belediyeyi yalnızca değerlendirmez; karar hazırlığına veri
        sağlar.
      </p>
    </section>
  );
}
