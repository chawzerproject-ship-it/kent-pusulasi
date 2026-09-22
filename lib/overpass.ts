import type { BoundingBox } from "@/lib/geocode";

export type AmenityCounts = {
  mosques: number;
  kindergartens: number;
  preschools: number;
  primarySchools: number;
  middleSchools: number;
  highSchools: number;
  otherSchools: number;
  schoolsTotal: number;
  universities: number;
  libraries: number;
  hospitals: number;
  pharmacies: number;
  parks: number;
  sportsFacilities: number;
  chargingStations: number;
  recycling: number;
  assemblyPoints: number;
};

export type AttractionCategory = "muze" | "tarihi" | "gezilecek" | "manzara" | "sanat";

export type Attraction = {
  name: string;
  category: AttractionCategory;
  label: string;
};

export type DistrictInfrastructure = {
  amenities: AmenityCounts;
  attractions: Attraction[];
};

// Multiple independent public Overpass instances, tried in order. Each is
// run by a different operator on different infrastructure, so a single
// instance being slow, overloaded, or unreachable from a given network
// doesn't take the feature down — the next one is tried automatically.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.monicz.dev/api/interpreter",
];

const PER_ENDPOINT_TIMEOUT_MS = 12_000;

/**
 * Posts the query to each configured Overpass endpoint in turn, returning
 * the first successful (HTTP 200) response. A slow or unreachable endpoint
 * is aborted after `PER_ENDPOINT_TIMEOUT_MS` rather than hanging the whole
 * request chain.
 */
async function fetchFromAnyOverpassEndpoint(
  query: string
): Promise<Response | null> {
  for (const url of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PER_ENDPOINT_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        next: { revalidate: 60 * 60 * 24 * 30 },
        signal: controller.signal,
      });
      if (res.ok) return res;
    } catch {
      // Unreachable, timed out, or aborted — fall through to the next
      // endpoint in the list.
    } finally {
      clearTimeout(timeout);
    }
  }
  return null;
}

// Order matters: each "out count" line below produces one count element, in
// this exact sequence, so parsing zips COUNT_KEYS[i] to elements[i].
const COUNT_KEYS = [
  "mosques",
  "kindergartens",
  "libraries",
  "hospitals",
  "pharmacies",
  "universities",
  "parks",
  "sportsFacilities",
  "chargingStations",
  "recycling",
  "assemblyPoints",
] as const;

function buildQuery([south, north, west, east]: BoundingBox): string {
  const bbox = `${south},${west},${north},${east}`;
  return `
[out:json][timeout:35];
(nwr["amenity"="place_of_worship"]["religion"="muslim"](${bbox});); out count;
(nwr["amenity"="kindergarten"](${bbox});); out count;
(nwr["amenity"="library"](${bbox});); out count;
(nwr["amenity"="hospital"](${bbox});); out count;
(nwr["amenity"="pharmacy"](${bbox});); out count;
(nwr["amenity"="university"](${bbox});); out count;
(nwr["leisure"="park"](${bbox});); out count;
(nwr["leisure"="sports_centre"](${bbox});); out count;
(nwr["amenity"="charging_station"](${bbox});); out count;
(nwr["amenity"="recycling"](${bbox});); out count;
(nwr["emergency"="assembly_point"](${bbox});); out count;
(nwr["amenity"="school"](${bbox});)->.schools;
.schools out tags;
(
  nwr["tourism"="museum"](${bbox});
  nwr["tourism"="attraction"](${bbox});
  nwr["tourism"="viewpoint"](${bbox});
  nwr["tourism"="artwork"](${bbox});
  nwr["historic"](${bbox});
)->.attractions;
.attractions out tags 200;
`.trim();
}

type OverpassCountElement = {
  type: "count";
  tags: { total: string };
};

type OverpassTaggedElement = {
  type: "node" | "way" | "relation";
  id: number;
  tags?: Record<string, string>;
};

/**
 * OSM tags most Turkish schools carry either `isced:level` (0=preschool,
 * 1=ilkokul, 2=ortaokul, 3=lise) or a Turkish name suffix — neither is
 * consistently present, so this checks both and falls back to "otherSchools"
 * rather than guessing.
 */
function classifySchool(
  tags: Record<string, string> | undefined
): "preschool" | "primary" | "middle" | "high" | "other" {
  const isced = tags?.["isced:level"] ?? "";
  if (isced.includes("0")) return "preschool";
  if (isced.includes("1")) return "primary";
  if (isced.includes("2")) return "middle";
  if (isced.includes("3")) return "high";

  const name = (tags?.name ?? "").toLocaleLowerCase("tr");
  if (/anaokulu|ana sınıfı|kreş/.test(name)) return "preschool";
  if (/ilkokul/.test(name)) return "primary";
  if (/ortaokul/.test(name)) return "middle";
  if (/lise|imam hatip|meslek(i|î)? (ve )?teknik/.test(name)) return "high";
  return "other";
}

const HISTORIC_LABELS: Record<string, string> = {
  castle: "Kale",
  fort: "Hisar",
  ruins: "Harabe",
  archaeological_site: "Arkeolojik alan",
  monument: "Anıt",
  memorial: "Anıt",
  tomb: "Türbe",
  wayside_shrine: "Ziyaretgah",
  city_gate: "Tarihi kapı",
  church: "Tarihi kilise",
  building: "Tarihi bina",
  yes: "Tarihi yer",
};

/**
 * Classifies one tagged OSM element as a named tourist attraction, or
 * returns null if it isn't one (a school, or an unnamed/unclassifiable
 * element) — unnamed places aren't useful in a list meant for people to
 * actually visit, so they're dropped rather than shown as "İsimsiz".
 */
function classifyAttraction(
  tags: Record<string, string> | undefined
): Attraction | null {
  if (!tags?.name) return null;
  if (tags.amenity === "school") return null;

  if (tags.tourism === "museum") {
    return { name: tags.name, category: "muze", label: "Müze" };
  }
  if (tags.tourism === "viewpoint") {
    return { name: tags.name, category: "manzara", label: "Manzara noktası" };
  }
  if (tags.tourism === "artwork") {
    return { name: tags.name, category: "sanat", label: "Sanat eseri" };
  }
  if (tags.historic) {
    return {
      name: tags.name,
      category: "tarihi",
      label: HISTORIC_LABELS[tags.historic] ?? "Tarihi yer",
    };
  }
  if (tags.tourism === "attraction") {
    return { name: tags.name, category: "gezilecek", label: "Gezilecek yer" };
  }
  return null;
}

const CACHE_PREFIX = "kentpusula:overpass:v2:";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days, matches the server-side revalidate window used elsewhere in this app.

function cacheKey(bbox: BoundingBox): string {
  return CACHE_PREFIX + bbox.map((n) => n.toFixed(4)).join(",");
}

/**
 * Public Overpass instances are free, volunteer-run infrastructure with a
 * shared, per-IP request budget — there is no unlimited free tier for this
 * kind of data anywhere. Caching each district's result in the visitor's
 * own browser (not a server-side cache, since every visitor's request now
 * originates from their own browser — see `getDistrictInfrastructure`'s
 * doc comment) means a returning visitor never re-queries Overpass for a
 * district they've already looked at, which is the biggest lever this app
 * has over its own request volume.
 */
function readCache(bbox: BoundingBox): DistrictInfrastructure | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(bbox));
    if (!raw) return null;
    const { data, savedAt } = JSON.parse(raw) as {
      data: DistrictInfrastructure;
      savedAt: number;
    };
    if (Date.now() - savedAt > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(bbox: BoundingBox, data: DistrictInfrastructure): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      cacheKey(bbox),
      JSON.stringify({ data, savedAt: Date.now() })
    );
  } catch {
    // Storage full or disabled (e.g. private browsing) — caching is a nice
    // to have, not a correctness requirement, so just skip it.
  }
}

/**
 * Real, live local infrastructure and tourist-attraction data within a
 * district's bounding box, from OpenStreetMap's Overpass API (free, no API
 * key) — works for any of Turkey's 973 districts, unlike budget/performance
 * data which only exists for the handful of pilot districts with a manually
 * onboarded faaliyet raporu. OSM is community-mapped, not an official
 * register, so results reflect what's tagged in OSM rather than a
 * guaranteed-complete census — callers should label it as such.
 *
 * Public Overpass instances have a small concurrent-request budget and
 * occasionally time out or become unreachable under load, so this (a)
 * checks a local cache first, and (b), on a cache miss, tries several
 * independent instances (see `OVERPASS_ENDPOINTS`) before giving up —
 * returning `null` only if every one of them fails, never a fake empty
 * result. The UI must show "veri alınamadı" on `null`, never treat it as
 * "nothing exists here".
 */
export async function getDistrictInfrastructure(
  bbox: BoundingBox
): Promise<DistrictInfrastructure | null> {
  const cached = readCache(bbox);
  if (cached) return cached;

  try {
    const res = await fetchFromAnyOverpassEndpoint(buildQuery(bbox));
    if (!res) return null;

    const json = (await res.json()) as {
      elements: Array<OverpassCountElement | OverpassTaggedElement>;
    };

    const countElements = json.elements.filter(
      (e): e is OverpassCountElement => e.type === "count"
    );
    if (countElements.length !== COUNT_KEYS.length) return null;

    const counts: Record<string, number> = {};
    COUNT_KEYS.forEach((key, i) => {
      counts[key] = Number(countElements[i].tags.total);
    });

    const taggedElements = json.elements.filter(
      (e): e is OverpassTaggedElement =>
        e.type === "node" || e.type === "way" || e.type === "relation"
    );

    let preschools = 0;
    let primarySchools = 0;
    let middleSchools = 0;
    let highSchools = 0;
    let otherSchools = 0;
    let schoolsTotal = 0;

    const seenAttractions = new Set<string>();
    const attractions: Attraction[] = [];

    for (const el of taggedElements) {
      if (el.tags?.amenity === "school") {
        schoolsTotal++;
        switch (classifySchool(el.tags)) {
          case "preschool":
            preschools++;
            break;
          case "primary":
            primarySchools++;
            break;
          case "middle":
            middleSchools++;
            break;
          case "high":
            highSchools++;
            break;
          default:
            otherSchools++;
        }
        continue;
      }

      const attraction = classifyAttraction(el.tags);
      if (attraction) {
        const key = `${attraction.category}:${attraction.name}`;
        if (!seenAttractions.has(key)) {
          seenAttractions.add(key);
          attractions.push(attraction);
        }
      }
    }

    const result: DistrictInfrastructure = {
      amenities: {
        mosques: counts.mosques,
        kindergartens: counts.kindergartens,
        preschools,
        primarySchools,
        middleSchools,
        highSchools,
        otherSchools,
        schoolsTotal,
        universities: counts.universities,
        libraries: counts.libraries,
        hospitals: counts.hospitals,
        pharmacies: counts.pharmacies,
        parks: counts.parks,
        sportsFacilities: counts.sportsFacilities,
        chargingStations: counts.chargingStations,
        recycling: counts.recycling,
        assemblyPoints: counts.assemblyPoints,
      },
      attractions,
    };
    writeCache(bbox, result);
    return result;
  } catch {
    return null;
  }
}
