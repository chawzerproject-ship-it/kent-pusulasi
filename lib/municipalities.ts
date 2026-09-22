import pilotRaw from "@/data/pilot-data.json";
import { getDistricts, getProvinces } from "@/lib/turkiye-api";
import type { MunicipalityProfile, PilotData } from "@/lib/types";

const pilotData = pilotRaw as unknown as PilotData[];
const pilotByDistrictId = new Map(pilotData.map((p) => [p.districtId, p]));

export async function getAllMunicipalities(): Promise<MunicipalityProfile[]> {
  const [provinces, districts] = await Promise.all([
    getProvinces(),
    getDistricts(),
  ]);
  const provinceById = new Map(provinces.map((p) => [p.id, p]));

  return districts.map((d) => {
    const province = provinceById.get(d.provinceId);
    // Keyed by the district's numeric id, never its slug — district slugs
    // repeat across provinces (e.g. three "Yenişehir", 51 "Merkez"), so a
    // slug-keyed lookup would silently attach one district's faaliyet
    // raporu data to unrelated same-named districts elsewhere in Turkey.
    const pilot = pilotByDistrictId.get(d.id) ?? null;
    return {
      id: d.id,
      slug: d.slug,
      name: d.name,
      province: province?.name ?? "",
      provinceId: d.provinceId,
      provinceSlug: province?.slug ?? "",
      region: province?.region.tr ?? "",
      isMetropolitan: Boolean(province?.isMetropolitan),
      population: d.population,
      area: d.area.value,
      isCoastal: Boolean(province?.isCoastal),
      hasPilotData: Boolean(pilot),
      pilot,
    } satisfies MunicipalityProfile;
  });
}

export async function getMunicipalityById(
  id: number
): Promise<MunicipalityProfile | undefined> {
  const all = await getAllMunicipalities();
  return all.find((m) => m.id === id);
}

export async function getPilotMunicipalities(): Promise<
  MunicipalityProfile[]
> {
  const all = await getAllMunicipalities();
  return all.filter((m) => m.hasPilotData);
}

/**
 * Adil kıyas: aynı büyükşehir/ilçe statüsünde, nüfusu %45 aralığında yakın
 * belediyeleri, nüfusça en yakından uzağa sıralar. Metodoloji sayfasındaki
 * "ölçek" ve "belediye türü" kriterlerinin basit bir uygulamasıdır.
 */
export function getPeers(
  target: MunicipalityProfile,
  all: MunicipalityProfile[],
  count = 3
): MunicipalityProfile[] {
  const minPop = target.population * 0.55;
  const maxPop = target.population * 1.55;

  return all
    .filter(
      (m) =>
        m.id !== target.id &&
        m.isMetropolitan === target.isMetropolitan &&
        m.population >= minPop &&
        m.population <= maxPop
    )
    .sort(
      (a, b) =>
        Math.abs(a.population - target.population) -
        Math.abs(b.population - target.population)
    )
    .slice(0, count);
}

function average(values: number[]): number {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
}

/**
 * Türkiye genelindeki 973 ilçenin ortalama nüfus/yoğunluk değerleri.
 * İlçe profil sayfasındaki karşılaştırma grafikleri için kullanılır.
 */
export function getNationalAverages(all: MunicipalityProfile[]) {
  return {
    population: average(all.map((m) => m.population)),
    density: average(all.map((m) => m.population / m.area)),
  };
}

export type MunicipalityOfTheYear = {
  municipality: MunicipalityProfile;
  avgCompletion: number;
  goalCount: number;
};

/**
 * "Yılın belediyesi": pilot belediyeler arasında, kendi faaliyet raporunda
 * yayınladığı hedef/gerçekleşen rakamlarının ortalama gerçekleşme oranı en
 * yüksek olan. Yalnızca en az bir hedef verisi yayınlamış pilot belediyeler
 * arasından seçilir — hedef verisi olmayan pilot belediyeler (henüz
 * KentPusula'ya hedef girilmemiş) bu sıralamaya girmez, uydurma bir oran
 * üretilmez. Örneklem küçük (yalnızca 5 pilot belediye) olduğundan bu bir
 * "en iyisi" iddiası değil, mevcut kamuya açık veriyle hesaplanabilen tek
 * nesnel sıralamadır — arayüzde bu sınır açıkça belirtilmelidir.
 */
export function getMunicipalityOfTheYear(
  all: MunicipalityProfile[]
): MunicipalityOfTheYear | null {
  const candidates = all
    .filter((m) => m.pilot && m.pilot.goals.length > 0)
    .map((m) => {
      const goals = m.pilot!.goals;
      const avgCompletion =
        goals.reduce(
          (sum, g) => sum + (g.target > 0 ? g.actual / g.target : 0),
          0
        ) / goals.length;
      return { municipality: m, avgCompletion, goalCount: goals.length };
    });

  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.avgCompletion - a.avgCompletion)[0];
}

/** Fisher-Yates shuffle, does not mutate the input array. */
export function getRandomMunicipalities(
  all: MunicipalityProfile[],
  count: number
): MunicipalityProfile[] {
  const pool = [...all];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * Aynı ile bağlı diğer ilçelerin ortalama nüfus/yoğunluk değerleri
 * (hedef ilçenin kendisi hariç).
 */
export function getProvinceAverages(
  all: MunicipalityProfile[],
  provinceId: number,
  excludeId: number
) {
  const siblings = all.filter(
    (m) => m.provinceId === provinceId && m.id !== excludeId
  );
  return {
    population: average(siblings.map((m) => m.population)),
    density: average(siblings.map((m) => m.population / m.area)),
    count: siblings.length,
  };
}
