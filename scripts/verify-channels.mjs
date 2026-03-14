import https from "https";

// Replacement candidates - real YouTube channels
const candidates = [
  // Turkish beauty/skincare channels (replacing fake ones)
  { handle: "@tugaboraofficial", name: "Tuba Bora" },
  { handle: "@MeltemAcikgoz", name: "Meltem Açıkgöz" },
  { handle: "@beyzanurozcelik", name: "Beyzanur Özçelik" },
  { handle: "@kozmetikkutusu", name: "Kozmetik Kutusu" },
  { handle: "@simaboraa", name: "Sima Bora" },
  { handle: "@elif.saadet", name: "Elif Saadet" },
  { handle: "@billurbeauty", name: "Billur Saatçi" },
  { handle: "@gizemsaracoglu", name: "Gizem Saraçoğlu" },
  { handle: "@yvttka", name: "Yasemin Savaş" },
  { handle: "@makeupbytugcee", name: "Makeupby Tuğçe" },
  { handle: "@SudeKozmetik", name: "Sude Kozmetik" },
  { handle: "@pinkpandaaa", name: "Pinkpanda" },
  { handle: "@seninhayatinnn", name: "Senin Hayatın" },

  // International beauty/skincare (replacing fake ones)
  { handle: "@DrShereeneIdriss", name: "Dr. Shereene Idriss" },
  { handle: "@NadinaIoana", name: "Nadina Ioana" },
  { handle: "@michelledy_", name: "Michelle Dy" },
  { handle: "@skincarebyhyram", name: "Skincare by Hyram" },
  { handle: "@SkinWithTy", name: "Skin With Ty" },
  { handle: "@DermDoctor", name: "Derm Doctor" },
  { handle: "@Sacheu", name: "Sarah Cheung" },
  { handle: "@ByJordyn", name: "Jordyn" },
];

function checkChannel(handle) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/${handle}`;
    const req = https.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        const html = Buffer.concat(chunks).toString();
        const hasAvatar = html.includes("yt3.googleusercontent.com");
        const is404 = res.statusCode === 404;
        resolve({ handle, status: res.statusCode, hasAvatar, is404, htmlLen: html.length });
      });
    });
    req.on("error", () => resolve({ handle, status: 0, hasAvatar: false, is404: true }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ handle, status: 0, hasAvatar: false, is404: true }); });
  });
}

async function main() {
  console.log("Checking candidate channels...\n");

  for (let i = 0; i < candidates.length; i += 3) {
    const batch = candidates.slice(i, i + 3);
    const results = await Promise.all(batch.map(c => checkChannel(c.handle)));
    for (const r of results) {
      const c = candidates.find(c => c.handle === r.handle);
      const status = r.is404 ? "❌ 404" : r.hasAvatar ? "✅ OK" : "⚠️ No avatar";
      console.log(`${status} | ${c.name} (${c.handle}) | HTTP ${r.status} | ${r.htmlLen} bytes`);
    }
    if (i + 3 < candidates.length) await new Promise(r => setTimeout(r, 1000));
  }
}

main();
