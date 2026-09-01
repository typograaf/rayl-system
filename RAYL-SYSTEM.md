# The Rayl design system

This document is the single source of truth for how anything Rayl looks and
behaves. It is written to be read by an AI building something — a tool, a screen,
a reskin, a screensaver — and by any person who wants to know what the rules are.

## How to use this

**Where the truth lives.** When two sources disagree, this is the order: the
approved Figma frames first, then `rayl-stack` — the shipped app — then this
document, then anything else. `rayl-ui`, `rayl-wheel` and the other repos are
studies; they contain earlier and different versions of the same controls and are
not the system. Three rules in this document were written from a study and had to
be corrected.

Follow every rule here exactly. Where a value is given, use that value; do not
round it, do not pick something near it, do not substitute a colour that looks
similar.

**When this document does not cover something, say so and ask. Do not invent it.**
That is the most important rule on this page. A guess that looks fine is worse
than a question, because it ships and then it spreads. Sections below marked
NOT DECIDED are real gaps, not omissions to fill in with your best judgement.

Rayl is light mode only for now. Do not produce a dark variant unless asked.

---

## 0. Start from a template, do not compose

Two working pages ship with the system:

    templates/panel.html   a settings panel
    templates/bench.html   every control, on five grounds

**Change their content. Do not build a page from scratch.** Copying is what makes
two pages identical rather than merely similar, and it is the same reason the
components are shipped as code instead of described.

Both pull in one file, which carries the tokens, the page ground and rhythm, the
button, the slider and the icons:

    https://typograaf.github.io/rayl-system/rayl.js

Put  on the body and write markup:

    <body class="rayl"><div class="rayl-page">
      <section class="rayl-section">
        <span class="rayl-label">Aspect ratio</span>
        <div class="rayl-cluster">
          <button class="rayl-btn">4:5</button>
          <button class="rayl-btn" aria-pressed="true">5:4</button>
          <button class="rayl-btn" data-icon="Save">Save</button>
        </div>
        <div class="rayl-row"><span class="rayl-label">Count</span>
          <span class="rayl-slider" data-min="1" data-max="33" data-val="12" data-step="1"></span>
        </div>
      </section>
    </div></body>

Layout is part of the system, not a decision to make each time: ,
, , , , ,
, , .

Dark mode is ; leave it unset to
follow the viewer's own setting.

The rest of this document exists for everything the file does not cover, and so a
person can check what the file does. **It is a description of the components, not
a recipe for them** — several rules in here were written from a description and
were wrong until the code was read. Where the two disagree, the file wins.

### Where the system is built

Everything is generated from  by :

    src/core.css       tokens, page, layout, components
    src/components.js  the label roll, the odometer, the icons
    src/slider.js      the track
    src/icons.json     the eighteen icons
    →  rayl.js, and dist/ copies of the templates with it inlined

Edit . Never edit  — it is output.

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

The palette is fourteen flat colours and two gradients. They live in the Rayl Figma
file as styles under a `V2/` prefix, and those styles are the authority.

The names are materials, not greys, and that is deliberate. The palette is drawn
from the professional catering world — the look of porcelain and concrete, rigid
materials given fluid, organic movement.

| name | hex | RGB | CMYK | L* |
|---|---|---|---|---|
| White | `#FFFFFF` | 255 255 255 | 0 0 0 0 | 100.0 |
| Paper | `#FBFBF6` | 251 251 246 | 0 0 2 2 | 98.5 |
| Off White | `#F7F7EF` | 247 247 239 | 0 0 3 3 | 97.1 |
| Bone | `#EDEDDF` | 237 237 223 | 0 0 6 7 | 93.3 |
| Dark Off-White | `#E2E2D3` | 226 226 211 | 0 0 7 11 | 89.5 |
| Porcelain | `#CFCFC1` | 207 207 193 | 0 0 7 19 | 82.8 |
| Mid Porcelain | `#C3C3B6` | 195 195 182 | 0 0 7 24 | 78.5 |
| Dark Porcelain | `#ACACA0` | 172 172 160 | 0 0 7 33 | 70.1 |
| Pale Concrete | `#89897F` | 137 137 127 | 0 0 7 46 | 56.9 |
| Light Concrete | `#696961` | 105 105 97 | 0 0 8 59 | 44.2 |
| Dark Concrete | `#55554E` | 85 85 78 | 0 0 8 67 | 35.9 |
| Off-Black | `#373732` | 55 55 50 | 0 0 9 78 | 22.9 |
| Soft Black | `#262623` | 38 38 35 | 0 0 8 85 | 15.2 |
| Black | `#1C1C1A` | 28 28 26 | 0 0 7 89 | 10.2 |

Every colour sits on one hue. In OKLCh they fall between 106.5 and 106.9 — a
spread of less than half a degree. Only White is off it, because at maximum
lightness there is no room for any chroma at all.

Chroma follows a single arc: rising out of white, peaking at Dark Off-White,
falling away to black, never reversing. A new colour belongs to this palette
only if it sits on that arc.

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

**No state has its own colour.** Every hover and pressed value is a colour
already in the palette. That is why the ladder has fourteen steps rather than
ten — Paper, Bone, Mid Porcelain and Soft Black exist so that the states have
somewhere to land.

**The rule.** Hover is the palette colour nearest **5 L\*** away; pressed is the
one nearest **10 L\***. Light grounds move down the ladder, dark fills move up,
because they have nowhere darker to go.

| base | rest | hover | pressed |
|---|---|---|---|
| White | `#FFFFFF` | Bone `#EDEDDF` | Dark Off-White `#E2E2D3` |
| Paper | `#FBFBF6` | Bone `#EDEDDF` | Dark Off-White `#E2E2D3` |
| Off White | `#F7F7EF` | Bone `#EDEDDF` | Dark Off-White `#E2E2D3` |
| Bone | `#EDEDDF` | Dark Off-White `#E2E2D3` | Porcelain `#CFCFC1` |
| Dark Off-White | `#E2E2D3` | Porcelain `#CFCFC1` | Mid Porcelain `#C3C3B6` |
| Porcelain | `#CFCFC1` | Mid Porcelain `#C3C3B6` | Dark Porcelain `#ACACA0` |
| Black | `#1C1C1A` | Soft Black `#262623` | Off-Black `#373732` |

For a base not in this table, apply the rule. Do not invent a colour.

### States that need no new colour either

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

### Sliders

**A Rayl slider is one shape.** A rounded nub carries the value and a 2px rail
runs *out* of it — not butted against it, out of it, through a concave fillet on
each side. That fillet is the whole character of the control, and it is the one
thing a rail-plus-a-box in CSS cannot do, because the join is a curve belonging
to neither piece. The path has to be generated.

**Colour: the shape is `surface/idle`, the number sits on it in `ink/primary`.**
The slider is a groove in the panel, not a mark drawn on it. Do not invert it.

**The nub reaches both ends, and there is never a stub of rail beyond it.** Each
rail is drawn only if there is room for one — when the nub arrives at an end,
that side closes on its own corner. This is the detail everyone gets wrong: an
inset that keeps the nub clear of the ends leaves a dead tail of rail sticking
out, and the control stops looking like it can reach its own maximum.

| measure | value |
|---|---|
| row height | 12 |
| nub corner | 3 |
| nub width | its number plus even padding, never under 24 |
| rail | 2 tall through the middle, at y 5 to 7 |
| rail end cap | radius 1, one pixel in from each edge |
| fillet | radius 2 |
| fillet cubic | offsets `1.10457, 0.8954` from the nub's corner |
| value text | 8 |

The fillet cubic is hand-fitted in the design, not derived. Copy it; do not
recompute it.

**The track fills the width of its row and its geometry never scales.** Draw the
path at real pixel width — the nub, corners and fillets stay 24, 3 and 2 however
wide the row gets. Stretching a fixed-width track skews the fillets and stops the
nub landing under the cursor.

Two behaviours belong to the control as much as the shape does: the **nub grows
with its number**, so 8 and 2400 are both centred in it; and the **pointer carries
the nub's centre**, so the value stays under the cursor while dragging. The travel
is short, so arrow keys do the fine work — one step, ten with shift.

### Ink flip

Dark ink down to Pale Concrete; Off White ink from Light Concrete down. Every
pairing in this document clears 8:1.

### Still not covered

Loading, empty and error states. Ask rather than inventing them.

## 6. Motion

**There is one movement in the system and this is it. Text never fades, never
crossfades and never slides sideways. It rolls.** A label turns over in place,
one character at a time, and the component's own shape is the mask.

It belongs to two things and to nothing else yet:

- a **button** whose label changes
- a **line of text** whose value changes

Everything about the movement is the same in both cases except how far a
character travels, and that is not a number you pick — see below.

### The mechanic

Each character sits in its own box holding two glyphs, the incoming one stacked
directly above the outgoing one. Both travel **upward** together: the outgoing
glyph leaves through the top edge as the incoming one arrives from beneath.

The characters do not move together. Each starts on its own beat, and the order
is **random, reshuffled on every roll**, so the same label never turns over the
same way twice. A left-to-right wipe is the obvious version of this and it is not
the one. Random is what stops the movement reading as a progress bar.

### The numbers

| | |
|---|---|
| duration | **280ms** a character |
| stagger | **20ms** between characters |
| order | **random**, reshuffled every roll |
| direction | **upward** |
| curve | **in and out** — `cubic-bezier(0.65, 0, 0.35, 1)` |

Total is `280 + (characters - 1) x 20`. A four-character label finishes in
340ms, a nineteen-character one in 640ms. Do not cap or scale the duration to
make long labels finish sooner; a long label taking longer is the point.

### The travel is the clip, not a value

This is the detail everyone gets wrong, and it is the reason a roll built by eye
looks broken.

A glyph does not move by "about a line". It moves by **exactly the height of
whatever is clipping it**, because it has to clear that edge completely.

| clip | travel | at size 12 |
|---|---|---|
| a button | the button's own height, `cap + 24` | **32.376** |
| a line of text | the line box, `size x 1.2` | **14.4** |

Both are derived from the type size and neither is a fixed pixel value. Anything
shorter leaves half a character stranded inside the shape at the end of the roll.

**The clip is the component's own outline, corner radius included** — `overflow:
hidden` on the button itself, not on a box inside it. A character leaving a
button disappears behind its rounded corner, which is what ties the movement to
the shape rather than to the text.

### The width turns with the glyph

Azeret is proportional. A box turning from `y` into `e` changes width, and that
width moves on **the same duration, the same delay and the same curve** as the
turn it belongs to. Skip it and the whole label jumps at the end of the roll.

Splitting a label into per-character boxes also drops kerning. At 12 with 0.02em
tracking that is invisible, which is the only reason this is allowed. Above 12 it
would not be — and no size above 12 has been agreed anyway, see section 3.

### When it rolls

| trigger | what happens |
|---|---|
| hover | the label rolls over into itself — the same word on the far side |
| press | the label rolls into the next word: Copy into Copied |
| a value changing | a line rolls into its new value with no interaction at all |
| disabled | never rolls |
| `prefers-reduced-motion` | the text changes without turning; no fade substitute |

Rolling over into itself on hover is not decoration. It is what makes the button
read as a material that can turn rather than as a message that has arrived.

A disabled control stays still because the movement means something happened,
and nothing did.

### The icon button

A button may carry an icon that is not shown at rest. On hover the button
**divides**: the body gives up the gap plus one circle of width, its right
corners go fully round, and a circle of exactly the button's height takes the
space it vacated, with a 12 icon inside it.

Measured off `Rayl / 1101:9741`. That frame is drawn at half scale, and every
value in it doubles onto a number the system already has — which is the check
that it belongs.

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

**The footprint never changes.** In the frame, idle is 63 wide and hover is
44 + 3 + 16, which is also 63. The body gives up exactly the gap plus the
circle. The button does not grow into the layout, it divides — which is what
lets one sit in a fixed row without pushing anything.

**The right corners go to half the height, not to double the radius.** At this
height, 8 doubled and half of 32.376 are the same number, so the two rules are
indistinguishable here and only one of them survives a taller button. Half the
height is the rule.

**The circle arrives as an iris.** It is full size and in place the whole time;
a circular clip opens on it from its own centre, `circle(0%)` to `circle(50%)`.
It is never scaled and never moves, so the icon inside stays at 12 throughout
and is revealed rather than grown.

Three other readings were built and rejected. The circle merely uncovered by the
shrinking body, and the circle sliding out from behind it, both leave nothing
happening at the moment the gap opens. Scaling it up from a point puts the icon
through sizes it was not drawn for, and section 7 says an icon is built for its
box and is not scaled below 12.

**Both surfaces carry the same fill and move together**, Black to Soft Black, on
the same duration and curve as everything else.

**The icon rolls up inside the circle**, travelling **32.376** — the circle's
height, because the circle is what clips it. That is the travel rule applied to
something that is not text. Nothing new had to be decided to animate it.

**There are two clips, not one.** The body clips its label; the circle clips its
icon; each element travels whichever one contains it. Getting this wrong fails
silently rather than loudly — the label simply appears twice, once in place and
once sitting below the button.

One value in the frame is off this document: the label is White `#FFFFFF` where
section 5 tabulates ink / inverse as Off White `#F7F7EF`. NOT DECIDED — ask
before using either.

### Reference implementation

Copy this. It is the version the numbers above were chosen on.

```css
:root {
  --size: 12px;
  --cap: calc(var(--size) * 0.698);   /* 8.376 — Azeret cap height */
  --row: calc(var(--size) * 1.2);     /* 14.4 — the line box */
  --dur: 280ms;
  --stagger: 20ms;
  --ease: cubic-bezier(0.65, 0, 0.35, 1);
}

/* the clip decides the travel */
.roll { --travel: var(--row); position: relative; display: flex;
        align-items: center; height: var(--cap); white-space: pre; }
.roll-row { height: var(--row); overflow: hidden;
            margin-block: calc((var(--cap) - var(--row)) / 2); }

.btn { --btn-h: calc(var(--cap) + 24px);
       height: var(--btn-h); padding: 0 12px; border-radius: 8px;
       display: inline-flex; align-items: center; justify-content: center;
       overflow: hidden; }              /* the mask is the button */
.btn .roll { --travel: var(--btn-h); }

.ch { position: relative; display: block; flex: 0 0 auto;
      height: var(--cap); width: 0;
      transition: width var(--dur) var(--ease) calc(var(--i) * var(--stagger)); }
.g  { position: absolute; top: 0; left: 0;
      height: var(--cap); line-height: var(--cap); text-box-trim: none;
      transition: transform var(--dur) var(--ease) calc(var(--i) * var(--stagger)); }

.g-cur { transform: translateY(0); }
.g-nxt { transform: translateY(var(--travel)); }        /* waiting below */
.is-rolled .g-cur { transform: translateY(calc(var(--travel) * -1)); }
.is-rolled .g-nxt { transform: translateY(0); }
.is-instant .g, .is-instant .ch { transition: none; }
```

The icon button, on top of that. `--w` is the label's measured width plus 24 of
padding, plus the gap, plus the circle.

```css
.ibtn { --h: calc(var(--cap) + 24px);      /* 32.376 */
        --round: calc(var(--h) / 2);       /* 16.188 — half the height */
        --gap: 6px;
        position: relative; width: var(--w); height: var(--h); }

.ibtn-body { position: absolute; left: 0; top: 0; z-index: 1;
             width: var(--w); height: var(--h);
             display: flex; align-items: center; justify-content: center;
             background: #1C1C1A; border-radius: 8px;
             overflow: hidden;             /* clips the label */
             transition: width var(--dur) var(--ease),
                         border-radius var(--dur) var(--ease),
                         background var(--dur) var(--ease); }
.ibtn-body .roll { --travel: var(--h); }

.ibtn-dot { position: absolute; right: 0; top: 0; z-index: 0;
            width: var(--h); height: var(--h);
            display: flex; align-items: center; justify-content: center;
            background: #1C1C1A; border-radius: 50%;
            overflow: hidden;              /* clips the icon */
            clip-path: circle(0% at 50% 50%);
            transition: background var(--dur) var(--ease),
                        clip-path var(--dur) var(--ease); }

.ibtn-icon { width: 12px; height: 12px; transform: translateY(var(--h));
             transition: transform var(--dur) var(--ease); }

.ibtn:hover .ibtn-body { width: calc(var(--w) - var(--h) - var(--gap));
                         border-radius: 8px var(--round) var(--round) 8px;
                         background: #262623; }
.ibtn:hover .ibtn-dot  { background: #262623;
                         clip-path: circle(50% at 50% 50%); }
.ibtn:hover .ibtn-icon { transform: translateY(0); }
```

The JavaScript does four things and no more:

1. Split the label into `.ch` boxes, each holding `.g-nxt` above `.g-cur`.
2. Measure every glyph's advance with a hidden span in the same font and
   tracking, and set each box's width from it. Do this after
   `document.fonts.ready` or every width will be the fallback face's.
3. Shuffle the indices, write them to `--i`, put the new text in `.g-nxt`, set
   each box's width to its new glyph, add `.is-rolled`.
4. After `280 + (characters - 1) x 20`, add `.is-instant`, copy `.g-nxt` into
   `.g-cur`, remove `.is-rolled`, force a reflow, remove `.is-instant`.

Step 4 is what makes hover work: rolling over into itself is the same code path
as rolling into a new word, with the same string on both sides.

### Still not decided

Nothing else in the system moves. The icon button is not a second movement — it
is the roll plus a clip opening, on the same numbers. There is no page
transition, no panel or sheet movement, no loading movement, no hover movement
on cards, and nothing at all on the gradients: those are flat art and stay flat.

Ask before adding a second movement. The value of having one is that it is one.

---

## 7. Icons

There are eighteen, and they are drawn, not licensed:

Bell · Bookmark · Broom · Cup · Document · Download · Folder · ID · Image ·
Minus · Organise · Pause · Play · Plus · Profile · Save · Stack · Upload

**Every icon is a 12 x 12 frame holding one filled path.** Filled, never stroked
— there is no line weight to match, which is why an icon lifted from a stroked
public set never sits right beside these. If you need one that does not exist,
ask; do not substitute.

Colour is `ink/primary`, so an icon follows the mode along with the text it sits
beside. Never paint an icon a fixed hex.

At 12 they read as solid shapes rather than line drawings. Do not scale one below
12, and if you scale up, scale the frame — the path is built for that box.

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
