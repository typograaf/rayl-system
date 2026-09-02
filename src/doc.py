"""Write the facts into the documents, and refuse to build if they disagree.

Every table that states a value the code also holds — the palette, the tokens,
the type scale, the spacing, the radius, the motion, the class inventory — is
generated from src/parts.py into a marked block. Prose stays hand-written around
it. RAYL-OPEN.md is generated whole.

This exists because the same bug kept happening: a value would be corrected in
one place and left standing in the other, and a document would go on confidently
stating something the shipped file had not done for weeks. The worst instance
was the paste block, which is the one thing a model actually reads — it named a
spacing scale the stylesheet had not used for weeks, and because it claimed to
cover spacing, nobody was sent on to the document that was right.

A fact has one home now, and the build fails rather than letting two drift.
"""
import pathlib, re, sys
from parts import (ROOT, PALETTE, UI, SCALE, INVENTORY, INTERNAL, SPACING,
                   GAP_CLASSES, HEADING_GAP, GAP_MEANING, RADIUS, FIGURES,
                   FIXED, MOTION, ICONS, MISSING, OPEN)

RULES = ROOT / "RAYL-RULES.md"
CSS   = (ROOT / "src/core.css").read_text()
# every source that can make a class real: a stylesheet rule, a component that
# builds one, or the upgrade list in build.py that finds it in the markup
JS    = "".join((ROOT / "src" / f).read_text()
                for f in ("components.js", "slider.js", "build.py"))
HUB   = "https://typograaf.github.io/rayl-system"


def block(name, body):
    return f"<!-- generated:{name} -->\n{body}\n<!-- /generated:{name} -->"


# ----------------------------------------------------------- the tables ----

def palette_table():
    rows = "\n".join(
        f"| {n} | `{h}` | {int(h[1:3],16)} {int(h[3:5],16)} {int(h[5:7],16)} | {l} |"
        for n, h, l in PALETTE)
    return ("| name | hex | RGB | L\\* |\n|---|---|---|---|\n" + rows +
            "\n\nFourteen of these are the approved system. **Deep Black** `#11110F` is"
            "\nthe fifteenth, added as the ground for dark mode, and it is the one"
            "\ncolour in the table still waiting on a decision.")


def token_table():
    return ("| token | light | dark | job |\n|---|---|---|---|\n" +
            "\n".join(f"| `{n}` | {lt} | {dk} | {job} |" for n, lt, dk, job in UI))


def scale_table():
    return ("| size | leading | tracking, Azeret | tracking, Concrette |\n"
            "|---|---|---|---|\n" +
            "\n".join(f"| {s} | {lead} | {az} | {co} |" for s, lead, az, co, _ in SCALE) +
            "\n| 8 | — | +8% uppercase | — |")


def spacing_table():
    gaps = "\n".join(f"| **{n}** | {what} |" for n, what in GAP_MEANING)
    heads = "\n".join(f"| {size} | {gap} |" for size, gap in HEADING_GAP)
    fixed = "\n".join(f"| `{sel.lstrip('.')}` | {prop} {val} | {what} |"
                      for sel, prop, val, what in FIXED)
    return (
      f"The scale is **{', '.join(str(n) for n in SPACING)}** and nothing else. It\n"
      "steps by 12 rather than doubling.\n\n"
      "**A gap says how related two things are:**\n\n"
      "| gap | between |\n|---|---|\n" + gaps + "\n\n"
      "**A group takes the gap its largest text asks for:**\n\n"
      "| heading | the group's gap |\n|---|---|\n" + heads + "\n\n"
      "The number covers the whole group, not just the space under the heading —\n"
      "a heading, its body copy and its buttons are all the same distance apart.\n\n"
      "**What the containers fix, and nobody sets:**\n\n"
      "| part | value | what |\n|---|---|---|\n" + fixed + "\n\n"
      "Set a group's gap explicitly with " +
      f"`rayl-gap-{GAP_CLASSES[0]}` … `rayl-gap-{GAP_CLASSES[-1]}` **on the group**. "
      "That is the escape\nhatch and the only way to set a gap with no heading to derive from.")


def radius_table():
    return ("Corner radius is **its own scale** and does not share the spacing one.\n\n"
            "| radius | what |\n|---|---|\n" +
            "\n".join(f"| **{r}** | {what} |" for r, what in RADIUS) +
            "\n\nA control is 8, a container is 24. Radius grows with the box.")


def figures_table():
    return ("| figure | value |\n|---|---|\n" +
            "\n".join(f"| {name} | **{val}** |" for name, val in FIGURES))


def motion_table():
    return ("| | | |\n|---|---|---|\n" +
            "\n".join(f"| {name} | **{val}** | {what} |" for name, val, what in MOTION))


def icons_table():
    return ("There are eighteen, and they are drawn, not licensed:\n\n" +
            " · ".join(sorted(ICONS)) + "\n\n"
            "**Every icon is a 12 x 12 frame holding one filled path.** Filled, never\n"
            "stroked — there is no line weight to match, which is why an icon lifted\n"
            "from a stroked public set never sits right beside these. If you need one\n"
            "that does not exist, ask; do not substitute.\n\n"
            "Colour is `ink/primary`, so an icon follows the mode along with the text\n"
            "beside it. Never paint an icon a fixed hex. Do not scale one below 12; if\n"
            "you scale up, scale the frame — the path is built for that box.")


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


def missing_table():
    return ("The system has a button, a reveal button, an option group, a slider, a\n"
            "rolling line and eighteen icons. It has no:\n\n"
            "| missing | what a brief will ask for |\n|---|---|\n" +
            "\n".join(f"| **{c}** | {w} |" for c, w in MISSING) +
            "\n\nThe first four are the ones that block real work, and **they are one\n"
            "design problem, not four**: in a system with no strokes, a control that\n"
            "accepts input has to read as enterable through a change of ground alone.\n"
            "That decision is Martijn's and it has not been made.")


BLOCKS = {
    "palette":   palette_table,
    "tokens":    token_table,
    "scale":     scale_table,
    "spacing":   spacing_table,
    "radius":    radius_table,
    "figures":   figures_table,
    "motion":    motion_table,
    "icons":     icons_table,
    "inventory": inventory_table,
    "missing":   missing_table,
}


# ------------------------------------------------------------ the checks ----

def base_rules(css):
    """core.css without its comments and without anything inside an at-rule.
    A narrow viewport re-pads a rail to 24 and a dark block re-points a token,
    and neither of those is the value the system states."""
    css = re.sub(r"/\*.*?\*/", " ", css, flags=re.S)
    out, i = [], 0
    while i < len(css):
        at = css.find("@", i)
        if at < 0:
            out.append(css[i:]); break
        brace = css.find("{", at)
        if brace < 0:
            out.append(css[i:]); break
        out.append(css[i:at])
        depth, j = 1, brace + 1
        while j < len(css) and depth:
            depth += (css[j] == "{") - (css[j] == "}")
            j += 1
        i = j
    return "".join(out)


BARE = base_rules(CSS)


def rule_body(selector):
    """Every rule whose selector list contains this one, in source order — a
    class is usually declared once and adjusted later, and the later rule wins."""
    out = []
    for m in re.finditer(r"([^{}]*)\{([^{}]*)\}", BARE):
        sels = [s.strip() for s in m.group(1).replace("\n", " ").split(",")]
        if selector in sels:
            out.append(m.group(2))
    return out or None


def declared(bodies, prop):
    """What this property ends up as. Last declaration wins, as in the browser."""
    found = None
    for body in bodies or []:
        for m in re.finditer(r"(?:^|;)\s*%s\s*:\s*([^;]+)" % re.escape(prop), body):
            found = m.group(1).strip()
    return found


def check():
    """Nothing here is style. Every one of these caught a real disagreement."""

    # 1. every class core.css ships is accounted for
    shipped = set(re.findall(r"\.(rayl-[a-z0-9-]+)", CSS))
    named = {c.split()[0] for _, items in INVENTORY for c, _ in items} | set(INTERNAL)
    missing = sorted(shipped - named)
    if missing:
        raise SystemExit(
            "core.css ships classes that are in no inventory: " + ", ".join(missing)
            + "\nAdd them to INVENTORY (a part people use) or INTERNAL (a part rayl.js"
              " makes) in src/parts.py.")

    # 2. and the other way round — the inventory promised parts that did not exist
    everything = CSS + JS
    ghosts = sorted(c for c in named if c not in everything and c != "rayl")
    if ghosts:
        raise SystemExit("the inventory names classes nothing ships: " + ", ".join(ghosts))

    # 3. every palette colour the tokens name exists, and is in the stylesheet
    known = {n for n, _, _ in PALETTE}
    for n, lt, dk, _ in UI:
        for v in (lt, dk):
            if v not in known:
                raise SystemExit(f"token {n} names {v!r}, which is not in the palette")
    for n, h, _ in PALETTE:
        if h not in CSS:
            raise SystemExit(f"palette colour {n} ({h}) is not in core.css")

    # 4. the gap escape hatch: one class per member, and no others
    hatch = {int(m.group(1)) for m in re.finditer(r"\.rayl-gap-(\d+)\{", CSS)}
    if hatch != set(GAP_CLASSES):
        raise SystemExit(f"core.css ships rayl-gap-{sorted(hatch)} and parts.py says "
                         f"{sorted(GAP_CLASSES)}")
    for n in GAP_CLASSES:
        if n not in SPACING:
            raise SystemExit(f"rayl-gap-{n} is not on the spacing scale")

    # 5. the heading mapping in parts.py IS the one core.css implements
    css_map = {}
    for m in re.finditer(r"((?:\.rayl-(?:stack|section|hero):has\(> \.rayl-\d+\),?\s*)+)"
                         r"\{--rayl-gap:(\d+)px;\}", CSS):
        for s in re.findall(r"has\(> \.rayl-(\d+)\)", m.group(1)):
            css_map[int(s)] = int(m.group(2))
    default = declared(rule_body(".rayl-stack"), "--rayl-gap")
    for size, gap in HEADING_GAP:
        got = css_map.get(size, int(default.rstrip("px")) if default else None)
        if got != gap:
            raise SystemExit(f"a {size} heading gaps {got} in core.css and "
                             f"{gap} in parts.py")

    # 6. what the containers fix
    for sel, prop, val, _ in FIXED:
        body = rule_body(sel)
        if body is None:
            raise SystemExit(f"core.css has no rule for {sel}")
        got = declared(body, prop)
        if got is None or got.split()[0] != val:
            raise SystemExit(f"{sel} {prop} is {got!r} in core.css and {val!r} in parts.py")

    # 7. every spacing value a container fixes is on the scale
    for sel, prop, val, _ in FIXED:
        n = int(val.rstrip("px"))
        if n not in SPACING:
            raise SystemExit(f"{sel} {prop} {val} is off the spacing scale")

    # 8. the type scale is the one the stylesheet ships
    for s, *_ in SCALE:
        if not re.search(r"\.rayl-%d\{font-size:%dpx" % (s, s), CSS):
            raise SystemExit(f"core.css has no .rayl-{s} at {s}px")

    # 9. the motion numbers
    for name, val, _ in MOTION:
        if val.endswith("ms") and val not in everything and val.replace("ms", "") not in everything:
            raise SystemExit(f"the {name} {val} is in parts.py and not in core.css")

    # 10. the block was regenerated from parts.py after parts.py last changed
    import paste
    on_disk = (ROOT / "src/paste.txt").read_text()
    if on_disk != paste.BLOCK:
        raise SystemExit("src/paste.txt is not what src/paste.py renders — run "
                         "python3 src/paste.py. Never edit paste.txt by hand.")

    # 11. every "section N" in the rules points at a section that exists and
    #     carries what the sentence says it does. Renumbering by hand is how
    #     three of these came to point at the wrong chapter.
    rules = RULES.read_text()
    heads = {int(m.group(1)): m.group(2).strip()
             for m in re.finditer(r"^## (\d+)\. (.+)$", rules, re.M)}
    for m in re.finditer(r"section (\d+)", rules):
        if int(m.group(1)) not in heads:
            raise SystemExit(f"RAYL-RULES.md points at section {m.group(1)}, "
                             f"which does not exist. Sections are {sorted(heads)}.")

    # 12. the scale that used to be wrong is nowhere in any published document.
    #     A regression guard on the one bug that mattered most.
    stale = "6, 12, 24, 48, 72"
    for f in sorted(ROOT.glob("*.md")) + [ROOT / "src/paste.txt"]:
        text = f.read_text()
        if stale in text and "used to be" not in text and "for weeks" not in text:
            raise SystemExit(f"{f.name} still states the old spacing scale ({stale})")


# ------------------------------------------------------------- the write ----

def open_doc():
    order = {"OPEN": 0, "PROVISIONAL": 1, "RULE": 2}
    items = sorted(OPEN, key=lambda o: order.get(o[1], 3))
    out = [
      "# The Rayl design system — what is not decided",
      "",
      "Every gap in one place, because scattering them is how they get invented",
      "instead of asked about. Generated from `src/parts.py`; do not edit.",
      "",
      f"The rules are [RAYL-RULES.md]({HUB}/RAYL-RULES.md). Why a rule is what it is",
      f"is [RAYL-WHY.md]({HUB}/RAYL-WHY.md).",
      "",
      "**Nothing on this page is a licence to guess.** If a brief needs one of these,",
      "say which one and stop. If you cannot stop and ask, follow the provisional",
      "protocol in section 0 of the rules: build it, mark it",
      '`data-rayl-provisional="…"`, and list it at the end.',
      "",
      "There are three words and they mean different things:",
      "",
      "| status | what it means |",
      "|---|---|",
      "| **OPEN** | genuinely undecided. Do not invent. Say which one you hit. |",
      "| **PROVISIONAL** | in the shipped code, works, may still change. Safe to build on. |",
      "| **RULE** | settled. Follow it. |",
      "",
      "---",
      "",
    ]
    for name, status, what, detail in items:
        out += [f"## {name}", "", f"**{status}** — {what}", "", detail, ""]
    out += ["---", "", "## Controls nobody has designed", "", missing_table(), ""]
    return "\n".join(out)


def main():
    check()
    s = RULES.read_text()
    for name, fn in BLOCKS.items():
        pat = re.compile(r"<!-- generated:%s -->.*?<!-- /generated:%s -->" % (name, name), re.S)
        if not pat.search(s):
            raise SystemExit(f"RAYL-RULES.md has no <!-- generated:{name} --> block")
        s = pat.sub(lambda m: block(name, fn()), s)
    RULES.write_text(s)
    (ROOT / "RAYL-OPEN.md").write_text(open_doc())
    print("RAYL-RULES.md facts regenerated (%s)" % ", ".join(BLOCKS))
    print("RAYL-OPEN.md written (%d items)" % len(OPEN))


if __name__ == "__main__":
    main()
