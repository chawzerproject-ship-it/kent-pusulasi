import { Activity, AlertCircle, Info, ShieldAlert } from "lucide-react";
import type { EarthquakeEvent } from "@/lib/earthquakes";

export function DistrictEarthquakes({
  earthquakes,
  districtName,
  provinceName,
}: {
  earthquakes: EarthquakeEvent[];
  districtName: string;
  provinceName: string;
}) {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-950">
          Afet & Çevresel Sismik Hareketlilik
        </h2>
        <span className="text-xs text-slate-400">
          Kaynak: EMSC-CSEM Açık Sismoloji Servisi
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-navy-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <p>
            {districtName} ({provinceName}) ve yaklaşık 120 km çevresinde son günlerde
            kaydedilen doğal sismik hareketler aşağıda listelenmiştir. Türkiye aktif fay hatları
            üzerinde yer aldığından küçük ölçekli (mikro) depremler olağandır.
          </p>
        </div>

        {earthquakes.length > 0 ? (
          <div className="divide-y divide-border-subtle">
            {earthquakes.map((item) => {
              const magClass =
                item.magnitude < 2.5
                  ? "bg-slate-100 text-slate-700"
                  : item.magnitude < 4.0
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800 font-bold";

              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-1 last:pb-1 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-8 w-12 items-center justify-center rounded-lg text-xs font-bold ${magClass}`}
                    >
                      M {item.magnitude}
                    </span>
                    <div>
                      <p className="font-semibold text-navy-950">{item.region}</p>
                      <p className="text-xs text-slate-500">
                        Derinlik: {item.depth} km
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {item.formattedTime}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span>Yakın çevrede son dönemde kayda değer bir sismik hareketlilik bildirilmedi.</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[11px] text-slate-400">
          <span>* Veriler uluslararası sismoloji ağı (EMSC) üzerinden otomatik alınmaktadır.</span>
          <span className="font-medium text-navy-800">Afete Hazır Şehirler</span>
        </div>
      </div>
    </div>
  );
}

