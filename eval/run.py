#!/usr/bin/env python3
"""Run the checker over whatever the briefs produced.

    python3 eval/run.py

Each brief in briefs/ expects an answer at out/<same name>.html. A missing one
is reported rather than skipped quietly — an eval that silently measures three
of five files is worse than no eval.
"""
import pathlib, subprocess, sys

ROOT   = pathlib.Path(__file__).resolve().parent
CHECK  = ROOT.parent / "rayl-check.py"
BRIEFS = sorted((ROOT / "briefs").glob("*.md"))

missing, failed, clean = [], [], []
for b in BRIEFS:
    out = ROOT / "out" / (b.stem + ".html")
    if not out.exists():
        missing.append(b.stem)
        continue
    r = subprocess.run([sys.executable, str(CHECK), str(out)],
                       capture_output=True, text=True)
    print(r.stdout.rstrip() or f"{out.name}: nothing to report")
    text = out.read_text()
    prov = text.count("data-rayl-provisional")
    print(f"  {out.name}: {prov} provisional part(s) marked")
    (failed if r.returncode else clean).append(b.stem)

print("\n%d clean, %d with errors, %d not run yet" % (len(clean), len(failed), len(missing)))
for m in missing:
    print("  no answer yet:", m)
sys.exit(1 if failed else 0)
