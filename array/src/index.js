/**
 * The Rayl array, live in a page.
 *
 *   <script type="module"
 *     src="https://typograaf.github.io/rayl-system/assets/array/rayl-array.js">
 *   </script>
 *
 *   <div data-rayl-array="plate" data-count="14" style="height: 340px"></div>
 *
 * That is the whole of it. Every array on the page is found and started, and
 * every setting is a `data-` attribute named after the thing it changes. For a
 * page that would rather say it in code:
 *
 *   import { RaylArray } from ".../rayl-array.js";
 *   const array = new RaylArray(element, { body: "card", motion: "scroll" });
 *   array.set({ count: 20 });
 *
 * See RAYL-SYSTEM.md for what every setting means and what it may be.
 */
import { RaylArray, HOME } from "./array.js";
import { DEFAULTS, PALETTE, SHEETS, readLook } from "./look.js";

/** Every array in a page, started. Called for you; call it again after you
    have put new markup on the page. */
export function mount(root = document) {
  const found = [];
  for (const element of root.querySelectorAll("[data-rayl-array]")) {
    if (element.raylArray) continue;
    const array = new RaylArray(element, fromAttributes(element));
    element.raylArray = array;
    found.push(array);
  }
  return found;
}

/**
 * `data-count="14"` and the rest, read into a look.
 *
 * Names are the same as the settings, in the dashed form an attribute wants —
 * `data-key-colour`, `data-key-at`. A number is a number, a list of numbers is
 * a list, and anything else is left as text, so `data-sheet="porcelain"` and
 * `data-sheet="#CFCFC4,#F7F7F2"` both mean what they look like.
 */
function fromAttributes(element) {
  const look = {};
  const body = element.dataset.raylArray;
  if (body) look.body = body;

  for (const [name, raw] of Object.entries(element.dataset)) {
    if (name === "raylArray") continue;
    if (name === "look") {
      Object.assign(look, readLook(raw));
      continue;
    }
    const key = Object.keys(DEFAULTS).find(
      (k) => k.toLowerCase() === name.toLowerCase(),
    );
    if (!key) {
      console.warn(`rayl-array: nothing here is called "${name}"`);
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
  if (Array.isArray(like)) {
    const parts = raw.split(",").map((p) => p.trim());
    const numbers = parts.map(Number);
    return numbers.every(Number.isFinite) ? numbers : parts;
  }
  /* A sheet may be a name or the two colours themselves. */
  if (raw.includes(",")) return raw.split(",").map((p) => p.trim());
  return raw;
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => mount());
  else mount();
}

export { RaylArray, DEFAULTS, PALETTE, SHEETS, readLook, HOME };
