# Cut the real Taaweel screenshots into WebP device screens and 1:1 feature crops.
# Boxes live in build/taaweel-stage-crops.json (also read by build/content-taaweel-stages.mjs).
# Usage from repo root: python build/gen-taaweel-stages.py
import json, os
from PIL import Image

SRC = "assets/taaweel-app"
OUT = f"{SRC}/stage"
os.makedirs(OUT, exist_ok=True)
data = json.load(open("build/taaweel-stage-crops.json"))

for name, box in data["screens"].items():
    im = Image.open(f"{SRC}/{name}.png").convert("RGB").crop(box)
    if im.width > 1280:
        im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
    im.save(f"{OUT}/{name}.webp", "WEBP", quality=84, method=6)
    print(name, im.size)

for name, (src, box) in data["crops"].items():
    im = Image.open(f"{SRC}/{src}.png").convert("RGB").crop(box)
    im.save(f"{OUT}/crop-{name}.webp", "WEBP", quality=88, method=6)
    print("crop", name, im.size)
