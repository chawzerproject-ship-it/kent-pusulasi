import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { CompareTool } from "@/components/compare-tool";
import { getAllMunicipalities } from "@/lib/municipalities";

export const metadata: Metadata = {
  title: "Karşılaştır — KentPusula",
  description:
    "Türkiye'deki 81 il ve 973 ilçenin tamamı arasında nüfus, alan ve mevcut faaliyet verilerine göre karşılaştırma yapın.",
};

export default async function KarsilastirPage(
  props: PageProps<"/karsilastir">
) {
  const searchParams = await props.searchParams;
  const initialA =
    typeof searchParams.a === "string" ? Number(searchParams.a) : undefined;
  const initialB =
    typeof searchParams.b === "string" ? Number(searchParams.b) : undefined;

  const all = await getAllMunicipalities();

  return (
    <div className="section-shell py-20">
      <SectionHeading
        eyebrow="Nesnel karşılaştırma"
        title="Türkiye'deki tüm belediyeler arasında karşılaştır"
        description="Listede 81 ilin 973 ilçesinin tamamı yer alır. Nüfus ve yüzölçümü verileri TurkiyeAPI üzerinden canlı çekilir; bütçe ve performans göstergeleri yalnızca faaliyet raporu ile onaylanmış pilot belediyeler için gösterilir."
      />
      <CompareTool
        allMunicipalities={all}
        initialA={initialA}
        initialB={initialB}
      />
    </div>
  );
}
