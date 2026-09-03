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

# Values that are NOT the palette and keep coming back. Three are the V2 paint
# styles, which are an earlier round; the rest are hand-mixed approximations
# from older builds. doc.py refuses to publish anything containing one.
STALE = {
 "#F7F7F2": "Off White — the V2 style. Use #F7F7EF",
 "#CFCFC4": "Porcelain — the V2 style. Use #CFCFC1",
 "#696963": "Light Concrete — the V2 style. Use #696961",
 "#F0F0E5": "rayl-ui paper. Use #F7F7EF Off White",
 "#E8E8D8": "rayl-ui sunk. Use #E2E2D3 Dark Off-White",
 "#CECEC5": "rayl-screen porcelain. Use #CFCFC1",
 "#3F3F3B": "rayl-screen black. Use #55554E Dark Concrete",
 "#D8DEB9": "the green that is not the brand. There is no green",
 "#000000": "pure black. The palette has none; ink is #1C1C1A",
}

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

def chapter(name, anchor=None):
    at = f' id="{anchor}"' if anchor else ""
    return f'  <h2 class="rayl-chapter"{at}>{name}</h2>\n'

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
    """`tag` is kept in the signature and ignored. Frames used to be named by an
    8 label turned on its side down the left edge; it read as decoration, it
    made every frame carry a 72 left padding for a lane nothing else used, and
    it is gone. What a frame holds is what names it."""
    c = (" " + cls) if cls else ""
    return f'      <div class="rayl-frame{c}">{body}</div>\n'

def row(*frames):
    return ('      <div class="rayl-field-row">\n' +
            "".join("  " + f.lstrip() for f in frames) + '      </div>\n')

def container(*blocks, centred=False):
    c = " is-centred" if centred else ""
    return f'  <div class="rayl-container{c}">\n' + "".join(blocks) + '  </div>\n'


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

TABLE = [("Morning shift", "06:00 – 14:00", "Filled"),
         ("Afternoon shift", "14:00 – 22:00", "Filled"),
         ("Night shift", "22:00 – 06:00", "Two open"),
         ("Weekend, Saturday", "08:00 – 16:00", "Filled"),
         ("Weekend, Sunday", "08:00 – 16:00", "One open"),
         ("Holiday cover", "on request", "Not staffed")]


def fields_section():
    """The four that were one decision. They are shown together because that is
    what they are: one ground, one height, one corner, one focus ring."""
    field = ('<div class="rayl-stack rayl-gap-12">'
             '<span class="rayl-label">Name</span>'
             '<input class="rayl-input" placeholder="Placeholder">'
             '</div>'
             '<div class="rayl-row"><span class="rayl-row-name">Label</span>'
             '<input class="rayl-input" value="A value"></div>'
             '<textarea class="rayl-input is-multi" rows="3" placeholder="Placeholder. '
             'Three lines of 12 at 140% leading, trimmed to cap height so the box '
             'measures cap to baseline."></textarea>')
    select = ('<div class="rayl-select" data-label="Selected value">'
              + "".join('<button class="rayl-menu-opt%s" type="button">%s</button>'
                        % (" is-on" if n == "Item 2" else "", n)
                        for n in ("Item 1", "Item 2", "Item 3", "Item 4"))
              + '<button class="rayl-menu-opt" type="button" disabled>Item 5</button>'
              '</div>')
    checks = ('<div class="rayl-stack rayl-gap-12">'
              '<button class="rayl-check" type="button" aria-checked="true">Twenty-four</button>'
              '<button class="rayl-check is-small" type="button">Twelve</button>'
              '</div>')
    toggles = ('<div class="rayl-cluster">'
               '<button class="rayl-toggle" type="button" aria-label="Snap to grid"></button>'
               '<button class="rayl-toggle" type="button" aria-checked="true"'
               ' aria-label="Show the rail"></button>'
               '</div>')
    return (
        chapter("Fields")
        + block(rail("What accepts input",
                     "One ground, one height, one corner. A field with something "
                     "in it is the same Paper as an empty one \u2014 what changes is "
                     "the ink."),
                frame("The field", f'<div class="rayl-stack rayl-gap-24">{field}</div>', "is-tall"))
        + block(rail("One of a list"),
                frame("The select, closed", select, "is-tall"),
                frame("The menu it opens",
                      '<div class="rayl-menu">'
                      + "".join('<button class="rayl-menu-opt%s" type="button">%s</button>'
                                % (" is-on" if n == "Item 2" else "", n)
                                for n in ("Item 1", "Item 2", "Item 3", "Item 4"))
                      + '<button class="rayl-menu-opt" type="button" disabled>Item 5</button>'
                      '</div>', "is-tall"))
        + block(rail("On or off"),
                row(frame("Checkbox, both footprints", checks),
                    frame("Toggle", toggles)))
    )


def surfaces_section():
    """What arrives over something else, and what a panel does when it is
    holding more than one thing \u2014 or nothing at all."""
    modal = ('<div class="rayl-cluster">'
             '<button class="rayl-btn" data-opens="bench-modal">Open the dialog</button>'
             '</div>'
             '<dialog class="rayl-modal" id="bench-modal">'
             '<h2 class="rayl-24">Title</h2>'
             '<p class="rayl-12">Body copy at 12, 140% leading. A group led by a 24 '
             'gaps 24 throughout, so the title, this copy and the buttons are all the '
             'same distance apart.</p>'
             '<div class="rayl-cluster">'
             '<button class="rayl-btn" data-closes="bench-modal">Cancel</button>'
             '<button class="rayl-btn is-strong" data-closes="bench-modal">Confirm</button>'
             '</div></dialog>')
    tips = ('<div class="rayl-cluster">'
            + "".join('<button class="rayl-btn" data-icon="%s" data-tip="%s" '
                      'aria-label="%s"></button>' % (i, w, w)
                      for i, w in (("Bell", "Notifications"), ("Save", "Save"),
                                   ("Download", "Export")))
            + '</div>')
    pop = ('<div class="rayl-popover">'
           '<p class="rayl-12">Body copy at 12. A popover pads 12 and the gap '
           'inside it is 12.</p>'
           '<button class="rayl-menu-opt" type="button">Action</button></div>')
    tabs = ('<div class="rayl-tabs">'
            '<div class="rayl-seg">'
            + "".join('<button class="rayl-seg-opt is-third%s" type="button">%s</button>'
                      % (" is-on" if n == 1 else "", f"Tab {n}") for n in (1, 2, 3))
            + '</div>'
            + "".join(f'<div class="rayl-panel"><p class="rayl-12">Panel {n}. A change '
                      'of ground 12 under the bar, and no rule between them.</p></div>'
                      for n in (1, 2, 3))
            + '</div>')
    fold = ('<details class="rayl-fold" open><summary>Section name</summary>'
            '<div class="rayl-fold-body"><p class="rayl-12">The body is a change of '
            'ground 12 below the header. Shut, the header carries a Plus; open, a '
            'Minus \u2014 the pair the approved panel already draws.</p></div>'
            '</details>')
    table = ('<table class="rayl-table">'
             '<thead><tr><th>Name</th><th>Hours</th><th>State</th></tr></thead><tbody>'
             + "".join(f'<tr><td>{n}</td><td>{v}</td><td>{s}</td></tr>' for n, v, s in TABLE)
             + '</tbody></table>')
    empty = ('<div class="rayl-empty">'
             '<div class="rayl-stack rayl-gap-12">'
             '<span class="rayl-icon" data-icon="Profile"></span>'
             '<p class="rayl-12">Nothing here yet</p></div>'
             '<button class="rayl-btn">Add one</button></div>')
    error = ('<div class="rayl-empty">'
             '<div class="rayl-stack rayl-gap-12">'
             '<span class="rayl-icon" data-icon="Plus"></span>'
             '<p class="rayl-12">Something went wrong</p></div>'
             '<button class="rayl-btn">Retry</button></div>')
    skel = '<span class="rayl-skeleton" data-lines="4"></span>'
    return (
        chapter("Surfaces")
        + block(rail("What arrives over something else",
                     "No stroke, no arrow, no shadow. What says a thing is in "
                     "front is that it carries its own ground."),
                frame("The dialog", modal, "is-tall"),
                row(frame("Tooltip \u2014 hover one", tips),
                    frame("Popover", pop)))
        + block(rail("More than one thing at once"),
                frame("Tabs", tabs, "is-tall"),
                frame("A collapsible section", fold))
        + block(rail("A list of records",
                     "No rules and no strokes: every other row takes a ground "
                     "and that is the only thing dividing the list."),
                frame("The table", table, "is-tall"))
        + block(rail("And when there is nothing to show",
                     "An error is the same panel with different words. Nothing "
                     "in the palette means error and no red is borrowed to make "
                     "one, so the sentence carries the meaning."),
                row(frame("Empty", empty), frame("Error", error)),
                frame("Skeleton", skel))
    )


def loading_section():
    """One loader, middle of the section, nothing else.

    It was three marks at 150, 150 and 60 with a label under each and a
    paragraph beside them — a specimen sheet for a thing that has one state
    worth looking at. A loader is not a part you compare variants of; it is a
    part you recognise. Anything else on the row is something to read while
    waiting, which is the opposite of what it is for."""
    return chapter("Loading") + container(
        '    <span class="rayl-solve" data-size="32" data-label="Loading"></span>\n',
        centred=True)


def look_section():
    """The look on the two things it is drawn on: a card, and a row inside one."""
    card = ('<div class="rayl-card is-look" style="padding:24px">'
            '<span class="rayl-label">Schoonmaak</span>'
            '<div class="rayl-stack rayl-gap-6">'
            '<div class="is-look is-inset" style="height:20px"></div>'
            '<div class="is-look is-inset" style="height:20px"></div>'
            '<div class="is-look is-inset" style="height:20px"></div>'
            '</div></div>')
    return chapter("The look") + block(
        rail("What makes it Rayl",
             "A gradient under three inner shadows, opt-in. The gradient is "
             "proportional and the shadow is fixed pixels, because the file uses "
             "it at two scales."),
        frame(None, card, "is-tall"))


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
  ("rayl-btn is-strong","the one high-emphasis button — a dialog's confirm"),
 ]),
 ("Enterable surfaces", [
  ("rayl-input",      "the field; is-multi for a textarea"),
  ("rayl-select",     "the select — author the options, it builds the rest"),
  ("rayl-menu",       "a list of items on its own ground"),
  ("rayl-menu-opt",   "one item of it; is-on for the chosen one"),
  ("rayl-check",      "the checkbox, carrying its own label; is-small for 12"),
  ("rayl-toggle",     "the switch; data-on and data-off name its two states"),
 ]),
 ("Surfaces and panels", [
  ("rayl-modal",      "a dialog; data-opens and data-closes name it by id"),
  ("rayl-tip",        "a tooltip — put data-tip on the thing it labels"),
  ("rayl-popover",    "a card that arrives: 264 across, padding 12"),
  ("rayl-tabs",       "a rayl-seg bar over rayl-panel panels"),
  ("rayl-panel",      "the panel under a bar, or under anything"),
  ("rayl-fold",       "a collapsible section: a details, and a body"),
  ("rayl-fold-body",  "what it holds"),
  ("rayl-table",      "a list of records; every other row is banded"),
  ("rayl-empty",      "a panel with nothing in it — and the error panel too"),
  ("rayl-skeleton",   "blocks where type will land; data-lines"),
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
            "rayl-ibtn-icon", "rayl-select-face", "rayl-check-box", "rayl-toggle-knob",
            "rayl-toggle-word", "rayl-skeleton-line"]


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
 ("a dialog",             "520, the panel column"),
 ("a popover",            "264"),
 ("a toggle",             "60 x 24, its knob 24 x 16"),
 ("an empty panel",       "180 tall"),
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
 (".rayl-modal",   "padding", "48px", "inside a dialog"),
 (".rayl-popover", "padding", "12px", "inside a popover"),
 (".rayl-panel",   "padding", "12px", "inside a panel"),
 (".rayl-menu",    "padding", "6px",  "inside a menu"),
 (".rayl-empty",   "padding", "48px", "inside an empty panel"),
 (".rayl-tabs",    "gap",     "12px", "a bar and its panel"),
 (".rayl-fold",    "gap",     "12px", "a header and its body"),
 (".rayl-skeleton","gap",     "12px", "lines of a skeleton"),
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
 ("Enterable surfaces", "PROVISIONAL",
  "the field, the select, the checkbox, the toggle and the dialog that holds "
  "them",
  "This was the largest open item in the system and it is answered: a control "
  "that ACCEPTS input reads as enterable through a change of ground alone — "
  "surface/idle at cap + 24, rounding 8, padding 12, and the focus ring as the "
  "one stroke. Every measurement is read off the UI Control Blanks boards and "
  "all of it ships, so build with it rather than inventing. It is PROVISIONAL "
  "and not a RULE because Martijn has drawn it and has not yet seen it "
  "rendered. Do not write it into a document as settled until he has."),

 ("Component states", "PROVISIONAL",
  "empty, error and skeleton now ship; loading was already the loading mark",
  "rayl-empty is a panel with nothing in it and an error is the same panel with "
  "different words, because nothing in the palette means error. rayl-skeleton "
  "is blocks where type will land and it does not move. Hover, pressed, "
  "disabled and focus were always covered by the tokens, and a wait is still "
  "rayl-solve. These are drawn rather than decided, so they move with the "
  "enterable surfaces above."),

 ("A check glyph", "OPEN",
  "the icon set has no colour, so a ticked box and a failed panel show the "
  "same mark",
  "ON is carried by the ground — the box turns Bone the way every selected "
  "thing does — and the mark inside it is Plus turned 45 degrees, because that "
  "is the only glyph in the set that reads as a mark rather than an "
  "instruction. The empty panel's error twin shows the same glyph at 24. Two "
  "opposite meanings on one drawing is a real weakness and it wants either a "
  "nineteenth icon or a decision that the ground alone is enough. Do not draw "
  "a tick."),

 ("The scrim", "PROVISIONAL",
  "the page behind a dialog, dimmed 20%",
  "20% is the figure on the board and it is what ships. The colour is the "
  "darkest ground the mode has — Black in light, Deep Black in dark — because "
  "a scrim is a shadow: taking ink/primary would flip it to White in dark mode "
  "and lighten the page instead of dimming it. Only the light value was drawn; "
  "the dark one follows from that reasoning and has not been looked at."),

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

 ("The Rayl look", "PROVISIONAL",
  "it ships as is-look; dark mode and one alpha in it are not drawn",
  "Measured at 966:2041, re-struck on the palette and shipped opt-in. What is "
  "provisional is dark: nobody drew it. The rim and the lift survive by "
  "changing colour rather than alpha, but the press does not — light darkens "
  "its corner by about 12 L* and dark has 5.2 of headroom in total, so the "
  "press alpha is raised from its measured 30% to 70% and still reaches only "
  "3.3. That one number is invented. The alternative is no press in dark at "
  "all, which is honest and reads flatter than light.\n\n"
  "Also standing: Bone is the rim, and Bone is what selection is painted in. A "
  "card rimmed in Bone and a selected control are the same colour. Bone was "
  "taken because it is the only step that keeps the bowl (5.5 L* against the "
  "drawn 5.7, where the alternative gives 1.6) and keeps the 108 rows on the "
  "step they are drawn on. Worth revisiting if the two ever meet on a page."),

 ("Shadows", "OPEN",
  "the Rayl look needs two, and nothing else in the system has one",
  "Section 2 forbids a shadow on the mark, section 5 makes every boundary out "
  "of a change of ground, and the loading mark carries an opaque tile on every "
  "face so that nothing is drawn at part strength. A shadow is drawn at part "
  "strength. Same question as the scrim: does the system have shadows now, or "
  "does the look get them and nothing else? Nothing may take one until this is "
  "answered."),

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
  "the ground under a control moves at 120ms ease-out, not on the system's curve",
  "Every documented movement is 280ms on cubic-bezier(0.65,0,0.35,1), and "
  "section 7 says both surfaces move together on the same duration and curve. "
  "The shipped controls do not: a hover's colour change is 120ms ease-out while "
  "the label rolls at 280ms. It was in two places when it was first written "
  "down. The thirteen controls took it as the house value and it is now in "
  "eleven, which is worth knowing before deciding: this is no longer a stray, "
  "it is the system's second easing in practice. Either it joins the system as "
  "the value a ground moves on, or every one of the eleven changes."),

 ("Magnetism on buttons", "PROVISIONAL",
  "the slider's lean, on everything that is its own target",
  "The nub has leaned toward an approaching cursor since it was built and "
  "nothing else did. Buttons do now, on the nub's own range and strength — 104 "
  "and 0.6 — so no value was invented there.\n\n"
  "Two things were changed after seeing it: every button in range leaned at "
  "once, which made a panel read as a row of things all asking to be clicked, "
  "and it moved too far. Now the nearest button in range leans and every other "
  "one lets go, and it moves at most 6 rather than 12. Six is a cluster's own "
  "gap, so a button can never close the distance to its neighbour; the nub "
  "keeps 12 because it has nothing beside it.\n\n"
  "Then three bugs, all found by measuring rather than by looking. The cap was "
  "a clamp on a bigger curve and it caught across 78% of the range, so the "
  "button jumped to its full lean on approach and sat there — the falloff is "
  "the shape itself now, peaking at 6 at half the range. The cached centres "
  "were never dropped when the real face landed and every button re-rendered "
  "wider, so on load the pull came from left of the button. And two buttons "
  "traded the lean pixel by pixel along the line between them, so a 6 band of "
  "hysteresis holds it.\n\n"
  "What leans is what is its own target: the button, the reveal button, an "
  "option cell in an unjoined group, and the two on-or-off controls. What does "
  "not is what sits inside a block — a joined bar and every cell in it, and an "
  "item in an open menu. A block that drifts at a passing cursor reads as the "
  "whole row coming loose.\n\n"
  "The select face is the one still unsettled: it is a button in the markup and "
  "it opens a list rather than doing something, and it currently does not "
  "lean.\n\n"
  "Still provisional because it is the first thing in Rayl that moves without "
  "being touched, and section 7 is one movement."),

 ("Transparency", "OPEN",
  "the scrim behind a dialog is the first thing in Rayl drawn at part strength",
  "Everything else in the system is flat and opaque — it is why the loading "
  "mark carries a tile on every face rather than fading, and why the palette is "
  "fifteen solid steps. A dialog has to dim what is behind it, so --rayl-scrim "
  "is a 20% mix and it is the right answer for that job. What is not decided is "
  "whether transparency is now a thing the system has, or one exception a "
  "dialog gets. Nothing else may fade until that is answered."),

 ("An array as a ground", "OPEN",
  "the array can sit behind or in front of content, and nothing says how",
  "Section 11 already calls data-motion=\"still\" the right choice for a "
  "header or a background, and then never says how to place one. The system "
  "has no layering vocabulary at all: z-index appears six times in core.css "
  "and every one is inside a component. So a background array today means "
  "hand-rolled position, inset and stacking, re-decided on every page, which "
  "is what layout primitives exist to prevent. Three things have to be "
  "answered before the primitive can be drawn. Is a background forced to "
  "still, or may it wave under text? What colour is type over an array — the "
  "ink flip works off a single L* and an array is a gradient sheet with bodies "
  "moving across it, so there is nothing to test. And does foreground mean "
  "over-and-clipped, like a masthead, or over-and-transparent, which the "
  "bodies being opaque makes a different question again."),

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
 ("sheet and drawer",  "a settings panel that comes in from an edge — the dialog ships, these do not"),
 ("toast",             "anything reporting that a background job finished"),
 ("progress",          "an export, an upload, a render — determinate, where the mark says nothing about how far"),
 ("context menu",      "a right-click or an overflow: rayl-menu is the list, nothing opens one at a pointer"),
 ("badge, chip, tag",  "a count, a status, a filter"),
 ("avatar",            "anybody's face"),
 ("scrollbar",         "every panel taller than its frame"),
 ("app shell",         "a control panel beside a canvas — the only layout the system cannot express"),
]


# ============================================================== the array ====
# The array's settings are the last table in the system that was kept by hand
# against code — 26 rows against 47 entries in array/src/look.js. Names and
# defaults are read out of that file now; only the sentence saying what a
# setting does lives here, because no machine can write that. doc.py fails the
# build if a setting exists with nothing said about it, or the other way round.

ARRAY_DOC = {
 "body":        "`plate`, `card` or `basket`. There is no fourth",
 "layout":      "which approved composition to stand on: `horizontal`, `vertical`, or `none` for the bare defaults",
 "count":       "how many",
 "spread":      "the **air between one body and the next**, in bodies. Nought is touching; negative overlaps, which is most of what an array is for",
 "direction":   "`across` or `up` — the layout sets it, and setting it against the layout is how a composition gets broken",
 "depth":       "how thick a card is, against its own width. Cards only",
 "lean":        "turns the whole rack, so the row recedes",
 "spin":        "turns the bodies without turning the row",
 "tilt":        "tips them towards you or away",
 "motion":      "`wave`, `still`, `scroll` or `pointer` — see below",
 "wave":        "how far a body is lifted out of the row, in bodies",
 "brush":       "how many bodies wide the crest is",
 "peaks":       "how many crests run at once",
 "seconds":     "how long one pass takes",
 "at":          "where the crest sits when nothing is driving it",
 "ease":        "the curve the crest travels on — the app's own, not the system's",
 "colour":      "what the bodies are made of",
 "key":         "the big source",
 "keyColour":   "its colour",
 "keyAt":       "where it stands",
 "keySize":     "and how wide it is",
 "fill":        "the cool fill",
 "fillColour":  "its colour",
 "fillAt":      "where it stands",
 "fillSize":    "and how wide it is",
 "rim":         "the light behind, the only one the glow-through has to work with",
 "rimColour":   "its colour",
 "rimAt":       "where it stands",
 "rimSize":     "and how wide it is",
 "ambient":     "how much of the sheet reaches the bodies",
 "exposure":    "the picture",
 "contrast":    "and its contrast",
 "occlusion":   "how much light the row loses to itself",
 "shade":       "how hard a body shadows the one behind. Unset, so it follows the occlusion the look asks for rather than a second number nobody set",
 "translucency":"how much light comes through a body",
 "scatter":     "how far it spreads inside",
 "wrap":        "how far round the form it bends",
 "falloff":     "and how sharply it falls off",
 "roughness":   "matte at 1",
 "coat":        "a clear layer over it, the way a fired glaze has one",
 "sheet":       "`porcelain`, `concrete`, `none`, or two colours. `none` by default, so an array sits on whatever ground the page already has",
 "sky":         "what an upward face sees. Unset, so it takes the sheet's top",
 "ground":      "and a downward one. Unset, so it takes the sheet's bottom",
 "projection":  "`lens` or `iso` — a real lens, or a parallel one. The plates and the cards are composed parallel, the baskets with a lens",
 "fov":         "the lens, which the parallel projection ignores",
 "aspect":      "the crop: the shape the picture was composed in",
 "zoom":        "how much of the fit to take — under one is closer in",
 "pan":         "where the middle sits, in world units off the middle of the row",
 "bounce":      "how much light the bodies throw at each other",
 "art":         "an image printed on the face of a card",
 "dpr":         "the most device pixels it may ask for",
}
