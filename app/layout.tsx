import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KentPusula — Belediyeler için veriye dayalı kıyaslama platformu",
  description:
    "KentPusula, benzer ölçekteki belediyeleri adil biçimde kıyaslayan, iyi uygulamaların şehirler arasında taşınmasını kolaylaştıran ve vatandaş önerilerini uygulanabilir hale getiren veri platformudur.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
