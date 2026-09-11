---
name: openresearch-run-cycle
description: Execute an explicitly approved OpenResearch Cycle with lightweight, decision-focused Evidence capture; diagnose the first supported bottleneck and draft a Design Delta Proposal. Use for running or continuing a Cycle; never promote canonical Program design.
---

<!-- generatedBy: openresearch; packageVersion: 0.2.2; workflowVersion: 0.2.2; platform: codex; distribution: plugin; contentHash: 64239c82c4b87a89a0b9593b8df928fd328ee3611e55124fe38cfe2b3c4b41dc -->

# Run an OpenResearch Cycle

Execute the approved scientific contract while preserving research momentum and the user's control plane.

Read the Cycle contract and current execution state. Read only the inherited design files named by
the Cycle, plus:

- [authority and approval](references/authority.md)
- [artifact contract](references/artifact-contract.md) when publishing or qualifying Evidence
- [literature-map contract](references/literature-map.md) when a design gap or experimental override appears
- [Baseline contract](references/baseline-contract.md) when the Cycle consumes a literature or
  canonical-model comparison

Do not start unless `status.md` records explicit user approval of the current deliverables and contract. If approval is missing or the artifacts disagree, stop and report the exact gate.

Use one clearly named Cycle owner. Delegate only when long-running or parallel execution materially
benefits; do not create coordination work solely to satisfy the protocol. The owner is the sole writer
of Cycle state.

At launch, set the owner and next Evidence checkpoint. Capture commands, code and input identity,
seeds, material environment details, and resource use in machine-readable run metadata or raw-output
manifests. Exact hashes are required only when identity affects reproducibility, safety, or downstream
eligibility.

Human-readable records are transition-based:

- update `status.md` only when the macro execution or scientific state, latest decision-bearing
  Evidence, next checkpoint, or next legal action changes;
- update a `tasks.md` leaf only when its state or resume boundary changes; do not append a diary of
  retries, polling, or unchanged progress;
- write `decisions.md` only for deviations, anomalies, or choices that affect the frozen contract,
  scientific interpretation, consumer eligibility, or safe resumption;
- update `results/report.md` when Evidence becomes decision-ready, a stop is diagnosed, or the Cycle
  concludes; and
- never duplicate an event across files. Use chat for progress; unchanged state causes no file edit.

Let scripts write raw outputs, manifests, and routine engineering logs. Authentication, queueing,
transport, retries, and recoverable faults stay there unless they change a stop condition, Evidence
validity, or safe resumption. Create a separate failed, partial, rejected, or non-finite Evidence
artifact only when it bears on a scientific decision or diagnosis.

Treat consumed Baselines as read-only and verify their named consumer eligibility plus exact
revision or artifact hash. Keep candidate-specific outputs in the Cycle. If a run becomes a
reusable reference, propose a separate Baseline update instead of silently moving it.

Within a frozen contract, repair recoverable engineering faults and resume from published checkpoints. Do not silently change the main variable, data/case, scientific thresholds, or resource scope.

If the Program design omitted an implementation choice needed by this Cycle, make the smallest literature-supported exploratory choice, label it as a Cycle-local override, record alternatives and rollback, and test it inside this Cycle. An unexpected result triggers diagnosis before expansion.

Conclude by:

1. answering the primary question with `supported`, `refuted`, `inconclusive`, or `failed-with-diagnosis`;
2. locating the first evidence-supported bottleneck rather than attributing failure to the whole chain;
3. identifying the single next variable justified by the Evidence;
4. publishing the required report and media with named consumer eligibility;
5. drafting a Design Delta Proposal when stable, non-anomalous Evidence warrants a new default.

Never edit canonical `openresearch/design/`. Ask the user to approve, reject, or revise any Design Delta Proposal; promotion belongs to `openresearch-update-design`.
