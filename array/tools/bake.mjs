/**
 * Turn the app's models into something a web page can afford.
 *
 *     npm run bake            reads ../../rayl-stack/public/*.glb
 *     RAYL_STACK=<dir> npm run bake
 *
 * The app ships 6.6MB of GLB for four bodies. A page cannot, so each body is
 * reduced by the thing it actually is rather than by a general simplifier:
 *
 *   plate   a surface of revolution, so all it needs is its profile — a few
 *           dozen points in a text file, lathed back at load. Exact, and about
 *           a thousandth of the weight.
 *   card    a rounded slab, described by the design's three numbers, so it is
 *           generated and there is nothing to bake at all.
 *   basket  a real crate with a hundred slots in it, and nothing about it is
 *           describable. It is quantised, gzipped and fetched only if a page
 *           asks for one.
 *
 * Everything written here is generated. Edit this, never `baked/`.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const stack =
  process.env.RAYL_STACK || path.join(root, "../../rayl-stack/public");
const baked = path.join(root, "baked");
const assets = path.join(root, "../assets/array");

const loader = new GLTFLoader();

/** Every mesh in a glb, in the order the file holds them. */
function meshes(file) {
  const buf = fs.readFileSync(path.join(stack, file));
  const bytes = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
  return new Promise((resolve, reject) =>
    loader.parse(
      bytes,
      "",
      (gltf) => {
        const found = [];
        gltf.scene.traverse((o) => {
          if (o.isMesh) found.push({ name: o.name, geometry: o.geometry });
        });
        resolve(found);
      },
      reject,
    ),
  );
}

// ------------------------------------------------------------------ plate ---

/**
 * The plate's cross-section, cut off the model.
 *
 * Not sampled from the vertices. Collapsing every vertex onto (radius, height)
 * does give the drawn profile as a cloud, and then there is no way back to the
 * order they were drawn in: a plate's section doubles back on itself twice, so
 * "nearest point next" walks up the outside of the rim and straight down the
 * inside of it, and what comes out is a zig-zag that fits nothing.
 *
 * So the mesh is cut with a plane instead, the way a saw would. Every triangle
 * crossing z = 0 hands back one segment, and two triangles sharing an edge hand
 * back segments sharing an endpoint — the model's own connectivity, which is
 * exactly the ordering that was missing. Chaining on the crossed *edge* rather
 * than on the position is what makes that exact: two floats computed twice are
 * not equal, two edge indices are.
 */
function plateProfile(geometry, { simplify = 0.00022 } = {}) {
  const position = geometry.attributes.position;
  const index = geometry.index;
  const triangles = index ? index.count / 3 : position.count / 3;
  const at = (i) => (index ? index.getX(i) : i);

  /* The cut, as segments keyed by which edge each end came out of. */
  const segments = [];
  const place = new Map();
  for (let t = 0; t < triangles; t++) {
    const v = [at(t * 3), at(t * 3 + 1), at(t * 3 + 2)];
    const z = v.map((i) => position.getZ(i));
    const ends = [];
    for (let e = 0; e < 3; e++) {
      const a = e;
      const b = (e + 1) % 3;
      /* One side of the plane, or the other. A vertex exactly on it is counted
         as being on the positive side, so a triangle with a vertex in the plane
         crosses two of its edges and not three. */
      if (z[a] >= 0 === z[b] >= 0) continue;
      const f = z[a] / (z[a] - z[b]);
      const x =
        position.getX(v[a]) + (position.getX(v[b]) - position.getX(v[a])) * f;
      const y =
        position.getY(v[a]) + (position.getY(v[b]) - position.getY(v[a])) * f;
      const key = v[a] < v[b] ? `${v[a]}-${v[b]}` : `${v[b]}-${v[a]}`;
      ends.push({ key, x, y });
    }
    /* Only the half of the cut on the positive x side: the plane cuts the plate
       in two and both halves are the same profile mirrored. */
    if (ends.length !== 2) continue;
    if (ends[0].x + ends[1].x <= 0) continue;
    for (const end of ends)
      if (!place.has(end.key)) place.set(end.key, [end.x, end.y]);
    segments.push([ends[0].key, ends[1].key]);
  }

  /* Every crossing point knows the two segments it belongs to, so the chain is
     just following them round. */
  const links = new Map();
  for (const [a, b] of segments) {
    if (!links.has(a)) links.set(a, []);
    if (!links.has(b)) links.set(b, []);
    links.get(a).push(b);
    links.get(b).push(a);
  }

  /*
   * Start at an end, not at the rim.
   *
   * The rim is the obvious landmark and it is in the middle of the line: a walk
   * from there goes one way, stops, and hands back half a plate — which fits
   * the model over the half it covers and is wrong about the rest, so the check
   * catches it but the numbers on their own look reasonable. A plate's section
   * is an open line with both ends on the axis, so an end is a point with one
   * neighbour, and there are exactly two of them.
   */
  let start = null;
  for (const [key, near] of links) if (near.length === 1) start = key;
  if (!start) for (const key of place.keys()) start = key;

  const order = [start];
  const seen = new Set([start]);
  let current = start;
  for (;;) {
    const next = (links.get(current) || []).find((k) => !seen.has(k));
    if (!next) break;
    seen.add(next);
    order.push(next);
    current = next;
  }

  /* Radius and height. The cut ran along +x, so x is the radius already. */
  const walked = order.map((key) => place.get(key));
  const closed = links.get(start)?.length === 2 && seen.size === place.size;
  if (closed) walked.push(walked[0]);

  return {
    outline: reduce(walked, simplify),
    raw: walked.length,
    cloud: place.size,
  };
}

/** Ramer–Douglas–Peucker: drop the points the line goes through anyway. */
function reduce(line, epsilon) {
  if (line.length < 3) return line.slice();
  let worst = 0;
  let index = 0;
  const [ax, ay] = line[0];
  const [bx, by] = line[line.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const span = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < line.length - 1; i++) {
    const [px, py] = line[i];
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / span;
    if (d > worst) {
      worst = d;
      index = i;
    }
  }
  if (worst <= epsilon) return [line[0], line[line.length - 1]];
  return [
    ...reduce(line.slice(0, index + 1), epsilon).slice(0, -1),
    ...reduce(line.slice(index), epsilon),
  ];
}

/**
 * How far the lathed outline is from the model it came from.
 *
 * Every vertex in the file is asked for its distance to the nearest segment of
 * the outline. A profile that has been walked into the wrong order is not
 * slightly wrong — it is a zig-zag across the section — so this is the check
 * that the walk worked, and it is worth more than looking at the numbers.
 */
function checkProfile(geometry, outline) {
  const position = geometry.attributes.position;
  let worst = 0;
  for (let i = 0; i < position.count; i += 7) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const r = Math.hypot(x, z);
    let near = Infinity;
    for (let s = 0; s < outline.length - 1; s++) {
      const [x1, y1] = outline[s];
      const [x2, y2] = outline[s + 1];
      const vx = x2 - x1;
      const vy = y2 - y1;
      const len = vx * vx + vy * vy;
      let t = len > 0 ? ((r - x1) * vx + (y - y1) * vy) / len : 0;
      t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(r - (x1 + vx * t), y - (y1 + vy * t));
      if (d < near) near = d;
    }
    if (near > worst) worst = near;
  }
  return worst;
}

// ----------------------------------------------------------------- basket ---

/** Sixteen bits of position, eight of normal, and the file gets six times
    smaller. A crate 2.14 across is then placed to a fortieth of a millimetre,
    which is finer than the model was ever modelled. */
function pack(geometry) {
  const g = geometry.clone();
  g.computeBoundingBox();
  const box = g.boundingBox;
  const centre = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const scale = Math.max(size.x, size.y, size.z) / 2;

  const position = g.attributes.position;
  const normal = g.attributes.normal;
  const count = position.count;

  const positions = new Int16Array(count * 3);
  const normals = new Int8Array(count * 2);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.round(
      ((position.getX(i) - centre.x) / scale) * 32767,
    );
    positions[i * 3 + 1] = Math.round(
      ((position.getY(i) - centre.y) / scale) * 32767,
    );
    positions[i * 3 + 2] = Math.round(
      ((position.getZ(i) - centre.z) / scale) * 32767,
    );
    const [u, v] = octEncode(normal.getX(i), normal.getY(i), normal.getZ(i));
    normals[i * 2] = u;
    normals[i * 2 + 1] = v;
  }
  const source = g.index ? g.index.array : null;
  const indices = new Uint32Array(source ? source.length : count);
  if (source) indices.set(source);
  else for (let i = 0; i < count; i++) indices[i] = i;

  /*
   * The list of triangles is two thirds of the file, and two bytes an entry is
   * the wrong way to hold it: a mesh's indices climb, so what is small is the
   * step from one to the next rather than the number itself. Stepped, zig-
   * zagged so a step backwards is small too, and written as a varint, most of
   * them come out in one byte and the compressor can see a pattern in what is
   * left. It is what meshopt does, without the decoder that comes with it.
   */
  const deltas = [];
  let previous = 0;
  for (const i of indices) {
    const step = i - previous;
    previous = i;
    let zig = step < 0 ? -step * 2 - 1 : step * 2;
    for (;;) {
      const byte = zig & 0x7f;
      zig >>>= 7;
      if (zig) deltas.push(byte | 0x80);
      else {
        deltas.push(byte);
        break;
      }
    }
  }

  /* Header, then the three arrays, each aligned to its own width. */
  const head = new Float32Array([scale, 0, 0, 0]);
  const counts = new Uint32Array([count, indices.length, deltas.length]);
  const parts = [
    Buffer.from("RAYL", "ascii"),
    Buffer.from(new Uint32Array([2]).buffer),
    Buffer.from(counts.buffer),
    Buffer.from(head.buffer),
    Buffer.from(positions.buffer),
    Buffer.from(normals.buffer),
    Buffer.from(Uint8Array.from(deltas).buffer),
  ];
  return Buffer.concat(parts);
}

/** A unit vector in two signed bytes, folded through the octahedron. */
function octEncode(x, y, z) {
  const sum = Math.abs(x) + Math.abs(y) + Math.abs(z) || 1;
  let u = x / sum;
  let v = y / sum;
  if (z < 0) {
    const su = u >= 0 ? 1 : -1;
    const sv = v >= 0 ? 1 : -1;
    const nu = (1 - Math.abs(v)) * su;
    const nv = (1 - Math.abs(u)) * sv;
    u = nu;
    v = nv;
  }
  return [
    Math.max(-127, Math.min(127, Math.round(u * 127))),
    Math.max(-127, Math.min(127, Math.round(v * 127))),
  ];
}

// ------------------------------------------------------------------- main ---

const plate = (await meshes("plate.glb"))[0];
const { outline, raw, cloud } = plateProfile(plate.geometry);
const error = checkProfile(plate.geometry, outline);
console.log(
  `plate   ${plate.geometry.attributes.position.count} verts -> ${cloud} places -> ${raw} walked -> ${outline.length} kept`,
);
console.log(
  `        worst distance from the model: ${error.toFixed(5)} of a 2.14 body`,
);
if (error > 0.01)
  throw new Error("the profile does not fit the model it came from");

const round = (n) => Number(n.toFixed(5));
fs.writeFileSync(
  path.join(baked, "plate.js"),
  `/* Generated by tools/bake.mjs from the app's plate.glb. Do not edit.
   The plate's cross-section as [radius, height], 1.07 being its own rim. */
export const PLATE_PROFILE = ${JSON.stringify(outline.map((p) => [round(p[0]), round(p[1])]))};
`,
);

const basket = (await meshes("basket.glb"))[0];
const packed = pack(basket.geometry);
const zipped = zlib.gzipSync(packed, { level: 9 });
fs.mkdirSync(assets, { recursive: true });
fs.writeFileSync(path.join(assets, "basket.bin"), zipped);
/* And a copy where the dev server can reach it, since in development the
   script is served from src/ and the body is looked for beside it. */
fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.writeFileSync(path.join(root, "public/basket.bin"), zipped);
console.log(
  `basket  ${basket.geometry.attributes.position.count} verts, ${fs.statSync(path.join(stack, "basket.glb")).size >> 10}K glb -> ${packed.length >> 10}K packed -> ${zipped.length >> 10}K gzipped`,
);

// ---------------------------------------------------------------- layouts ---

/*
 * The six approved compositions, straight out of the app.
 *
 * `layouts/*.rayl` are the files the tool saves — count, spacing, angles, rig,
 * projection and crop, all of it. They are copied in and turned into a table
 * rather than being retyped, so a layout is changed by exporting a new one and
 * baking, and there is no second place for the numbers to be wrong.
 */
const layouts = {};
for (const file of fs.readdirSync(path.join(root, "layouts")).sort()) {
  if (!file.endsWith(".rayl")) continue;
  const name = file.replace(/\.rayl$/, "");
  layouts[name] = fs
    .readFileSync(path.join(root, "layouts", file), "utf8")
    .trim();
}
fs.writeFileSync(
  path.join(baked, "layouts.js"),
  `/* Generated by tools/bake.mjs from layouts/*.rayl. Do not edit.
   The six approved compositions, as the app writes them. */
export const LAYOUTS = ${JSON.stringify(layouts, null, 2)};
`,
);
console.log(`layouts ${Object.keys(layouts).join(", ")}`);
