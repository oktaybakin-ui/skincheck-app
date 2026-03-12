export interface MakeupSolution {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  difficulty: "Kolay" | "Orta" | "İleri";
  duration: string;
  tools: string[];
  steps: { title: string; detail: string }[];
  tips: string[];
  productTypes: string[];
}

export const MAKEUP_SOLUTIONS: MakeupSolution[] = [
  {
    slug: "goz-alti-morluklari",
    icon: "👁️",
    title: "Göz Altı Morlukları",
    desc: "Renk düzeltme ve kapatıcı teknikleri",
    difficulty: "Orta",
    duration: "5-10 dk",
    tools: ["Kapatıcı fırçası", "Güzellik süngeri", "Şeffaf pudra"],
    steps: [
      { title: "Göz altını nemlendirin", detail: "Göz kremi ile göz altını besleyin. Kuruluk kapatıcının çatlamasına neden olur." },
      { title: "Renk düzeltici uygulayın", detail: "Mor-mavi morluklar için şeftali/turuncu tonlu düzeltici; kahverengi morluklar için pembe düzeltici kullanın." },
      { title: "Kapatıcıyı uygulayın", detail: "Cildinizden 1-2 ton açık kapatıcıyı ters üçgen şeklinde göz altına noktalar halinde bırakın." },
      { title: "Süngerle yedirin", detail: "Nemli güzellik süngeri ile hafifçe bastırarak yedirin. Ovalamayın." },
      { title: "Şeffaf pudra ile sabitleyin", detail: "Az miktarda şeffaf pudrayı fırçayla göz altına hafifçe uygulayın. Aşırı pudra kırışıklık yapar." },
    ],
    tips: [
      "Kapatıcıyı uygulamadan önce 30 saniye bekleyin",
      "Işıltılı kapatıcı morluk üzerinde ters etki yapar",
      "Gece yeterli uyku ve su tüketimi farkı azaltır",
    ],
    productTypes: ["Renk Düzeltici", "Kapatıcı", "Şeffaf Pudra", "Göz Kremi"],
  },
  {
    slug: "akne-kapatma",
    icon: "🔴",
    title: "Akne & Sivilce Kapatma",
    desc: "Sivilceleri doğal şekilde gizle",
    difficulty: "Orta",
    duration: "5-8 dk",
    tools: ["İnce kapatıcı fırçası", "Güzellik süngeri", "Sabitleyici sprey"],
    steps: [
      { title: "Cildi hazırlayın", detail: "Temiz cilde nemlendirici ve primer uygulayın. Sivilce üzerinde salisilik asit bazlı ürün kullanabilirsiniz." },
      { title: "Yeşil renk düzeltici kullanın", detail: "Kırmızı sivilcelerin üzerine yeşil tonlu renk düzeltici noktalar halinde uygulayın." },
      { title: "Kapatıcıyı katman katman uygulayın", detail: "Cilt tonunuzla eşleşen mat kapatıcıyı ince katmanlar halinde uygulayın. Tek kalın katman yerine birkaç ince katman daha doğal durur." },
      { title: "Parmakla bastırarak yedirin", detail: "Fırça yerine temiz parmağınızla hafifçe bastırarak yedirin. Vücut ısısı ürünü eritip doğal gösterir." },
      { title: "Pudra ile sabitleyin", detail: "Mineral pudra veya sabitleyici pudrayı sivilce bölgesine uygulayın." },
    ],
    tips: [
      "Mat formüller sivilce üzerinde daha iyi durur",
      "Fırça kullanmak sivilceyi tahriş edebilir, parmak tercih edin",
      "Makyaj öncesi buz uygulaması kızarıklığı azaltır",
    ],
    productTypes: ["Yeşil Renk Düzeltici", "Mat Kapatıcı", "Mineral Pudra", "Sabitleyici Sprey"],
  },
  {
    slug: "genis-gozenekler",
    icon: "⭕",
    title: "Geniş Gözenekler",
    desc: "Gözenekleri minimize etme yolları",
    difficulty: "Kolay",
    duration: "3-5 dk",
    tools: ["Primer", "Güzellik süngeri", "Sabitleyici sprey"],
    steps: [
      { title: "Cildi temizleyip nemlendirin", detail: "Yağsız nemlendirici ile cildi hazırlayın. Yağlı formüller gözenekleri daha belirgin yapar." },
      { title: "Gözenek doldurucu primer uygulayın", detail: "Silikon bazlı primer gözenekleri doldurarak pürüzsüz bir yüzey oluşturur. T bölgesine odaklanın." },
      { title: "Fondöteni ince uygulayın", detail: "Hafif ile orta kapatıcılıkta mat fondöteni güzellik süngeri ile yedirin. Kalın tabaka gözeneklere yerleşir." },
      { title: "Sabitleyici sprey kullanın", detail: "Makyajı sabitleyin. Pudra gözeneklerde birikeceğinden spreyi tercih edin." },
    ],
    tips: [
      "Silikon bazlı primer gözenek görünümünü %50 azaltır",
      "Toz pudra yerine sabitleyici sprey tercih edin",
      "BHA (Salisilik Asit) düzenli kullanım gözenekleri küçültür",
    ],
    productTypes: ["Gözenek Doldurucu Primer", "Mat Fondöten", "Sabitleyici Sprey"],
  },
  {
    slug: "kizariklik-rozasea",
    icon: "🌹",
    title: "Kızarıklık & Rozasea",
    desc: "Kızarıklığı dengeleyen teknikler",
    difficulty: "Orta",
    duration: "8-12 dk",
    tools: ["Yumuşak fırça", "Güzellik süngeri", "Sabitleyici sprey"],
    steps: [
      { title: "Yatıştırıcı primer uygulayın", detail: "Yeşil tonlu veya yatıştırıcı primer kızarık bölgelere uygulayın. Hassas ciltler için parfümsüz ürün seçin." },
      { title: "Yeşil renk düzeltici kullanın", detail: "Kızarık bölgelere yeşil düzeltici uygulayın. Tüm yüze değil, sadece kızarık alanlara." },
      { title: "Mineral fondöten uygulayın", detail: "Mineral fondöten hassas ciltler için ideal. Nemli süngerle ince katman halinde uygulayın." },
      { title: "Allık dikkatli seçin", detail: "Pembe yerine şeftali tonlu allık tercih edin. Kızarık bölgelerden kaçının, yanaklarının en yüksek noktasına uygulayın." },
      { title: "Sabitleyicile son verin", detail: "Termal su spreyi veya yatıştırıcı sabitleyici ile makyajı sabitleyin." },
    ],
    tips: [
      "Hassas ciltler için parfümsüz ürünler şart",
      "Kırmızı ve turuncu tonlardan kaçının",
      "Fırça yerine sünger daha az tahriş eder",
    ],
    productTypes: ["Yeşil Primer", "Mineral Fondöten", "Şeftali Allık", "Termal Su"],
  },
  {
    slug: "yuz-sekillendirme",
    icon: "📐",
    title: "Yüz Şekillendirme",
    desc: "Kontur ve aydınlatıcı rehberi",
    difficulty: "İleri",
    duration: "10-15 dk",
    tools: ["Kontur fırçası", "Fan fırça", "Güzellik süngeri", "Aydınlatıcı"],
    steps: [
      { title: "Yüz şeklinizi belirleyin", detail: "Oval, yuvarlak, kare, kalp veya uzun: her yüz şeklinin farklı kontur haritası vardır." },
      { title: "Kontur uygulayın", detail: "Cildinizden 2-3 ton koyu ürünü şakaklar, çene hattı ve burun kenarlarına uygulayın." },
      { title: "Aydınlatıcı uygulayın", detail: "Alın ortası, burun sırtı, elmacık kemikleri ve çene ucuna açık ton uygulayın." },
      { title: "İyice yedirin", detail: "Geçiş çizgisi kalmayana dek nemli süngerle yedirin. Doğal görünüm için yedirme çok önemli." },
      { title: "Highlighter ekleyin", detail: "Elmacık kemiklerinin en yüksek noktasına, burun ucuna ve cupid's bow'a hafif ışıltı ekleyin." },
    ],
    tips: [
      "Gün ışığında kontrol edin, çizgiler görünmemeli",
      "Krem ürünler doğal, toz ürünler belirgin sonuç verir",
      "Başlangıçta az ürünle başlayın, gerekirse ekleyin",
    ],
    productTypes: ["Kontur Paleti", "Aydınlatıcı", "Highlighter", "Kontur Fırçası"],
  },
  {
    slug: "yas-belirtileri",
    icon: "✨",
    title: "Yaş Belirtileri",
    desc: "Gençleştiren makyaj ipuçları",
    difficulty: "Orta",
    duration: "10-15 dk",
    tools: ["Nemli sünger", "Yumuşak fırçalar", "Aydınlatıcı"],
    steps: [
      { title: "İyi nemlendirin", detail: "Hyaluronik asit içeren serum + nemlendirici ile cildi dolgunlaştırın. Kuru cilt kırışıklıkları vurgular." },
      { title: "Işıltılı primer kullanın", detail: "Işık yansıtan primer ile cildi parlak ve genç gösterin. Mat primerden kaçının." },
      { title: "Hafif fondöten seçin", detail: "Krem fondöten veya BB krem tercih edin. Kalın fondöten kırışıklıklara oturur." },
      { title: "Kremsi ürünler tercih edin", detail: "Allık ve far olarak kremsi formüller seçin. Toz ürünler ince çizgilere yerleşir." },
      { title: "Dudaklara dikkat edin", detail: "Dudak kalemi ile çerçeveleyip kremsi ruj uygulayın. Mat ruj dudakları kurutur ve ince gösterir." },
    ],
    tips: [
      "Mat ürünler yaşı vurgular, saten/parlak bitişler gençleştirir",
      "Göz altı kapatıcıyı çok fazla uygulamayın",
      "Dudak çevresi ince çizgilere primer uygulayın",
    ],
    productTypes: ["Nemlendirici Primer", "BB Krem", "Kremsi Allık", "Kremsi Ruj"],
  },
  {
    slug: "esit-olmayan-cilt-tonu",
    icon: "🎭",
    title: "Eşit Olmayan Cilt Tonu",
    desc: "Ton eşitleme teknikleri",
    difficulty: "Orta",
    duration: "8-10 dk",
    tools: ["Güzellik süngeri", "Renk düzeltici", "Fondöten"],
    steps: [
      { title: "Renk haritası çıkarın", detail: "Yüzünüzdeki farklı tonları belirleyin: kızarık, sarımsı, koyu lekeler gibi." },
      { title: "Bölgesel renk düzeltme yapın", detail: "Kızarıklık → yeşil, koyu lekeler → şeftali/turuncu, sarımsı ton → lavanta düzeltici." },
      { title: "Orta kapatıcılıkta fondöten uygulayın", detail: "Tek seferde tam kapatma yerine katman katman uygulayın. İhtiyaç olan bölgelere ekstra katman ekleyin." },
      { title: "Kapatıcı ile noktasal düzeltme", detail: "Fondöten sonrası hâlâ görünen lekelere kapatıcı ile noktasal müdahale yapın." },
      { title: "Pudra ve sprey ile sabitleyin", detail: "Hafif pudra + sabitleyici sprey kombinasyonu ile bitirin." },
    ],
    tips: [
      "SPF düzenli kullanım lekeleri önler",
      "Niacinamide serumu ton eşitsizliğini azaltır",
      "Fondöteni doğal ışıkta test edin",
    ],
    productTypes: ["Renk Düzeltici Set", "Orta Kapatıcı Fondöten", "Kapatıcı", "Sabitleyici"],
  },
  {
    slug: "ince-dudaklar",
    icon: "👄",
    title: "İnce Dudaklar",
    desc: "Dudakları dolgun gösterme",
    difficulty: "Kolay",
    duration: "3-5 dk",
    tools: ["Dudak kalemi", "Ruj", "Lip gloss"],
    steps: [
      { title: "Dudakları nemlendirin", detail: "Dudak peelingi veya balm ile dudakları yumuşatın. Pürüzsüz dudaklar dolgun görünür." },
      { title: "Dudak kalemi ile çerçeveleyin", detail: "Doğal dudak çizginizin 1mm dışından çizin. Daha fazlası yapay görünür. Ruj tonunuzla eşleşen kalem seçin." },
      { title: "İçini doldurun", detail: "Dudak kalemi ile dudağın içini tamamen doldurun. Bu ruj kalıcılığını artırır." },
      { title: "Ruj uygulayın", detail: "Kremsi veya saten bitişli ruj uygulayın. Mat ruj ince dudakları daha ince gösterir." },
      { title: "Gloss ile dolgunlaştırın", detail: "Dudağın ortasına şeffaf veya ışıltılı gloss uygulayın. Işık yansıması dolgunluk illüzyonu yaratır." },
    ],
    tips: [
      "Açık tonlar dudakları büyük, koyu tonlar küçük gösterir",
      "Dudağın ortasına açık ton uygulama dolgunluk verir",
      "Mentollü/biberli lip plumper geçici dolgunluk sağlar",
    ],
    productTypes: ["Dudak Kalemi", "Kremsi Ruj", "Lip Gloss", "Lip Plumper"],
  },
];
