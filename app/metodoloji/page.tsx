import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Metodoloji — KentPusula",
  description:
    "KentPusula'nın kıyaslama kriterleri, veri kaynakları ve güncelleme sıklığı.",
};

const criteria = [
  {
    title: "Belediye türü",
    description:
      "Büyükşehir, il, ilçe ve belde belediyeleri farklı mevzuat ve kaynak yapılarına sahiptir; kıyaslama yalnızca aynı tür içinde yapılır.",
  },
  {
    title: "Ölçek",
    description:
      "Nüfus, yüzölçümü ve bütçe büyüklüğü birlikte değerlendirilir; tek bir ölçek göstergesi yeterli kabul edilmez.",
  },
  {
    title: "Yerel yapı",
    description:
      "Tarım, sanayi ve turizm ağırlıklı ekonomik yapı, hizmet önceliklerini doğrudan etkilediği için kıyasa dahil edilir.",
  },
  {
    title: "Hizmet yükü",
    description:
      "Mahalle sayısı ve mevsimsel nüfus artışı gibi etkenler, aynı nüfusa sahip belediyeler arasında bile farklı yük yaratabilir.",
  },
  {
    title: "Mali kapasite",
    description:
      "Gelir yapısı ve kişi başı kaynak, harcama kapasitesinin adil okunabilmesi için gereklidir.",
  },
  {
    title: "Veri güveni",
    description:
      "Her verinin kaynağı, yılı ve doğrulama durumu ayrı ayrı etiketlenir; doğrulanmamış veri karşılaştırmaya dahil edilmez.",
  },
];

const dataSources = [
  {
    title: "Belediye faaliyet raporları",
    description:
      "Her belediyenin kendi yayımladığı yıllık faaliyet raporu, birincil veri kaynağıdır.",
    frequency: "Yıllık",
  },
  {
    title: "TurkiyeAPI (turkiyeapi.dev)",
    description:
      "81 il ve 973 ilçenin nüfus, yüzölçümü, bölge ve büyükşehir durumu bilgileri bu açık API'den canlı olarak çekilir — kıyaslama ve emsal eşleşmesi bu veriye dayanır.",
    frequency: "Canlı (API üzerinden anlık)",
  },
  {
    title: "OpenStreetMap / Nominatim",
    description:
      "İlçe profil sayfalarındaki harita ve konum verisi, açık kaynaklı OpenStreetMap projesinden ve onun Nominatim adres çözümleme servisinden gelir.",
    frequency: "Talep anında (30 gün önbelleklenir)",
  },
  {
    title: "Kurum onaylı ek veriler",
    description:
      "Belediyenin doğrudan paylaştığı ek bütçe, proje ve performans verileri.",
    frequency: "Belediye bildirimine bağlı",
  },
];

export default function MetodolojiPage() {
  return (
    <div className="section-shell py-20">
      <SectionHeading
        eyebrow="Metodoloji"
        title="Kıyaslama kriterleri, veri kaynakları ve güncelleme sıklığı"
        description="KentPusula'nın her karşılaştırması aynı yöntemle üretilir. Bu sayfa, o yöntemi ve dayandığı kaynakları açık şekilde paylaşır."
      />

      <Reveal>
        <h2 className="mb-4 text-lg font-semibold text-navy-950">
          Adil kıyas kriterleri
        </h2>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {criteria.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05}>
            <Card>
              <CardTitle className="text-base">{c.title}</CardTitle>
              <CardContent className="mt-2">{c.description}</CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h2 className="mb-4 mt-14 text-lg font-semibold text-navy-950">
          Veri kaynakları ve güncelleme sıklığı
        </h2>
      </Reveal>
      <div className="overflow-hidden rounded-2xl border border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Kaynak</th>
              <th className="px-5 py-3 font-semibold">Açıklama</th>
              <th className="px-5 py-3 font-semibold">Güncelleme sıklığı</th>
            </tr>
          </thead>
          <tbody>
            {dataSources.map((source) => (
              <tr key={source.title} className="border-t border-border-subtle">
                <td className="px-5 py-4 font-medium text-navy-950">
                  {source.title}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {source.description}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {source.frequency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Reveal>
        <p className="mt-8 max-w-2xl text-sm font-medium text-slate-600">
          Sonuç: tek bir &ldquo;başarı puanı&rdquo; yerine kategori bazında,
          açıklanabilir göstergeler. KentPusula belediyeleri yarıştırmaz;
          benzer şartlarda neyin mümkün olduğunu görünür kılar.
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-10 rounded-2xl border border-navy-100 bg-navy-50 p-6">
          <h2 className="text-sm font-semibold text-navy-950">
            Hangi veri gerçek, hangisi pilot verisi?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            <strong className="text-navy-900">Nüfus, yüzölçümü, il/ilçe ve
            büyükşehir bilgisi</strong> Türkiye&apos;deki 973 ilçenin tamamı
            için TurkiyeAPI&apos;den canlı çekilir ve gerçektir.{" "}
            <strong className="text-navy-900">
              Bütçe, kişi başı gider, hedef/gerçekleşen ve iyi uygulama
              verileri
            </strong>{" "}
            ise yalnızca faaliyet raporu paylaşılmış pilot belediyeler için
            mevcuttur; henüz onaylanmamış hiçbir belediye için bu veriler
            uydurulmaz — bunun yerine arayüzde açıkça
            &ldquo;veri henüz eklenmedi&rdquo; notu gösterilir.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
