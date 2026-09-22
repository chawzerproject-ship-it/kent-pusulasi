# KentPusula — Yapılacaklar / Varsayımlar

Bu proje, sunumun 17 slaydındaki içerik ve mesajlara dayanan bir **tanıtım
sitesi + ürün demosu**dur.

## Gerçek veri katmanı (API entegrasyonu)

Nüfus, yüzölçümü, il/ilçe ve büyükşehir bilgisi artık **gerçek, canlı bir
API'den** geliyor — mock/statik değil:

- **[TurkiyeAPI](https://turkiyeapi.dev)** (`lib/turkiye-api.ts`): ücretsiz,
  açık, no-auth REST API. Türkiye'deki **81 ilin 973 ilçesinin tamamı**
  buradan çekilir (`/v2/provinces`, `/v2/districts`).
- `lib/municipalities.ts`, bu canlı veriyi `data/pilot-data.json` içindeki
  pilot faaliyet verisiyle birleştirir (`getAllMunicipalities`,
  `getPeers`, `getPilotMunicipalities`).
- Next.js `fetch(..., { next: { revalidate: 86400 } })` ile önbelleklenir
  (günde bir yenilenir) — build/deploy sırasında API rate limit'ine
  takılmadan çalışır.
- **`/karsilastir`** sayfası, bu 973 ilçenin **hepsi arasında** arama yapıp
  ikili karşılaştırma yapmayı sağlar (nüfus, yüzölçümü, bölge, büyükşehir
  durumu her zaman gösterilir).
- Ana sayfadaki "Benzer belediyeler" eşleştirmesi de artık **tüm Türkiye**
  genelinde, gerçek nüfus verisiyle hesaplanıyor (önceden yalnızca 3
  sabit Bursa ilçesiydi).

### Önemli bir düzeltme: ilçe `slug`'ları benzersiz değil

İlk entegrasyonda ilçeleri `slug` alanına göre eşleştirmiştim; bu yanlıştı —
Türkiye'de üç ayrı "Yenişehir" (Bursa, Diyarbakır, Mersin) ve 51 ayrı
"Merkez" ilçesi var. Slug'a göre eşleştirme, Bursa Yenişehir'in faaliyet
verisini yanlışlıkla Diyarbakır/Mersin Yenişehir'e de bağlıyordu. Bunu
tespit edip **numeric `id`** üzerinden eşleştirmeye geçtim (`districtId`
alanı `pilot-data.json`'da, URL parametreleri `/karsilastir?a=<id>&b=<id>`
formatında). `slug` artık yalnızca görüntüleme amaçlı kullanılıyor.

## İlçe profil sayfası (`/ilce/[id]`) — 973 ilçenin hepsi için

Her ilçenin **kendi analiz sayfası** var (ör. `/ilce/1725`), tamamı gerçek
veriyle:

- **Harita**: `lib/geocode.ts`, ilçe + il adını OpenStreetMap'in ücretsiz
  Nominatim adres çözümleme servisine sorup gerçek koordinat ve sınır
  kutusu (bounding box) alır; sonuç 30 gün önbelleklenir (Nominatim'in
  kullanım politikası — saniyede ~1 istek — sadece o an açılan tek ilçe
  için, talep anında çağrıldığından sorun yaratmaz). Nominatim eşleşme
  bulamazsa ilin gerçek merkez koordinatına düşer ve arayüzde
  "yaklaşık konum" etiketiyle belirtilir.
- **İstatistik kartları**: nüfus, yüzölçümü, yoğunluk (hesaplanmış),
  mahalle sayısı, köy sayısı — hepsi TurkiyeAPI'den.
- **Mahalle listesi**: `/v2/neighborhoods?districtId=` ile o ilçenin
  gerçek mahalle adları ve nüfusları (nüfusa göre azalan sırada).
- **4 karşılaştırma grafiği** (Recharts): nüfus (ilçe/il ortalaması/
  Türkiye ortalaması), yoğunluk, mahalle-köy dağılımı, emsal belediyelerle
  nüfus kıyası — hepsi `getNationalAverages`/`getProvinceAverages`
  (`lib/municipalities.ts`) ile 973 ilçenin gerçek verisinden hesaplanır.
- Faaliyet/performans bölümü, pilot verisi olan 5 ilçe için gerçek bütçe/
  hedef/iyi uygulama gösterir; diğerlerinde dürüst "veri henüz eklenmedi"
  notu ve "pilot öner" CTA'sı çıkar.
- Bu sayfaya ana sayfadaki ürün demosu kartından, `/karsilastir`'daki
  seçili belediye kartından ve her ilçenin kendi "benzer belediyeler"
  listesinden ulaşılabilir.

## Gerçek olmayan / pilot veri sınırı (bilinçli, şeffaf)

Bütçe, kişi başı gider, hedef/gerçekleşen ve iyi uygulama verileri için
**açık bir API yok** — belediyeler bu verileri yalnızca PDF faaliyet raporu
olarak yayımlıyor. Bu yüzden:

- Bu veriler yalnızca **5 pilot ilçe** için mevcut: Yenişehir, İznik,
  Kestel, Orhangazi, Karacabey (`data/pilot-data.json`, `districtId` ile
  gerçek TurkiyeAPI ilçesine bağlı).
- Diğer 968 ilçe için `/karsilastir` ve profil ekranı yalnızca nüfus/alan
  verisini gösterir; bütçe alanında dürüstçe **"faaliyet raporu verisi
  henüz eklenmedi"** notu çıkar — hiçbir yerde uydurma rakam yok.
- Bu sınırı hem `/metodoloji` sayfasında hem `/kaynaklar` sayfasında açıkça
  belirttim.

## Sonraki aşamaya bırakılanlar

- **Kimlik doğrulama**: Vatandaş girişi, e-Devlet entegrasyonu ve
  "Katılım güven modeli" bölümünde anlatılan doğrulama aşamaları henüz
  uygulanmadı — bu bölüm şu an yalnızca tasarım konseptini anlatıyor.
- **Admin panel**: Belediyenin kendi faaliyet verisini (bütçe, hedef,
  iyi uygulama) girebileceği bir panel yok; `pilot-data.json` elle
  düzenleniyor. Üretimde bu bir CMS/veritabanına taşınmalı.
- **İletişim formu backend'i**: `/pilot` sayfasındaki ve ana sayfa
  kapanışındaki pilot başvuru formu yalnızca istemci tarafında başarı
  durumu gösteriyor; gerçek bir e-posta servisine/API route'a bağlanmadı.
- **Zaman serisi grafikleri**: TurkiyeAPI tek bir yıl kesiti (2025) veriyor;
  yıllar arası nüfus değişimi gibi trend grafikleri için TÜİK'in tarihsel
  verisine ayrıca entegre olmak gerekir — şu an yalnızca "an itibarıyla"
  karşılaştırmalar var.

## Teknik notlar

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4.
- shadcn/ui tarzı bileşenler (`components/ui/`) Radix primitives üzerine
  elle kuruldu.
- `npm run build` ve `npm run lint` hatasız geçiyor.
- `npm run dev` ile `npm run build`'u **aynı anda aynı klasörde çalıştırma**
  — ikisi `.next` klasörünü paylaştığı için dev sunucusunu geçici olarak
  kilitleyebiliyor; build bittikten sonra dev sunucusunu yeniden başlatın.

## Çalıştırma

```bash
npm install
npm run dev
```
