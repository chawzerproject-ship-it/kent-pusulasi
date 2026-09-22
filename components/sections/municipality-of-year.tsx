import Link from "next/link";
import { ArrowRight, MapPin, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { MunicipalityOfTheYear } from "@/lib/municipalities";
import { formatNumber } from "@/lib/utils";

export function MunicipalityOfYear({ data }: { data: MunicipalityOfTheYear | null }) {
  if (!data) return null;
  const { municipality, avgCompletion, goalCount } = data;
  const pct = Math.round(avgCompletion * 100);

  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow="Yılın belediyesi"
        title="Hedeflerini en çok tutturan pilot belediye"
        description={`Pilot belediyelerin kendi faaliyet raporunda yayınladığı ${goalCount === 1 ? "hedef" : "hedefler"} arasından, ortalama gerçekleşme oranı en yüksek olan otomatik hesaplanır — bu bir editoryal seçim değildir, sadece ${goalCount} adet yayınlanmış hedef üzerinden yapılan bir hesaplamadır.`}
      />
      <Reveal>
        <Card className="mx-auto max-w-xl overflow-hidden !p-0">
          <div className="flex items-center gap-2 border-b border-border-subtle bg-navy-950 px-5 py-3 text-white">
            <Trophy className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-semibold">Yılın belediyesi</span>
            <Badge variant="orange" className="ml-auto">
              %{pct} ortalama hedef gerçekleşmesi
            </Badge>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-navy-950">
              {municipality.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {municipality.province} •{" "}
              {municipality.isMetropolitan
                ? "büyükşehir ilçesi"
                : "ilçe belediyesi"}
            </p>

            <div className="mt-5 space-y-3">
              {municipality.pilot!.goals.map((goal) => (
                <div key={goal.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-navy-950">
                      {goal.label}
                    </span>
                    <span className="text-slate-500">
                      {formatNumber(goal.actual)} / {formatNumber(goal.target)}{" "}
                      {goal.unit}
                    </span>
                  </div>
                  <Progress value={goal.actual} max={goal.target} />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-navy-50 px-4 py-3 text-sm">
              <span className="font-semibold text-navy-950">
                {formatNumber(municipality.population)}
              </span>
              <span className="text-slate-500">nüfus</span>
            </div>

            <Button asChild variant="primary" className="mt-6 w-full">
              <Link href={`/ilce/${municipality.id}`}>
                Tam profili gör
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
