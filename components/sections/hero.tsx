import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-navy-600 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-orange-500 blur-3xl" />
      </div>
      <div className="section-shell relative py-24 sm:py-28">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-navy-100">
            <Compass className="h-3.5 w-3.5" />
            81 il • 973 ilçe • canlı veri
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            KENTPUSULA
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-xl font-semibold text-navy-100 sm:text-2xl">
            Belediyeler birbirinden öğrenirse şehirler hızlanır.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 max-w-xl text-base text-navy-100/70 sm:text-lg">
            Veriye dayalı belediye karşılaştırma ve vatandaş katılım
            platformu — kıyaslamayı açıklanabilir kılar, belediyelere karar
            desteği sağlar.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="#kesfet">
                Belediyeni Keşfet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/pilot">Pilot Talebi</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
