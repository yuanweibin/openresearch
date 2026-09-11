---
name: openresearch-propose-cycle
description: Create or coherently revise one OpenResearch Cycle contract, tasks, and user-reviewable deliverables around a single scientific uncertainty. Use when the user wants the next experiment planned; stop before execution until deliverables are explicitly approved.
---

# Propose an OpenResearch Cycle

Read `openresearch/config.yaml` first. Write all user-facing document prose and artifact labels in
`user_language` unless the user requests another language for a specific output. Keep filenames,
schema keys, identifiers, code, and original source titles unchanged. In a legacy project where the
field is missing, ask once and record it before creating further user-facing artifacts.

Turn one primary uncertainty into a focused, convincing experimental contract. A Cycle is not a software milestone and is not required to enumerate every possible future task.

Before writing, read the Program, current status, the design files used by this uncertainty, and
relevant prior Evidence. Read:

- [artifact contract](references/artifact-contract.md)
- [Cycle skeleton](references/cycle-template.md)
- [literature-map contract](references/literature-map.md)
- [authority and approval](references/authority.md)

Design the scientifically sufficient end-to-end path with the lowest expected total time to the next
decision-bearing Evidence. Count development, validation, execution, data transfer, required user
interaction, reruns, and likely rework. Its first executable task should exercise the actual data,
code, model, service, and metric path at the user-selected target scale. Do not reduce that scale or
insert a smaller pilot when the target run will still be required regardless of the pilot outcome.
Use a pilot only when it can replace or cancel the target run, materially reduce expected failure and
rework cost, or protect against irreversible effects, material cost, credential exposure, unsafe
execution, or held-out leakage. Put cheap assertions inside the target run.

Choose an execution topology before defining tasks:

- for local work or remote systems the agent controls through API or SSH, allow modular scripts and
  multiple jobs, orchestrated without user involvement;
- for user-mediated remote systems, minimize manual handoffs by preparing one complete handoff per
  scientifically necessary phase, with internal checks continuing automatically when they pass;
- place high-volume data access and reduction near the data, then transfer compact outputs for local
  calibration, statistics, fitting, plotting, and reporting when those can iterate faster locally; and
- preserve genuine phase boundaries for approval, resource expansion, or held-out isolation.

Optimize time to meaningful Evidence and required user attention, not the number of scripts or jobs.

Perform a targeted design check. Identify the approved design revision and inspect only frozen items
the real case relies on or changes. Record explicit Cycle-local deviations and rollback in
`experiment.md`; approval of the complete Cycle authorizes those deviations for this Cycle. Ask a
separate scope question only when the user may intend a new cross-Cycle default or the canonical
design is internally inconsistent. Do not create an exhaustive consistency matrix when there is no
material deviation.

Select the next unused two-digit global sequence. Create or revise the complete Cycle as one coherent unit: `question.md`, `experiment.md`, `deliverables.md`, `tasks.md`, `status.md`, and `decisions.md`. Do not patch one artifact while leaving contradictions in the others.

The contract must:

- inherit an identified Program design revision and list the frozen items actually relevant to this Cycle;
- vary one main scientific variable, with the minimum controls needed to distinguish credible alternatives;
- declare any experimental override, promotion Evidence, and rollback;
- pre-register the Evidence criteria and forbidden conclusions before results are visible;
- set a resource cap, held-out boundary where relevant, and stop condition;
- tie choices that affect interpretation to literature evidence or mark them `project-hypothesis`;
- require only deliverables needed for the primary decision; and
- identify every consumed Baseline by stable ID/revision or hash, its eligibility, and the exact
  setup match; do not make the Cycle silently rebuild a reusable literature benchmark.

Use two-level tasks only for genuine resume boundaries. Do not represent validation as a separate
task when it can be an assertion inside the real run. Add targeted regression checks after an
observed failure only when they are likely to prevent recurrence. Put preparation of the complete
user-mediated phase before optional documentation whenever user time is on the execution critical
path.

Finish with a compact explanation of what this Cycle can and cannot conclude, then explicitly request the user's confirmation of the deliverables. Leave `execution_state: designed` and `approval: pending`. Do not run experiments, start a background owner, or mark approval on the user's behalf.
