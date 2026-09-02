"""Shared data and renderers for the two generated documents.

The bench and the dashboard are both built from this file, so a colour, a token
or a size can only be wrong in one place. Neither is hand-edited.
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
MARK = re.search(r'<svg class="rayl-mark".*?</svg>',
                 (ROOT / "examples/panel.html").read_text(), re.S).group(0)

PALETTE = [
 ("White","#FFFFFF",100.0),("Paper","#FBFBF6",98.5),("Off White","#F7F7EF",97.1),
 ("Bone","#EDEDDF",93.3),("Dark Off-White","#E2E2D3",89.5),("Porcelain","#CFCFC1",82.8),
 ("Mid Porcelain","#C3C3B6",78.5),("Dark Porcelain","#ACACA0",70.1),
 ("Pale Concrete","#89897F",56.9),("Light Concrete","#696961",44.2),
 ("Dark Concrete","#55554E",35.9),("Off-Black","#373732",22.9),
 ("Soft Black","#262623",15.2),("Black","#1C1C1A",10.2),("Deep Black","#11110F",5.0)]

UI = [
 ("surface/ground","White","Soft Black","The panel or page itself"),
 ("surface/idle","Paper","Deep Black","A control at rest"),
 ("surface/idle-hover","Off White","Black","Rest control, pointer over it"),
 ("surface/idle-pressed","Bone","Off-Black","Rest control, being pressed"),
 ("surface/active","Bone","Dark Concrete","A control that is on"),
 ("surface/active-hover","Dark Off-White","Light Concrete","On control, pointer over it"),
 ("surface/active-pressed","Porcelain","Off-Black","On control, being pressed"),
 ("ink/primary","Black","White","All text and icons"),
 ("ink/on-active","Black","White","Text on an active control"),
 ("ink/disabled","Dark Porcelain","Light Concrete","Unavailable text"),
 ("line/track","Dark Porcelain","Pale Concrete","Slider rails and small marks"),
 ("fill/strong","Black","White","A high-emphasis button"),
 ("fill/strong-hover","Soft Black","Off White","…with the pointer over it"),
 ("ink/on-strong","White","Soft Black","Text on one")]

SCALE = [
 (96,"110%","−4%","−6%","Schoonmaak"),
 (72,"110%","−3%","−5%","Schoonmaak"),
 (48,"110%","−3%","−4%","Schoonmaak Medewerker"),
 (36,"110%","−2%","−4%","Schoonmaak Medewerker"),
 (24,"115%","−1%","−3%","Schoonmaak Medewerker"),
 (18,"130%","+1%","—","Schoonmaak Medewerker"),
 (12,"140%","+2%","—","Schoonmaak Medewerker")]

ICONS = ["Profile","Image","Document","Save","Bookmark","Folder","Minus","Pause",
         "Play","Plus","Upload","Download","ID","Bell","Broom","Stack","Cup","Organise"]

GROUNDS = [("White","Soft Black"),("Paper","Deep Black"),("Off White","Black"),
           ("Bone","Off-Black"),("Dark Off-White","Dark Concrete")]

SLIDERS = [("Count",1,33,12),("Tilt",0,90,62),("Peaks",1,12,4),
           ("Wave",0,100,70),("Duration",1,20,5),("Frames",0,240,120)]


# --------------------------------------------------------- the container ----
# The board's own layout language: a chapter label on the ground, then blocks of
# a narrow rail of words against a wide field of things.

def chapter(name):
    return f'  <h2 class="rayl-chapter">{name}</h2>\n'

def block(rail, *frames):
    """A rail against a field. Everything the reader has to READ is in the rail;
    the field holds nothing but the things themselves."""
    return ('  <div class="rayl-block">\n'
            f'    <div class="rayl-rail">{rail}</div>\n'
            '    <div class="rayl-field">\n' + "".join(frames) + '    </div>\n'
            '  </div>\n')

def rail(name, *paras):
    body = "".join(f'<p class="rayl-12">{t}</p>' for t in paras)
    return f'<h3 class="rayl-24">{name}</h3>{body}'

def frame(tag, body, cls=""):
    c = (" " + cls) if cls else ""
    t = f'<span class="rayl-frame-tag">{tag}</span>' if tag else ""
    return f'      <div class="rayl-frame{c}">{t}{body}</div>\n'

def row(*frames):
    return ('      <div class="rayl-field-row">\n' +
            "".join("  " + f.lstrip() for f in frames) + '      </div>\n')

def container(*blocks):
    return '  <div class="rayl-container">\n' + "".join(blocks) + '  </div>\n'


# ------------------------------------------------------------ the pieces ----

def swatch(n, h, l):
    """The ink flips where it flips everywhere else: below Pale Concrete."""
    ink = "#1C1C1A" if l >= 55 else "#F7F7EF"
    return (f'<div class="sw" style="background:{h};color:{ink}">'
            f'<span>{n}</span>'
            f'<span class="mono" style="opacity:.62">{h}</span>'
            f'<span class="mono" style="opacity:.62">L* {l}</span></div>')

def token(n, lt, dk, job):
    return (f'<tr><td><i class="chip" style="background:var(--{n.replace("/","-")})"></i></td>'
            f'<td class="mono">{n}</td><td class="dim">{lt}</td><td class="dim">{dk}</td>'
            f'<td class="dim">{job}</td></tr>')

def specimen(size, lead, az, co, sample):
    serif = "" if co == "—" else f'<p class="rayl-{size} rayl-serif">{sample}</p>'
    extra = "" if co == "—" else f" · Concrette {co}"
    return (f'<div class="spec">'
            f'<span class="rayl-12 dim">{size} · {lead} · Azeret {az}{extra}</span>'
            f'<p class="rayl-{size}">{sample}</p>{serif}</div>')

def ground_card(i, lt, dk):
    return (f'<div class="rayl-card bg{i}">'
            f'<span class="rayl-label"><span class="l">{lt}</span><span class="d">{dk}</span></span>'
            f'<button class="rayl-btn">Idle</button>'
            f'<button class="rayl-btn" aria-pressed="true">Active</button></div>')

def bar(name, on):
    cells = "".join('<button class="rayl-seg-opt%s" type="button">%d</button>'
                    % (" is-on" if n == on else "", n) for n in (1, 2, 3))
    return (f'<div class="rayl-seg is-joined">'
            f'<span class="rayl-seg-name">{name}</span>{cells}</div>')


# ---------------------------------------------------------- the sections ----

def controls_section():
    grounds = ('<div class="rayl-grid">' +
               "".join(ground_card(i, lt, dk) for i, (lt, dk) in enumerate(GROUNDS, 1)) +
               '</div>')
    reveal = ('<div class="rayl-cluster">' + "".join(
        f'<button class="rayl-ibtn" data-icon="{i}">{t}</button>' for i, t in
        (("Save","Save"),("Download","Export"),("Plus","Add a plate"))) + '</div>')
    icons = ('<div class="rayl-cluster">' + "".join(
        f'<button class="rayl-btn" data-icon="{n}" title="{n}" aria-label="{n}"></button>'
        for n in ICONS) + '</div>')
    opts = ('<button class="rayl-seg-opt is-on" type="button">4:5</button>'
            '<button class="rayl-seg-opt" type="button">5:4</button>' +
            "".join(f'<button class="rayl-seg-opt is-third" type="button">{r}</button>'
                    for r in ("1:1", "16:9", "9:16")))
    bars = "".join(bar(n, o) for n, o in (("Bisque", 2), ("Sheen", 1), ("Chalk", 3)))
    lines = ('<div class="rayl-stack">'
             '<div class="rayl-row"><span class="rayl-row-name">Email</span>'
             '<span class="rayl-line" id="line-email" data-label="contact@rayl.com"'
             ' data-swap="Copied to clipboard"></span></div>'
             '<div class="rayl-row"><span class="rayl-row-name">Status</span>'
             '<span class="rayl-line" id="line-status" data-label="Four shifts open"'
             ' data-swap="All shifts filled"></span></div>'
             '</div>'
             '<div class="rayl-cluster">'
             '<button class="rayl-btn" data-rolls="line-email" data-swap="Copied">Copy</button>'
             '<button class="rayl-btn" data-rolls="line-status" data-swap="Undo">Fill them</button>'
             '</div>')
    sliders = "".join(
        f'<div class="rayl-row"><span class="rayl-row-name">{n}</span>'
        f'<span class="rayl-slider" data-min="{lo}" data-max="{hi}" data-val="{v}" data-step="1"></span></div>'
        for n, lo, hi, v in SLIDERS)

    return (
        chapter("Controls")
        + block(rail("Buttons"),
                frame("On each ground", grounds, "is-tall"),
                row(frame("Reveal", reveal), frame("Icon", icons)))
        + block(rail("On a line"),
                frame("The same movement where it is not a button", lines, "is-tall"))
        + block(rail("Option groups"),
                frame("Aspect ratio", f'<div class="rayl-seg">{opts}</div>', "is-tall"),
                frame("Joined", bars, "is-tall"))
        + block(rail("Sliders"),
                frame("Six at once", f'<div class="rayl-stack">{sliders}</div>', "is-tall"))
    )

def loading_section():
    """The bench shows a part at the size it ships at, with nothing between the
    label and the thing. A loader is the one part you have to watch, so it gets
    a frame of its own with the phase named beside it."""
    marks = ('<div class="rayl-grid">' + "".join(
        f'<div class="rayl-stack rayl-gap-12">'
        f'<span class="rayl-solve" data-size="{size}"{extra}></span>'
        f'<span class="rayl-label">{name}</span></div>'
        for name, size, extra in (("Running", 150, ""),
                                  ("Still", 150, ' data-play="still"'),
                                  ("At sixty", 60, ""))) + '</div>')
    return chapter("Loading") + block(
        rail("The mark solves itself",
             "What Rayl shows while something is loading. Call solve() when the "
             "thing has arrived and the wait ends on the mark."),
        frame("At three sizes and stopped", marks, "is-tall"))


def type_section():
    return chapter("Typography") + block(
        rail("The scale"),
        frame("Seven sizes, and 8 for labels",
              "".join(specimen(*s) for s in SCALE), "is-tall"),
        frame("The label", '<span class="rayl-label">Aspect ratio</span>'),
    )

def colour_section():
    grads = ('<div class="rayl-split">'
             '<div class="grad" style="background:var(--rayl-porcelain-gradient);color:#1C1C1A">'
             '<span>Porcelain</span>'
             '<span class="mono" style="opacity:.62">#CFCFC1 → #F7F7EF, 180°</span></div>'
             '<div class="grad" style="background:var(--rayl-concrete-gradient);color:#F7F7EF">'
             '<span>Concrete</span>'
             '<span class="mono" style="opacity:.62">#696961 → #CFCFC1, 180°</span></div>'
             '</div>')
    table = ('<div class="scroll"><table>'
             '<thead><tr><th></th><th>Token</th><th>Light</th><th>Dark</th><th>Job</th></tr></thead>'
             '<tbody>' + "".join(token(*t) for t in UI) + '</tbody></table></div>')
    return (
        chapter("Colour")
        + block(rail("The palette"),
                frame("Fifteen steps on one hue",
                      '<div class="rayl-grid">' + "".join(swatch(*p) for p in PALETTE) + '</div>',
                      "is-tall"),
                frame("Gradients", grads))
        + block(rail("UI colour"), frame("What the interface names", table, "is-tall"))
    )


def head(title, script, extra_css=""):
    """The two generated documents SHOW the system rather than use it: a colour
    chapter has to print the hexes it is naming. That is what the waiver is,
    and it is the only one in the repo."""
    return f'''<!doctype html>
<!-- rayl-check: allow hex -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<script src="{script}"></script>
<style>{DOC_CSS}{extra_css}</style>
</head>
<body class="rayl rayl-doc">
<div class="rayl-doc-page">

  <div class="rayl-container">
    <header class="rayl-head">
      {MARK}
      <div class="rayl-seg is-tight" id="theme">
        <button class="rayl-seg-opt" type="button" data-mode="light">Light</button>
        <button class="rayl-seg-opt" type="button" data-mode="dark">Dark</button>
      </div>
    </header>
  </div>
'''

THEME_JS = '''<script>
  /* The group owns the selection — this only says what a selection means. */
  var root=document.documentElement, seg=document.getElementById("theme");
  var mode=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
  root.dataset.theme=mode;
  seg.querySelectorAll(".rayl-seg-opt").forEach(function(o){
    o.classList.toggle("is-on", o.dataset.mode===mode);
  });
  seg.addEventListener("rayl:change",function(e){
    root.dataset.theme=e.detail.option.dataset.mode;
  });
</script>'''

# The furniture these two documents own. Everything a page could need comes from
# rayl.js; what is left here only exists to show the system to itself.
DOC_CSS = """
  .mono{white-space:nowrap;}
  .dim{opacity:.62;}
  /* A swatch IS the colour, with its name printed on it — the way the colour
     chapter in the Figma file draws one. No stroke round it and no box behind
     it: the grid's gaps are the edges. */
  .sw{border-radius:8px;padding:12px;min-height:96px;
    display:flex;flex-direction:column;justify-content:flex-end;gap:6px;
    font-size:12px;line-height:1.4;letter-spacing:0.02em;}
  .grad{border-radius:8px;padding:12px;min-height:96px;
    display:flex;flex-direction:column;gap:6px;
    font-size:12px;line-height:1.4;letter-spacing:0.02em;}
  table{width:100%;border-collapse:collapse;}
  td,th{text-align:left;padding:12px 24px 12px 0;vertical-align:middle;
    font-size:12px;line-height:1.4;letter-spacing:0.02em;}
  th{font-size:8px;letter-spacing:0.08em;text-transform:uppercase;opacity:.62;
    padding-bottom:6px;}
  .chip{display:block;width:24px;height:24px;border-radius:4px;}
  .scroll{overflow-x:auto;}
  .spec{display:flex;flex-direction:column;gap:12px;}
  .spec + .spec{margin-top:24px;}
  /* The five grounds a control can land on, per mode — bench furniture. The
     ground goes ON the card rather than into .rayl-card, because restyling a
     shipped component is the one thing this system tells everybody not to do
     and a bench that does it privately is not an argument. */
  .bg1{background:var(--rayl-white);}
  .bg2{background:var(--rayl-paper);}
  .bg3{background:var(--rayl-off-white);}
  .bg4{background:var(--rayl-bone);}
  .bg5{background:var(--rayl-dark-off-white);}
  .d{display:none;}
  @media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){
    .l{display:none;} .d{display:inline;}
    .bg1{background:var(--rayl-soft-black);}
    .bg2{background:var(--rayl-deep-black);}
    .bg3{background:var(--rayl-black);}
    .bg4{background:var(--rayl-off-black);}
    .bg5{background:var(--rayl-dark-concrete);}
  } }
  :root[data-theme="dark"]{
    .l{display:none;} .d{display:inline;}
    .bg1{background:var(--rayl-soft-black);}
    .bg2{background:var(--rayl-deep-black);}
    .bg3{background:var(--rayl-black);}
    .bg4{background:var(--rayl-off-black);}
    .bg5{background:var(--rayl-dark-concrete);}
  }
"""


# ============================================================ the inventory ==
# Every class the system ships, with the one line that says what it is for. The
# build FAILS if core.css grows a class that is not in one of these two lists,
# so a new part cannot reach anybody undocumented. That is the whole point of
# the list: the drift this repo kept producing was always a value or a name that
# existed in the code and nowhere else.

INVENTORY = [
 ("Page", [
  ("rayl-page",       "the app or panel column: ground, 72 rhythm, 520 wide"),
  ("rayl-page is-wide","the same at 960, for a page that has to breathe"),
  ("rayl-section",    "a section; its gap is derived the same way"),
  ("rayl-stack",      "a group; its gap is what its largest text asks for"),
  ("rayl-cluster",    "parts of one control — gaps 6"),
  ("rayl-grid",       "an even grid of cards or swatches"),
  ("rayl-head",       "a header or footer row: mark on the left, controls right"),
  ("rayl-card",       "a panel that lifts off the ground"),
  ("rayl-row",        "a named control on one line"),
  ("rayl-row-name",   "the name in that row — 12, Medium, full ink, sentence case"),
  ("rayl-label",      "the 8 uppercase section label, and nothing else"),
  ("rayl-hint",       "a quiet line of explanation under a block"),
  ("rayl-gap-6",      "set a group's gap when it has no heading to derive one"),
  ("rayl-gap-12",     "the same, at 12"),
  ("rayl-gap-24",     "the same, at 24"),
  ("rayl-gap-36",     "the same, at 36"),
  ("rayl-gap-48",     "the same, at 48"),
  ("rayl-gap-60",     "the same, at 60"),
  ("rayl-gap-72",     "the same, at 72"),
 ]),
 ("Wide layout", [
  ("rayl-hero",       "the opening statement of a page"),
  ("rayl-band",       "a full-width band; is-ink for one in ink"),
  ("rayl-split",      "two columns; is-lead 3:2, is-three, is-centred"),
  ("rayl-measure",    "running text stopped at 62 characters"),
  ("rayl-media",      "a picture that follows the column beside it"),
 ]),
 ("Document", [
  ("rayl-doc",        "on the body: the document ground rather than the app one"),
  ("rayl-doc-page",   "the document column — blocks 12 apart"),
  ("rayl-chapter",    "an 8 label on the ground, over the blocks under it"),
  ("rayl-block",      "a 500 rail against a 1504 field"),
  ("rayl-rail",       "the words of a block"),
  ("rayl-rail-foot",  "pinned to the floor of a rail"),
  ("rayl-field",      "the things of a block, stacked 12 apart"),
  ("rayl-field-row",  "frames side by side inside a field"),
  ("rayl-frame",      "one white box holding one thing; is-tall, is-wide"),
  ("rayl-frame-tag",  "names a frame, turned on its side, costing no height"),
  ("rayl-container",  "a plain white box for a header or footer"),
 ]),
 ("Controls", [
  ("rayl-btn",        "the button; aria-pressed for on, data-icon for an icon"),
  ("rayl-ibtn",       "the reveal button: the label contracts, a circle irises open"),
  ("rayl-seg",        "the option group — exactly one on; is-joined, is-tight"),
  ("rayl-seg-opt",    "one cell of it; is-on, is-third"),
  ("rayl-seg-name",   "the name that opens a joined bar — never a disabled cell"),
  ("rayl-slider",     "the track: data-min, data-max, data-val, data-step"),
  ("rayl-line",       "a value on a line that rolls; data-label, data-swap"),
  ("rayl-icon",       "an icon on its own; data-icon"),
  ("rayl-mark",       "the logo mark, inline"),
  ("rayl-solve",      "the loading mark: data-size, data-play, data-ease and the timings"),
 ]),
 ("Type", [
  ("rayl-96",  "96 / 110% / -4%"), ("rayl-72", "72 / 110% / -3%"),
  ("rayl-48",  "48 / 110% / -3%"), ("rayl-36", "36 / 110% / -2%"),
  ("rayl-24",  "24 / 115% / -1%"), ("rayl-18", "18 / 130% / +1%"),
  ("rayl-12",  "12 / 140% / +2%"),
  ("rayl-serif","Concrette, on a size class from 24 up"),
 ]),
]

# Produced by rayl.js inside a component. Never authored, never styled.
INTERNAL = ["rayl-solve-face", "rayl-solve-tile", "rayl-solve-art", "rayl-roll", "rayl-ch", "rayl-g", "rayl-cur", "rayl-nxt", "rayl-type",
            "rayl-reel", "rayl-col", "rayl-strip", "rayl-digit", "rayl-num",
            "rayl-val", "rayl-sign", "rayl-point", "rayl-seg-fill", "rayl-ibtn-body", "rayl-ibtn-dot",
            "rayl-ibtn-icon"]


# =========================================================== the spacing ====
# These used to live only as prose in the guideline and as numbers in core.css,
# which is exactly how the two came to disagree. They are data now, every
# document renders them from here, and doc.py asserts each one against the
# stylesheet before the build is allowed to finish.

SPACING = [6, 12, 24, 36, 48, 60, 72, 96]

# the escape-hatch classes, rayl-gap-N
GAP_CLASSES = [6, 12, 24, 36, 48, 60, 72]

# a group takes the gap its largest text asks for
HEADING_GAP = [(96, 60), (72, 48), (48, 48), (36, 36), (24, 24), (18, 24)]

GAP_MEANING = [
 (6,  "parts of one control — buttons in a cluster, a stepper's digits"),
 (12, "things in a document: blocks on the page, frames in a field"),
 (24, "a group led by nothing larger than a 24"),
 (36, "a group led by a 36; three columns of a split"),
 (48, "a group led by a 48 or a 72; two columns of a split"),
 (60, "a group led by a 96"),
 (72, "—"),
 (96, "sections of a page"),
]

# Corner radius is its own scale and does not share the spacing one.
RADIUS = [
 ("4",              "the board's smallest rounding"),
 ("8",              "a control — button, option cell, card, swatch"),
 ("12",             "the board's middle rounding"),
 ("24",             "a container — a rail, a frame, a panel"),
 ("half the height","anything meant to read as fully round"),
]

# Figures that are not gaps: a fixed width, a measure, a padding.
FIGURES = [
 ("the panel column",     "520"),
 ("the wide column",      "960"),
 ("the document field",   "1440"),
 ("the tool panel",       "300, padding 48, groups 48 apart"),
 ("a reading measure",    "62 characters"),
 ("a showcase frame",     "padding 144 — three times the ordinary 48"),
]

# What the containers fix, asserted against core.css by doc.py. Nothing here is
# derived from a heading, so nothing here can be got from HEADING_GAP.
FIXED = [
 (".rayl-page",    "gap",     "96px", "sections of a page"),
 (".rayl-cluster", "gap",     "6px",  "parts of one control"),
 (".rayl-grid",    "gap",     "12px", "cards or swatches"),
 (".rayl-head",    "gap",     "24px", "a header row"),
 (".rayl-split",   "gap",     "48px", "two columns"),
 (".rayl-band",    "gap",     "36px", "inside a band"),
 (".rayl-field",   "gap",     "12px", "frames in a field"),
 (".rayl-card",    "padding", "12px", "inside a card"),
 (".rayl-rail",    "padding", "48px", "inside a rail"),
]

# ============================================================= the motion ====

MOTION = [
 ("duration",  "280ms",  "one character's travel"),
 ("stagger",   "20ms",   "one character to the next, compressed so a roll never runs past 400ms"),
 ("curve",     "cubic-bezier(0.65, 0, 0.35, 1)", "in and out, everywhere"),
 ("order",     "random", "reshuffled on every roll"),
 ("direction", "upward", "always"),
 ("press down","90ms",   "a button sinking to 0.96"),
 ("press up",  "220ms",  "and coming back — deliberately slower than down"),
 ("a line returns", "2400ms", "before a swapped line goes back to what it was"),
]

# ============================================================== the gaps =====
# Every open question in the system, in one place, with one status word. The
# guideline used NOT DECIDED, UNDER REVIEW, "still open" and plain prose for the
# same thing; a reader could not tell which of those was binding.
#
#   RULE        settled, follow it
#   PROVISIONAL in the shipped code, works, may still change — safe to build on
#   OPEN        genuinely undecided. Do not invent. Say which one you hit.
#
# Anything an AI can hit is listed here whether or not it also appears in prose,
# because RAYL-OPEN.md is generated from this list and nothing else.

OPEN = [
 ("Enterable surfaces", "OPEN",
  "text input, select, checkbox and toggle, and the modal that holds them",
  "In a system with no strokes, a control that ACCEPTS input has to read as "
  "enterable through a change of ground alone. That is one decision and all "
  "four follow from it. Martijn is designing it. Until it lands there is no "
  "correct form in this system."),

 ("Semantic colour", "OPEN",
  "nothing means error, warning, success or info",
  "Every colour in the palette sits on one hue, so any of these is the brand's "
  "first hue break. Do not draft a palette colour in to stand for a state and "
  "do not borrow a red."),

 ("Deep Black #11110F", "PROVISIONAL",
  "the dark-mode ground, and the one palette colour not on the approved frame",
  "It ships and it works. Either it joins the palette or dark mode grounds on "
  "a colour already in it."),

 ("Hover: the ladder or the token", "OPEN",
  "two approved sources give a Paper base two different hovers",
  "The L* ladder says Bone, five steps away. surface/idle-hover says Off White, "
  "one step. Build with the tokens — they are what ships — but the "
  "disagreement is real and wants a decision."),

 ("A container's padding", "OPEN",
  "\"a container pads one step below the gap it sits in\"",
  "It held when the page ran 72 and a band padded 48. The page runs 96 now and "
  "the band still pads 48, where the rule would say 72. Do not apply it to "
  "anything new."),

 ("96 on the spacing scale", "OPEN",
  "the page rhythm is 96 and the scale as written stops at 72",
  "96 steps by 12 like every other member and is what rayl-page actually uses, "
  "so it is listed. Confirm it is a member rather than a page-only figure."),

 ("The 8 radius", "PROVISIONAL",
  "every control rounds 8; the board's own ladder is 4, 12, 24",
  "8 is measured off the approved UI rather than the demo, and where the two "
  "disagree the UI wins. Worth confirming the ladder gains an 8."),

 ("Component states", "OPEN",
  "empty, error, skeleton",
  "Hover, pressed, disabled and focus are covered by the tokens, and loading "
  "is now the loading mark, rayl-solve. These three are not covered, and a "
  "tool without them is a demo."),

 ("The Rayl look", "OPEN",
  "the layered gradient treatment, and the largest single gap in the system",
  "Flat vector art with gradient fills, stamped repeatedly, no specular "
  "highlight — it is not lighting and cannot be reproduced with lighting. "
  "There is no reference file in this repo. Everything else here makes a build "
  "correct; this is what makes it Rayl. Say the reference is missing rather "
  "than approximating it."),

 ("The reveal button's label", "OPEN",
  "White #FFFFFF on the approved frame, Off White in the ink table",
  "One value, two approved sources. Ask before using either."),

 ("The loading mark's timing", "PROVISIONAL",
  "rayl-solve runs on numbers and a curve that are not the system's",
  "A turn is 480ms with no beat between turns, a scramble turn 480ms, and it "
  "sits on the solved mark for 960ms — where the system's numbers are 280, 90, "
  "220 and 2400. The curve is cubic-bezier(0.5, 0.14, 0.36, 0.79) where the "
  "system's one curve is cubic-bezier(0.65, 0, 0.35, 1). Every value was picked "
  "by Martijn on the bench, watching whole turns; no reason is recorded beyond "
  "that, and none is invented here. The component runs correctly on the "
  "system's numbers — set data-turn, data-gap, data-scramble, data-hold and "
  "data-ease to put any instance back on them. This is the second easing in the "
  "system, and the whole argument of section 7 is that there is one. It is on "
  "this list rather than hidden in a stylesheet."),

 ("A colour change runs 120ms", "PROVISIONAL",
  "the ground under a button moves at 120ms ease-out, not on the system's curve",
  "Every documented movement is 280ms on cubic-bezier(0.65,0,0.35,1), and the "
  "guideline says both surfaces move together on the same duration and curve. "
  "The shipped controls do not: a hover's colour change is 120ms ease-out while "
  "the label rolls at 280ms. It reads well and it is what ships, so it is "
  "written down rather than quietly corrected — but it is a second easing in a "
  "system whose whole argument is that there is one."),

 ("The fonts", "OPEN",
  "Azeret and Concrette here are TRIAL cuts",
  "Fine for internal work and prototypes. The licensed files have to replace "
  "them before anything built with this goes public."),

 ("CMYK", "OPEN",
  "the printed values are arithmetic, not a profile conversion",
  "Fine on screen, not fine at a printer."),
]

# Controls the system does not have. A brief that needs one of these has hit a
# gap, not a thing to design on the spot.
MISSING = [
 ("text and number input", "any form, any name field, any numeric entry"),
 ("select",                "a list too long for an option group"),
 ("checkbox and toggle",   "a setting that is on or off on its own"),
 ("modal, sheet, drawer",  "a confirm, an export dialog, a settings panel"),
 ("collapsible section",   "the approved panel draws one — every section label carries a – and nothing implements it"),
 ("tooltip and popover",   "a label on an icon button"),
 ("tabs",                  "more than one view in a panel"),
 ("table",                 "any list of records"),
 ("toast",                 "anything reporting that a background job finished"),
 ("progress",              "an export, an upload, a render"),
 ("menu",                  "a right-click or an overflow"),
 ("badge, chip, tag",      "a count, a status, a filter"),
 ("avatar",                "anybody's face"),
 ("scrollbar",             "every panel taller than its frame"),
 ("app shell",             "a control panel beside a canvas — the only layout the system cannot express"),
]
