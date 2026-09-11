# Baseline contract

A Baseline is a reusable comparison coordinate. It reproduces or maps an authoritative
source and can be consumed by many Cycles. It is not a Cycle: it need not pose a novel
hypothesis, vary one main variable, or end when one uncertainty is diagnosed.

## Identity and layout

Use a stable lowercase slug below `openresearch/baselines/`, normally combining the case,
lead author, and publication year: `baselines/tgv-reissmann-2021/`. Do not use the global
Cycle sequence for Baselines.

Every Baseline contains:

- `README.md`: purpose, citation, scope, current coverage, and consumer links;
- `source.md`: source access and the claim-bearing setup, equations, metrics, and results currently in scope; expand it as coverage grows;
- `setup.md`: executable mapping for the current real slice; record additional match/deviation detail when it affects interpretation and complete material coverage before external qualification;
- `runs.md`: append-only registry of paper-reported, solver-reproduction, and setup-extension runs;
- `status.md`: state, owner, approved plan, coverage, eligibility, latest evidence, and next action;
- `results/report.md` once any result is published;
- `results/raw/manifest.json` indexing raw numeric files, extraction provenance, hashes, units,
  and generation commands;
- `results/figures/*.png` for every decision-bearing result, with PDF/SVG retained when practical.

States are `planned`, `in-progress`, `partial`, `qualified`, or `superseded`. `partial` is a
valid reusable state when each available item declares its consumer eligibility and missing
coverage. `qualified` never means universally correct; it names the exact consumers and
setup variants for which the evidence may be used.

## Three evidence origins

Never merge these origins into an unlabeled curve or score:

1. `paper-reported`: values transcribed or digitized from the source;
2. `solver-reproduction`: results from this project attempting the declared reproduction contract;
3. `setup-extension`: additional controls or models run by this project under that setup,
   such as no-model, Smagorinsky, DSM, ablations, or a newly discovered closure.

An extension can belong to a Baseline even when it was not in the paper. It must not be
described as a reproduced paper result.

## Source extraction and digitization

Begin with one claim-bearing vertical slice. Select a source result needed by a real downstream
decision and run the actual digitization or solver path at the smallest scientifically meaningful
scale. Expand coverage only after inspecting that output. A Baseline may remain `partial` while this
slice is corrected or qualified; exhaustive coverage is not a prerequisite for learning.

For each extracted table, equation, or curve record source page, figure/table/panel, variable
definition, normalization, units, axis transform, extraction method, and uncertainty. Preserve
the raw points before interpolation or resampling. Include checkpoints against visible ticks or
published scalar values. Link the source rather than redistributing copyrighted PDFs or figure
images unless redistribution is permitted.

Choose what to reproduce by scientific utility: prioritize the source's claim-bearing metrics,
the quantities a Cycle will compare, the source's strongest model, and controls needed to
interpret disagreement. Do not mechanically reproduce every panel.

## Comparability and qualification

Keep the source setup immutable. Before the first slice, record only known differences that can alter
the target claim. Grow the executable mapping as real discrepancies appear, and disclose all material
differences before qualifying the Baseline for external consumers.

Use `strict-reproduction` only when the claim-bearing setup matches. Otherwise label results
`mapped-reproduction` or `contextual-comparison`. A successful curve shape under a materially
different solver is not a strict reproduction.

Before broad or expensive expansion, publish the selected reproduction/extension scope and obtain
the user's approval. A bounded real slice already inside the requested resource scope does not need a
separate feasibility gate. Standalone validation is warranted only when it is materially cheaper than
the slice and exercises the same likely failure, or protects safety, credentials, irreversible state,
source rights, or a meaningful resource cap. Raw numerical outputs and figures are both mandatory for
any completed result; a screenshot without raw points and a raw file without an inspectable figure are
not Baseline Evidence.

Cycles consume Baselines read-only and record the exact Baseline revision or artifact hash.
Cycle-specific candidates remain in the Cycle; promote only reusable reference runs into the
Baseline through `openresearch-build-baseline`.
