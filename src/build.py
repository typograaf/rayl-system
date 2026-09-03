#!/usr/bin/env python3
"""Assemble rayl.js from src/, and build the templates from it.

    python3 src/build.py

Everything the system ships is generated here. Edit src/, never rayl.js.
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC  = ROOT / "src"
HUB  = "https://typograaf.github.io/rayl-system"

# ---------------------------------------------------------------------------
# Ask first, write second. This used to write rayl.js and then run the checks,
# so a build that stopped had already overwritten the file it was checking —
# and the error said "nothing was published", which was not true.
import subprocess as _sp, sys as _sys
if _sp.run([_sys.executable, str(SRC / "paste.py")], cwd=str(SRC)).returncode \
   or _sp.run([_sys.executable, str(SRC / "doc.py"), "--check"], cwd=str(SRC)).returncode:
    raise SystemExit("\nbuild stopped before writing anything.")

css   = (SRC / "core.css").read_text()
comp  = (SRC / "components.js").read_text()
slid  = (SRC / "slider.js").read_text()
solv  = (SRC / "solve.js").read_text()
icons = json.loads((SRC / "icons.json").read_text())
names = ", ".join(sorted(icons))

header = f'''/*! Rayl — the design system as code.
 *
 *  One file. Include it and use the markup below; do not restyle these and do
 *  not rebuild them. Everything here is generated from the approved Figma
 *  frames and the shipped app, and every colour resolves through a token, so a
 *  page built this way is identical to every other page built this way.
 *
 *    <body class="rayl"><div class="rayl-page">          the ground and rhythm
 *    <section class="rayl-section">
 *      <span class="rayl-label">Aspect ratio</span>       8px uppercase
 *      <div class="rayl-cluster">
 *        <button class="rayl-btn">4:5</button>            aria-pressed for on
 *        <button class="rayl-btn" data-icon="Save">Save</button>
 *      </div>
 *      <div class="rayl-seg">                             one of these is on
 *        <button class="rayl-seg-opt is-on">4:5</button>
 *        <button class="rayl-seg-opt">5:4</button>
 *      </div>
 *      <div class="rayl-row"><span class="rayl-label">Count</span>
 *        <span class="rayl-slider" data-min="1" data-max="33" data-val="12" data-step="1"></span>
 *      </div>
 *    </section>
 *
 *  Dark mode: document.documentElement.dataset.theme = "dark" | "light".
 *  Leave it unset to follow the viewer's own setting.
 *
 *  Icons: {names}
 */
'''

body = '''(function(){
"use strict";
var NS="http://www.w3.org/2000/svg";
var ICONS=%s;

var TOKENS=%s;

if(!document.getElementById("rayl-style")){
  var st=document.createElement("style");
  st.id="rayl-style";
  st.textContent=TOKENS;
  document.head.appendChild(st);
}

%s

%s

%s

function init(root){
  root=root||document;
  [].forEach.call(root.querySelectorAll(".rayl-btn"),function(b){
    upgradeButton(b); leanRegister(b); });
  [].forEach.call(root.querySelectorAll(".rayl-ibtn"),function(b){
    upgradeIconButton(b); leanRegister(b); });
  [].forEach.call(root.querySelectorAll(".rayl-seg"),function(g){
    upgradeSeg(g);
    /* A joined bar is one hard block and nothing in it leans. */
    if (!g.classList.contains("is-joined"))
      [].forEach.call(g.querySelectorAll(".rayl-seg-opt"),leanRegister);
  });
  [].forEach.call(root.querySelectorAll(".rayl-tabs"),upgradeTabs);
  [].forEach.call(root.querySelectorAll(".rayl-select"),upgradeSelect);
  [].forEach.call(root.querySelectorAll(".rayl-check"),function(b){
    upgradeCheck(b);
    var box = b.querySelector(".rayl-check-box");
    if (box) leanRegister(box);           /* the box leans, not the label */
  });
  [].forEach.call(root.querySelectorAll(".rayl-toggle"),function(b){
    upgradeToggle(b); leanRegister(b); });
  [].forEach.call(root.querySelectorAll(".rayl-fold"),upgradeFold);
  [].forEach.call(root.querySelectorAll(".rayl-skeleton"),upgradeSkeleton);
  [].forEach.call(root.querySelectorAll("[data-tip]"),upgradeTip);
  wireModals(root);
  [].forEach.call(root.querySelectorAll(".rayl-line"),upgradeLine);
  wireRolls(root);
  [].forEach.call(root.querySelectorAll(".rayl-icon[data-icon]"),upgradeIcon);
  [].forEach.call(root.querySelectorAll(".rayl-slider"),mountSlider);
  [].forEach.call(root.querySelectorAll(".rayl-solve"),raylSolve);
  /* The look is CSS, so a class attribute is enough and this is only a
     convenience: data-look="deep" or data-look="inset" reads better in markup
     than two classes, and Rayl.look(root,{all:true}) makes the blanket answer
     one line if it is ever taken. Opt-in is the answer today. */
  [].forEach.call(root.querySelectorAll("[data-look]"),function(el){
    el.classList.add("is-look");
    (el.getAttribute("data-look")||"").split(/\s+/).forEach(function(w){
      if (w) el.classList.add("is-" + w); });
  });
}
if(document.readyState==="loading")
  document.addEventListener("DOMContentLoaded",function(){init();});
else init();

/* A host with its own markup can borrow a behaviour without taking the class:
   an app that already has its own buttons still wants the label to roll. The
   element keeps its own colours; only the movement comes from here. */
window.Rayl={init:init, icons:Object.keys(ICONS), upgrade:{
  button:upgradeButton, revealButton:upgradeIconButton, group:upgradeSeg,
  line:upgradeLine, slider:mountSlider, icon:upgradeIcon,
  solve:raylSolve, select:upgradeSelect, check:upgradeCheck,
  toggle:upgradeToggle, tabs:upgradeTabs, fold:upgradeFold,
  skeleton:upgradeSkeleton, tip:upgradeTip}};
})();
''' % (json.dumps(icons, separators=(",", ":")),
       json.dumps(css.replace("HUB", HUB)),
       comp, slid, solv)

(ROOT / "rayl.js").write_text(header + body)
print("rayl.js", len(header + body), "bytes")

# ---------------------------------------------------------------------------
# Everything else that is generated, in the order it has to happen.
import shutil, subprocess, sys


def run(script):
    """A generator that refuses should say why, not raise a traceback at
    somebody who was only trying to build the thing."""
    r = subprocess.run([sys.executable, str(SRC / script)], cwd=str(SRC))
    if r.returncode:
        raise SystemExit(f"\nbuild stopped in src/{script} — nothing was published.")


# the values, for anything that cannot include this file
run("tokens.py")

# The checker, published at the root so it can be fetched on its own. Fetched
# alone it has no parts.py to import, so the class list is written into it here
# rather than kept by hand — the hand-kept one went stale the first time a
# component was added.
import textwrap
sys.path.insert(0, str(SRC))
from parts import INVENTORY as _INV, INTERNAL as _INT
_classes = ["rayl"] + sorted({c.split()[0] for _, items in _INV for c, _ in items}
                             | set(_INT))
_check = (SRC / "check.py").read_text()
_open, _shut = 'BAKED_CLASSES = """', '""".split()'
if _open not in _check:
    raise SystemExit("src/check.py has no BAKED_CLASSES block to fill in")
_a = _check.index(_open) + len(_open)
_b = _check.index(_shut, _a)
# break_on_hyphens would split rayl-container into "rayl-" and "container",
# and .split() would then believe both were class names
_check = _check[:_a] + "\n" + textwrap.fill(" ".join(_classes), 76,
    break_on_hyphens=False, break_long_words=False) + "\n" + _check[_b:]
(ROOT / "rayl-check.py").write_text(_check)
print("rayl-check.py", (ROOT / "rayl-check.py").stat().st_size, "bytes")

# the two generated documents, which must exist before the artifact build reads
# them
run("site.py")

# the fact tables and the open list — this is the one that fails the build when
# a document states a value the stylesheet does not hold
run("doc.py")

# and finally the system is held to its own rules. Both example pages and both
# generated documents go through the checker; a specimen that has to print a
# hex waives that one check in the file itself and nothing else is waivable.
pages = [str(ROOT / "index.html")] + sorted(str(p) for p in (ROOT / "examples").glob("*.html"))
out = subprocess.run([sys.executable, str(ROOT / "rayl-check.py")] + pages,
                     capture_output=True, text=True)
print(out.stdout.strip())
if out.returncode:
    raise SystemExit("the system does not pass its own checker")

# ---------------------------------------------------------------------------
# GitHub Pages serves rayl.js with max-age=600, so for ten minutes after a push
# anyone with the page already open keeps the old file — and a change to the
# stylesheet then shows up as a document with no styling at all rather than as
# an obvious error. The documents carry the build's own hash so their copy is
# never the stale one. What people paste into a prompt stays the bare URL: they
# want to pick up changes on their own, and ten minutes is nothing there.
import hashlib, re
VER = hashlib.sha1((ROOT/"rayl.js").read_bytes()).hexdigest()[:8]
SCRIPT = re.compile(r'(<script src="[^"]*?rayl\.js)(\?v=[0-9a-f]+)?(")')
for f in [ROOT/"index.html"] + sorted((ROOT/"examples").glob("*.html")):
    t = f.read_text()
    stamped = SCRIPT.sub(lambda m: m.group(1) + "?v=" + VER + m.group(3), t)
    if stamped != t:
        f.write_text(stamped)
print("stamped rayl.js?v=" + VER)

# ---------------------------------------------------------------------------
# The artifact build: Claude's CSP allows scripts only from a few CDNs and
# fonts only from Google's host, so the hosted rayl.js and the woff2 files are
# both inlined. Same bytes, just carried rather than fetched.
import base64
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)
rayl = (ROOT / "rayl.js").read_text()
# every face the system uses — 500 is the only weight, so there are two of them
# and a missing one would fall back in silence
fonts = [
    ("Azeret",    500, ROOT / "assets/fonts/Azeret-TRIAL-Medium.woff2"),
    ("Concrette", 500, ROOT / "assets/fonts/ConcretteS-TRIAL-Medium.woff2"),
]
missing = [str(p) for _, _, p in fonts if not p.exists()]
if missing:
    raise SystemExit("missing font files: " + ", ".join(missing))
face = "\n".join(
    '@font-face{font-family:"%s";font-weight:%d;font-display:swap;'
    'src:url(data:font/woff2;base64,%s) format("woff2");}'
    % (fam, w, base64.b64encode(p.read_bytes()).decode())
    for fam, w, p in fonts
)
for name in ("bench", "panel", "landing"):
    src = (ROOT / "examples" / f"{name}.html").read_text()
    out = SCRIPT.sub("<script", src, count=1).replace(
        "<script></script>", "<script>\n" + rayl + "\n</script>", 1)
    # the inlined faces must come after rayl.js injects its own, so they win
    out = out.replace("</body>", "<style>\n" + face + "\n</style>\n</body>")
    (DIST / f"{name}.html").write_text(out)
    print(f"dist/{name}.html", len(out), "bytes")

