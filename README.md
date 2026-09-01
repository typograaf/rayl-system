# Rayl system

The rules for how anything Rayl looks. Made to be handed to an AI so that
whatever it builds — a new tool, a change to the app, a reskin, a screensaver —
comes out looking like Rayl, including the parts nobody has designed yet.

You do not need to read any code to use this.

## How to use it

Paste the block below at the top of your prompt, before whatever you are asking
for. That is the whole workflow.

> **Not live yet.** The links in the block below start working once this is
> published. Until then it will not work as written.

---

    Build this to the Rayl design system.

    Read https://typograaf.github.io/rayl-system/RAYL-SYSTEM.md first and follow
    it exactly. Read https://typograaf.github.io/rayl-system/AUDIT.md too if you
    need to know why something is the way it is.

    The rules that matter most:

    - The logo is a file, never something you draw. Icon:
      https://typograaf.github.io/rayl-system/assets/logo/Icon.svg
      Lockup: https://typograaf.github.io/rayl-system/assets/logo/Lockup.svg
      Use the lockup where there is room, the icon where there is not.
    - The typeface is Azeret, from
      https://typograaf.github.io/rayl-system/assets/fonts/
    - Text is trimmed to its cap height, not its line box. In CSS that is
      text-box-trim: trim-both and text-box-edge: cap alphabetic. Skip this and
      every measurement will be wrong.
    - Spacing is 6, 12, 24, 48, 72 and nothing else.
    - Type is 8 for section labels and 12 for everything else, tracking 0.02em,
      line height 1.2.
    - Ink is #1C1C1A. Light mode only.
    - Where the system does not cover something, tell me and ask. Do not invent
      it and do not substitute something that looks close.

---

## What is in here

| file | what it is |
|---|---|
| `RAYL-SYSTEM.md` | the rules themselves |
| `AUDIT.md` | everything found in the existing Rayl builds, and the questions still open |
| `assets/logo/` | the icon and the lockup |
| `assets/fonts/` | Azeret |

## Where this is up to

The logo section is complete and measured off the real files. Colour, type sizes
above 12, component states, motion, icons and the card look are all still open —
they are listed as questions in `AUDIT.md`.

Anything marked NOT DECIDED is a genuine gap. The document tells the AI to stop
and ask when it hits one, rather than filling it in with something plausible.
That is deliberate: a guess that looks fine is the thing that quietly becomes the
new standard.

## Adding assets

Drop new files into the Rayl `Brain Assets` folder in Dropbox and they get copied
in here and published. Dropbox is the place to put them; this repo is what makes
them reachable by a URL, which is what an AI needs in order to use them rather
than approximate them.

## Fonts

The Azeret files here are the TRIAL cuts. Fine for internal work. They have to be
swapped for licensed files before anything built with this goes public.
