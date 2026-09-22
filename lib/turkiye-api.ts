const API_BASE = "https://api.turkiyeapi.dev/v2";

export type ApiArea = { value: number; unit: string };

export type ApiProvince = {
  id: number;
  name: string;
  slug: string;
  population: number;
  area: ApiArea;
  region: { tr: string; en: string };
  isCoastal: boolean;
  isMetropolitan: boolean;
  coordinates: { latitude: number; longitude: number };
  stats: {
    districtCount: number;
    municipalityCount: number;
    neighborhoodCount: number;
    villageCount: number;
  };
};

export type ApiDistrict = {
  id: number;
  name: string;
  slug: string;
  provinceId: number;
  population: number;
  area: ApiArea;
  stats: {
    municipalityCount: number;
    neighborhoodCount: number;
    villageCount: number;
  };
};

export type ApiNeighborhood = {
  id: number;
  name: string;
  slug: string;
  provinceId: number;
  districtId: number;
  population: number;
  postalCode: string;
};

type ListResponse<T> = {
  data: T[];
  meta: { count: number; total: number; limit: number; offset: number };
};

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error(`TurkiyeAPI request failed: ${path} (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function getProvinces(): Promise<ApiProvince[]> {
  const json = await fetchJson<ListResponse<ApiProvince>>(
    "/provinces?limit=100&sort=name"
  );
  return json.data;
}

export async function getDistricts(): Promise<ApiDistrict[]> {
  const json = await fetchJson<ListResponse<ApiDistrict>>(
    "/districts?limit=1000&sort=name"
  );
  return json.data;
}

export async function getNeighborhoodsByDistrict(
  districtId: number
): Promise<ApiNeighborhood[]> {
  const json = await fetchJson<ListResponse<ApiNeighborhood>>(
    `/neighborhoods?districtId=${districtId}&limit=250&sort=-population`
  );
  return json.data;
}

/**
 * Most populous neighborhoods across ALL of Turkey (no districtId filter) —
 * powers national "en kalabalık mahalle" records, as opposed to
 * `getNeighborhoodsByDistrict` which is scoped to one district.
 */
export async function getTopNeighborhoods(
  limit: number
): Promise<ApiNeighborhood[]> {
  const json = await fetchJson<ListResponse<ApiNeighborhood>>(
    `/neighborhoods?limit=${limit}&sort=-population`
  );
  return json.data;
}

export async function getVillagesByDistrict(
  districtId: number
): Promise<ApiNeighborhood[]> {
  const json = await fetchJson<ListResponse<ApiNeighborhood>>(
    `/villages?districtId=${districtId}&limit=250&sort=-population`
  );
  return json.data;
}

export function isMetropolitanDistrict(
  district: ApiDistrict,
  provinces: ApiProvince[]
): boolean {
  const province = provinces.find((p) => p.id === district.provinceId);
  return Boolean(province?.isMetropolitan);
}
