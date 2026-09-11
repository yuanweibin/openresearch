---
name: update-design
description: Establish the first user-approved OpenResearch Program design or promote an explicitly approved Cycle Design Delta into a new canonical revision. This is the sole workflow allowed to modify openresearch/design/ and it does not run experiments.
---

<!-- generatedBy: openresearch; packageVersion: 0.2.8; workflowVersion: 0.2.8; platform: claude; distribution: plugin; contentHash: 7f12fd5f1922c1c877e076e2095232ef270f450e75e0fb6b0cb60ffd0ddeadd9 -->

# Update OpenResearch Design

Read `openresearch/config.yaml` first. Write all user-facing document prose and artifact labels in
`user_language` unless the user requests another language for a specific output. Keep filenames,
schema keys, identifiers, code, and original source titles unchanged. In a legacy project where the
field is missing, ask once and record it before creating further user-facing artifacts.

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
