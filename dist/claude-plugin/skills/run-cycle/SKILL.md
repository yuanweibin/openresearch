---
name: run-cycle
description: Execute an explicitly approved OpenResearch Cycle with lightweight, decision-focused Evidence capture; diagnose the first supported bottleneck and draft a Design Delta Proposal. Use for running or continuing a Cycle; never promote canonical Program design.
---

<!-- generatedBy: openresearch; packageVersion: 0.2.8; workflowVersion: 0.2.8; platform: claude; distribution: plugin; contentHash: 4e51066c1fee4c538a49d406a7d97e1562983cffd196d97276d22d35839db41a -->

# Run an OpenResearch Cycle

Read `openresearch/config.yaml` first. Write all user-facing document prose and artifact labels in
`user_language` unless the user requests another language for a specific output. Keep filenames,
schema keys, identifiers, code, and original source titles unchanged. In a legacy project where the
field is missing, ask once and record it before creating further user-facing artifacts.

Execute the approved scientific contract while preserving research momentum and the user's control plane.

Read the Cycle contract and current execution state. Read only the inherited design files named by
the Cycle, plus:

- [authority and approval](references/authority.md)
- [artifact contract](references/artifact-contract.md) before recording, publishing, or qualifying Evidence
- [literature-map contract](references/literature-map.md) when a design gap or experimental override appears
- [Baseline contract](references/baseline-contract.md) when the Cycle consumes a literature or
  canonical-model comparison

Require explicit user approval of the current contract before affected execution. Approval in the
conversation is immediately operative even when `status.md` has not caught up; recordkeeping does not
create authority. If the latest user instruction and stored artifacts disagree only about execution
ordering or already approved operational scope, follow the user and reconcile the record in parallel.
Stop only when authorization, scientific scope, safety, budget, or held-out boundaries remain unclear.

## Code first, document second

When the conversation or existing artifacts provide enough authority and boundaries to begin, start
writing or running the next code immediately. Do not edit human-readable records first, wait for their
completion, or make them a prerequisite for preparing the executable artifact, command, or job.

If human-readable Cycle records need creation or catch-up and subagents are available, simultaneously
start exactly one documentation subagent. Give it the established user decision, Evidence, affected
files, and the narrow documentation boundary. It may update `status.md`, `tasks.md`, `decisions.md`, and
`results/report.md`; it must not write code, run experiments, change the contract, choose an analysis,
reinterpret Evidence, ask the user, or spawn more agents. The Cycle owner never waits for it. The
documentation subagent reports any unsupported gap without inventing content and ends immediately when
its documentation task is complete.

Without subagent support, deliver code or start the run first, then update human-readable records while
the user uploads, the job queues, or computation runs. Complete the written record no later than result
interpretation, transfer to a new owner, or Cycle conclusion. A user's explicit ordering instruction
takes priority unless it would cross an authorization, safety, budget, or held-out boundary.

Run the approved scientifically sufficient path with the lowest expected total time to
decision-bearing Evidence, through the actual data, code, model, service, and metric path. Count
development, validation, execution, transfer, required user interaction, reruns, and likely rework.
Use the user-selected target scale. Do not insert a smaller pilot when that target run will still be
required regardless of the pilot outcome. A pilot is justified only when it can replace or cancel the
target run, materially reduce expected failure and rework cost, or protect against irreversible
effects, material cost, credential exposure, unsafe execution, or held-out leakage. Put cheap
assertions inside the target run and preserve its first interpretable output or failure.

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

Use one Cycle owner and delegate scientific execution only when it materially benefits. The dedicated
documentation subagent is not an execution owner and receives no decision authority. Let scripts
capture commands, material identities, seeds, resources, raw outputs, and routine failures. Require
exact hashes only when identity affects a conclusion, safety, or consumer eligibility.

Keep human-readable records transition-based as defined by the artifact contract. Do not duplicate
events or edit files for unchanged progress. When the real case fails, repair and resume that same path;
add a regression check only for an observed fault likely to recur. Publish a separate failure artifact
only when it changes a scientific decision, diagnosis, Evidence validity, or safe resumption.

Treat consumed Baselines as read-only and verify their named consumer eligibility plus exact
revision or artifact hash. Keep candidate-specific outputs in the Cycle. If a run becomes a
reusable reference, propose a separate Baseline update instead of silently moving it.

Within a frozen contract, repair recoverable engineering faults and resume from published checkpoints. Do not silently change the main variable, data/case, scientific thresholds, or resource scope.

If the Program design omitted an implementation choice needed by this Cycle, make the least-assumptive literature-supported exploratory choice, label it as a Cycle-local override, record alternatives and rollback, and test it inside this Cycle. An unexpected result triggers diagnosis before expansion.

Conclude by:

1. answering the primary question with `supported`, `refuted`, `inconclusive`, or `failed-with-diagnosis`;
2. locating the first evidence-supported bottleneck rather than attributing failure to the whole chain;
3. identifying the single next variable justified by the Evidence;
4. publishing the required report and media with named consumer eligibility;
5. drafting a Design Delta Proposal when stable, non-anomalous Evidence warrants a new default.

Never edit canonical `openresearch/design/`. Ask the user to approve, reject, or revise any Design Delta Proposal; promotion belongs to `openresearch-update-design`.
