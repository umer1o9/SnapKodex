// Shared helpers for the Snap Kodex static page generator.
// Run: node build/gen.mjs   (outputs HTML next to the source tree; commit the output)

import { navBlock, productNavBlock, richFooter, productFooterHtml } from "./nav.mjs";
export { navBlock, richFooter };

export const SITE = "https://snapkodex.com";
export const ORG = "Snap Kodex";

// Product URL bases. For a future spin-off to a standalone domain, change the base here and regenerate.
export const BASE = {
  taaweel: "/products/taaweel",
  home: "/products/homeschooling",
  snapprojects: "/products/snap-projects",
};
export const APP = {
  taaweel: "https://taaweel.snapkodex.com",
  home: "https://homeschooling.snapkodex.com/",
};

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- icons (24x24 line pictograms, brand gradient stroke) ----------
const I = {
  chat: '<path class="fill" d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4V16A1.5 1.5 0 0 1 4 14.5z"/><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4V16A1.5 1.5 0 0 1 4 14.5z"/><path d="M10 8.6a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2"/><circle class="dot" cx="12" cy="13.8" r=".7"/>',
  network: '<path d="M6.5 7 11 11M17.5 7 13 11M6.5 17 11 13M17.5 17 13 13"/><circle class="fill" cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="5" cy="5.5" r="2"/><circle cx="19" cy="5.5" r="2"/><circle cx="5" cy="18.5" r="2"/><circle cx="19" cy="18.5" r="2"/>',
  layers: '<path class="fill" d="m12 3 9 5-9 5-9-5z"/><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 16.5 9 5 9-5"/>',
  book: '<path class="fill" d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5.7 1.5 1.5z"/><path d="M6.5 8H9M15 8h2.5M6.5 11H9M15 11h2.5"/>',
  shield: '<path class="fill" d="M12 3l7 3v5.2c0 4.4-3 7.8-7 9.8-4-2-7-5.4-7-9.8V6z"/><path d="M12 3l7 3v5.2c0 4.4-3 7.8-7 9.8-4-2-7-5.4-7-9.8V6z"/><path d="m8.8 12 2.2 2.2L15.4 10"/>',
  graph: '<path d="M12 7.5V12M12 12l-5.5 5M12 12l5.5 5"/><circle class="fill" cx="12" cy="5" r="2.6"/><circle cx="12" cy="5" r="2.6"/><circle cx="5.5" cy="18" r="2.4"/><circle cx="18.5" cy="18" r="2.4"/><circle cx="12" cy="12" r="1.2"/>',
  scale: '<path d="M12 4v16M7.5 20h9M5 7h14"/><path class="fill" d="M5 7l-2.8 6.5a2.8 2.8 0 0 0 5.6 0z"/><path d="M5 7l-2.8 6.5a2.8 2.8 0 0 0 5.6 0zM19 7l-2.8 6.5a2.8 2.8 0 0 0 5.6 0z"/>',
  bars: '<path d="M3 20.5h18"/><rect class="fill" x="4.5" y="11" width="3.5" height="9.5" rx="1"/><rect x="4.5" y="11" width="3.5" height="9.5" rx="1"/><rect x="10.3" y="4" width="3.5" height="16.5" rx="1"/><rect x="16" y="8" width="3.5" height="12.5" rx="1"/>',
  cube: '<path class="fill" d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  sun: '<circle class="fill" cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>',
  route: '<circle class="fill" cx="6" cy="18" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H14a3.2 3.2 0 0 0 0-6.4h-4A3.2 3.2 0 0 1 10 5.2h5.6"/>',
  calendar: '<rect class="fill" x="3.5" y="5" width="17" height="15" rx="2.5"/><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M12 14h2M8 17h2M12 17h2"/>',
  play: '<rect class="fill" x="3" y="4.5" width="18" height="15" rx="3.5"/><rect x="3" y="4.5" width="18" height="15" rx="3.5"/><path d="m10 9 5 3-5 3z"/>',
  coin: '<circle class="fill" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="8.5"/><path d="M12 6.8v10.4M9.4 9.4c0-1 1.1-1.6 2.6-1.6s2.6.6 2.6 1.8c0 2.4-5.2 1.2-5.2 3.7 0 1.1 1.2 1.8 2.6 1.8s2.6-.6 2.6-1.6"/>',
  pair: '<circle class="fill" cx="9" cy="12" r="5.5"/><circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  eye: '<path class="fill" d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  globe: '<circle class="fill" cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3 3.2 15 0 18M12 3c-3.2 3-3.2 15 0 18"/>',
  blocks: '<rect class="fill" x="8" y="3" width="8" height="8" rx="1.8"/><rect x="8" y="3" width="8" height="8" rx="1.8"/><rect x="3" y="13" width="8" height="8" rx="1.8"/><rect x="13" y="13" width="8" height="8" rx="1.8"/>',
  mic: '<rect class="fill" x="9" y="3" width="6" height="11" rx="3"/><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  users: '<circle class="fill" cx="9" cy="8" r="3.2"/><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.8c1.8.7 3 2.4 3 5.2"/>',
  lock: '<rect class="fill" x="5" y="11" width="14" height="9.5" rx="2.5"/><rect x="5" y="11" width="14" height="9.5" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle class="dot" cx="12" cy="15.7" r="1.2"/>',
  sparkle: '<path class="fill" d="m11 3 2 5.6L18.6 10.6 13 12.6 11 18.2 9 12.6 3.4 10.6 9 8.6z"/><path d="m11 3 2 5.6 5.6 2-5.6 2L11 18.2l-2-5.6-5.6-2 5.6-2z"/><path d="M19 16v5M16.5 18.5h5"/>',
  doc: '<path class="fill" d="M6 3h8l4 4v14H6z"/><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  search: '<circle class="fill" cx="10.5" cy="10.5" r="6.5"/><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  compass: '<circle class="fill" cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/>',
  pencil: '<path class="fill" d="M4 20l1-4.5L16 4.5 19.5 8 8.5 19z"/><path d="M4 20l1-4.5L16 4.5 19.5 8 8.5 19zM13.5 7l3.5 3.5"/>',
  dice: '<rect class="fill" x="4" y="4" width="16" height="16" rx="3.5"/><rect x="4" y="4" width="16" height="16" rx="3.5"/><circle class="dot" cx="9" cy="9" r="1.1"/><circle class="dot" cx="15" cy="9" r="1.1"/><circle class="dot" cx="12" cy="12" r="1.1"/><circle class="dot" cx="9" cy="15" r="1.1"/><circle class="dot" cx="15" cy="15" r="1.1"/>',
  wave: '<path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5"/>',
  tasks: '<rect class="fill" x="4" y="3.5" width="16" height="17" rx="3"/><rect x="4" y="3.5" width="16" height="17" rx="3"/><path d="m8 9 1.5 1.5L12 8M8 15l1.5 1.5L12 14M14.5 9.5H17M14.5 15.5H17"/>',
  video: '<rect class="fill" x="3" y="6" width="13" height="12" rx="2.5"/><rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="m16 10.5 5-3v9l-5-3z"/>',
  check: '<circle class="fill" cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.2 9.5"/>',
  flag: '<path d="M5 21V4"/><path class="fill" d="M5 4h11l-2 4 2 4H5z"/><path d="M5 4h11l-2 4 2 4H5z"/>',
  heart: '<path class="fill" d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  rocket: '<path class="fill" d="M12 3c3.5 2.2 5 5.6 5 9.5l-2 3h-6l-2-3C7 8.6 8.5 5.2 12 3z"/><path d="M12 3c3.5 2.2 5 5.6 5 9.5l-2 3h-6l-2-3C7 8.6 8.5 5.2 12 3z"/><circle cx="12" cy="10" r="1.6"/><path d="M9 15.5 6.5 19M15 15.5l2.5 3.5M12 16v4"/>',
  robot: '<rect class="fill" x="4" y="8" width="16" height="11" rx="3.5"/><rect x="4" y="8" width="16" height="11" rx="3.5"/><path d="M12 4v4M9.5 4h5"/><circle class="dot" cx="9" cy="13.5" r="1.4"/><circle class="dot" cx="15" cy="13.5" r="1.4"/><path d="M2 12.5v2M22 12.5v2"/>',
  cloud: '<path class="fill" d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.2 4.2 0 0 1-.5 8.5z"/><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.2 4.2 0 0 1-.5 8.5z"/>',
  bolt: '<path class="fill" d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
  headset: '<path d="M4.5 14v-2.5a7.5 7.5 0 0 1 15 0V14"/><rect class="fill" x="3" y="13" width="4" height="6" rx="1.8"/><rect x="3" y="13" width="4" height="6" rx="1.8"/><rect x="17" y="13" width="4" height="6" rx="1.8"/><path d="M19 19c0 1.5-1.5 2.5-4 2.5h-1.5"/>',
  cart: '<path d="M3 4h2.5l2 11h10l2-8H7"/><circle class="fill" cx="9.5" cy="19" r="1.6"/><circle cx="9.5" cy="19" r="1.6"/><circle cx="16.5" cy="19" r="1.6"/>',
  mail: '<rect class="fill" x="3" y="5" width="18" height="14" rx="3"/><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7.5 8 6 8-6"/>',
  target: '<circle class="fill" cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle class="dot" cx="12" cy="12" r="1.6"/>',
  trophy: '<path class="fill" d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3 3 0 0 0 7 10.5M17 6h3v1.5a3 3 0 0 1-3 3M12 14v4M8.5 20.5h7"/>',
  clock: '<circle class="fill" cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  server: '<rect class="fill" x="3.5" y="4" width="17" height="7" rx="2.5"/><rect x="3.5" y="4" width="17" height="7" rx="2.5"/><rect x="3.5" y="13" width="17" height="7" rx="2.5"/><circle class="dot" cx="7.5" cy="7.5" r="1"/><circle class="dot" cx="7.5" cy="16.5" r="1"/>',
  filter: '<path class="fill" d="M3 5h18l-7 8v6l-4-2v-4z"/><path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
  brain: '<path class="fill" d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.2 3.2 0 0 0 2 5 3 3 0 0 0 6 1V5a2.5 2.5 0 0 0-3-1z"/><path d="M12 5v13M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.2 3.2 0 0 0 2 5 3 3 0 0 0 6 1M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3.2 3.2 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  star: '<path class="fill" d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
};
export const iconNames = Object.keys(I);

// gradient defs referenced by all .ico shapes; include once per page
export const SVG_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="skg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#35d4ea"/><stop offset="1" stop-color="#ab54ec"/></linearGradient><linearGradient id="skg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#35d4ea"/><stop offset="1" stop-color="#ab54ec"/></linearGradient></defs></svg>`;

export function icon(name) {
  const body = I[name];
  if (!body) throw new Error("Unknown icon: " + name);
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}
export const pict = (name, size = "") => `<span class="pict${size ? " pict--" + size : ""}">${icon(name)}</span>`;

// Large hero illustration: glowing disc, orbit rings, central glass tile with big pictogram, satellite badges.
export function heroArt(main, sats = [], label = "") {
  const cx = 240, cy = 210, R = 150;
  const pos = (i, n) => {
    const a = (-90 + (360 / n) * i + 18) * (Math.PI / 180);
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  };
  const satSvg = sats
    .map((s, i) => {
      const [x, y] = pos(i, sats.length);
      return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="30" style="fill:var(--svg-glass)" stroke="rgba(var(--accent-rgb),.45)"/><g transform="translate(-15 -15) scale(1.25)">${I[s].replace(/class="fill"/g, 'class="fill"')}</g></g>`;
    })
    .join("");
  const links = sats.map((_, i) => { const [x, y] = pos(i, sats.length); return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(var(--accent-rgb),.28)" stroke-dasharray="3 6"/>`; }).join("");
  return `<svg class="art ico-scope" viewBox="0 0 480 420" role="img" aria-label="${esc(label || "Illustration")}">
  <defs><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="rgb(var(--accent-rgb))" stop-opacity=".32"/><stop offset="1" stop-color="rgb(var(--accent-rgb))" stop-opacity="0"/></radialGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="205" fill="url(#glow)"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" style="stroke:var(--svg-ring)" stroke-dasharray="2 7"/>
  <circle cx="${cx}" cy="${cy}" r="${R - 55}" fill="none" style="stroke:var(--svg-ring)"/>
  ${links}
  <g class="ico"><rect x="${cx - 62}" y="${cy - 62}" width="124" height="124" rx="34" style="fill:var(--svg-glass)" stroke="rgba(var(--accent-rgb),.6)" stroke-width="1.4"/>
  <g transform="translate(${cx - 42} ${cy - 42}) scale(3.5)" style="stroke-width:.5">${I[main]}</g></g>
  <g class="ico">${satSvg}</g>
</svg>`;
}

// ---------- Taaweel knot logo paths (used as a badge on the hero device stage) ----------
const TWK_MAIN = "M 621 222.276 L 612.500 232.500 611.903 242.500 C 611.082 256.256, 610.769 322, 611.525 322 C 611.861 322, 616.085 319.452, 620.911 316.338 L 629.685 310.676 630.341 281.588 C 631.214 242.845, 631.174 211.994, 630.250 212.026 C 629.837 212.040, 625.675 216.653, 621 222.276 M 620.310 341.850 L 611.120 348.500 611.024 392 C 610.898 448.955, 610.137 511.908, 609.481 519.680 C 609.194 523.079, 608.706 530.279, 608.397 535.680 C 608.089 541.081, 607.017 552.475, 606.017 561 C 605.016 569.525, 604.324 576.633, 604.477 576.795 C 604.631 576.957, 606.855 573.511, 609.420 569.136 C 617.833 554.786, 624.648 534.922, 626.965 518 C 628.216 508.858, 630.154 402.226, 629.774 363.350 L 629.500 335.201 620.310 341.850";
const TWK_ACC = "M 629.238 93.043 C 594.460 99.282, 562.490 128.680, 549.589 166.286 C 536.248 205.178, 542.900 243.347, 567.393 268.434 C 570.519 271.636, 573.295 274.038, 573.561 273.772 C 573.827 273.506, 571.600 269.393, 568.611 264.632 C 558.456 248.458, 554.136 235.388, 553.282 218.261 C 551.152 175.515, 577.672 137.831, 619 124.880 C 630.683 121.219, 651.377 121.438, 662.490 125.341 C 684.444 133.051, 699.455 149.590, 705.744 173 C 708.456 183.092, 708.113 205.704, 705.070 217.500 C 693.711 261.531, 667.875 288.320, 593.500 333.186 C 522.690 375.902, 495.383 396.837, 474.332 424.547 C 437.762 472.686, 432.696 540.750, 462.364 585.339 C 491.360 628.918, 550.003 633.182, 589.842 594.609 C 603.378 581.503, 603.696 580.845, 605.910 561.372 C 608.848 535.528, 609.262 527.741, 607.498 531.500 C 606.724 533.150, 606.070 535.104, 606.045 535.841 C 606.020 536.579, 603.961 541.130, 601.469 545.955 C 583.087 581.547, 537.748 596.863, 502.408 579.419 C 465.042 560.974, 452.862 509.897, 475.246 465.519 C 490.541 435.194, 512.035 416.114, 593 360.992 C 662.475 313.692, 690.023 286.466, 708.258 247.082 C 718.750 224.420, 722.406 207.238, 722.424 180.500 C 722.439 157.622, 720.761 149.282, 712.887 133.110 C 703.648 114.136, 686.160 99.863, 665.500 94.436 C 658.330 92.552, 636.623 91.718, 629.238 93.043";
// ---------- device stages: real screenshots in SVG frames with annotations ----------
const STAGE_W = 1200, STAGE_H = 600;
const pct = (v, of) => `${+((v / of) * 100).toFixed(3)}%`;
const sparkle = (x, y, r) => `<path class="stage__spark" d="M${x} ${y - r}C${x + r * 0.14} ${y - r * 0.3} ${x + r * 0.3} ${y - r * 0.14} ${x + r} ${y}C${x + r * 0.3} ${y + r * 0.14} ${x + r * 0.14} ${y + r * 0.3} ${x} ${y + r}C${x - r * 0.14} ${y + r * 0.3} ${x - r * 0.3} ${y + r * 0.14} ${x - r} ${y}C${x - r * 0.3} ${y - r * 0.14} ${x - r * 0.14} ${y - r * 0.3} ${x} ${y - r}Z"/>`;

// SVG hardware drawn behind the screenshot; S is the screen rectangle.
function deviceFrame(kind, S, W, H, uid, domain = "") {
  const r = S.x + S.w, b = S.y + S.h, mid = S.x + S.w / 2;
  const defs = `<defs><linearGradient id="${uid}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe3ea"/><stop offset=".55" stop-color="#b3b9c6"/><stop offset="1" stop-color="#7f8695"/></linearGradient><radialGradient id="${uid}s"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`;
  const shadow = (y, rx) => `<ellipse cx="${mid}" cy="${y}" rx="${rx}" ry="${S.w * 0.035}" fill="url(#${uid}s)"/>`;
  const bezel = (p, rad) => `<rect x="${S.x - p}" y="${S.y - p}" width="${S.w + p * 2}" height="${S.h + p * 2}" rx="${rad}" fill="#0c0e13" stroke="rgba(255,255,255,.22)"/>`;
  let art = "";
  if (kind === "laptop") {
    const p = S.w * 0.018, by = b + p, ext = S.w * 0.075, h = S.w * 0.028;
    art = shadow(by + h + 8, S.w * 0.62) + bezel(p, p * 1.3) +
      `<path d="M${S.x - ext} ${by}H${r + ext}l${S.w * 0.012} ${h * 0.7}q-${S.w * 0.004} ${h * 0.3}-${S.w * 0.03} ${h * 0.3}H${S.x - ext + S.w * 0.018}q-${S.w * 0.026} 0-${S.w * 0.03}-${h * 0.3}Z" fill="url(#${uid}m)"/>` +
      `<rect x="${mid - S.w * 0.07}" y="${by}" width="${S.w * 0.14}" height="${h * 0.34}" rx="${h * 0.17}" fill="#8b92a1"/>`;
  } else if (kind === "monitor") {
    const p = S.w * 0.016, by = b + p, n = S.w * 0.05, f = S.w * 0.17;
    art = shadow(by + n + 12, S.w * 0.34) +
      `<path d="M${mid - n * 0.9} ${by}h${n * 1.8}l${n * 0.3} ${n}h-${n * 2.4}Z" fill="url(#${uid}m)"/>` +
      `<rect x="${mid - f}" y="${by + n - 1}" width="${f * 2}" height="${n * 0.2}" rx="${n * 0.1}" fill="url(#${uid}m)"/>` + bezel(p, p * 0.9);
  } else if (kind === "tablet") {
    const p = S.w * 0.03;
    art = shadow(b + p + 10, S.w * 0.54) + bezel(p, p * 1.1) + `<circle cx="${mid}" cy="${S.y - p / 2}" r="${p * 0.13}" fill="#2a2e38"/>`;
  } else {
    const bar = S.w * 0.05;
    art = shadow(b + 14, S.w * 0.54) +
      `<rect x="${S.x - 1}" y="${S.y - bar}" width="${S.w + 2}" height="${S.h + bar + 1}" rx="${bar * 0.36}" fill="#171a21" stroke="rgba(255,255,255,.22)"/>` +
      ["#ff6159", "#ffbd2e", "#28c941"].map((c, i) => `<circle cx="${S.x + bar * 0.55 + i * bar * 0.42}" cy="${S.y - bar / 2}" r="${bar * 0.13}" fill="${c}"/>`).join("") +
      (domain ? `<rect x="${mid - S.w * 0.19}" y="${S.y - bar * 0.78}" width="${S.w * 0.38}" height="${bar * 0.56}" rx="${bar * 0.28}" fill="rgba(255,255,255,.08)"/><text x="${mid}" y="${S.y - bar * 0.4}" text-anchor="middle" font-size="${bar * 0.3}" fill="rgba(255,255,255,.65)">${esc(domain)}</text>` : "");
  }
  return `<svg class="stage__frame" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">${defs}${art}${sparkle(W * 0.055, H * 0.12, W * 0.016)}${sparkle(W * 0.945, H * 0.86, W * 0.012)}</svg>`;
}

const cropCard = (c, W, H, eager = false) => `<div class="stage__crop" style="left:${pct(c.x, W)};top:${pct(c.y, H)};width:${pct(c.w, W)}"><i></i><img src="/assets/taaweel-app/stage/crop-${c.name}.webp" alt="" loading="${eager ? "eager" : "lazy"}" width="${c.dw}" height="${c.dh}" /></div>`;
const stageBadge = (ic, x, y, W, H) => `<span class="stage__badge" style="left:${pct(x, W)};top:${pct(y, H)}"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${I[ic]}</svg></span>`;

// One annotated device stage on the 1200x600 canvas.
export function deviceStage(st, alt, uid) {
  const S = { x: 250, y: st.device === "browser" ? 70 : 52, w: 700, h: 437.5 };
  const [bx, by, bx2] = st.box;
  const k = S.w / (bx2 - bx);
  const wires = st.notes.map((n) => {
    const tx = (S.x + (n.at[0] - bx) * k).toFixed(1), ty = (S.y + (n.at[1] - by) * k).toFixed(1), [ax, ay] = n.chip;
    const d = (tx - ax) * 0.5;
    const path = `M${ax} ${ay}C${(ax + d).toFixed(1)} ${ay} ${(tx - d).toFixed(1)} ${ty} ${tx} ${ty}`;
    return `<path class="stage__halo" d="${path}"/><path class="stage__line" d="${path}"/><circle class="stage__ring" cx="${tx}" cy="${ty}" r="9"/><circle class="stage__dot" cx="${tx}" cy="${ty}" r="3.6"/>`;
  }).join("");
  const chips = st.notes.map((n) => `<span class="stage__chip stage__chip--${n.chip[0] < STAGE_W / 2 ? "l" : "r"}" style="left:${pct(n.chip[0], STAGE_W)};top:${pct(n.chip[1], STAGE_H)}">${esc(n.t)}</span>`).join("");
  // badges sit beside the first crop, on the side away from it
  const onLeft = st.crops[0].x < STAGE_W / 2;
  const badges = (st.badges || []).map((ic, i) => stageBadge(ic, onLeft ? 870 - i * 74 : 262 + i * 74, 520, STAGE_W, STAGE_H)).join("");
  return `<div class="stage"><div class="stage__inner" data-zoom="/assets/taaweel-app/${st.img}.png" data-zoom-alt="${esc(alt)}">
<button type="button" class="stage__zoom" aria-label="Enlarge screenshot"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6"/></svg></button>
${deviceFrame(st.device, S, STAGE_W, STAGE_H, uid, st.domain)}
<img class="stage__screen" src="/assets/taaweel-app/stage/${st.img}.webp" alt="${esc(alt)}" loading="lazy" width="1280" height="800" style="left:${pct(S.x, STAGE_W)};top:${pct(S.y, STAGE_H)};width:${pct(S.w, STAGE_W)}" />
<svg class="stage__wires" viewBox="0 0 ${STAGE_W} ${STAGE_H}" aria-hidden="true" focusable="false">${wires}</svg>
${chips}
${st.crops.map((c) => cropCard(c, STAGE_W, STAGE_H)).join("")}
${badges}
</div></div>
<ul class="stage__list">${st.notes.map((n) => `<li>${esc(n.t)}</li>`).join("")}</ul>`;
}

// Tinted feature card: title left, text and CTA right, annotated device below.
export function stageCard(shot, st, url, ctaLabel, uid, tag = "article") {
  return `<${tag} class="stagecard tone-${st.tone}">
<header class="stagecard__head"><h3>${esc(shot.title)}</h3><div><p>${shot.cap}</p><a class="stagecard__cta" href="${url}" target="_blank" rel="noopener">${esc(ctaLabel)} <span aria-hidden="true">→</span></a></div></header>
${deviceStage(st, shot.alt, uid)}
</${tag}>`;
}

// Hub gallery: scroll-snap carousel (swipe/scroll without JS; arrows from /js/stage-carousel.js).
export function stageGallery({ url, shots, stages, name, domain, logoSrc, logoAlt, ctaLabel = "Open the app" }) {
  return `<section class="band band--tint stagesband" id="app"><div class="wrap">
<div class="apphead">
<img class="app-mark" data-theme-img="${logoSrc.replace(/-dark$/, "")}" src="/assets/${logoSrc}.svg" alt="${esc(logoAlt || name)}" width="44" height="80" />
${secHead("Inside the app", `Working screens from ${name}`, `Real screens, with the parts that matter marked up. <a href="${url}" target="_blank" rel="noopener">Open ${esc(domain)} ↗</a>`)}
</div></div>
<div class="stages" tabindex="0" role="group" aria-label="${esc(name)} features">${shots.map((s, i) => stageCard(s, stages[s.stage], url, ctaLabel, `st${i}`)).join("")}</div>
<div class="wrap stages__nav"><button type="button" class="stages__btn" data-dir="-1" aria-label="Previous feature" hidden>←</button><button type="button" class="stages__btn" data-dir="1" aria-label="Next feature" hidden>→</button></div>
<script src="/js/stage-carousel.js" defer></script>
</section>`;
}

// Capability page: one wide annotated stage.
export const stageBand = (shot, st, url, ctaLabel = "Open the app") => `<section class="band band--tint"><div class="wrap">${stageCard(shot, st, url, ctaLabel, "st", "figure")}</div></section>`;

// Taaweel hero: the real run screen in a laptop, with key details lifted out of it.
export function taaweelHeroArt(label, crops) {
  const W = 620, H = 470, S = { x: 62, y: 44, w: 496, h: 310 };
  return `<div class="stage stage--hero tone-green"><div class="stage__inner" style="aspect-ratio:${W}/${H}" data-zoom="/assets/taaweel-app/run.png" data-zoom-alt="${esc(label)}">
<button type="button" class="stage__zoom" aria-label="Enlarge screenshot"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6"/></svg></button>
${deviceFrame("laptop", S, W, H, "hero")}
<img class="stage__screen" src="/assets/taaweel-app/stage/run.webp" alt="${esc(label)}" fetchpriority="high" width="1280" height="800" style="left:${pct(S.x, W)};top:${pct(S.y, H)};width:${pct(S.w, W)}" />
${cropCard({ ...crops.progress, x: 0, y: 262, w: 300 }, W, H, true)}
${cropCard({ ...crops.cost, x: 310, y: 330, w: 300 }, W, H, true)}
<span class="stage__badge stage__badge--logo" style="left:${pct(540, W)};top:${pct(8, H)}"><svg viewBox="0 0 124 124" aria-hidden="true" focusable="false"><g transform="translate(-28.3 6.8) scale(0.155)" class="twk"><path class="twk-main" fill-rule="evenodd" d="${TWK_MAIN}"/><path class="twk-acc" fill-rule="evenodd" d="${TWK_ACC}"/></g></svg></span>
${stageBadge("check", 14, 60, W, H)}
${stageBadge("shield", 552, 190, W, H)}
</div></div>`;
}

// ---------- head / header / footer ----------
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,0,0" rel="stylesheet" />`;

export function head({ title, description, path, ogImage = "/snapkodex logo full dark.svg", schema = [], type = "website", extra = "" }) {
  const url = SITE + path;
  const graph = schema.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": schema })}</script>` : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KY185RDQ32"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KY185RDQ32');</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="author" content="Snap Kodex" />
<meta name="theme-color" content="#06070a" />
<script>(function(){try{if(localStorage.getItem("sk-theme")==="light")document.documentElement.dataset.theme="light";}catch(e){}})();</script>
<link rel="canonical" href="${url}" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<meta property="og:type" content="${type}" />
<meta property="og:site_name" content="Snap Kodex" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}${encodeURI(ogImage)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
${graph}
${FONTS}
<link rel="stylesheet" href="/css/site.css" />
<link rel="stylesheet" href="/css/theme.css" />
<link rel="stylesheet" href="/css/pages.css" />
<link rel="stylesheet" href="/css/nav.css" />
${extra}
</head>`;
}

const AMBIENT = `<div class="ambient" aria-hidden="true"><div class="ambient__orb ambient__orb--cyan"></div><div class="ambient__orb ambient__orb--purple"></div><div class="ambient__orb ambient__orb--mid"></div><div class="ambient__orb ambient__orb--mint"></div><div class="ambient__grid"></div></div>`;

export const LIVE = { services: false, insights: false, contact: false };
export const U = {
  contact: () => (LIVE.contact ? "/contact/" : "/#contact"),
  services: () => (LIVE.services ? "/services/" : "/#services"),
  agentic: () => (LIVE.services ? "/services/agentic-ai-development/" : "/#services"),
  saas: () => (LIVE.services ? "/services/saas-and-enterprise-development/" : "/#services"),
  agents: () => (LIVE.services ? "/services/ai-agents-and-automation/" : "/#services"),
  insights: () => (LIVE.insights ? "/insights/" : "/products/"),
};
const GLOBAL_LINKS_ALL = [
  ["svc", "Services"],
  ["/products/", "Products"],
  ["ins", "Insights"],
  ["/#techstack", "Tech stack"],
  ["/#partners", "Partners"],
  ["/#faq", "FAQ"],
  ["con", "Contact Us"],
];
export const globalLinks = () =>
  GLOBAL_LINKS_ALL.filter(([h]) => !(h === "ins" && !LIVE.insights)).map(([h, t]) => [h === "svc" ? U.services() : h === "con" ? U.contact() : h === "ins" ? "/insights/" : h, t]);

export function globalHeader(current = "") {
  return `<a class="skip-link" href="#main">Skip to content</a>${AMBIENT}
${navBlock(current)}`;
}

// Product-scoped header: same mega-menu component, product pages only (no cross-silo links).
export function productHeader({ name, tag, iconName, base, links, cta, features = [], tone }) {
  return `<a class="skip-link" href="#main">Skip to content</a>${AMBIENT}
${productNavBlock({ name, tag, pictHtml: pict(iconName), base, features, links, cta, tone })}`;
}

export const globalFooter = () => richFooter();

export function productFooter({ name, base, cols, tone }) {
  return productFooterHtml({ name, pictHtml: pict(cols.icon), blurb: cols.blurb, groups: cols.groups, tone });
}

export const SCRIPTS = `<script src="/js/theme.js" defer></script><script src="/js/nav.js" defer></script><script src="/js/lightbox.js" defer></script>`;

export const page = (headHtml, body, bodyClass) => `${headHtml}
<body class="${bodyClass}">
${body}
${SCRIPTS}
</body>
</html>
`;

// ---------- content blocks ----------
export const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([h, t], i) => (i === items.length - 1 ? `<li aria-current="page">${esc(t)}</li>` : `<li><a href="${h}">${esc(t)}</a></li>`)).join("")}</ol></nav>`;

export const breadcrumbSchema = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([h, t], i) => ({ "@type": "ListItem", position: i + 1, name: t, item: SITE + h })),
});

export const faqSchema = (faqs) => ({ "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });

export const faqHtml = (faqs) => `<div class="faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>`;

export const secHead = (eyebrow, title, lead) => `<div class="sec-head"><span class="sec-eyebrow">${esc(eyebrow)}</span><h2>${title}</h2>${lead ? `<p>${lead}</p>` : ""}</div>`;

export const cardLink = ({ href, icon: ic, tag, title, text, more = "Explore" }) => `<a class="card" href="${href}">${pict(ic)}${tag ? `<span class="card__tag">${esc(tag)}</span>` : ""}<h3>${title}</h3><p>${text}</p><span class="card__more">${more}</span></a>`;
export const cardPlain = ({ icon: ic, title, text }) => `<div class="card">${pict(ic)}<h3>${title}</h3><p>${text}</p></div>`;
export const stepsHtml = (steps) => `<div class="steps">${steps.map(([ic, t, d]) => `<div class="step">${pict(ic, "sm")}<h3>${t}</h3><p>${d}</p></div>`).join("")}</div>`;
export const checklist = (items) => `<ul class="checklist">${items.map((i) => `<li><span>${i}</span></li>`).join("")}</ul>`;
export const callout = (ic, title, text, quiet = false) => `<div class="callout${quiet ? " callout--quiet" : ""}"><h3>${pict(ic, "sm")}${title}</h3><p>${text}</p></div>`;
export const cta = ({ title, text, primary, secondary }) => `<div class="ctaband"><h2>${title}</h2><p>${text}</p><div class="phero__actions"><a class="btn btn--primary" href="${primary[0]}"${/^https?:/.test(primary[0]) ? ' target="_blank" rel="noopener"' : ""}>${primary[1]}</a>${secondary ? `<a class="btn btn--ghost" href="${secondary[0]}">${secondary[1]}</a>` : ""}</div></div>`;

// ---------- in-app screenshots (real screens from a product's own app) ----------
// Screenshot card: img WITHOUT extension defaults to .png and renders inside a browser frame bar.
// img WITH extension (e.g. "dashboard.svg") renders as a pictogram panel: no bar, caption carries the title.
const appshot = ({ img, title, alt, cap, wide = false, folder, domain, picto }) => {
  const src = `/assets/${folder}/${img.includes(".") ? img : img + ".png"}`;
  if (picto || img.endsWith(".svg")) {
    return `<figure class="appshot appshot--picto${wide ? " appshot--wide" : ""}">
<img src="${src}" alt="${esc(alt || title)}" loading="lazy" width="400" height="240" />
<figcaption><strong>${esc(title)}</strong><span>${cap}</span></figcaption>
</figure>`;
  }
  return `<figure class="appshot${wide ? " appshot--wide" : ""}" data-zoom="${src}">
<div class="appshot__bar"><i></i><i></i><i></i><span>${esc(domain)}</span></div>
<img src="${src}" alt="${esc(alt)}" loading="lazy" width="1352" height="900" />
<figcaption>${cap}</figcaption>
</figure>`;
};

// "Inside the app" gallery for a product hub: brand mark + working screens + open-the-app link.
// folder/domain are per-product (screenshots live in /assets/<folder>/, shown under <domain> in the frame bar);
// logoSrc is optional — pass a dedicated brand mark (tall SVG) or omit to fall back to the product's own icon tile.
export function appGallery({ url, shots, name, folder, domain, logoSrc, logoAlt, icon }) {
  const mark = logoSrc
    ? `<img class="app-mark" data-theme-img="${logoSrc.replace(/-dark$/, "")}" src="/assets/${logoSrc}.svg" alt="${esc(logoAlt || name)}" width="44" height="80" />`
    : `<span class="app-mark app-mark--icon">${pict(icon, "lg")}</span>`;
  return `<section class="band band--tint" id="app"><div class="wrap">
<div class="apphead">
${mark}
${secHead("Inside the app", `Working screens from ${name}`, `Real screens from ${domain} — every stage is on the record. <a href="${url}" target="_blank" rel="noopener">Open the app ↗</a>`)}
</div>
<div class="appgallery">${shots.map((s) => appshot({ ...s, folder, domain })).join("")}</div>
</div></section>`;
}

// single framed screenshot used on capability pages
export const appShot = (s, folder, domain) => `<section class="band band--tint"><div class="wrap">${appshot({ ...s, folder, domain, wide: true })}</div></section>`;

// ring navigation for a spoke inside its wheel
export function wheelNav(hub, spokes, i) {
  const prev = spokes[(i - 1 + spokes.length) % spokes.length];
  const next = spokes[(i + 1) % spokes.length];
  return `<div class="wheelnav"><div class="wheelnav__row">
<a class="nav-tile" href="${prev.url}" rel="prev"><small>Previous</small><span>${prev.nav}</span></a>
<a class="nav-tile nav-tile--hub" href="${hub.url}"><small>Back to</small><span>${hub.nav}</span></a>
<a class="nav-tile nav-tile--next" href="${next.url}" rel="next"><small>Next</small><span>${next.nav}</span></a></div>
<div class="chips" aria-label="All topics">${spokes.map((s, j) => `<a class="chip" href="${s.url}"${j === i ? ' aria-current="page"' : ""}>${s.nav}</a>`).join("")}</div></div>`;
}

export const hero = ({ eyebrow, h1, lead, actions, art }) => `<section class="phero"><div><span class="phero__eyebrow">${esc(eyebrow)}</span><h1>${h1}</h1><p class="phero__lead">${lead}</p><div class="phero__actions">${actions
  .map(([h, t, k]) => `<a class="btn btn--${k || "primary"}" href="${h}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`)
  .join("")}</div></div><div class="phero__art">${art}</div></section>`;
