export interface YouTubeChannel {
  name: string;
  subs: string;
  desc: string;
  tags: string[];
  url: string;
  img: string;
  ig?: string;
}

export const youtubeChannels: YouTubeChannel[] = [
  // === TÜRK YOUTUBERLAR (5 doğrulanmış) ===
  { name: "Danla Bilic", subs: "3M", desc: "Trend makyaj ve ürün inceleme", tags: ["Türkçe", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@DanlaBilic", img: "/images/channels/danla-bilic.jpg", ig: "danlabilic" },
  { name: "Merve Özkaynak", subs: "2.1M", desc: "Doğal makyaj ve saç bakımı", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@MerveOzkaynak", img: "/images/channels/merve-ozkaynak.jpg", ig: "merveozkaynak" },
  { name: "Duygu Özaslan", subs: "1.4M", desc: "Cilt bakımı ve günlük makyaj", tags: ["Türkçe", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@duyguozaslan", img: "/images/channels/duygu-ozaslan.jpg", ig: "duyguozaslan" },
  { name: "Sebile Ölmez", subs: "985K", desc: "Makyaj dersleri ve ürün önerileri", tags: ["Türkçe", "Orta", "Profesyonel"], url: "https://youtube.com/@SebileOlmez", img: "/images/channels/sebile-olmez.jpg", ig: "sebibebi" },
  { name: "Ece Targıt", subs: "140K", desc: "Cilt bakımı ve makyaj bilgisi", tags: ["Türkçe", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@ecetargit", img: "/images/channels/ece-targit.jpg", ig: "ecetargit" },

  // === ULUSLARARASI YOUTUBERLAR (25 doğrulanmış) ===
  { name: "James Charles", subs: "24M", desc: "Yaratıcı makyaj ve sanat", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@jamescharles", img: "/images/channels/james-charles.jpg", ig: "jamescharles" },
  { name: "NikkieTutorials", subs: "15M", desc: "Dönüşüm makyajları ve ürün incelemeleri", tags: ["İngilizce", "Orta", "Profesyonel"], url: "https://youtube.com/@NikkieTutorials", img: "/images/channels/nikkie-tutorials.jpg", ig: "nikkietutorials" },
  { name: "Manny MUA", subs: "4.8M", desc: "Cesur makyaj görünümleri ve ürün değerlendirmeleri", tags: ["İngilizce", "Orta", "Profesyonel"], url: "https://youtube.com/@MannyMua733", img: "/images/channels/manny-mua.jpg", ig: "mannymua733" },
  { name: "Patrick Starrr", subs: "4.8M", desc: "Eğlenceli makyaj tutorialları ve güzellik", tags: ["İngilizce", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@PatrickStarrr", img: "/images/channels/patrick-starrr.jpg", ig: "patrickstarrr" },
  { name: "Hyram", subs: "4.5M", desc: "İçerik analizi ve cilt bakım bilimi", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@Hyram", img: "/images/channels/hyram.jpg", ig: "hyram" },
  { name: "Wayne Goss", subs: "4M", desc: "Profesyonel makyaj sırları ve ipuçları", tags: ["İngilizce", "Profesyonel", "Teknik"], url: "https://youtube.com/@WayneGoss", img: "/images/channels/wayne-goss.jpg", ig: "gossmakeupartist" },
  { name: "Doctorly", subs: "3.4M", desc: "Dermatologlar tarafından cilt bakım rehberi", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@Doctorly", img: "/images/channels/doctorly.jpg", ig: "doctorly" },
  { name: "Beauty Within", subs: "2.7M", desc: "K-beauty ve Asya cilt bakım rutinleri", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@BeautyWithin", img: "/images/channels/beauty-within.jpg", ig: "beautywithin" },
  { name: "Dr. Dray", subs: "2.6M", desc: "Dermatolog onaylı ürün incelemeleri", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@DrDray", img: "/images/channels/dr-dray.jpg", ig: "drdrayzday" },
  { name: "Lisa Eldridge", subs: "2.1M", desc: "Efsanevi makyaj sanatçısından dersler", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@lisaeldridge", img: "/images/channels/lisa-eldridge.jpg", ig: "lisaeldridgemakeup" },
  { name: "Cassandra Bankson", subs: "2.1M", desc: "Akne ve problemli cilt bakımı", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@CassandraBankson", img: "/images/channels/cassandra-bankson.jpg", ig: "cassandrabankson" },
  { name: "Dr. Shereene Idriss", subs: "1.65M", desc: "Dermatolog tarafından bilimsel cilt rehberi", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@shereeneidriss", img: "/images/channels/shereene-idriss.jpg", ig: "shereeneidriss" },
  { name: "James Welsh", subs: "1.5M", desc: "Erkek cilt bakımı ve skincare bilimi", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@JamesWelsh", img: "/images/channels/james-welsh.jpg", ig: "jameswelsh" },
  { name: "Mixed Makeup", subs: "1.5M", desc: "Ünlü makyöz röportajları ve teknikler", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@MixedMakeup", img: "/images/channels/mixed-makeup.jpg", ig: "mixedmakeup" },
  { name: "Alexandra Anele", subs: "1.4M", desc: "Fondöten ve kapatıcı uzmanı", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@AlexandraAnele", img: "/images/channels/alexandra-anele.jpg", ig: "alexandraanele" },
  { name: "Liah Yoo", subs: "1.2M", desc: "Minimalist cilt bakımı ve bilimsel yaklaşım", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@LiahYoo", img: "/images/channels/liah-yoo.jpg", ig: "liahyoo" },
  { name: "Robert Welsh", subs: "1.1M", desc: "Profesyonel makyöz teknikleri", tags: ["İngilizce", "Profesyonel", "Teknik"], url: "https://youtube.com/@RobertWelsh", img: "/images/channels/robert-welsh.jpg", ig: "robertwelsh" },
  { name: "Sarah Cheung", subs: "870K", desc: "Minimalist güzellik ve bilinçli tüketim", tags: ["İngilizce", "Başlangıç", "Doğal"], url: "https://youtube.com/@Sacheu", img: "/images/channels/sacheu.jpg", ig: "sacheu" },
  { name: "Charlotte Tilbury", subs: "860K", desc: "Lüks makyaj ve red carpet teknikleri", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@CharlotteTilbury", img: "/images/channels/charlotte-tilbury.jpg", ig: "charlottetilbury" },
  { name: "Labmuffin Beauty Science", subs: "800K", desc: "Kimyager gözünden kozmetik bilimi", tags: ["İngilizce", "İleri", "Bilimsel"], url: "https://youtube.com/@LabMuffinBeautyScience", img: "/images/channels/labmuffin.jpg", ig: "labmuffinbeautyscience" },
  { name: "Gothamista", subs: "690K", desc: "Asya güzellik ürünleri ve detaylı incelemeler", tags: ["İngilizce", "Orta", "Doğal"], url: "https://youtube.com/@Gothamista", img: "/images/channels/gothamista.jpg", ig: "gothamista" },
  { name: "Hung Vanngo", subs: "600K", desc: "Hollywood makyöz teknikleri", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@HungVanngo", img: "/images/channels/hung-vanngo.jpg", ig: "hungvanngo" },
  { name: "Painted by Spencer", subs: "590K", desc: "Profesyonel makyaj sanatçısı teknikleri", tags: ["İngilizce", "İleri", "Teknik"], url: "https://youtube.com/@paintedbyspencer", img: "/images/channels/painted-by-spencer.jpg", ig: "paintedbyspencer" },
  { name: "Penn Smith", subs: "250K", desc: "Erkek cilt bakımı ve grooming rehberi", tags: ["İngilizce", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@PennSmith", img: "/images/channels/penn-smith.jpg", ig: "penn.smith.skincare" },
  { name: "Kelly Gooch", subs: "190K", desc: "Olgun cilt makyajı ve cruelty-free ürünler", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@KellyGooch", img: "/images/channels/kelly-gooch.jpg", ig: "kellygooch" },
];
