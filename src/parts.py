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
 (96,"110%","−4%","−5%","Schoonmaak"),
 (72,"110%","−3%","−4%","Schoonmaak"),
 (48,"110%","−2%","−3%","Schoonmaak Medewerker"),
 (36,"110%","−1%","−2%","Schoonmaak Medewerker"),
 (24,"115%","0%","−2%","Schoonmaak Medewerker"),
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
    return f'''<!doctype html>
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
  /* the five grounds a control can land on, per mode — bench furniture */
  .rayl-card{background:var(--rayl-card-bg,var(--surface-idle));}
  .bg1{--rayl-card-bg:var(--rayl-white);}
  .bg2{--rayl-card-bg:var(--rayl-paper);}
  .bg3{--rayl-card-bg:var(--rayl-off-white);}
  .bg4{--rayl-card-bg:var(--rayl-bone);}
  .bg5{--rayl-card-bg:var(--rayl-dark-off-white);}
  .d{display:none;}
  @media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){
    .l{display:none;} .d{display:inline;}
    .bg1{--rayl-card-bg:var(--rayl-soft-black);}
    .bg2{--rayl-card-bg:var(--rayl-deep-black);}
    .bg3{--rayl-card-bg:var(--rayl-black);}
    .bg4{--rayl-card-bg:var(--rayl-off-black);}
    .bg5{--rayl-card-bg:var(--rayl-dark-concrete);}
  } }
  :root[data-theme="dark"]{
    .l{display:none;} .d{display:inline;}
    .bg1{--rayl-card-bg:var(--rayl-soft-black);}
    .bg2{--rayl-card-bg:var(--rayl-deep-black);}
    .bg3{--rayl-card-bg:var(--rayl-black);}
    .bg4{--rayl-card-bg:var(--rayl-off-black);}
    .bg5{--rayl-card-bg:var(--rayl-dark-concrete);}
  }
"""
