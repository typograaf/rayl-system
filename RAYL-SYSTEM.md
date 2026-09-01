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

NOT DECIDED — and this is the largest open gap in the system.

The only colour that is certain is the brand black, `#1C1C1A`, because it is
what the logo files are drawn in.

Three different blacks and three different off-whites are currently in use across
existing Rayl builds and they do not agree with each other. Until that is
resolved, **use `#1C1C1A` for ink and ask which background to use.** Do not pick
one of the candidates yourself.

See `AUDIT.md` for the full list and the questions outstanding.

---

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

## 5. Components

NOT DECIDED, and the gap is wide enough to matter.

Rayl has a panel, sliders, toggles, tabs, cards, and a calendar rail — but every
one of them exists in exactly one state. There is no hover, pressed, disabled,
focus, error, loading or empty state anywhere in the system.

If you are asked to build something that needs a state that is not defined, build
the default state and say plainly which states you could not do. Do not invent
them.

---

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
