/**
 * What an array is, as numbers.
 *
 * The names are the app's names, so a look composed in the tool can be read
 * straight off its own settings string. The values are the system's — the
 * palette here is the one in the Figma styles, not the slightly-off one every
 * code build drifted into.
 */

export const PALETTE = {
  white: "#FFFFFF",
  offWhite: "#F7F7F2",
  darkOffWhite: "#E2E2D3",
  porcelain: "#CFCFC4",
  lightConcrete: "#696963",
  darkConcrete: "#55554E",
  black: "#1C1C1A",
};

/** The two gradients, top colour first, as the styles have them at 180deg. */
export const SHEETS = {
  porcelain: [PALETTE.porcelain, PALETTE.offWhite],
  concrete: [PALETTE.lightConcrete, PALETTE.porcelain],
  none: null,
};

export const DEFAULTS = {
  /* what it is made of */
  body: "plate", // plate | card | basket
  count: 14,
  /* The air between one body and the next, in bodies. Nought is touching and
     negative is an overlap, which is most of what an array is for. */
  spread: -0.455,
  direction: "across", // across | up
  depth: 0.05, // how thick a card is, against its own width

  /* how it is turned */
  lean: 0, // the whole rack, about the vertical
  spin: 24, // the bodies, on top of that
  tilt: -14, // and tipped towards you or away

  /* what it does */
  motion: "wave", // wave | still | scroll | pointer
  wave: 0.62, // how far a body is lifted out of the row, in bodies
  brush: 2, // how many bodies the crest is wide
  peaks: 1,
  seconds: 6, // how long one pass takes
  at: 0.35, // where the crest sits when nothing is driving it
  ease: [0, 0.593, 1, 0.28], // the app's own curve

  /* how it is lit */
  colour: PALETTE.offWhite,
  key: 1.55,
  keyColour: PALETTE.offWhite,
  keyAt: [0.3, 0.75, 0.85],
  keySize: 0.75,
  fill: 0.3,
  fillColour: PALETTE.darkOffWhite,
  fillAt: [-0.9, 0.05, 0.4],
  fillSize: 1,
  rim: 0.8,
  rimColour: PALETTE.offWhite,
  rimAt: [0.2, 0.35, -0.6],
  rimSize: 0.4,
  ambient: 1.4,
  exposure: 1.0,
  contrast: 1.05,
  occlusion: 1.15,
  shade: 1, // how strongly a body shadows the one behind it

  /* what it is made of, as a material */
  translucency: 0.72,
  scatter: 0.26,
  wrap: 0.23,
  falloff: 3.3,
  roughness: 1,
  coat: 0,

  /* the picture */
  sheet: "none", // porcelain | concrete | none, or two colours
  sky: null, // what an upward face sees; the sheet's top unless told
  ground: null, // and a downward one; the sheet's bottom
  fov: 32,
  zoom: 1, // above one is closer in
  pan: [0, 0], // and where the middle sits, in frames
  art: null, // an image to print on the face of a card
  dpr: 2, // the most pixels a device pixel ratio may ask for
};

/* Which of the app's names mean these, where the two differ. */
const FROM_APP = {
  object: (v) => ({
    body: ["plate", "basket", "card", "circle"][Math.round(v)] || "plate",
  }),
  direction: (v) => ({ direction: Math.round(v) === 1 ? "up" : "across" }),
  waveSeconds: (v) => ({ seconds: v }),
  color: (v) => ({ colour: `#${String(v).replace("#", "")}` }),
  keyColor: (v) => ({ keyColour: `#${String(v).replace("#", "")}` }),
  fillColor: (v) => ({ fillColour: `#${String(v).replace("#", "")}` }),
  rimColor: (v) => ({ rimColour: `#${String(v).replace("#", "")}` }),
  keyOn: (v) => (Number(v) < 0.5 ? { key: 0 } : {}),
  fillOn: (v) => (Number(v) < 0.5 ? { fill: 0 } : {}),
  rimOn: (v) => (Number(v) < 0.5 ? { rim: 0 } : {}),
};

/* Things the app carries that a page has no use for: how many samples it
   resolves over, what it exports to, where its window was. Named rather than
   ignored silently, so a genuine typo in a hand-written look still complains. */
const APP_ONLY = new Set([
  "renderCcale",
  "renderScale",
  "over",
  "fps",
  "videoQuality",
  "format",
  "alpha",
  "aspect",
  "width",
  "projection",
  "preview",
  "print",
  "design",
  "finish",
  "colorLow",
  "colorHigh",
  "variation",
  "bounce",
  "tone",
  "glow",
  "room",
  "radius",
  "waveTurns",
  "v",
  /* Same name, different question: the app's `motion` is which shape of crest
     it runs, and here it is what drives the crest at all. The app's framing
     goes too — a page's box is not the tool's window, so the fit is the page's
     to make. */
  "motion",
  "zoom",
  "pan",
]);

const NUMBERS = new Set(
  Object.keys(DEFAULTS).filter((k) => typeof DEFAULTS[k] === "number"),
);
const TRIPLES = new Set(["keyAt", "fillAt", "rimAt"]);
const QUADS = new Set(["ease"]);

/**
 * A look, from anything: an object, the app's settings string, or a link to the
 * app with one in its hash.
 *
 * The app's own string is the point. A look is composed in the tool, where
 * there are sliders and a picture, and pasted here — rather than being written
 * out by hand against a list of names, which is how a page ends up with an
 * array nobody ever looked at.
 */
export function readLook(source) {
  if (!source) return {};
  if (typeof source === "object") return { ...source };

  const text = String(source);
  const query = text.includes("#") ? text.slice(text.indexOf("#") + 1) : text;
  const parameters = new URLSearchParams(query);
  const look = {};
  for (const [name, raw] of parameters) {
    /*
     * Which version of the app wrote this.
     *
     * Up to version 3 the spacing was the step from one middle to the next, and
     * from 4 it is the air between one body and the next — the same number
     * meaning two different rows. A link made in the tool before that change
     * has to be read the way it was written, or every preset in the app comes
     * out with its row twice as long as the picture it was saved from.
     */
    if (name === "v") {
      if (Number(raw) <= 3) look.spreadIsStep = true;
      continue;
    }
    if (FROM_APP[name]) {
      Object.assign(look, FROM_APP[name](raw));
      continue;
    }
    if (APP_ONLY.has(name)) continue;
    if (!(name in DEFAULTS)) continue;
    if (TRIPLES.has(name) || QUADS.has(name)) {
      const parts = raw.split(",").map(Number);
      const want = TRIPLES.has(name) ? 3 : 4;
      if (parts.length === want && parts.every(Number.isFinite))
        look[name] = parts;
      continue;
    }
    if (NUMBERS.has(name)) {
      const value = Number(raw);
      if (Number.isFinite(value)) look[name] = value;
      continue;
    }
    look[name] = raw;
  }
  /* A look saved from the tool with its wave at nought is a row standing still
     and flat. Left to fall back on the default it would come out of the tool
     flat and land on the page mid-wave, which is not the picture that was
     composed. */
  if (look.wave !== undefined && look.wave <= 0.001) {
    look.wave = 0;
    look.motion = "still";
  }
  return look;
}

/** The look a page asked for, over the top of the one everybody gets. */
export function settle(...looks) {
  const out = { ...DEFAULTS };
  for (const look of looks)
    for (const [k, v] of Object.entries(look || {})) {
      if (v !== undefined && v !== null && v !== "") out[k] = v;
    }
  return out;
}

/** The cubic the app eases its crest along. */
export function easing([x1, y1, x2, y2]) {
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    /* Newton on x, which converges in three steps for any curve a person would
       draw and is cheaper than bisecting to the same place. */
    let u = t;
    for (let i = 0; i < 6; i++) {
      const x = bezier(u, x1, x2) - t;
      if (Math.abs(x) < 1e-5) break;
      const slope = slopeOf(u, x1, x2);
      if (Math.abs(slope) < 1e-6) break;
      u -= x / slope;
    }
    return bezier(Math.min(1, Math.max(0, u)), y1, y2);
  };
}

const bezier = (t, a, b) =>
  3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t;

const slopeOf = (t, a, b) =>
  3 * a * (1 - t) * (1 - 3 * t) + 3 * b * t * (2 - 3 * t) + 3 * t * t;
