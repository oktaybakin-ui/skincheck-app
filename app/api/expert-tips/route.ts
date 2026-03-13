import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface PubMedArticle {
  uid: string;
  title: string;
  authors: { name: string }[];
  source: string; // journal
  pubdate: string;
}

const SEARCH_QUERIES = [
  "skincare dermatology cosmetic ingredients safety",
  "sunscreen SPF skin protection",
  "retinoid skin anti-aging",
  "niacinamide skin benefits",
  "moisturizer skin barrier repair",
  "acne treatment skincare routine",
];

async function fetchPubMedArticles(): Promise<PubMedArticle[]> {
  const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];

  // Step 1: Search PubMed for IDs
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=6&sort=date&retmode=json`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  const ids: string[] = searchData?.esearchresult?.idlist || [];

  if (ids.length === 0) return [];

  // Step 2: Fetch article summaries
  const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`;
  const summaryRes = await fetch(summaryUrl);
  const summaryData = await summaryRes.json();

  const articles: PubMedArticle[] = [];
  for (const id of ids) {
    const article = summaryData?.result?.[id];
    if (article && article.title) {
      articles.push({
        uid: id,
        title: article.title,
        authors: article.authors || [],
        source: article.source || "",
        pubdate: article.pubdate || "",
      });
    }
  }

  return articles;
}

export async function GET(req: NextRequest) {
  try {
    const locale = req.nextUrl.searchParams.get("locale") || "tr";
    const articles = await fetchPubMedArticles();

    if (articles.length === 0) {
      return NextResponse.json({ tips: [], source: "pubmed" });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return raw English articles without translation
      const tips = articles.map((a, i) => ({
        id: a.uid,
        expert: a.authors[0]?.name || "Research Team",
        title: a.source,
        topic: a.title.replace(/\.$/, ""),
        content: `Published in ${a.source}, ${a.pubdate}`,
        tags: [],
        pubmed_id: a.uid,
      }));
      return NextResponse.json({ tips, source: "pubmed" });
    }

    const localeNames: Record<string, string> = {
      tr: "Türkçe",
      en: "English",
      ar: "العربية",
      de: "Deutsch",
      fr: "Français",
    };

    const targetLang = localeNames[locale] || "Türkçe";

    const articleList = articles
      .map((a, i) => `${i + 1}. "${a.title}" - ${a.authors[0]?.name || "Unknown"} (${a.source}, ${a.pubdate}) [PMID: ${a.uid}]`)
      .join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Aşağıdaki PubMed dermatologi/kozmetik araştırma makalelerini ${targetLang} dilinde halk için anlaşılır cilt bakım ipuçlarına dönüştür.

Her makale için:
- Makalenin konusuna dayalı pratik bir cilt bakım ipucu yaz (bilimsel ama anlaşılır)
- Makale yazarını uzman olarak kullan
- 2-3 ilgili etiket ekle

Makaleler:
${articleList}

JSON formatında yanıtla (sadece JSON, başka metin yok):
[
  {
    "id": "pmid",
    "expert": "yazar adı",
    "title": "uzmanlık alanı (Dermatolog / Araştırmacı vb.)",
    "topic": "ipucu başlığı",
    "content": "2-3 cümle pratik ipucu",
    "tags": ["etiket1", "etiket2"],
    "pubmed_id": "pmid"
  }
]`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return NextResponse.json({ tips: [], source: "pubmed", error: "parse_failed" });
    }

    const tips = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      tips,
      source: "pubmed",
      article_count: articles.length,
    });
  } catch (error) {
    console.error("Expert tips error:", error);
    return NextResponse.json({ tips: [], source: "pubmed", error: "fetch_failed" }, { status: 500 });
  }
}
