import {
  Cloud,
  Droplets,
  Gauge,
  Sun,
  Wind,
  Wind as WindIcon,
} from "lucide-react";
import type { DistrictEnvironmentData } from "@/lib/environment";

export function DistrictEnvironment({
  data,
  districtName,
}: {
  data: DistrictEnvironmentData;
  districtName: string;
}) {
  const { airQuality, weather } = data;

  if (!airQuality && !weather) return null;

  const aqiColorClass =
    airQuality?.category.level === "good"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : airQuality?.category.level === "fair"
      ? "bg-teal-50 text-teal-700 border-teal-200"
      : airQuality?.category.level === "moderate"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  const aqiBadgeClass =
    airQuality?.category.level === "good"
      ? "bg-emerald-600 text-white"
      : airQuality?.category.level === "fair"
      ? "bg-teal-600 text-white"
      : airQuality?.category.level === "moderate"
      ? "bg-amber-500 text-white"
      : "bg-rose-600 text-white";

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-950">
          Çevre, Hava Kalitesi ve İklim
        </h2>
        <span className="text-xs text-slate-400">
          Kaynak: Open-Meteo API (Canlı)
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Hava Kalitesi Kartı */}
        {airQuality && (
          <div className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Gauge className="h-4 w-4 text-navy-700" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Hava Kalitesi İndeksi (AQI)
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${aqiBadgeClass}`}
                >
                  AQI: {airQuality.aqi}
                </span>
              </div>

              <div className={`mt-3 rounded-xl border p-3 ${aqiColorClass}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    {airQuality.category.label}
                  </span>
                  <span className="text-xs font-medium">Avrupa Standardı</span>
                </div>
                <p className="mt-1 text-xs opacity-90">
                  {airQuality.category.description}
                </p>
              </div>

              {/* PM2.5 ve PM10 göstergeleri */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border-subtle bg-navy-50/50 p-3">
                  <span className="text-slate-500">PM2.5 İnce Toz</span>
                  <p className="mt-1 text-base font-bold text-navy-950">
                    {airQuality.pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Akciğere ulaşan partiküller</p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-navy-50/50 p-3">
                  <span className="text-slate-500">PM10 Kaba Toz</span>
                  <p className="mt-1 text-base font-bold text-navy-950">
                    {airQuality.pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Toz, polen ve yol kirliliği</p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-400">
              * Düşük AQI değeri temiz havayı, yüksek değer ise artan kirliliği gösterir.
            </p>
          </div>
        )}

        {/* Canlı Hava Durumu Kartı */}
        {weather && (
          <div className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Sun className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Anlık Hava Durumu
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {districtName}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-900">
                  <Cloud className="h-8 w-8 text-navy-700" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-navy-950">
                    {weather.temperature}°C
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    {weather.weatherDescription}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-navy-50/50 p-3">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="text-slate-500">Bağıl Nem</span>
                    <p className="text-sm font-bold text-navy-950">%{weather.humidity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-navy-50/50 p-3">
                  <WindIcon className="h-4 w-4 text-teal-600" />
                  <div>
                    <span className="text-slate-500">Rüzgar Hızı</span>
                    <p className="text-sm font-bold text-navy-950">{weather.windSpeed} km/s</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-400">
              * İlçe koordinatlarına göre Open-Meteo meteoroloji istasyonlarından anlık alınır.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

