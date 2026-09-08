# Cycle artifact skeleton

This is a semantic skeleton, not mandatory prose. Add domain-specific detail where it changes the decision.

## `status.md` frontmatter

```yaml
---
artifact: cycle-status
schema_version: 0.1.0
cycle: 01-short-name
execution_state: designed
scientific_state: pending
approval: pending
approved_at: null
owner: null
program_design_revision: OR-YYYY-MM-DD.0
main_variable: concise-variable-name
next_legal_action: request-deliverables-approval
updated_at: YYYY-MM-DD
---
```

## `question.md`

State one primary uncertainty, the discriminating hypothesis, credible alternatives, why the answer matters now, and forbidden conclusions.

## `experiment.md`

Start with a design-consistency matrix that records each consequential item, its canonical source
and value, the Cycle value, its disposition (`inherited`, `explicit-override`, or
`cycle-local-gap`), and the user decision or other resolution provenance. An
`explicit-override` also records its control, promotion Evidence, and rollback. Do not leave an
unresolved mismatch in a materialized Cycle.

Then record the inherited Program design revision, frozen contracts, one main variable, methods
and controls, Evidence criteria fixed before results, diagnostic branches, stopping rules,
resources, provenance requirements, and item-level literature map.

## `deliverables.md`

Each required output names its path, content, readiness condition, and whether it is required for the primary decision. Ask the user to approve this list before execution.

## `tasks.md`

Use stable IDs such as `1.1`, `1.2`, `2.1` only where they create genuine resume boundaries. Each leaf records an output and a completion, rejection, or stop condition. Repeated experimental rounds use a ledger rather than speculative duplicated checklists.

## `decisions.md`

For each change, record the trigger, Evidence, chosen action, rejected alternative, contract impact, approval requirement, and timestamp.

## `results/report.md`

Lead with the answer to the Cycle question. Separate observation from interpretation. Include anomalies and negative results, named artifact eligibility, limitations, reproducible pointers, the first supported bottleneck, and the recommended single next variable. End with a Design Delta Proposal or an explicit statement that none is warranted.
