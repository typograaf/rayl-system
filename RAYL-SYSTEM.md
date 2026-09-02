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
That is the most important rule on this page. Section 9 is the list of what is
missing — read it before you start, because it is shorter than finding out the
hard way. A guess that looks fine is worse
than a question, because it ships and then it spreads. Sections below marked
NOT DECIDED are real gaps, not omissions to fill in with your best judgement.

Rayl has both modes. Light is the default and the one the approved panels were
drawn in; dark is a full inversion of the same tokens, so a page built correctly
is correct in both without a second set of decisions. Set it with
`document.documentElement.dataset.theme = "dark"`, or leave it unset to follow
the viewer's own setting.

---

## 0. Build with the parts

One file carries the colour tokens, the type scale, the page ground and rhythm,
the layout primitives, the button, the reveal button, the option group, the
slider, the rolling line and the icons:

    https://typograaf.github.io/rayl-system/rayl.js

Put `class="rayl"` on the body and write markup:

    <body class="rayl"><div class="rayl-page">
      <section class="rayl-section">
        <span class="rayl-label">Aspect ratio</span>
        <div class="rayl-cluster">
          <button class="rayl-btn">4:5</button>
          <button class="rayl-btn" aria-pressed="true">5:4</button>
          <button class="rayl-btn" data-icon="Save">Save</button>
        </div>
        <div class="rayl-row"><span class="rayl-row-name">Count</span>
          <span class="rayl-slider" data-min="1" data-max="33" data-val="12" data-step="1"></span>
        </div>
      </section>
    </div></body>

**Components ship as code because behaviour cannot be described reliably.** Do
not restyle them and do not rebuild them from the descriptions further down —
several of those descriptions were wrong until the code was read.

**Layout ships as primitives for the same reason.** They carry the spacing
hierarchy in section 4, so it is not re-decided every time.

### Everything the file ships

Generated from the stylesheet. The build fails if a class exists in one and not
the other, so if a part is not in this table it is not in the system.

<!-- generated:inventory -->
**Page**

| class | what it is |
|---|---|
| `rayl-page` | the app or panel column: ground, 72 rhythm, 520 wide |
| `rayl-page is-wide` | the same at 960, for a page that has to breathe |
| `rayl-section` | a section; its gap is derived the same way |
| `rayl-stack` | a group; its gap is what its largest text asks for |
| `rayl-cluster` | parts of one control — gaps 6 |
| `rayl-grid` | an even grid of cards or swatches |
| `rayl-head` | a header or footer row: mark on the left, controls right |
| `rayl-card` | a panel that lifts off the ground |
| `rayl-row` | a named control on one line |
| `rayl-row-name` | the name in that row — 12, Medium, full ink, sentence case |
| `rayl-label` | the 8 uppercase section label, and nothing else |
| `rayl-hint` | a quiet line of explanation under a block |
| `rayl-gap-6` | set a group's gap when it has no heading to derive one |
| `rayl-gap-12` | the same, at 12 |
| `rayl-gap-24` | the same, at 24 |
| `rayl-gap-36` | the same, at 36 |
| `rayl-gap-48` | the same, at 48 |
| `rayl-gap-60` | the same, at 60 |
| `rayl-gap-72` | the same, at 72 |

**Wide layout**

| class | what it is |
|---|---|
| `rayl-hero` | the opening statement of a page |
| `rayl-band` | a full-width band; is-ink for one in ink |
| `rayl-split` | two columns; is-lead 3:2, is-three, is-centred |
| `rayl-measure` | running text stopped at 62 characters |
| `rayl-media` | a picture that follows the column beside it |

**Document**

| class | what it is |
|---|---|
| `rayl-doc` | on the body: the document ground rather than the app one |
| `rayl-doc-page` | the document column — blocks 12 apart |
| `rayl-chapter` | an 8 label on the ground, over the blocks under it |
| `rayl-block` | a 500 rail against a 1504 field |
| `rayl-rail` | the words of a block |
| `rayl-rail-foot` | pinned to the floor of a rail |
| `rayl-field` | the things of a block, stacked 12 apart |
| `rayl-field-row` | frames side by side inside a field |
| `rayl-frame` | one white box holding one thing; is-tall, is-wide |
| `rayl-frame-tag` | names a frame, turned on its side, costing no height |
| `rayl-container` | a plain white box for a header or footer |

**Controls**

| class | what it is |
|---|---|
| `rayl-btn` | the button; aria-pressed for on, data-icon for an icon |
| `rayl-ibtn` | the reveal button: the label contracts, a circle irises open |
| `rayl-seg` | the option group — exactly one on; is-joined, is-tight |
| `rayl-seg-opt` | one cell of it; is-on, is-third |
| `rayl-seg-name` | the name that opens a joined bar — never a disabled cell |
| `rayl-slider` | the track: data-min, data-max, data-val, data-step |
| `rayl-line` | a value on a line that rolls; data-label, data-swap |
| `rayl-icon` | an icon on its own; data-icon |
| `rayl-mark` | the logo mark, inline |

**Type**

| class | what it is |
|---|---|
| `rayl-96` | 96 / 110% / -4% |
| `rayl-72` | 72 / 110% / -3% |
| `rayl-48` | 48 / 110% / -3% |
| `rayl-36` | 36 / 110% / -2% |
| `rayl-24` | 24 / 115% / -1% |
| `rayl-18` | 18 / 130% / +1% |
| `rayl-12` | 12 / 140% / +2% |
| `rayl-serif` | Concrette, on a size class from 24 up |

Produced by `rayl.js` inside a component, never authored and never styled: `rayl-roll`, `rayl-ch`, `rayl-g`, `rayl-cur`, `rayl-nxt`, `rayl-reel`, `rayl-col`, `rayl-strip`, `rayl-digit`, `rayl-num`, `rayl-val`, `rayl-seg-fill`, `rayl-ibtn-body`, `rayl-ibtn-dot`, `rayl-ibtn-icon`.
<!-- /generated:inventory -->

Modifiers go on the class they belong to: `is-wide`, `is-lead`, `is-three`,
`is-centred`, `is-ink`, `is-joined`, `is-tight`, `is-third`, `is-on`, `is-tall`,
`is-square`. The rest — `is-rolled`, `is-instant`, `is-line`, `is-near`,
`is-open` — are set by `rayl.js` while something is moving.

**Pages do not ship.** A page's structure should come from what the page is for,
and there is no arrangement of sections that is right for every brief.

### The examples are evidence, not stencils

    examples/landing.html   the wide primitives, composed
    examples/panel.html     the panel primitives, composed
    examples/bench.html     every control, the scale and both colour sets

They exist to show that the parts go together and to be read when you are unsure
how. **Do not clone one and change the words** — you would inherit a structure
that was built for a different problem, and the result would be a page shaped
like a rostering pitch no matter what it is actually about.

Consistency comes from the tokens, the type scale, the spacing hierarchy and the
components. It does not come from every page having the same skeleton.

A button's label is its own text; `data-label` is only needed when the label
should differ from it. An active control takes `aria-pressed="true"`. Dark mode
is `document.documentElement.dataset.theme = "dark"`; leave it unset to follow
the viewer's own setting.

The rest of this document exists for everything the file does not cover, and so a
person can check what the file does. Where the two disagree, **the file wins** —
and above both, the approved Figma frames.

### Where the system is built

Everything is generated from `src/` by `python3 src/build.py`:

    src/core.css       tokens, type, page, layout, components
    src/components.js  the label roll, the odometer reel, the icons
    src/slider.js      the track
    src/icons.json     the eighteen icons
    src/parts.py       the palette, the tokens, the scale and the inventory, once
    src/site.py        the bench and the dashboard, from parts.py
    src/doc.py         writes the fact tables into this file, and checks them
    ->  rayl.js, index.html, examples/bench.html, and dist/ copies with it inlined

Edit `src/`. Never edit `rayl.js` — it is output, and it will be overwritten.

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
  bar's height. The guidelines board states this as one third of the total
  lockup height, which would be 64. The file is the artwork you place and you
  never rebuild the lockup, so 69 stands; the difference is a note, not a
  decision to make.
- The registered symbol sits on the baseline, **12** after the l.
- The full lockup is 644 x 191. The extra height below the baseline is the y's
  descender.

### Colour

The logo is `#1C1C1A`. See section 2 — this is currently the only colour in the
system that comes from the brand itself rather than from a build.

Place the logo in `#1C1C1A` on a light background and in White `#FFFFFF` on a
dark one — the same as text. The logo takes `ink/primary`, so it flips wherever
the type flips and needs no rule of its own.

### Clear space

From the guidelines board, verbatim:

> When using this icon independently, ensure there is a clear space equal to half
> the height and width of the logo around it.

> When creating the lockup, make sure the cap height matches that of the icon.
> The spacing should be one-third of the total lockup height, and maintain a
> clear area equal to the logo's height.

So the **icon alone gets half its own height on every side** — 75 at the mark's
drawn size of 150 — and the **lockup gets its own full height on every side**.
Both scale with the logo rather than with the page, so there is nothing to
recompute when it is placed larger or smaller.

### Minimum size

There is none.

### Never

- Redraw or trace the mark.
- Change the proportions between the three bodies, or the gap between them.
- Make the bar's ends match.
- Set "Rayl" in a typeface as a substitute for the lockup.
- Rotate, skew, outline, add a shadow to, or recolour the mark.
- Place the mark on a busy background where its silhouette breaks up.

---

## 2. Colour

The palette is fifteen flat colours and two gradients. **The authority is the
approved frame `1083:9025`**, not the `V2/` paint styles in the file — those are
an earlier round and still hold the pre-revision values (`#CFCFC4` for Porcelain,
`#F7F7F2` for Off White, `#696963` for Light Concrete). Where a style and that
frame disagree, the frame wins and the style is stale.

The names are materials, not greys, and that is deliberate. The palette is drawn
from the professional catering world — the look of porcelain and concrete, rigid
materials given fluid, organic movement.

<!-- generated:palette -->
| name | hex | RGB | L\* |
|---|---|---|---|
| White | `#FFFFFF` | 255 255 255 | 100.0 |
| Paper | `#FBFBF6` | 251 251 246 | 98.5 |
| Off White | `#F7F7EF` | 247 247 239 | 97.1 |
| Bone | `#EDEDDF` | 237 237 223 | 93.3 |
| Dark Off-White | `#E2E2D3` | 226 226 211 | 89.5 |
| Porcelain | `#CFCFC1` | 207 207 193 | 82.8 |
| Mid Porcelain | `#C3C3B6` | 195 195 182 | 78.5 |
| Dark Porcelain | `#ACACA0` | 172 172 160 | 70.1 |
| Pale Concrete | `#89897F` | 137 137 127 | 56.9 |
| Light Concrete | `#696961` | 105 105 97 | 44.2 |
| Dark Concrete | `#55554E` | 85 85 78 | 35.9 |
| Off-Black | `#373732` | 55 55 50 | 22.9 |
| Soft Black | `#262623` | 38 38 35 | 15.2 |
| Black | `#1C1C1A` | 28 28 26 | 10.2 |
| Deep Black | `#11110F` | 17 17 15 | 5.0 |

Fourteen of these are the approved system at `1083:9025`. **Deep Black**
`#11110F` is the fifteenth and is not on that frame — it was added as the
ground for dark mode, and it is the one colour in the table waiting on a
decision.
<!-- /generated:palette -->

Every colour sits on one hue. In OKLCh they fall between 106.5 and 106.9 — a
spread of less than half a degree. Only White is off it, because at maximum
lightness there is no room for any chroma at all.

Chroma follows a single arc: rising out of white, peaking at Dark Off-White,
falling away to black, never reversing. A new colour belongs to this palette
only if it sits on that arc.

**Gradients.** Both run top to bottom with the first stop at 0.349%.

- **Porcelain Gradient** — `#CFCFC1` to `#F7F7EF`
- **Concrete Gradient** — `#696961` to `#CFCFC1`

These are the `V2/` gradients re-struck on the revised palette. The styles in the
file still hold the old stops, and a gradient running to a colour the palette no
longer contains is the one place those old values would have survived.

Note the swatch in the file labels the second one "Paper Gradient" while its
style is named "Concrete Gradient". Use the style name.

### The tokens

Nothing in an interface names a colour from the table above. **It names a job**,
and the job resolves to a different step in each mode. Change one of these and it
changes everywhere at once, which is the whole reason they exist. Locked from the
approved panels at `1083:9024`.

<!-- generated:tokens -->
| token | light | dark | job |
|---|---|---|---|
| `surface/ground` | White | Soft Black | The panel or page itself |
| `surface/idle` | Paper | Deep Black | A control at rest |
| `surface/idle-hover` | Off White | Black | Rest control, pointer over it |
| `surface/idle-pressed` | Bone | Off-Black | Rest control, being pressed |
| `surface/active` | Bone | Dark Concrete | A control that is on |
| `surface/active-hover` | Dark Off-White | Light Concrete | On control, pointer over it |
| `surface/active-pressed` | Porcelain | Off-Black | On control, being pressed |
| `ink/primary` | Black | White | All text and icons |
| `ink/on-active` | Black | White | Text on an active control |
| `ink/disabled` | Dark Porcelain | Light Concrete | Unavailable text |
| `line/track` | Dark Porcelain | Pale Concrete | Slider rails and small marks |
| `fill/strong` | Black | White | A high-emphasis button |
| `fill/strong-hover` | Soft Black | Off White | …with the pointer over it |
| `ink/on-strong` | White | Soft Black | Text on one |
<!-- /generated:tokens -->

Four more are not on that frame and are explained where they are used:
`--rayl-seg-press`, an unselected option cell being pressed (section 6), and the
document grounds `--rayl-doc-ground`, `--rayl-doc-container` and
`--rayl-doc-tag` (section 4).

**Never write a hex in a build.** Every colour above resolves through a token, so
a page that names tokens is right in both modes and a page that names hexes is
right in neither.

### Ink and ground

Ink is `#1C1C1A`. Never `#000000` — the palette has no pure black and the logo
is not drawn in one.

The ground is a token, not a colour you pick, and which one depends on what you
are building:

- **An app or a panel** grounds on `surface/ground` — White on light, Soft Black
  on dark — with its controls on `surface/idle` above it.
- **A document** grounds on Off White with White containers on it, which is what
  section 4 describes and what the guidelines board does.

### What existing builds get wrong

Every Rayl build in code has drifted from these values. If you are working in one,
the file is right and the code is wrong:

| build | uses | should be |
|---|---|---|
| rayl-ui paper | `#F0F0E5` | `#F7F7EF` Off White |
| rayl-ui sunk | `#E8E8D8` | `#E2E2D3` Dark Off-White |
| rayl-ui ink | `#000000` | `#1C1C1A` Black |
| rayl-screen porcelain | `#CECEC5` | `#CFCFC1` Porcelain |
| rayl-screen black | `#3F3F3B` | `#55554E` Dark Concrete |
| rayl-screen grey dark | `#696963` | `#696961` Light Concrete |

### What the palette does not yet cover

Two things are genuinely missing and two are known irregularities rather than
gaps. Ask rather than filling any of them in.

**There is no green.** The chapter's own prose promises "subtle touches of an
organic green" and the app build carries a `#D8DEB9`; neither is the brand. The
palette is the fifteen below and nothing else.

- **White is the only colour off the system.** Every other colour sits between
  hue 106.5 and 106.9. White is achromatic, so in a warm palette it reads cold.
  It also cannot carry the hue: at maximum lightness there is no room for any
  chroma at all. Keeping it pure is defensible — it is the true white, and Off
  White already does the warm job — but it is a deliberate exception, not a
  member.
- **Dark Off-White is more saturated than both its neighbours.** Its chroma is
  7.8 where Off White is 2.5 and Porcelain 5.8; the curve would put it near 4.2.
  It is the one colour that looks slightly more yellow-green than the set.
- **Semantic colours.** Nothing means error, warning or success. Because the
  whole palette sits on a single hue, any of these is the first hue break in the
  brand — a real decision, not a detail. Martijn is adding them. Until they
  arrive, do not invent one and do not draft a palette colour in to stand for a
  state.

## 3. Typography

There are two: **Azeret**, which sets nearly everything, and **Concrette**, a
serif for titles from 24 up. Both ship with this system in `assets/fonts/`.

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

Seven, and no others.

<!-- generated:scale -->
| size | leading | tracking, Azeret | tracking, Concrette |
|---|---|---|---|
| 96 | 110% | −4% | −6% |
| 72 | 110% | −3% | −5% |
| 48 | 110% | −3% | −4% |
| 36 | 110% | −2% | −4% |
| 24 | 115% | −1% | −3% |
| 18 | 130% | +1% | — |
| 12 | 140% | +2% | — |
| 8 | — | +8% uppercase | — |
<!-- /generated:scale -->

**Leading opens as the size drops and tracking tightens as it grows.** The two
move against each other, and that is what makes a 96 headline and a 12 caption
read as one voice rather than two. Do not set a size without its own leading and
tracking — they are one decision, not three.

`.rayl-96` `.rayl-72` `.rayl-48` `.rayl-36` `.rayl-24` `.rayl-18` `.rayl-12`
carry all three. `.rayl-label` is the 8.

Note 12 running text sets at **140%**, not the tight line the controls use — a
control's label sits in a fixed cap-height box where leading does not apply.

### Two typefaces

**Azeret is the workhorse.** It sets the interface, running text, captions and
labels, and it sets headlines and titles perfectly well too. If you are unsure
which face to use, it is Azeret. It is the only face at 18 and 12.

**Concrette is for titles and subheads, and nothing else.** It is a serif drawn
for display, so it starts at 24 and goes up. Never body copy, never a caption,
never a control. Using it below 24 or for running text is the way to make a page
stop looking like Rayl.

So a headline may be either — that is a real choice each time, not a default.
Everything under it is Azeret.

Concrette sets **two** percent tighter than Azeret at every size they share
except **48**, which is one. Azeret also stalls at −3% across both 72 and 48
rather than stepping. Both were put side by side on the board and chosen; if
either looks like a typo in review, it is not. Add
`.rayl-serif` to a size class from 24 upward; below that the class is ignored on
purpose and the text stays Azeret.

Both are TRIAL cuts and both need licensing before anything public.

**The two faces do not share a cap height.** Azeret is 0.698 of its size,
Concrette S is 0.708 — the serif is 1.4% taller in the cap. Everything is
trimmed cap to baseline, so a Concrette line leaves slightly less white between
its lines at the same size and leading. The `0.698` fallback line-height in
`core.css` is **Azeret's number**, applied to both. Close enough to keep, and
worth knowing whose it is.

**Concrette is an optical-size family, and the system ships the small cut.** S,
M and XL share a cap height and narrow as they go up: at 96, "Rostering" measures
485 / 469 / 454px. S is drawn for small text and XL for display, and every
Concrette headline here is set in S. That is a choice, not an oversight — the
guidelines never mention the axis exists. Ask before changing the file.

### A control tracks 0

The scale's tracking is for **running text**. A control is set at **0**.

Every 12 label in the approved panel — button, option, joined-bar name, row name
— is Azeret Medium at 12 with no tracking at all, measured at `997:7659`. The
`+2%` the scale gives 12 belongs to a paragraph, where it opens small text up;
on a button it pushes a short word off its own centre.

So `rayl-12` tracks +2% and `rayl-btn`, `rayl-seg`, `rayl-row` and the slider
readout track 0. If a control looks subtly wrong beside the design, this is
usually why.

### Weights

**500, everywhere.** One weight for the whole system — headlines, running text,
captions, labels and controls alike. 400 and 600 appear in older builds and are
not part of Rayl; only the Medium face ships.

So there is no bold. `strong` and `b` inherit 500 rather than resolving to 700,
because a 700 request against a single-weight family makes the browser
synthesise one by smearing the outline, which is a drawn weight that Displaay
never drew. Emphasis comes from what the sentence says, or from a size.

---

## 4. Spacing and layout

The scale is **6, 12, 24, 36, 48, 60, 72**. It steps by 12 rather than
doubling. 36 and 60 are full members, not exceptions: every gap that read
correctly on the board turned out to be a multiple of 12, and two of them had
nowhere to land.

**12 is still on the scale and nothing currently uses it.** If the
label-and-line case does not want it either, it leaves — that is open.

### What each one means

**A gap is set by the largest text in the group, not by the kind of container
it sits in.** That is the change: a group led by a 36 gaps 36 throughout, a group
led by a 48 gaps 48 throughout, and the heading, its body copy and its buttons
are all the same distance apart. See "Space under a heading" below for the
mapping, which is now the group's gap rather than a margin under a heading.

Where there is no text to derive from, the number still says how related two
things are:

| gap | between |
|---|---|
| **6** | parts of one control — buttons in a cluster, a stepper's digits |
| **12** | nothing, currently — see the scale above |
| **24** | a group led by nothing larger than a 24 |
| **36** | a group led by a 36; three columns of a split |
| **48** | a group led by a 48 or a 72; two columns of a split |
| **60** | a group led by a 96 |
| **72** | — |
| **96** | sections of a page |

Set one explicitly with `rayl-gap-6` … `rayl-gap-72` **on the group**. That is
the escape hatch and the only way to set a gap that has no heading to derive
from.

**A container pads one step below the gap it sits in — UNDER REVIEW.** It held
when the page ran 72 and a band padded 48. The page runs 96 now and the band
still pads 48, where the rule as written would say 72. Do not apply it to
anything new until it is settled.

The fixed ones: `rayl-cluster` gaps 6, `rayl-split` 48, `rayl-band` 36,
`rayl-page` 96. `rayl-grid`, `rayl-card` and `rayl-head` were never tested on the
board and are unchanged.

### Space under a heading

A flat gap cannot work across a range from 8 to 96. Twenty-four reads generous
under a label and cramped under a 72 headline, and a page built on one number for
everything looks uneven however carefully that number was chosen.

| heading | the group's gap |
|---|---|
| 96 | 60 |
| 72, 48 | 48 |
| 36 | 36 |
| 24, 18 | 24 |

**The number covers the whole group, not just the space under the heading.** It
was built as a heading, its body copy and its action buttons in one auto-layout
stack, and the same number sits between all three. So this is the group's gap,
and `rayl-stack`, `rayl-section` and `rayl-hero` derive it from the largest text
they contain — nobody sets it at the call site.

**This is a designed mapping, not a formula.** Half the size was tried first and
is visibly too tight at the bottom. Ratios that look right at 72 are wrong at 24,
which is why the table is the rule.

There is still a top-up margin under each heading, but only as a safety net for
one dropped into a container carrying a smaller gap. In normal use every one of
them resolves to 0.

**18 and 24 now take the same 24**, so at those two sizes a heading no longer
gets more room than the lines beneath it. The whole group shares one number, and
the hierarchy is carried by the size of the type rather than by the gaps around
it.

### Dividing a document

A document is not a panel. The guidelines board has its own layout language, and
anything explaining the system — this repo's bench and dashboard included — is
built in it. Measured at `966:99`:

| part | what |
|---|---|
| the ground | Off White, 12 of padding, everything on it **12** apart |
| a chapter | an **8** label on the ground itself: 24 of padding, no fill |
| a block | two columns — a **500** rail against a **1504** field |
| the rail | White, radius **24**, 48 of padding, its content 48 apart |
| a frame | White, radius **24**, its content centred with room around it |
| a showcase frame | the same, padding **144** — three times the ordinary 48 |

**All the words live in the rail. The field holds nothing but the things
themselves.** That single split is what makes the board scannable: you read down
the left edge to find the part you want, and never have to read to see one.

**Frames are sized to what they hold, not shared out equally.** The spacing
chapter runs 403, 341 and 736 across one row. A frame is also far bigger than
its content — that air is the board's character, and tightening it is the
fastest way to make a page stop looking like Rayl.

**A frame is named by a tag turned on its side**, 8 uppercase in Dark Off-White
down its left edge, so naming it costs no height and never competes with the
thing it names.

The chapter label sits on the ground rather than in a box, which is what makes
it read as a heading over the blocks instead of another block.

```html
<body class="rayl rayl-doc"><div class="rayl-doc-page">
  <h2 class="rayl-chapter">Controls</h2>
  <div class="rayl-block">
    <div class="rayl-rail"><h3 class="rayl-24">Buttons</h3></div>
    <div class="rayl-field">
      <div class="rayl-frame is-tall">
        <span class="rayl-frame-tag">On each ground</span>
        ...
      </div>
      <div class="rayl-field-row"> ...two frames side by side... </div>
    </div>
  </div>
</div></body>
```

**A document is an overview, not an essay.** The rail names the thing and the
field shows it. Explanation lives here, in this file — a bench that explains
itself stops being scannable, and the explanation goes stale where nobody is
looking at it.

### No strokes

**Rayl has no border vocabulary.** Nothing in the system draws a line around
anything: not a card, not a swatch, not a table row, not a specimen. Look at the
panel — every boundary in it is made by a change of ground, never by an outline.

So when something needs to be distinguishable, **change what is behind it**. A
white swatch is made visible by the ground it sits on, not by a hairline drawn
round it. A table's rows are separated by their padding, not by rules. Reaching
for a 1px line is the quickest way to make a Rayl page stop looking like one, and
it is the first thing that creeps in when someone is solving a legibility problem
in a hurry.

The one exception is the **focus ring**, which is not decoration — it is how
somebody navigating by keyboard knows where they are.

### Pictures follow the column beside them

A media block in a split takes the height of the row rather than imposing one.
A fixed aspect ratio makes the section as tall as the picture wants, not as tall
as the content needs, and the text column ends up floating in a void beside it.
`rayl-media` in a `rayl-split` stretches; on its own it keeps its ratio.

### Two values outside the scale

**36** is a page margin in the app screen and **8** is the corner radius on every
control. Both are in heavy use and neither is on the scale. Until that is settled,
do not introduce either into new work and do not "fix" them where they already
are.

Corner radius grows with the box, and the board's own rounding demo gives the
ladder: **4**, **12**, **24**, **48**. In practice a control is **8**, a
container is **24**, and anything meant to read as fully round takes **half its
height**. The 8 sits between the board's 4 and 12 because it is measured off the
approved UI rather than the demo; where the two disagree, the UI wins.

### Established figures

- The tool panel is a **300** column with **48** of padding and **48** between
  its groups.
- A reading column stops at **62 characters** — `rayl-measure`.
- A headline's measure is set in `ch` **on the headline itself**, never on a
  container: `ch` resolves against the element's own font-size, so a measure on a
  wrapper that inherits 12 gives a column a few words wide.
- Narrow viewports **step down the scale, never off it**: 96 becomes 48, 72 and
  48 become 36, 36 becomes 24 — each with that size's own leading and tracking.

## 5. Interactive states

**No state has its own colour.** Every hover and pressed value is a colour
already in the palette. That is why the ladder has fourteen steps rather than
ten — Paper, Bone, Mid Porcelain and Soft Black exist so that the states have
somewhere to land.

**Use the tokens in section 2 first.** They are what the shipped controls
actually resolve to, and they cover every state a control has. The rule below is
for deriving a state on a ground the tokens do not name — a swatch, a custom
surface, a piece of art.

**The rule**, from `1083:9025`. Hover is the palette colour nearest **5 L\***
away; pressed is the one nearest **10 L\***. Light grounds move down the ladder,
dark fills move up, because they have nowhere darker to go.

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

**Where the rule and the tokens disagree — NOT DECIDED.** The ladder gives a
Paper base a hover of Bone, five steps away. `surface/idle-hover` is Off White,
one step away. The panel's own tokens are the gentler of the two, and both are
approved sources. The tokens are what ships, so build with them; but this is a
real disagreement and not a rounding error, and it wants a decision rather than
a preference. Section 6's option group ran into the consequence: the ladder's
answer for a pressed cell is the same colour selection is painted in.

Every other role a state needs — disabled ink, the track, the strong fill and
the ink on it — is a token in section 2, not a colour to look up here.

### The label roll

A button's label changes character by character rather than all at once: each
character has a current glyph and a next one stacked above it, and the pair
travels **upward through the button's own height** — 32.376, which is the cap
height plus its 24 of padding.

| setting | value |
|---|---|
| a character's travel | 280ms |
| one character to the next | 20ms |
| easing | `cubic-bezier(0.65,0,0.35,1)` — in and out |
| order | random, reshuffled on every roll |
| direction | upward |
| the clip | the button's own shape |

**The whole roll finishes in 400ms whatever the label says.** A roll takes
`duration + (characters - 1) x stagger`, which grows without limit — a nineteen
character label at a flat 20ms apart runs 640ms, more than twice the button's own
280ms, and the text is still arriving long after the shape has settled. So the
stagger holds at 20ms while it fits and compresses beyond that: four characters
land in 340ms, eleven in 400ms, twenty-six in 400ms. Short labels keep the full
stagger; long ones simply arrive together.

Only characters that actually change roll. A button hovering rolls its whole
label — that is the effect — but a label going from one word to a similar one
moves only what differs. `turn()` forces every character; `to()` moves what
changed.

**A number is not a label.** A readout being dragged uses the reel in the next
section, never this.

### The counter reel

A number that changes continuously — a slider's value, a live count — is a reel,
not a roll. Each decimal place is a strip of digits whose position is a
continuous function of the value, so it spins as fast as the value changes and
lands on a whole number when the value does. Nothing is skipped and nothing
queues.

It is an odometer, not ten loose reels: **the units column follows the value
exactly, and every column above it holds still until the one below is about to
wrap**, then carries across the last tenth. Without that carry the higher digits
sit permanently between two numerals and cannot be read while moving.

Digits are set `tabular-nums` so every column is one width, and a column with
nothing in it yet collapses to zero width — 5 reads as `5`, not `005`.

### The press

Every button sinks to **0.96** while held: 90ms down, 220ms back. The two
directions are deliberately unequal — matched timing reads as a wobble, a quick
press and a slower release reads as a button.

### Sliders

**A Rayl slider is one shape.** A rounded nub carries the value and a 2px rail
runs *out* of it — not butted against it, out of it, through a concave fillet on
each side. That fillet is the whole character of the control, and it is the one
thing a rail-plus-a-box in CSS cannot do, because the join is a curve belonging
to neither piece. The path has to be generated.

**Colour: the shape is `surface/idle`, the number sits on it in `ink/primary`.**
The slider is a groove in the panel, not a mark drawn on it. Do not invert it.

**The nub takes `surface/idle-hover` the moment it is engaged** — and engaged
starts where the magnetism starts, not where the pointer lands. The nub already
leans toward a cursor that is still some way off; if the colour waited for
contact, the control would be reaching for you while insisting it had not been
touched. Dragging holds the same colour, and so does keyboard
focus — but only keyboard focus. A click focuses the control too, and a pointer
already says where it is; lighting up for that leaves the nub looking held down
long after it was let go. Releasing a drag also re-reads where the pointer
actually is, because pointer capture routes every move to the control including
the ones far outside it, so by the end of a drag the hover state it has been
keeping is stale.

**A row names its control in ordinary type**, not in the 8 label: 12, Medium,
`ink/primary`, sentence case. The 8 label names a *section*; a row names a thing
you are about to touch, and the panel sets those the same size as the button
beside them. Measured at `997:7711` — the row is 264 by 32.376 with the name and
the control 12 apart, and the name column is fixed so every control in a stack
lines up.

```html
<div class="rayl-row">
  <span class="rayl-row-name">Count</span>
  <span class="rayl-slider" data-min="1" data-max="33" data-val="12" data-step="1"></span>
</div>
```

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
| value text | 8 |

**The fillet is an arc in the shipped control, not the design's cubic.** The
design hand-fits a cubic with offsets `1.10457, 0.8954` from the nub's corner,
which is exact for a nub of exactly 12. The nub grows on hover, so `rayl.js`
draws the join as an arc instead: at rest it is the same quarter-circle of radius
2, and it stays tangent to both the nub and the rail at every size. Use the
cubic when you are drawing a static one at 12; use the shipped control for
anything interactive.

**The track fills the width of its row and its geometry never scales.** Draw the
path at real pixel width — the nub, corners and fillets stay 24, 3 and 2 however
wide the row gets. Stretching a fixed-width track skews the fillets and stops the
nub landing under the cursor.

Two behaviours belong to the control as much as the shape does: the **nub grows
with its number**, so 8 and 2400 are both centred in it; and the **pointer carries
the nub's centre**, so the value stays under the cursor while dragging. The travel
is short, so arrow keys do the fine work — one step, ten with shift.

### Ink flip

Dark ink down to Pale Concrete; Off White ink from Light Concrete down — the flip
happens between L\* 56.9 and 44.2 because that is where each stops winning.

The pairings this puts on a page clear 4.5:1, which is what body text needs. They
do not all clear 7:1: Off White on Pale Concrete is about 3.6:1, so **that pair is
for a swatch label or a large size, never for running text**. If you need small
text on a mid tone, go two steps rather than one.

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

### The roll on a line

**The roll is not a button feature.** Where the thing that changed is a value on
a line — an address, a count, a status — the same movement runs on the line
itself. Same 280ms, same curve, same random order.

One thing changes: **the clip is the line box, not a shape.** A button clips its
label to its own outline, so the travel is 32.376. A line has no outline, so it
clips to its row and the travel is **14.4** — the line box at 12. A descender
then survives the trip instead of being cut in half by a box that was drawn for
something else.

The row is taller than the cap it sits on, so the clip is pulled back by
`(cap - row) / 2` on both edges. **A line that rolls must not move the line it
sits in**, and without that term every rolling row would nudge its neighbours.

```html
<div class="rayl-row">
  <span class="rayl-label">Email</span>
  <span class="rayl-line" id="line-email"
        data-label="contact@rayl.com" data-swap="Copied to clipboard"></span>
</div>
<button class="rayl-btn" data-rolls="line-email" data-swap="Copied">Copy</button>
```

`data-rolls` names the line a control hands its new value to. The line returns
on its own after 2400ms, because a status is a moment and the address underneath
it is what the row is actually for. To drive it from a value rather than a
click, call `el.__rayl.to("the new text")`.

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

### The option group

A row of cells where exactly one is on, and selection moves between them: aspect
ratio, a numbered set, a mode. It is not a row of buttons that happen to sit next
to each other — the group owns the selection, so turning one on turns the last
one off.

**Two beats, and in each one a surface and its type move at the same instant.**

| | ground | label |
|---|---|---|
| hover | steps one rung, `surface/idle` to `surface/idle-hover` | turns over |
| click | a circle opens from the centre of the cell | turns over again |

The hover does not try to be a small preview of the click. It is its own
complete moment, which is what stops the pair reading as two unrelated effects.
Nothing appears on hover — no mark, no dot — so nothing can land in the wrong
place when the pointer moves on.

**The circle is the selection.** One element, filled `surface/active`, clipped
from `circle(0)` to `circle(70.71%)`. 70.71% is exactly half the diagonal of a
square, so the circle finishes covering any cell it is given however wide it is.
One clip on one fill: no second element, no new colour, no second duration.

**Hover takes the rung above the one section 5 would give it.** The ladder says
a control at rest hovers to `surface/idle-hover` and presses to
`surface/idle-pressed`. In light, `surface/idle-pressed` is Bone — which is also
what selection is painted in, so a press would flash as a selection and the
circle would then open Bone on Bone. Both states step one further out. In dark
there is no such collision, and the token that is right there is
`surface/idle-pressed` — so the press is the one value in the system that is
declared per theme, as `--rayl-seg-press`.

**A selected cell still hovers and presses**, but on its fill rather than its
ground: `surface/active-hover`, then `surface/active-pressed`.

**Layout.** Cells are half-width by default, so five of them fall two and three;
`is-third` makes a cell one of three. `is-joined` on the group closes the gaps
into a single bar and moves the radius onto the group. `is-tight`
sizes the whole group to its own content instead of the row, which is what a
header toggle or an option row inside running layout wants.

**A row of `rayl-btn` with `aria-pressed` is not an option group.** It looks
like one and behaves like a set of unrelated toggles: nothing turns the last one
off, and the selection arrives without the circle. Wherever exactly one of a set
is on, it is `rayl-seg`.

**Keyboard.** The group is one tab stop, on whatever is currently on. Arrow keys
in either axis move the selection and wrap; disabled cells are skipped. Focus
alone does not turn a label — the arrow key selects in the same beat, and two
turns fired back to back read as a stutter. The turn belongs to the selection.

**A joined bar usually opens with a name.** Bisque, Sheen and Chalk in the
approved panel each label a row of 1 / 2 / 3. That first cell is a
`rayl-seg-name`, not an option: full `ink/primary`, the group's own ground, and
no hover, focus or selection. Greying it would say it is unavailable, which is
the opposite of what it is — the only cell in the bar that is not a choice.

Measured at `1083:8907`: the name cell is 72 against a number cell's 20, which
is the same 18:5 the group already uses, so nothing new had to be decided.

Selecting fires `rayl:change` on the group, carrying `value` and `index`.

```html
<div class="rayl-seg is-joined">
  <span class="rayl-seg-name">Bisque</span>
  <button class="rayl-seg-opt">1</button>
  <button class="rayl-seg-opt is-on">2</button>
  <button class="rayl-seg-opt">3</button>
</div>
```

```html
<div class="rayl-seg">
  <button class="rayl-seg-opt is-on">4:5</button>
  <button class="rayl-seg-opt">5:4</button>
  <button class="rayl-seg-opt is-third">1:1</button>
  <button class="rayl-seg-opt is-third">16:9</button>
  <button class="rayl-seg-opt is-third">9:16</button>
</div>
```

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

---

## 9. What the system does not have

Every gap in one place, because scattering them is how they get invented instead
of asked about. **Nothing on this page is a licence to guess.** If a brief needs
one of these, say which one and stop.

### Controls nobody has designed

The system has a button, a reveal button, an option group, a slider, a rolling
line and eighteen icons. It has no:

| missing | what a brief will ask for |
|---|---|
| **text and number input** | any form, any name field, any numeric entry |
| **select** | a list too long for an option group |
| **checkbox and toggle** | a setting that is on or off on its own |
| **collapsible section** | the approved panel already draws one — every section label carries a `–` at its right and nothing implements it |
| **modal, sheet, drawer** | a confirm, an export dialog, a settings panel |
| **tooltip and popover** | a label on an icon button |
| **tabs** | more than one view in a panel |
| **table** | any list of records; the bench fakes one with local CSS |
| **toast** | anything reporting that a background job finished |
| **progress** | an export, an upload, a render |
| **menu** | a right-click or an overflow |
| **badge, chip, tag** | a count, a status, a filter |
| **avatar** | anybody's face |
| **scrollbar** | every panel taller than its frame |
| **app shell** | a control panel beside a canvas — the shape `rayl-stack` actually is, and the only layout the system cannot express |

The first four are the ones that block real work. **They are one design problem,
not four:** in a system with no strokes, a control that accepts input has to read
as enterable through a change of ground alone. That decision has to be made once,
by you, and then all four follow.

### States nobody has defined

Loading, empty, error and skeleton. A tool without them is a demo.

### Colour nobody has decided

- **Semantic colour** — nothing means error, warning or success. The palette is
  one hue, so any of these is the brand's first hue break.
- **Deep Black `#11110F`** — it is in the code as the dark-mode ground and it is
  not on `1083:9025`. Either it joins the palette or dark mode grounds on
  something that is already in it.
- **Hover: the ladder or the token.** Section 5. Two approved sources give a
  Paper base two different hovers, five steps apart and one step apart.

### Numbers off the scale

**36** and **8** are in heavy use and on no scale. **144** and **96** are the
document's showcase paddings and are 3x and 2x the 48 rather than members. Say
whether the scale gains multiples or those values change.

### The Rayl look

Section 8. The layered gradient treatment is what makes something read as Rayl
rather than as a competent light-mode app, and there is no reference for it in
this repo. This is the largest single gap in the system: everything else here
makes a build *correct*, and that makes it *Rayl*.
