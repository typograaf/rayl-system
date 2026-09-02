import * as THREE from "three";
import { PLATE_PROFILE } from "../baked/plate.js";

/**
 * The three bodies an array can be made of.
 *
 * The app models all of them. Here two are described instead — the plate by the
 * outline that was turned to make it, the card by the three numbers the design
 * gives — and only the basket, which is a real crate with slots in it and no
 * description at all, is a file that has to be fetched.
 *
 * Every body is built lying in the ground plane with its thickness on y, which
 * is the axis the layout stands things up from. Same convention as the app, so
 * the same angles mean the same thing.
 */

/* The plate's diameter, and the unit every other body is sized against: a card
   is as long as a plate is wide, so a row of either frames and spaces the
   same. */
export const DIAMETER = 2.14;

/* The card, from the design: 352.872 across, 525.007 down, corners at 48.002.
   Held as ratios so the long side can be the plate's diameter. */
const CARD_RATIO = 352.8721 / 525.0072;
const CARD_CORNER = 48.0021 / 352.8721;

/** How many facets round a turned body. Enough that a rim reads as a curve. */
const SEGMENTS = 96;

/**
 * The plate: the baked outline, turned.
 *
 * Normals come off the outline rather than out of `computeVertexNormals`. A
 * turned surface knows its own normal exactly — perpendicular to the line being
 * turned — and averaging triangles instead leaves the rim faceted at exactly
 * the place the light runs along it.
 */
export function plateGeometry(segments = SEGMENTS) {
  const profile = PLATE_PROFILE;
  const rings = profile.length;

  /* The outline's own normal at each point: perpendicular to the way the line
     is going, averaged where two segments meet, which is what makes the curve
     shade as a curve. */
  const flat = [];
  for (let i = 0; i < rings - 1; i++) {
    const dr = profile[i + 1][0] - profile[i][0];
    const dy = profile[i + 1][1] - profile[i][1];
    const len = Math.hypot(dr, dy) || 1;
    flat.push([dy / len, -dr / len]);
  }
  const normals = [];
  for (let i = 0; i < rings; i++) {
    const a = flat[Math.max(i - 1, 0)];
    const b = flat[Math.min(i, flat.length - 1)];
    const nr = a[0] + b[0];
    const ny = a[1] + b[1];
    const len = Math.hypot(nr, ny) || 1;
    normals.push([nr / len, ny / len]);
  }

  const count = rings * (segments + 1);
  const position = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  let p = 0;
  for (let s = 0; s <= segments; s++) {
    const a = (s / segments) * Math.PI * 2;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    for (let i = 0; i < rings; i++) {
      position[p] = profile[i][0] * cos;
      position[p + 1] = profile[i][1];
      position[p + 2] = profile[i][0] * sin;
      normal[p] = normals[i][0] * cos;
      normal[p + 1] = normals[i][1];
      normal[p + 2] = normals[i][0] * sin;
      p += 3;
    }
  }

  const indices = [];
  for (let s = 0; s < segments; s++) {
    for (let i = 0; i < rings - 1; i++) {
      const a = s * rings + i;
      const b = a + rings;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  geometry.setIndex(indices);
  return geometry;
}

/**
 * The card: a rounded rectangle given a thickness, with the edge rolled right
 * over rather than cut square.
 *
 * Built as rings the way the plate is — the outline swept through a half-turn
 * from the underside to the top — so the edge is a real curve with its own
 * normals, and the face it rolls into is one surface with it. An extruder would
 * hand back three flat pieces meeting at a crease, which is the thing a printed
 * card does not have.
 */
export function cardGeometry(thickness = 0.05, steps = 7) {
  const wide = DIAMETER * CARD_RATIO;
  const long = DIAMETER;
  const half = Math.max(thickness, 0.004) * wide * 0.5;
  const corner = CARD_CORNER * wide;

  /* The outline, anticlockwise from the corner, as points with the direction
     they face. A rounded rectangle is four arcs; the straights between them
     fall out of the arcs' ends. */
  const outline = [];
  const arc = Math.max(6, Math.round(SEGMENTS / 8));
  const centres = [
    [wide / 2 - corner, long / 2 - corner, 0],
    [-(wide / 2 - corner), long / 2 - corner, Math.PI / 2],
    [-(wide / 2 - corner), -(long / 2 - corner), Math.PI],
    [wide / 2 - corner, -(long / 2 - corner), -Math.PI / 2],
  ];
  for (const [cx, cz, from] of centres) {
    for (let i = 0; i <= arc; i++) {
      const a = from + (i / arc) * (Math.PI / 2);
      outline.push([
        cx + Math.cos(a) * corner,
        cz + Math.sin(a) * corner,
        Math.cos(a),
        Math.sin(a),
      ]);
    }
  }
  outline.push(outline[0]);

  /* Swept from below to above. At each step the outline is drawn in by how far
     the roll has come, and lifted by how far round it is. */
  const rings = steps * 2 + 1;
  const count = outline.length * rings;
  const position = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  let p = 0;
  for (let r = 0; r < rings; r++) {
    const a = (r / (rings - 1) - 0.5) * Math.PI;
    const inset = (1 - Math.cos(a)) * half;
    const lift = Math.sin(a) * half;
    for (const [x, z, nx, nz] of outline) {
      position[p] = x - nx * inset;
      position[p + 1] = lift;
      position[p + 2] = z - nz * inset;
      normal[p] = nx * Math.cos(a);
      normal[p + 1] = Math.sin(a);
      normal[p + 2] = nz * Math.cos(a);
      p += 3;
    }
  }

  const wideRing = outline.length;
  const indices = [];
  for (let r = 0; r < rings - 1; r++) {
    for (let i = 0; i < wideRing - 1; i++) {
      const a = r * wideRing + i;
      const b = a + wideRing;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }

  /* The two faces, each a fan from its own middle. Flat, so one normal does. */
  const extra = [];
  for (const [ring, sign] of [
    [0, -1],
    [rings - 1, 1],
  ]) {
    const middle = count + extra.length / 3;
    extra.push(0, sign * half, 0);
    const base = ring * wideRing;
    for (let i = 0; i < wideRing - 1; i++) {
      if (sign > 0) indices.push(middle, base + i, base + i + 1);
      else indices.push(middle, base + i + 1, base + i);
    }
  }

  const positions = new Float32Array(count * 3 + extra.length);
  positions.set(position);
  positions.set(extra, count * 3);
  const normals = new Float32Array(positions.length);
  normals.set(normal);
  normals.set([0, -1, 0, 0, 1, 0], count * 3);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  return geometry;
}

/**
 * The basket, which has to be fetched.
 *
 * Positions in sixteen bits, normals folded through an octahedron into two,
 * and the triangle list held as steps rather than numbers — see tools/bake.mjs.
 * A quarter of a megabyte, against the megabyte and a half the app loads, and
 * nothing asks for it unless a page puts a basket on the screen.
 */
export async function basketGeometry(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`no basket at ${url}`);
  const packed = await unzip(await response.arrayBuffer());

  const view = new DataView(
    packed.buffer,
    packed.byteOffset,
    packed.byteLength,
  );
  const tag = String.fromCharCode(...packed.subarray(0, 4));
  if (tag !== "RAYL") throw new Error("that is not a Rayl body");
  const version = view.getUint32(4, true);
  if (version !== 2)
    throw new Error(`body version ${version} is not one this knows`);
  const vertices = view.getUint32(8, true);
  const triangles = view.getUint32(12, true);
  const deltas = view.getUint32(16, true);
  const scale = view.getFloat32(20, true);

  let at = 36;
  const quantised = new Int16Array(
    packed.buffer.slice(
      packed.byteOffset + at,
      packed.byteOffset + at + vertices * 6,
    ),
  );
  at += vertices * 6;
  const folded = new Int8Array(
    packed.buffer.slice(
      packed.byteOffset + at,
      packed.byteOffset + at + vertices * 2,
    ),
  );
  at += vertices * 2;
  const steps = packed.subarray(at, at + deltas);

  const position = new Float32Array(vertices * 3);
  for (let i = 0; i < vertices * 3; i++)
    position[i] = (quantised[i] / 32767) * scale;

  const normal = new Float32Array(vertices * 3);
  for (let i = 0; i < vertices; i++) {
    let x = folded[i * 2] / 127;
    let y = folded[i * 2 + 1] / 127;
    let z = 1 - Math.abs(x) - Math.abs(y);
    if (z < 0) {
      const nx = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1);
      const ny = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1);
      x = nx;
      y = ny;
    }
    const len = Math.hypot(x, y, z) || 1;
    normal[i * 3] = x / len;
    normal[i * 3 + 1] = y / len;
    normal[i * 3 + 2] = z / len;
  }

  const index = new Uint32Array(triangles);
  let read = 0;
  let previous = 0;
  for (let i = 0; i < triangles; i++) {
    let shift = 0;
    let zig = 0;
    for (;;) {
      const byte = steps[read++];
      zig |= (byte & 0x7f) << shift;
      if (!(byte & 0x80)) break;
      shift += 7;
    }
    const step = zig & 1 ? -((zig + 1) >>> 1) : zig >>> 1;
    previous += step;
    index[i] = previous;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  geometry.setIndex(new THREE.BufferAttribute(index, 1));
  return geometry;
}

/** Gzip, undone by the browser. Nothing is shipped uncompressed. */
async function unzip(buffer) {
  const bytes = new Uint8Array(buffer);
  /* Already unpacked, if a server decompressed it on the way. */
  if (bytes[0] === 0x52 && bytes[1] === 0x41) return bytes;
  const stream = new Blob([buffer])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * How far a body reaches along a given direction, once it has been turned.
 *
 * The spacing is the air between one body and the next, so the step from one to
 * the next is this plus that air. Measured off the mesh along the row rather
 * than off the bounding box, which is right for a card and much too big for
 * anything round: a plate turned edge-on takes up almost nothing along the row
 * and a box says it takes up a whole diameter.
 */
export function reachAlong(geometry, quaternion, direction) {
  const position = geometry.attributes.position;
  const point = new THREE.Vector3();
  let low = Infinity;
  let high = -Infinity;
  const stride = position.count > 20000 ? 3 : 1;
  for (let i = 0; i < position.count; i += stride) {
    point.fromBufferAttribute(position, i).applyQuaternion(quaternion);
    const at = point.dot(direction);
    if (at < low) low = at;
    if (at > high) high = at;
  }
  /* End to end, not twice the furthest: a plate's outline is not symmetric
     about its own middle, and doubling one side stands the row apart. */
  return high - low;
}

/** The furthest any part of the body is from its own middle. */
export function radiusOf(geometry) {
  geometry.computeBoundingSphere();
  return geometry.boundingSphere.radius;
}
