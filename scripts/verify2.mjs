import https from "https";

const candidates = [
  // More Turkish beauty channels
  { handle: "@AsliBayyurt", name: "Aslı Bayyurt" },
  { handle: "@dilanhanedan", name: "Dilan Hanedan" },
  { handle: "@EdaSkincare", name: "Eda Skincare" },
  { handle: "@KubranurKosmetik", name: "Kübranur" },
  { handle: "@ilaydaakan", name: "İlayda Akan" },
  { handle: "@sinemakyaj", name: "Sine Makyaj" },
  { handle: "@beyazzeytin", name: "Beyaz Zeytin" },
  { handle: "@ceylanozbudak", name: "Ceylan Özbudak" },
  { handle: "@tubakurtce", name: "Tuba Kurtçe" },

  // International - well known
  { handle: "@PilotBeauty", name: "Pilot Beauty" },
  { handle: "@itslikelymakeup", name: "itslikelymakeup" },
  { handle: "@ShelbeyWilson", name: "Shelbey Wilson" },
  { handle: "@paintedbyspencer", name: "Painted by Spencer" },
  { handle: "@glamandgore", name: "Glam and Gore" },
  { handle: "@MannyMua733", name: "Manny MUA" },
  { handle: "@PatrickStarrr", name: "Patrick Starrr" },
  { handle: "@RachelRigler", name: "Rachel Rigler" },
  { handle: "@DrDrayzday", name: "Dr Dray" },
  { handle: "@dermdoctor", name: "Derm Doctor lower" },
  { handle: "@doctorly", name: "doctorly" },
  { handle: "@shereeneidriss", name: "Shereene Idriss" },
  { handle: "@nadinaioana", name: "Nadina Ioana lower" },
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
        // Extract subscriber count if possible
        const subMatch = html.match(/"subscriberCountText".*?"simpleText":"([^"]+)"/);
        resolve({ handle, status: res.statusCode, hasAvatar, subs: subMatch?.[1] || "?", htmlLen: html.length });
      });
    });
    req.on("error", () => resolve({ handle, status: 0, hasAvatar: false, subs: "?", htmlLen: 0 }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ handle, status: 0, hasAvatar: false, subs: "?", htmlLen: 0 }); });
  });
}

async function main() {
  for (let i = 0; i < candidates.length; i += 3) {
    const batch = candidates.slice(i, i + 3);
    const results = await Promise.all(batch.map(c => checkChannel(c.handle)));
    for (const r of results) {
      const c = candidates.find(c => c.handle === r.handle);
      const ok = r.status === 200 && r.hasAvatar;
      console.log(`${ok ? "✅" : "❌"} ${c.handle} | ${r.status} | subs: ${r.subs} | ${r.htmlLen}b`);
    }
    if (i + 3 < candidates.length) await new Promise(r => setTimeout(r, 800));
  }
}
main();
