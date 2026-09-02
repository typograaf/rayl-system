"""Write the facts into RAYL-SYSTEM.md, and refuse to build if they disagree.

Every table in the guideline that states a value the code also holds — the
palette, the UI tokens, the type scale, the class inventory — is generated from
src/ into a marked block. Prose stays hand-written around it.

This exists because the same bug kept happening: a value would be corrected in
one place and left standing in the other, and the document would go on
confidently stating something the shipped file had not done for weeks. A fact
now has one home, and the build fails rather than letting the two drift.
"""
import pathlib, re, sys
from parts import ROOT, PALETTE, UI, SCALE, INVENTORY, INTERNAL

DOC = ROOT / "RAYL-SYSTEM.md"
CSS = (ROOT / "src/core.css").read_text()


def block(name, body):
    return f"<!-- generated:{name} -->\n{body}\n<!-- /generated:{name} -->"


def palette_table():
    rows = "\n".join(
        f"| {n} | `{h}` | {int(h[1:3],16)} {int(h[3:5],16)} {int(h[5:7],16)} | {l} |"
        for n, h, l in PALETTE)
    return ("| name | hex | RGB | L\\* |\n|---|---|---|---|\n" + rows +
            "\n\nFourteen of these are the approved system at `1083:9025`. **Deep Black**"
            "\n`#11110F` is the fifteenth and is not on that frame — it was added as the"
            "\nground for dark mode, and it is the one colour in the table waiting on a"
            "\ndecision.")


def token_table():
    rows = "\n".join(f"| `{n}` | {lt} | {dk} | {job} |" for n, lt, dk, job in UI)
    return ("| token | light | dark | job |\n|---|---|---|---|\n" + rows)


def scale_table():
    rows = "\n".join(f"| {s} | {lead} | {az} | {co} |" for s, lead, az, co, _ in SCALE)
    return ("| size | leading | tracking, Azeret | tracking, Concrette |\n"
            "|---|---|---|---|\n" + rows +
            "\n| 8 | — | +8% uppercase | — |")


def inventory_table():
    out = []
    for group, items in INVENTORY:
        out.append(f"**{group}**\n")
        out.append("| class | what it is |\n|---|---|")
        out += [f"| `{c}` | {p} |" for c, p in items]
        out.append("")
    out.append("Produced by `rayl.js` inside a component, never authored and never "
               "styled: " + ", ".join(f"`{c}`" for c in INTERNAL) + ".")
    return "\n".join(out)


BLOCKS = {
    "palette":   palette_table,
    "tokens":    token_table,
    "scale":     scale_table,
    "inventory": inventory_table,
}


def check():
    """Every class core.css ships must be accounted for. A new part that nobody
    wrote a line about cannot reach anybody."""
    shipped = set(re.findall(r"\.(rayl-[a-z0-9-]+)", CSS))
    named = {c.split()[0] for _, items in INVENTORY for c, _ in items} | set(INTERNAL)
    missing = sorted(shipped - named)
    if missing:
        raise SystemExit(
            "core.css ships classes that are in no inventory: " + ", ".join(missing)
            + "\nAdd them to INVENTORY (a part people use) or INTERNAL (a part rayl.js"
              " makes) in src/parts.py.")

    # every palette colour the tokens name must exist
    known = {n for n, _, _ in PALETTE}
    for n, lt, dk, _ in UI:
        for v in (lt, dk):
            if v not in known:
                raise SystemExit(f"token {n} names {v!r}, which is not in the palette")

    # and every palette hex must be in the stylesheet, spelled the same way
    for n, h, _ in PALETTE:
        if h not in CSS:
            raise SystemExit(f"palette colour {n} ({h}) is not in core.css")


def main():
    check()
    s = DOC.read_text()
    for name, fn in BLOCKS.items():
        pat = re.compile(r"<!-- generated:%s -->.*?<!-- /generated:%s -->" % (name, name), re.S)
        if not pat.search(s):
            raise SystemExit(f"RAYL-SYSTEM.md has no <!-- generated:{name} --> block")
        s = pat.sub(lambda m: block(name, fn()), s)
    DOC.write_text(s)
    print("RAYL-SYSTEM.md facts regenerated (%s)" % ", ".join(BLOCKS))


if __name__ == "__main__":
    main()
