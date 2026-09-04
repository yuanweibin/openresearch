---
name: openresearch-propose-cycle
description: Create or coherently revise one OpenResearch Cycle contract, tasks, and user-reviewable deliverables around a single scientific uncertainty. Use when the user wants the next experiment planned; stop before execution until deliverables are explicitly approved.
---

<!-- generatedBy: openresearch; packageVersion: 0.2.0; workflowVersion: 0.2.0; platform: codex; distribution: plugin; contentHash: 9f42b546408fdafb0147688a51c9b5766e60184074e9b34a42efd9062057b366 -->

# Propose an OpenResearch Cycle

Turn one primary uncertainty into the smallest convincing experimental contract. A Cycle is not a software milestone and is not required to enumerate every possible future task.

Before writing, read the Program, current status, relevant frozen Program design, design decisions, and prior Cycle Evidence. Read:

- [artifact contract](references/artifact-contract.md)
- [Cycle skeleton](references/cycle-template.md)
- [literature-map contract](references/literature-map.md)
- [authority and approval](references/authority.md)

Select the next unused two-digit global sequence. Create or revise the complete Cycle as one coherent unit: `question.md`, `experiment.md`, `deliverables.md`, `tasks.md`, `status.md`, and `decisions.md`. Do not patch one artifact while leaving contradictions in the others.

The contract must:

- inherit an identified Program design revision and list the frozen items actually relevant to this Cycle;
- vary one main scientific variable, with controls sufficient to attribute the result;
- declare any experimental override, promotion Evidence, and rollback;
- pre-register the Evidence criteria and forbidden conclusions before results are visible;
- define stopping and diagnostic branches that prevent expensive work after the primary question is already answered;
- name compute/data assumptions without turning resource availability into a scientific rationale;
- tie consequential settings to item-level literature evidence or mark them `project-hypothesis`;
- make every required deliverable inspectable at a named path with a readiness condition.
- identify every consumed Baseline by stable ID/revision or hash, its eligibility, and the exact
  setup match; do not make the Cycle silently rebuild a reusable literature benchmark.

Use two-level tasks only where the boundary helps another agent resume without repeating long work. Keep repeated rounds in a live ledger.

Finish with a compact explanation of what this Cycle can and cannot conclude, then explicitly request the user's confirmation of the deliverables. Leave `execution_state: designed` and `approval: pending`. Do not run experiments, start a background owner, or mark approval on the user's behalf.
