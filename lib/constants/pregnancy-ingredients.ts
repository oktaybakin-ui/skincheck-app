interface PregnancyIngredient {
  inci: string;
  risk: "high" | "moderate" | "low";
  reason: string;
  source: string;
}

export const PREGNANCY_AVOID: PregnancyIngredient[] = [
  { inci: "Retinol", risk: "high", reason: "Teratojen etki riski - doğum kusurlarına neden olabilir", source: "ACOG/FDA" },
  { inci: "Retinyl Palmitate", risk: "high", reason: "Retinol türevi - aynı riskler geçerli", source: "EMA" },
  { inci: "Tretinoin", risk: "high", reason: "Reçeteli retinoid - kesinlikle kaçının", source: "FDA Category X" },
  { inci: "Adapalene", risk: "high", reason: "Retinoid türevi", source: "ACOG" },
  { inci: "Tazarotene", risk: "high", reason: "Retinoid türevi", source: "FDA" },
  { inci: "Isotretinoin", risk: "high", reason: "Ciddi teratojen etki", source: "FDA Category X" },
  { inci: "Retinaldehyde", risk: "high", reason: "Retinol türevi", source: "ACOG" },
  { inci: "Retinoic Acid", risk: "high", reason: "Retinoid - teratojen", source: "FDA" },
  { inci: "Retinyl Acetate", risk: "high", reason: "Retinol türevi", source: "EMA" },
  { inci: "Hydroxypinacolone Retinoate", risk: "high", reason: "Retinoid türevi", source: "ACOG" },
  { inci: "Hydroquinone", risk: "high", reason: "Yüksek emilim oranı nedeniyle kaçının", source: "FDA" },
  { inci: "Formaldehyde", risk: "high", reason: "Karsinojen ve teratojen", source: "WHO/IARC" },
  { inci: "Formalin", risk: "high", reason: "Formaldehit çözeltisi", source: "WHO" },
  { inci: "Methylene Glycol", risk: "high", reason: "Formaldehit salınımcısı", source: "FDA" },
  { inci: "DMDM Hydantoin", risk: "high", reason: "Formaldehit salınımcı koruyucu", source: "CIR" },
  { inci: "Imidazolidinyl Urea", risk: "high", reason: "Formaldehit salınımcı", source: "CIR" },
  { inci: "Diazolidinyl Urea", risk: "high", reason: "Formaldehit salınımcı", source: "CIR" },
  { inci: "Quaternium-15", risk: "high", reason: "Formaldehit salınımcı", source: "CIR" },
  { inci: "Bronopol", risk: "high", reason: "Formaldehit salınımcı", source: "SCCS" },
  { inci: "Diethylhexyl Phthalate", risk: "high", reason: "Endokrin bozucu ftalat", source: "NIH" },
  { inci: "Dibutyl Phthalate", risk: "high", reason: "Üreme toksisitesi olan ftalat", source: "NIH/EPA" },
  { inci: "Di-2-Ethylhexyl Phthalate", risk: "high", reason: "Endokrin bozucu", source: "NIH" },
  { inci: "Phthalic Acid", risk: "high", reason: "Ftalat türevi", source: "EPA" },
  { inci: "Toluene", risk: "high", reason: "Nörotoksik, üreme toksik", source: "OSHA/FDA" },
  { inci: "Triclosan", risk: "high", reason: "Endokrin bozucu, tiroid fonksiyonu etkiler", source: "FDA" },
  { inci: "Methylisothiazolinone", risk: "high", reason: "Güçlü alerjen, cilt hassasiyeti", source: "SCCS" },
  { inci: "Methylchloroisothiazolinone", risk: "high", reason: "Ciddi kontakt alerjen", source: "SCCS" },
  { inci: "Lead Acetate", risk: "high", reason: "Kurşun bileşiği - nörotoksik", source: "FDA" },
  { inci: "Mercury", risk: "high", reason: "Civa - nörotoksik teratojen", source: "WHO" },
  { inci: "Thimerosal", risk: "high", reason: "Civa türevi", source: "FDA" },
  { inci: "Coal Tar", risk: "high", reason: "Karsinojen potansiyeli", source: "IARC" },
  { inci: "Aminophenol", risk: "high", reason: "Saç boyası kimyasalı, emilim riski", source: "SCCS" },
  { inci: "Diaminobenzene", risk: "high", reason: "PPD - saç boyası alerjeni", source: "SCCS" },
  { inci: "Camphor", risk: "moderate", reason: "Yüksek dozda nörotoksik, topikal düşük dozda dikkatli kullan", source: "NIH" },
  { inci: "Minoxidil", risk: "high", reason: "Saç dökülmesi ilacı - hamilelikte kontrendike", source: "FDA Category C" },
  { inci: "Aluminum Chlorohydrate", risk: "moderate", reason: "Alüminyum tuzları, yüksek emilim alanlarında dikkat", source: "SCCS" },
  { inci: "Parabens", risk: "moderate", reason: "Zayıf östrojen taklitçisi, tartışmalı", source: "SCCS/EWG" },
  { inci: "Butylparaben", risk: "moderate", reason: "Endokrin bozucu potansiyeli en yüksek paraben", source: "SCCS" },
  { inci: "Propylparaben", risk: "moderate", reason: "Endokrin bozucu potansiyeli", source: "SCCS" },
  { inci: "Benzophenone-3", risk: "moderate", reason: "Oxybenzone - endokrin bozucu potansiyeli", source: "EWG" },
  { inci: "Oxybenzone", risk: "moderate", reason: "Endokrin bozucu, kan dolaşımına geçer", source: "FDA/EWG" },
  { inci: "Octinoxate", risk: "moderate", reason: "Endokrin bozucu potansiyeli", source: "EWG" },
  { inci: "Homosalate", risk: "moderate", reason: "Endokrin bozucu potansiyeli", source: "SCCS" },
  { inci: "Octocrylene", risk: "moderate", reason: "Alerji potansiyeli, benzofenon dönüşümü", source: "SCCS" },
  { inci: "Avobenzone", risk: "moderate", reason: "Kararsız UV filtre, parçalanma ürünleri", source: "EWG" },
  { inci: "BHA", risk: "moderate", reason: "Bütillenmiş hidroksianisol - endokrin bozucu", source: "NIH/NTP" },
  { inci: "BHT", risk: "moderate", reason: "Bütillenmiş hidroksitoluen - endokrin bozucu potansiyeli", source: "NIH" },
  { inci: "Thioglycolic Acid", risk: "high", reason: "Perma/düzleştirme kimyasalı, emilim riski", source: "CIR" },
  { inci: "Ammonia", risk: "moderate", reason: "Saç boyası, inhalasyon riski", source: "OSHA" },
  { inci: "Ethanolamine", risk: "moderate", reason: "Saç boyası bazı, deri emilimi", source: "SCCS" },
  { inci: "Diethanolamine", risk: "high", reason: "Nitrozamin oluşum riski", source: "FDA/CIR" },
  { inci: "Triethanolamine", risk: "moderate", reason: "Nitrozamin oluşum riski, pH ayarlayıcı", source: "CIR" },
];

export const PREGNANCY_CAUTION: PregnancyIngredient[] = [
  { inci: "Salicylic Acid", risk: "low", reason: "%2 altında topikal kullanım güvenli kabul ediliyor, oral aspirin kaçının", source: "ACOG" },
  { inci: "Benzoyl Peroxide", risk: "low", reason: "Düşük emilim, %5 altı kısa süreli kullanım güvenli", source: "ACOG" },
  { inci: "Glycolic Acid", risk: "low", reason: "Düşük konsantrasyonlarda (%10 altı) güvenli kabul ediliyor", source: "CIR" },
  { inci: "Lactic Acid", risk: "low", reason: "Doğal AHA, düşük konsantrasyonda güvenli", source: "CIR" },
  { inci: "Mandelic Acid", risk: "low", reason: "Büyük molekül, düşük penetrasyon", source: "CIR" },
  { inci: "Azelaic Acid", risk: "low", reason: "Hamilelikte kullanılabilir, dermatoloji onaylı", source: "ACOG/FDA Category B" },
  { inci: "Niacinamide", risk: "low", reason: "Genellikle güvenli, yüksek dozdan kaçının", source: "CIR" },
  { inci: "Vitamin C", risk: "low", reason: "Topikal kullanım güvenli", source: "CIR" },
  { inci: "Ascorbic Acid", risk: "low", reason: "Topikal kullanım güvenli", source: "CIR" },
  { inci: "Hyaluronic Acid", risk: "low", reason: "Güvenli, vücutta doğal olarak bulunur", source: "CIR" },
  { inci: "Centella Asiatica Extract", risk: "low", reason: "Topikal kullanım güvenli", source: "CIR" },
  { inci: "Arbutin", risk: "low", reason: "Düşük konsantrasyonda güvenli, hidroquinon dönüşümü minimal", source: "SCCS" },
  { inci: "Kojic Acid", risk: "low", reason: "Topikal kullanımda düşük emilim", source: "CIR" },
  { inci: "Bakuchiol", risk: "low", reason: "Retinol alternatifi, hamilelikte güvenli kabul ediliyor", source: "Journal of British Dermatology" },
  { inci: "Tea Tree Oil", risk: "low", reason: "Düşük konsantrasyonda güvenli, saf yağ kaçının", source: "CIR" },
  { inci: "Witch Hazel", risk: "low", reason: "Topikal kullanım güvenli", source: "CIR" },
  { inci: "Caffeine", risk: "low", reason: "Topikal kullanım güvenli (göz altı kremleri vb.)", source: "CIR" },
  { inci: "Zinc Oxide", risk: "low", reason: "Mineral güneş koruyucu, güvenli", source: "FDA/ACOG" },
  { inci: "Titanium Dioxide", risk: "low", reason: "Mineral güneş koruyucu, güvenli", source: "FDA/ACOG" },
  { inci: "Ceramide NP", risk: "low", reason: "Cilt bariyeri destekçisi, güvenli", source: "CIR" },
  { inci: "Squalane", risk: "low", reason: "Doğal nemlendirici, güvenli", source: "CIR" },
  { inci: "Panthenol", risk: "low", reason: "B5 vitamini türevi, güvenli", source: "CIR" },
  { inci: "Allantoin", risk: "low", reason: "Yatıştırıcı, güvenli", source: "CIR" },
  { inci: "Bisabolol", risk: "low", reason: "Papatya türevi yatıştırıcı, güvenli", source: "CIR" },
  { inci: "Aloe Barbadensis Leaf Juice", risk: "low", reason: "Topikal kullanım güvenli (oral kaçının)", source: "NIH" },
  { inci: "Shea Butter", risk: "low", reason: "Doğal yağ, güvenli", source: "CIR" },
  { inci: "Jojoba Oil", risk: "low", reason: "Doğal yağ, güvenli", source: "CIR" },
  { inci: "Rosehip Oil", risk: "low", reason: "Doğal olarak retinol içerir ama düşük dozda güvenli", source: "CIR" },
  { inci: "Glycerin", risk: "low", reason: "Temel nemlendirici, güvenli", source: "CIR" },
  { inci: "Dimethicone", risk: "low", reason: "Silikon, emilmeyen bariyer, güvenli", source: "CIR" },
];

export function checkPregnancySafety(ingredients: string[]): {
  avoid: { inci: string; info: PregnancyIngredient }[];
  caution: { inci: string; info: PregnancyIngredient }[];
  safe: string[];
} {
  const avoid: { inci: string; info: PregnancyIngredient }[] = [];
  const caution: { inci: string; info: PregnancyIngredient }[] = [];
  const safe: string[] = [];

  for (const ingredient of ingredients) {
    const normalized = ingredient.toLowerCase().trim();

    const avoidMatch = PREGNANCY_AVOID.find(
      (p) => normalized.includes(p.inci.toLowerCase()) || p.inci.toLowerCase().includes(normalized)
    );
    if (avoidMatch) {
      avoid.push({ inci: ingredient, info: avoidMatch });
      continue;
    }

    const cautionMatch = PREGNANCY_CAUTION.find(
      (p) => normalized.includes(p.inci.toLowerCase()) || p.inci.toLowerCase().includes(normalized)
    );
    if (cautionMatch) {
      caution.push({ inci: ingredient, info: cautionMatch });
      continue;
    }

    safe.push(ingredient);
  }

  return { avoid, caution, safe };
}
