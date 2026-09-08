---
name: openresearch-propose-cycle
description: Create or coherently revise one OpenResearch Cycle contract, tasks, and user-reviewable deliverables around a single scientific uncertainty. Use when the user wants the next experiment planned; stop before execution until deliverables are explicitly approved.
---

# Propose an OpenResearch Cycle

Turn one primary uncertainty into the smallest convincing experimental contract. A Cycle is not a software milestone and is not required to enumerate every possible future task.

Before writing, read the Program, current status, relevant frozen Program design, design decisions, and prior Cycle Evidence. Read:

- [artifact contract](references/artifact-contract.md)
- [Cycle skeleton](references/cycle-template.md)
- [literature-map contract](references/literature-map.md)
- [authority and approval](references/authority.md)

Before creating or revising any Cycle artifact, run a design-consistency preflight against the
current approved Program design revision. Map every consequential setting in the user's request
and the proposed experiment to its exact design file/item, then classify it as inherited,
Cycle-local because the Program design is silent, a deviation from a declared non-frozen default,
or conflicting with a frozen item. Replacing, relaxing, or bypassing any declared default is a
mismatch even when the alternative is scientifically reasonable; doing so to a frozen item is a
conflict. Check all canonical occurrences of the mapped item rather than selecting one convenient
source. If design files disagree with each other or carry incompatible revision/approval state,
treat the design itself as unresolved.

Resolve every mismatch before writing files:

- If the user explicitly asks to test the conflicting value for this Cycle only, preserve it as
  an experimental override with its control, promotion Evidence, and rollback.
- If the user appears to intend a new cross-Cycle default, or the intended scope is ambiguous,
  stop before any Cycle file write. Show the exact canonical item, current value, proposed value,
  and affected Cycle assumption, then ask whether to update the canonical design first through
  `openresearch-update-design` or keep the change as an explicit Cycle-local override.
- Do not infer Cycle-local intent from silence or from a request to create the Cycle. If the current
  design revision is missing, not approved, or internally inconsistent, route to
  `openresearch-update-design` before proposing a Cycle.

After resolution, put a compact design-consistency matrix in `experiment.md` with the canonical
source, inherited value, Cycle value, disposition, and resolution provenance. No unresolved
mismatch may appear in a materialized Cycle. When there is no mismatch, identify the checked
design revision in the final approval request.

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
