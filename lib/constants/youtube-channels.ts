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
  // === TÜRK YOUTUBERLAR (19) ===
  { name: "Danla Bilic", subs: "4.2M", desc: "Trend makyaj ve ürün inceleme", tags: ["Türkçe", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@DanlaBilic", img: "/images/channels/danla-bilic.jpg", ig: "danlabilic" },
  { name: "Duygu Özaslan", subs: "3.5M", desc: "Cilt bakımı ve günlük makyaj", tags: ["Türkçe", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@duyguozaslan", img: "/images/channels/duygu-ozaslan.jpg", ig: "duyguozaslan" },
  { name: "Merve Özkaynak", subs: "1.8M", desc: "Doğal makyaj ve saç bakımı", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@MerveOzkaynak", img: "/images/channels/merve-ozkaynak.jpg", ig: "merveozkaynak" },
  { name: "Sebile Ölmez", subs: "1.2M", desc: "Makyaj dersleri ve ürün önerileri", tags: ["Türkçe", "Orta", "Profesyonel"], url: "https://youtube.com/@SebileOlmez", img: "/images/channels/sebile-olmez.jpg", ig: "sebibebi" },
  { name: "İrem Güzey", subs: "900K", desc: "Cilt bakım rutinleri ve ürün analizi", tags: ["Türkçe", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@iremguzey", img: "/images/channels/irem-guzey.jpg", ig: "iremguzey" },
  { name: "Ecem Karavus", subs: "550K", desc: "Uygun fiyatlı kozmetik önerileri", tags: ["Türkçe", "Başlangıç", "Günlük Makyaj"], url: "https://youtube.com/@ecemkaravus", img: "/images/channels/ecem-karavus.jpg", ig: "1ecemkaravus" },
  { name: "Betül Bayraktar", subs: "480K", desc: "Doğal ve organik cilt bakımı", tags: ["Türkçe", "Orta", "Doğal"], url: "https://youtube.com/@betulbayraktar", img: "/images/channels/betul-bayraktar.jpg", ig: "betulbayraktr" },
  { name: "Ece Targıt", subs: "400K", desc: "Saç bakımı ve doğal güzellik", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@ecetargit", img: "/images/channels/ece-targit.jpg", ig: "ecetargit" },
  { name: "Gökçe Bağcı", subs: "350K", desc: "Makyaj sanatçısı gözünden teknikler", tags: ["Türkçe", "Profesyonel", "Teknik"], url: "https://youtube.com/@gokcebagci", img: "/images/channels/gokce-bagci.jpg" },
  { name: "Melis Aygün", subs: "320K", desc: "Hassas cilt bakımı ve dermatoloji", tags: ["Türkçe", "Orta", "Bilimsel"], url: "https://youtube.com/@melisaygun", img: "/images/channels/melis-aygun.jpg" },
  { name: "Cansu Dengey", subs: "300K", desc: "K-beauty ve Asya cilt bakımı", tags: ["Türkçe", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@cansudengey", img: "/images/channels/cansu-dengey.jpg", ig: "cansudengey" },
  { name: "Yasemin Sakallıoğlu", subs: "180K", desc: "Bütçe dostu cilt bakım önerileri", tags: ["Türkçe", "Başlangıç", "Günlük Makyaj"], url: "https://youtube.com/@yaseminsakallioglu", img: "/images/channels/yasemin-sakallioglu.jpg", ig: "yasemoz88" },
  { name: "Beyzanur Özçelik", subs: "250K", desc: "Makyaj tüyoları ve ürün denemeleri", tags: ["Türkçe", "Başlangıç", "Günlük Makyaj"], url: "https://youtube.com/@beyzanurozcelik", img: "/images/channels/beyzanur-ozcelik.jpg" },
  { name: "Sude Kozmetik", subs: "200K", desc: "Kozmetik incelemeleri ve alışveriş rehberi", tags: ["Türkçe", "Başlangıç", "Günlük Makyaj"], url: "https://youtube.com/@SudeKozmetik", img: "/images/channels/sude-kozmetik.jpg", ig: "sudekozmetik" },
  { name: "Pinkpanda", subs: "180K", desc: "Renkli makyaj ve trend takibi", tags: ["Türkçe", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@pinkpandaaa", img: "/images/channels/pinkpanda.jpg", ig: "pinkpandaaa" },
  { name: "İlayda Akan", subs: "170K", desc: "Doğal güzellik ve cilt bakım rutinleri", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@ilaydaakan", img: "/images/channels/ilayda-akan.jpg" },
  { name: "Sine Makyaj", subs: "160K", desc: "Profesyonel makyaj teknikleri ve eğitim", tags: ["Türkçe", "Profesyonel", "Teknik"], url: "https://youtube.com/@sinemakyaj", img: "/images/channels/sine-makyaj.jpg" },
  { name: "Beyaz Zeytin", subs: "150K", desc: "Organik ve doğal cilt bakım önerileri", tags: ["Türkçe", "Orta", "Doğal"], url: "https://youtube.com/@beyazzeytin", img: "/images/channels/beyaz-zeytin.jpg", ig: "beyaz.zeytin" },
  { name: "Ceylan Özbudak", subs: "140K", desc: "Günlük makyaj ve güzellik trendleri", tags: ["Türkçe", "Başlangıç", "Günlük Makyaj"], url: "https://youtube.com/@ceylanozbudak", img: "/images/channels/ceylan-ozbudak.jpg" },

  // === ULUSLARARASI YOUTUBERLAR (30) ===
  { name: "Hyram", subs: "4.5M", desc: "İçerik analizi ve cilt bakım bilimi", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@Hyram", img: "/images/channels/hyram.jpg", ig: "hyram" },
  { name: "Ali Andreea", subs: "3.8M", desc: "Cilt tipine özel bakım rutinleri", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@AliAndreea", img: "/images/channels/ali-andreea.jpg" },
  { name: "James Charles", subs: "24M", desc: "Yaratıcı makyaj ve sanat", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@jamescharles", img: "/images/channels/james-charles.jpg", ig: "jamescharles" },
  { name: "NikkieTutorials", subs: "14M", desc: "Dönüşüm makyajları ve ürün incelemeleri", tags: ["İngilizce", "Orta", "Profesyonel"], url: "https://youtube.com/@NikkieTutorials", img: "/images/channels/nikkie-tutorials.jpg", ig: "nikkietutorials" },
  { name: "Robert Welsh", subs: "2.1M", desc: "Profesyonel makyöz teknikleri", tags: ["İngilizce", "Profesyonel", "Teknik"], url: "https://youtube.com/@RobertWelsh", img: "/images/channels/robert-welsh.jpg", ig: "robertwelsh" },
  { name: "James Welsh", subs: "1.5M", desc: "Erkek cilt bakımı ve skincare bilimi", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@JamesWelsh", img: "/images/channels/james-welsh.jpg", ig: "jameswelsh" },
  { name: "Doctorly", subs: "1.9M", desc: "Dermatologlar tarafından cilt bakım rehberi", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@Doctorly", img: "/images/channels/doctorly.jpg", ig: "doctorly" },
  { name: "Dr. Dray", subs: "1.8M", desc: "Dermatolog onaylı ürün incelemeleri", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@DrDray", img: "/images/channels/dr-dray.jpg", ig: "drdrayzday" },
  { name: "Glow By Ramón", subs: "800K", desc: "Temiz güzellik ve doğal ürünler", tags: ["İngilizce", "Orta", "Doğal"], url: "https://youtube.com/@GlowByRamon", img: "/images/channels/glow-by-ramon.jpg", ig: "glowbyramon" },
  { name: "Lisa Eldridge", subs: "2.5M", desc: "Efsanevi makyaj sanatçısından dersler", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@lisaeldridge", img: "/images/channels/lisa-eldridge.jpg", ig: "lisaeldridgemakeup" },
  { name: "Wayne Goss", subs: "4M", desc: "Profesyonel makyaj sırları ve ipuçları", tags: ["İngilizce", "Profesyonel", "Teknik"], url: "https://youtube.com/@WayneGoss", img: "/images/channels/wayne-goss.jpg", ig: "gossmakeupartist" },
  { name: "Beauty Within", subs: "2.2M", desc: "K-beauty ve Asya cilt bakım rutinleri", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@BeautyWithin", img: "/images/channels/beauty-within.jpg", ig: "beautywithin" },
  { name: "Liah Yoo", subs: "1.3M", desc: "Minimalist cilt bakımı ve bilimsel yaklaşım", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@LiahYoo", img: "/images/channels/liah-yoo.jpg", ig: "liahyoo" },
  { name: "Mixed Makeup", subs: "1.1M", desc: "Ünlü makyöz röportajları ve teknikler", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@MixedMakeup", img: "/images/channels/mixed-makeup.jpg", ig: "mixedmakeup" },
  { name: "Labmuffin Beauty Science", subs: "900K", desc: "Kimyager gözünden kozmetik bilimi", tags: ["İngilizce", "İleri", "Bilimsel"], url: "https://youtube.com/@LabMuffinBeautyScience", img: "/images/channels/labmuffin.jpg", ig: "labmuffinbeautyscience" },
  { name: "Cassandra Bankson", subs: "1.4M", desc: "Akne ve problemli cilt bakımı", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@CassandraBankson", img: "/images/channels/cassandra-bankson.jpg", ig: "cassandrabankson" },
  { name: "Alexandra Anele", subs: "1.6M", desc: "Fondöten ve kapatıcı uzmanı", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@AlexandraAnele", img: "/images/channels/alexandra-anele.jpg", ig: "alexandraanele" },
  { name: "Charlotte Tilbury", subs: "1.7M", desc: "Lüks makyaj ve red carpet teknikleri", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@CharlotteTilbury", img: "/images/channels/charlotte-tilbury.jpg", ig: "charlottetilbury" },
  { name: "Hung Vanngo", subs: "500K", desc: "Hollywood makyöz teknikleri", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@HungVanngo", img: "/images/channels/hung-vanngo.jpg", ig: "hungvanngo" },
  { name: "Dr. Shereene Idriss", subs: "750K", desc: "Dermatolog tarafından bilimsel cilt rehberi", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@shereeneidriss", img: "/images/channels/shereene-idriss.jpg", ig: "sheaborealislabs" },
  { name: "Kelly Gooch", subs: "400K", desc: "Olgun cilt makyajı ve anti-aging", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@KellyGooch", img: "/images/channels/kelly-gooch.jpg", ig: "kellygooch" },
  { name: "Ava Lee", subs: "350K", desc: "Kore güzellik rutinleri ve trendleri", tags: ["İngilizce", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@AvaLee", img: "/images/channels/ava-lee.jpg", ig: "glowwithava" },
  { name: "Penn Smith", subs: "300K", desc: "Erkek cilt bakımı ve grooming rehberi", tags: ["İngilizce", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@PennSmith", img: "/images/channels/penn-smith.jpg", ig: "penn.smith.skincare" },
  { name: "Gothamista", subs: "1M", desc: "Asya güzellik ürünleri ve detaylı incelemeler", tags: ["İngilizce", "Orta", "Doğal"], url: "https://youtube.com/@Gothamista", img: "/images/channels/gothamista.jpg", ig: "gothamista" },
  { name: "Manny MUA", subs: "4.8M", desc: "Cesur makyaj görünümleri ve ürün değerlendirmeleri", tags: ["İngilizce", "Orta", "Profesyonel"], url: "https://youtube.com/@MannyMua733", img: "/images/channels/manny-mua.jpg", ig: "mannymua733" },
  { name: "Patrick Starrr", subs: "4.5M", desc: "Eğlenceli makyaj tutorialları ve güzellik", tags: ["İngilizce", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@PatrickStarrr", img: "/images/channels/patrick-starrr.jpg", ig: "patrickstarrr" },
  { name: "Sarah Cheung", subs: "600K", desc: "Minimalist güzellik ve bilinçli tüketim", tags: ["İngilizce", "Başlangıç", "Doğal"], url: "https://youtube.com/@Sacheu", img: "/images/channels/sacheu.jpg", ig: "sacheu" },
  { name: "Derm Doctor", subs: "3.5M", desc: "Dermatolog tarafından cilt sağlığı eğitimi", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@DermDoctor", img: "/images/channels/derm-doctor.jpg", ig: "dermdoctor" },
  { name: "Painted by Spencer", subs: "500K", desc: "Profesyonel makyaj sanatçısı teknikleri", tags: ["İngilizce", "İleri", "Teknik"], url: "https://youtube.com/@paintedbyspencer", img: "/images/channels/painted-by-spencer.jpg", ig: "paintedbyspencer" },
  { name: "Jordyn", subs: "400K", desc: "Günlük makyaj ve güzellik alışverişleri", tags: ["İngilizce", "Başlangıç", "Günlük Makyaj"], url: "https://youtube.com/@ByJordyn", img: "/images/channels/by-jordyn.jpg" },
];
