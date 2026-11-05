// Annotated stages for Taaweel: each is a REAL screenshot in a device frame.
// Note targets `at` are in the source PNG's pixels; `chip` is [anchor x, y] on the 1200x600 stage canvas.
// The chip's edge sits on the anchor, so connectors land exactly whatever the label length.
// Screens and crops are cut by build/gen-taaweel-stages.py from build/taaweel-stage-crops.json.
import { readFileSync } from "node:fs";
const { screens, crops } = JSON.parse(readFileSync(new URL("./taaweel-stage-crops.json", import.meta.url), "utf8"));

const L = 215, R = 985;
const stage = (o) => ({ ...o, box: screens[o.img] });
const crop = (name, x, y, w) => {
  const b = crops[name][1];
  return { name, x, y, w, dw: b[2] - b[0], dh: b[3] - b[1] };
};

export const STAGES = {
  dashboard: stage({ img: "dashboard", device: "laptop", tone: "green", badges: ["search", "tasks"],
    notes: [
      { t: "Stats for every run at a glance", at: [600, 210], chip: [L, 130] },
      { t: "Ask any research question", at: [168, 362], chip: [L, 275] },
      { t: "Refine it in chat before it runs", at: [1305, 362], chip: [R, 230] },
      { t: "Each run listed with its status", at: [900, 590], chip: [R, 365] },
    ],
    crops: [crop("latest-run", 40, 440, 400)] }),
  run: stage({ img: "run", device: "laptop", tone: "violet", badges: ["check", "coin"],
    notes: [
      { t: "All 13 stages tracked to the end", at: [212, 218], chip: [L, 115] },
      { t: "Tokens and cost on the record", at: [200, 294], chip: [L, 250] },
      { t: "Open the report or the full trace", at: [613, 360], chip: [R, 165] },
      { t: "Model and tokens for each stage", at: [1291, 534], chip: [R, 320] },
    ],
    crops: [crop("progress", 30, 405, 350)] }),
  report: stage({ img: "report", device: "monitor", tone: "amber", badges: ["doc", "book"],
    notes: [
      { t: "The research question, stated in full", at: [250, 400], chip: [L, 250] },
      { t: "Export, print or open the trace", at: [1157, 32], chip: [R, 90] },
      { t: "Stamped with run, version and date", at: [818, 140], chip: [R, 225] },
    ],
    crops: [crop("stamp", 790, 445, 380)] }),
  "trace-corpus": stage({ img: "trace-corpus", device: "monitor", tone: "teal", badges: ["layers", "search"],
    notes: [
      { t: "Walks all 6,236 verses and counts each one", at: [408, 599], chip: [L, 300] },
      { t: "Nothing generated: the pipeline's own record", at: [880, 318], chip: [R, 95] },
      { t: "Stages, tokens and cost for the run", at: [705, 407], chip: [R, 240] },
    ],
    crops: [crop("clusters", 760, 385, 420)] }),
  "ontology-graph": stage({ img: "ontology-graph", device: "browser", domain: "taaweel.snapkodex.com", tone: "violet", badges: ["graph", "search"],
    notes: [
      { t: "Concepts and entities, linked as a graph", at: [378, 425], chip: [L, 170] },
      { t: "Switch between 2D and 3D", at: [1065, 108], chip: [R, 105] },
      { t: "Click a node to see its verses", at: [1148, 242], chip: [R, 250] },
    ],
    crops: [crop("legend", 95, 285, 112)] }),
  mizan: stage({ img: "mizan", device: "browser", tone: "amber", badges: ["scale", "bars"],
    notes: [
      { t: "Type a verse, surah or word", at: [560, 458], chip: [L, 215] },
      { t: "Hafs text: 6,236 verses, 77,429 words", at: [712, 652], chip: [L, 365] },
      { t: "Or start from a ready example", at: [1068, 533], chip: [R, 230] },
    ],
    crops: [crop("number-checks", 880, 425, 280)] }),
  evidence: stage({ img: "evidence", device: "tablet", tone: "green", badges: ["shield", "flag"],
    notes: [
      { t: "Stage 10: it argues against itself", at: [100, 455], chip: [L, 185] },
      { t: "Stage 12: usul audit and verdict", at: [100, 557], chip: [L, 335] },
      { t: "Model and tokens for every stage", at: [1200, 250], chip: [R, 150] },
    ],
    crops: [crop("audit-stages", 770, 385, 400)] }),
  "trace-tafsir": stage({ img: "trace-tafsir", device: "tablet", tone: "teal", badges: ["book", "filter"],
    notes: [
      { t: "80 tafsir passages from 4 sources", at: [36, 108], chip: [L, 155] },
      { t: "Hadith weighed: 0 of 7 carried forward", at: [36, 417], chip: [R, 185] },
      { t: "Everything recorded, by kind", at: [36, 694], chip: [R, 335] },
    ],
    crops: [crop("tafsir-sources", 40, 345, 225)] }),
};

export const HERO_CROPS = { progress: crop("progress", 0, 0, 0), cost: crop("cost", 0, 0, 0) };
