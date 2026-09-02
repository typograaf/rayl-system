"""Generate the two documents: index.html and examples/bench.html.

Both are built with the system they document, and both are divided the way the
guidelines board divides itself — a chapter label on the ground, and everything
under it inside a rounded container. Neither file is hand-edited.
"""
import html, pathlib
from parts import (ROOT, THEME_JS, head, chapter, container, block, rail, frame,
                   controls_section, type_section, colour_section)

PASTE = html.escape((ROOT / "src/paste.txt").read_text())

FOOT = ('  <div class="rayl-container">\n'
        '    <span class="rayl-label">Azeret and Concrette are TRIAL cuts — '
        'licence them before anything public</span>\n'
        '  </div>\n')

TAIL = "\n</div>\n" + THEME_JS + "\n</body>\n</html>\n"


# ------------------------------------------------------------- the bench ----
# An overview, not an explanation. Every part the system ships, shown at the
# size it ships at, with nothing between the label and the thing itself.

bench = (
    head("Rayl Control Bench", "https://typograaf.github.io/rayl-system/rayl.js")
    + controls_section()
    + type_section()
    + colour_section()
    + FOOT + TAIL
)
(ROOT / "examples/bench.html").write_text(bench)
print("examples/bench.html", len(bench), "bytes")


# --------------------------------------------------------- the dashboard ----
# The one page somebody who has never read code lands on. It keeps its opening
# copy, because telling them what to do with the block is its entire job.

PASTE_CSS = """
  pre{margin:0;font:inherit;font-size:12px;line-height:1.5;white-space:pre-wrap;
    word-break:break-word;}
  .paste{background:var(--surface-idle);border-radius:8px;padding:24px;
    display:flex;flex-direction:column;gap:12px;align-items:flex-start;}
"""

LINKS = chapter("Where everything is") + block(
    rail("Everything else",
         "The examples show the parts composed. Build the structure your brief "
         "needs — cloning one gives you a page shaped like somebody else\u2019s problem."),
    frame("The examples",
          '<div class="rayl-cluster">'
          '<a class="rayl-btn" href="examples/landing.html">A page</a>'
          '<a class="rayl-btn" href="examples/panel.html">A panel</a>'
          '<a class="rayl-btn" href="examples/bench.html">The bench</a></div>'),
    frame("The documents",
          '<div class="rayl-cluster">'
          '<a class="rayl-btn" href="RAYL-SYSTEM.md">The rules</a>'
          '<a class="rayl-btn" href="AUDIT.md">The audit</a>'
          '<a class="rayl-btn" href="rayl.js">rayl.js</a>'
          '<a class="rayl-btn" href="assets/logo/Lockup.svg">Lockup</a></div>'),
)

HERO = ('  <div class="rayl-container">\n'
        '    <span class="rayl-label">The Rayl design system</span>\n'
        '    <h1 class="rayl-48">Hand this to an AI and what it builds comes out '
        'looking like Rayl.</h1>\n'
        '    <p class="rayl-18 rayl-measure">Including the parts nobody has designed '
        'yet. You do not need to read any code to use it — copy the block below and '
        'paste it above whatever you are asking for.</p>\n'
        '  </div>\n')

PASTE_BLOCK = chapter("The block") + block(
    rail("Paste this at the top of your prompt",
         "It carries the tokens, the type scale, the layout primitives and every "
         "control. You do not need to read any of it."),
    frame(None,
          f'<div class="paste"><pre id="paste">{PASTE}</pre>'
          f'<button class="rayl-ibtn" data-icon="Document" id="copy">Copy</button></div>'))

COPY_JS = '''<script>
  document.getElementById("copy").addEventListener("click",function(){
    navigator.clipboard.writeText(document.getElementById("paste").textContent);
  });
</script>'''

index = (
    head("Rayl System", "rayl.js", PASTE_CSS).replace(
        "<head>", '<head>\n<meta name="robots" content="noindex, nofollow">', 1)
    + HERO
    + PASTE_BLOCK
    + type_section()
    + colour_section()
    + LINKS
    + FOOT
    + "\n</div>\n" + THEME_JS + "\n" + COPY_JS + "\n</body>\n</html>\n"
)
(ROOT / "index.html").write_text(index)
print("index.html", len(index), "bytes")
