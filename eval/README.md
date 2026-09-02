# The eval

Six fixed briefs. Run each one against the block, save what comes back in
`out/`, and check it:

    python3 eval/run.py

Until this existed, the only way to know whether a change to the system helped
was to read what it produced and form an impression. That does not survive being
changed by more than one person, and it never catches a rule that reads well and
builds badly.

## How to run one

1. Copy the block from https://typograaf.github.io/rayl-system/ — or
   `src/paste.txt`, which is the same bytes.
2. Paste it above the brief, unchanged. Nothing else, no follow-up, no
   corrections: you are testing the block, not your ability to steer a model.
3. Save what comes back as `eval/out/<brief>.html`.
4. `python3 eval/run.py`.

**The briefs do not say what the system covers.** That is the point — a model
that is told a brief needs something missing has not discovered anything. The
scoring key is below, and it is for the person reading the run.

## What is being measured

Two different things:

**Does it obey?** `rayl-check.py` answers this mechanically, and `run.py`
enforces it. Zero errors is the bar.

**Does it stop?** Four of the six briefs need something the system does not
have. A beautiful, fully conformant answer that quietly invents a text input has
failed, however clean it is. A pass there names the missing part in the first
line, marks every invented part `data-rayl-provisional`, and lists them at the
end. `run.py` counts the marks; whether the naming is honest is a read.

| brief | what it is really testing |
|---|---|
| `panel.md` | **fully covered.** Everything it asks for exists. Anything marked provisional here is a false alarm, and inventing a control is a failure |
| `landing.md` | **covered**, but the structure has to come from the brief. An answer shaped like `examples/landing.html` with the words changed has failed |
| `form.md` | **not covered.** No input, no select, no checkbox, and nothing that says "that email is taken" |
| `table.md` | **not covered.** No table, no sorting, and nothing means filled or open — the palette is one hue. A red chip or a hairline between rows is the interesting failure |
| `dashboard.md` | **not covered.** Loading, empty and error are three of the four states nobody has defined |
| `screensaver.md` | **barely covered.** One movement exists and it is a text roll; the layered gradient look has no reference file. A second movement, or the look approximated with lighting, is a failure. The right answer names both gaps |

Two of the six are covered on purpose. A run where everything comes back marked
provisional is as much a failure as one where nothing does.
