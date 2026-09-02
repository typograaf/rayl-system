import * as THREE from "three";
import {
  DIAMETER,
  plateGeometry,
  cardGeometry,
  basketGeometry,
  reachAlong,
  radiusOf,
} from "./bodies.js";
import { surfaceMaterial } from "./surface.js";
import { DEFAULTS, SHEETS, readLook, settle, easing } from "./look.js";

const UP = new THREE.Vector3(0, 1, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);
/* A body is modelled lying flat, thickness on y. Stood up here, facing the
   camera, which is the whole difference between a stack of plates and a row of
   ellipses seen edge-on: a plate seen from the side is a line. */
const UPRIGHT = new THREE.Quaternion().setFromAxisAngle(RIGHT, Math.PI / 2);

/*
 * Where the basket comes from, when a page asks for one.
 *
 * Next to the script, wherever the script was served from, so a page that
 * copies the tag gets the body with it and a page that keeps its own copy is
 * not quietly fetching somebody else's. `window.RAYL_ARRAY_HOME` overrides it,
 * which is what a build putting the two in different places needs.
 */
export const HOME = new URL(
  (typeof window !== "undefined" && window.RAYL_ARRAY_HOME) || ".",
  import.meta.url,
).href;

/* The frame is wider than it is tall, so let the row run right to the edges
   across while keeping headroom for a body lifted out of it. */
const MARGIN_ACROSS = 1.06;
const MARGIN_UP = 1.02;

const geometries = new Map();
let basketPromise = null;

/** The body, built once and shared by every array on the page that wants it. */
function bodyGeometry(look) {
  const key =
    look.body === "card" ? `card:${look.depth.toFixed(4)}` : look.body;
  if (geometries.has(key)) return geometries.get(key);
  let made;
  if (look.body === "card") made = cardGeometry(look.depth);
  else if (look.body === "basket") {
    if (!basketPromise)
      basketPromise = basketGeometry(new URL("basket.bin", HOME).href);
    made = basketPromise;
  } else made = plateGeometry();
  geometries.set(key, made);
  return made;
}

/**
 * One array, in one element.
 *
 * The element is the frame. Everything is fitted to it — a row too long for a
 * narrow column is stood further back, not cropped — so the same look put in a
 * banner and in a card comes out as the same picture at two sizes.
 */
export class RaylArray {
  constructor(element, options = {}) {
    this.element = element;
    this.look = settle(readLook(options.look), options);

    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = "display:block;width:100%;height:100%";
    if (getComputedStyle(element).position === "static")
      element.style.position = "relative";
    element.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    this.renderer.setClearAlpha(0);
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.look.fov, 1, 0.1, 400);
    this.scene.add(this.camera);

    this.material = surfaceMaterial();
    this.mesh = null;
    this.rail = new THREE.Vector3(1, 0, 0);
    this.push = new THREE.Vector3(0, 1, 0);
    this.orientation = new THREE.Quaternion();
    this.places = [];
    this.matrix = new THREE.Matrix4();
    this.scratch = new THREE.Vector3();

    this.lightAt = [
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
    ];
    this.lightRadius = 1;
    this.phase = 0;
    this.pointerAt = null;
    this.started = 0;
    this.visible = true;
    this.awake = true;
    this.frame = 0;
    this.dirty = true;

    this.watch();
    /* Everything that has to wait for the body to exist waits on this, which
       matters for the basket: it is a fetch, so an array asked to change while
       it is still in the post would otherwise pose a row that is not there. */
    this.ready = this.build();
  }

  /* --------------------------------------------------------------- shape --- */

  async build() {
    const look = this.look;
    if (!["plate", "card", "basket"].includes(look.body)) {
      console.warn(
        `rayl-array: there is no "${look.body}" body — using a plate`,
      );
      look.body = "plate";
    }

    /* A copy, because the neighbour offsets are hung on the geometry as
       per-instance attributes and two arrays on one page do not have the same
       neighbours — or even the same number of them. The shared one is the
       thing that was expensive to make; copying it costs a memcpy. */
    const shared = await bodyGeometry(look);
    if (!this.renderer) return; // taken down while the basket was in the post
    const geometry = shared.clone();

    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.dispose();
    }

    const count = Math.max(1, Math.round(look.count));
    this.mesh = new THREE.InstancedMesh(geometry, this.material, count);
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    /* Where each body's neighbours are, as an offset from itself. The surface
       needs them to lay a shadow on the one behind, and they move with the
       wave, so they are attributes rather than a pair of uniforms. */
    this.prev = new THREE.InstancedBufferAttribute(
      new Float32Array(count * 3),
      3,
    );
    this.next = new THREE.InstancedBufferAttribute(
      new Float32Array(count * 3),
      3,
    );
    const vary = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
    for (let i = 0; i < count; i++) vary.setX(i, jitter(i));
    this.prev.setUsage(THREE.DynamicDrawUsage);
    this.next.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("aPrev", this.prev);
    geometry.setAttribute("aNext", this.next);
    geometry.setAttribute("aVary", vary);

    this.scene.add(this.mesh);
    this.bodyRadius = radiusOf(geometry);
    this.footprint(geometry);
    this.pose();
    this.paint();
    this.resize();
    this.start();
  }

  /**
   * The shape the body casts on its neighbour: a rounded rectangle, which is a
   * disc when the rectangle has no sides. A basket is neither, and a crate full
   * of slots does not cast a solid shadow anyway, so it casts none.
   */
  footprint(geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const u = this.material.uniforms;
    if (this.look.body === "card") {
      const wide = (box.max.x - box.min.x) / 2;
      const long = (box.max.z - box.min.z) / 2;
      const corner = Math.min(wide, long) * 0.272;
      u.uFootprint.value.set(
        Math.max(wide - corner, 0),
        Math.max(long - corner, 0),
      );
      u.uCorner.value = corner;
      u.uShade.value = this.look.shade;
    } else if (this.look.body === "plate") {
      u.uFootprint.value.set(0, 0);
      u.uCorner.value = (box.max.x - box.min.x) / 2;
      u.uShade.value = this.look.shade;
    } else {
      u.uShade.value = 0;
    }
  }

  /** Which way the row runs, which way the bodies face, and how far apart. */
  pose() {
    const look = this.look;
    const up = look.direction === "up";
    const along = up ? UP : RIGHT;
    this.push.copy(up ? RIGHT : UP);

    const turn = new THREE.Quaternion().setFromAxisAngle(UP, rad(look.lean));
    this.rail.copy(along).applyQuaternion(turn);

    /* `spin` turns the bodies and leaves the rail where it is, so they come
       back to face you while the row goes on receding. */
    const face = new THREE.Quaternion().setFromAxisAngle(
      UP,
      rad(look.lean + look.spin),
    );
    const tip = new THREE.Quaternion().setFromAxisAngle(RIGHT, rad(look.tilt));
    this.orientation.copy(tip.multiply(face).multiply(UPRIGHT));

    /* The step is the body plus the air, so nought is touching whatever the
       body is and however it is turned — not a distance between middles, which
       makes anything thicker plough into its neighbours. */
    const reach = reachAlong(this.mesh.geometry, this.orientation, this.rail);
    this.step = look.spreadIsStep
      ? DIAMETER * look.spread
      : reach + DIAMETER * look.spread;

    const u = this.material.uniforms;
    u.uFace.value.set(0, 1, 0).applyQuaternion(this.orientation);
    u.uRight.value.set(1, 0, 0).applyQuaternion(this.orientation);
    u.uUp.value.set(0, 0, 1).applyQuaternion(this.orientation);
    u.uBody.value = this.bodyRadius;

    /*
     * How far the rig stands off.
     *
     * The lamps are placed in stack radii, and a stack's radius is mostly the
     * length of the row — so a short row draws them in until they are inside
     * the body they are lighting, which is a blown corner and a hard diagonal
     * across the face rather than the soft fall this is supposed to be. Floored
     * against the body's own sphere, the rig holds still while the row shortens
     * under it. Same floor and the same multiple as the app.
     */
    const half = (Math.max(this.mesh.count, 1) - 1) * this.step * 0.5;
    this.lightRadius = Math.max(half + this.bodyRadius, this.bodyRadius * 2.5);
    u.uScale.value = this.lightRadius;
    this.aim();

    this.ease = easing(look.ease);
    this.dirty = true;
  }

  /** Everything about how it is lit and what it is made of. */
  paint() {
    const look = this.look;
    const u = this.material.uniforms;
    const sheet = Array.isArray(look.sheet)
      ? look.sheet
      : (SHEETS[look.sheet] ?? null);

    u.uColour.value.setStyle(look.colour);
    u.uSky.value.setStyle(look.sky || sheet?.[0] || SHEETS.porcelain[0]);
    u.uGround.value.setStyle(look.ground || sheet?.[1] || SHEETS.porcelain[1]);
    u.uAmbient.value = look.ambient;
    u.uTranslucency.value = look.translucency;
    u.uScatter.value = look.scatter;
    u.uWrap.value = look.wrap;
    u.uFalloff.value = look.falloff;
    u.uRoughness.value = look.roughness;
    u.uCoat.value = look.coat;
    u.uContrast.value = look.contrast;
    u.uOcclusion.value = look.occlusion;
    u.uShade.value = look.body === "basket" ? 0 : look.shade;

    const lights = [
      [look.key, look.keyColour, look.keyAt, look.keySize],
      [look.fill, look.fillColour, look.fillAt, look.fillSize],
      [look.rim, look.rimColour, look.rimAt, look.rimSize],
    ];
    lights.forEach(([level, colour, at, size], i) => {
      u.uLightLevel.value[i] = level;
      u.uLightColour.value[i].setStyle(colour);
      u.uLightSize.value[i] = size;
      /*
       * Where a light sits is given in the row's own frame, not the world's.
       * Held in world axes the same rig means two different things depending on
       * which way the row runs: a key mostly above a row going across is barely
       * off the end of it, and a long way off the end of the same row stood up.
       */
      const [alongRow, acrossRow, towards] = at;
      const a = look.direction === "up" ? acrossRow : alongRow;
      const b = look.direction === "up" ? alongRow : acrossRow;
      this.lightAt[i] = [a, b, towards];
    });

    this.renderer.toneMappingExposure = look.exposure;
    this.aim();

    /* The sheet is the page's, not the canvas's: it does not move when a light
       does, and a page that puts an array over its own ground wants that ground
       and not a grey rectangle. */
    if (sheet) {
      this.element.style.background = `linear-gradient(180deg, ${sheet[0]}, ${sheet[1]})`;
      this.sheeted = true;
    } else if (this.sheeted) {
      this.element.style.background = "";
      this.sheeted = false;
    }

    if (look.art && look.body === "card") this.loadArt(look.art);
    else u.uArtOn.value = 0;

    this.dirty = true;
  }

  /** The rig, put where it goes: its placement is in stack radii, not metres. */
  aim() {
    const u = this.material.uniforms;
    for (let i = 0; i < 3; i++) {
      const [a, b, c] = this.lightAt[i];
      u.uLightAt.value[i].set(a, b, c).multiplyScalar(this.lightRadius);
    }
    u.uScale.value = this.lightRadius;
  }

  loadArt(url) {
    if (this.artUrl === url) return;
    this.artUrl = url;
    new THREE.TextureLoader().load(url, (texture) => {
      if (!this.renderer || this.artUrl !== url) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      const u = this.material.uniforms;
      u.uArt.value = texture;
      u.uArtOn.value = 1;
      this.mesh.geometry.computeBoundingBox();
      const box = this.mesh.geometry.boundingBox;
      u.uArtSize.value.set(box.max.x - box.min.x, box.max.z - box.min.z);
      this.dirty = true;
    });
  }

  /* -------------------------------------------------------------- motion --- */

  /**
   * The crest, as a stadium does a wave: one peak travelling the length of the
   * row and out the far end, lifting each body as it passes.
   *
   * Not a sine. A sine lifts every body at once by a different amount, which is
   * a ripple through a row rather than something moving along it — and it never
   * leaves, so the row never comes to rest.
   */
  waveAt(i, count, phase) {
    const look = this.look;
    if (look.wave <= 0.001) return 0;
    const reach = Math.max(look.brush, 1);
    /* Starting and finishing clear of the row, so the crest enters and leaves
       rather than appearing on the first body. */
    const travel = count - 1 + reach * 2;
    const peaks = Math.max(1, Math.round(look.peaks));
    let crest = 0;
    for (let k = 0; k < peaks; k++) {
      const turn = (phase + k / peaks) % 1;
      const head = -reach + this.ease(turn) * travel;
      const d = Math.abs(i - head) / reach;
      if (d >= 1) continue;
      /* The largest, not the sum: two crests overlapping raise a body once. */
      crest = Math.max(crest, 0.5 * (1 + Math.cos(Math.PI * d)));
    }
    return crest * look.wave * this.bodyRadius * 1.5;
  }

  /** Where the crest is, this frame, according to whatever is driving it. */
  drive(now) {
    const look = this.look;
    switch (look.motion) {
      case "still":
        return look.at;
      case "scroll": {
        const box = this.element.getBoundingClientRect();
        const height = window.innerHeight || 1;
        /* Nought as the element comes on at the bottom, one as it leaves at the
           top, so the crest crosses the row once per screenful of scrolling. */
        const seen = (height - box.top) / (height + box.height);
        return Math.min(1, Math.max(0, seen));
      }
      case "pointer": {
        if (this.pointerAt === null) return look.at;
        return this.pointerAt;
      }
      default: {
        if (!this.started) this.started = now;
        return ((now - this.started) / 1000 / Math.max(look.seconds, 0.1)) % 1;
      }
    }
  }

  /** Put every body where it goes this frame. */
  place(phase) {
    const count = this.mesh.count;
    const places = this.places;
    for (let i = 0; i < count; i++) {
      const along = (i - (count - 1) / 2) * this.step;
      const lift = this.waveAt(i, count, phase);
      const at = places[i] || (places[i] = new THREE.Vector3());
      at.copy(this.rail).multiplyScalar(along).addScaledVector(this.push, lift);
    }
    for (let i = 0; i < count; i++) {
      this.matrix.compose(places[i], this.orientation, ONE);
      this.mesh.setMatrixAt(i, this.matrix);
      const before =
        i > 0 ? this.scratch.subVectors(places[i - 1], places[i]) : ZERO;
      this.prev.setXYZ(i, before.x, before.y, before.z);
      const after =
        i < count - 1
          ? this.scratch.subVectors(places[i + 1], places[i])
          : ZERO;
      this.next.setXYZ(i, after.x, after.y, after.z);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.prev.needsUpdate = true;
    this.next.needsUpdate = true;
  }

  /* --------------------------------------------------------------- frame --- */

  /**
   * Where the row gets to, and how far back the camera has to stand to see it.
   *
   * Taken at the wave's full swing rather than where it happens to be, or the
   * framing would breathe with the animation — but only on the side the wave
   * actually goes. A crest lifts a body up and never down, so reserving the
   * same headroom underneath leaves a third of the picture empty, which is the
   * difference between a row that fills a banner and a row sitting in the
   * middle of one.
   *
   * Each body then gives a closed-form bound, since depth along the view axis
   * is linear in the distance, and the answer is the largest of them. Nothing
   * to iterate.
   */
  fit() {
    const count = this.mesh?.count || 1;
    const r = this.bodyRadius;
    const lift = this.look.motion === "still" ? 0 : this.look.wave * r * 1.5;

    const low = new THREE.Vector3(Infinity, Infinity, Infinity);
    const high = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    const corners = [];
    for (let i = 0; i < count; i++) {
      const along = (i - (count - 1) / 2) * this.step;
      const base = new THREE.Vector3().copy(this.rail).multiplyScalar(along);
      const top = base.clone().addScaledVector(this.push, lift);
      corners.push(base, top);
      low.min(base).min(top);
      high.max(base).max(top);
    }
    const centre = low.clone().add(high).multiplyScalar(0.5);

    const aspect = Math.max(this.camera.aspect, 0.01);
    const tanUp = Math.tan(rad(this.look.fov) / 2) * MARGIN_UP;
    const tanAcross = tanUp * aspect * MARGIN_ACROSS;

    let distance = r * 3;
    for (const point of corners) {
      const depth = point.z - centre.z;
      const across = Math.abs(point.x - centre.x) + r;
      const up = Math.abs(point.y - centre.y) + r;
      distance = Math.max(
        distance,
        across / tanAcross - depth,
        up / tanUp - depth,
      );
    }
    return { centre, distance: distance / Math.max(this.look.zoom, 0.05) };
  }

  resize() {
    const box = this.element.getBoundingClientRect();
    const width = Math.max(1, Math.round(box.width));
    const height = Math.max(1, Math.round(box.height));
    const dpr = Math.min(window.devicePixelRatio || 1, this.look.dpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.fov = this.look.fov;

    if (this.mesh) {
      const { centre, distance } = this.fit();
      /* Pan is in frames, so half a frame moves the row to the edge of the
         picture whatever the fit came out at. */
      const reach = Math.tan(rad(this.look.fov) / 2) * distance;
      const x = centre.x - this.look.pan[0] * reach * this.camera.aspect * 2;
      const y = centre.y - this.look.pan[1] * reach * 2;
      this.camera.position.set(x, y, centre.z + distance);
      this.camera.lookAt(x, y, centre.z);
      this.camera.near = Math.max(distance * 0.02, 0.05);
      this.camera.far = distance * 4 + this.bodyRadius * 8;
    }
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }

  /* --------------------------------------------------------------- life ---- */

  watch() {
    this.onResize = () => this.resize();
    this.observer = new ResizeObserver(this.onResize);
    this.observer.observe(this.element);

    /* Off screen is not rendered. An array in a page's footer should cost
       nothing while nobody is looking at it. */
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

    this.onPointer = (event) => {
      const box = this.element.getBoundingClientRect();
      const at =
        this.look.direction === "up"
          ? 1 - (event.clientY - box.top) / Math.max(box.height, 1)
          : (event.clientX - box.left) / Math.max(box.width, 1);
      this.pointerAt = Math.min(1, Math.max(0, at));
      this.dirty = true;
    };
    this.onLeave = () => {
      this.pointerAt = null;
      this.dirty = true;
    };
    this.element.addEventListener("pointermove", this.onPointer);
    this.element.addEventListener("pointerleave", this.onLeave);

    this.onScroll = () => {
      this.dirty = true;
    };
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  /** Whether anything is moving, or the picture is finished and can be left. */
  moving() {
    if (this.look.motion === "still") return false;
    if (this.look.motion === "pointer") return false;
    if (this.look.motion === "scroll") return false;
    return !reduced();
  }

  start() {
    if (this.frame || !this.renderer) return;
    const tick = (now) => {
      this.frame = requestAnimationFrame(tick);
      if (!this.visible || !this.awake || !this.mesh) return;
      const moving = this.moving();
      if (!moving && !this.dirty) return;
      this.dirty = false;
      this.place(this.drive(now));
      this.renderer.render(this.scene, this.camera);
    };
    this.frame = requestAnimationFrame(tick);
  }

  stop() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  /** Change a look on a live array — the same names the page opened with. */
  set(options = {}) {
    const before = this.look;
    this.look = settle(before, readLook(options.look), options);
    const remade =
      this.look.body !== before.body ||
      Math.round(this.look.count) !== Math.round(before.count) ||
      (this.look.body === "card" && this.look.depth !== before.depth);
    this.ready = this.ready.then(() => {
      if (!this.renderer) return;
      if (remade || !this.mesh) return this.build();
      this.pose();
      this.paint();
      this.resize();
      this.start();
    });
    return this.ready;
  }

  destroy() {
    this.stop();
    this.observer?.disconnect();
    this.seen?.disconnect();
    document.removeEventListener("visibilitychange", this.onHidden);
    window.removeEventListener("scroll", this.onScroll);
    this.element.removeEventListener("pointermove", this.onPointer);
    this.element.removeEventListener("pointerleave", this.onLeave);
    this.mesh?.dispose();
    this.material.dispose();
    this.renderer.dispose();
    this.canvas.remove();
    this.renderer = null;
  }
}

const ONE = new THREE.Vector3(1, 1, 1);
const ZERO = new THREE.Vector3(0, 0, 0);

const rad = (degrees) => (degrees * Math.PI) / 180;

/**
 * One number per place in the row, the same one every frame.
 *
 * A row is one body drawn many times, and at some point that is what it starts
 * to look like. A fraction of a per cent either way is small enough that
 * nobody picks out the odd one and enough that the row stops reading as a
 * repeat. Deterministic, or it would be a row that shimmered.
 */
function jitter(i) {
  const v = Math.sin(i * 12.9898 + 5.9) * 43758.5453;
  return v - Math.floor(v) - 0.5;
}

/** Whether the reader has asked the system not to animate things. */
function reduced() {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
}

export { DEFAULTS, readLook };
