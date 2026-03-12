import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Link from "next/link";

const sections = [
  { href: "/makeup/undertone", icon: "🎨", title: "Alt Ton Analizi", desc: "Sıcak, soğuk veya nötr tonunu öğren" },
  { href: "/makeup/solutions", icon: "✨", title: "Sorunlara Çözümler", desc: "Göz altı, akne, gözenek ve daha fazlası" },
  { href: "/makeup/youtube", icon: "📺", title: "YouTube Önerileri", desc: "En iyi makyaj kanalları ve videolar" },
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
          {sections.map((s) => (
            <Link key={s.href} href={s.href}>
              <Card hoverable className="flex items-center gap-4 mb-3">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-muted">{s.desc}</p>
                </div>
                <span className="ml-auto text-muted">→</span>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
