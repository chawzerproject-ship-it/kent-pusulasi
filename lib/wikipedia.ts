export type DistrictWiki = {
  title: string;
  extract: string;
  imageUrl: string | null;
  pageUrl: string;
};

/**
 * Fetches Wikipedia summary and thumbnail for a Turkish district.
 * Tries smart fallbacks for common names, disambiguation, and provincial centers ('Merkez').
 */
export async function getDistrictWiki(
  districtName: string,
  provinceName: string
): Promise<DistrictWiki | null> {
  const isMerkez = districtName.toLocaleLowerCase("tr") === "merkez";

  const candidates = isMerkez
    ? [
      `${provinceName}_(merkez)`,
      provinceName,
      `${provinceName}_Merkez`,
    ]
    : [
      districtName,
      `${districtName},_${provinceName}`,
      `${districtName}_(ilçe)`,
      `${districtName}_(${provinceName})`,
    ];

  for (const query of candidates) {
    try {
      const url = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        query.replace(/ /g, "_")
      )}`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "KentPusulasi/1.0 (info@kentpusulasi.app)",
          Accept: "application/json",
        },
        next: { revalidate: 60 * 60 * 24 * 7 }, // Cache for 7 days
      });

      if (!res.ok) continue;

      const data = await res.json();

      if (data.type === "disambiguation") continue;
      if (!data.extract || data.extract.trim().length === 0) continue;

      return {
        title: data.title,
        extract: data.extract,
        imageUrl: data.originalimage?.source || data.thumbnail?.source || null,
        pageUrl:
          data.content_urls?.desktop?.page ||
          `https://tr.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      };
    } catch {
      // Continue to next candidate
    }
  }

  return null;
}

