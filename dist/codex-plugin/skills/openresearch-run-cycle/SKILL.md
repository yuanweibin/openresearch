---
name: openresearch-run-cycle
description: Execute an explicitly approved OpenResearch Cycle, continuously publish Evidence, diagnose the first supported bottleneck, and draft a Design Delta Proposal. Use for running or continuing a Cycle; never promote canonical Program design.
---

<!-- generatedBy: openresearch; packageVersion: 0.2.0; workflowVersion: 0.2.0; platform: codex; distribution: plugin; contentHash: cc9d5605e820c7b6bf31edd4b29c80b9acb5f1db548a02a654deb2b9bf41ec56 -->

# Run an OpenResearch Cycle

Execute the approved scientific contract while preserving the user's research control plane.

Read the complete Cycle, inherited Program design, and:

- [authority and approval](references/authority.md)
- [artifact contract](references/artifact-contract.md)
- [literature-map contract](references/literature-map.md) when a design gap or experimental override appears
- [Baseline contract](references/baseline-contract.md) when the Cycle consumes a literature or
  canonical-model comparison

Do not start unless `status.md` records explicit user approval of the current deliverables and contract. If approval is missing or the artifacts disagree, stop and report the exact gate.

When the host supports subagents, delegate execution to one clearly named Cycle owner and keep the main conversation available for scientific discussion and progress reports. The owner may coordinate workers or devices but is the sole writer of the live ledger. If delegation is unavailable, state the degraded mode and preserve the same artifact and reporting contract.

At launch, record owner, commands, environment, inputs, hashes, resources, and the next Evidence checkpoint. Update `status.md`, `tasks.md`, and `decisions.md` at durable artifact boundaries. Report immediately when Evidence becomes ready, a stop condition fires, a frozen choice must change, or an unrecoverable block appears; otherwise use the configured heartbeat interval.

Treat consumed Baselines as read-only and verify their named consumer eligibility plus exact
revision or artifact hash. Keep candidate-specific outputs in the Cycle. If a run becomes a
reusable reference, propose a separate Baseline update instead of silently moving it.

Within a frozen contract, repair recoverable engineering faults and resume from published checkpoints. Do not silently change the main variable, data/case, scientific thresholds, or resource scope. Preserve failed, rejected, partial, and non-finite outcomes as serializable Evidence.

If the Program design omitted an implementation choice needed by this Cycle, make the smallest literature-supported exploratory choice, label it as a Cycle-local override, record alternatives and rollback, and test it inside this Cycle. An unexpected result triggers diagnosis before expansion.

Conclude by:

1. answering the primary question with `supported`, `refuted`, `inconclusive`, or `failed-with-diagnosis`;
2. locating the first evidence-supported bottleneck rather than attributing failure to the whole chain;
3. identifying the single next variable justified by the Evidence;
4. publishing the required report and media with named consumer eligibility;
5. drafting a Design Delta Proposal when stable, non-anomalous Evidence warrants a new default.

Never edit canonical `openresearch/design/`. Ask the user to approve, reject, or revise any Design Delta Proposal; promotion belongs to `openresearch-update-design`.
