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

## 2. The colour problem

Three different blacks are in use and none of them agree.

| colour | where it is used |
|---|---|
| `#1C1C1A` | both logo files. The only value that comes from the brand itself. |
| `#000000` | the rayl-ui panel — ink and text |
| `#3F3F3B` | the rayl-screen app — its "black" |

And three near-identical off-whites:

| colour | where |
|---|---|
| `#F0F0E5` | rayl-ui panel background |
| `#EAEAE5` | rayl-screen text colour |
| `#F0F0EA` | one stray use in rayl-screen |

Plus, from rayl-screen only, with no stated role: `#E8E8D8` (a sunk/inset
surface), `#CECEC5`, `#D8DEB9` (a green), `#D1D5BC`, `#81817B`, `#696963`.

> **Q1. Which black is the brand black?** The logo files say `#1C1C1A`. If that
> is right, both existing builds are wrong and should be corrected.
>
> **Q2. What is the one page background for light mode?** `#F0F0E5` and
> `#EAEAE5` are close enough that nobody will notice the difference and far
> enough apart that they will never match.
>
> **Q3. What is `#D8DEB9` for?** It is the only colour in the whole system that
> is not a grey. Is it an accent, a status colour, or specific to that one app
> screen?
>
> **Q4. What are the greys for?** `#CECEC5`, `#81817B` and `#696963` need names
> and jobs — border, muted text, disabled, and so on — or an AI will pick one at
> random each time it needs a grey.

---

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

What exists: Azeret, weights 400 and 500 in the panel, 400/500/600 in the app.
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

- **Figma frame 966-99, exported as SVG.** It is the only source of truth that
  has not been read yet. An SVG export carries exact positions, exact colours
  and exact type sizes with no guessing, and needs no Figma login. Drop it in
  the Brain Assets folder.
- Answers to Q1 through Q9.
