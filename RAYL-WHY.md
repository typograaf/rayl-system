# The Rayl design system — why

Why a rule is what it is, where each number was measured, and what was tried and
rejected. Nothing here is binding. The rules are
[RAYL-RULES.md](https://typograaf.github.io/rayl-system/RAYL-RULES.md); the open
questions are
[RAYL-OPEN.md](https://typograaf.github.io/rayl-system/RAYL-OPEN.md).

Read this before deciding a rule looks wrong. Most of the ones that look wrong
were arrived at by trying the obvious thing first.

---

## Where the truth lives

When two sources disagree, this is the order: the approved Figma frames first,
then `rayl-stack` — the shipped app — then the rules document, then anything
else. `rayl-ui`, `rayl-wheel` and the other repos are studies; they contain
earlier and different versions of the same controls and are not the system.
Three rules were written from a study and had to be corrected.

An AI can read none of the first two, which is why RAYL-RULES.md tells it that
*that document* is the authority. This chain is how the document gets changed,
not how a build gets made.

---

## The logo, measured

These come out of `Icon.svg` and `Lockup.svg`, not out of an estimate. Know them
so you can spot a wrong mark, not so you can draw one.

**The mark is three bodies on a 150 grid.**

| body | size | position |
|---|---|---|
| bar | 150 wide, 69 tall | top, full width |
| dot | 69 across | bottom left |
| wedge | 69 x 69 | bottom right |

69 + 12 + 69 = 150. The gap between the bodies is 12. The dot's diameter, the
bar's height and the wedge's box are all 69, the same number.

**The corner radii are deliberately unequal.** The bar's right end is a full
half-circle (34.5, half its height). Its left corners are 17.5, exactly half
that. Making both ends match is the single most likely way to get the mark wrong.

**The wedge overshoots its box by about a third of a unit** at the two ends of
its diagonal. That is optical correction on a rounded corner, not a mistake, and
it is why `Icon.svg` is 151 wide rather than 150.

**The lockup ties the wordmark to the mark by cap height.** The wordmark's
capitals are the same height as the icon, 150. The gap between them is 69 — one
body, the same as the bar's height. The guidelines board states that gap as one
third of the total lockup height, which would be 64; the file is the artwork you
place and you never rebuild the lockup, so 69 stands. The registered mark sits on
the baseline, 12 after the l. The whole lockup is 644 x 191; the y descends 41
below the baseline, which is where the extra height comes from.

**The wordmark is not monospaced.** The R is 111 wide and the l is 22. It is
either drawn or set in a proportional cut, and either way it is not something to
retype in Azeret Mono and hope.

---

## Colour

### Which source is authoritative

The palette's authority is the approved frame `1083:9025`, **not** the `V2/`
paint styles in the Figma file. Those are an earlier round and still hold the
pre-revision values — `#CFCFC4` for Porcelain, `#F7F7F2` for Off White, `#696963`
for Light Concrete. Where a style and that frame disagree, the frame wins and the
style is stale. Anything quoting the `V2/` numbers is out of date, including
older versions of this repo's own audit.

The swatch specs in the file were blank — every one read `RGB 000 000 000`,
`CMYK 000 000 000 000`, `HEX #000000`, laid out and never completed. On
2026-09-01 all nine were written with their real values taken from each swatch's
own fill, plus an `L*` row that makes the gap in the palette visible at a glance.

### It is one hue

Every colour sits between OKLCh hue 106.5 and 106.9 — a spread of less than half
a degree. Chroma follows a single arc: rising out of white, peaking at Dark
Off-White, falling away to black, never reversing. **A new colour belongs to this
palette only if it sits on that arc.**

Two known irregularities, neither of them gaps:

- **White is the only colour off the system.** It is achromatic, so in a warm
  palette it reads cold — and it cannot carry the hue, because at maximum
  lightness there is no room for any chroma at all. Keeping it pure is
  defensible; it is a deliberate exception, not a member.
- **Dark Off-White is more saturated than both its neighbours.** Its chroma is
  7.8 where Off White is 2.5 and Porcelain 5.8; the curve would put it near 4.2.
  It is the one colour that looks slightly more yellow-green than the set.

### The gradients

Both are the `V2/` gradients re-struck on the revised palette. The styles in the
file still hold the old stops, and a gradient running to a colour the palette no
longer contains is the one place those old values would have survived. The swatch
in the file labels the second one "Paper Gradient" while its style is named
"Concrete Gradient" — use the style name.

### Every build in code has drifted

If you are working in one of these, the file is right and the code is wrong:

| build | uses | should be |
|---|---|---|
| rayl-ui paper | `#F0F0E5` | `#F7F7EF` Off White |
| rayl-ui sunk | `#E8E8D8` | `#E2E2D3` Dark Off-White |
| rayl-ui ink | `#000000` | `#1C1C1A` Black |
| rayl-screen porcelain | `#CECEC5` | `#CFCFC1` Porcelain |
| rayl-screen black | `#3F3F3B` | `#55554E` Dark Concrete |
| rayl-screen grey dark | `#696963` | `#696961` Light Concrete |

This table is the argument for `rayl.tokens.json` and `rayl-vars.css`. Every one
of these is a value somebody retyped out of a document by hand.

### There is no green

The colour chapter's own prose promises "subtle touches of an organic green" and
the app build carries a `#D8DEB9`. Neither is the brand.

---

## Typography

### Why the cap-height trim

Every text element in the Rayl design files is trimmed cap to baseline, which is
why the spacing in those files works out to whole numbers. An AI that does not
know it will be about four pixels out on every label — and the error compounds,
because it is per text box.

In the shipped app this is `text-box-trim: trim-both` with `text-box-edge: cap
alphabetic`; in the older panel it is a line height of 0.698, Azeret's cap
height.

### The two faces do not share a cap height

Azeret is 0.698 of its size, Concrette S is 0.708 — the serif is 1.4% taller in
the cap. Everything is trimmed cap to baseline, so a Concrette line leaves
slightly less white between its lines at the same size and leading. The `0.698`
fallback line-height in `core.css` is **Azeret's number**, applied to both. Close
enough to keep, and worth knowing whose it is.

### Concrette is an optical-size family and the system ships the small cut

S, M and XL share a cap height and narrow as they go up: at 96, "Rostering"
measures 485 / 469 / 454px. S is drawn for small text and XL for display, and
every Concrette headline here is set in S. That is a choice, not an oversight —
the guidelines never mention the axis exists. Ask before changing the file.

### The tracking table has two things in it that look like typos

Concrette sets two percent tighter than Azeret at every size they share **except
48**, which is one. Azeret **stalls at −3% across both 72 and 48** rather than
stepping. Both were put side by side on the board and chosen. Neither is a typo.

### Where the control tracking came from

Every 12 label in the approved panel — button, option, joined-bar name, row
name — is Azeret Medium at 12 with no tracking at all, measured at `997:7659`. If
a control looks subtly wrong beside the design, this is usually why.

### The weights

The Figma guidelines board sets its own text in **Azeret VF-TRIAL**, a variable
font, at `"ital" 0, "MONO" 0` — proportional, not monospaced. Every build in code
carries static cuts instead. 400 and 600 appear in older builds and are not Rayl;
only the Medium face ships.

---

## Spacing

### Why the scale steps by 12

The stated scale was once 6, 12, 24, 48, 72, and the builds did not obey it: 36
was every page margin in the app screen and 8 was the radius on every button in
the panel. Neither was an accident. Re-measuring the board settled it — every gap
that read correctly turned out to be a multiple of 12, and 36 and 60 had nowhere
to land. They are full members now.

**8 is not on the spacing scale and never was.** Spacing and corner radius do not
have to share a scale, and in this system they clearly do not. Radius is its own
ladder.

### The heading mapping is designed, not derived

A flat gap cannot work across a range from 8 to 96: twenty-four reads generous
under a label and cramped under a 72 headline. Half the size was tried first and
is visibly too tight at the bottom. Ratios that look right at 72 are wrong at 24,
which is why the table is the rule and not a formula.

It used to be named after its container — stack 12, section 24, split 48 — with a
heading topping up the difference under itself. That put one number under the
heading and a smaller one everywhere else in the group, which is not what the
board draws: a heading, its body copy and its buttons were built as one
auto-layout stack and the same number sits between all three.

**18 and 24 now take the same 24**, so at those sizes a heading no longer gets
more room than the lines beneath it. The hierarchy is carried by the size of the
type rather than by the gaps around it.

There is still a top-up margin under each heading in the stylesheet, but only as
a safety net for one dropped into a container carrying a smaller gap. In normal
use every one of them resolves to 0.

### Why 12 is on the scale with almost nothing on it

12 is what the document layout runs on — blocks on the page, frames in a field.
Inside an app column nothing currently uses it.

---

## Motion

### Why the roll and nothing else

Three builds each had their own easing file and none of them shared a name or a
number. There is now one movement, with one duration, one stagger, one curve and
a travel derived from the clip. The value of having one movement is that it is
one.

### Why the travel is the clip

A roll built by eye looks broken because the glyph is moved "about a line"
instead of by the exact height of the thing clipping it. Anything shorter leaves
half a character stranded inside the shape at the end of the roll. This is the
detail everyone gets wrong.

### Why the order is random

A left-to-right wipe is the obvious version and it reads as a progress bar.
Random is what stops that, and reshuffling every roll is what stops the same
label turning over the same way twice.

### Why per-character boxes are allowed to drop kerning

Splitting a label into boxes drops kerning. At 12 with 0.02em tracking that is
invisible, which is the only reason this is allowed.

### The reveal button, and the three readings that were rejected

Measured off `Rayl / 1101:9741`. That frame is drawn at half scale, and every
value in it doubles onto a number the system already has — which is the check
that it belongs:

| measure | frame | real |
|---|---|---|
| height | 16 | **32.376** — `cap + 24` |
| type, Medium | 6 | **12** |
| padding | 6 | **12** |
| radius, idle | 4 | **8** |
| radius, right on hover | 8 | **16.188** |
| gap | 3 | **6** |
| circle | 16 | **32.376** |
| icon | 6 | **12** |

In the frame, idle is 63 wide and hover is 44 + 3 + 16, which is also 63. The
body gives up exactly the gap plus the circle.

**The right corners go to half the height, not to double the radius.** At this
height, 8 doubled and half of 32.376 are the same number, so the two rules are
indistinguishable here and only one of them survives a taller button.

Three other readings were built and rejected:

- the circle merely uncovered by the shrinking body, and
- the circle sliding out from behind it — both leave nothing happening at the
  moment the gap opens;
- scaling it up from a point — puts the icon through sizes it was not drawn for,
  and an icon is built for its box.

**Getting the two clips wrong fails silently rather than loudly** — the label
simply appears twice, once in place and once sitting below the button.

### The option group's hover

The ladder's answer for a pressed cell is the same colour selection is painted
in, so a press would flash as a selection and the circle would then open Bone on
Bone. Both states step one further out. In dark there is no such collision, and
the token that is right there is `surface/idle-pressed` — so the press is the one
value in the system that is declared per theme, as `--rayl-seg-press`.

The hover does not try to be a small preview of the click. It is its own complete
moment, which is what stops the pair reading as two unrelated effects. Nothing
appears on hover — no mark, no dot — so nothing can land in the wrong place when
the pointer moves on.

70.71% is exactly half the diagonal of a square.

The name cell of a joined bar was measured at `1083:8907`: 72 against a number
cell's 20, which is the same 18:5 the group already uses, so nothing new had to
be decided.

### The slider's fillet

The design hand-fits a cubic with offsets `1.10457, 0.8954` from the nub's
corner, which is exact for a nub of exactly 12. The nub grows on hover, so
`rayl.js` draws the join as an arc instead: at rest it is the same quarter-circle
of radius 2, and it stays tangent to both the nub and the rail at every size. Use
the cubic when you are drawing a static one at 12; use the shipped control for
anything interactive.

Releasing a drag re-reads where the pointer actually is, because pointer capture
routes every move to the control including the ones far outside it, so by the end
of a drag the hover state it has been keeping is stale.

A click focuses the control too, and a pointer already says where it is; lighting
up for that leaves the nub looking held down long after it was let go. That is
why only keyboard focus lights it.

Measured at `997:7711` — the row is 264 by 32.376 with the name and the control
12 apart.

---

## The controls, and where their form came from

The eleven parts added in one go — field, select, menu, checkbox, toggle, dialog,
tooltip, popover, tabs, collapsible section, table, empty panel and skeleton —
are not designed here. They are read off the **UI Control Blanks** page of the
Figma file, board by board. Every measurement below is on a layer name there, and
where the file and this repo disagreed, the layer name was taken as the spec:
the file draws a focus ring in `line/track` and names it `ink/primary`, and
`ink/primary` is what ships, because that is the ring every other control in the
system already draws.

**The first four were one decision and not four.** In a system with no strokes, a
control that ACCEPTS input has to read as enterable through a change of ground
alone. That was the largest open item in the system and it blocked the other
three; once the field had a ground, a height and a corner, the select, the
checkbox and the toggle followed from it without another choice being made.

**Figma rounds a text node to whole pixels**, so an auto-layout hug reports 32
where the system says 32.376. Every control here is pinned to `cap + 24`, and the
32 on the table's header row in the file is that rounding, not a second height.

Two boards offered a second candidate rather than a decision, and both were
settled by asking:

- **The checkbox footprint.** 24 rounding 8, and 12 rounding 4 at icon scale.
  Both ship — 24 is the default, `is-small` is the dense row — because the system
  fixes no square control and the file called both candidates.
- **The tooltip's ground.** `fill/strong` and `surface/idle` were drawn side by
  side. Ink won: a tooltip floats over a panel, panels are already Paper, and a
  Paper tooltip on a Paper panel has no edge and nothing in this system to give
  it one.

**The scrim is 20%**, which is the figure on the board. Only the light value was
drawn. The colour is the darkest ground the mode has rather than `ink/primary`,
because `ink/primary` flips to White in dark mode and a scrim that lightens the
page behind it is not a scrim. That inference is on the open list as
PROVISIONAL.

**There is no check glyph in the eighteen icons**, so ON is carried by the ground
— the box turns Bone like everything else selected — and the mark inside it is
Plus turned 45 degrees, which is what the board draws. The error panel shows the
same glyph at 24. One drawing carrying two opposite meanings is a real weakness
and it is on the open list rather than quietly fixed by drawing a tick.

**The error panel is the empty panel with different words.** Nothing in the
palette means error and no red was borrowed to make one; semantic colour is still
open and this is what the system honestly looks like until it is decided.

**The skeleton narrowed a rule rather than breaking it.** Section 8 said a wait
shows the mark and "not a skeleton". It still does: `rayl-skeleton` says where
type will land, `rayl-solve` says something is happening, and the sentence now
distinguishes them instead of forbidding one of them. The skeleton does not move,
because a shimmer would be a second movement in a system whose whole argument is
that there is one.

**Two grounds went the other way from section 5.** A control on a popover and the
action in an empty panel take `surface/ground` — one rung OUT — because both
surfaces are themselves `surface/idle`, and a Paper control on a Paper card is
not a control. That is drawn on both boards and it is the same reasoning the
option group already uses when selection owns the rung a hover would want.

## Why the components ship as code

Several of the descriptions in this repo were wrong until the code was read. A
model given prose about the slider's fillet produces a rail butted against a box;
a model given `rayl-slider` produces the control. Behaviour cannot be described
reliably, so it is not described — it is shipped.

## Why the examples are not templates

Cloning a demo and swapping the words is the dominant failure mode of an AI
handed a design system. You inherit a structure built for a different problem and
the result is a page shaped like a rostering pitch no matter what it is about.

## Why the block is generated

The block people paste at the top of a prompt used to be hand-written prose while
every number in it also lived in the stylesheet and the guideline. It drifted, as
hand-copied numbers do. For weeks it told people the spacing scale was "6, 12,
24, 48, 72 and nothing else" while the stylesheet shipped 36 and 60, and it gave
four heading gaps of which three were wrong — and because the block claimed to
cover spacing, nothing sent a reader on to the document that had it right.

The block is the contract. It is generated from `src/parts.py` now, and `doc.py`
asserts those numbers against `core.css` before a build is allowed to finish.

---

## The guidelines board

For navigation — the board is node `966:99`, 2040 x 37175, and its frames are all
named "Frame N", which is why it is hard to move around.

| chapter | header node | content |
|---|---|---|
| Tone of voice | 966:131 | 966:133, 966:174 |
| Typography | 966:217 | 966:219, 966:485 |
| Iconography | 966:504 | 966:507, 966:554, 966:581, 966:608 |
| Colours | 966:637 | 966:639 |
| Array system | 966:778 | 968:1219, 968:2034 |
| Array applications | 966:1809 | 966:1811 |
| UI principles | 966:1854 | 966:1856, 966:1967, 966:2069, 966:2174, 966:2208 |
| Merchandise applications | 966:2731 | 966:2733, 966:2759, 966:2788, 966:2881 |
| Car concept | 966:2976 | 966:2978 |

The board's own text styles are named `Guidelines/Chapter 12pt`,
`Guidelines/Body 18pt` and `Guidelines/Body 10pt`, so they describe the guideline
document rather than the product UI.

---

## How this repo is built

Everything is generated from `src/` by `python3 src/build.py`:

    src/core.css       tokens, type, page, layout, components
    src/components.js  the label roll, the odometer reel, the icons
    src/slider.js      the track
    src/icons.json     the eighteen icons
    src/parts.py       every fact in the system, once: palette, tokens, scale,
                       spacing, motion, inventory, the open list
    src/paste.py       the block people paste, rendered from parts.py
    src/tokens.py      rayl.tokens.json and rayl-vars.css
    src/site.py        the bench and the dashboard, from parts.py
    src/doc.py         writes the fact tables into the documents, and refuses to
                       build when one of them disagrees with core.css
    src/check.py       rayl-check.py, which reads a page and says where it leaves
                       the system

    ->  rayl.js, rayl-vars.css, rayl.tokens.json, rayl-check.py, index.html,
        RAYL-RULES.md, RAYL-OPEN.md, examples/bench.html, and dist/ copies with
        rayl.js inlined

**Edit `src/`. Never edit `rayl.js`, `rayl-vars.css`, `rayl.tokens.json`,
`rayl-check.py` or `RAYL-OPEN.md`** — they are output and they will be
overwritten. In `RAYL-RULES.md` the prose is hand-written and every
`<!-- generated:… -->` block is not.

`eval/` holds fixed briefs to run the system against. See `eval/README.md`.

## Adding assets

Drop new files into the Rayl **Brain Assets** folder in Dropbox and they get
copied in here and published. Dropbox is the place to put them; this repo is what
makes them reachable by a URL, which is what an AI needs in order to use them
rather than approximate them.
