import fs from "node:fs"; import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "..");
const files = []; const walk = (d) => { for (const f of fs.readdirSync(d)) { if (["node_modules", ".git", "functions", "build", "backups", "production"].includes(f)) continue; const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) files.push(p); } };
walk(ROOT);
let bad = 0;
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(/href="(\/[^"#?]*)(?:#[^"]*)?"/g)) {
    let u = decodeURIComponent(m[1]); if (u.startsWith("//")) continue;
    const target = path.join(ROOT, u);
    const ok = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, "index.html")));
    const sm = u === "/sitemap.xml" || u === "/blog" || u.startsWith("/blog/") || u === "/api/blog";
    if (!ok && !sm) { console.log("BROKEN", path.relative(ROOT, f), u); bad++; }
  }
}
console.log(bad ? `${bad} broken` : "links ok", files.length, "files");
