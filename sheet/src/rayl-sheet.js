/**
 * The Rayl sheet — the ground, lit, answering the pointer.
 *
 *   <script type="module"
 *     src="https://typograaf.github.io/rayl-system/assets/sheet/rayl-sheet.js">
 *   </script>
 *
 *   <div data-rayl-sheet="concrete" data-place="page"></div>
 *
 * Every element carrying `data-rayl-sheet` on the page is found and started,
 * and every setting is a `data-` attribute named after the thing it changes.
 * For a page that would rather say it in code:
 *
 *   import { upgrade } from ".../rayl-sheet.js";
 *   upgrade(element).set({ sheet: "porcelain", amplitude: 1.2 });
 *
 * WHAT IT IS
 *
 * The treatment on nestjs.com, taken from the page itself rather than
 * described: their hero runs the Aurora shader, and the fragment program below
 * is theirs, read off their live WebGL context. A ramp of three colours across
 * the frame, a curtain whose height is simplex noise drifting in two
 * directions, a smoothstep for its alpha, and a wide soft disc of a fourth
 * colour under the cursor. Their numbers as measured on the running page:
 * uTime advances at 1.0 a second, amplitude 1, blend 0.5, the cursor disc
 * reaches 0.6 of the frame, takes the colour 30% of the way and the alpha 50%.
 * The pointer is in canvas pixels with the y flipped, and it is not smoothed.
 *
 * Two things are not theirs. The colours are Rayl's, which is the whole of
 * what was asked for. And they drop the uColorStopsA/uColorStopsB pair with
 * uPaletteMix, which on their page holds the same three colours twice and so
 * does nothing; this has the three stops stock Aurora has.
 *
 * WHAT IT COSTS AGAINST THE RULES, WHICH IS NOT SETTLED HERE
 *
 * Section 7 says gradients are flat art and stay flat. This drifts on its own
 * and answers the pointer. Martijn asked for the treatment after being told
 * that, so it is built; it is still his call, and `still` is the value that
 * obeys section 7.
 *
 * The canvas carries alpha and composites over the ground, because that is how
 * the reference works — the aurora is a curtain over a gradient, not a
 * replacement for one. Transparency is on the open list in RAYL-OPEN.md and
 * this is a second thing in the system drawn at part strength.
 *
 * Every colour it names is a palette colour, through a token: there is no hex
 * in this file. What is between them is not on the two-stop line the way the
 * flat gradient is, because the reference multiplies its ramp by an intensity.
 * That is the copy doing what the copy does.
 *
 * `place="page"` is the layering item in RAYL-OPEN.md. It marks itself
 * `data-rayl-provisional`.
 *
 * This is still not the Rayl look, which is layered gradient art with no
 * reference file in this repo.
 */

/** Every setting, with the value it has when nothing says otherwise. */
export const DEFAULTS = {
  /* Which approved gradient the ground underneath is, and which palette
     colours the curtain is made of. `concrete` is the one that matches the
     reference: its three stops sit at the same lightnesses theirs do. */
  sheet: "concrete", // porcelain | concrete

  /* pointer — the reference: the curtain drifts and the cursor carries a disc.
     scroll  — the disc crosses as the element crosses the screen.
     still   — no canvas at all, and the flat approved gradient underneath,
               which is the only thing section 7 permits. Forced under
               prefers-reduced-motion. */
  motion: "pointer",

  /* Theirs, measured on the running page. */
  amplitude: 1, // how far the curtain's edge moves
  blend: 0.5, // how soft that edge is
  speed: 1, // how many of the shader's seconds pass in one real one

  /* Theirs too: how wide the cursor disc is, how far it takes the colour, and
     how far it takes the alpha. */
  glow: 0.6,
  tint: 0.3,
  veil: 0.5,

  /* The most device pixels it may ask for. */
  dpr: 2,

  /* element — fills the box it is given, and the page places it.
     page    — fixed behind the whole page. PROVISIONAL: layering is open. */
  place: "element",
};

/*
 * The ground under the curtain, and the four colours the curtain is made of.
 *
 * The reference's three stops are #780F20, #050303 and #5A0B18 — a mid, an
 * extreme and something between — and its cursor disc is #E0234E, brighter
 * than any of them. `concrete` is those four lightnesses in Rayl: Light
 * Concrete, Deep Black, Dark Concrete, and Porcelain over the top. `porcelain`
 * is the same shape the other way up, for a light ground.
 *
 * Tokens, not colour: a page that names hexes is right in neither mode.
 */
const SHEETS = {
  porcelain: ["var(--rayl-porcelain)", "var(--rayl-off-white)"],
  concrete: ["var(--rayl-light-concrete)", "var(--rayl-porcelain)"],
};

const STYLE_ID = "rayl-sheet-css";

/* The component's own rules. The ground is the approved gradient and nothing
   else; the curtain is the canvas over it. The var fallbacks mean an element
   is correct with this stylesheet and no script at all, and stays correct if
   the canvas never arrives. */
const CSS = `
[data-rayl-sheet]{
  position:relative;
  background-image:linear-gradient(180deg,
    var(--rayl-sheet-a) 0.349%,
    var(--rayl-sheet-b));
  --rayl-sheet-a:var(--rayl-light-concrete);
  --rayl-sheet-b:var(--rayl-porcelain);
}
[data-rayl-sheet="porcelain"]{
  --rayl-sheet-a:var(--rayl-porcelain);
  --rayl-sheet-b:var(--rayl-off-white);
}
[data-rayl-sheet] > canvas{
  position:absolute;inset:0;display:block;width:100%;height:100%;
  border-radius:inherit;
  pointer-events:none;
}
/* A ground never takes the pointer. Safari hit-tests a fixed, full-frame
   element ahead of the static content over it, which put every control on the
   page behind a sheet; the reference's own overlay carries the same rule. The
   sheet listens on the window, so it loses nothing. */
[data-rayl-sheet][data-place="page"]{
  position:fixed;inset:0;z-index:-1;
  pointer-events:none;
}
`;

/* Theirs, off the running page. */
const VERTEX = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/*
 * Theirs, off the running page, with uColorStopsA/uColorStopsB/uPaletteMix
 * folded back into the one uColorStops stock Aurora has — on their page both
 * arrays hold the same three colours, so the mix between them does nothing.
 * Everything below that is the program they are running, unchanged.
 */
const FRAGMENT = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uLevels;
uniform vec2 uResolution;
uniform float uBlend;
uniform vec2 uMouse;
uniform float uGlow;
uniform float uTint;
uniform float uVeil;
uniform vec3 uDark;
uniform vec3 uLight;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* Their three-stop ramp across the frame, carrying a level rather than a
   colour: nought is the gradient's dark stop and one is its light stop. */
float ramp3(vec3 levels, float at) {
  return at < 0.5
    ? mix(levels.x, levels.y, at / 0.5)
    : mix(levels.y, levels.z, (at - 0.5) / 0.5);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  float level = ramp3(uLevels, uv.x);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 3.5 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  float aurora = clamp(intensity, 0.0, 1.0) * level;

  // Cursor effect (glow) — works even if auroraAlpha is zero
  vec2 mouseUV = uMouse / uResolution;
  float dist = distance(uv, mouseUV);
  float cursorEffect = smoothstep(uGlow, 0.0, dist);

  /* Their two composites, run on the level instead of on a colour. The disc
     goes to one, which is the light stop, so the brightest thing on a sheet
     is the brightest colour the gradient has and nothing is above it. */
  float lit = mix(aurora, 1.0, cursorEffect * uTint);
  float cover = max(auroraAlpha, cursorEffect * uVeil);

  /* The ground it is over: the approved gradient, first stop at 0.349%. */
  float ground = clamp((uv.y - 0.00349) / 0.99651, 0.0, 1.0);

  /* One number, and it cannot leave nought to one — so no pixel of a sheet is
     lighter than the gradient's light stop or darker than its dark one. */
  float t = clamp(mix(ground, lit, cover), 0.0, 1.0);

  /* Two neighbouring palette steps can be forty levels apart, so a field this
     wide bands. Half a level of noise, under what eight bits can hold. */
  vec3 col = mix(uDark, uLight, t) + (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  /* Held inside the two stops, so the half level of dither cannot push a
     pixel past either end of the gradient. */
  col = clamp(col, min(uDark, uLight), max(uDark, uLight));
  fragColor = vec4(col, 1.0);
}
`;

const UNIFORMS = [
  "uTime", "uAmplitude", "uLevels", "uResolution", "uBlend", "uMouse",
  "uGlow", "uTint", "uVeil", "uDark", "uLight",
];

/* Their three ramp stops, as levels off their own three colours: bright at one
   edge, near the dark stop in the middle, most of the way back at the other. */
const LEVELS = [1, 0.05, 0.75];

function styles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = CSS;
  document.head.append(tag);
}

export class RaylSheet {
  constructor(element, options = {}) {
    this.element = element;
    this.given = { ...options };
    this.look = { ...DEFAULTS, ...options };
    styles();

    /* Where the cursor is, in canvas pixels with the y flipped, the way the
       reference hands it over. Nothing driving it: the middle. */
    this.mouse = null;
    this.frame = 0;
    this.started = 0;
    this.visible = true;
    this.awake = true;

    this.apply();
    this.watch();
    this.start();
  }

  /** Which gradient, where it is placed, and whether it says it is provisional. */
  apply() {
    const known = Object.hasOwn(SHEETS, this.look.sheet);
    this.element.dataset.raylSheet = known ? this.look.sheet : "concrete";
    this.element.dataset.place = this.look.place;
    if (this.look.place === "page") {
      /* An invention you can see is a decision waiting to be made. */
      this.element.dataset.raylProvisional =
        "a sheet as a page ground — layering is open";
    } else {
      delete this.element.dataset.raylProvisional;
    }
    if (this.lit()) this.build();
    else this.tear();
    this.colours();
  }

  /** Whether there is a curtain at all, or only the flat art. */
  lit() {
    return this.look.motion !== "still" && !reduced();
  }

  /** The gradient's two stops, off the tokens, and nothing else. Every pixel
      of a sheet is between them. */
  colours() {
    if (!this.gl) return;
    const style = getComputedStyle(this.element);
    this.dark = rgb(style.getPropertyValue("--rayl-sheet-a"));
    this.light = rgb(style.getPropertyValue("--rayl-sheet-b"));
  }

  /* -------------------------------------------------------------- gl ---- */

  build() {
    if (this.gl) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    /* Opaque. The ground is inside the shader as a number rather than under a
       translucent canvas, so nothing here is drawn at part strength. */
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    /* No WebGL2 is not a failure: the CSS underneath is the approved gradient,
       which is what the rules ask for anyway. */
    if (!gl) return;
    const program = gl.createProgram();
    for (const [kind, source] of [
      [gl.VERTEX_SHADER, VERTEX],
      [gl.FRAGMENT_SHADER, FRAGMENT],
    ]) {
      const shader = gl.createShader(kind);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("rayl-sheet:", gl.getShaderInfoLog(shader));
        return;
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("rayl-sheet:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    /* One triangle over the whole frame. */
    const seat = gl.getAttribLocation(program, "position");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(seat);
    gl.vertexAttribPointer(seat, 2, gl.FLOAT, false, 0, 0);

    this.canvas = canvas;
    this.gl = gl;
    this.where = {};
    for (const name of UNIFORMS)
      this.where[name] = gl.getUniformLocation(program, name);
    this.element.append(canvas);
    this.size();
    this.colours();
  }

  tear() {
    if (!this.gl) return;
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.canvas.remove();
    this.gl = null;
    this.canvas = null;
  }

  size() {
    if (!this.gl) return;
    const box = this.element.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.look.dpr);
    const w = Math.max(1, Math.round(box.width * dpr));
    const h = Math.max(1, Math.round(box.height * dpr));
    if (this.canvas.width === w && this.canvas.height === h) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
  }

  draw(seconds) {
    const gl = this.gl;
    if (!gl) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const u = this.where;
    const mouse = this.mouse ?? [0.5, 0.5];

    gl.uniform1f(u.uTime, seconds * this.look.speed);
    gl.uniform1f(u.uAmplitude, this.look.amplitude);
    gl.uniform3fv(u.uLevels, LEVELS);
    gl.uniform2f(u.uResolution, w, h);
    gl.uniform1f(u.uBlend, this.look.blend);
    /* Theirs: canvas pixels, y from the bottom. */
    gl.uniform2f(u.uMouse, mouse[0] * w, (1 - mouse[1]) * h);
    gl.uniform3fv(u.uDark, this.dark ?? [0, 0, 0]);
    gl.uniform3fv(u.uLight, this.light ?? [1, 1, 1]);
    gl.uniform1f(u.uGlow, this.look.glow);
    gl.uniform1f(u.uTint, this.look.tint);
    gl.uniform1f(u.uVeil, this.look.veil);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* ------------------------------------------------------------- life ---- */

  watch() {
    /* The pointer is read against the element's box but listened for on the
       window: a ground has content over it, and those events never reach it. */
    this.onPointer = (event) => {
      const box = this.element.getBoundingClientRect();
      if (!box.width || !box.height) return;
      this.mouse = [
        (event.clientX - box.left) / box.width,
        (event.clientY - box.top) / box.height,
      ];
    };
    this.onLeave = () => {
      this.mouse = null;
    };
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("pointerleave", this.onLeave);

    this.onResize = () => this.size();
    this.watcher = new ResizeObserver(this.onResize);
    this.watcher.observe(this.element);

    /* Off screen is not drawn. A sheet behind a footer should cost nothing
       while nobody is looking at it. */
    this.seen = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible) this.start();
      },
      { rootMargin: "10%" },
    );
    this.seen.observe(this.element);

    this.onHidden = () => {
      this.awake = !document.hidden;
      if (this.awake) this.start();
    };
    document.addEventListener("visibilitychange", this.onHidden);

    /* Light and dark are two different sets of palette steps. */
    this.onMode = () => this.colours();
    this.mode = new MutationObserver(this.onMode);
    this.mode.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    this.scheme = window.matchMedia?.("(prefers-color-scheme: dark)");
    this.scheme?.addEventListener("change", this.onMode);
  }

  start() {
    if (this.frame || !this.gl) return;
    const tick = (now) => {
      this.frame = requestAnimationFrame(tick);
      if (!this.visible || !this.awake) return;
      if (!this.started) this.started = now;
      if (this.look.motion === "scroll") {
        const box = this.element.getBoundingClientRect();
        const run = window.innerHeight + box.height;
        const gone = run > 0 ? (window.innerHeight - box.top) / run : 0.5;
        this.mouse = [Math.min(1, Math.max(0, gone)), 0.5];
      }
      /* Theirs: uTime advances at one a second, measured on their page. */
      this.draw((now - this.started) / 1000);
    };
    this.frame = requestAnimationFrame(tick);
  }

  stop() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  /** Change a look on a live sheet — the same names the page opened with. */
  set(options = {}) {
    for (const [key, value] of Object.entries(options)) {
      if (value === undefined) delete this.given[key];
      else this.given[key] = value;
    }
    this.look = { ...DEFAULTS, ...this.given };
    this.apply();
    this.start();
    return this;
  }

  destroy() {
    this.stop();
    this.tear();
    this.seen?.disconnect();
    this.watcher?.disconnect();
    this.mode?.disconnect();
    this.scheme?.removeEventListener("change", this.onMode);
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("pointerleave", this.onLeave);
    document.removeEventListener("visibilitychange", this.onHidden);
    delete this.element.raylSheet;
  }
}

/**
 * One element, upgraded. This is the shape src/components.js wants: it takes
 * the element, reads its own attributes, and leaves the instance on it.
 */
export function upgrade(element) {
  if (element.raylSheet) return element.raylSheet;
  element.raylSheet = new RaylSheet(element, fromAttributes(element));
  return element.raylSheet;
}

/** Every sheet in a page, started. Called for you; call it again after you
    have put new markup on the page. */
export function mount(root = document) {
  const found = [];
  for (const element of root.querySelectorAll("[data-rayl-sheet]")) {
    if (element.raylSheet) continue;
    found.push(upgrade(element));
  }
  return found;
}

/**
 * `data-amplitude="1"` and the rest, read into a look. Names are the same as
 * the settings, and the element's own attribute names the gradient.
 */
function fromAttributes(element) {
  const look = {};
  const named = element.dataset.raylSheet;
  if (named) look.sheet = named;

  for (const [name, raw] of Object.entries(element.dataset)) {
    if (name === "raylSheet" || name === "raylProvisional") continue;
    const key = Object.keys(DEFAULTS).find(
      (k) => k.toLowerCase() === name.toLowerCase(),
    );
    if (!key) {
      console.warn(`rayl-sheet: nothing here is called "${name}"`);
      continue;
    }
    look[key] = read(raw, DEFAULTS[key]);
  }
  return look;
}

function read(raw, like) {
  if (typeof like === "number") {
    const value = Number(raw);
    return Number.isFinite(value) ? value : like;
  }
  return raw;
}

/** A resolved token, as three numbers nought to one. */
function rgb(value) {
  const text = String(value).trim();
  const hex = text.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const parts = text.match(/[\d.]+/g);
  if (parts && parts.length >= 3)
    return parts.slice(0, 3).map((p) => Number(p) / 255);
  return [0, 0, 0];
}

/** Whether the reader has asked the system not to animate things. */
function reduced() {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => mount());
  else mount();
}

export { SHEETS, CSS, FRAGMENT };
