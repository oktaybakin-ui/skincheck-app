import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Palette, Sparkles, Youtube, ChevronRight, LucideIcon, Scissors, Crown, Camera } from "lucide-react";

const sections: { href: string; icon: LucideIcon; title: string; desc: string }[] = [
  { href: "/makeup/undertone", icon: Palette, title: "Alt Ton Analizi", desc: "Sıcak, soğuk veya nötr tonunu öğren" },
  { href: "/makeup/solutions", icon: Sparkles, title: "Sorunlara Çözümler", desc: "Göz altı, akne, gözenek ve daha fazlası" },
  { href: "/makeup/youtube", icon: Youtube, title: "YouTube Önerileri", desc: "En iyi makyaj kanalları ve videolar" },
  { href: "/hair", icon: Scissors, title: "Saç Bakım Rehberi", desc: "Saç tipine özel bakım önerileri" },
  { href: "/best-look", icon: Crown, title: "En İyi Halin", desc: "Kişiselleştirilmiş güzellik rehberi" },
  { href: "/routine-builder", icon: Camera, title: "AI Rutin Oluşturucu", desc: "Ürünlerini fotoğrafla, AI rutin oluştursun" },
];

export default function MakeupPage() {
  return (
    <>
      <Header title="Makyaj" />
      <main className="px-4 py-4 space-y-4">
        <div className="bg-gradient-to-br from-secondary to-primary rounded-3xl p-6 text-white">
          <h2 className="text-xl font-bold mb-1">Makyaj Rehberin</h2>
          <p className="text-white/80 text-sm">Alt tonunu keşfet, sana yakışan renkleri bul</p>
        </div>

        <div className="space-y-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.href} href={s.href}>
                <Card hoverable className="flex items-center gap-4 mb-3">
                  <Icon size={28} className="text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-muted">{s.desc}</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-muted" />
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
