# Generate premium framed+annotated SVGs around real Taaweel app screenshots.
# Each SVG embeds its PNG (relative href, same folder) inside a browser-chrome frame
# and draws annotation chips with elbow connectors pointing at features.
# Usage: python build/gen-taaweel-frames.py   (run from repo root)
# Screenshots are embedded as base64 WebP so each SVG is self-contained
# (SVGs rendered via <img> cannot reference external files).
import base64, io
from PIL import Image

OUT = "assets/taaweel-app"
DOMAIN = "taaweel.snapkodex.com"

# canvas layout: wide margins leave room for annotation chips on both sides
CANVAS_W = 1240
FRAME_X, FRAME_Y, FRAME_W = 20, 20, 1200
CHROME_H = 46
IMG_X = 262
IMG_W = 656
PAD = 36  # outer padding for chips

def wrap(label, maxlen):
    words, lines, cur = label.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if len(t) <= maxlen or not cur:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# annotations: (label, tx, ty, side, dy, order) -- tx/ty in ORIGINAL png pixels
SHOTS = {
  "dashboard": [
    ("Ask a question", 560, 330, "L", 0),
    ("Refine first, then run", 1090, 325, "R", -40),
    ("Every run saved with its stages", 700, 565, "R", 70),
  ],
  "run": [
    ("13 of 13 stages complete", 830, 296, "R", -20),
    ("Tokens and cost on record", 480, 382, "L", 0),
    ("Model, tokens and cost per stage", 760, 700, "R", 60),
  ],
  "report": [
    ("Answer first, then the argument", 700, 118, "R", -20),
    ("Contents you can check", 170, 430, "L", 20),
    ("Every claim carries a citation", 760, 440, "R", 100),
  ],
  "evidence": [
    ("Thirteen saved stages", 676, 240, "R", -30),
    ("Critique stage on the record", 676, 520, "L", 40),
  ],
  "trace-corpus": [
    ("Every occurrence clustered by sense", 300, 260, "L", -20),
    ("Verse groups with attributes", 350, 430, "R", 10),
  ],
  "trace-tafsir": [
    ("Which tafsir it read", 500, 212, "R", -40),
    ("Passages kept and set aside", 460, 430, "L", 30),
  ],
  "ontology-graph": [
    ("Concepts entities and links", 676, 460, "R", 0),
    ("Provenance one click away", 480, 330, "L", 0),
  ],
  "mizan": [
    ("Verse surah or word", 640, 225, "L", 0),
    ("Every number shows its rule", 640, 520, "R", 30),
  ],
}

def make(name, anns):
    png = f"{name}.png"
    iw, ih = Image.open(f"{OUT}/{png}").size
    s = IMG_W / iw
    img_h = round(ih * s)
    frame_h = CHROME_H + 12 + img_h + 20
    canvas_h = frame_h + 40
    u = name.replace("-", "")

    p = []
    p.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{CANVAS_W}" height="{canvas_h}" viewBox="0 0 {CANVAS_W} {canvas_h}" fill="none" role="img" aria-label="Taaweel app screenshot in an annotated frame">')
    p.append(f'''<defs>
<linearGradient id="{u}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d1a12"/><stop offset=".55" stop-color="#15120a"/><stop offset="1" stop-color="#100e08"/></linearGradient>
<linearGradient id="{u}chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(234,228,211,.07)"/><stop offset="1" stop-color="rgba(234,228,211,.02)"/></linearGradient>
<filter id="{u}ds" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity=".45"/></filter>
<filter id="{u}glow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#4f8a1c" flood-opacity=".22"/></filter>
</defs>''')
    p.append(f'<rect x="{FRAME_X}" y="{FRAME_Y}" width="{FRAME_W}" height="{frame_h}" rx="18" fill="url(#{u}bg)" stroke="rgba(234,228,211,.13)" filter="url(#{u}glow)"/>')
    cy = FRAME_Y + CHROME_H / 2
    p.append(f'<path d="M{FRAME_X+1} {FRAME_Y+1}h{FRAME_W-2}v{CHROME_H}h-{FRAME_W-2}z" fill="url(#{u}chrome)"/>')
    p.append(f'<line x1="{FRAME_X}" y1="{FRAME_Y+CHROME_H}" x2="{FRAME_X+FRAME_W}" y2="{FRAME_Y+CHROME_H}" stroke="rgba(234,228,211,.09)"/>')
    for i, c in enumerate(["#b4532a", "#ffc857", "#6aa629"]):
        p.append(f'<circle cx="{FRAME_X+26+i*18}" cy="{cy}" r="5" fill="{c}" opacity=".8"/>')
    pill_w = 300
    px = (CANVAS_W - pill_w) / 2
    p.append(f'<rect x="{px}" y="{cy-13}" width="{pill_w}" height="26" rx="13" fill="rgba(10,9,6,.55)" stroke="rgba(234,228,211,.14)"/>')
    p.append(f'<circle cx="{px+18}" cy="{cy}" r="3" fill="#8ccb45"/>')
    p.append(f'<text x="{px+30}" y="{cy+4}" font-family="Space Grotesk,\'Segoe UI\',sans-serif" font-size="12" fill="rgba(234,228,211,.6)">{DOMAIN}</text>')
    p.append(f'<text x="{FRAME_X+FRAME_W-24}" y="{cy+4}" text-anchor="end" font-family="Amiri,\'Noto Naskh Arabic\',serif" font-size="13" fill="rgba(140,203,69,.6)">&#x62A;&#x623;&#x648;&#x64A;&#x644;</text>')

    img_y = FRAME_Y + CHROME_H + 12
    p.append(f'<g filter="url(#{u}ds)"><rect x="{IMG_X-1}" y="{img_y-1}" width="{IMG_W+2}" height="{img_h+2}" rx="10" fill="#0d0b07"/></g>')
    p.append(f'<clipPath id="{u}clip"><rect x="{IMG_X}" y="{img_y}" width="{IMG_W}" height="{img_h}" rx="9"/></clipPath>')
    buf = io.BytesIO()
    Image.open(f"{OUT}/{png}").convert("RGB").save(buf, "WEBP", quality=85, method=6)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    p.append(f'<image href="data:image/webp;base64,{b64}" x="{IMG_X}" y="{img_y}" width="{IMG_W}" height="{img_h}" clip-path="url(#{u}clip)" preserveAspectRatio="xMidYMid slice"/>')
    p.append(f'<rect x="{IMG_X}" y="{img_y}" width="{IMG_W}" height="{img_h}" rx="10" stroke="rgba(234,228,211,.1)" fill="none"/>')

    # sort chips per side by target y to avoid crossings
    for side in ("L", "R"):
        chips = [a for a in anns if a[3] == side]
        chips.sort(key=lambda a: a[2])
        taken = []
        for label, tx, ty, _, dy in chips:
            lines = wrap(label, 20 if side == "L" else 26)
            w = round(max(30 + 7.7 * len(l) for l in lines)) + 26
            h = 34 if len(lines) == 1 else 52
            ax = IMG_X + tx * s
            ay = img_y + ty * s
            top = ay + dy - h / 2
            top = max(FRAME_Y + CHROME_H + 10, min(top, img_y + img_h - h - 8))
            # avoid vertical overlap on the same side
            for (t0, h0) in taken:
                if top < t0 + h0 + 8 and top + h + 8 > t0:
                    top = t0 + h0 + 10
            taken.append((top, h))
            if side == "L":
                cx = IMG_X - 24 - w
                sx = cx + w
            else:
                cx = IMG_X + IMG_W + 24
                sx = cx
            midx = (sx + ax) / 2
            scy = top + h / 2
            p.append(f'<path d="M{round(sx,1)} {round(scy,1)}H{round(midx,1)}V{round(ay,1)}H{round(ax+9,1)}" stroke="rgba(140,203,69,.55)" stroke-width="1.3" fill="none"/>')
            p.append(f'<g filter="url(#{u}ds)"><rect x="{cx}" y="{top}" width="{w}" height="{h}" rx="14" fill="rgba(18,16,10,.95)" stroke="rgba(140,203,69,.45)"/></g>')
            p.append(f'<circle cx="{cx+15}" cy="{scy}" r="3.4" fill="#8ccb45"/>')
            for i, l in enumerate(lines):
                ly = scy + (5 if len(lines) == 1 else (i * 19 - 5))
                ly = scy + (5 if len(lines) == 1 else (i * 19 - 5))
                p.append(f'<text x="{cx+26}" y="{round(ly,1)}" font-family="Space Grotesk,\'Segoe UI\',sans-serif" font-size="14.5" fill="#eae4d3">{esc(l)}</text>')
            p.append(f'<circle cx="{round(ax,1)}" cy="{round(ay,1)}" r="7" fill="none" stroke="#8ccb45" stroke-width="1.6" opacity=".9"/>')
            p.append(f'<circle cx="{round(ax,1)}" cy="{round(ay,1)}" r="2.6" fill="#8ccb45"/>')
    p.append("</svg>")
    open(f"{OUT}/{name}.svg", "w", encoding="utf-8", newline="\n").write("\n".join(p))
    print(name, f"{CANVAS_W}x{canvas_h}")

for n, a in SHOTS.items():
    make(n, a)
print("done")
