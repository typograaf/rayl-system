#!/usr/bin/env python3
"""Assemble rayl.js from src/, and build the templates from it.

    python3 src/build.py

Everything the system ships is generated here. Edit src/, never rayl.js.
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC  = ROOT / "src"
HUB  = "https://typograaf.github.io/rayl-system"

css   = (SRC / "core.css").read_text()
comp  = (SRC / "components.js").read_text()
slid  = (SRC / "slider.js").read_text()
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

function init(root){
  root=root||document;
  [].forEach.call(root.querySelectorAll(".rayl-btn"),upgradeButton);
  [].forEach.call(root.querySelectorAll(".rayl-icon[data-icon]"),upgradeIcon);
  [].forEach.call(root.querySelectorAll(".rayl-slider"),function(s){
    if(!s.__rayl){ s.__rayl=true; mountSlider(s); }
  });
}
if(document.readyState==="loading")
  document.addEventListener("DOMContentLoaded",function(){init();});
else init();

window.Rayl={init:init, icons:Object.keys(ICONS)};
})();
''' % (json.dumps(icons, separators=(",", ":")),
       json.dumps(css.replace("HUB", HUB)),
       comp, slid)

(ROOT / "rayl.js").write_text(header + body)
print("rayl.js", len(header + body), "bytes")

# ---------------------------------------------------------------------------
# The artifact build: Claude's CSP allows scripts only from a few CDNs and
# fonts only from Google's host, so the hosted rayl.js and the woff2 files are
# both inlined. Same bytes, just carried rather than fetched.
import base64
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)
rayl = (ROOT / "rayl.js").read_text()
fonts = {
    400: ROOT / "assets/fonts/Azeret-TRIAL-Regular.woff2",
    500: ROOT / "assets/fonts/Azeret-TRIAL-Medium.woff2",
}
face = "\n".join(
    '@font-face{font-family:"Azeret";font-weight:%d;font-display:swap;'
    'src:url(data:font/woff2;base64,%s) format("woff2");}'
    % (w, base64.b64encode(p.read_bytes()).decode())
    for w, p in fonts.items()
)
for name in ("bench", "panel"):
    src = (ROOT / "templates" / f"{name}.html").read_text()
    out = src.replace(
        '<script src="https://typograaf.github.io/rayl-system/rayl.js"></script>',
        "<script>\n" + rayl + "\n</script>",
    )
    # the inlined faces must come after rayl.js injects its own, so they win
    out = out.replace("</body>", "<style>\n" + face + "\n</style>\n</body>")
    (DIST / f"{name}.html").write_text(out)
    print(f"dist/{name}.html", len(out), "bytes")
