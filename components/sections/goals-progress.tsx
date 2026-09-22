import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SourceBadge } from "@/components/source-badge";
import type { MunicipalityProfile } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function GoalsProgress({
  municipality,
}: {
  municipality: MunicipalityProfile;
}) {
  const pilot = municipality.pilot!;

  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow="Hedef / Gerçekleşen"
        title={`${municipality.name} performans göstergeleri`}
      />
      <Reveal>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              2025 hedef ve gerçekleşme
            </span>
            <SourceBadge sources={pilot.sources} />
          </div>
          <div className="space-y-5">
            {pilot.goals.map((goal) => (
              <div key={goal.label}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
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
        </Card>
      </Reveal>
      <p className="mt-6 text-sm font-medium text-slate-600">
        Bu tablo başarısızlık hükmü değil, hangi hedeflerin geride kaldığını
        gösterir.
      </p>
    </section>
  );
}
