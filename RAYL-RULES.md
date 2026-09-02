# The Rayl design system — the rules

Everything you must follow, and nothing else. No history, no measurements, no
argument for why a number is what it is: that is
[RAYL-WHY.md](https://typograaf.github.io/rayl-system/RAYL-WHY.md), and it is
worth reading before you decide a rule here looks wrong.

Everything still undecided is
[RAYL-OPEN.md](https://typograaf.github.io/rayl-system/RAYL-OPEN.md). Read it
before you start. It is shorter than finding out the hard way.

---

## 0. How to use this

**This document is the authority.** The approved Figma frames are the authority
for changing *it*, and the shipped app is where a change is proved — but you can
read neither of those, so for anything you build, this page and the file it
ships are what you follow. Where this document and `rayl.js` disagree, the file
wins and the document is a bug; say so.

**Follow every value exactly.** Do not round it, do not pick something near it,
do not substitute a colour that looks similar.

**Where the system does not cover something, say so and ask.** That is the most
important rule on this page. A guess that looks fine is worse than a question,
because it ships and then it spreads.

### When you cannot stop and ask

Some of you are answering in one shot and cannot come back with a question. Then:

1. **Say which part is missing, in one line, before anything else.**
2. Build it — but mark every invented part with `data-rayl-provisional="what it
   is"`, and list all of them at the end under **Provisional — not Rayl yet**.
3. Never restyle a shipped `rayl-*` component to make it fit. Never invent a
   colour, a size, a gap, a radius or a second movement. Build the missing part
   out of values that already exist.

An invention you can see is a decision waiting to be made. An invention you
cannot see becomes the standard.

### Verify before you answer

Check your output against these, and say which ones you checked:

- no hex colours anywhere, only tokens
- no border, outline or hairline except the focus ring
- every gap, margin and padding on the spacing scale
- every font-size on the type scale, every weight 500
- no `rayl-serif` below 24
- no `rayl-*` class restyled, overridden or rebuilt
- one movement only, and nothing animated that the system does not animate
- every provisional part marked and listed

`rayl-check.py` runs all of that over a file:

    curl -sO https://typograaf.github.io/rayl-system/rayl-check.py
    python3 rayl-check.py yourpage.html

### Both modes

Light is the default and the one the approved panels were drawn in; dark is a
full inversion of the same tokens, so a page built correctly is correct in both
without a second set of decisions. Set it with
`document.documentElement.dataset.theme = "dark"`, or leave it unset to follow
the viewer's own setting.

---

## 1. Build with the parts

One file carries the colour tokens, the type scale, the page ground and rhythm,
the layout primitives, the button, the reveal button, the option group, the
slider, the rolling line and the icons:

    <script src="https://typograaf.github.io/rayl-system/rayl.js"></script>

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
not restyle them and do not rebuild them from the descriptions further down.

**Layout ships as primitives for the same reason.** They carry the spacing
hierarchy in section 5, so it is not re-decided every time.

### Where you cannot include a script

React, Tailwind, SwiftUI, anything rendered on a server, anything offline. Take
the values and build the components yourself from this document:

    https://typograaf.github.io/rayl-system/rayl.tokens.json   every value, as data
    https://typograaf.github.io/rayl-system/rayl-vars.css      the same as custom properties

`rayl-vars.css` is cut out of the stylesheet the components use, so it cannot
drift from them. It carries the colours, the type, the radius and the motion,
and no components at all. Retyping any value out of this document by hand is how
every existing Rayl build came to disagree with every other one.

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
| `rayl-solve` | the loading mark: data-size, data-play, data-ease and the timings |

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

Produced by `rayl.js` inside a component, never authored and never styled: `rayl-solve-face`, `rayl-solve-tile`, `rayl-solve-art`, `rayl-roll`, `rayl-ch`, `rayl-g`, `rayl-cur`, `rayl-nxt`, `rayl-type`, `rayl-reel`, `rayl-col`, `rayl-strip`, `rayl-digit`, `rayl-num`, `rayl-val`, `rayl-sign`, `rayl-point`, `rayl-seg-fill`, `rayl-ibtn-body`, `rayl-ibtn-dot`, `rayl-ibtn-icon`.
<!-- /generated:inventory -->

Modifiers go on the class they belong to: `is-wide`, `is-lead`, `is-three`,
`is-centred`, `is-ink`, `is-joined`, `is-tight`, `is-third`, `is-on`, `is-tall`,
`is-square`. The rest — `is-rolled`, `is-instant`, `is-line`, `is-near`,
`is-open`, and `is-landed`, `is-scrambling`, `is-solving`, `is-still` on the
loading mark — are set by `rayl.js` while something is moving.

A button's label is its own text; `data-label` is only needed when the label
should differ from it. An active control takes `aria-pressed="true"`.

### The examples are evidence, not stencils

    examples/landing.html   the wide primitives, composed
    examples/panel.html     the panel primitives, composed
    examples/bench.html     every control, the scale and both colour sets

They exist to show that the parts go together and to be read when you are unsure
how. **Do not clone one and change the words** — you would inherit a structure
built for a different problem, and the result would be a page shaped like a
rostering pitch no matter what it is actually about.

**Pages do not ship.** A page's structure should come from what the page is for,
and there is no arrangement of sections that is right for every brief.
Consistency comes from the tokens, the type scale, the spacing hierarchy and the
components. It does not come from every page having the same skeleton.

---

## 2. The logo

There are two files and you must use them as they are.

- **Icon** — the mark alone, with the registered symbol in the notch of the
  wedge. `assets/logo/Icon.svg`
- **Lockup** — the mark and the word "Rayl" side by side.
  `assets/logo/Lockup.svg`

Use the lockup wherever there is room. Use the icon where there is not, or where
the name is already obvious on the page.

**Colour.** The logo takes `ink/primary`: `#1C1C1A` on light, White on dark. It
flips wherever the type flips and needs no rule of its own.

**Clear space.** The icon alone gets **half its own height** on every side. The
lockup gets **its own full height** on every side. Both scale with the logo, so
there is nothing to recompute when it is placed larger or smaller.

**Minimum size.** There is none.

### The mark may move, in one place only

**`rayl-solve` is the exception to everything below**, and it is the only one.
The loading mark is a rebuilt mark — it has to be, or the pieces could not
turn — and its solved state is the icon. Inside that component the mark may be
rebuilt from its own geometry, and its parts may turn.

Nowhere else. A static placement is always the file, never a redraw, and nothing
outside `rayl-solve` rotates, turns or animates the mark. If you find yourself
rebuilding the mark for any other reason, you are doing the thing this section
forbids.

### Never

- Redraw or trace the mark, or rebuild it out of rectangles and circles.
- Change the proportions between the three bodies, or the gap between them.
- Make the bar's two ends match. They are deliberately different.
- Set "Rayl" in a typeface as a substitute for the lockup.
- Rotate, skew, outline, add a shadow to, or recolour the mark.
- Place the mark on a busy background where its silhouette breaks up.

---

## 3. Colour

The palette is fifteen flat colours and two gradients. The names are materials,
not greys: the look of porcelain and concrete, rigid materials given fluid,
organic movement.

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

Fourteen of these are the approved system. **Deep Black** `#11110F` is
the fifteenth, added as the ground for dark mode, and it is the one
colour in the table still waiting on a decision.
<!-- /generated:palette -->

**Gradients.** Both run top to bottom with the first stop at 0.349%.

- **Porcelain Gradient** — `#CFCFC1` to `#F7F7EF`
- **Concrete Gradient** — `#696961` to `#CFCFC1`

### The tokens

Nothing in an interface names a colour from the table above. **It names a job**,
and the job resolves to a different step in each mode.

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

Five more are not on the approved frame and are explained where they are used:
`--rayl-seg-press`, an unselected option cell being pressed (section 8);
`--rayl-solve-ground`, what the loading mark is standing on (section 8); and the
document grounds `--rayl-doc-ground`, `--rayl-doc-container` and
`--rayl-doc-tag` (section 5).

**Never write a hex in a build.** Every colour above resolves through a token, so
a page that names tokens is right in both modes and a page that names hexes is
right in neither.

### Ink and ground

Ink is `#1C1C1A`. Never `#000000` — the palette has no pure black and the logo
is not drawn in one.

The ground is a token, not a colour you pick:

- **An app or a panel** grounds on `surface/ground` — White on light, Soft Black
  on dark — with its controls on `surface/idle` above it.
- **A document** grounds on Off White with White containers on it, which is what
  section 5 describes.

### There is no green, and nothing means error

The palette is the fifteen above and nothing else. Nothing in it means error,
warning, success or info. Do not draft a palette colour in to stand for a state
and do not borrow a red. See RAYL-OPEN.md.

---

## 4. Typography

Two faces: **Azeret**, which sets nearly everything, and **Concrette**, a serif
for titles from 24 up. Both ship in `assets/fonts/`.

### The cap-height rule

**Text is trimmed to its cap height, not to its line box.** In CSS:

```css
text-box-trim: trim-both;
text-box-edge: cap alphabetic;
```

Where that is not supported, use a line height of `0.698` — Azeret's cap height —
so a text box measures cap to baseline.

If you skip this, every gap you build will be several pixels larger than the
design says, and nothing will line up with anything built correctly.

### The scale

Seven sizes, plus the 8 label, and no others.

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

**Leading opens as the size drops and tracking tightens as it grows.** Do not set
a size without its own leading and tracking — they are one decision, not three.
`.rayl-96` … `.rayl-12` carry all three; `.rayl-label` is the 8.

Narrow viewports **step down the scale, never off it**: 96 becomes 48, 72 and 48
become 36, 36 becomes 24 — each with that size's own leading and tracking. The
stylesheet does this; do not add your own breakpoints for type.

### A control tracks 0

The scale's tracking is for **running text**. A control is set at **0**.

`rayl-12` tracks +2%; `rayl-btn`, `rayl-seg`, `rayl-row` and the slider readout
track 0. The +2% opens small running text up; on a button it pushes a short word
off its own centre.

### Two typefaces

**Azeret is the workhorse.** Interface, running text, captions, labels — and
headlines too. If you are unsure which face to use, it is Azeret. It is the only
face at 18 and 12.

**Concrette is for titles and subheads, and nothing else.** It starts at 24 and
goes up. Never body copy, never a caption, never a control. Add `.rayl-serif` to
a size class from 24 upward; below that the class is ignored on purpose.

So a headline may be either — a real choice each time, not a default. Everything
under it is Azeret.

### Weights

**500, everywhere.** One weight for the whole system. There is no bold: `strong`
and `b` inherit 500, because a 700 request against a single-weight family makes
the browser smear the outline into a weight nobody drew. Emphasis comes from what
the sentence says, or from a size.

### The fonts are TRIAL cuts

Fine for internal work and prototypes. The licensed files have to replace them
before anything built with this goes public.

---

## 5. Spacing and layout

<!-- generated:spacing -->
The scale is **6, 12, 24, 36, 48, 60, 72, 96** and nothing else. It
steps by 12 rather than doubling.

**A gap says how related two things are:**

| gap | between |
|---|---|
| **6** | parts of one control — buttons in a cluster, a stepper's digits |
| **12** | things in a document: blocks on the page, frames in a field |
| **24** | a group led by nothing larger than a 24 |
| **36** | a group led by a 36; three columns of a split |
| **48** | a group led by a 48 or a 72; two columns of a split |
| **60** | a group led by a 96 |
| **72** | — |
| **96** | sections of a page |

**A group takes the gap its largest text asks for:**

| heading | the group's gap |
|---|---|
| 96 | 60 |
| 72 | 48 |
| 48 | 48 |
| 36 | 36 |
| 24 | 24 |
| 18 | 24 |

The number covers the whole group, not just the space under the heading —
a heading, its body copy and its buttons are all the same distance apart.

**What the containers fix, and nobody sets:**

| part | value | what |
|---|---|---|
| `rayl-page` | gap 96px | sections of a page |
| `rayl-cluster` | gap 6px | parts of one control |
| `rayl-grid` | gap 12px | cards or swatches |
| `rayl-head` | gap 24px | a header row |
| `rayl-split` | gap 48px | two columns |
| `rayl-band` | gap 36px | inside a band |
| `rayl-field` | gap 12px | frames in a field |
| `rayl-card` | padding 12px | inside a card |
| `rayl-rail` | padding 48px | inside a rail |

Set a group's gap explicitly with `rayl-gap-6` … `rayl-gap-72` **on the group**. That is the escape
hatch and the only way to set a gap with no heading to derive from.
<!-- /generated:spacing -->

### Space under a heading

**A gap is set by the largest text in the group, not by the kind of container it
sits in.** A group led by a 36 gaps 36 throughout; the heading, its body copy and
its buttons are all the same distance apart.

`rayl-stack`, `rayl-section` and `rayl-hero` derive it from the largest text they
contain — **nobody sets it at the call site**, and nothing takes a margin under a
heading. Where a group has no heading to derive from, `rayl-gap-6` … `rayl-gap-72`
**on the group** is the escape hatch and the only way to set one.

### Radius

<!-- generated:radius -->
Corner radius is **its own scale** and does not share the spacing one.

| radius | what |
|---|---|
| **4** | the board's smallest rounding |
| **8** | a control — button, option cell, card, swatch |
| **12** | the board's middle rounding |
| **24** | a container — a rail, a frame, a panel |
| **half the height** | anything meant to read as fully round |

A control is 8, a container is 24. Radius grows with the box.
<!-- /generated:radius -->

### No strokes

**Rayl has no border vocabulary.** Nothing in the system draws a line around
anything: not a card, not a swatch, not a table row, not a specimen. Every
boundary is made by a change of ground.

So when something needs to be distinguishable, **change what is behind it**. A
white swatch is made visible by the ground it sits on, not by a hairline drawn
round it. A table's rows are separated by their padding, not by rules. Reaching
for a 1px line is the quickest way to make a Rayl page stop looking like one, and
it is the first thing that creeps in when somebody is solving a legibility
problem in a hurry.

The one exception is the **focus ring**, which is not decoration — it is how
somebody navigating by keyboard knows where they are.

### Dividing a document

A document is not a panel. Anything explaining something — a guideline, a
reference, an overview — is built in the board's own layout language:

| part | what |
|---|---|
| the ground | Off White, 12 of padding, everything on it **12** apart |
| a chapter | an **8** label on the ground itself: 24 of padding, no fill |
| a block | two columns — a **500** rail against a **1440** field |
| the rail | White, radius **24**, 48 of padding, its content 48 apart |
| a frame | White, radius **24**, its content centred with room around it |
| a showcase frame | the same, padding **144** — three times the ordinary 48 |

**All the words live in the rail. The field holds nothing but the things
themselves.** That single split is what makes a board scannable: you read down
the left edge to find the part you want, and never have to read to see one.

**Frames are sized to what they hold, not shared out equally**, and a frame is
far bigger than its content. That air is the character; tightening it is the
fastest way to make a page stop looking like Rayl.

**A frame is named by a tag turned on its side**, 8 uppercase in Dark Off-White
down its left edge, so naming it costs no height.

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
field shows it.

### Pictures follow the column beside them

A media block in a split takes the height of the row rather than imposing one.
`rayl-media` in a `rayl-split` stretches; on its own it keeps its ratio.

### Established figures

<!-- generated:figures -->
| figure | value |
|---|---|
| the panel column | **520** |
| the wide column | **960** |
| the document field | **1440** |
| the tool panel | **300, padding 48, groups 48 apart** |
| a reading measure | **62 characters** |
| a showcase frame | **padding 144 — three times the ordinary 48** |
<!-- /generated:figures -->

A headline's measure is set in `ch` **on the headline itself**, never on a
container: `ch` resolves against the element's own font-size, so a measure on a
wrapper that inherits 12 gives a column a few words wide.

---

## 6. Interactive states

**No state has its own colour.** Every hover and pressed value is a colour
already in the palette. That is why the ladder has fifteen steps rather than
ten — Paper, Bone, Mid Porcelain and Soft Black exist so the states have
somewhere to land.

**Use the tokens in section 3 first.** They are what the shipped controls resolve
to and they cover every state a control has. The rule below is for deriving a
state on a ground the tokens do not name — a swatch, a custom surface, a piece of
art.

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

For a base not in this table, apply the rule. Do not invent a colour. Where the
ladder and the tokens disagree, build with the tokens — and see RAYL-OPEN.md,
because the disagreement is real.

### Ink flip

Dark ink down to Pale Concrete; Off White ink from Light Concrete down. The flip
happens between L\* 56.9 and 44.2 because that is where each stops winning.

These pairings clear 4.5:1, which is what body text needs. They do not all clear
7:1: Off White on Pale Concrete is about 3.6:1, so **that pair is for a swatch
label or a large size, never for running text**. If you need small text on a mid
tone, go two steps rather than one.

### Not covered

Loading, empty, error and skeleton. Ask rather than inventing them.

---

## 7. Motion

**There is one movement in the system. Text never fades, never crossfades and
never slides sideways. It rolls.** A label turns over in place, one character at
a time, and the component's own shape is the mask.

It belongs to a **button** whose label changes and a **line of text** whose value
changes, and to nothing else yet.

### The mechanic

Each character sits in its own box holding two glyphs, the incoming one stacked
directly above the outgoing one. Both travel **upward**: the outgoing glyph
leaves through the top edge as the incoming one arrives from beneath.

The characters do not move together. Each starts on its own beat, and the order
is **random, reshuffled on every roll**, so the same label never turns over the
same way twice. A left-to-right wipe is the obvious version of this and it is not
the one; random is what stops it reading as a progress bar.

### The numbers

<!-- generated:motion -->
| | | |
|---|---|---|
| duration | **280ms** | one character's travel |
| stagger | **20ms** | one character to the next, compressed so a roll never runs past 400ms |
| curve | **cubic-bezier(0.65, 0, 0.35, 1)** | in and out, everywhere |
| order | **random** | reshuffled on every roll |
| direction | **upward** | always |
| press down | **90ms** | a button sinking to 0.96 |
| press up | **220ms** | and coming back — deliberately slower than down |
| a line returns | **2400ms** | before a swapped line goes back to what it was |
<!-- /generated:motion -->

A roll takes `duration + (characters - 1) x stagger`. The stagger holds at 20ms
while that fits inside 400ms and compresses beyond it, so a long label arrives
with the button rather than long after it.

Only characters that actually change roll. A button hovering rolls its whole
label — that is the effect — but a label going from one word to a similar one
moves only what differs. `turn()` forces every character; `to()` moves what
changed.

### The travel is the clip, not a value

A glyph does not move by "about a line". It moves by **exactly the height of
whatever is clipping it**, because it has to clear that edge completely.

| clip | travel | at size 12 |
|---|---|---|
| a button | the button's own height, `cap + 24` | **32.376** |
| a line of text | the line box, `size x 1.2` | **14.4** |

Both are derived from the type size and neither is a fixed pixel value. Anything
shorter leaves half a character stranded inside the shape at the end of the roll.

**The clip is the component's own outline, corner radius included** —
`overflow: hidden` on the button itself, not on a box inside it.

**The width turns with the glyph.** Azeret is proportional; a box turning from
`y` into `e` changes width, and that width moves on the same duration, delay and
curve as the turn it belongs to. Skip it and the whole label jumps at the end.

### When it rolls

| trigger | what happens |
|---|---|
| hover | the label rolls over into itself — the same word on the far side |
| press | the label rolls into the next word: Copy into Copied |
| a value changing | a line rolls into its new value with no interaction at all |
| disabled | never rolls |
| `prefers-reduced-motion` | the text changes without turning; no fade substitute |

A disabled control stays still because the movement means something happened, and
nothing did.

### The press

Every button sinks to **0.96** while held: 90ms down, 220ms back. The two
directions are deliberately unequal — matched timing reads as a wobble, a quick
press and a slower release reads as a button.

### The roll on a line

Where the thing that changed is a value on a line — an address, a count, a
status — the same movement runs on the line itself. Same duration, same curve,
same random order. One thing changes: **the clip is the line box, not a shape**,
so the travel is 14.4 at 12. **A line that rolls must not move the line it sits
in.**

```html
<div class="rayl-row">
  <span class="rayl-label">Email</span>
  <span class="rayl-line" id="line-email"
        data-label="contact@rayl.com" data-swap="Copied to clipboard"></span>
</div>
<button class="rayl-btn" data-rolls="line-email" data-swap="Copied">Copy</button>
```

`data-rolls` names the line a control hands its new value to. The line returns on
its own after 2400ms. To drive it from a value rather than a click, call
`el.__rayl.to("the new text")`.

### A number is not a label

A number that changes continuously — a slider's value, a live count — is a
**reel**, not a roll. Each decimal place is a strip of digits whose position is a
continuous function of the value. It is an odometer, not ten loose reels: the
units column follows the value exactly, and every column above it holds still
until the one below is about to wrap. Digits are `tabular-nums`; a column with
nothing in it collapses to zero width, so 5 reads as `5`, not `005`.

### Nothing else moves

There is no page transition, no panel or sheet movement, no loading movement, no
hover movement on cards, and nothing at all on the gradients: those are flat art
and stay flat. **Ask before adding a second movement. The value of having one is
that it is one.**

---

## 8. Controls

### The button

`rayl-btn`. `aria-pressed="true"` for on, `data-icon` for an icon. Height is
`cap + 24`, radius 8, padding 12.

### The reveal button

`rayl-ibtn`. At rest it is a button. On hover it **divides**: the body gives up
the gap plus one circle of width, its right corners go to half the height, and a
circle of exactly the button's height takes the space it vacated with a 12 icon
inside it.

**The footprint never changes.** The button does not grow into the layout, it
divides — which is what lets one sit in a fixed row without pushing anything.

**The circle arrives as an iris**, `circle(0%)` to `circle(50%)` from its own
centre. It is full size and in place the whole time; it is never scaled and never
moves, so the icon inside stays at 12 and is revealed rather than grown.

**There are two clips, not one.** The body clips its label; the circle clips its
icon; each element travels whichever one contains it.

### The option group

`rayl-seg` with `rayl-seg-opt` cells: a row where **exactly one is on**, and
selection moves between them. The group owns the selection, so turning one on
turns the last one off. **A row of `rayl-btn` with `aria-pressed` is not an
option group** — it looks like one and behaves like a set of unrelated toggles.

**Two beats, and in each one a surface and its type move at the same instant.**

| | ground | label |
|---|---|---|
| hover | steps one rung | turns over |
| click | a circle opens from the centre of the cell | turns over again |

**The circle is the selection.** One element, filled `surface/active`, clipped
from `circle(0)` to `circle(70.71%)` — half the diagonal of a square, so it
finishes covering any cell it is given however wide it is.

**Hover takes the rung above the one section 6 would give it**, because
`surface/idle-pressed` in light is Bone, which is also what selection is painted
in. A selected cell still hovers and presses, but on its fill:
`surface/active-hover`, then `surface/active-pressed`.

**Layout.** Cells are half-width by default; `is-third` makes a cell one of
three; `is-joined` closes the gaps into a single bar and moves the radius onto
the group; `is-tight` sizes the group to its own content.

**A joined bar usually opens with a name** — a `rayl-seg-name`, not an option:
full `ink/primary`, the group's own ground, no hover, focus or selection. Greying
it would say it is unavailable, which is the opposite of what it is.

**Keyboard.** The group is one tab stop, on whatever is currently on. Arrow keys
in either axis move the selection and wrap; disabled cells are skipped. Focus
alone does not turn a label — the turn belongs to the selection.

Selecting fires `rayl:change` on the group, carrying `value` and `index`.

```html
<div class="rayl-seg is-joined">
  <span class="rayl-seg-name">Bisque</span>
  <button class="rayl-seg-opt">1</button>
  <button class="rayl-seg-opt is-on">2</button>
  <button class="rayl-seg-opt">3</button>
</div>
```

### The slider

**A Rayl slider is one shape.** A rounded nub carries the value and a 2px rail
runs *out* of it — not butted against it, out of it, through a concave fillet on
each side. That fillet is the character of the control and it cannot be done with
a rail plus a box, because the join is a curve belonging to neither piece. Use
the shipped control.

**Colour: the shape is `surface/idle`, the number sits on it in `ink/primary`.**
The slider is a groove in the panel, not a mark drawn on it. Do not invert it.

**The nub takes `surface/idle-hover` the moment it is engaged** — and engaged
starts where the magnetism starts, not where the pointer lands. Dragging holds
the same colour, and so does keyboard focus, but only keyboard focus.

**Click the nub to type in it, drag it to slide.** A press that lands on the nub
does not move the value until the pointer does; one that goes down and up in the
same place hands over to a field instead. A press anywhere else on the rail is a
jump. Enter commits, Escape restores.

**The nub reaches both ends, and there is never a stub of rail beyond it.** Each
rail is drawn only if there is room for one. An inset that keeps the nub clear of
the ends leaves a dead tail of rail sticking out, and the control stops looking
like it can reach its own maximum.

| measure | value |
|---|---|
| row height | 12 |
| nub corner | 3 |
| nub width | its number plus even padding, never under 24 |
| rail | 2 tall through the middle, at y 5 to 7 |
| rail end cap | radius 1, one pixel in from each edge |
| fillet | radius 2 |
| value text | 8 |

**The track fills the width of its row and its geometry never scales.** Draw the
path at real pixel width — the nub, corners and fillets stay 24, 3 and 2 however
wide the row gets.

**The control reports what it holds.** `rayl:input` while it moves and
`rayl:change` when it lands, both carrying `detail.value`. `el.value` reads it;
`el.setValue(n)` moves the nub without an event.

### The loading mark

**When something is loading, this is what you show.** `rayl-solve`. Not a
spinner, not a bar, not three dots, not a skeleton — the mark solves itself and
lands on the icon, so a wait ends on the brand rather than on a shape borrowed
from somewhere else.

    <span class="rayl-solve" data-size="150" data-label="Loading"></span>

It is a bandaged 2x2 whose solved state is the icon. The camera never moves —
face-on is the only view the mark is allowed to be seen from — and nothing is
shaded, so a mechanism that is genuinely three-dimensional arrives as flat
drawing.

**Tell it what it is standing on.** Every face carries an opaque tile in the
ground colour, which is what keeps the mark solid and is why nothing ever fades.
It assumes `surface/ground`. On any other ground, set `--rayl-solve-ground` to
that token, or the tiles will show.

**When the thing has loaded, call `el.solve()`.** It sends the mark home from
wherever it is and fires `rayl:change` with `phase: "landed"`, so the wait ends
on the mark instead of being cut off mid-turn. `el.play(false)` stops it where it
stands, which is what you want only if the loader is being removed at the same
moment.

| attribute | what |
|---|---|
| `data-size` | px, default 150 |
| `data-play="still"` | mount it solved and leave it there |
| `data-label` | its accessible name; give a loader `"Loading"` |
| `data-turn`, `data-gap`, `data-scramble`, `data-beat`, `data-think`, `data-hold` | the timings, in ms |
| `data-ease` | the curve |

| method | what |
|---|---|
| `el.play(false)` | stop it where it stands; `true` starts it again |
| `el.scramble()` | throw it out and start over |
| `el.solve()` | send it home from wherever it is |

It reports itself with `rayl:change`, bubbling, carrying `detail.phase` —
`landed`, `scrambling`, `solving` or `still` — and the same words appear on the
root as `is-landed`, `is-scrambling`, `is-solving`, `is-still`. It stops drawing
when it scrolls out of view, and under `prefers-reduced-motion` it sits solved
and never moves: no fade standing in for the turn.

**Its timings and its curve are not the system's**, and that is on the open list
rather than buried here. Everything else in Rayl moves on 280ms and one curve;
this runs at 480 on a curve of its own. Set the attributes above to put an
instance back on the system's numbers.

### A row names its control in ordinary type

Not in the 8 label: 12, Medium, `ink/primary`, sentence case, `rayl-row-name`.
The 8 label names a **section**; a row names a thing you are about to touch. The
name column is fixed so every control in a stack lines up.

```html
<div class="rayl-row">
  <span class="rayl-row-name">Count</span>
  <span class="rayl-slider" data-min="1" data-max="33" data-val="12" data-step="1"></span>
</div>
```

---

## 9. Icons

<!-- generated:icons -->
There are eighteen, and they are drawn, not licensed:

Bell · Bookmark · Broom · Cup · Document · Download · Folder · ID · Image · Minus · Organise · Pause · Play · Plus · Profile · Save · Stack · Upload

**Every icon is a 12 x 12 frame holding one filled path.** Filled, never
stroked — there is no line weight to match, which is why an icon lifted
from a stroked public set never sits right beside these. If you need one
that does not exist, ask; do not substitute.

Colour is `ink/primary`, so an icon follows the mode along with the text
beside it. Never paint an icon a fixed hex. Do not scale one below 12; if
you scale up, scale the frame — the path is built for that box.
<!-- /generated:icons -->

---

## 10. The Rayl look

The thing that makes something read as Rayl rather than as a generic light-mode
app is a layered gradient treatment on its cards and shapes: flat vector art with
gradient fills, stamped repeatedly, with no specular highlight anywhere.

**It is not lighting and it cannot be reproduced with lighting.** Every ring
carries the same gradient in the same place on its own body, and the transitions
are perfectly smooth. A light answers "which way is this surface facing" — this
gradient does not follow facing at all.

**Working reference code is not in this repo.** If you are asked for the Rayl
look, say the reference has not been added yet rather than approximating it.

---

## 11. The array

An array is a row of one body repeated — a plate, a card or a basket — evenly
spaced along a rail, all turned the same way, on a soft gradient sheet, with a
crest that travels along the row. It is the thing every Rayl film and still is
made of, and it is the one picture the brand owns.

**There is a live one. Use it — do not draw an approximation.** A row of
overlapping ellipses in CSS is not an array; what makes an array read is the
translucency, the soft fall across each body, and the shadow each one lays on
its neighbour. Those need a renderer, and there is one:

```html
<script type="module"
  src="https://typograaf.github.io/rayl-system/assets/array/rayl-array.js">
</script>

<div data-rayl-array="plate" style="height: 380px"></div>
```

That is the whole of it. Every element carrying `data-rayl-array` on the page is
found and started, sized to whatever box you give it — so **give it a height**,
since a `div` with nothing in it has none. Nothing else needs including: three
is inside the file, and the plate and the card are described rather than
downloaded.

Working example, with every control live:
[examples/array.html](https://typograaf.github.io/rayl-system/examples/array.html).

### Six layouts, and you do not compose a seventh

An array is not a row of settings you pick. **Every body has two approved
compositions — horizontal and vertical — and those are what a page uses.** Each
one carries its own count, spacing, angles, lighting, projection and crop,
composed in the app and exported from it; assembling your own out of numbers
that look reasonable produces something that is not a Rayl array, which is what
this section exists to prevent.

```html
<div data-rayl-array="plate"  data-layout="horizontal" style="height: 380px"></div>
<div data-rayl-array="card"   data-layout="vertical"   style="height: 720px"></div>
```

`horizontal` is a row running along the **bottom** of a wide frame, cropped
close, and it is the default — it is what goes across the foot of a section, a
header or a banner. `vertical` is a column down one **side** of a tall frame,
for a page edge, a sidebar or a phone-shaped panel. Between them:

| | horizontal | vertical |
|---|---|---|
| **plate** | 21 plates, spun 63°, tipped 20°, parallel | 19 plates, column leaning 8°, tipped 62° |
| **card** | 19 cards, spun 62°, tipped 24°, parallel | 34 cards, seen edge on, one pulled out |
| **basket** | 12 baskets swinging through a deep crest | 7 baskets, tipped 61° |

`data-layout="none"` leaves an array with nothing but the bare defaults. It is
for a look you are pasting in whole out of the app, not for hand-building one.

**The crop is part of the composition.** Each layout was framed in 16:9 or 9:16,
and that framing is reproduced exactly — the row sits low in its frame because
that is where it was put. An element of a different shape is *filled*, never
letterboxed and never re-centred: a wider box shows more to the sides, and a
narrower one stands back far enough that nothing composed is cut off.

### The three bodies

| body | what it is | what it costs |
|---|---|---|
| `plate` | the dinner plate — the signature array | nothing; it is turned from an outline in the file |
| `card` | the rounded card from the app | nothing; it is built from the design's three numbers |
| `basket` | the slotted crate | a 247K fetch, and only if a page asks for one |

There is no fourth. The app also has a ring, and it is **not** in the web
version — if a brief needs one, say so rather than substituting a plate.

### Changing a layout

Any setting can be laid over the top of a layout, and each is a `data-`
attribute named after itself. **The value a layout gives is the right one until
somebody says otherwise**, so reach for these to adjust a composition, not to
build one.

<!-- generated:array -->
| setting | what it does | default |
|---|---|---|
| `data-body` | `plate`, `card` or `basket`. There is no fourth | `plate` |
| `data-layout` | which approved composition to stand on: `horizontal`, `vertical`, or `none` for the bare defaults | `horizontal` |
| `data-count` | how many | `14` |
| `data-spread` | the **air between one body and the next**, in bodies. Nought is touching; negative overlaps, which is most of what an array is for | `-0.455` |
| `data-direction` | `across` or `up` — the layout sets it, and setting it against the layout is how a composition gets broken | `across` |
| `data-depth` | how thick a card is, against its own width. Cards only | `0.05` |
| `data-lean` | turns the whole rack, so the row recedes | `0` |
| `data-spin` | turns the bodies without turning the row | `24` |
| `data-tilt` | tips them towards you or away | `-14` |
| `data-motion` | `wave`, `still`, `scroll` or `pointer` — see below | `wave` |
| `data-wave` | how far a body is lifted out of the row, in bodies | `0.62` |
| `data-brush` | how many bodies wide the crest is | `2` |
| `data-peaks` | how many crests run at once | `1` |
| `data-seconds` | how long one pass takes | `6` |
| `data-at` | where the crest sits when nothing is driving it | `0.35` |
| `data-ease` | the curve the crest travels on — the app's own, not the system's | `0,0.593,1,0.28` |
| `data-colour` | what the bodies are made of | `#F7F7EF` |
| `data-key` | the big source | `1.55` |
| `data-key-colour` | its colour | `#F7F7EF` |
| `data-key-at` | where it stands | `0.3,0.75,0.85` |
| `data-key-size` | and how wide it is | `0.75` |
| `data-fill` | the cool fill | `0.3` |
| `data-fill-colour` | its colour | `#E2E2D3` |
| `data-fill-at` | where it stands | `-0.9,0.05,0.4` |
| `data-fill-size` | and how wide it is | `1` |
| `data-rim` | the light behind, the only one the glow-through has to work with | `0.8` |
| `data-rim-colour` | its colour | `#F7F7EF` |
| `data-rim-at` | where it stands | `0.2,0.35,-0.6` |
| `data-rim-size` | and how wide it is | `0.4` |
| `data-ambient` | how much of the sheet reaches the bodies | `1.4` |
| `data-exposure` | the picture | `1.0` |
| `data-contrast` | and its contrast | `1.05` |
| `data-occlusion` | how much light the row loses to itself | `1.15` |
| `data-shade` | how hard a body shadows the one behind. Unset, so it follows the occlusion the look asks for rather than a second number nobody set | `—` |
| `data-translucency` | how much light comes through a body | `0.72` |
| `data-scatter` | how far it spreads inside | `0.26` |
| `data-wrap` | how far round the form it bends | `0.23` |
| `data-falloff` | and how sharply it falls off | `3.3` |
| `data-roughness` | matte at 1 | `1` |
| `data-coat` | a clear layer over it, the way a fired glaze has one | `0` |
| `data-sheet` | `porcelain`, `concrete`, `none`, or two colours. `none` by default, so an array sits on whatever ground the page already has | `none` |
| `data-sky` | what an upward face sees. Unset, so it takes the sheet's top | `—` |
| `data-ground` | and a downward one. Unset, so it takes the sheet's bottom | `—` |
| `data-projection` | `lens` or `iso` — a real lens, or a parallel one. The plates and the cards are composed parallel, the baskets with a lens | `lens` |
| `data-fov` | the lens, which the parallel projection ignores | `32` |
| `data-aspect` | the crop: the shape the picture was composed in | `16/9` |
| `data-zoom` | how much of the fit to take — under one is closer in | `1` |
| `data-pan` | where the middle sits, in world units off the middle of the row | `0,0` |
| `data-bounce` | how much light the bodies throw at each other | `1` |
| `data-art` | an image printed on the face of a card | `—` |
| `data-dpr` | the most device pixels it may ask for | `2` |

Read out of `array/src/look.js`. A light's position is three numbers —
along the row, across it, and towards you — in units of the row's own
radius, about its middle. Held that way a rig means the same thing
whichever way the row runs, which is why it is not x, y and z.
<!-- /generated:array -->

### The four motions

- **`wave`** — a crest travelling the length of the row and out the far end,
  looping. What the films do, and the default.
- **`still`** — one composed frame with the crest parked where `data-at` says.
  The right choice for a header or a background.
- **`scroll`** — the crest crosses the row once per screenful as the page moves.
- **`pointer`** — the crest follows the cursor along the row and goes back to
  `data-at` when it leaves.

`wave` stops on its own under `prefers-reduced-motion`, off screen, and in a
background tab. Do not add your own animation on top of an array, and do not
animate the element it lives in.

### Pasting a look out of the app

A look is composed in **Rayl Stack**, and the settings string it saves — a
`.rayl` file, or the tail of a link — is understood as it stands, back to
version 3:

```html
<div data-rayl-array
     data-look="object=0&count=21&spread=-0.328&spin=63&tilt=-20&…&v=5"
     style="height: 380px"></div>
```

Everything comes across: the row, the angles, the rig, the surface, the
projection and the crop. One thing does not — which crest shape the tool was
running — so set `data-motion` beside it. **A look composed this way belongs in
`layouts/` as a seventh approved composition, not scattered through a page's
markup**: if a project needs a picture the six do not give, that is a decision,
and the decision has a home.

### From code

```js
import { RaylArray } from "https://typograaf.github.io/rayl-system/assets/array/rayl-array.js";

const array = new RaylArray(element, { body: "card", layout: "vertical" });
await array.set({ motion: "scroll" });
array.destroy();
```

`element.raylArray` is the one that was started for you from the markup, so a
page can drive an array it did not construct. `mount()` starts any that have
been added since. Changing the body re-reads the layout under it, so asking for
cards gives you the cards composition rather than the plate one with cards in
it.

### The rules

- **Give the element a height.** Everything else fits itself to the box.
- **Use a layout.** Six exist; a seventh is a decision, not a set of attributes.
- **The sheet belongs to the page, not the canvas.** `data-sheet` paints the
  element behind a transparent canvas, and a sheet does not move when a light
  does.
- **One array is one canvas.** Three on a page is three renderers; put one
  behind a whole section rather than one per card.
- **Do not restyle it and do not filter it.** No `filter`, no `mix-blend-mode`,
  no CSS shadow on the element. The picture is the picture.
- **It costs 190K gzipped**, plus the basket if you ask for one. That is a
  renderer; if a page cannot afford it, use a still image of an array rather
  than a hand-drawn imitation.

### What it does not do

The app it is taken from does more, and these are the differences rather than
faults to fix: no ring body, no printed card designs (an image through
`data-art` is as far as it goes), no card swing when a column opens, no frost —
what you see *through* a body, which every approved layout sets to three parts
in a hundred — no bloom, no export, and no dragging a body out of the row. If a
brief needs one of them, say which, and use the app.

---

## 12. What the system does not have

Every gap is in
[RAYL-OPEN.md](https://typograaf.github.io/rayl-system/RAYL-OPEN.md), generated
from one list so it cannot fall out of step with this page. **Nothing there is a
licence to guess.** If a brief needs one of them, say which one, and follow the
provisional protocol in section 0 if you cannot stop and ask.

<!-- generated:missing -->
The system has a button, a reveal button, an option group, a slider, a
rolling line and eighteen icons. It has no:

| missing | what a brief will ask for |
|---|---|
| **text and number input** | any form, any name field, any numeric entry |
| **select** | a list too long for an option group |
| **checkbox and toggle** | a setting that is on or off on its own |
| **modal, sheet, drawer** | a confirm, an export dialog, a settings panel |
| **collapsible section** | the approved panel draws one — every section label carries a – and nothing implements it |
| **tooltip and popover** | a label on an icon button |
| **tabs** | more than one view in a panel |
| **table** | any list of records |
| **toast** | anything reporting that a background job finished |
| **progress** | an export, an upload, a render |
| **menu** | a right-click or an overflow |
| **badge, chip, tag** | a count, a status, a filter |
| **avatar** | anybody's face |
| **scrollbar** | every panel taller than its frame |
| **app shell** | a control panel beside a canvas — the only layout the system cannot express |

The first four are the ones that block real work, and **they are one
design problem, not four**: in a system with no strokes, a control that
accepts input has to read as enterable through a change of ground alone.
That decision is Martijn's and it has not been made.
<!-- /generated:missing -->
