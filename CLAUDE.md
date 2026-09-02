# rayl-system

The Rayl design system, published at https://typograaf.github.io/rayl-system/.
Its audience is an AI: somebody pastes the block from that page above a prompt,
and what gets built comes out looking like Rayl.

## The one rule that matters here

**Everything is generated from `src/`.** A value has exactly one home, and the
build fails rather than publishing two versions of it. This repo exists because
that was not true: the block people paste drifted from the stylesheet and told
them the spacing scale was `6, 12, 24, 48, 72` for weeks after the system had
stopped using it.

    python3 src/build.py

Run that after any change. It regenerates everything, asserts every documented
fact against `core.css`, and runs the checker over every page. If it stops, it
says why, and nothing was published.

### Never edit these — they are output

    rayl.js  rayl-vars.css  rayl.tokens.json  rayl-check.py  RAYL-OPEN.md
    index.html  examples/bench.html  src/paste.txt  dist/

Editing `rayl.js` or `src/paste.txt` is the most common mistake and it is
invisible: the next build silently overwrites it.

### Edit these

    src/core.css       tokens, type, page, layout, components
    src/components.js  the roll, the reel, the icons
    src/slider.js      the track
    src/parts.py       EVERY fact once — palette, tokens, scale, spacing,
                       motion, inventory, the OPEN list
    src/build.py       assembly, and init() where a component is upgraded
    src/site.py        the bench and the dashboard
    src/paste.py       the block, rendered from parts.py
    src/tokens.py      the JSON and CSS exports
    src/doc.py         the fact tables, and every assertion
    src/check.py       the checker

`RAYL-RULES.md` and `RAYL-WHY.md` are hand-written prose **except** the
`<!-- generated:… -->` blocks, which `doc.py` owns.

## What the build will refuse

Each of these caught a real bug and none is cosmetic:

- a class in `core.css` with no `INVENTORY` row in `parts.py`, or an inventory
  row nothing ships
- a heading gap, container gap, radius, type size, motion figure or palette hex
  in `parts.py` that `core.css` does not agree with
- `src/paste.txt` that is not what `paste.py` renders
- a `section N` reference in `RAYL-RULES.md` pointing at a section that is gone
- the old spacing scale reappearing in any published document
- any page in the repo failing `rayl-check.py`

## The documents

| file | what |
|---|---|
| `RAYL-RULES.md` | binding. The only document an AI has to follow |
| `RAYL-WHY.md` | measurements, provenance, what was tried and rejected |
| `RAYL-OPEN.md` | generated from `OPEN` in `parts.py`. Never edit |
| `RAYL-SYSTEM.md`, `AUDIT.md` | superseded stubs, kept so old links land |

Three status words, and they differ: **OPEN** (undecided — do not invent),
**PROVISIONAL** (ships, works, may change), **RULE** (settled).

**Do not close an OPEN item on your own.** Enterable surfaces, semantic colour
and the layered-gradient "Rayl look" are Martijn's decisions. If work needs one,
say which one and stop.

## Adding a component

It is never one file. All six or the build refuses:

1. `src/core.css` — the rules
2. `src/components.js` — one upgrade function taking the element
3. `src/build.py` — its line in `init()` and in `window.Rayl.upgrade`
4. `src/parts.py` — `INVENTORY` for classes people author, `INTERNAL` for
   classes the JS makes, and the `OPEN` entry it closes or narrows
5. `RAYL-RULES.md` — the prose, in section 8
6. the bench, via `src/parts.py` — never by hand

**A new duration or easing curve is a decision, not a detail.** The system has
one movement on `280ms cubic-bezier(0.65,0,0.35,1)`. If a component needs
something else, stop and ask before writing it anywhere. There is already one
unannounced second easing recorded in `RAYL-OPEN.md`; do not add a third.

## Checking

    python3 rayl-check.py somepage.html

Hexes, borders, off-scale spacing, wrong weights, restyled `rayl-*` selectors,
unknown classes, second easings. A file may waive a check it deliberately breaks
with `<!-- rayl-check: allow hex -->`; there are two waivers in the repo and
both are documents that have to print the palette.

`eval/` holds six fixed briefs, four needing something the system lacks. See
`eval/README.md`.

## Housekeeping

- `array/` is untracked work in progress with `node_modules` in it. Leave it out
  of commits.
- The Azeret and Concrette files are TRIAL cuts served from a public URL. They
  need licensing before anything built with this goes public.
