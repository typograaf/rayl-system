"""Shared data and renderers for the generated pages."""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
MARK = re.search(r'<svg class="rayl-mark".*?</svg>',
                 (ROOT/"examples/panel.html").read_text(), re.S).group(0)

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

def swatch(n,h,l):
    return (f'<div class="sw"><i style="background:{h}"></i>'
            f'<span class="rayl-12">{n}</span>'
            f'<span class="rayl-12 dim mono">{h}</span>'
            f'<span class="rayl-12 dim mono">L* {l}</span></div>')

def token(n,lt,dk,job):
    return (f'<tr><td><i class="chip" style="background:var(--{n.replace("/","-")})"></i></td>'
            f'<td class="mono">{n}</td><td class="dim">{lt}</td><td class="dim">{dk}</td>'
            f'<td class="dim">{job}</td></tr>')

def specimen(size,lead,az,co,sample):
    serif = "" if co=="—" else (
        f'<p class="rayl-{size} rayl-serif">{sample}</p>')
    extra = "" if co == "\u2014" else f" \u00b7 Concrette {co}"
    note = f'<span class="rayl-12 dim">{size} \u00b7 {lead} \u00b7 Azeret {az}{extra}</span>'
    return (f'<div class="spec"><div class="rayl-stack">{note}</div>'
            f'<p class="rayl-{size}">{sample}</p>{serif}</div>')


SPEC_CSS = """
  .mono{white-space:nowrap;}
  .dim{opacity:.62;}
  /* No strokes anywhere. A white swatch is made visible by the ground it sits
     on, not by a line drawn round it — the system has no border vocabulary and
     inventing one is how a page stops looking like Rayl. */
  .swatches{background:var(--rayl-mid-porcelain);border-radius:8px;padding:24px;}
  .sw{display:flex;flex-direction:column;gap:6px;color:var(--rayl-black);}
  .sw i{display:block;height:48px;border-radius:8px;}
  .grad{display:block;height:48px;border-radius:8px;}
  table{width:100%;border-collapse:collapse;}
  td,th{text-align:left;padding:12px 24px 12px 0;vertical-align:middle;
    font-size:12px;line-height:1.4;letter-spacing:0.02em;}
  th{font-size:8px;letter-spacing:0.08em;text-transform:uppercase;opacity:.62;
    padding-bottom:6px;}
  .chip{display:block;width:24px;height:24px;border-radius:4px;}
  .scroll{overflow-x:auto;}
  .spec{display:flex;flex-direction:column;gap:12px;padding-bottom:48px;}
"""

def type_section():
    return f'''  <section class="rayl-section">
    <span class="rayl-label">Typefaces</span>
    <div class="rayl-split is-lead">
      <p class="rayl-12 rayl-measure"><strong>Azeret is the workhorse.</strong> Interface,
      running text, captions and labels — and headlines and titles perfectly well too. If
      you are unsure which face to use, it is Azeret. It is the only face at 18 and 12.</p>
      <p class="rayl-12 rayl-measure"><strong>Concrette is titles and subheads only.</strong>
      A serif drawn for display, so it starts at 24. Never body copy, never a caption,
      never a control. Below 24 the serif class is ignored on purpose.</p>
    </div>
    <p class="rayl-12 rayl-measure dim">Leading opens as the size drops and tracking
    tightens as it grows. The two move against each other, and that is what makes a 96
    headline and a 12 caption read as one voice. A size, its leading and its tracking are
    one decision — the classes carry all three.</p>
  </section>

  <section class="rayl-section">
    <span class="rayl-label">The scale — seven sizes, and 8 for labels</span>
    {"".join(specimen(*s) for s in SCALE)}
    <div class="rayl-stack">
      <span class="rayl-12 dim">8 · uppercase · +8% — the section label, and nothing else</span>
      <span class="rayl-label">Aspect ratio</span>
    </div>
  </section>'''

def colour_sections():
    return f'''  <section class="rayl-section">
    <span class="rayl-label">Main colours — the brand palette</span>
    <p class="rayl-12 rayl-measure dim">Fifteen steps on one hue: every one sits between
    106.5° and 106.9°. Chroma follows a single arc, rising out of white, peaking at Dark
    Off-White and falling to black without ever reversing. A new colour belongs to this
    palette only if it sits on that arc.</p>
    <div class="swatches"><div class="rayl-grid">{"".join(swatch(*p) for p in PALETTE)}</div></div>
    <div class="rayl-split">
      <div class="rayl-stack">
        <span class="grad" style="background:var(--rayl-porcelain-gradient)"></span>
        <span class="rayl-12">Porcelain Gradient</span>
        <span class="rayl-12 dim mono">#CFCFC1 → #F7F7EF, 180°</span>
      </div>
      <div class="rayl-stack">
        <span class="grad" style="background:var(--rayl-concrete-gradient)"></span>
        <span class="rayl-12">Concrete Gradient</span>
        <span class="rayl-12 dim mono">#696961 → #CFCFC1, 180°</span>
      </div>
    </div>
  </section>

  <section class="rayl-section">
    <span class="rayl-label">UI colours — what the interface actually names</span>
    <p class="rayl-12 rayl-measure dim">Nothing in an interface names a colour from the
    palette above. It names a job, and the job resolves to a different step in each mode.
    Change one of these and it changes everywhere at once — that is the whole point of
    them. The swatches follow the mode you are in.</p>
    <div class="scroll"><table>
      <thead><tr><th></th><th>Token</th><th>Light</th><th>Dark</th><th>Job</th></tr></thead>
      <tbody>{"".join(token(*t) for t in UI)}</tbody>
    </table></div>
  </section>'''
