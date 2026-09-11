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

Record the inherited Program design revision, the frozen items the real case actually relies on, and
any explicit Cycle-local deviation with its promotion Evidence and rollback. A short list is enough;
do not inventory unrelated settings or require a matrix when there is no material deviation.

Define the smallest scientifically real end-to-end case, one main variable, minimum useful controls,
Evidence criteria fixed before results, resource and held-out limits, stopping rules, and only the
provenance and literature links needed to interpret the result.

## `deliverables.md`

Each required output names its path, content, readiness condition, and whether it is required for the primary decision. Ask the user to approve this list before execution.

## `tasks.md`

Use stable IDs such as `1.1`, `1.2`, `2.1` only where they create genuine resume boundaries. The first
executable leaf normally runs the bounded real case. Put cheap checks inside it instead of creating a
preflight ladder. When the user operates a remote system, make that leaf one complete runnable handoff
rather than a sequence of uploads and test commands. Each leaf records an output and a completion,
rejection, or stop condition.

## `decisions.md`

For each change, record the trigger, Evidence, chosen action, rejected alternative, contract impact, approval requirement, and timestamp.

## `results/report.md`

Lead with the answer to the Cycle question. Separate observation from interpretation. Include anomalies and negative results, named artifact eligibility, limitations, reproducible pointers, the first supported bottleneck, and the recommended single next variable. End with a Design Delta Proposal or an explicit statement that none is warranted.
