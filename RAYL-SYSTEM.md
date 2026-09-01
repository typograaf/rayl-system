# The Rayl design system

This document is the single source of truth for how anything Rayl looks and
behaves. It is written to be read by an AI building something — a tool, a screen,
a reskin, a screensaver — and by any person who wants to know what the rules are.

## How to use this

Follow every rule here exactly. Where a value is given, use that value; do not
round it, do not pick something near it, do not substitute a colour that looks
similar.

**When this document does not cover something, say so and ask. Do not invent it.**
That is the most important rule on this page. A guess that looks fine is worse
than a question, because it ships and then it spreads. Sections below marked
NOT DECIDED are real gaps, not omissions to fill in with your best judgement.

Rayl is light mode only for now. Do not produce a dark variant unless asked.

---

## 1. The logo

There are two files and you must use them as they are. Never redraw the mark,
never rebuild it out of rectangles and circles, never set the word "Rayl" in a
typeface.

- **Icon** — the mark alone, with the registered symbol tucked into the notch of
  the wedge. `assets/logo/Icon.svg`
- **Lockup** — the mark and the word "Rayl" side by side.
  `assets/logo/Lockup.svg`

Use the lockup wherever there is room. Use the icon where there is not, or where
the name is already obvious on the page.

### How the mark is built

Know this so you can spot a wrong one, not so you can draw one.

The mark is three bodies inside a 150 square:

- a **bar** across the top, 150 wide and 69 tall
- a **dot** bottom left, 69 across
- a **wedge** bottom right, 69 by 69

The gap between them is **12**. Every body measures **69**. 69 + 12 + 69 = 150.

**The bar's two ends are different and that is the point.** Its right end is a
full half-circle, radius 34.5. Its left corners are radius 17.5, exactly half.
A mark with two matching ends is wrong.

The wedge's rounded corners push about a third of a unit past the 150 square.
That is deliberate optical correction. Do not correct it.

### The lockup's proportions

- The wordmark's capital height equals the icon's height.
- The gap between the icon and the word is **69** — one body, the same as the
  bar's height.
- The registered symbol sits on the baseline, **12** after the l.
- The full lockup is 644 x 191. The extra height below the baseline is the y's
  descender.

### Colour

The logo is `#1C1C1A`. See section 2 — this is currently the only colour in the
system that comes from the brand itself rather than from a build.

Place the logo in `#1C1C1A` on a light background. A light logo on a dark
background is NOT DECIDED — ask.

### Clear space and minimum size

NOT DECIDED. A proposal, not yet approved: clear space of 12 units at whatever
size the mark is drawn, which is the mark's own internal gap and works out at 8%
of its height. Minimum size needs a real answer because the registered symbol
carries fine detail that will fill in when small.

### Never

- Redraw or trace the mark.
- Change the proportions between the three bodies, or the gap between them.
- Make the bar's ends match.
- Set "Rayl" in a typeface as a substitute for the lockup.
- Rotate, skew, outline, add a shadow to, or recolour the mark.
- Place the mark on a busy background where its silhouette breaks up.

---

## 2. Colour

The palette is ten flat colours and two gradients. They live in the Rayl Figma
file as styles under a `V2/` prefix, and those styles are the authority.

The names are materials, not greys, and that is deliberate. The palette is drawn
from the professional catering world — the look of porcelain and concrete, rigid
materials given fluid, organic movement.

| name | hex | RGB | CMYK | L* |
|---|---|---|---|---|
| White | `#FFFFFF` | 255 255 255 | 0 0 0 0 | 100.0 |
| Off White | `#F7F7F2` | 247 247 242 | 0 0 2 3 | 97.1 |
| Dark Off-White | `#E2E2D3` | 226 226 211 | 0 0 7 11 | 89.5 |
| Porcelain | `#CFCFC4` | 207 207 196 | 0 0 5 19 | 82.8 |
| Dark Porcelain | `#ACACA2` | 172 172 162 | 0 0 6 33 | 70.1 |
| Pale Concrete | `#898982` | 137 137 130 | 0 0 5 46 | 56.9 |
| Light Concrete | `#696963` | 105 105 99 | 0 0 6 59 | 44.2 |
| Dark Concrete | `#55554E` | 85 85 78 | 0 0 8 67 | 35.9 |
| Off-Black | `#373733` | 55 55 51 | 0 0 7 78 | 22.9 |
| Black | `#1C1C1A` | 28 28 26 | 0 0 7 89 | 10.2 |

Three of these — Dark Porcelain, Pale Concrete and Off-Black — were added on
2026-09-01 to fill two holes in the ladder. They are drawn on the palette's own
hue (109.7) with chroma interpolated from their neighbours, so they belong to the
set rather than merely sitting near it.

Read down the L* column: the steps are 2.9, 7.6, 6.7, 12.7, 13.2, 12.7, 8.3,
13.0, 12.7. Before they were added the two biggest were 38.6 and 25.7.

**Gradients.** Both run top to bottom with the first stop at 0.349%.

- **Porcelain Gradient** — `#CFCFC4` to `#F7F7F2`
- **Concrete Gradient** — `#696963` to `#CFCFC4`

Note the swatch in the file labels the second one "Paper Gradient" while its
style is named "Concrete Gradient". Use the style name.

### Ink and ground

Ink is `#1C1C1A`. Never `#000000` — the palette has no pure black and the logo
is not drawn in one.

The ground is `#F7F7F2` on light. `#FFFFFF` is in the palette but is a distinct
colour from the page, used for cards and panels that need to lift off it.

### What existing builds get wrong

Every Rayl build in code has drifted from these values. If you are working in one,
the file is right and the code is wrong:

| build | uses | should be |
|---|---|---|
| rayl-ui paper | `#F0F0E5` | `#F7F7F2` |
| rayl-ui sunk | `#E8E8D8` | `#E2E2D3` |
| rayl-ui ink | `#000000` | `#1C1C1A` |
| rayl-screen porcelain | `#CECEC5` | `#CFCFC4` |
| rayl-screen black | `#3F3F3B` | `#55554E` |
| rayl-screen grey dark | `#696963` | correct |

### What the palette does not yet cover

Three things are genuinely missing rather than merely unwritten. Ask rather than
filling them in:

- **White is the only colour off the system.** Every other colour sits between
  hue 109.4 and 110.0. White is achromatic, so in a warm palette it reads cold.
  It also cannot carry the hue: at maximum lightness there is no room for any
  chroma at all. Keeping it pure is defensible — it is the true white, and Off
  White already does the warm job — but it is a deliberate exception, not a
  member.
- **Dark Off-White is more saturated than both its neighbours.** Its chroma is
  7.8 where Off White is 2.5 and Porcelain 5.8; the curve would put it near 4.2.
  It is the one colour that looks slightly more yellow-green than the set.
- **The green.** The palette's own rationale promises "subtle touches of an
  organic green", but no green is in it. One exists in the app build
  (`#D8DEB9`), unaccounted for.
- **Semantic colours.** Nothing means error, warning or success. Because the
  whole palette sits on a single hue, any of these is the first hue break in the
  brand — a real decision, not a detail.

## 3. Typography

The typeface is **Azeret**. It ships with this system in `assets/fonts/`.

These are the TRIAL cuts. They are fine for internal work and prototypes. Before
anything goes public, the licensed files have to replace them.

### The cap-height rule

This one is easy to miss and it changes every measurement on the page.

**Text is trimmed to its cap height, not to its line box.** Every text element
in the Rayl design files is trimmed this way, which is why the spacing in those
files works out to whole numbers. In CSS:

```css
text-box-trim: trim-both;
text-box-edge: cap alphabetic;
```

Where that is not supported, use a line height of `0.698` — Azeret's cap height —
so a text box measures cap to baseline.

If you skip this, every gap you build will be several pixels larger than the
design says, and nothing will line up with anything built correctly.

### Sizes

Two sizes are established:

- **8** — section labels
- **12** — everything else: body, rows, buttons, controls

Tracking at 12 is `0.02em`. Line height is `1.2`.

Anything larger than 12 is NOT DECIDED. If you need a headline size, ask.

### Weights

400, 500 and 600 all appear in existing builds with no stated division of labour.
NOT DECIDED — ask which to use rather than picking.

---

## 4. Spacing and layout

The scale is **6, 12, 24, 48, 72**. Use these numbers and no others.

Two values outside the scale are in heavy use in existing builds and are awaiting
a ruling: **36** as a page margin, and **8** as a corner radius. Until that is
settled, do not introduce either into new work, and do not "fix" them where they
already exist.

Corner radius as a whole is NOT DECIDED. The one established value is 8 on
buttons in the existing panel.

Established layout figures worth knowing:

- The tool panel is a **300** wide column with **48** of padding and **48**
  between its groups.
- The app screen's content column is **330**.

---

## 5. Interactive states

**The rule, which matters more than the table.** A state is a move along the
palette's own lightness ladder, taking whatever chroma the curve gives at that
lightness. Hover moves **5 L\***, pressed moves **10 L\***. Light grounds darken;
dark fills lighten, because they have nowhere darker to go.

Follow the rule and a state colour is automatically a member of the palette. It
also means you can derive a state for an element that is not in this document —
which is the whole point.

| base | rest | hover | pressed |
|---|---|---|---|
| White | `#FFFFFF` | `#F1F1E5` | `#E3E3D4` |
| Off White | `#F7F7EF` | `#E9E9DB` | `#DBDBCC` |
| Dark Off-White | `#E2E2D3` | `#D4D4C6` | `#C6C6B8` |
| Porcelain | `#CFCFC1` | `#C1C1B4` | `#B3B4A7` |
| Black | `#1C1C1A` | `#262623` | `#31312D` |

White is the exception, as it is everywhere: because it carries no chroma at all,
its hover gains warmth as well as depth. That is correct rather than a fault — a
white card hovering joins the palette instead of just dimming.

### States that need no new colour

These come off the ramp. Do not invent a colour for them.

| role | colour |
|---|---|
| ink / rest | Black `#1C1C1A` |
| ink / secondary | Light Concrete `#696961` |
| ink / disabled | Dark Porcelain `#ACACA0` |
| ink / inverse, on dark fills | Off White `#F7F7EF` |
| fill / disabled | Dark Off-White `#E2E2D3` |
| fill / selected | Black `#1C1C1A`, ink Off White |
| line / rest | Dark Porcelain `#ACACA0` |
| line / hover | Pale Concrete `#89897F` |
| line / focus | Black `#1C1C1A`, Off White on dark grounds |
| control / track | Dark Off-White `#E2E2D3` |
| control / fill | Black `#1C1C1A` |

### Contrast

Every ground above carries its ink at 8.1:1 or better, the weakest being Black
ink on Porcelain pressed. Nothing here needs checking before use.

Ink flips from Black to Off White between Pale Concrete and Light Concrete. That
is the boundary — above it dark ink, below it light.

### Still not covered

Loading, empty and error states. Ask rather than inventing them.

## 6. Motion

NOT DECIDED. No durations and no easing curves have been agreed. Three existing
builds each carry their own and none of them match.

Ask before animating anything.

---

## 7. Icons

Icons are drawn on a single shared grid. The grid size and the stroke weight are
NOT DECIDED here yet — ask for them before drawing or picking an icon.

Do not substitute an icon from a public icon set. They will not match the grid.

---

## 8. The Rayl look

The thing that makes something read as Rayl rather than as a generic light-mode
app is a layered gradient treatment on its cards and shapes: flat vector art with
gradient fills, stamped repeatedly, with no specular highlight anywhere.

This is important enough to say directly: **it is not lighting and it cannot be
reproduced with lighting.** Every ring carries the same gradient in the same
place on its own body, and the transitions are perfectly smooth. A light answers
"which way is this surface facing" — this gradient does not follow facing at all.
An earlier build spent a long time chasing this look with 3D lights and never got
there.

Working reference code for this is NOT YET IN THIS REPO. Until it is, if you are
asked for the Rayl look, say that the reference has not been added yet rather
than approximating it.
