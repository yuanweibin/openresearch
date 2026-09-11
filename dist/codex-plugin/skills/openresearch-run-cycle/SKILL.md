---
name: openresearch-run-cycle
description: Execute an explicitly approved OpenResearch Cycle with lightweight, decision-focused Evidence capture; diagnose the first supported bottleneck and draft a Design Delta Proposal. Use for running or continuing a Cycle; never promote canonical Program design.
---

<!-- generatedBy: openresearch; packageVersion: 0.2.5; workflowVersion: 0.2.5; platform: codex; distribution: plugin; contentHash: 8ed67384785f6b574eaedc717efbd30652a05c4327af60b4f8ec987b1e645195 -->

# Run an OpenResearch Cycle

Execute the approved scientific contract while preserving research momentum and the user's control plane.

Read the Cycle contract and current execution state. Read only the inherited design files named by
the Cycle, plus:

- [authority and approval](references/authority.md)
- [artifact contract](references/artifact-contract.md) before recording, publishing, or qualifying Evidence
- [literature-map contract](references/literature-map.md) when a design gap or experimental override appears
- [Baseline contract](references/baseline-contract.md) when the Cycle consumes a literature or
  canonical-model comparison

Do not start unless `status.md` records explicit user approval of the current deliverables and contract. If approval is missing or the artifacts disagree, stop and report the exact gate.

Run the smallest bounded scientifically real case first, through the actual data, code, model,
service, and metric path. Use inline assertions and preserve the first interpretable output or
failure. Do not substitute mocks, dry runs, import-only jobs, capability probes, synthetic cases, or
environment audits merely because the real path is uncertain. A standalone validation is justified
only when it is substantially cheaper and exercises the same likely failure, or when it protects
against irreversible effects, material cost, credential exposure, unsafe execution, or held-out
leakage.

Choose the execution boundary by control and data locality:

- locally, or on a remote system available through working API or SSH access, decompose and run
  focused scripts or jobs freely without involving the user;
- when the user must operate a remote system, prepare the complete next scientific phase before asking
  them to act and avoid manual pauses that can be automated inside that phase;
- keep high-volume reads and reductions near the remote data, then download compact outputs and do
  iterative calibration, controls, statistics, fitting, plotting, and reporting locally when practical;
  and
- separate phases when approval, resource limits, or held-out isolation genuinely require it.

Minimize user attention and time to meaningful Evidence, not script count. Use remote runtime or queue
time for local analysis preparation and optional documentation. Pause only for authorization, a safety
boundary, or a scientific choice outside the approved contract.

Use one Cycle owner and delegate only when execution materially benefits. At launch set the owner and
next Evidence checkpoint; let scripts capture commands, material identities, seeds, resources, raw
outputs, and routine failures. Require exact hashes only when identity affects a conclusion, safety, or
consumer eligibility.

Keep human-readable records transition-based as defined by the artifact contract. Do not duplicate
events or edit files for unchanged progress. When the real case fails, repair and resume that same path;
add a regression check only for an observed fault likely to recur. Publish a separate failure artifact
only when it changes a scientific decision, diagnosis, Evidence validity, or safe resumption.

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
