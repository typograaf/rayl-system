# Rayl system

The rules for how anything Rayl looks. Made to be handed to an AI so that
whatever it builds — a new tool, a change to the app, a reskin, a screensaver —
comes out looking like Rayl, including the parts nobody has designed yet.

You do not need to read any code to use this.

## How to use it

Go to **https://typograaf.github.io/rayl-system/**, press Copy, and paste the
block at the top of your prompt, before whatever you are asking for. That is the
whole workflow.

The block is not written by hand and is not reproduced here. It is generated from
`src/parts.py`, the same file the stylesheet's numbers are checked against, and
the build refuses to finish when the two disagree. It used to be prose kept in
step by hand; it drifted, and for weeks it handed people a spacing scale the
system had stopped using. One copy, generated, is the fix.

## What is in here

| file | what it is |
|---|---|
| `RAYL-RULES.md` | the rules. Normative, and nothing else |
| `RAYL-WHY.md` | why a rule is what it is: measurements, provenance, what was rejected |
| `RAYL-OPEN.md` | everything still undecided. Generated |
| `rayl.js` | the system as code — tokens, layout, every control |
| `rayl-vars.css` | the values as custom properties, for anything that cannot include a script |
| `rayl.tokens.json` | the same values as data |
| `rayl-check.py` | reads a page and says where it leaves the system |
| `examples/` | the parts composed. Evidence, not templates |
| `eval/` | fixed briefs to run the system against |
| `assets/` | the logo files and the two typefaces |

`RAYL-SYSTEM.md` and `AUDIT.md` are stubs kept so that older links still land
somewhere useful.

## Where this is up to

The logo, colour, type, spacing, states, motion and icons are all settled and
measured. What is not is in `RAYL-OPEN.md`, and the largest gaps are the
enterable controls — text input, select, checkbox, modal — which are one design
decision rather than four, and the layered-gradient treatment that makes
something read as Rayl rather than as a competent light-mode app.

Anything marked OPEN is a genuine gap. The documents tell an AI to stop and ask
when it hits one, and to mark and list anything it had to invent when it cannot
stop. That is deliberate: a guess that looks fine is the thing that quietly
becomes the new standard.

## Building

    python3 src/build.py

Everything is generated from `src/`. Never edit `rayl.js`, `rayl-vars.css`,
`rayl.tokens.json`, `rayl-check.py`, `RAYL-OPEN.md`, `index.html`,
`examples/bench.html`, `src/paste.txt` or `dist/` — they are output. In
`RAYL-RULES.md` the prose is hand-written and every `<!-- generated: -->` block
is not.

The build fails rather than publishing a contradiction: every fact in the
documents is asserted against `core.css` first, and both example pages are run
through `rayl-check.py`.

## Fonts

The Azeret and Concrette files here are the TRIAL cuts. Fine for internal work.
They have to be swapped for licensed files before anything built with this goes
public — and they are currently served from a public URL, which is worth fixing
sooner than that.
