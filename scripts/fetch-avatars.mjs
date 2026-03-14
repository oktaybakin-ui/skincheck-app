import fs from "fs";
import path from "path";
import https from "https";

const channels = [
  { name: "İrem Güzey", handle: "@iremguzey", file: "irem-guzey.jpg" },
  { name: "Aslı Afşaroğlu", handle: "@asliafsar", file: "asli-afsaroglu.jpg" },
  { name: "Orkide Taşkın", handle: "@OrkideTaskin", file: "orkide-taskin.jpg" },
  { name: "Ecem Karavus", handle: "@ecemkaravus", file: "ecem-karavus.jpg" },
  { name: "Betül Bayraktar", handle: "@betulbayraktar", file: "betul-bayraktar.jpg" },
  { name: "Nil Keser", handle: "@NilKeser", file: "nil-keser.jpg" },
  { name: "Ece Targıt", handle: "@ecetargit", file: "ece-targit.jpg" },
  { name: "Selin Ciğerci", handle: "@selincigerci", file: "selin-cigerci.jpg" },
  { name: "Gökçe Bağcı", handle: "@gokcebagci", file: "gokce-bagci.jpg" },
  { name: "Melis Aygün", handle: "@melisaygun", file: "melis-aygun.jpg" },
  { name: "Cansu Dengey", handle: "@cansudengey", file: "cansu-dengey.jpg" },
  { name: "Nazlı Çelik", handle: "@nazlicelik", file: "nazli-celik.jpg" },
  { name: "Pelin Akıl", handle: "@pelinakil", file: "pelin-akil.jpg" },
  { name: "Dr. Ece Elmas", handle: "@dreceelmas", file: "dr-ece-elmas.jpg" },
  { name: "Tuğçe Kandemir", handle: "@tugcekandemir", file: "tugce-kandemir.jpg" },
  { name: "Şeyda Erdoğan", handle: "@seydaerdogan", file: "seyda-erdogan.jpg" },
  { name: "Burcu Özberk", handle: "@burcuozberk", file: "burcu-ozberk.jpg" },
  { name: "Fulya Öztürk", handle: "@fulyaozturk", file: "fulya-ozturk.jpg" },
  { name: "Yasemin Sakallıoğlu", handle: "@yaseminsakallioglu", file: "yasemin-sakallioglu.jpg" },
  { name: "Aleyna Tilki Beauty", handle: "@aleynatilkibeauty", file: "aleyna-tilki-beauty.jpg" },
  { name: "Didem Soydan", handle: "@didemsoydan", file: "didem-soydan.jpg" },
  { name: "James Charles", handle: "@jamescharles", file: "james-charles.jpg" },
  { name: "NikkieTutorials", handle: "@NikkieTutorials", file: "nikkie-tutorials.jpg" },
  { name: "Dr. Dray", handle: "@DrDray", file: "dr-dray.jpg" },
  { name: "Lisa Eldridge", handle: "@lisaeldridge", file: "lisa-eldridge.jpg" },
  { name: "Wayne Goss", handle: "@WayneGoss", file: "wayne-goss.jpg" },
  { name: "Beauty Within", handle: "@BeautyWithin", file: "beauty-within.jpg" },
  { name: "Liah Yoo", handle: "@LiahYoo", file: "liah-yoo.jpg" },
  { name: "Mixed Makeup", handle: "@MixedMakeup", file: "mixed-makeup.jpg" },
  { name: "Labmuffin Beauty Science", handle: "@LabMuffinBeautyScience", file: "labmuffin.jpg" },
  { name: "Cassandra Bankson", handle: "@CassandraBankson", file: "cassandra-bankson.jpg" },
  { name: "Alexandra Anele", handle: "@AlexandraAnele", file: "alexandra-anele.jpg" },
  { name: "Charlotte Tilbury", handle: "@CharlotteTilbury", file: "charlotte-tilbury.jpg" },
  { name: "Hung Vanngo", handle: "@HungVanngo", file: "hung-vanngo.jpg" },
  { name: "Dr. Shereene Idriss", handle: "@DrShereeneIdriss", file: "dr-shereene-idriss.jpg" },
  { name: "Kelly Gooch", handle: "@KellyGooch", file: "kelly-gooch.jpg" },
  { name: "Ava Lee", handle: "@AvaLee", file: "ava-lee.jpg" },
  { name: "Nadina Ioana", handle: "@NadinaIoana", file: "nadina-ioana.jpg" },
  { name: "Penn Smith", handle: "@PennSmith", file: "penn-smith.jpg" },
  { name: "Gothamista", handle: "@Gothamista", file: "gothamista.jpg" },
];

const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "channels");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({ body: Buffer.concat(chunks), status: res.statusCode, contentType: res.headers["content-type"] }));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("timeout")); });
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
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const stream = fs.createWriteStream(filepath);
      res.pipe(stream);
      stream.on("finish", () => { stream.close(); resolve(true); });
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

async function getAvatarUrl(handle) {
  const url = `https://www.youtube.com/${handle}`;
  const { body } = await fetchUrl(url);
  const html = body.toString("utf-8");

  // Try multiple patterns to find avatar
  const patterns = [
    /(https:\/\/yt3\.googleusercontent\.com\/[a-zA-Z0-9_\-\/=]+)/g,
  ];

  const matches = new Set();
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(html)) !== null) {
      matches.add(m[1]);
    }
  }

  // Find the avatar (typically the first yt3 URL that appears in avatar context)
  const allMatches = [...matches];

  // Look for avatar-specific URL (usually has specific size params)
  const avatarMatch = html.match(/"avatar".*?"url":"(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/);
  if (avatarMatch) {
    let avatarUrl = avatarMatch[1];
    // Get higher resolution
    avatarUrl = avatarUrl.replace(/=s\d+/, "=s240");
    return avatarUrl;
  }

  // Fallback: first yt3 URL
  if (allMatches.length > 0) {
    let avatarUrl = allMatches[0];
    avatarUrl = avatarUrl.replace(/=s\d+/, "=s240");
    return avatarUrl;
  }

  return null;
}

async function processChannel(ch, index) {
  const filepath = path.join(OUTPUT_DIR, ch.file);

  // Skip if already exists
  if (fs.existsSync(filepath)) {
    console.log(`[${index + 1}/${channels.length}] SKIP ${ch.name} (exists)`);
    return true;
  }

  try {
    console.log(`[${index + 1}/${channels.length}] Fetching ${ch.name} (${ch.handle})...`);
    const avatarUrl = await getAvatarUrl(ch.handle);

    if (!avatarUrl) {
      console.log(`  ❌ No avatar found for ${ch.name}`);
      return false;
    }

    console.log(`  📥 Downloading avatar...`);
    await downloadImage(avatarUrl, filepath);
    console.log(`  ✅ Saved ${ch.file}`);
    return true;
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
    return false;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Fetching avatars for ${channels.length} channels...\n`);

  let success = 0;
  let failed = 0;

  // Process in batches of 3 to avoid rate limiting
  for (let i = 0; i < channels.length; i += 3) {
    const batch = channels.slice(i, i + 3);
    const results = await Promise.all(batch.map((ch, j) => processChannel(ch, i + j)));
    results.forEach(r => r ? success++ : failed++);

    // Small delay between batches
    if (i + 3 < channels.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n✅ Done: ${success} downloaded, ${failed} failed`);
}

main().catch(console.error);
