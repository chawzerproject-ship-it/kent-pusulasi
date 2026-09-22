export type EarthquakeEvent = {
  id: string;
  magnitude: number;
  depth: number;
  time: string;
  region: string;
  formattedTime: string;
};

/**
 * Fetches recent seismic events within ~120 km of the district coordinates
 * from the European-Mediterranean Seismological Centre (EMSC / CSEM FDSNWS) free open API.
 */
export async function getDistrictEarthquakes(
  latitude: number,
  longitude: number,
  limit = 5
): Promise<EarthquakeEvent[]> {
  try {
    const url = `https://www.seismicportal.eu/fdsnws/event/1/query?format=json&lat=${latitude}&lon=${longitude}&maxradius=1.2&limit=${limit}`;

    const res = await fetch(url, {
      next: { revalidate: 60 * 15 }, // Cache for 15 minutes
    });

    if (!res.ok) return [];

    const data = await res.json();
    const features = data.features || [];

    return features.map((f: {
      id?: string;
      properties: {
        mag?: number;
        depth?: number;
        time?: string;
        flynn_region?: string;
      };
    }) => {
      const p = f.properties;
      const date = p.time ? new Date(p.time) : new Date();
      const formattedTime = new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Istanbul",
      }).format(date);

      return {
        id: f.id || String(Math.random()),
        magnitude: Number((p.mag ?? 0).toFixed(1)),
        depth: Number((p.depth ?? 0).toFixed(1)),
        time: p.time || "",
        region: p.flynn_region || "Türkiye",
        formattedTime,
      };
    });
  } catch {
    return [];
  }
}

