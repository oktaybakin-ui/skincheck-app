"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useState } from "react";
import Link from "next/link";
import PinterestButton from "@/components/ui/PinterestButton";
import { Sparkles, Sun, Briefcase, Heart, Crown, Clock, Palette, Eye, Star, ShoppingBag, Camera, Loader2, ExternalLink } from "lucide-react";

type LookType = "daily" | "work" | "special" | "date";
type SkinTone = "warm" | "cool" | "neutral";
type FaceShape = "oval" | "round" | "square" | "heart" | "long";

const LOOK_TYPES = [
  { key: "daily" as const, label: "Günlük", icon: Sun, desc: "Doğal, hızlı ve effortless", time: "10-15 dk" },
  { key: "work" as const, label: "İş / Ofis", icon: Briefcase, desc: "Profesyonel, sofistike ve kalıcı", time: "20-25 dk" },
  { key: "special" as const, label: "Özel Gün", icon: Crown, desc: "Göz alıcı, cesur ve unutulmaz", time: "40-60 dk" },
  { key: "date" as const, label: "Randevu", icon: Heart, desc: "Romantik, çekici ve kendinden emin", time: "25-35 dk" },
];

const FaceShapeIcon = ({ shape, className = "" }: { shape: string; className?: string }) => {
  const paths: Record<string, string> = {
    oval: "M24 4C18 4 13 8 11 14C9 20 9 28 11 34C13 40 18 44 24 44C30 44 35 40 37 34C39 28 39 20 37 14C35 8 30 4 24 4Z",
    round: "M24 6C14 6 6 14 6 24C6 34 14 42 24 42C34 42 42 34 42 24C42 14 34 6 24 6Z",
    square: "M10 8H38C40 8 42 10 42 12V36C42 38 40 40 38 40H10C8 40 6 38 6 36V12C6 10 8 8 10 8Z",
    heart: "M24 42C24 42 8 32 8 18C8 12 12 6 18 6C22 6 24 10 24 10C24 10 26 6 30 6C36 6 40 12 40 18C40 32 24 42 24 42Z",
    long: "M24 2C20 2 16 6 14 12C12 18 11 26 12 32C13 38 18 46 24 46C30 46 35 38 36 32C37 26 36 18 34 12C32 6 28 2 24 2Z",
  };
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d={paths[shape] || paths.oval} />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
      <circle cx="30" cy="20" r="1.5" fill="currentColor" />
      <path d="M20 28Q24 32 28 28" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const FACE_SHAPES = [
  { key: "oval" as const, label: "Oval", desc: "İdeal oranlar, çoğu stil yakışır" },
  { key: "round" as const, label: "Yuvarlak", desc: "Elmacık kemikleri belirgin, yumuşak hatlar" },
  { key: "square" as const, label: "Kare", desc: "Güçlü çene hattı, geniş alın" },
  { key: "heart" as const, label: "Kalp", desc: "Geniş alın, sivri çene" },
  { key: "long" as const, label: "Uzun", desc: "Alın-çene mesafesi uzun" },
];

interface BrandProduct {
  brand: string;
  product: string;
  shade: string;
  priceRange: string;
}

interface MakeupStep {
  step: string;
  detail: string;
  proTip: string;
  products: BrandProduct[];
}

interface LookGuide {
  title: string;
  subtitle: string;
  totalTime: string;
  makeup: MakeupStep[];
  contourGuide: string;
  highlightPoints: string[];
  hair: { style: string; howTo: string }[];
  accessories: string[];
  fragranceType: string;
  colorPalette: { name: string; hex: string }[];
  skinPrep: { step: string; detail: string }[];
  mistakeToAvoid: string[];
}

function generateLook(lookType: LookType, tone: SkinTone, face: FaceShape): LookGuide {
  const toneData: Record<SkinTone, {
    lipHex: { name: string; hex: string }[];
    eyeHex: { name: string; hex: string }[];
    blushHex: { name: string; hex: string }[];
    foundationBrands: BrandProduct[];
  }> = {
    warm: {
      lipHex: [
        { name: "Terracotta", hex: "#BF360C" },
        { name: "Şeftali Nude", hex: "#D7A98C" },
        { name: "Tuğla Kırmızı", hex: "#B71C1C" },
        { name: "Karamel", hex: "#C68642" },
      ],
      eyeHex: [
        { name: "Bakır", hex: "#BF6B3A" },
        { name: "Altın", hex: "#C9A84C" },
        { name: "Haki", hex: "#6B7821" },
        { name: "Sıcak Kahve", hex: "#5D4037" },
      ],
      blushHex: [
        { name: "Şeftali", hex: "#FFAB91" },
        { name: "Kayısı", hex: "#FF8A65" },
        { name: "Bronz", hex: "#A1887F" },
      ],
      foundationBrands: [
        { brand: "MAC", product: "Studio Fix Fluid", shade: "NC serisi (NC15-NC45)", priceRange: "₺1200-1400" },
        { brand: "Maybelline", product: "Fit Me Matte", shade: "Warm Nude (128), Warm Honey (322)", priceRange: "₺250-350" },
        { brand: "L'Oréal", product: "True Match", shade: "Golden (W) serisi", priceRange: "₺300-400" },
        { brand: "Flormar", product: "Perfect Coverage", shade: "Warm tonlar (121, 131)", priceRange: "₺200-280" },
      ],
    },
    cool: {
      lipHex: [
        { name: "Berry", hex: "#880E4F" },
        { name: "Mauve Nude", hex: "#C48B9F" },
        { name: "Mavi Kırmızı", hex: "#C62828" },
        { name: "Mürdüm", hex: "#6A1B9A" },
      ],
      eyeHex: [
        { name: "Gümüş", hex: "#9E9E9E" },
        { name: "Lavanta", hex: "#9575CD" },
        { name: "Taupe", hex: "#8D6E63" },
        { name: "Lacivert", hex: "#283593" },
      ],
      blushHex: [
        { name: "Pembe", hex: "#F48FB1" },
        { name: "Mauve", hex: "#CE93D8" },
        { name: "Berry", hex: "#AD1457" },
      ],
      foundationBrands: [
        { brand: "MAC", product: "Studio Fix Fluid", shade: "NW serisi (NW15-NW45)", priceRange: "₺1200-1400" },
        { brand: "Maybelline", product: "Fit Me Matte", shade: "Porcelain (110), Cool Ivory (115)", priceRange: "₺250-350" },
        { brand: "L'Oréal", product: "True Match", shade: "Cool (C) serisi", priceRange: "₺300-400" },
        { brand: "Flormar", product: "Perfect Coverage", shade: "Cool tonlar (101, 102)", priceRange: "₺200-280" },
      ],
    },
    neutral: {
      lipHex: [
        { name: "Dusty Rose", hex: "#C9787C" },
        { name: "Klasik Kırmızı", hex: "#D32F2F" },
        { name: "Nude Pembe", hex: "#D4A89A" },
        { name: "Mercan", hex: "#FF7043" },
      ],
      eyeHex: [
        { name: "Şampanya", hex: "#D4C19C" },
        { name: "Rose Gold", hex: "#C9917A" },
        { name: "Taupe", hex: "#8D6E63" },
        { name: "Bronz", hex: "#8D6E4C" },
      ],
      blushHex: [
        { name: "Dusty Pink", hex: "#E8A0B2" },
        { name: "Şeftali Pembe", hex: "#FFAB91" },
        { name: "Soft Mercan", hex: "#FF8A65" },
      ],
      foundationBrands: [
        { brand: "MAC", product: "Studio Fix Fluid", shade: "N serisi (N4-N8)", priceRange: "₺1200-1400" },
        { brand: "Maybelline", product: "Fit Me Matte", shade: "Natural Beige (220), Natural Buff (230)", priceRange: "₺250-350" },
        { brand: "L'Oréal", product: "True Match", shade: "Neutral (N) serisi", priceRange: "₺300-400" },
        { brand: "Flormar", product: "Perfect Coverage", shade: "Neutral tonlar (111, 115)", priceRange: "₺200-280" },
      ],
    },
  };

  const faceContour: Record<FaceShape, { contour: string; highlight: string[] }> = {
    oval: {
      contour: "Minimal kontur yeterli — elmacık kemiklerinin altına hafif gölge, şakaklara ince çizgi",
      highlight: ["Elmacık kemikleri üstü", "Burun sırtı", "Cupid's bow", "Çene ucu"],
    },
    round: {
      contour: "Şakaklar + çene hattı + yanak altına kontur — yüzü optik olarak uzat. Allığı elmacık kemiklerinin üst kısmına, şakaklara doğru uygula",
      highlight: ["Alın ortası (dikey)", "Burun sırtı", "Çene ucu", "Elmacık kemikleri üstü"],
    },
    square: {
      contour: "Çene köşeleri + alın köşelerine kontur — köşeleri yumuşat. Allığı elmacık kemiklerinin en yüksek noktasına yuvarlak uygula",
      highlight: ["Alın ortası", "Elmacık kemikleri üstü", "Cupid's bow", "Burun sırtı"],
    },
    heart: {
      contour: "Geniş alna hafif kontur + şakaklara gölge. Çene uçlarını aydınlat — alt yüzü optik genişlet",
      highlight: ["Çene uçları (genişletme)", "Elmacık kemikleri altı", "Burun sırtı", "Cupid's bow"],
    },
    long: {
      contour: "Alın üstüne + çene altına yatay kontur — yüzü optik kısalt. Allığı elmacık kemiklerinin ortasına yatay uygula",
      highlight: ["Elmacık kemikleri (yatay)", "Burun sırtı (kısa tut)", "Cupid's bow"],
    },
  };

  const c = toneData[tone];
  const fc = faceContour[face];

  const skinPrep = [
    { step: "Temizlik", detail: "Micellar su veya hafif jel temizleyici ile cildini temizle" },
    { step: "Tonik", detail: "Nemlendirici tonik ile cildi dengele (alkollü toniklerden kaçın)" },
    { step: "Serum", detail: "Hyaluronik asit veya niasinamid serum uygula — makyaj daha iyi tutunur" },
    { step: "Nemlendirici", detail: "Hafif formüllü nemlendirici — yağlıysa jel, kuruya krem bazlı" },
    { step: "SPF", detail: "En az SPF 30 güneş kremi — makyaj altı en önemli adım" },
  ];

  const looks: Record<LookType, LookGuide> = {
    daily: {
      title: "Günlük Doğal Güzellik",
      subtitle: "\"No-makeup\" makeup — doğal ama bakımlı",
      totalTime: "10-15 dakika",
      skinPrep: skinPrep.slice(0, 3).concat([{ step: "SPF Nemlendirici", detail: "SPF'li nemlendirici ile 2 adımı birleştir — hız kazanırsın" }]),
      makeup: [
        {
          step: "Hafif Baz",
          detail: "BB krem veya tinted moisturizer — sadece gerekli yerlere kapatıcı",
          proTip: "Parmak uçlarıyla uygula, daha doğal bir bitiriş verir. Fırça/sünger yerine ısınmış parmaklar ürünü eriterek cilde karıştırır",
          products: [
            { brand: "Maybelline", product: "Dream Fresh BB", shade: "Cilt tonuna uygun", priceRange: "₺200-280" },
            { brand: "Garnier", product: "BB Cream", shade: "Light/Medium/Dark", priceRange: "₺150-200" },
            { brand: "Nars", product: "Pure Radiant Tinted Moist.", shade: "Cilt tonuna uygun", priceRange: "₺900-1100" },
          ],
        },
        {
          step: "Kaşlar",
          detail: "Kaş jeli ile tara, seyrek yerlere hafifçe dolduruculuyla dokun",
          proTip: "Doğal kaş renginiz ile aynı tonda veya 1 ton açık seçin — daha doğal durur",
          products: [
            { brand: "Benefit", product: "Gimme Brow+", shade: "3 (Orta) veya 4.5 (Koyu)", priceRange: "₺600-750" },
            { brand: "Flormar", product: "Brow Up Gel", shade: "Doğal tonlar", priceRange: "₺120-160" },
          ],
        },
        {
          step: "Göz — Tek Renk Far",
          detail: `${c.eyeHex[0].name} tonu tek parmakla kapağa uygula — basit ama şık`,
          proTip: "Parmağınızla uygulama daha yoğun pigment bırakır. Geçiş istemiyorsan tek renk yeterli",
          products: [
            { brand: "MAC", product: "Paint Pot", shade: "Painterly (bazlı)", priceRange: "₺700-850" },
            { brand: "Maybelline", product: "Color Tattoo", shade: "Cilt tonuna uygun nötr", priceRange: "₺200-280" },
          ],
        },
        {
          step: "Allık",
          detail: `${c.blushHex[0].name} tonu — gülümseyerek elmacık kemiklerine uygula`,
          proTip: "Krem allık daha doğal görünür. Parmakla tepelere hafifçe vur ve yay",
          products: [
            { brand: "Rare Beauty", product: "Soft Pinch Liquid Blush", shade: tone === "warm" ? "Joy" : tone === "cool" ? "Grace" : "Bliss", priceRange: "₺700-900" },
            { brand: "Flormar", product: "Baked Blush-On", shade: "Cilt tonuna uygun", priceRange: "₺150-200" },
          ],
        },
        {
          step: "Dudak — Lip Tint / Renkli Balm",
          detail: `${c.lipHex[1].name} tonu — dudakların ortasına uygula, dışa doğru yay`,
          proTip: "Parmağınla ortadan dışa doğru yayarak doğal gradient efekti yarat",
          products: [
            { brand: "Dior", product: "Lip Glow", shade: tone === "warm" ? "004 Coral" : "001 Pink", priceRange: "₺1000-1200" },
            { brand: "Burt's Bees", product: "Tinted Lip Balm", shade: "Rose/Peach", priceRange: "₺200-280" },
          ],
        },
        {
          step: "Maskara",
          detail: "Bir kat maskara — kıvırıcı ile kirpikleri kaldır, köklere zig-zag yaparak uçlara çek",
          proTip: "Alt kirpikleri de unutma — gözü açar ve bakışı büyütür",
          products: [
            { brand: "Maybelline", product: "Lash Sensational", shade: "Siyah", priceRange: "₺200-280" },
            { brand: "Essence", product: "Lash Princess", shade: "Siyah", priceRange: "₺80-120" },
          ],
        },
      ],
      contourGuide: fc.contour,
      highlightPoints: fc.highlight,
      hair: [
        { style: "Doğal dalgalar", howTo: "Islak saçı 2-3 topuz yap, kuruyunca aç — ısısız dalgalar" },
        { style: "Yarım topuz (half-up)", howTo: "Üst yarıyı topla, yüzü çerçeveleyen tutamlar bırak" },
        { style: "Saç bandı ile pratik şekil", howTo: "Kadife bant ile saçı geriye at — bakımlı ve hızlı" },
      ],
      accessories: ["Minimal küçük küpeler (altın/gümüş stud)", "İnce zincir kolye", "Doğal tırnaklar veya nude oje"],
      fragranceType: "Ferah, hafif çiçeksi veya meyveli notalar — Marc Jacobs Daisy, Jo Malone Peony, Zara Gardenia",
      colorPalette: [c.lipHex[1], c.eyeHex[0], c.blushHex[0]],
      mistakeToAvoid: [
        "Fondöten kullanma — BB krem yeterli, ağır baz günlükte yapay durur",
        "Allık unutma — renksiz yüz hasta görünür, hafifçe bile olsa allık sür",
        "Dudak kalemi kullanma — doğal look'ta sınır belli olmamalı",
      ],
    },
    work: {
      title: "Profesyonel Ofis Görünümü",
      subtitle: "Sofistike, güven veren ve gün boyu dayanıklı",
      totalTime: "20-25 dakika",
      skinPrep,
      makeup: [
        {
          step: "Kalıcı Baz — Primer + Fondöten",
          detail: "Primer ile başla, orta kapatıcılıkta fondöten uygula. Kapatıcı ile göz altı ve kızarıklıkları gizle",
          proTip: "T-bölgesine mattifying primer, yanaklar kuru ise hydrating primer — iki farklı primer kullanabilirsin",
          products: [
            ...c.foundationBrands.slice(0, 2),
            { brand: "NYX", product: "Pore Filler Primer", shade: "Şeffaf", priceRange: "₺300-400" },
          ],
        },
        {
          step: "Kontur & Aydınlatıcı",
          detail: fc.contour,
          proTip: "Krem kontur daha doğal, pudra kontur daha keskin. Ofis için krem tercih et. Aydınlatıcıyı abartma — ofis ışığında fazla parlak dikkat çeker",
          products: [
            { brand: "Charlotte Tilbury", product: "Hollywood Contour Wand", shade: "Fair-Medium / Medium-Dark", priceRange: "₺900-1100" },
            { brand: "Maybelline", product: "Master Contour", shade: "Cilt tonuna uygun", priceRange: "₺250-350" },
          ],
        },
        {
          step: "Göz — Nötr 3'lü Far",
          detail: `Kapağa ${c.eyeHex[3].name}, geçiş rengine ${c.eyeHex[2].name}, iç köşeye ${c.eyeHex[0].name} — profesyonel derinlik`,
          proTip: "C fırçası ile kapağı boyarken, blending fırçası ile geçişi yumuşat. Sert çizgi bırakma",
          products: [
            { brand: "Urban Decay", product: "Naked Palette", shade: tone === "warm" ? "Heat" : tone === "cool" ? "Ultraviolet" : "Reloaded", priceRange: "₺1200-1500" },
            { brand: "Flormar", product: "Eyeshadow Palette", shade: "Nötr tonlar", priceRange: "₺250-350" },
          ],
        },
        {
          step: "Eyeliner — İnce Çizgi",
          detail: "Üst kirpik dibine ince kahve veya siyah eyeliner çek — abartısız ama tanımlayıcı",
          proTip: "Kirpik aralarını doldurarak (tightlining) daha doğal ama etkileyici görünüm elde et",
          products: [
            { brand: "Stila", product: "Stay All Day Liner", shade: "Intense Black", priceRange: "₺600-800" },
            { brand: "Essence", product: "Superfine Eyeliner", shade: "Deep Black", priceRange: "₺60-90" },
          ],
        },
        {
          step: "Allık & Bronzer",
          detail: `${c.blushHex[0].name} allık + hafif bronzer — sağlıklı ışıltı`,
          proTip: "Bronzerı 3 noktaya uygula: şakaklar, elmacık kemikleri altı, çene hattı",
          products: [
            { brand: "NARS", product: "Orgasm Blush", shade: "Universal pembe-altın", priceRange: "₺800-1000" },
            { brand: "Benefit", product: "Hoola Bronzer", shade: "Light/Medium", priceRange: "₺800-950" },
          ],
        },
        {
          step: "Dudak — Kalıcı Ruj",
          detail: `Kalıcı mat veya satin ruj: ${c.lipHex[0].name} tonu`,
          proTip: "Dudak kalemin ile çiz, ruju uygula, peçete ile pres yap, pudra serp, tekrar uygula — 8+ saat kalıcılık",
          products: [
            { brand: "MAC", product: "Retro Matte Lipstick", shade: tone === "warm" ? "Marrakesh" : tone === "cool" ? "Ruby Woo" : "Mehr", priceRange: "₺600-750" },
            { brand: "Maybelline", product: "SuperStay Ink Crayon", shade: "Cilt tonuna uygun", priceRange: "₺250-350" },
          ],
        },
        {
          step: "Sabitleyici Sprey",
          detail: "Son adım — sabitleyici sprey ile makyajı kilitle",
          proTip: "Yüzden 20 cm uzaktan X harfi çizerek sık — gün boyu dayanıklılık",
          products: [
            { brand: "Urban Decay", product: "All Nighter Setting Spray", shade: "Şeffaf", priceRange: "₺700-900" },
            { brand: "NYX", product: "Matte Finish Setting Spray", shade: "Şeffaf", priceRange: "₺250-350" },
          ],
        },
      ],
      contourGuide: fc.contour,
      highlightPoints: fc.highlight,
      hair: [
        { style: "Düz fön / sleek look", howTo: "Düzleştirici ile düzelt, parlak serum uygula — profesyonel ve keskin" },
        { style: "Düşük topuz (chignon)", howTo: "Düşük ense topuzu, saç tokası ile sabitle — zarif ve ciddi" },
        { style: "Hafif dalgalar", howTo: "Büyük maşa (32mm) ile gevşek dalgalar, saç spreyi ile sabitle" },
      ],
      accessories: ["İnce altın/gümüş kolye", "Stud veya küçük halka küpeler", "Klasik saat", "French manikür veya nude oje"],
      fragranceType: "Sofistike ve zarif — Chanel No.5, YSL Libre, Tom Ford Black Orchid (hafif sıkım)",
      colorPalette: [c.lipHex[0], c.eyeHex[3], c.blushHex[0], c.eyeHex[0]],
      mistakeToAvoid: [
        "Parlak/ışıltılı fondöten kullanma — ofis ışığında yağlı görünür, mat veya satin tercih et",
        "Kirpik uçlarına maskara bırakma (spider lash) — taranmış, düzgün kirpikler daha profesyonel",
        "Kontur çizgilerini blend etmeden bırakma — doğal gölge gibi görünmeli",
        "Çok koyu dudak rengi + çok koyu göz birlikte kullanma — birini seç, diğerini hafif tut",
      ],
    },
    special: {
      title: "Özel Gün Işıltısı",
      subtitle: "Gala, düğün, mezuniyet — unutulmaz görünüm",
      totalTime: "40-60 dakika",
      skinPrep: [...skinPrep, { step: "Işıltılı Primer", detail: "Strobe primer ile cilde içeriden gelen ışıltı ekle" }],
      makeup: [
        {
          step: "Kusursuz Baz",
          detail: "Full coverage fondöten + kapatıcı + translucent pudra — kusursuz tuval",
          proTip: "Fondöteni beauty blender ile kat kat uygula (3 ince kat > 1 kalın kat). Her kat arasında hafifçe presse",
          products: [
            { brand: "Estée Lauder", product: "Double Wear", shade: "Cilt tonuna uygun", priceRange: "₺1400-1700" },
            { brand: "MAC", product: "Studio Fix Fluid", shade: tone === "warm" ? "NC serisi" : tone === "cool" ? "NW serisi" : "N serisi", priceRange: "₺1200-1400" },
            { brand: "Laura Mercier", product: "Translucent Powder", shade: "Şeffaf", priceRange: "₺1000-1200" },
          ],
        },
        {
          step: "Kontur & Highlight — Dramatik",
          detail: `${fc.contour}. Highlighter ile elmacık kemikleri, burun sırtı, cupid's bow ve köprücük kemiklerini parlatın`,
          proTip: "Krem kontur + pudra kontur katmanlayarak daha dramatik etki al. Highlighter'ı fan fırça ile uygula — doğal ışıltı",
          products: [
            { brand: "Fenty Beauty", product: "Match Stix Contour", shade: "Mocha/Amber", priceRange: "₺800-1000" },
            { brand: "Anastasia BH", product: "Glow Kit", shade: tone === "warm" ? "Sun Dipped" : "Moonchild", priceRange: "₺1000-1300" },
          ],
        },
        {
          step: "Göz — Dramatik Far",
          detail: `Smokey eye veya halo eye: ${c.eyeHex[0].name}, ${c.eyeHex[1].name}, ${c.eyeHex[3].name} + simli accent`,
          proTip: "Glitter'ı sadece göz kapağının ortasına, parmakla bastırarak uygula — daha yoğun pigment. Glitter glue kullanmayı unutma",
          products: [
            { brand: "Huda Beauty", product: "Rose Gold Palette", shade: "Dramatik tonlar", priceRange: "₺1500-1800" },
            { brand: "Pat McGrath", product: "Mothership Palette", shade: "Özel gün tonları", priceRange: "₺2500-3500" },
            { brand: "Flormar", product: "Shimmer Palette", shade: "Işıltılı tonlar", priceRange: "₺300-400" },
          ],
        },
        {
          step: "Eyeliner — Wing / Smokey",
          detail: "Klasik wing eyeliner veya kömürleştirilmiş smokey — bant yöntemi ile keskin hat",
          proTip: "Wing için: bant veya kartvizit kenarını göz ucundan şakağa doğru tut, çizgiyi çek, bantı kaldır — kusursuz hat",
          products: [
            { brand: "KVD Vegan Beauty", product: "Tattoo Liner", shade: "Trooper Black", priceRange: "₺600-800" },
            { brand: "Maybelline", product: "Hyper Sharp Liner", shade: "Siyah", priceRange: "₺200-280" },
          ],
        },
        {
          step: "Kirpikler — Dramatik",
          detail: "Takma kirpik veya 3 kat hacimli maskara — gözler odak noktası",
          proTip: "Takma kirpiği önce ölç, kes. Tutkal kurumaya başlayınca (30 sn) uygula — daha iyi yapışır",
          products: [
            { brand: "Ardell", product: "Demi Wispies", shade: "Siyah", priceRange: "₺150-250" },
            { brand: "Too Faced", product: "Better Than Sex Mascara", shade: "Siyah", priceRange: "₺700-900" },
          ],
        },
        {
          step: "Allık + Highlighter",
          detail: `${c.blushHex[0].name} allık + bol highlighter — kamera karşısında ışıl ışıl`,
          proTip: "Allığı C şeklinde uygula: elmacık kemiklerinden şakaklara kadar. Highlighter'ı üzerine katmanla",
          products: [
            { brand: "NARS", product: "Orgasm", shade: "Allık + Highlighter duo", priceRange: "₺800-1000" },
            { brand: "Becca", product: "Shimmering Skin Perf.", shade: tone === "warm" ? "Champagne Pop" : "Moonstone", priceRange: "₺900-1100" },
          ],
        },
        {
          step: "Dudak — Cesur Ruj",
          detail: `Statement ruj: ${c.lipHex[2].name} — dudak kalemi ile şekillendir`,
          proTip: "Dudak kalemi ile dış hattı çiz, içini doldur, ruju üzerine uygula. Cupid's bow'u belirginleştirmek için kapatıcı ile sınırla",
          products: [
            { brand: "Charlotte Tilbury", product: "Matte Revolution", shade: tone === "warm" ? "Walk of Shame" : tone === "cool" ? "Red Carpet Red" : "Pillow Talk", priceRange: "₺800-1000" },
            { brand: "MAC", product: "Retro Matte", shade: tone === "warm" ? "Chili" : "Diva", priceRange: "₺600-750" },
          ],
        },
        {
          step: "Sabitleyici — Katman Katman",
          detail: "Pudra + sabitleyici sprey + pudra + sabitleyici sprey — 12+ saat kalıcılık",
          proTip: "Her katman arasında 30 sn bekle. Son spreyden sonra yüze fan tutarak kurut",
          products: [
            { brand: "Urban Decay", product: "All Nighter", shade: "Şeffaf", priceRange: "₺700-900" },
            { brand: "Charlotte Tilbury", product: "Airbrush Flawless Setting Spray", shade: "Şeffaf", priceRange: "₺800-1000" },
          ],
        },
      ],
      contourGuide: fc.contour,
      highlightPoints: fc.highlight,
      hair: [
        { style: "Hollywood dalgaları", howTo: "32mm maşa ile hep aynı yöne kıvır, fırçayla taranmış dalgalar oluştur" },
        { style: "Şık topuz + saç aksesuarı", howTo: "Yüksek veya düşük topuz, kristal toka veya inci saç bandı ile süsle" },
        { style: "Yarım topuz + bukler", howTo: "Üst yarıyı topla, altı bukleli bırak, yüz çevresine loose tutamlar" },
      ],
      accessories: ["Göz alıcı küpe (chandelier/drop)", "Statement kolye VEYA küpe (ikisi birden değil)", "Işıltılı clutch çanta", "Stiletto veya strappy topuklu"],
      fragranceType: "Cesur ve kalıcı — Tom Ford Black Orchid, YSL Black Opium, Lancôme La Vie Est Belle",
      colorPalette: [c.lipHex[2], c.eyeHex[0], c.eyeHex[1], c.blushHex[0]],
      mistakeToAvoid: [
        "Fondöteni boyun ve kulak arkasına blend etmeden bırakma — yüz-boyun farkı fotoğrafta çok belli olur",
        "Glitter'ı kuru fırça ile uygulama — dökülür ve yüze yayılır. Islak fırça veya parmakla bastır",
        "Hem göz hem dudak dramatik yapma (genel kural) — ama özel gün istisnası: önce aynada dene",
        "Yeni ürünü özel günde ilk kez deneme — 1 hafta önce prova yap",
      ],
    },
    date: {
      title: "Romantik Randevu",
      subtitle: "\"Effortlessly beautiful\" — doğal ama çekici",
      totalTime: "25-35 dakika",
      skinPrep: [...skinPrep.slice(0, 4), { step: "Işıltılı SPF", detail: "Dewy bitişli güneş kremi — içeriden gelen ışıltı" }],
      makeup: [
        {
          step: "Parlak Baz — Dewy Finish",
          detail: "Işıltılı primer + hafif-orta kapatıcı fondöten — sağlıklı, parlak cilt",
          proTip: "Fondöteni beauty blender ile bastırarak uygula, sürme. Dewy fondöten + setting powder sadece T-bölgesine",
          products: [
            { brand: "Charlotte Tilbury", product: "Flawless Filter", shade: "Cilt tonuna uygun", priceRange: "₺1000-1200" },
            { brand: "L'Oréal", product: "True Match Lumi", shade: tone === "warm" ? "W serisi" : tone === "cool" ? "C serisi" : "N serisi", priceRange: "₺300-400" },
          ],
        },
        {
          step: "Göz — Sıcak Tonlar + Işıltı",
          detail: `${c.eyeHex[0].name} + ${c.eyeHex[1].name} — sıcak, davetkar bakış + iç köşeye ışıltı`,
          proTip: "İç köşe ışıltısı gözü büyütür ve canlı gösterir — romantik bakışın sırrı",
          products: [
            { brand: "Too Faced", product: "Sweet Peach Palette", shade: "Sıcak şeftali tonları", priceRange: "₺1000-1300" },
            { brand: "Maybelline", product: "The Nudes Palette", shade: "Nötr-sıcak tonlar", priceRange: "₺300-400" },
          ],
        },
        {
          step: "Kirpikler — Kıvrık ve Hacimli",
          detail: "Kirpik kıvırıcı + 2 kat hacimli maskara — açık, büyük gözler",
          proTip: "Kıvırıcıyı 3 noktada tut: kök, orta, uç. Her noktada 5 sn — doğal kıvrım",
          products: [
            { brand: "Benefit", product: "Roller Lash Mascara", shade: "Siyah", priceRange: "₺700-850" },
            { brand: "L'Oréal", product: "Lash Paradise", shade: "Siyah", priceRange: "₺250-350" },
          ],
        },
        {
          step: "Allık — Doğal Kızarıklık",
          detail: `${c.blushHex[0].name} allık — gülümseme hissi veren doğal kızarıklık efekti`,
          proTip: "Allığı gülümserken uygula, elmacık kemiklerinin en yüksek noktasına. Daha da doğal olsun diye parmakla dağıt",
          products: [
            { brand: "Rare Beauty", product: "Soft Pinch Blush", shade: tone === "warm" ? "Joy" : tone === "cool" ? "Grace" : "Bliss", priceRange: "₺700-900" },
            { brand: "Clinique", product: "Cheek Pop", shade: "Melon Pop / Berry Pop", priceRange: "₺600-750" },
          ],
        },
        {
          step: "Dudak — Glossy & Çekici",
          detail: `${c.lipHex[1].name} tonu — mat değil, glossy bitiriş. Dolgun ve öpülebilir dudaklar`,
          proTip: "Dudak balm + renkli gloss katmanla. Dudak ortasına ekstra gloss — 3D dolgunluk efekti",
          products: [
            { brand: "Fenty Beauty", product: "Gloss Bomb", shade: tone === "warm" ? "Fenty Glow" : "Fu$$y", priceRange: "₺700-900" },
            { brand: "NYX", product: "Butter Gloss", shade: "Cilt tonuna uygun nude", priceRange: "₺150-200" },
          ],
        },
        {
          step: "Highlighter — Stratejik Işıltı",
          detail: "Elmacık kemiklerine, burun sırtına ve köprücük kemiklerine ışıltı ekle",
          proTip: "Mumlu highlighter en doğal görünür. Fan fırça ile uygula — abartıyı önler",
          products: [
            { brand: "RMS Beauty", product: "Living Luminizer", shade: "Champagne glow", priceRange: "₺800-1000" },
            { brand: "Essence", product: "Pure Nude Highlighter", shade: "Be My Highlight", priceRange: "₺100-150" },
          ],
        },
      ],
      contourGuide: fc.contour,
      highlightPoints: fc.highlight,
      hair: [
        { style: "Soft waves — doğal dalgalar", howTo: "Orta boy maşa ile gevşek kıvır, parmakla aç. Saç parfümü sık" },
        { style: "Yarım topuz + yüz bukleleri", howTo: "Üst yarıyı gevşek topla, yüzü çerçeveleyen 2 tutam bırak ve kıvır" },
        { style: "Saçı bir tarafa at", howTo: "Derin ayrım yap, bir tarafa at, klips ile arkada sabitle — asimetrik cazibe" },
      ],
      accessories: ["Zarif ama dikkat çekici küpe", "İnce kolye veya choker", "Bakımlı eller + nude/kırmızı oje", "Hafif saç parfümü"],
      fragranceType: "Çekici ama abartısız — Miss Dior, Valentino Born in Roma, Versace Bright Crystal",
      colorPalette: [c.lipHex[1], c.eyeHex[0], c.blushHex[0], c.eyeHex[1]],
      mistakeToAvoid: [
        "Ağır fondöten kullanma — randevuda doğal görünmek istiyorsun, dewy/light tercih et",
        "Transfer olan ruj kullanma — glossy ama kalıcı formül seç veya ruju sabitle",
        "Yeni parfümü randevuda ilk kez deneme — önceden test et, alerjik tepki olabilir",
        "Çok güçlü kontur yapma — samimi ortamda yakından bakılır, doğal olsun",
      ],
    },
  };

  return looks[lookType];
}

export default function BestLookPage() {
  const [step, setStep] = useState<"look" | "tone" | "face" | "result">("look");
  const [lookType, setLookType] = useState<LookType | null>(null);
  const [tone, setTone] = useState<SkinTone | null>(null);
  const [faceShape, setFaceShape] = useState<FaceShape | null>(null);
  const [aiDetecting, setAiDetecting] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleLook = (l: LookType) => { setLookType(l); setStep("tone"); };
  const handleTone = (t: SkinTone) => { setTone(t); setStep("face"); };
  const handleFace = (f: FaceShape) => { setFaceShape(f); setStep("result"); };

  const reset = () => { setStep("look"); setLookType(null); setTone(null); setFaceShape(null); setAiResult(null); };

  const detectFaceShape = async (file: File) => {
    setAiDetecting(true);
    setAiResult(null);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/ai/face-shape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (res.ok) {
        const data = await res.json();
        const detected = data.faceShape as FaceShape;
        if (["oval", "round", "square", "heart", "long"].includes(detected)) {
          setFaceShape(detected);
          setAiResult(`AI analizi: ${FACE_SHAPES.find(f => f.key === detected)?.label} yüz şekli tespit edildi`);
        }
      }
    } catch {
      setAiResult("Yüz şekli tespit edilemedi. Lütfen manuel seçin.");
    } finally {
      setAiDetecting(false);
    }
  };

  if (step === "result" && lookType && tone && faceShape) {
    const look = generateLook(lookType, tone, faceShape);
    return (
      <>
        <Header title="En İyi Halin" showBack />
        <main className="px-4 py-4 space-y-4 pb-28">
          {/* Hero */}
          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-5 text-center">
            <Sparkles size={40} className="mx-auto text-primary" />
            <h2 className="text-lg font-bold mt-2">{look.title}</h2>
            <p className="text-sm text-muted italic mt-1">{look.subtitle}</p>
            <div className="flex justify-center gap-2 mt-3 flex-wrap">
              <Badge variant="primary" size="sm">{LOOK_TYPES.find(l => l.key === lookType)?.label}</Badge>
              <Badge variant="secondary" size="sm">{tone === "warm" ? "Sıcak Ton" : tone === "cool" ? "Soğuk Ton" : "Nötr Ton"}</Badge>
              <Badge variant="muted" size="sm">{FACE_SHAPES.find(f => f.key === faceShape)?.label} Yüz</Badge>
              <Badge variant="info" size="sm"><Clock size={10} className="inline mr-1" />{look.totalTime}</Badge>
            </div>
          </div>

          {/* Color Palette */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Palette size={16} className="text-primary" />
              <h3 className="font-bold text-sm">Sana Uygun Renk Paleti</h3>
            </div>
            <div className="flex gap-3">
              {look.colorPalette.map((c) => (
                <div key={c.name} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: c.hex }} />
                  <span className="text-[10px] text-muted">{c.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Skin Prep */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Cilt Hazırlığı (Makyaj Öncesi)</h3>
            <div className="space-y-2">
              {look.skinPrep.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-safe/10 text-safe rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.step}</p>
                    <p className="text-xs text-muted">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Makeup Steps */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Eye size={16} className="text-primary" />
              <h3 className="font-bold text-sm">Makyaj Adımları</h3>
            </div>
            <div className="space-y-4">
              {look.makeup.map((m, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{m.step}</p>
                      <p className="text-xs text-muted mt-0.5">{m.detail}</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-2 ml-9 mb-2">
                    <p className="text-xs"><span className="font-semibold text-primary">Pro Tip:</span> {m.proTip}</p>
                  </div>
                  <div className="ml-9 space-y-2">
                    {m.products.map((p, j) => (
                      <div key={j} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                        <Badge variant="primary" size="sm">{p.brand}</Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{p.product}</p>
                          <p className="text-[10px] text-muted">{p.shade} · {p.priceRange}</p>
                          <div className="flex gap-1 mt-1">
                            <a
                              href={`https://www.trendyol.com/sr?q=${encodeURIComponent(p.brand + " " + p.product)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded text-[9px] font-medium flex items-center gap-0.5 hover:bg-orange-100"
                            >
                              Trendyol <ExternalLink size={8} />
                            </a>
                            <a
                              href={`https://www.gratis.com/arama?q=${encodeURIComponent(p.brand + " " + p.product)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-medium flex items-center gap-0.5 hover:bg-green-100"
                            >
                              Gratis <ExternalLink size={8} />
                            </a>
                            <a
                              href={`https://www.sephora.com.tr/search?q=${encodeURIComponent(p.brand + " " + p.product)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-medium flex items-center gap-0.5 hover:bg-gray-200"
                            >
                              Sephora <ExternalLink size={8} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contour Guide */}
          <Card>
            <h3 className="font-bold text-sm mb-2">Kontur Rehberi ({FACE_SHAPES.find(f => f.key === faceShape)?.label} Yüz)</h3>
            <p className="text-sm text-muted mb-3">{look.contourGuide}</p>
            <div>
              <p className="text-xs font-semibold mb-1">Highlighter Noktaları:</p>
              <div className="flex flex-wrap gap-1.5">
                {look.highlightPoints.map(p => (
                  <Badge key={p} variant="info" size="sm">{p}</Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Hair */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Saç Önerileri</h3>
            <div className="space-y-3">
              {look.hair.map((h, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold">{h.style}</p>
                  <p className="text-xs text-muted">{h.howTo}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Accessories & Fragrance */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Tamamlayıcı Dokunuşlar</h3>
            <ul className="space-y-1.5 mb-3">
              {look.accessories.map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Star size={12} className="text-primary shrink-0" /> {a}
                </li>
              ))}
            </ul>
            <div className="bg-secondary/5 rounded-lg p-2.5">
              <p className="text-xs font-semibold">Parfüm Önerisi</p>
              <p className="text-xs text-muted">{look.fragranceType}</p>
            </div>
          </Card>

          {/* Mistakes to Avoid */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Sık Yapılan Hatalar</h3>
            <div className="space-y-2">
              {look.mistakeToAvoid.map((m, i) => (
                <div key={i} className="flex items-start gap-2 bg-danger/5 rounded-lg p-2.5">
                  <span className="text-danger text-xs font-bold shrink-0 mt-0.5">✕</span>
                  <p className="text-xs text-muted">{m}</p>
                </div>
              ))}
            </div>
          </Card>

          <PinterestButton
            query={`${look.title} makeup look ${tone === "warm" ? "warm tone" : tone === "cool" ? "cool tone" : "neutral tone"} ${faceShape} face`}
            className="w-full"
          />

          <Button onClick={reset} variant="outline" fullWidth>
            Farklı Look Dene
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="En İyi Halin" showBack />
      <main className="px-4 py-4 space-y-4">
        {step === "look" && (
          <>
            <div className="text-center">
              <Sparkles size={40} className="mx-auto text-primary" />
              <h2 className="text-lg font-bold mt-2">En İyi Halini Keşfet</h2>
              <p className="text-sm text-muted mt-1">Hangi ortam için hazırlanıyorsun?</p>
            </div>
            <div className="space-y-3">
              {LOOK_TYPES.map(l => {
                const Icon = l.icon;
                return (
                  <Card key={l.key} hoverable onClick={() => handleLook(l.key)}>
                    <div className="flex items-center gap-4">
                      <Icon size={28} className="text-primary shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{l.label}</p>
                          <Badge variant="muted" size="sm"><Clock size={10} className="inline mr-1" />{l.time}</Badge>
                        </div>
                        <p className="text-xs text-muted">{l.desc}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {step === "tone" && (
          <>
            <h2 className="text-lg font-bold text-center">Alt Tonun Ne?</h2>
            <p className="text-sm text-muted text-center">
              Emin değilsen <Link href="/makeup/undertone" className="text-primary underline">Alt Ton Testini</Link> yap
            </p>
            <div className="space-y-3 mt-4">
              {([
                { key: "warm" as const, label: "Sıcak Ton", desc: "Altın, şeftali, toprak tonları — damarlar yeşilimsi", color: "bg-amber-100" },
                { key: "cool" as const, label: "Soğuk Ton", desc: "Gümüş, pembe, mavi tonları — damarlar mavimsi", color: "bg-blue-100" },
                { key: "neutral" as const, label: "Nötr Ton", desc: "Her iki tondan da taşıyabilirsin — damarlar yeşil-mavi karışık", color: "bg-purple-100" },
              ]).map(t => (
                <Card key={t.key} hoverable onClick={() => handleTone(t.key)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color}`} />
                    <div>
                      <p className="font-semibold">{t.label}</p>
                      <p className="text-xs text-muted">{t.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <button onClick={() => setStep("look")} className="w-full py-2 text-sm text-muted hover:text-primary">Geri</button>
          </>
        )}

        {step === "face" && (
          <>
            <h2 className="text-lg font-bold text-center">Yüz Şeklin Ne?</h2>
            <p className="text-sm text-muted text-center">Kontur ve highlight noktaları buna göre belirlenir</p>

            {/* AI Detection */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 mt-4">
              <div className="text-center">
                <Camera size={28} className="text-primary mx-auto" />
                <p className="font-semibold text-sm mt-2">AI ile Yüz Şekli Belirle</p>
                <p className="text-xs text-muted mt-1">Fotoğraf yükle, AI yüz şeklini otomatik tespit etsin</p>
                <p className="text-[10px] text-muted/60 mt-1">Fotoğrafın anlık olarak değerlendirilir, sunucuda saklanmaz.</p>
                <label className={`mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors ${aiDetecting ? "opacity-50 pointer-events-none" : ""}`}>
                  {aiDetecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Analiz ediliyor...
                    </>
                  ) : (
                    <>
                      <Camera size={16} /> Fotoğraf Yükle
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) detectFaceShape(file);
                    }}
                  />
                </label>
                {aiResult && (
                  <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium ${faceShape ? "bg-safe/10 text-safe" : "bg-danger/10 text-danger"}`}>
                    {aiResult}
                  </div>
                )}
                {faceShape && aiResult && (
                  <button
                    onClick={() => setStep("result")}
                    className="mt-2 px-4 py-2 bg-safe text-white rounded-xl text-sm font-medium"
                  >
                    Bu sonuçla devam et
                  </button>
                )}
              </div>
            </Card>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-muted">veya manuel seç</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {FACE_SHAPES.map(f => (
                <Card key={f.key} hoverable onClick={() => handleFace(f.key)}>
                  <div className="text-center">
                    <FaceShapeIcon shape={f.key} className="w-10 h-10 mx-auto text-primary" />
                    <p className="font-semibold text-sm mt-1">{f.label}</p>
                    <p className="text-[10px] text-muted mt-0.5">{f.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
            <button onClick={() => setStep("tone")} className="w-full py-2 text-sm text-muted hover:text-primary">Geri</button>
          </>
        )}
      </main>
    </>
  );
}
