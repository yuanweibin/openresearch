# Artifact contract

Use the smallest artifact set that makes the scientific decision inspectable and resumable.

## Program layer

- `openresearch/program.md`: long-lived question, intended contribution, module boundaries, and overall conclusion standard.
- `openresearch/status.md`: current Program design revision, active Cycles, owner, approval state, latest Evidence, and next legal action.
- `openresearch/design/README.md`: current design revision and index of frozen design contracts.
- `openresearch/design/references.md`: citation records used by design literature maps.
- `openresearch/design/decisions.md`: approved design promotions and reversals.

## Cycle layer

Use a two-digit, monotonically increasing creation sequence: `cycles/01-name/`, `cycles/02-name/`. Never reorder or reuse a sequence.

Every proposed Cycle contains:

- `question.md`: one primary uncertainty, hypothesis, alternatives, and what the Cycle will not conclude.
- `experiment.md`: inherited design revision, frozen variables, one main variable, experimental overrides, controls, methods, Evidence criteria, stopping rules, resources, provenance, and literature map.
- `deliverables.md`: the exact user-reviewable outputs and the condition that makes each deliverable ready.
- `tasks.md`: two-level stable task IDs where each leaf has an action, artifact or observation, completion/rejection condition, and resume boundary.
- `status.md`: execution state, scientific state, approval, owner, progress, latest Evidence, next checkpoint, and next legal action.
- `decisions.md`: timestamped deviations, anomalies, and decisions with their Evidence basis.

During execution, publish results below `results/`. Keep `results/report.md` as the decision-oriented report and version-controlled figures, previews, and manifests under `results/assets/`.

## State semantics

Execution state is one of `designed`, `running`, `evidence-ready`, `diagnosed`, `blocked`, or `complete`. Scientific state is separate: `pending`, `supported`, `refuted`, `inconclusive`, or `failed-with-diagnosis`.

- `running` requires explicit Cycle approval and an owner.
- `evidence-ready` requires inspectable Evidence, not merely a completed command.
- `diagnosed` identifies the first evidence-supported bottleneck.
- `complete` means the uncertainty is reduced enough to choose the next variable; unfinished optional work is allowed if explained.
- A normal process exit does not imply `supported`.

## Evidence requirements

Evidence must retain command/configuration, seed where relevant, code identity or `unavailable`, input hashes, resource use, and output manifests. Failed and non-finite outcomes are evidence and must remain serializable and inspectable.

When an artifact is consumed downstream, qualify it for that named consumer rather than recording a generic pass. A producer-only schema check is insufficient.

Embed decision-bearing PNG figures in the Markdown report and retain scalable sources such as PDF. Videos are for real temporal or spatial evolution, use a shared visual contract across panels, and include a frame manifest and static keyframe. Put quantitative time histories in separate static plots.
