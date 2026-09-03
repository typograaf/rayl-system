# The Rayl design system — what is not decided

Every gap in one place, because scattering them is how they get invented
instead of asked about. Generated from `src/parts.py`; do not edit.

The rules are [RAYL-RULES.md](https://typograaf.github.io/rayl-system/RAYL-RULES.md). Why a rule is what it is
is [RAYL-WHY.md](https://typograaf.github.io/rayl-system/RAYL-WHY.md).

**Nothing on this page is a licence to guess.** If a brief needs one of these,
say which one and stop. If you cannot stop and ask, follow the provisional
protocol in section 0 of the rules: build it, mark it
`data-rayl-provisional="…"`, and list it at the end.

There are three words and they mean different things:

| status | what it means |
|---|---|
| **OPEN** | genuinely undecided. Do not invent. Say which one you hit. |
| **PROVISIONAL** | in the shipped code, works, may still change. Safe to build on. |
| **RULE** | settled. Follow it. |

---

## A check glyph

**OPEN** — the icon set has no colour, so a ticked box and a failed panel show the same mark

ON is carried by the ground — the box turns Bone the way every selected thing does — and the mark inside it is Plus turned 45 degrees, because that is the only glyph in the set that reads as a mark rather than an instruction. The empty panel's error twin shows the same glyph at 24. Two opposite meanings on one drawing is a real weakness and it wants either a nineteenth icon or a decision that the ground alone is enough. Do not draw a tick.

## Semantic colour

**OPEN** — nothing means error, warning, success or info

Every colour in the palette sits on one hue, so any of these is the brand's first hue break. Do not draft a palette colour in to stand for a state and do not borrow a red.

## Hover: the ladder or the token

**OPEN** — two approved sources give a Paper base two different hovers

The L* ladder says Bone, five steps away. surface/idle-hover says Off White, one step. Build with the tokens — they are what ships — but the disagreement is real and wants a decision.

## A container's padding

**OPEN** — "a container pads one step below the gap it sits in"

It held when the page ran 72 and a band padded 48. The page runs 96 now and the band still pads 48, where the rule would say 72. Do not apply it to anything new.

## 96 on the spacing scale

**OPEN** — the page rhythm is 96 and the scale as written stops at 72

96 steps by 12 like every other member and is what rayl-page actually uses, so it is listed. Confirm it is a member rather than a page-only figure.

## Shadows

**OPEN** — the Rayl look needs two, and nothing else in the system has one

Section 2 forbids a shadow on the mark, section 5 makes every boundary out of a change of ground, and the loading mark carries an opaque tile on every face so that nothing is drawn at part strength. A shadow is drawn at part strength. Same question as the scrim: does the system have shadows now, or does the look get them and nothing else? Nothing may take one until this is answered.

## The reveal button's label

**OPEN** — White #FFFFFF on the approved frame, Off White in the ink table

One value, two approved sources. Ask before using either.

## Transparency

**OPEN** — the scrim behind a dialog is the first thing in Rayl drawn at part strength

Everything else in the system is flat and opaque — it is why the loading mark carries a tile on every face rather than fading, and why the palette is fifteen solid steps. A dialog has to dim what is behind it, so --rayl-scrim is a 20% mix and it is the right answer for that job. What is not decided is whether transparency is now a thing the system has, or one exception a dialog gets. Nothing else may fade until that is answered.

## An array as a ground

**OPEN** — the array can sit behind or in front of content, and nothing says how

Section 11 already calls data-motion="still" the right choice for a header or a background, and then never says how to place one. The system has no layering vocabulary at all: z-index appears six times in core.css and every one is inside a component. So a background array today means hand-rolled position, inset and stacking, re-decided on every page, which is what layout primitives exist to prevent. Three things have to be answered before the primitive can be drawn. Is a background forced to still, or may it wave under text? What colour is type over an array — the ink flip works off a single L* and an array is a gradient sheet with bodies moving across it, so there is nothing to test. And does foreground mean over-and-clipped, like a masthead, or over-and-transparent, which the bodies being opaque makes a different question again.

## The fonts

**OPEN** — Azeret and Concrette here are TRIAL cuts

Fine for internal work and prototypes. The licensed files have to replace them before anything built with this goes public.

## CMYK

**OPEN** — the printed values are arithmetic, not a profile conversion

Fine on screen, not fine at a printer.

## Enterable surfaces

**PROVISIONAL** — the field, the select, the checkbox, the toggle and the dialog that holds them

This was the largest open item in the system and it is answered: a control that ACCEPTS input reads as enterable through a change of ground alone — surface/idle at cap + 24, rounding 8, padding 12, and the focus ring as the one stroke. Every measurement is read off the UI Control Blanks boards and all of it ships, so build with it rather than inventing. It is PROVISIONAL and not a RULE because Martijn has drawn it and has not yet seen it rendered. Do not write it into a document as settled until he has.

## Component states

**PROVISIONAL** — empty, error and skeleton now ship; loading was already the loading mark

rayl-empty is a panel with nothing in it and an error is the same panel with different words, because nothing in the palette means error. rayl-skeleton is blocks where type will land and it does not move. Hover, pressed, disabled and focus were always covered by the tokens, and a wait is still rayl-solve. These are drawn rather than decided, so they move with the enterable surfaces above.

## The scrim

**PROVISIONAL** — the page behind a dialog, dimmed 20%

20% is the figure on the board and it is what ships. The colour is the darkest ground the mode has — Black in light, Deep Black in dark — because a scrim is a shadow: taking ink/primary would flip it to White in dark mode and lighten the page instead of dimming it. Only the light value was drawn; the dark one follows from that reasoning and has not been looked at.

## Deep Black #11110F

**PROVISIONAL** — the dark-mode ground, and the one palette colour not on the approved frame

It ships and it works. Either it joins the palette or dark mode grounds on a colour already in it.

## The 8 radius

**PROVISIONAL** — every control rounds 8; the board's own ladder is 4, 12, 24

8 is measured off the approved UI rather than the demo, and where the two disagree the UI wins. Worth confirming the ladder gains an 8.

## The Rayl look

**PROVISIONAL** — it ships as is-look; dark mode and one alpha in it are not drawn

Measured at 966:2041, re-struck on the palette and shipped opt-in. What is provisional is dark: nobody drew it. The rim and the lift survive by changing colour rather than alpha, but the press does not — light darkens its corner by about 12 L* and dark has 5.2 of headroom in total, so the press alpha is raised from its measured 30% to 70% and still reaches only 3.3. That one number is invented. The alternative is no press in dark at all, which is honest and reads flatter than light.

Also standing: Bone is the rim, and Bone is what selection is painted in. A card rimmed in Bone and a selected control are the same colour. Bone was taken because it is the only step that keeps the bowl (5.5 L* against the drawn 5.7, where the alternative gives 1.6) and keeps the 108 rows on the step they are drawn on. Worth revisiting if the two ever meet on a page.

## The loading mark's timing

**PROVISIONAL** — rayl-solve runs on numbers and a curve that are not the system's

A turn is 480ms with no beat between turns, a scramble turn 480ms, and it sits on the solved mark for 960ms — where the system's numbers are 280, 90, 220 and 2400. The curve is cubic-bezier(0.5, 0.14, 0.36, 0.79) where the system's one curve is cubic-bezier(0.65, 0, 0.35, 1). Every value was picked by Martijn on the bench, watching whole turns; no reason is recorded beyond that, and none is invented here. The component runs correctly on the system's numbers — set data-turn, data-gap, data-scramble, data-hold and data-ease to put any instance back on them. This is the second easing in the system, and the whole argument of section 7 is that there is one. It is on this list rather than hidden in a stylesheet.

## A colour change runs 120ms

**PROVISIONAL** — the ground under a control moves at 120ms ease-out, not on the system's curve

Every documented movement is 280ms on cubic-bezier(0.65,0,0.35,1), and section 7 says both surfaces move together on the same duration and curve. The shipped controls do not: a hover's colour change is 120ms ease-out while the label rolls at 280ms. It was in two places when it was first written down. The thirteen controls took it as the house value and it is now in eleven, which is worth knowing before deciding: this is no longer a stray, it is the system's second easing in practice. Either it joins the system as the value a ground moves on, or every one of the eleven changes.

## Magnetism on buttons

**PROVISIONAL** — the slider's lean, applied to the nearest button and only that one

The nub has leaned toward an approaching cursor since it was built and nothing else did. Buttons do now, on the nub's own range and strength — 104 and 0.6 — so no value was invented there.

Two things were changed after seeing it: every button in range leaned at once, which made a panel read as a row of things all asking to be clicked, and it moved too far. Now the nearest button in range leans and every other one lets go, and the cap is 6 rather than 12. Six is a cluster's own gap, so a button can never close the distance to its neighbour; the nub keeps 12 because it has nothing beside it.

Still provisional because it is the first thing in Rayl that moves without being touched, and section 7 is one movement.

---

## Controls nobody has designed

The system has a button, a reveal button, an option group, a slider, a
rolling line, a field, a select, a menu, a checkbox, a toggle, a dialog, a
tooltip, a popover, tabs, a collapsible section, a table, an empty panel, a
skeleton, a loading mark and eighteen icons. It has no:

| missing | what a brief will ask for |
|---|---|
| **sheet and drawer** | a settings panel that comes in from an edge — the dialog ships, these do not |
| **toast** | anything reporting that a background job finished |
| **progress** | an export, an upload, a render — determinate, where the mark says nothing about how far |
| **context menu** | a right-click or an overflow: rayl-menu is the list, nothing opens one at a pointer |
| **badge, chip, tag** | a count, a status, a filter |
| **avatar** | anybody's face |
| **scrollbar** | every panel taller than its frame |
| **app shell** | a control panel beside a canvas — the only layout the system cannot express |

The four that used to head this list — field, select, checkbox and
toggle — were one design problem and not four: in a system with no
strokes, a control that accepts input has to read as enterable through a
change of ground alone. They ship, and they are PROVISIONAL rather than
settled — see the open list. What is left in the table above is genuinely
undrawn; ask rather than approximating one.
