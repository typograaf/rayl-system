"""Generate the block people paste at the top of a prompt.

This file exists because the block used to be hand-written prose in
src/paste.txt while every number in it also lived in core.css and in the
guideline. It drifted, as hand-copied numbers do: the block told people the
spacing scale was "6, 12, 24, 48, 72 and nothing else" for as long as the
stylesheet shipped 36 and 60, and it gave four heading gaps of which three were
wrong. The block is the contract — it is what a model actually reads — so it is
the one document that must not be typed by hand.

Every number below is rendered from src/parts.py. doc.py then asserts those
against core.css, so a value can only be wrong in one place and the build stops
before it can be published.
"""
import textwrap
from parts import (ROOT, SPACING, GAP_CLASSES, HEADING_GAP, GAP_MEANING, RADIUS,
                   SCALE, ICONS, OPEN, MISSING)

HUB = "https://typograaf.github.io/rayl-system"


def commas(xs):
    xs = [str(x) for x in xs]
    if len(xs) == 1:
        return xs[0]
    return ", ".join(xs[:-1]) + " and " + xs[-1]


def heading_gaps():
    """96 takes 60, 72 and 48 take 48, ... — grouped so equal values read once."""
    out, i = [], 0
    while i < len(HEADING_GAP):
        j = i
        while j + 1 < len(HEADING_GAP) and HEADING_GAP[j + 1][1] == HEADING_GAP[i][1]:
            j += 1
        sizes = commas([s for s, _ in HEADING_GAP[i:j + 1]])
        out.append(f"{sizes} take{'s' if i == j else ''} {HEADING_GAP[i][1]}")
        i = j + 1
    return ", ".join(out)


def gap_meanings():
    return "; ".join(f"{n} {what}" for n, what in GAP_MEANING if what != "—")


def states():
    """What is still undefined, straight off the open list, so this sentence
    cannot go on claiming loading is missing after it stopped being."""
    for name, _, what, _ in OPEN:
        if name == "Component states":
            parts = [w.strip() for w in what.split(",")]
            return ", ".join(parts[:-1]) + " or " + parts[-1]
    return "empty or error"


def open_lines():
    return "\n".join(
        f"  - {name} — {what}" for name, status, what, _ in OPEN if status == "OPEN")


BLOCK = f"""Build this to the Rayl design system.

Include one file. It carries the colour tokens, the type scale, the page ground
and rhythm, the layout primitives, the button, the reveal button, the option
group, the slider, the rolling line, the loading mark and the icons:

<script src="{HUB}/rayl.js"></script>

If you cannot include a script — React, Tailwind, SwiftUI, anything rendered on
a server, anything offline — take the values instead and build the components
yourself from the rules:

  {HUB}/rayl.tokens.json     every colour, token, size and number, as data
  {HUB}/rayl-vars.css        the same as CSS custom properties
  {HUB}/RAYL-RULES.md        the rules, in full

Put class="rayl" on the body and write markup. Never restyle these and never
rebuild them:

<body class="rayl"><div class="rayl-page">
  <section class="rayl-section">
    <span class="rayl-label">Aspect ratio</span>
    <div class="rayl-cluster">
      <button class="rayl-btn">4:5</button>
      <button class="rayl-btn" aria-pressed="true">5:4</button>
      <button class="rayl-btn" data-icon="Save">Save</button>
    </div>
    <div class="rayl-seg">
      <button class="rayl-seg-opt is-on">4:5</button>
      <button class="rayl-seg-opt">5:4</button>
      <button class="rayl-seg-opt is-third">1:1</button>
    </div>
    <div class="rayl-row"><span class="rayl-row-name">Count</span>
      <span class="rayl-slider" data-min="1" data-max="33" data-val="12" data-step="1"></span></div>
    <p class="rayl-hint">A quiet line of explanation.</p>
  </section>
</div></body>

SPACING is {", ".join(str(n) for n in SPACING)} — and nothing else. A group takes the gap its
largest text asks for: {heading_gaps()}. The size classes carry that, so never
add a margin under a heading. Where a group has no heading to derive from, set
it with rayl-gap-{GAP_CLASSES[0]} … rayl-gap-{GAP_CLASSES[-1]} on the group. What the numbers mean: {gap_meanings()}.

RADIUS is its own scale, not the spacing one: {", ".join(r for r, _ in RADIUS[:-1])},
and {RADIUS[-1][0]} for anything meant to read as fully round. A control is
{RADIUS[1][0]}, a container is {RADIUS[3][0]}.

NEVER DRAW A LINE AROUND ANYTHING — no borders on cards, swatches, tables or
sections. Rayl has no border vocabulary; boundaries are made by a change of
ground. The only stroke in the system is the keyboard focus ring.

TYPE is {", ".join(str(s) for s, *_ in SCALE)}, plus 8 for labels, and no others. Use
rayl-96 … rayl-12 and rayl-label — each carries its own leading and tracking,
which are one decision and not three. Azeret is the workhorse and sets
everything including headlines. Concrette is a serif for titles and subheads
only, 24 and up: add rayl-serif. Never below 24, never for running text. One
weight, 500, everywhere: no bold, no light.

A CONTROL TRACKS 0. The scale's +2% at 12 is for running text; buttons, options
and row names are set at 0. A row names its control with rayl-row-name — 12,
Medium, full ink, sentence case — never with the 8 label, which names a section.

COLOUR comes only from the tokens. Never write a hex in a build. Every token
resolves per mode, so a page that names tokens is right in light and dark and a
page that names hexes is right in neither. Dark mode is
document.documentElement.dataset.theme = "dark"; leave it unset to follow the
viewer's own setting.

LAYOUT comes from the system, so do not invent spacing. Panel: rayl-page,
rayl-section, rayl-stack, rayl-cluster, rayl-grid, rayl-head, rayl-card,
rayl-row, rayl-label, rayl-hint. Wide: rayl-page is-wide, rayl-hero, rayl-band
(is-ink), rayl-split (is-lead, is-three, is-centred), rayl-measure, rayl-media.

For a DOCUMENT rather than an app — a guideline, a reference, an overview — put
rayl-doc on the body and rayl-doc-page inside it, then alternate rayl-chapter
(an 8 label on the ground) with rayl-block. A block is two columns: rayl-rail
carries the words, rayl-field carries rayl-frame boxes holding the things
themselves, side by side in a rayl-field-row where they fit. Name a frame with
rayl-frame-tag. Give every frame far more room than its content needs; that air
is the whole look. Name the thing and show it — never write a paragraph
explaining it.

WHILE SOMETHING IS LOADING, show the mark solving itself — not a spinner, not a
bar, not three dots: <span class="rayl-solve" data-size="150" data-label="Loading"></span>
Call el.solve() when the thing has arrived, so the wait ends on the mark rather
than being cut off. On any ground other than surface/ground, set
--rayl-solve-ground to that token or its tiles will show.

CONTROLS. An active control takes aria-pressed="true". Where exactly one of a
set is on, use rayl-seg with rayl-seg-opt cells and put is-on on the one that
is — the group owns the selection, so never wire that up yourself. Cells are
half-width; is-third makes three to a row, is-joined closes the group into one
bar and its first cell can be a rayl-seg-name carrying the set's name in full
ink, is-tight sizes it to its own content. Never build a one-of-many row out of
rayl-btn and aria-pressed. A value on a line rolls the same way a button label
does: rayl-line with data-label and data-swap, and data-rolls on the control
that changes it.

ICONS: {", ".join(ICONS)}. Every one is a 12x12 filled path.
There are no others; do not substitute one from a public set.

THE LOGO is a file, never something you draw: {HUB}/assets/logo/Lockup.svg
It is #1C1C1A on light and #FFFFFF on dark — the same as text. Clear space
around it is its own height, half that for the icon alone. There is no minimum
size.

THE ARRAY is the row of plates, cards or baskets the brand is made of, and it
is a live renderer rather than something to approximate. One tag and one box:

<script type="module" src="{HUB}/assets/array/rayl-array.js"></script>
<div data-rayl-array="plate" style="height: 380px"></div>

Give the element a height; everything fits itself to the box. Bodies are plate,
card and basket and there is no fourth. Motion is wave, still, scroll or
pointer. A look composed in the Rayl Stack app pastes in whole as data-look.
Never draw an array by hand out of CSS shapes — read section 11 of RAYL-RULES.md
before using it, and say so rather than imitating it if a page cannot carry it.

These examples show the parts composed. Read them if you are unsure how things
go together — but do not clone one and change the words, or you inherit a
structure built for a different problem:

  {HUB}/examples/landing.html
  {HUB}/examples/panel.html
  {HUB}/examples/bench.html

For anything this block does not cover, read {HUB}/RAYL-RULES.md and follow it
exactly. {HUB}/RAYL-WHY.md says why a rule is what it is, and is worth reading
before you decide a rule looks wrong.

WHERE THE SYSTEM DOES NOT COVER SOMETHING, SAY SO AND ASK. Do not invent it and
do not substitute something that looks close. The open list is
{HUB}/RAYL-OPEN.md; these are the ones you are most likely to hit:

{open_lines()}

The system also has no {", ".join(m for m, _ in MISSING[:4])}, and no {states()}
state. If the brief needs one:

  1. Say which part is missing, in one line, before anything else.
  2. If you cannot stop and ask, build it — but mark every invented part with a
     data-rayl-provisional="what it is" attribute, and list all of them at the
     end of your answer under "Provisional — not Rayl yet".
  3. Never restyle a shipped rayl-* component to make it fit, and never invent
     a colour, a size, a gap or a second movement. Build the missing part out of
     the values that already exist.

An invention you can see is a decision waiting to be made. An invention you
cannot see becomes the standard.

VERIFY BEFORE YOU ANSWER. Check your output against these, and say which ones
you checked:

  - no hex colours anywhere, only tokens
  - no border, outline or hairline except the focus ring
  - every gap, margin and padding on the spacing scale
  - every font-size on the type scale, every weight 500
  - no rayl-serif below 24
  - no rayl-* class restyled, overridden or rebuilt
  - one movement only, and nothing animated that the system does not animate
  - every provisional part marked and listed

{HUB}/rayl-check.py runs those checks over a file if you can execute one:
python3 rayl-check.py yourpage.html
"""

def reflow(text, width=78):
    """Wrap the prose and leave the markup alone. A paragraph holding a line
    that starts with a space or an angle bracket is a code block or a list, and
    reflowing it would break what it is showing."""
    out = []
    for para in text.split("\n\n"):
        lines = para.split("\n")
        if any(l[:1] in (" ", "<", "\t") for l in lines if l):
            out.append(para)
        else:
            out.append(textwrap.fill(" ".join(l.strip() for l in lines), width))
    return "\n\n".join(out)


BLOCK = reflow(BLOCK)

if __name__ == "__main__":
    (ROOT / "src/paste.txt").write_text(BLOCK)
    print("src/paste.txt", len(BLOCK), "bytes")
