import { LAYOUTS } from "../baked/layouts.js";

/**
 * What an array is, as numbers.
 *
 * The names are the app's names, so a look composed in the tool can be read
 * straight off its own settings string.
 *
 * The values are the approved frame 1083:9025, NOT the V2 paint styles. Those
 * styles are an earlier round and three of them are stale — this file carried
 * all three, with a comment saying the styles were the right source, which is
 * the drift RAYL-WHY.md is a list of. doc.py now checks every hex below
 * against src/parts.py and fails the build if one of them wanders again.
 */

export const PALETTE = {
  white: "#FFFFFF",
  offWhite: "#F7F7EF",
  darkOffWhite: "#E2E2D3",
  porcelain: "#CFCFC1",
  lightConcrete: "#696961",
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
  /* Which approved composition to stand on: horizontal, vertical, or none for
     the bare defaults. Everything a page sets is laid over the top of it. */
  layout: "horizontal",
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
  /* How strongly a body shadows the one behind it. Nothing by default — it
     follows the occlusion the look asks for, which is the app's own control for
     how much light a row is allowed to lose to itself, so a layout's own number
     drives it rather than a second one nobody set. */
  shade: null,

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
  projection: "lens", // lens | iso — a real lens, or a parallel one
  fov: 32, // which the parallel projection ignores, being parallel
  /* The crop, exactly as the app means it: the shape the picture was composed
     in, how much of the fit to take (under one is closer in) and where the
     middle of it sits, in world units off the middle of the row. An element
     whose own shape differs is filled rather than letterboxed — see fit(). */
  aspect: 16 / 9,
  zoom: 1,
  pan: [0, 0],
  bounce: 1, // how much light the bodies throw at each other
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
  projection: (v) => ({ projection: Math.round(v) === 1 ? "iso" : "lens" }),
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
  "width",
  "preview",
  "print",
  "design",
  "finish",
  "colorLow",
  "colorHigh",
  "variation",
  "tone",
  "glow",
  "room",
  "radius",
  "waveTurns",
  /* Real settings in the app that this does not do. Frost is what you see
     *through* a body, which needs the stack drawn twice; the transparency it
     goes with is three parts in a hundred in every approved layout, so what is
     lost is three parts in a hundred. Glow is a pass. Say so rather than
     pretending, and use the app for a still that needs them. */
  "frost",
  "transparency",
  "glow",
  "ink",
  "v",
  /* Same name, different question: the app's `motion` is which shape of crest
     it runs, and here it is what drives the crest at all. The crop beside it —
     aspect, zoom and pan — does come across, since a composed picture is a
     composition and not a window size. */
  "motion",
]);

const NUMBERS = new Set(
  Object.keys(DEFAULTS).filter((k) => typeof DEFAULTS[k] === "number"),
);
const TRIPLES = new Set(["keyAt", "fillAt", "rimAt"]);
/* The app writes the pan as three numbers. The third is along the view axis,
   where a pan cannot go, and it is nought in everything the tool has ever
   written — so it is dropped rather than carried as a setting that does
   nothing. */
const PAIRS = new Set(["pan"]);
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
    if (PAIRS.has(name)) {
      const parts = raw.split(",").map(Number).slice(0, 2);
      if (parts.length === 2 && parts.every(Number.isFinite))
        look[name] = parts;
      continue;
    }
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

/*
 * The six approved compositions.
 *
 * Count, spacing, angles, rig, projection and crop, composed in the app and
 * saved out of it — not assembled here from settings that looked reasonable.
 * A horizontal layout is a row running across the bottom of its frame and a
 * vertical one is a column, and each body has one of each.
 *
 * This is the way to use an array. Everything else in this file exists so that
 * a layout can be nudged, not so that one can be invented.
 */
export const LAYOUT_NAMES = Object.keys(LAYOUTS);

const BODY_PLURAL = { plate: "plates", card: "cards", basket: "baskets" };

/** The approved look for a body in a direction, or nothing if there is none. */
export function layoutFor(body = "plate", layout = "horizontal") {
  const name = `${BODY_PLURAL[body] || body}-${layout}`;
  const found = LAYOUTS[name];
  if (!found) {
    console.warn(
      `rayl-array: there is no approved "${name}" layout. There are ${LAYOUT_NAMES.join(", ")}.`,
    );
    return null;
  }
  return readLook(found);
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
