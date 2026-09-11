# Artifact contract

Use the smallest artifact set that makes the scientific decision inspectable and resumable.

## Program layer

- `openresearch/program.md`: long-lived question, intended contribution, module boundaries, and overall conclusion standard.
- `openresearch/status.md`: current Program design revision, active Cycles, owner, approval state, latest Evidence, and next legal action.
- `openresearch/design/README.md`: current design revision and index of frozen design contracts.
- `openresearch/design/references.md`: citation records used by design literature maps.
- `openresearch/design/decisions.md`: approved design promotions and reversals.

## Baseline layer

Baselines live below `openresearch/baselines/<stable-slug>/` and follow the
[Baseline contract](baseline-contract.md). They preserve reusable paper-reported, solver-
reproduction, and setup-extension Evidence separately. Every completed result has both indexed
raw numeric output and an inspectable PNG; scalable figures are retained when practical.

A Baseline is read-only to Cycles. A Cycle records the exact Baseline revision or hash it
consumed, while candidate-specific results remain in that Cycle.

## Cycle layer

Use a two-digit, monotonically increasing creation sequence: `cycles/01-name/`, `cycles/02-name/`. Never reorder or reuse a sequence.

Every proposed Cycle contains:

- `question.md`: one primary uncertainty, hypothesis, alternatives, and what the Cycle will not conclude.
- `experiment.md`: inherited design revision, a resolved design-consistency matrix, frozen variables, one main variable, experimental overrides, controls, methods, Evidence criteria, stopping rules, resources, provenance, and literature map.
- `deliverables.md`: the exact user-reviewable outputs and the condition that makes each deliverable ready.
- `tasks.md`: two-level stable task IDs where each leaf has an action, artifact or observation, completion/rejection condition, and resume boundary.
- `status.md`: execution state, scientific state, approval, owner, progress, latest Evidence, next checkpoint, and next legal action.
- `decisions.md`: timestamped deviations, anomalies, and decisions with their Evidence basis.

During execution, publish results below `results/`. Keep `results/report.md` as the decision-oriented report and version-controlled figures, previews, and manifests under `results/assets/`.

## Execution recording policy

The Cycle contract is comprehensive before approval; the live execution record is intentionally
sparse. Record state transitions and decision-bearing Evidence, not a prose transcript of tool calls.

- `status.md` is the current macro state, not an event log.
- `tasks.md` changes when a leaf state or resume boundary changes, not after each retry or poll.
- `decisions.md` contains scientifically or operationally consequential choices and anomalies, not
  routine engineering activity.
- `results/report.md` is updated at decision boundaries, not continuously.
- Machine-generated logs and manifests hold commands, routine failures, timestamps, and file-level
  provenance. Link them rather than duplicating their contents in Markdown.

Escalate recording detail for expensive, claim-bearing, externally consumed, or user-designated
strict runs. Use the lightweight policy by default for scouting and feasibility work.

## State semantics

Execution state is one of `designed`, `running`, `evidence-ready`, `diagnosed`, `blocked`, or `complete`. Scientific state is separate: `pending`, `supported`, `refuted`, `inconclusive`, or `failed-with-diagnosis`.

- `running` requires explicit Cycle approval and an owner.
- `evidence-ready` requires inspectable Evidence, not merely a completed command.
- `diagnosed` identifies the first evidence-supported bottleneck.
- `complete` means the uncertainty is reduced enough to choose the next variable; unfinished optional work is allowed if explained.
- A normal process exit does not imply `supported`.

## Evidence requirements

Decision-bearing Evidence must retain enough provenance to reproduce the conclusion: command and
configuration, seed where relevant, material code and input identity, resource use when consequential,
and an output manifest. Exact hashes are required when identity affects the conclusion, safety, or a
named downstream consumer. Failed and non-finite outcomes that affect a decision or diagnosis must
remain serializable and inspectable; routine failed attempts may remain in machine logs.

When an artifact is consumed downstream, qualify it for that named consumer rather than recording a generic pass. A producer-only schema check is insufficient.

Embed decision-bearing PNG figures in the Markdown report and retain scalable sources such as PDF. Videos are for real temporal or spatial evolution, use a shared visual contract across panels, and include a frame manifest and static keyframe. Put quantitative time histories in separate static plots.
