import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { SourceBadge } from "@/components/source-badge";
import type { MunicipalityProfile } from "@/lib/types";

export function Weaknesses({
  municipality,
}: {
  municipality: MunicipalityProfile;
}) {
  const pilot = municipality.pilot!;

  return (
    <section className="bg-navy-50/60 py-20">
      <div className="section-shell">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <SectionHeading
            eyebrow="Şeffaflık"
            title="Belediyenin kendi zayıflıkları"
            className="mb-0"
          />
          <SourceBadge sources={pilot.sources} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pilot.weaknesses.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.05}>
              <div className="rounded-2xl border border-border-subtle bg-white p-5">
                <h3 className="text-sm font-semibold text-navy-950">
                  {w.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600">
                  {w.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm font-medium text-slate-600">
          Bu başlıklar dışarıdan yorum değil, belediyenin kendi faaliyet
          raporunda yer alan zayıflıklardır.
        </p>
      </div>
    </section>
  );
}
