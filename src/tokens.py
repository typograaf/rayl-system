"""Export the system as data, for anything that cannot include rayl.js.

rayl.js is right for a static page and wrong for React, Tailwind, SwiftUI or
anything rendered on a server, and until now those had nothing to work from but
markdown tables — so they retyped fifteen hexes by hand and drifted, which is
the drift table in RAYL-WHY.md. Two files fix that:

    rayl-vars.css     the custom properties, sliced straight out of core.css
    rayl.tokens.json  every value in the system, as data

The CSS is CUT from core.css rather than regenerated from parts.py, so the two
cannot disagree even in principle. The JSON is rendered from parts.py, which
doc.py then asserts against core.css.
"""
import json, re
from parts import (ROOT, PALETTE, UI, SCALE, SPACING, GAP_CLASSES, HEADING_GAP,
                   GAP_MEANING, RADIUS, FIGURES, FIXED, MOTION, ICONS,
                   INVENTORY, INTERNAL, MISSING, OPEN)

HUB = "https://typograaf.github.io/rayl-system"
CSS = (ROOT / "src/core.css").read_text()

HEAD = f"""/*! Rayl — the values, and nothing else.
 *
 *  The custom properties every Rayl component resolves through, with no
 *  components in them. Use this where you cannot include rayl.js: you get the
 *  colours, the type, the radius and the motion, and you build the components
 *  yourself from {HUB}/RAYL-RULES.md.
 *
 *  Both modes are here. Set document.documentElement.dataset.theme = "dark",
 *  or leave it unset to follow the viewer's own setting.
 *
 *  Cut from core.css by src/tokens.py. Do not edit.
 */
"""


def vars_css():
    """Everything from the first @font-face to the end of the dark override."""
    start = CSS.index("@font-face")
    end = CSS.index(":root[data-theme=\"dark\"]{")
    end = CSS.index("\n}", end) + 2
    return HEAD + CSS[start:end].replace("HUB", HUB) + "\n"


def tokens_json():
    var = lambda n: "--" + n.replace("/", "-")
    return {
      "$schema": "https://typograaf.github.io/rayl-system/rayl.tokens.json",
      "name": "Rayl",
      "rules": f"{HUB}/RAYL-RULES.md",
      "why": f"{HUB}/RAYL-WHY.md",
      "open": f"{HUB}/RAYL-OPEN.md",
      "css": f"{HUB}/rayl-vars.css",
      "js": f"{HUB}/rayl.js",
      "note": "Never write a hex in a build. Name a token; it resolves per mode.",

      "palette": [
        {"name": n, "hex": h, "lstar": l,
         "var": "--rayl-" + n.lower().replace(" ", "-")}
        for n, h, l in PALETTE],

      "gradients": {
        "porcelain": {"from": "#CFCFC1", "to": "#F7F7EF", "angle": "180deg",
                      "var": "--rayl-porcelain-gradient"},
        "concrete":  {"from": "#696961", "to": "#CFCFC1", "angle": "180deg",
                      "var": "--rayl-concrete-gradient"}},

      "tokens": [
        {"token": n, "var": var(n), "light": lt, "dark": dk, "job": job}
        for n, lt, dk, job in UI],

      "type": {
        "faces": {
          "body":    {"family": "Azeret", "role": "everything, including headlines",
                      "cap": 0.698, "trial": True},
          "display": {"family": "Concrette", "role": "titles and subheads, 24 and up only",
                      "cap": 0.708, "optical size": "S ships; M and XL exist", "trial": True}},
        "weight": 500,
        "weights": [500],
        "label": {"size": 8, "tracking": "+8%", "case": "uppercase",
                  "use": "names a section, and nothing else"},
        "control tracking": "0",
        "trim": {"text-box-trim": "trim-both", "text-box-edge": "cap alphabetic",
                 "fallback line-height": 0.698},
        "sizes": [
          {"size": s, "leading": lead, "azeret": az,
           "concrette": None if co == "—" else co, "class": f"rayl-{s}"}
          for s, lead, az, co, _ in SCALE]},

      "spacing": {
        "scale": SPACING,
        "classes": [f"rayl-gap-{n}" for n in GAP_CLASSES],
        "heading gap": {str(size): gap for size, gap in HEADING_GAP},
        "meaning": {str(n): what for n, what in GAP_MEANING if what != "—"},
        "fixed": [{"class": sel.lstrip("."), "property": prop, "value": val,
                   "what": what} for sel, prop, val, what in FIXED],
        "figures": {name: val for name, val in FIGURES}},

      "radius": {"scale": [r for r, _ in RADIUS[:-1]],
                 "control": "8", "container": "24",
                 "round": "half the height",
                 "meaning": {r: what for r, what in RADIUS}},

      "motion": {name: {"value": val, "what": what} for name, val, what in MOTION},

      "icons": {"grid": "12x12", "fill": "one filled path, never stroked",
                "colour": "ink/primary", "names": sorted(ICONS)},

      "strokes": {"borders": "none, anywhere",
                  "how boundaries are made": "a change of ground",
                  "the one exception": "the keyboard focus ring"},

      "classes": {group: {c: what for c, what in items} for group, items in INVENTORY},
      "internal classes": list(INTERNAL),

      "missing": [{"control": c, "a brief will ask for": w} for c, w in MISSING],
      "open": [{"name": n, "status": st, "what": w, "detail": d} for n, st, w, d in OPEN],
    }


if __name__ == "__main__":
    (ROOT / "rayl-vars.css").write_text(vars_css())
    print("rayl-vars.css", len((ROOT / "rayl-vars.css").read_text()), "bytes")
    j = json.dumps(tokens_json(), indent=2, ensure_ascii=False) + "\n"
    (ROOT / "rayl.tokens.json").write_text(j)
    print("rayl.tokens.json", len(j), "bytes")
