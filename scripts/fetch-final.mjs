import fs from "fs";
import path from "path";
import https from "https";

// Real channels to replace the 15 fake ones
const toDownload = [
  { handle: "@beyzanurozcelik", file: "beyzanur-ozcelik.jpg" },
  { handle: "@SudeKozmetik", file: "sude-kozmetik.jpg" },
  { handle: "@pinkpandaaa", file: "pinkpanda.jpg" },
  { handle: "@ilaydaakan", file: "ilayda-akan.jpg" },
  { handle: "@sinemakyaj", file: "sine-makyaj.jpg" },
  { handle: "@beyazzeytin", file: "beyaz-zeytin.jpg" },
  { handle: "@ceylanozbudak", file: "ceylan-ozbudak.jpg" },
  { handle: "@MannyMua733", file: "manny-mua.jpg" },
  { handle: "@PatrickStarrr", file: "patrick-starrr.jpg" },
  { handle: "@shereeneidriss", file: "shereene-idriss.jpg" },
  { handle: "@Sacheu", file: "sacheu.jpg" },
  { handle: "@ByJordyn", file: "by-jordyn.jpg" },
  { handle: "@DermDoctor", file: "derm-doctor.jpg" },
  { handle: "@paintedbyspencer", file: "painted-by-spencer.jpg" },
  { handle: "@skincarebyhyram", file: "skincare-by-hyram.jpg" },
];

const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "channels");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const stream = fs.createWriteStream(filepath);
      res.pipe(stream);
      stream.on("finish", () => { stream.close(); resolve(); });
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const ch of toDownload) {
    const fp = path.join(OUTPUT_DIR, ch.file);
    if (fs.existsSync(fp)) { console.log(`SKIP ${ch.file}`); continue; }

    try {
      const html = (await fetchUrl(`https://www.youtube.com/${ch.handle}`)).toString();
      const match = html.match(/(https:\/\/yt3\.googleusercontent\.com\/[a-zA-Z0-9_\-\/=]+)/);
      if (match) {
        const url = match[1].replace(/=s\d+/, "=s240");
        await downloadImage(url, fp);
        console.log(`✅ ${ch.file}`);
      } else {
        console.log(`❌ ${ch.file} - no avatar`);
      }
    } catch (e) {
      console.log(`❌ ${ch.file} - ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 800));
  }
}

main();
