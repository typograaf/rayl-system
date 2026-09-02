#!/usr/bin/env python3
"""rayl-check — read a page and say where it leaves the Rayl system.

    python3 rayl-check.py page.html [more.html ...] [--json] [--quiet]

Every headline rule in this system is mechanically checkable — no hex colours,
no borders, every gap on the scale, one weight, no restyled component — and
until this existed nothing checked any of them. Conformance was assessed by eye,
per build, by one person. That does not survive being handed to an AI.

It is deliberately one file with no dependencies, so it can be fetched and run
anywhere:

    curl -sO https://typograaf.github.io/rayl-system/rayl-check.py

A file can waive a check it deliberately breaks — a specimen sheet has to print
hexes, a bench has to style its own furniture — with a directive anywhere in it:

    <!-- rayl-check: allow hex, restyle -->

Any check can be waived that way, and every waiver is a statement that this file
is showing the system rather than using it. There are two in the whole repo and
both are on documents that have to print the palette.
"""
import json, re, sys

SPACING  = {0, 6, 12, 24, 36, 48, 60, 72, 96}
RADIUS   = {0, 4, 8, 12, 24}
SIZES    = {8, 12, 18, 24, 36, 48, 72, 96}
# 120ms is the colour change under a control. It is not one of the system's
# numbers and it is what ships — see RAYL-OPEN.md.
DURATION = {"0s", "0ms", "20ms", "90ms", "120ms", "220ms", "280ms", "400ms", "2400ms"}
EASE     = "cubic-bezier(0.65,0,0.35,1)"
FACES    = ("azeret", "concrette", "inherit", "var(--rayl-font")

SPACE_PROPS  = ("gap", "row-gap", "column-gap", "margin", "padding", "inset")
CHECKS = ("hex", "stroke", "spacing", "radius", "size", "weight", "serif",
          "restyle", "unknown-class", "motion", "face", "ground", "seg", "trim")


def load_inventory():
    """The class list, from src/parts.py when it is beside us, and from a baked
    copy when this file has been fetched on its own."""
    try:
        sys.path.insert(0, __file__.rsplit("/", 1)[0])
        from parts import INVENTORY, INTERNAL
        return ({c.split()[0] for _, items in INVENTORY for c, _ in items}
                | set(INTERNAL))
    except Exception:
        return set(BAKED_CLASSES)


# generated:classes — build.py writes this list when it copies this file to
# rayl-check.py, so the published checker cannot fall behind the system.
# Run from src/ it imports parts.py instead and this is never used.
BAKED_CLASSES = """
rayl
""".split()
# /generated:classes

KNOWN = load_inventory()


class Report:
    def __init__(self, path, allowed):
        self.path, self.allowed, self.items = path, allowed, []

    def add(self, level, code, line, msg):
        if code in self.allowed:
            return
        self.items.append({"level": level, "check": code, "line": line, "msg": msg})

    def error(self, *a): self.add("error", *a)
    def warn(self, *a):  self.add("warn", *a)
    def note(self, *a):  self.add("note", *a)

    @property
    def errors(self):
        return [i for i in self.items if i["level"] == "error"]


def lineno(text, pos):
    return text.count("\n", 0, pos) + 1


def strip_svg(html):
    """An SVG carries its own fills and is usually pasted artwork; blanking it
    keeps the colour check on the page's own styling. Same length, so every
    offset after it still points at the right line."""
    return re.sub(r"<svg\b.*?</svg>", lambda m: " " * len(m.group(0)), html, flags=re.S)


def strip_comments(css):
    """Blank the comments, keeping every offset. A comment that mentions a class
    is prose about the system, not a rule against it — and this checker read one
    as a selector before the blanking went in."""
    return re.sub(r"/\*.*?\*/", lambda m: " " * len(m.group(0)), css, flags=re.S)


def css_regions(text, is_css):
    """(css, offset) for every stretch of CSS in the file."""
    if is_css:
        return [(strip_comments(text), 0)]
    out = [(strip_comments(m.group(1)), m.start(1))
           for m in re.finditer(r"<style[^>]*>(.*?)</style>", text, re.S)]
    out += [(m.group(1), m.start(1))
            for m in re.finditer(r"""\bstyle=["']([^"']*)["']""", text)]
    return out


def rules(css, offset):
    """(selector, body, offset-of-body) for each rule. An inline style attribute
    arrives with no selector, which is what the empty string means."""
    if "{" not in css:
        return [("", css, offset)]
    out = []
    for m in re.finditer(r"([^{}]*)\{([^{}]*)\}", css):
        out.append((m.group(1).strip(), m.group(2), offset + m.start(2)))
    return out


def decls(body, offset):
    for m in re.finditer(r"([-a-zA-Z]+)\s*:\s*([^;]+)", body):
        yield m.group(1).strip().lower(), m.group(2).strip(), offset + m.start(1)


def px(value):
    return [(float(m.group(1)), m.group(0))
            for m in re.finditer(r"(-?[0-9]*\.?[0-9]+)px", value)]


def check_css(text, r, is_css):
    for css, off in css_regions(text, is_css):
        for sel, body, boff in rules(css, off):
            focus = "focus" in sel
            for prop, val, pos in decls(body, boff):
                ln = lineno(text, pos)
                low = val.lower()

                for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b", val):
                    r.error("hex", ln, f"{prop}: {m.group(0)} — name a token, "
                            "never a hex. A page that names hexes is right in neither mode.")

                if prop in ("border", "border-top", "border-right", "border-bottom",
                            "border-left", "border-block", "border-inline") \
                   and "none" not in low and "0" != low.strip():
                    r.error("stroke", ln, f"{prop}: {val} — Rayl has no border "
                            "vocabulary. Make the boundary with a change of ground.")
                if prop == "outline" and not focus and "none" not in low:
                    r.error("stroke", ln, f"outline: {val} — the only stroke in "
                            "the system is the keyboard focus ring.")

                if prop.split("-")[0] in SPACE_PROPS or prop in SPACE_PROPS:
                    for n, raw in px(val):
                        if abs(n) not in SPACING:
                            r.error("spacing", ln, f"{prop}: {raw} — off the "
                                    f"spacing scale {sorted(SPACING - {0})}.")

                if prop.startswith("border-radius") or prop.startswith("border-") and "radius" in prop:
                    for n, raw in px(val):
                        if n not in RADIUS:
                            r.warn("radius", ln, f"{prop}: {raw} — the radius "
                                   "scale is 4, 8, 12, 24, or half the height.")

                if prop == "font-size":
                    for n, raw in px(val):
                        if n not in SIZES:
                            r.error("size", ln, f"font-size: {raw} — the scale "
                                    "is 96, 72, 48, 36, 24, 18, 12 and 8.")

                if prop == "font-weight" and low not in ("500", "inherit", "initial"):
                    r.error("weight", ln, f"font-weight: {val} — 500 is the only "
                            "weight in the system. There is no bold.")

                if prop in ("font-family", "font") and not any(f in low for f in FACES):
                    r.warn("face", ln, f"{prop}: {val} — the faces are Azeret and "
                           "Concrette.")

                if prop in ("transition", "animation", "transition-duration",
                            "animation-duration"):
                    for m in re.finditer(r"\b([0-9.]+m?s)\b", val):
                        if m.group(1) not in DURATION:
                            r.warn("motion", ln, f"{prop}: {m.group(1)} — the "
                                   "system's durations are 280ms, 20ms, 90ms, 220ms.")
                    for m in re.finditer(r"cubic-bezier\([^)]*\)", val):
                        if m.group(0).replace(" ", "") != EASE:
                            r.warn("motion", ln, f"{m.group(0)} — the one curve "
                                   f"in the system is {EASE}.")

            if re.search(r"\.rayl-[a-z0-9-]+", sel) and not focus:
                r.error("restyle", lineno(text, boff), f"{sel.strip()} — a shipped "
                        "component is being restyled. Compose it, do not change it.")


def check_html(text, r):
    body = re.search(r"<body[^>]*>", text)
    uses_js = "rayl.js" in text
    if uses_js and body and "rayl" not in (body.group(0) or ""):
        r.error("ground", lineno(text, body.start()), 'body has no class="rayl" — '
                "without it the page has no ground, no rhythm and no type.")
    if not uses_js and "rayl-vars.css" not in text and "--rayl-" not in text:
        r.warn("ground", 1, "neither rayl.js nor rayl-vars.css is included — "
               "nothing here resolves a token.")
    if not uses_js and "text-box-trim" not in text:
        r.warn("trim", 1, "no text-box-trim: building type without it puts every "
               "gap several pixels out. See RAYL-RULES.md, the cap-height rule.")

    used = set()
    for m in re.finditer(r"""\bclass=["']([^"']*)["']""", text):
        for c in m.group(1).split():
            used.add(c)
            if c.startswith("rayl") and c not in KNOWN and not c.startswith("is-"):
                r.error("unknown-class", lineno(text, m.start()),
                        f"{c} is not a class the system ships.")

    for m in re.finditer(r"""class=["'][^"']*\brayl-serif\b[^"']*["']""", text):
        cls = m.group(0)
        if not any(f"rayl-{s}" in cls for s in (24, 36, 48, 72, 96)):
            r.error("serif", lineno(text, m.start()), "rayl-serif with no size "
                    "class of 24 or above — Concrette starts at 24.")

    for m in re.finditer(r"<(div|section|p|span)[^>]*>((?:\s*<button[^>]*>.*?</button>\s*)+)",
                         text, re.S):
        group = m.group(2)
        if group.count('aria-pressed') >= 2 and 'rayl-btn' in group:
            r.warn("seg", lineno(text, m.start()), "several rayl-btn with "
                   "aria-pressed side by side — if exactly one is on, that is a "
                   "rayl-seg, and the group owns the selection.")

    prov = re.findall(r"""data-rayl-provisional=["']([^"']*)["']""", text)
    for p in prov:
        r.note("provisional", 1, f"provisional, not Rayl yet: {p}")
    return prov


def check(path):
    text = open(path, encoding="utf-8", errors="replace").read()
    allowed = set()
    for m in re.finditer(r"rayl-check:\s*allow\s+(.+?)\s*(?:-->|\*/|\n)", text):
        allowed |= {a.strip() for a in m.group(1).split(",") if a.strip()}
    r = Report(path, allowed)
    is_css = path.endswith(".css")
    check_css(text if is_css else strip_svg(text), r, is_css)
    if not is_css:
        check_html(strip_svg(text), r)
    return r


def main(argv):
    args = [a for a in argv if not a.startswith("--")]
    flags = {a for a in argv if a.startswith("--")}
    if not args:
        print(__doc__.strip())
        return 2
    reports = [check(p) for p in args]
    if "--json" in flags:
        print(json.dumps([{"file": r.path, "findings": r.items} for r in reports],
                         indent=2))
    else:
        for r in reports:
            for i in r.items:
                print(f"{r.path}:{i['line']}  {i['level']:5} {i['check']:14} {i['msg']}")
        n = sum(len(r.errors) for r in reports)
        w = sum(len(r.items) - len(r.errors) for r in reports)
        if "--quiet" not in flags or n:
            print(f"\n{len(reports)} file(s): {n} error(s), {w} other(s)."
                  + ("" if n else "  Clean against every mechanical rule."))
    return 1 if any(r.errors for r in reports) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
