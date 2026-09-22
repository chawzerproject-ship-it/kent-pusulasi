import { Hero } from "@/components/sections/hero";
import { MunicipalityOfYear } from "@/components/sections/municipality-of-year";
import { RandomMunicipalities } from "@/components/sections/random-municipalities";
import { TurkeyRecords } from "@/components/sections/turkey-records";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { CitizenFlow } from "@/components/sections/citizen-flow";
import { FairCriteria } from "@/components/sections/fair-criteria";
import { DataComparison } from "@/components/sections/data-comparison";
import { GoodPractices } from "@/components/sections/good-practices";
import { GoalsProgress } from "@/components/sections/goals-progress";
import { Weaknesses } from "@/components/sections/weaknesses";
import { TrustModel } from "@/components/sections/trust-model";
import { ValueProposition } from "@/components/sections/value-proposition";
import { PilotTimeline } from "@/components/sections/pilot-timeline";
import { ClosingCta } from "@/components/sections/closing-cta";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ExploreWidget } from "@/components/explore-widget";
import {
  getAllMunicipalities,
  getMunicipalityOfTheYear,
  getRandomMunicipalities,
} from "@/lib/municipalities";
import { getProvinces, getTopNeighborhoods } from "@/lib/turkiye-api";

// Fallback district id, used only when no pilot municipality has published
// goal data at all (getMunicipalityOfTheYear returns null) — District
// *slugs* aren't unique nationwide (Turkey has three "Yenişehir" districts
// alone), so this is a fixed numeric id, never a slug.
const YENISEHIR_BURSA_ID = 1725;

export default async function Home() {
  const [all, provinces, topNeighborhoods] = await Promise.all([
    getAllMunicipalities(),
    getProvinces(),
    getTopNeighborhoods(1),
  ]);
  const pilotMunicipalities = all.filter((m) => m.hasPilotData);
  const municipalityOfYear = getMunicipalityOfTheYear(all);
  const randomPicks = getRandomMunicipalities(all, 12);
  const spotlight =
    municipalityOfYear?.municipality ??
    all.find((m) => m.id === YENISEHIR_BURSA_ID)!;

  // Records computed across all 81 provinces / 973 districts — never a
  // single hardcoded pilot municipality.
  const topProvince = provinces.reduce((max, p) =>
    p.population > max.population ? p : max
  );
  const topMunicipality = all.reduce((max, m) =>
    m.population > max.population ? m : max
  );
  const largestArea = all.reduce((max, m) => (m.area > max.area ? m : max));
  const densest = all.reduce((max, m) =>
    m.population / m.area > max.population / max.area ? m : max
  );
  const topNeighborhood = topNeighborhoods[0];
  const topNeighborhoodDistrict = all.find(
    (m) => m.id === topNeighborhood.districtId
  );

  return (
    <>
      <Hero />
      <MunicipalityOfYear data={municipalityOfYear} />
      <RandomMunicipalities all={all} initialPicks={randomPicks} />
      <section id="kesfet" className="section-shell py-20">
        <SectionHeading
          eyebrow="Canlı veri"
          align="center"
          title="Herhangi bir belediyeyi seçin, gerçek verisini görün"
          description="973 ilçenin tamamı aranabilir. Nüfus ve yüzölçümü TurkiyeAPI'den, yerel altyapı sayıları (cami, okul, kütüphane, hastane...) OpenStreetMap'ten o an canlı çekilir — demo değil, gerçek veri."
        />
        <Reveal>
          <ExploreWidget allMunicipalities={all} />
        </Reveal>
      </section>
      <TurkeyRecords
        topProvince={topProvince}
        topMunicipality={topMunicipality}
        topNeighborhood={topNeighborhood}
        topNeighborhoodDistrict={topNeighborhoodDistrict}
        largestArea={largestArea}
        densest={densest}
      />
      <Problem />
      <Solution />
      <CitizenFlow />
      <FairCriteria />
      <DataComparison pilotMunicipalities={pilotMunicipalities} />
      <GoodPractices municipalities={pilotMunicipalities} />
      <GoalsProgress municipality={spotlight} />
      <Weaknesses municipality={spotlight} />
      <TrustModel />
      <ValueProposition />
      <PilotTimeline />
      <ClosingCta />
    </>
  );
}
