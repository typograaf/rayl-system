# Rayl system audit

What was found in the two logo files and the six existing Rayl builds, and
every place they disagree with each other. Nothing here is a rule yet. The
numbered questions are the ones only Martijn can answer; each one blocks a
section of the guideline.

Last updated 2026-09-01.

---

## 1. What the logo files prove

These are measured out of `Icon.svg` and `Lockup.svg`, not estimated.

**The mark is three bodies on a 150 grid.**

| body | size | position |
|---|---|---|
| bar | 150 wide, 69 tall | top, full width |
| dot | 69 across | bottom left |
| wedge | 69 x 69 | bottom right |

69 + 12 + 69 = 150. **The gap between the bodies is 12.** The dot's diameter,
the bar's height and the wedge's box are all 69, the same number.

**The corner radii are deliberately unequal.** The bar's right end is a full
half-circle (34.5, half its height). Its left corners are 17.5, exactly half
that. Making both ends match is the single most likely way to get the mark
wrong.

**The wedge overshoots its box by about a third of a unit** at the two ends of
its diagonal. That is optical correction on a rounded corner, not a mistake, and
it is why `Icon.svg` is 151 wide rather than 150. Do not snap it to the box.

**The lockup ties the wordmark to the mark by cap height.** The wordmark's
capitals are the same height as the icon, 150. The gap between them is 69 — one
body, the same as the bar's height. The registered mark sits on the baseline, 12
after the l. The whole lockup is 644 x 191; the y descends 41 below the baseline,
which is where the extra height comes from.

**The wordmark is not monospaced.** The R is 111 wide and the l is 22. So it is
either drawn or set in a proportional cut, and either way it is not something to
retype in Azeret Mono and hope.

---

## 2. Colour — RESOLVED from the Figma file

The Figma guidelines board carries a COLOURS chapter (node 966:639) whose values
live as named styles under a `V2/` prefix. That is the authority, and it settles
questions 1 to 4.

| style | hex |
|---|---|
| V2/White | `#FFFFFF` |
| V2/Off White | `#F7F7F2` |
| V2/Dark Off-White | `#E2E2D3` |
| V2/Porcelain | `#CFCFC4` |
| V2/Light Concrete | `#696963` |
| V2/Dark Concrete | `#55554E` |
| V2/Black | `#1C1C1A` |
| V2/Porcelain Gradient | `#CFCFC4` to `#F7F7F2`, 180 degrees |
| V2/Concrete Gradient | `#696963` to `#CFCFC4`, 180 degrees |

Every value in every code build had drifted from these except one. See the
guideline document for the correction table.

**The swatches in the file are painted correctly but their specs are empty.**
Every one reads `RGB 000 000 000`, `CMYK 000 000 000 000`, `HEX #000000`. The
chapter was laid out and never filled in.

### What is still open on colour

> **Q1. Is there a green in the brand palette?** The chapter's own text promises
> "subtle touches of an organic green" and no green swatch exists. The app build
> uses `#D8DEB9`, which is the same hue family as everything else with the
> chroma raised. Is it in the system or is it that one screen's invention?
>
> **Q2. Is a mid-tone needed?** Nothing sits between Porcelain (L* 82.8) and
> Light Concrete (L* 44.2) — a gap of 38. Control borders, disabled text and
> hover states all live in that gap and currently have nowhere to come from.
>
> **Q3. How many semantic colours, if any?** Every colour in the palette is one
> hue. Anything that means stop is the first hue break in the brand. Error is
> the only one that cannot be done another way; success, warning and info might
> be better served by a grey chip and a clear sentence.
>
> **Q4. Should the CMYK be a real profile conversion?** The values now in the
> guideline are straight arithmetic, which is fine on screen and not fine at a
> printer.

## 3. The spacing problem

The stated scale is **6, 12, 24, 48, 72**. What the builds actually use:

| value | on the scale | uses |
|---|---|---|
| 6, 12, 24, 48 | yes | many |
| 72 | yes | none yet |
| **36** | **no** | rayl-screen page margins and the gaps under the mark, 4 uses |
| **8** | **no** | rayl-ui, 11 uses — button radius and small steps |
| 32, 80 | no | a few each, look like strays |

36 and 8 are load-bearing, not accidents. 36 is every page margin in the app
screen; 8 is the radius on every button in the panel.

> **Q5. Is 36 allowed?** Either the app screen is wrong and should be 24 or 48,
> or 36 is a legitimate page-margin exception that the guideline should name.
>
> **Q6. Is 8 a radius scale rather than a spacing value?** Spacing and corner
> radius do not have to share a scale, and in this system they clearly do not.
> If radius is its own thing, what is the full set — 8 and what else?

---

## 4. Type

**Lead from the Figma file:** the guidelines board sets its own text in
**Azeret VF-TRIAL**, a *variable* font, at `"ital" 0, "MONO" 0` — proportional,
not monospaced. Every build in code carries static cuts instead. Its three text
styles are named `Guidelines/Chapter 12pt`, `Guidelines/Body 18pt` and
`Guidelines/Body 10pt`, so they describe the guideline document itself rather
than the product UI. The TYPOGRAPHY chapter (node 966:219, 106 text nodes) has
not been read yet and is where the product answers live.

What exists in code: Azeret, weights 400 and 500 in the panel, 400/500/600 in the app.
Two sizes only — 8 for section labels, 12 for everything else. Tracking of 0.24
at 12px, which is 0.02em. Line height 1.2.

One genuinely distinctive rule is already in the code and needs writing down or
it will be lost: **text is trimmed to its cap height**, not its line box, the
way the Figma file trims every text node. In the app this is
`text-box-trim: trim-both` with `text-box-edge: cap alphabetic`; in the older
panel it is a line height of 0.698, Azeret's cap height. This is why the
measurements in the design file work at all, and an AI that does not know it
will be about four pixels out on every label.

> **Q7. What is the size ladder above 12?** Two sizes cannot carry a headline, a
> screensaver, or a marketing page. Even three more numbers would do.
>
> **Q8. Is 0.02em tracking global, or does it loosen at small sizes and tighten
> at large ones?**
>
> **Q9. Which weights are in the system?** 400/500/600 all appear. If all three
> are in, each needs a job.

---

## 5. Everything with nothing to go on

These have no source at all yet, and an AI asked to build anything real will
invent them on the spot:

- **Component states.** Hover, pressed, disabled, focus, error, loading, empty.
  Every component in every build is drawn in exactly one state.
- **Motion.** Three builds have their own easing file and none of them share a
  name or a number. No durations are stated anywhere.
- **Icons.** Confirmed to be on one grid — but the grid size and the stroke
  weight still have to be written down. The rayl-wheel notes already record two
  icons reading badly at small size, which is what a missing icon rule looks
  like in practice.
- **The card look.** The layered gradient that makes something look like Rayl
  rather than like a generic app. This one cannot be written as a sentence; it
  has to ship as a working file an AI copies.

---

## 6. Still needed

- **The TYPOGRAPHY chapter** (node 966:219) and **ICONOGRAPHY chapter**
  (966:507 onward) read out of the Figma file. Between them they should settle
  the size ladder, the weights, the tracking and the icon grid.
- Answers to the four colour questions above, and to Q5 to Q9 below on spacing
  and type.

## 7. The board's chapters

For navigation — the guidelines board is node 966:99, 2040 x 37175, and its
frames are all named "Frame N", which is why it is hard to move around.

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
