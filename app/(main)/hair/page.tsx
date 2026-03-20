"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useState } from "react";
import PinterestButton from "@/components/ui/PinterestButton";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Scissors, Droplets, Wind, Sparkles, AlertTriangle, Leaf, Clock, Calendar, Beaker, ShoppingBag, Star, Minus, Waves, RotateCcw, Fingerprint, ExternalLink, Flower, Zap, Sun, Snowflake, CloudRain, TrendingUp, type LucideIcon } from "lucide-react";

type HairType = "straight" | "wavy" | "curly" | "coily";
type HairIssue = "dry" | "oily" | "dandruff" | "loss" | "colored" | "damaged" | "frizzy" | "slow_growth" | "itchy" | "thinning";

const HAIR_TYPE_ICONS: Record<string, LucideIcon> = {
  straight: Minus,
  wavy: Waves,
  curly: RotateCcw,
  coily: Fingerprint,
};

const HAIR_TYPES: { key: HairType; label: string; desc: string; porosity: string }[] = [
  { key: "straight", label: "Düz (Tip 1)", desc: "Kaymak gibi düz, parlak saçlar", porosity: "Genellikle düşük gözenekli" },
  { key: "wavy", label: "Dalgalı (Tip 2)", desc: "Hafif S dalgaları, hacimli", porosity: "Düşük-orta gözenekli" },
  { key: "curly", label: "Kıvırcık (Tip 3)", desc: "Belirgin spiral bukleler", porosity: "Orta-yüksek gözenekli" },
  { key: "coily", label: "Çok Kıvırcık (Tip 4)", desc: "Sıkı Z-pattern bukleler", porosity: "Yüksek gözenekli" },
];

const HAIR_ISSUES: { key: HairIssue; label: string; desc: string; icon: typeof Droplets }[] = [
  { key: "dry", label: "Kuru & Mat", desc: "Nem kaybı, kırılganlık", icon: Droplets },
  { key: "oily", label: "Yağlı", desc: "Hızlı yağlanma, ağırlaşma", icon: Wind },
  { key: "dandruff", label: "Kepek", desc: "Pullanma, kaşıntı", icon: Sparkles },
  { key: "loss", label: "Dökülme", desc: "İncelme, seyrelme", icon: AlertTriangle },
  { key: "colored", label: "Boyalı", desc: "Renk solması, yıpranma", icon: Scissors },
  { key: "damaged", label: "Yıpranmış", desc: "Kırık uçlar, elastikiyet kaybı", icon: Leaf },
  { key: "frizzy", label: "Kabarık & Elektrikli", desc: "Kontrol edilemeyen kabarma", icon: Zap },
  { key: "slow_growth", label: "Yavaş Uzama", desc: "Uzamıyor, kırılıyor", icon: TrendingUp },
  { key: "itchy", label: "Kaşıntılı Deri", desc: "Saç derisi tahrişi", icon: Flower },
  { key: "thinning", label: "İncelme & Seyrelme", desc: "Hacim kaybı, ince teller", icon: Wind },
];

interface BrandProduct {
  brand: string;
  product: string;
  detail: string;
  priceRange: string;
}

interface HairAdvice {
  routine: {
    morning: { step: string; detail: string; duration: string }[];
    weekly: { step: string; detail: string; frequency: string }[];
  };
  products: BrandProduct[];
  tips: string[];
  avoid: string[];
  ingredients: { name: string; benefit: string }[];
  salonTreatments: { name: string; desc: string; frequency: string }[];
  seasonal: { season: string; tip: string }[];
  diyMasks: { name: string; recipe: string; duration: string }[];
}

function getAdvice(type: HairType, issue: HairIssue): HairAdvice {
  // Base routines per hair type
  const baseRoutines: Record<HairType, { morning: { step: string; detail: string; duration: string }[]; weekly: { step: string; detail: string; frequency: string }[] }> = {
    straight: {
      morning: [
        { step: "Hacim spreyi uygula", detail: "Nemli saç köklerine hacim spreyi sık, başını aşağı eğerek fönle", duration: "3 dk" },
        { step: "Isı koruyucu", detail: "Düzleştirici veya fön öncesi mutlaka ısı koruyucu uygula (200°C altı)", duration: "1 dk" },
        { step: "Hafif serum", detail: "Sadece uçlara 1-2 damla argan veya jojoba yağı bazlı serum", duration: "1 dk" },
      ],
      weekly: [
        { step: "Derin temizlik şampuanı", detail: "Haftada 1 clarifying şampuan ile ürün birikimini temizle", frequency: "Haftada 1" },
        { step: "Hafif saç maskesi", detail: "Ağır olmayan, protein bazlı maske uygula, 10 dk beklet", frequency: "Haftada 1" },
        { step: "Soğuk su durulama", detail: "Son durulama soğuk su ile, kutikula kapanır ve parlak görünüm sağlar", frequency: "Her yıkamada" },
      ],
    },
    wavy: {
      morning: [
        { step: "Refresher spreyi", detail: "Sabah dalgaları canlandırmak için su + leave-in karışımı sık", duration: "2 dk" },
        { step: "Curl cream sıkıştır", detail: "Islak saça curl cream uygula, scrunch (sıkıştırma) tekniği ile", duration: "3 dk" },
        { step: "Difüzörle kurut", detail: "Düşük ısı, orta hava ile difüzör kullan. Saçı sıkıştırarak kurut", duration: "10 dk" },
      ],
      weekly: [
        { step: "Sülfatsız şampuan", detail: "Co-wash arası şampuanla, dalgaları bozmadan temizle", frequency: "Haftada 2-3" },
        { step: "Deep conditioning", detail: "Nem maskesi uygula, sıcak havlu ile sar, 20 dk beklet", frequency: "Haftada 1" },
        { step: "Protein dengesi", detail: "Ayda 1 protein tedavisi, dalgaların elastikiyetini koru", frequency: "Ayda 1" },
      ],
    },
    curly: {
      morning: [
        { step: "LOC yöntemi", detail: "Leave-in (sıvı) → Oil (yağ) → Cream sırası ile katmanla", duration: "5 dk" },
        { step: "Gel cast oluştur", detail: "Curl gel ile bukleleri tanımla, hava kurusun veya difüzör kullan", duration: "5 dk" },
        { step: "Cast kır", detail: "Tamamen kuruduktan sonra sıkıştır (scrunch out the crunch)", duration: "2 dk" },
      ],
      weekly: [
        { step: "Co-wash", detail: "Şampuan yerine saç kremi ile yıka, kökleri parmak uçlarıyla masaj yap", frequency: "Haftada 2-3" },
        { step: "Şampuan günü", detail: "Haftada 1 sülfatsız şampuan, saç derisine odaklan", frequency: "Haftada 1" },
        { step: "Deep condition", detail: "Derin nemlendirici maske + plastik bone + 30 dk bekleme", frequency: "Haftada 1" },
      ],
    },
    coily: {
      morning: [
        { step: "Su bazlı nemlendirme", detail: "Sprey şişe ile su + aloe vera karışımı sık", duration: "2 dk" },
        { step: "Butter seal", detail: "Shea butter veya mango butter ile nemi kilitle", duration: "3 dk" },
        { step: "Protective styling", detail: "Twist-out, braid-out veya wash-and-go ile şekillendir", duration: "10-20 dk" },
      ],
      weekly: [
        { step: "Pre-poo yağlama", detail: "Yıkama öncesi hindistancevizi/zeytinyağı ile gece boyunca besle", frequency: "Yıkama öncesi" },
        { step: "Nazik şampuan", detail: "Sülfatsız, nemlendirici şampuan ile kökleri temizle", frequency: "Haftada 1" },
        { step: "Derin bakım", detail: "Shea + bal + zeytinyağı maske, plastik bone ile 45 dk", frequency: "Haftada 1" },
      ],
    },
  };

  // Brand products per hair type
  const baseProducts: Record<HairType, BrandProduct[]> = {
    straight: [
      { brand: "Moroccanoil", product: "Volumizing Mousse", detail: "Hafif hacim köpüğü, argan yağlı", priceRange: "₺800-1000" },
      { brand: "Kérastase", product: "Discipline Fluidissime", detail: "Anti-frizz termal koruma spreyi", priceRange: "₺900-1200" },
      { brand: "L'Oréal Pro", product: "Volumetry Şampuan", detail: "İnce telli saçlar için hacim şampuanı", priceRange: "₺400-550" },
      { brand: "Elseve", product: "Dream Long Serum", detail: "Uçlara parlaklık ve düzgünlük veren serum", priceRange: "₺150-200" },
      { brand: "TRESemmé", product: "Keratin Smooth Şampuan", detail: "Frizz kontrolü + parlak düz görünüm", priceRange: "₺120-160" },
    ],
    wavy: [
      { brand: "Cantu", product: "Moisturizing Curl Activator", detail: "Shea butter ile dalga tanımlayıcı krem", priceRange: "₺250-350" },
      { brand: "Shea Moisture", product: "Coconut & Hibiscus Curl Milk", detail: "Hindistancevizi bazlı dalga kremi", priceRange: "₺350-450" },
      { brand: "Moroccanoil", product: "Curl Defining Cream", detail: "Argan yağlı dalga tanımlayıcı", priceRange: "₺700-900" },
      { brand: "Garnier", product: "Fructis Curl Nourish", detail: "Hindistancevizi + gliserin formül", priceRange: "₺100-150" },
      { brand: "Schwarzkopf", product: "Mad About Curls Şampuan", detail: "Sülfatsız dalga şampuanı", priceRange: "₺250-350" },
    ],
    curly: [
      { brand: "DevaCurl", product: "No-Poo Original", detail: "Sülfatsız co-wash temizleyici", priceRange: "₺600-800" },
      { brand: "Cantu", product: "Coconut Curling Cream", detail: "Bukle tanımlayıcı, ağır nemlendirici", priceRange: "₺200-300" },
      { brand: "Shea Moisture", product: "Jamaican Black Castor Oil Masque", detail: "Derin onarım maskesi", priceRange: "₺400-500" },
      { brand: "Eco Styler", product: "Olive Oil Gel", detail: "Güçlü tutuş, bukle tanımlama jeli", priceRange: "₺100-150" },
      { brand: "As I Am", product: "Leave-In Conditioner", detail: "Durulanmayan bukle bakım kremi", priceRange: "₺300-400" },
    ],
    coily: [
      { brand: "Shea Moisture", product: "Raw Shea Butter Deep Moisturizer", detail: "Ekstra nemlendirici derin bakım", priceRange: "₺450-550" },
      { brand: "Cantu", product: "Shea Butter Leave-In Repair Cream", detail: "Onarıcı durulanmayan krem", priceRange: "₺200-300" },
      { brand: "Mielle Organics", product: "Pomegranate & Honey Curl Smoothie", detail: "Hafif tanımlayıcı krem", priceRange: "₺350-450" },
      { brand: "As I Am", product: "DoubleButter Cream", detail: "Çift butter formüllü nemlendirici", priceRange: "₺350-450" },
      { brand: "African Pride", product: "Moisture Miracle Masque", detail: "Hindistancevizi + bal derin bakım", priceRange: "₺200-300" },
    ],
  };

  // Issue-specific data
  const issueData: Record<HairIssue, {
    tips: string[];
    avoid: string[];
    ingredients: { name: string; benefit: string }[];
    salonTreatments: { name: string; desc: string; frequency: string }[];
    seasonal: { season: string; tip: string }[];
    diyMasks: { name: string; recipe: string; duration: string }[];
  }> = {
    dry: {
      tips: [
        "Saçını haftada 2-3'ten fazla yıkama — doğal yağlar en iyi nemlendirici",
        "Pamuklu havlu yerine mikrofiber havlu veya eski tişört kullan",
        "Uyumadan önce saten yastık kılıfı kullan — sürtünme nemini çalar",
        "Günde en az 2 litre su iç — nem içeriden başlar",
        "Saç kurutma makinesi kullanıyorsan soğuk ayarda bitir",
        "Yüzme sonrası mutlaka durula ve krem uygula",
      ],
      avoid: ["Sülfatlı şampuanlar (SLS, SLES)", "Alkol bazlı stylinglar (SD Alcohol, Denatured Alcohol)", "230°C üzeri ısı", "Günlük yıkama", "Klor ve tuzlu su (korumasız)", "Sert plastik taraklar"],
      ingredients: [
        { name: "Hyaluronik Asit", benefit: "Moleküler nem çekici, saç lifine nem bağlar" },
        { name: "Argan Yağı", benefit: "E vitamini + yağ asitleri, parlaklık ve yumuşaklık" },
        { name: "Shea Butter", benefit: "Ağır nemlendirici, kırılmayı önler" },
        { name: "Gliserin", benefit: "Havadan nem çeken humektant" },
        { name: "Panthenol (B5)", benefit: "Saç lifini kalınlaştırır, nemi korur" },
        { name: "Hindistancevizi Yağı", benefit: "Protein kaybını %39 azaltır (araştırma destekli)" },
      ],
      salonTreatments: [
        { name: "Keratin Bakımı", desc: "Keratin protein ile saç lifini doldurur, 3-6 ay etki", frequency: "4-6 ayda 1" },
        { name: "Olaplex Treatment", desc: "Kırık disülfid bağlarını onarır, derinlemesine yapısal onarım", frequency: "6-8 haftada 1" },
        { name: "Botox Saç Bakımı", desc: "Derin nemlendirme + anti-aging, saçı doldurur", frequency: "3-4 ayda 1" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Kış sonrası derin onarım maskesi serisi başlat (3 hafta üst üste)" },
        { season: "Yaz", tip: "UV koruyucu saç spreyi kullan, yüzme öncesi hindistancevizi yağı sür" },
        { season: "Sonbahar", tip: "Nem maskelerin sıklığını artır, kuru hava öncesi hazırlan" },
        { season: "Kış", tip: "Şapka altına saten astar tak, kapalı mekan kuru havasında leave-in kullan" },
      ],
      diyMasks: [
        { name: "Bal & Zeytinyağı Maskesi", recipe: "2 yk bal + 2 yk zeytinyağı + 1 yumurta sarısı karıştır, ılık saça uygula", duration: "30 dk" },
        { name: "Avokado Nem Bombası", recipe: "1 olgun avokado + 2 yk hindistancevizi yağı + 1 yk bal, pürüzsüz ezilene kadar karıştır", duration: "20 dk" },
        { name: "Yoğurt & Bal", recipe: "3 yk doğal yoğurt + 1 yk bal + 1 yk zeytinyağı", duration: "25 dk" },
      ],
    },
    oily: {
      tips: [
        "Şampuanı sadece saç derisine uygula, uçlara sürme — krem sadece uçlara",
        "Ilık su ile yıka, sıcak su yağ bezlerini daha fazla aktive eder",
        "Kuru şampuan acil çözüm: köklere sık, 2 dk bekle, masaj yap",
        "Saç derisini haftalık eksfoliye et — ölü deri ve yağ birikimi temizlenir",
        "Saçını çok sık elleme — ellerden yağ transferi olur",
        "Yastık kılıfını haftada 2 değiştir",
      ],
      avoid: ["Silikon bazlı ürünler (köklere)", "Ağır butter ve yağlar (köklere)", "Çok sıcak su ile yıkama", "Saç derisine krem/maske uygulama", "Günde 2+ kez yıkama (sebum üretimini artırır)", "Ağır leave-in ürünler"],
      ingredients: [
        { name: "Çay Ağacı Yağı", benefit: "Antibakteriyel, yağ dengesini düzenler" },
        { name: "Salisilik Asit", benefit: "BHA eksfoliyan, gözenekleri temizler" },
        { name: "Kaolin Kil", benefit: "Fazla yağı emer, saç derisini temizler" },
        { name: "Nane Yağı", benefit: "Serinletici, yağ üretimini düzenler" },
        { name: "Çinko Pyrithione", benefit: "Antifungal, dermatit ve kepek kontrolü" },
        { name: "Rozmarin Yağı", benefit: "Kan dolaşımını artırır, saç derisini dengelemye yardımcı" },
      ],
      salonTreatments: [
        { name: "Saç Derisi Detoksu", desc: "Profesyonel kil + enzim bazlı derin temizlik", frequency: "4-6 haftada 1" },
        { name: "Mikro-sirkülasyon Masajı", desc: "Saç derisi kan dolaşımını artırır, yağ bezlerini dengelemye yardımcı", frequency: "Ayda 1" },
        { name: "LED Terapi", desc: "Mavi LED ışık ile yağ bezlerini regüle etme", frequency: "Haftada 1 (kürleme)" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Hafif formüllere geç, kış ürünlerini rafa kaldır" },
        { season: "Yaz", tip: "Yağlanma artar — kuru şampuanı yanından ayırma, günlük yıkama gerekebilir" },
        { season: "Sonbahar", tip: "Dengeleyici şampuana geç, yaz boyunca biriken hasarı onar" },
        { season: "Kış", tip: "Yağlanma azalabilir — yıkama sıklığını azalt, saç derisini kurutma" },
      ],
      diyMasks: [
        { name: "Kil & Elma Sirkesi", recipe: "2 yk bentonit kil + 2 yk elma sirkesi + su ile macun kıvamı", duration: "15 dk (sadece deri)" },
        { name: "Limon & Aloe Vera", recipe: "2 yk aloe vera jeli + 1 yk limon suyu + 3 damla çay ağacı yağı", duration: "10 dk (sadece deri)" },
        { name: "Yeşil Çay Tonik", recipe: "Demlenen yeşil çay (soğuk) + 2 damla nane yağı, sprey şişeye koy", duration: "Durulanmaz, günlük" },
      ],
    },
    dandruff: {
      tips: [
        "Kepek şampuanını 3-5 dk saç derisinde beklet, hemen durulama",
        "Tırnaklarla değil, parmak uçlarıyla dairesel masaj yap",
        "Şampuanları dönüşümlü kullan — saç derisi tek ürüne alışmasın",
        "Stres kepek tetikler — meditasyon veya egzersiz yardımcı olabilir",
        "Saç derisini kuru bırakma ama fazla da nemlendirme — dengeyi koru",
        "Kepek kronikse mutlaka dermatolog'a danış",
      ],
      avoid: ["Çok sıcak su", "Parfümlü saç ürünleri", "Saç derisini ovalama/kazıma", "Silikon bazlı ürünler (birikim yapar)", "Alkol bazlı tonikler", "Şapka/bone ile terletme"],
      ingredients: [
        { name: "Zinc Pyrithione", benefit: "Anti-mantar, en yaygın kepek aktifi (Head & Shoulders)" },
        { name: "Ketokonazol", benefit: "Güçlü antifungal, Malassezia mantarını hedefler (Nizoral)" },
        { name: "Selenyum Sülfür", benefit: "Hücre yenilenmesini yavaşlatır, pullanmayı azaltır" },
        { name: "Salisilik Asit", benefit: "Kepek pulcuklarını yumuşatır ve dökülmesini sağlar" },
        { name: "Çay Ağacı Yağı", benefit: "Doğal antifungal ve antibakteriyel" },
        { name: "Piroctone Olamine", benefit: "Yeni nesil anti-kepek aktifi, nazik ve etkili" },
      ],
      salonTreatments: [
        { name: "Saç Derisi Peeling", desc: "Profesyonel eksfoliasyon ile ölü deri ve kepek temizliği", frequency: "2-4 haftada 1" },
        { name: "Ozon Terapi", desc: "Ozon ile saç derisini dezenfekte etme, mantarı azaltma", frequency: "Haftada 1 (6-8 seans)" },
        { name: "Mezoterapi", desc: "Saç derisine vitamin ve mineral enjeksiyonu", frequency: "2 haftada 1 (kürleme)" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Kış kepek artışı sonrası yoğun bakım kürü başlat" },
        { season: "Yaz", tip: "Terleme kepek artırabilir — yıkama sıklığını artır, hafif ürünler kullan" },
        { season: "Sonbahar", tip: "Kuru hava öncesi nemlendirici kepek şampuanına geç" },
        { season: "Kış", tip: "Kuru-soğuk hava en kötü dönem — kepek şampuanı + nemlendirici rutin birleştir" },
      ],
      diyMasks: [
        { name: "Elma Sirkesi Durulama", recipe: "1 bardak su + 2 yk elma sirkesi, son durulama olarak uygula (durulama)", duration: "2 dk bekle, durula" },
        { name: "Çay Ağacı Tonik", recipe: "100 ml su + 10 damla çay ağacı yağı, sprey şişede", duration: "Durulanmaz, günlük" },
        { name: "Aspirin Peeling", recipe: "3 aspirin ez + az su ile macun yap, saç derisine masaj yap", duration: "5 dk, sonra şampuanla" },
      ],
    },
    loss: {
      tips: [
        "Mutlaka dermatologa danış — altta yatan neden (tiroid, demir, stres) olabilir",
        "Biotin (5000 mcg/gün), Demir, Çinko, D vitamini takviyesi (doktor onayı ile)",
        "Saç derisine günde 5 dk parmak uçlarıyla masaj yap — kan dolaşımı artar",
        "Sıkı topuz, at kuyruğu, saç tokası kullanma — traction alopecia riski",
        "Protein açısından zengin beslen — yumurta, balık, kuruyemiş, baklagil",
        "Stres yönetimi çok önemli — kronik stres telogen effluvium tetikler",
      ],
      avoid: ["Sıkı saç modelleri (örgü, topuz, sıkı at kuyruğu)", "Kimyasal işlemler (düzleştirme, perma)", "Aşırı ısı uygulaması", "Sülfatlı şampuanlar", "Saçı ıslakken tarama (en kırılgan hali)", "Crash diyet ve ani kilo kayıpları"],
      ingredients: [
        { name: "Minoxidil %2-5", benefit: "FDA onaylı, saç çıkışını uyarır (reçeteli/reçetesiz)" },
        { name: "Biotin (B7)", benefit: "Keratin üretimini destekler, saç güçlendirir" },
        { name: "Kafein", benefit: "DHT'yi bloke eder, saç folikülünü uyarır" },
        { name: "Niasinamid (B3)", benefit: "Saç derisinde kan dolaşımını artırır" },
        { name: "Saw Palmetto", benefit: "Doğal DHT bloker, androjenik dökülmede yardımcı" },
        { name: "Rozmarin Yağı", benefit: "Araştırmalarda Minoxidil %2 kadar etkili bulunmuş" },
      ],
      salonTreatments: [
        { name: "PRP (Platelet Rich Plasma)", desc: "Kendi kanından zenginleştirilmiş plazma saç derisine enjeksiyon", frequency: "Ayda 1 (4-6 seans)" },
        { name: "Mezoterapi", desc: "Biotin, aminoasit, vitamin kokteyli enjeksiyonu", frequency: "2 haftada 1 (8-10 seans)" },
        { name: "Düşük Seviye Lazer Tedavisi", desc: "LLLT cihazı ile folikül uyarımı (evde de yapılabilir)", frequency: "Haftada 3 (6 ay)" },
        { name: "Saç Simülasyonu (SMP)", desc: "Mikro pigmentasyon ile dolgunluk görünümü", frequency: "Tek seferlik" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Kış dökülmesi azalır, yeni çıkış dönemi — destekle" },
        { season: "Yaz", tip: "UV saç derisine zarar verir — şapka tak, SPF saç spreyi kullan" },
        { season: "Sonbahar", tip: "Mevsimsel dökülme normal (günde 100-150 tel) — panik yapma" },
        { season: "Kış", tip: "D vitamini düşer — takviye al, saç derisini nemlendirmeyi ihmal etme" },
      ],
      diyMasks: [
        { name: "Rozmarin Yağı Masajı", recipe: "2 yk hindistancevizi yağı + 5 damla rozmarin yağı, saç derisine masaj", duration: "Gece boyu, sabah yıka" },
        { name: "Soğan Suyu Kürü", recipe: "1 soğan ren, suyunu saç derisine uygula (kokusu güçlü ama etkili)", duration: "30 dk, şampuanla yıka" },
        { name: "Yeşil Çay Durulama", recipe: "3 poşet yeşil çay demle, soğut, son durulama olarak uygula", duration: "Durulanmaz" },
      ],
    },
    colored: {
      tips: [
        "Boyama sonrası 48 saat yıkama — renk oturması için kritik",
        "Her yıkamada renk koruyucu şampuan + krem kullan (sülfatsız)",
        "Haftada 1'den fazla yıkama, yıkama = renk solması",
        "Soğuk su ile durulama rengi mühürler — kutikula kapanır",
        "UV koruyucu saç spreyi güneşte renk solmasını %50 azaltır",
        "Havuz ve deniz öncesi saçı temiz su ile ıslat — klor/tuz emilimini azaltır",
      ],
      avoid: ["Sülfatlı şampuanlar (rengi sıyırır)", "Çok sıcak su (kutikulayı açar, renk akar)", "Klor ve tuzlu su (korumasız)", "Günlük yıkama", "UV korumasız güneşlenme", "Ağır metal içeren saç ürünleri"],
      ingredients: [
        { name: "Keratin", benefit: "Boya hasarını onarır, saç lifini güçlendirir" },
        { name: "Argan Yağı", benefit: "Parlaklık verir, renk canlılığını korur" },
        { name: "UV Filtreleri", benefit: "Güneşten kaynaklanan renk solmasını önler" },
        { name: "Amino Asitler", benefit: "Saç yapısını yeniden oluşturur" },
        { name: "Panthenol (B5)", benefit: "Nem bağlar, boyalı saçın kurumasını önler" },
        { name: "Quinoa Proteini", benefit: "Renk moleküllerini saç lifinde tutar" },
      ],
      salonTreatments: [
        { name: "Olaplex / Bond Repair", desc: "Boya kırılan disülfid bağlarını yeniden oluşturur", frequency: "Boya ile birlikte + 4-6 haftada 1" },
        { name: "Gloss / Toner Yenileme", desc: "Rengi canlandırmak için yarı kalıcı parlatma", frequency: "4-6 haftada 1" },
        { name: "Protein Tedavisi", desc: "Boyalı saçın kaybettiği proteini geri kazandırır", frequency: "Ayda 1" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Kışın solan rengi gloss ile canlandır" },
        { season: "Yaz", tip: "UV koruma en kritik dönem — SPF saç spreyi ve şapka şart" },
        { season: "Sonbahar", tip: "Yaz hasarını onar, derin protein maskesi kürü başlat" },
        { season: "Kış", tip: "Kuru hava rengi soldurur — nem maskelerini artır" },
      ],
      diyMasks: [
        { name: "Elma Sirkesi Parlatma", recipe: "1 bardak soğuk su + 1 yk elma sirkesi, son durulama", duration: "Durulama, haftada 1" },
        { name: "Hindistancevizi Yağı Koruma", recipe: "2 yk hindistancevizi yağı, yıkamadan 1 saat önce uçlara uygula", duration: "1 saat, sonra yıka" },
        { name: "Avokado & Bal", recipe: "1 avokado + 1 yk bal + 1 yk zeytinyağı, saç boyuna uygula", duration: "20 dk" },
      ],
    },
    damaged: {
      tips: [
        "Kırık uçları her 6-8 haftada 1 cm kestir — kırık yukarı yayılır",
        "Islak saçı ASLA fırçalama — en kırılgan hali. Geniş dişli tarak kullan",
        "Isı aletleri 180°C'yi geçmesin, haftada 2'den fazla kullanma",
        "Saten yastık kılıfı kullan — pamuk sürtünmesi saçı kırar",
        "Protein-nem dengesi kur: protein fazlası saçı sert yapar, nem fazlası yumuşak",
        "Kimyasal işlemler (boya, düzleştirme) arasında min. 6 hafta bırak",
      ],
      avoid: ["Günlük ısı aleti kullanımı", "Üst üste kimyasal işlem (boya + düzleştirme)", "Islak saçı tarama/fırçalama", "Pamuklu havlu ile ovalama", "Elastik saç lastiği (kırılma yapar)", "Silikon birikimi (clarifying şampuan ile temizle)"],
      ingredients: [
        { name: "Keratin", benefit: "Saç lifinin temel proteini, hasarı doldurur" },
        { name: "Silk Amino Acids", benefit: "İpek proteini, parlaklık + yumuşaklık" },
        { name: "Olaplex (Bis-Aminopropyl Diglycol Dimaleate)", benefit: "Kırık bağları yeniden oluşturur" },
        { name: "Argan Yağı", benefit: "E vitamini zengin, saç lifini besler ve korur" },
        { name: "Biotin", benefit: "Yeni çıkan saçın güçlü olmasını sağlar" },
        { name: "Ceramide", benefit: "Saç lifinin koruyucu katmanını onarır" },
      ],
      salonTreatments: [
        { name: "Olaplex No.1 + No.2", desc: "Profesyonel bağ onarım tedavisi, kırılan bağları yeniden kurar", frequency: "4-6 haftada 1" },
        { name: "Keratin Tedavisi", desc: "Yoğun protein ile saç lifini doldurur ve güçlendirir", frequency: "3-4 ayda 1" },
        { name: "Sıcak Yağ Tedavisi", desc: "Argan/hindistancevizi yağı ile derin beslenme", frequency: "2 haftada 1" },
        { name: "Brazilian Blowout", desc: "Keratin bazlı düzleştirme + onarım (formaldehitsiz)", frequency: "3-6 ayda 1" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Kış hasarını onar — 4 haftalık yoğun protein kürü başlat" },
        { season: "Yaz", tip: "UV + deniz/havuz hasarına karşı koruyucu ürünleri artır" },
        { season: "Sonbahar", tip: "Yaz hasarını değerlendir, kırık uçları aldır, onarım rutini kur" },
        { season: "Kış", tip: "Kuru hava + kapalı mekan ısıtması saçı kurutur — nem maskelerini 2x artır" },
      ],
      diyMasks: [
        { name: "Yumurta & Zeytinyağı Onarım", recipe: "1 yumurta + 2 yk zeytinyağı + 1 yk bal, saç boyuna uygula", duration: "30 dk, ılık su ile durula" },
        { name: "Muz & Bal Maskesi", recipe: "1 olgun muz + 1 yk bal + 2 yk hindistancevizi yağı, pürüzsüz ez", duration: "20 dk" },
        { name: "Mayonez Protein Maskesi", recipe: "3 yk mayonez (yumurtalı, yağlı — doğal protein kaynak), saça uygula", duration: "30 dk, şampuanla yıka" },
      ],
    },
    frizzy: {
      tips: [
        "Saçını havlu ile ovma — mikrofiber havlu veya eski tişört ile sıkıştırarak kurut",
        "Frizz kontrolü için leave-in conditioner her yıkamadan sonra şart",
        "Saçını tamamen kurutmadan dışarı çıkma — nem farkı frizz yapar",
        "Anti-frizz serum sadece uçlara uygula, köklere sürme",
        "Plastik tarak yerine ahşap veya doğal kıl fırça kullan — statik azalır",
        "Nemli hava günlerinde anti-humidity spreyi kullan",
      ],
      avoid: ["Pamuklu havlu ile ovalama", "Sülfatlı şampuanlar (saçı kurutur, kabarma artar)", "Sıcak su ile yıkama", "Saçı kuru fırçalama", "Sert plastik taraklar", "Silikon bazlı ağır ürünler (birikim yapar)"],
      ingredients: [
        { name: "Argan Yağı", benefit: "Saç lifini kaplar, nemi kilitler, kabarma azalır" },
        { name: "Hindistancevizi Yağı", benefit: "Saç lifine nüfuz eder, içeriden nemlendirme sağlar" },
        { name: "Shea Butter", benefit: "Ağır nemlendirici, frizz'i bastırır" },
        { name: "Glycerin", benefit: "Havadan nem çeker ama nemli havada dikkat — kabarma yapabilir" },
        { name: "Keratin", benefit: "Saç yüzeyini düzeltir, pürüzsüzlük sağlar" },
        { name: "Dimethicone", benefit: "Silikon bazlı kaplama, anlık frizz kontrolü (clarifying şampuan ile temizle)" },
      ],
      salonTreatments: [
        { name: "Keratin Düzleştirme", desc: "3-6 ay süren profesyonel frizz kontrolü", frequency: "4-6 ayda 1" },
        { name: "Botox Saç Tedavisi", desc: "Derin nemlendirme + anti-frizz, saçı doldurur", frequency: "3-4 ayda 1" },
        { name: "Nanoplastia", desc: "Formaldehitsiz organik düzleştirme, sağlıklı parlaklık", frequency: "4-6 ayda 1" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Nem oranı artar — anti-humidity ürünlere geç" },
        { season: "Yaz", tip: "En kötü frizz dönemi — güçlü anti-frizz serum + UV koruma birleştir" },
        { season: "Sonbahar", tip: "Nem azalır, statik artar — leave-in krem miktarını artır" },
        { season: "Kış", tip: "Kuru hava + statik elektrik — saten yastık kılıfı ve nemlendirici maske şart" },
      ],
      diyMasks: [
        { name: "Hindistancevizi & Bal", recipe: "3 yk hindistancevizi yağı + 1 yk bal, ılıt ve saça uygula", duration: "30 dk" },
        { name: "Avokado Anti-Frizz", recipe: "1 avokado + 1 yk zeytinyağı + 1 yk bal, pürüzsüz ez", duration: "20 dk" },
        { name: "Elma Sirkesi Durulama", recipe: "1 bardak soğuk su + 2 yk elma sirkesi, son durulama", duration: "Durula, haftada 1" },
      ],
    },
    slow_growth: {
      tips: [
        "Saç ayda ortalama 1-1.5 cm uzar — sabırlı ol ama destekle",
        "Saç derisi masajı günde 5 dk — kan dolaşımını artırır, folikülleri uyarır",
        "Protein, demir, çinko, biotin zengin beslen — saç hücresi hızlı bölünen hücre",
        "Uçlarını düzenli kestir — kırılan uçlar uzamayı yavaşlatır gibi görünür",
        "Uyku kaliteni artır — büyüme hormonu gece salgılanır",
        "Günde 2-3 litre su iç — hücre yenilenmesi için kritik",
      ],
      avoid: ["Sıkı saç modelleri (foliküle baskı)", "Aşırı ısı uygulaması (saç kırılır, uzamış gibi görünmez)", "Crash diyetler (besin eksikliği)", "Stres (telogen effluvium riski)", "Saçı çok sık yıkama", "Alkol ve sigara (kan dolaşımını bozar)"],
      ingredients: [
        { name: "Rozmarin Yağı", benefit: "Araştırmalarda Minoxidil %2 kadar etkili bulunmuş, folikül uyarır" },
        { name: "Kafein", benefit: "Saç foliküllerini uyarır, büyüme fazını uzatır" },
        { name: "Biotin (B7)", benefit: "Keratin üretimini hızlandırır, yeni saç güçlü çıkar" },
        { name: "Nane Yağı", benefit: "Saç derisinde kan dolaşımını %25 artırdığı gösterilmiş" },
        { name: "Castor Oil (Hint Yağı)", benefit: "Ricinoleik asit ile folikülleri besler, kalın saç teli" },
        { name: "Niasinamid (B3)", benefit: "Mikro dolaşımı artırır, foliküle besin taşır" },
      ],
      salonTreatments: [
        { name: "Mezoterapi", desc: "Vitamin + mineral + amino asit kokteyli direkt saç derisine enjekte", frequency: "2 haftada 1 (8-10 seans)" },
        { name: "PRP Tedavisi", desc: "Kendi kanından zenginleştirilmiş plazma, büyüme faktörleri", frequency: "Ayda 1 (4-6 seans)" },
        { name: "LED/LLLT Tedavisi", desc: "Kırmızı LED ışık ile folikül uyarımı", frequency: "Haftada 2-3 (12 hafta)" },
        { name: "Dermapen/Microneedling", desc: "Mikro iğneler ile folikül uyarımı + serum emilimi", frequency: "3-4 haftada 1" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Büyüme mevsimi — takviye ve masaj rutinini artır" },
        { season: "Yaz", tip: "En hızlı uzama dönemi — beslenme ve hidrasyon kritik" },
        { season: "Sonbahar", tip: "Büyüme yavaşlar — mezoterapi veya PRP kürü düşün" },
        { season: "Kış", tip: "En yavaş dönem — D vitamini takviyesi, iç bakım odaklı ol" },
      ],
      diyMasks: [
        { name: "Rozmarin Saç Derisi Yağı", recipe: "3 yk hindistancevizi yağı + 10 damla rozmarin yağı, saç derisine masaj", duration: "Gece boyu, sabah yıka" },
        { name: "Hint Yağı Kürü", recipe: "2 yk castor oil + 1 yk argan yağı, saç derisine ve uçlara", duration: "2-3 saat veya gece boyu" },
        { name: "Soğan & Sarımsak Suyu", recipe: "1 soğan + 2 diş sarımsak rendele, suyunu saç derisine uygula", duration: "30 dk, şampuanla yıka" },
        { name: "Pirinç Suyu Durulama", recipe: "Pirinci yıka, bekletme suyunu saça uygula", duration: "20 dk, durula" },
      ],
    },
    itchy: {
      tips: [
        "Tırnaklarla kaşıma — parmak uçlarıyla dairesel masaj yap",
        "Şampuanı 3-5 dk saç derisinde beklet, hemen durulama",
        "Yeni ürün kullanmaya başladıysan alerji testi yap — kulak arkasına az miktar uygula",
        "Saçını her gün yıkama ama 3 günden fazla da bekleme — denge önemli",
        "Sıcak su kullanma — ılık/soğuk su ile yıka, tahriş azalır",
        "Kronik kaşıntı için mutlaka dermatologa danış — egzama, sedef olabilir",
      ],
      avoid: ["Parfümlü saç ürünleri", "SLS/SLES içeren şampuanlar", "Alkol bazlı saç spreyleri", "Çok sıcak su", "Sentetik şapka/bone (terletir)", "Ürün çeşitliliği (az ürün, tutarlı kullan)"],
      ingredients: [
        { name: "Çay Ağacı Yağı", benefit: "Antibakteriyel + antifungal, kaşıntıyı azaltır" },
        { name: "Salisilik Asit", benefit: "Saç derisini eksfoliye eder, pullanmayı giderir" },
        { name: "Aloe Vera", benefit: "Yatıştırıcı, soğutucu, tahriş giderici" },
        { name: "Mentol/Nane Yağı", benefit: "Serinletici etki, kaşıntıyı anında hafifletir" },
        { name: "Panthenol (B5)", benefit: "Saç derisini onarır ve nemlendirir" },
        { name: "Niasinamid", benefit: "İltihaplanmayı azaltır, bariyer onarır" },
      ],
      salonTreatments: [
        { name: "Saç Derisi Analizi", desc: "Trichoscopy ile saç derisi durumunu detaylı inceleme", frequency: "İlk değerlendirme" },
        { name: "Medikal Peeling", desc: "Profesyonel asit bazlı saç derisi temizliği", frequency: "3-4 haftada 1" },
        { name: "Ozon Terapi", desc: "Ozon ile saç derisini dezenfekte, kaşıntıyı azaltma", frequency: "Haftada 1 (6 seans)" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Alerji sezonu — kaşıntı artabilir, antihistaminik düşün" },
        { season: "Yaz", tip: "Terleme kaşıntıyı artırır — hafif formüller ve sık durulama" },
        { season: "Sonbahar", tip: "Kuru hava başlangıcı — nemlendirici tonik kullanmaya başla" },
        { season: "Kış", tip: "Kuru hava + kapalı mekan en kötü dönem — nemlendirici şampuan ve saç derisi serumu" },
      ],
      diyMasks: [
        { name: "Aloe Vera Yatıştırıcı", recipe: "3 yk taze aloe vera jeli direkt saç derisine uygula", duration: "15 dk, soğuk su ile durula" },
        { name: "Nane & Çay Ağacı Tonik", recipe: "100 ml su + 5 damla nane yağı + 5 damla çay ağacı yağı", duration: "Durulanmaz, günlük sprey" },
        { name: "Yoğurt Saç Derisi Maskesi", recipe: "3 yk doğal yoğurt + 1 yk bal, saç derisine masaj yap", duration: "20 dk, şampuanla yıka" },
      ],
    },
    thinning: {
      tips: [
        "Hacim veren şampuan ve kök spreyi rutininin parçası olsun",
        "Saçı tersine fönle — başı aşağı eğ, köklere doğru fönle",
        "Ağır saç kremi ve yağları köklerden uzak tut — ağırlaştırır",
        "Saç ayrımını değiştir — hep aynı yerden ayırmak seyreleşme izlenimi verir",
        "Düzenli egzersiz yap — kan dolaşımı folikülleri besler",
        "Tiroid ve demir kontrolü yaptır — ince saçın altta yatan sebebi olabilir",
      ],
      avoid: ["Ağır yağlar ve butter'lar (köklere)", "Sıkı at kuyruğu ve topuz", "Aşırı ısı uygulaması", "Silikon birikimi", "Saçı çok sık yıkama veya çok az yıkama", "Sülfatlı sert şampuanlar"],
      ingredients: [
        { name: "Biotin (B7)", benefit: "Keratin üretimini destekler, saç telini kalınlaştırır" },
        { name: "Kafein", benefit: "DHT'yi bloke eder, saç folikülünü uyarır" },
        { name: "Panthenol (B5)", benefit: "Saç telini kalınlaştırır, hacim verir" },
        { name: "Niasinamid (B3)", benefit: "Mikro dolaşımı artırır, foliküle besin taşır" },
        { name: "Keratin", benefit: "Saç telini dolgunlaştırır, güçlendirir" },
        { name: "Pirinç Proteini", benefit: "Saç lifini kaplayan hafif protein, hacim verir" },
      ],
      salonTreatments: [
        { name: "Hacim Veren Keratin", desc: "Saç telini kalınlaştıran özel keratin formülü", frequency: "3-4 ayda 1" },
        { name: "Mezoterapi", desc: "Biotin + B vitamini + amino asit enjeksiyonu", frequency: "2 haftada 1 (8 seans)" },
        { name: "Saç Simülasyonu (SMP)", desc: "Mikro pigmentasyon ile dolgunluk görünümü", frequency: "Tek seferlik" },
      ],
      seasonal: [
        { season: "İlkbahar", tip: "Hacim veren ürünlere geç, kışın ağır ürünlerini bırak" },
        { season: "Yaz", tip: "Tuz spreyi doğal hacim verir — deniz tuzu bazlı sprey kullan" },
        { season: "Sonbahar", tip: "Mevsimsel dökülme normal — panik yapma ama destekle" },
        { season: "Kış", tip: "Statik elektrik hacim verir ama kırılgan yapar — hafif leave-in kullan" },
      ],
      diyMasks: [
        { name: "Yumurta Protein Maskesi", recipe: "2 yumurta + 1 yk zeytinyağı, saça uygula", duration: "20 dk, soğuk su ile durula" },
        { name: "Bira Durulama", recipe: "1 bardak düz bira (gazı çıkmış), son durulama olarak uygula", duration: "5 dk, durula" },
        { name: "Pirinç Suyu Hacim", recipe: "Pirinci bekletme suyu + 3 damla rozmarin yağı, sprey şişeye", duration: "Durulanmaz, kök spreyi" },
      ],
    },
  };

  return {
    routine: baseRoutines[type],
    products: baseProducts[type],
    ...issueData[issue],
  };
}

export default function HairCarePage() {
  const { t } = useI18n();
  const [step, setStep] = useState<"type" | "issue" | "result">("type");
  const [hairType, setHairType] = useState<HairType | null>(null);
  const [hairIssue, setHairIssue] = useState<HairIssue | null>(null);

  const handleTypeSelect = (type: HairType) => {
    setHairType(type);
    setStep("issue");
  };

  const handleIssueSelect = (issue: HairIssue) => {
    setHairIssue(issue);
    setStep("result");
  };

  const reset = () => {
    setStep("type");
    setHairType(null);
    setHairIssue(null);
  };

  if (step === "result" && hairType && hairIssue) {
    const advice = getAdvice(hairType, hairIssue);
    const typeInfo = HAIR_TYPES.find(t => t.key === hairType)!;
    const issueInfo = HAIR_ISSUES.find(i => i.key === hairIssue)!;

    return (
      <>
        <Header title={t.hair_title} showBack />
        <main className="px-4 py-4 space-y-4 pb-28">
          {/* Hero */}
          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-5 text-center">
            {(() => { const HairIcon = HAIR_TYPE_ICONS[hairType!] || Scissors; return <HairIcon size={40} className="mx-auto text-primary" />; })()}
            <h2 className="text-lg font-bold mt-2">{typeInfo.label} {t.hair_subtitle}{issueInfo.label}</h2>
            <p className="text-xs text-muted mt-1">{t.hair_custom_guide}</p>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="primary" size="sm">{typeInfo.porosity}</Badge>
            </div>
          </div>

          {/* Morning Routine */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-primary" />
              <h3 className="font-bold text-sm">{t.hair_daily}</h3>
            </div>
            <div className="space-y-3">
              {advice.routine.morning.map((r, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{r.step}</p>
                      <Badge variant="muted" size="sm">{r.duration}</Badge>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Routine */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-primary" />
              <h3 className="font-bold text-sm">{t.hair_weekly}</h3>
            </div>
            <div className="space-y-3">
              {advice.routine.weekly.map((r, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 bg-secondary/10 text-secondary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{r.step}</p>
                      <Badge variant="secondary" size="sm">{r.frequency}</Badge>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Brand Product Recommendations */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={16} className="text-primary" />
              <h3 className="font-bold text-sm">{t.hair_products}</h3>
            </div>
            <div className="space-y-3">
              {advice.products.map((p, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant="primary" size="sm">{p.brand}</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.product}</p>
                      <p className="text-xs text-muted">{p.detail}</p>
                      <p className="text-xs text-primary font-medium mt-0.5">{p.priceRange}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <a
                      href={`https://www.trendyol.com/sr?q=${encodeURIComponent(p.brand + " " + p.product)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-medium flex items-center gap-1 hover:bg-orange-100 transition-colors"
                    >
                      Trendyol <ExternalLink size={10} />
                    </a>
                    <a
                      href={`https://www.gratis.com/search?q=${encodeURIComponent(p.brand + " " + p.product)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-medium flex items-center gap-1 hover:bg-green-100 transition-colors"
                    >
                      Gratis <ExternalLink size={10} />
                    </a>
                    <a
                      href={`https://www.sephora.com.tr/search?q=${encodeURIComponent(p.brand + " " + p.product)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-medium flex items-center gap-1 hover:bg-gray-200 transition-colors"
                    >
                      Sephora <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Ingredients */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Beaker size={16} className="text-primary" />
              <h3 className="font-bold text-sm">{t.hair_ingredients}</h3>
            </div>
            <div className="space-y-2">
              {advice.ingredients.map((ing) => (
                <div key={ing.name} className="bg-safe/5 rounded-lg p-2.5">
                  <p className="text-sm font-semibold text-safe">{ing.name}</p>
                  <p className="text-xs text-muted mt-0.5">{ing.benefit}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-primary" />
              <h3 className="font-bold text-sm">{t.hair_expert_tips}</h3>
            </div>
            <ul className="space-y-2">
              {advice.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Avoid */}
          <Card>
            <h3 className="font-bold text-sm mb-3">{t.hair_avoid}</h3>
            <div className="flex flex-wrap gap-2">
              {advice.avoid.map(a => (
                <Badge key={a} variant="danger" size="md">{a}</Badge>
              ))}
            </div>
          </Card>

          {/* Salon Treatments */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-primary" />
              <h3 className="font-bold text-sm">{t.hair_salon}</h3>
            </div>
            <div className="space-y-3">
              {advice.salonTreatments.map((t, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <Badge variant="muted" size="sm">{t.frequency}</Badge>
                  </div>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* DIY Masks */}
          <Card>
            <h3 className="font-bold text-sm mb-3">{t.hair_diy}</h3>
            <div className="space-y-3">
              {advice.diyMasks.map((m, i) => (
                <div key={i} className="bg-primary/5 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{m.name}</p>
                    <Badge variant="primary" size="sm">{m.duration}</Badge>
                  </div>
                  <p className="text-xs text-muted">{m.recipe}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Seasonal Tips */}
          <Card>
            <h3 className="font-bold text-sm mb-3">{t.hair_seasonal}</h3>
            <div className="space-y-2">
              {advice.seasonal.map((s, i) => {
                const seasonIcons: Record<string, LucideIcon> = { "İlkbahar": Flower, "Yaz": Sun, "Sonbahar": CloudRain, "Kış": Snowflake };
                const SeasonIcon = seasonIcons[s.season] || Sun;
                const seasonColors: Record<string, string> = { "İlkbahar": "text-pink-500", "Yaz": "text-amber-500", "Sonbahar": "text-orange-500", "Kış": "text-blue-400" };
                return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <SeasonIcon size={16} className={seasonColors[s.season] || "text-primary"} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.season}</p>
                    <p className="text-xs text-muted">{s.tip}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </Card>

          <PinterestButton
            query={`${hairType} hair care ${hairIssue} treatment routine`}
            className="w-full"
          />

          <Button onClick={reset} variant="outline" fullWidth>
            {t.hair_try_another}
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title={t.hair_title} showBack />
      <main className="px-4 py-4 space-y-4">
        {step === "type" && (
          <>
            <div className="text-center">
              <Scissors size={40} className="mx-auto text-primary" />
              <h2 className="text-lg font-bold mt-2">{t.hair_select_type}</h2>
              <p className="text-sm text-muted mt-1">{t.hair_select_type_desc}</p>
            </div>
            <div className="space-y-3 mt-4">
              {HAIR_TYPES.map(ht => {
                const HIcon = HAIR_TYPE_ICONS[ht.key] || Scissors;
                return (
                <Card key={ht.key} hoverable onClick={() => handleTypeSelect(ht.key)}>
                  <div className="flex items-center gap-4">
                    <HIcon size={28} className="text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">{ht.label}</p>
                      <p className="text-xs text-muted">{ht.desc}</p>
                      <p className="text-[10px] text-primary mt-0.5">{ht.porosity}</p>
                    </div>
                  </div>
                </Card>
                );
              })}
            </div>
          </>
        )}

        {step === "issue" && (
          <>
            <div className="text-center">
              <h2 className="text-lg font-bold">{t.hair_select_issue}</h2>
              <p className="text-sm text-muted mt-1">{t.hair_select_issue_desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {HAIR_ISSUES.map(issue => {
                const Icon = issue.icon;
                return (
                  <Card key={issue.key} hoverable onClick={() => handleIssueSelect(issue.key)}>
                    <div className="text-center">
                      <Icon size={28} className="mx-auto text-primary" />
                      <p className="font-semibold text-sm mt-2">{issue.label}</p>
                      <p className="text-[10px] text-muted mt-0.5">{issue.desc}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <button onClick={() => setStep("type")} className="w-full py-2 text-sm text-muted hover:text-primary">
              Geri Dön
            </button>
          </>
        )}
      </main>
    </>
  );
}
