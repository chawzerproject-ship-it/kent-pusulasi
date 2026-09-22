import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/90 backdrop-blur">
      <div className="section-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-white">
            <Compass className="h-4 w-4" />
          </span>
          KentPusula
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#kesfet" className="hover:text-navy-900">
            Keşfet
          </Link>
          <Link href="/#kiyaslama" className="hover:text-navy-900">
            Kıyaslama
          </Link>
          <Link href="/karsilastir" className="hover:text-navy-900">
            Karşılaştır
          </Link>
          <Link href="/metodoloji" className="hover:text-navy-900">
            Metodoloji
          </Link>
          <Link href="/kaynaklar" className="hover:text-navy-900">
            Kaynaklar
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/#kesfet">Belediyeni Keşfet</Link>
          </Button>
          <Button asChild variant="accent" size="sm">
            <Link href="/pilot">Pilot Talebi</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
