# Authority and approval

OpenResearch separates discussion, Cycle execution, and canonical design authority.

## Write boundaries

| Area | Owner | Who may change it |
|---|---|---|
| `openresearch/program.md` | Researcher | User-directed Program revision |
| `openresearch/design/` | Canonical Program design | `openresearch-update-design` after explicit user approval |
| `openresearch/cycles/<id>/` | One Cycle | `openresearch-propose-cycle` while designing; `openresearch-run-cycle` after approval |
| Generated agent skills | OpenResearch CLI | `openresearch init` or `openresearch update` |

Approval must be attributable to a user message and scoped to a concrete artifact revision. Agent inference, a successful process exit, or an unchecked objection is not approval.

Before running a Cycle, its `status.md` must record `approval: approved` and an `approved_at` value. Before promoting a Design Delta, the proposal and the user's approval must be identified in `design/decisions.md`.

If the user changes the Cycle while it is running, record the decision before the next Evidence boundary. Changes to the main variable, scientific thresholds, data, case, or resource scope require renewed approval. Recoverable engineering changes that preserve the frozen contract do not.

## Canonical design rule

A Cycle may test an explicit override to a frozen design item. It may not silently turn that override into the new default. At Cycle end, describe the supporting and conflicting Evidence in a Design Delta Proposal. Only `openresearch-update-design` may promote an approved proposal and advance the Program design revision.
