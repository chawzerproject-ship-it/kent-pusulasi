import Link from "next/link";
import { Compass, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-navy-950 text-navy-100">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Compass className="h-4 w-4" />
            </span>
            KentPusula
          </div>
          <p className="mt-3 max-w-sm text-sm text-navy-100/70">
            Belediyeler birbirinden öğrenirse şehirler hızlanır. Veriye
            dayalı belediye karşılaştırma ve vatandaş katılım platformu.
          </p>
          <a
            href="mailto:iletisim@kentpusula.example"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white hover:underline"
          >
            <Mail className="h-4 w-4" />
            iletisim@kentpusula.example
          </a>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-navy-100/70">
            <li>
              <Link href="/#kiyaslama" className="hover:text-white">
                Kıyaslama kriterleri
              </Link>
            </li>
            <li>
              <Link href="/#demo" className="hover:text-white">
                Ürün demosu
              </Link>
            </li>
            <li>
              <Link href="/karsilastir" className="hover:text-white">
                Tüm Türkiye&apos;de karşılaştır
              </Link>
            </li>
            <li>
              <Link href="/#katilim" className="hover:text-white">
                Katılım güven modeli
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Şeffaflık</h4>
          <ul className="mt-3 space-y-2 text-sm text-navy-100/70">
            <li>
              <Link href="/metodoloji" className="hover:text-white">
                Kaynaklar ve yöntem
              </Link>
            </li>
            <li>
              <Link href="/kaynaklar" className="hover:text-white">
                Kaynak listesi
              </Link>
            </li>
            <li>
              <Link href="/pilot" className="hover:text-white">
                Pilot başvurusu
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-navy-100/50">
        © 2026 KentPusula • Belediyeler için ortak gelişim zemini
      </div>
    </footer>
  );
}
