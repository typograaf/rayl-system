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

## Enterable surfaces

**OPEN** — text input, select, checkbox and toggle, and the modal that holds them

In a system with no strokes, a control that ACCEPTS input has to read as enterable through a change of ground alone. That is one decision and all four follow from it. Martijn is designing it. Until it lands there is no correct form in this system.

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

## Component states

**OPEN** — empty, error, skeleton

Hover, pressed, disabled and focus are covered by the tokens, and loading is now the loading mark, rayl-solve. These three are not covered, and a tool without them is a demo.

## The Rayl look

**OPEN** — the layered gradient treatment, and the largest single gap in the system

Flat vector art with gradient fills, stamped repeatedly, no specular highlight — it is not lighting and cannot be reproduced with lighting. There is no reference file in this repo. Everything else here makes a build correct; this is what makes it Rayl. Say the reference is missing rather than approximating it.

## The reveal button's label

**OPEN** — White #FFFFFF on the approved frame, Off White in the ink table

One value, two approved sources. Ask before using either.

## The fonts

**OPEN** — Azeret and Concrette here are TRIAL cuts

Fine for internal work and prototypes. The licensed files have to replace them before anything built with this goes public.

## CMYK

**OPEN** — the printed values are arithmetic, not a profile conversion

Fine on screen, not fine at a printer.

## Deep Black #11110F

**PROVISIONAL** — the dark-mode ground, and the one palette colour not on the approved frame

It ships and it works. Either it joins the palette or dark mode grounds on a colour already in it.

## The 8 radius

**PROVISIONAL** — every control rounds 8; the board's own ladder is 4, 12, 24

8 is measured off the approved UI rather than the demo, and where the two disagree the UI wins. Worth confirming the ladder gains an 8.

## The loading mark's timing

**PROVISIONAL** — rayl-solve runs on numbers and a curve that are not the system's

A turn is 480ms with no beat between turns, a scramble turn 480ms, and it sits on the solved mark for 960ms — where the system's numbers are 280, 90, 220 and 2400. The curve is cubic-bezier(0.5, 0.14, 0.36, 0.79) where the system's one curve is cubic-bezier(0.65, 0, 0.35, 1). Every value was picked by Martijn on the bench, watching whole turns; no reason is recorded beyond that, and none is invented here. The component runs correctly on the system's numbers — set data-turn, data-gap, data-scramble, data-hold and data-ease to put any instance back on them. This is the second easing in the system, and the whole argument of section 7 is that there is one. It is on this list rather than hidden in a stylesheet.

## A colour change runs 120ms

**PROVISIONAL** — the ground under a button moves at 120ms ease-out, not on the system's curve

Every documented movement is 280ms on cubic-bezier(0.65,0,0.35,1), and the guideline says both surfaces move together on the same duration and curve. The shipped controls do not: a hover's colour change is 120ms ease-out while the label rolls at 280ms. It reads well and it is what ships, so it is written down rather than quietly corrected — but it is a second easing in a system whose whole argument is that there is one.

---

## Controls nobody has designed

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
