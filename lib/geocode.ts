export type BoundingBox = [south: number, north: number, west: number, east: number];

export type DistrictLocation = {
  latitude: number;
  longitude: number;
  boundingBox: BoundingBox | null;
  precise: boolean;
};

/**
 * Resolves a district's real-world location via OpenStreetMap's Nominatim
 * search API (free, no API key). Nominatim's usage policy caps this at
 * ~1 request/second and requires an identifying User-Agent — this is only
 * ever called on-demand for the single district a visitor opens, and the
 * result is cached for 30 days via Next's fetch cache, so it stays well
 * within that policy.
 *
 * Falls back to the province's known center coordinates (always available
 * from TurkiyeAPI) if Nominatim has no match, so the map never breaks —
 * `precise: false` tells the caller to label it as an approximate view.
 */
export async function getDistrictLocation(
  districtName: string,
  provinceName: string,
  fallback: { latitude: number; longitude: number }
): Promise<DistrictLocation> {
  const query = encodeURIComponent(`${districtName}, ${provinceName}, Türkiye`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=tr&q=${query}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "KentPusula/1.0 (belediye karsilastirma platformu)",
        "Accept-Language": "tr",
      },
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);

    const results = (await res.json()) as Array<{
      lat: string;
      lon: string;
      boundingbox: [string, string, string, string];
    }>;
    const hit = results[0];
    if (!hit) throw new Error("no match");

    const bbox = hit.boundingbox.map(Number) as BoundingBox;

    return {
      latitude: Number(hit.lat),
      longitude: Number(hit.lon),
      boundingBox: bbox,
      precise: true,
    };
  } catch {
    return {
      latitude: fallback.latitude,
      longitude: fallback.longitude,
      boundingBox: null,
      precise: false,
    };
  }
}

/** A usable bounding box even when Nominatim had no precise match. */
export function resolveBoundingBox(location: DistrictLocation): BoundingBox {
  if (location.boundingBox) return location.boundingBox;
  const { latitude, longitude } = location;
  return [latitude - 0.15, latitude + 0.15, longitude - 0.2, longitude + 0.2];
}
