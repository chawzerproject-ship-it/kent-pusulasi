import { AlertTriangle } from "lucide-react";
import type { DistrictLocation } from "@/lib/geocode";

export function DistrictMap({
  districtName,
  location,
}: {
  districtName: string;
  location: DistrictLocation;
}) {
  const { latitude, longitude, boundingBox, precise } = location;

  const [south, north, west, east] = boundingBox ?? [
    latitude - 0.15,
    latitude + 0.15,
    longitude - 0.2,
    longitude + 0.2,
  ];

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${west},${south},${east},${north}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white">
      <iframe
        title={`${districtName} haritası`}
        src={src}
        className="h-80 w-full border-0"
        loading="lazy"
      />
      <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-2.5 text-xs text-slate-500">
        <span>Kaynak: OpenStreetMap katkıda bulunanları</span>
        {!precise && (
          <span className="flex items-center gap-1.5 text-orange-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            Yaklaşık konum (il merkezi)
          </span>
        )}
      </div>
    </div>
  );
}
