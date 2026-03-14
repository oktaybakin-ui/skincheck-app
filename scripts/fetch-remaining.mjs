import fs from "fs";
import path from "path";
import https from "https";

const remaining = [
  { name: "Aslı Afşaroğlu", handle: "@asliafsar", file: "asli-afsaroglu.jpg" },
  { name: "Orkide Taşkın", handle: "@OrkideTaskin", file: "orkide-taskin.jpg" },
  { name: "Nil Keser", handle: "@NilKeser", file: "nil-keser.jpg" },
  { name: "Selin Ciğerci", handle: "@selincigerci", file: "selin-cigerci.jpg" },
  { name: "Nazlı Çelik", handle: "@nazlicelik", file: "nazli-celik.jpg" },
  { name: "Pelin Akıl", handle: "@pelinakil", file: "pelin-akil.jpg" },
  { name: "Dr. Ece Elmas", handle: "@dreceelmas", file: "dr-ece-elmas.jpg" },
  { name: "Tuğçe Kandemir", handle: "@tugcekandemir", file: "tugce-kandemir.jpg" },
  { name: "Şeyda Erdoğan", handle: "@seydaerdogan", file: "seyda-erdogan.jpg" },
  { name: "Burcu Özberk", handle: "@burcuozberk", file: "burcu-ozberk.jpg" },
  { name: "Fulya Öztürk", handle: "@fulyaozturk", file: "fulya-ozturk.jpg" },
  { name: "Aleyna Tilki Beauty", handle: "@aleynatilkibeauty", file: "aleyna-tilki-beauty.jpg" },
  { name: "Didem Soydan", handle: "@didemsoydan", file: "didem-soydan.jpg" },
  { name: "Dr. Shereene Idriss", handle: "@DrShereeneIdriss", file: "dr-shereene-idriss.jpg" },
  { name: "Nadina Ioana", handle: "@NadinaIoana", file: "nadina-ioana.jpg" },
];

const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "channels");

function fetchUrl(url, cookie) {
  return new Promise((resolve, reject) => {
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    };
    if (cookie) headers["Cookie"] = cookie;

    const req = https.get(url, { headers }, (res) => {
      // Collect set-cookie
      const setCookies = res.headers["set-cookie"] || [];
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith("http")) loc = new URL(loc, url).href;
        fetchUrl(loc, cookie).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({ body: Buffer.concat(chunks), status: res.statusCode, setCookies }));
    });
    req.on("error", reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const stream = fs.createWriteStream(filepath);
      res.pipe(stream);
      stream.on("finish", () => { stream.close(); resolve(true); });
    });
    req.on("error", reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

async function getConsentCookie() {
  // YouTube consent flow: first visit gives consent page with SOCS cookie
  try {
    const { setCookies } = await fetchUrl("https://www.youtube.com/");
    const consent = "SOCS=CAESEwgDEgk2NjQzMjU1MjQaAmVuIAEaBgiA_-S8Bg; CONSENT=PENDING+123";
    return consent;
  } catch {
    return "SOCS=CAESEwgDEgk2NjQzMjU1MjQaAmVuIAEaBgiA_-S8Bg; CONSENT=YES+cb.20231216-09-p0.en+FX+123";
  }
}

async function processChannel(ch, index, cookie) {
  const filepath = path.join(OUTPUT_DIR, ch.file);
  if (fs.existsSync(filepath)) {
    console.log(`[${index + 1}] SKIP ${ch.name} (exists)`);
    return true;
  }

  try {
    console.log(`[${index + 1}] Fetching ${ch.name} (${ch.handle})...`);
    const url = `https://www.youtube.com/${ch.handle}`;
    const { body } = await fetchUrl(url, cookie);
    const html = body.toString("utf-8");

    // Check if we got consent page
    if (html.includes("consent.youtube.com") || html.includes("Before you continue")) {
      console.log(`  ⚠️  Got consent page, trying with CONSENT=YES cookie...`);
      const { body: body2 } = await fetchUrl(url, "CONSENT=YES+cb.20231216-09-p0.en+FX+123; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMxMjEwLjA3X3AxGgJlbiADGgYIgP_kvAY");
      const html2 = body2.toString("utf-8");

      const match = html2.match(/(https:\/\/yt3\.googleusercontent\.com\/[a-zA-Z0-9_\-\/=]+)/);
      if (match) {
        let avatarUrl = match[1].replace(/=s\d+/, "=s240");
        await downloadImage(avatarUrl, filepath);
        console.log(`  ✅ Saved ${ch.file} (consent bypass)`);
        return true;
      }
    }

    // Normal extraction
    const avatarMatch = html.match(/"avatar".*?"url":"(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/);
    if (avatarMatch) {
      let avatarUrl = avatarMatch[1].replace(/=s\d+/, "=s240");
      await downloadImage(avatarUrl, filepath);
      console.log(`  ✅ Saved ${ch.file}`);
      return true;
    }

    const match = html.match(/(https:\/\/yt3\.googleusercontent\.com\/[a-zA-Z0-9_\-\/=]+)/);
    if (match) {
      let avatarUrl = match[1].replace(/=s\d+/, "=s240");
      await downloadImage(avatarUrl, filepath);
      console.log(`  ✅ Saved ${ch.file} (fallback pattern)`);
      return true;
    }

    console.log(`  ❌ No avatar found`);
    return false;
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("Getting consent cookie...");
  const cookie = await getConsentCookie();
  console.log(`Cookie: ${cookie.substring(0, 30)}...\n`);

  let success = 0, failed = 0;

  for (let i = 0; i < remaining.length; i++) {
    const ok = await processChannel(remaining[i], i, cookie);
    ok ? success++ : failed++;
    // Delay between requests
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\n✅ Done: ${success} success, ${failed} failed`);

  if (failed > 0) {
    console.log("\nFailed channels (will use ui-avatars fallback):");
    for (const ch of remaining) {
      if (!fs.existsSync(path.join(OUTPUT_DIR, ch.file))) {
        console.log(`  - ${ch.name}`);
      }
    }
  }
}

main().catch(console.error);
