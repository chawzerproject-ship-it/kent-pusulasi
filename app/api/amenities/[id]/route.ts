import { NextResponse } from "next/server";
import { getAllMunicipalities } from "@/lib/municipalities";
import { getProvinces } from "@/lib/turkiye-api";
import { getDistrictLocation, resolveBoundingBox } from "@/lib/geocode";

/**
 * Resolves a district's real bounding box server-side (Nominatim geocoding
 * — cached, and fine to run server-side). Deliberately does NOT call
 * Overpass here: that call is made client-side instead (see
 * `components/explore-widget.tsx` / `components/district-infrastructure.tsx`)
 * because Overpass's public instances are reachable from an end user's
 * browser even on networks where this app's own Node server can't reach
 * them — a common asymmetry where outbound firewall/AV rules trust browsers
 * but not background processes.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const districtId = Number(id);
  if (!Number.isFinite(districtId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const all = await getAllMunicipalities();
  const municipality = all.find((m) => m.id === districtId);
  if (!municipality) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const provinces = await getProvinces();
  const province = provinces.find((p) => p.id === municipality.provinceId);
  const location = await getDistrictLocation(
    municipality.name,
    municipality.province,
    province?.coordinates ?? { latitude: 39, longitude: 35 }
  );
  const bbox = resolveBoundingBox(location);

  return NextResponse.json({ bbox, precise: location.precise });
}
