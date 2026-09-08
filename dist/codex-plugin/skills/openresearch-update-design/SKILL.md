---
name: openresearch-update-design
description: Establish the first user-approved OpenResearch Program design or promote an explicitly approved Cycle Design Delta into a new canonical revision. This is the sole workflow allowed to modify openresearch/design/ and it does not run experiments.
---

<!-- generatedBy: openresearch; packageVersion: 0.2.1; workflowVersion: 0.2.1; platform: codex; distribution: plugin; contentHash: 4ce1af24ba8c51ed3638a34122d7c994a3bd2025980e3a2f6b1167ec0ed06f50 -->

# Update OpenResearch Design

Maintain the canonical, cross-Cycle research design without turning every experimental observation into a new default.

Read [authority and approval](references/authority.md), [artifact contract](references/artifact-contract.md), and [literature-map contract](references/literature-map.md). Identify either:

- an explicitly user-approved first Program design; or
- a concrete Cycle Design Delta Proposal and the user's explicit approval of that proposal.

If approval is absent, ambiguous, or applies to a different revision, do not modify canonical design. Explain the exact proposed delta and request approval.

When approved:

1. verify the cited Cycle and/or Baseline Evidence and disclose anomalies, contradictory Evidence, scope, and consumer eligibility;
2. update only the affected design contracts while preserving unrelated frozen decisions;
3. maintain item-level literature maps, including precise match and deviation fields and links to local Evidence;
4. advance the Program design revision exactly once and update `openresearch/design/README.md`;
5. append a decision record containing the prior and new revision, approval provenance, Evidence, changed defaults, compatibility impact, and rollback;
6. update `openresearch/status.md` so new Cycles inherit the new revision, without rewriting existing Cycle history.

For a literature-motivated change without local Evidence, label it honestly as a project hypothesis or experimental default. Do not claim that publication in a source validates this project's differing setup.

Do not run a Cycle, reinterpret its scientific conclusion, or edit its Evidence. Report the exact canonical files and design items changed.
