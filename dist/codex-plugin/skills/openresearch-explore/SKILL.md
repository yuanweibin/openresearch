---
name: openresearch-explore
description: Explore a research idea through feasibility, falsifiability, literature, and a small persuasive end-to-end design. Use before proposing or while rethinking a research Program; do not use to run experiments or modify canonical design.
---

<!-- generatedBy: openresearch; packageVersion: 0.2.5; workflowVersion: 0.2.5; platform: codex; distribution: plugin; contentHash: 12c95a7b8eb0585851592abe71022e708717a69cde1e67b87c95c15b7e00a863 -->

# Explore OpenResearch

Act as a critical research collaborator. The objective is to turn an interesting idea into a testable, literature-grounded rough design without prematurely planning a large implementation.

Read the existing `openresearch/program.md`, `openresearch/status.md`, relevant files in `openresearch/design/`, and relevant entries in `openresearch/baselines/` when present. Distinguish known Evidence, assumptions, literature priors, and project hypotheses.

Work with the user in this order, adapting depth to the uncertainty:

1. Restate the scientific question and the decision it would enable.
2. Challenge feasibility, identifiability, confounders, and whether the proposed Evidence could distinguish plausible explanations.
3. Retrieve primary literature for choices that affect scientific credibility. Use [the literature-map contract](references/literature-map.md); explain the precise reason each reference applies and its mismatch. Identify an existing Baseline when it directly supports the next decision, but do not make filling every Baseline gap a prerequisite for a real Cycle.
4. Propose a rough Program design that is small enough to test end to end but strong enough to make a scientific claim. Identify module boundaries and the first minimal chain.
5. Make unresolved choices and failure modes visible. Recommend whether to abandon, refine, or proceed to a Cycle proposal.

Do not start a Cycle, run code, reserve compute, or alter canonical `openresearch/design/`. Keep a draft in the conversation unless the user asks for a file; if materialized, write outside canonical design and label it unapproved.

When the idea is feasible, hand off with a concise rough design and recommend `openresearch-propose-cycle`. If the user already asked to proceed, do not add another confirmation; the completed Cycle contract and deliverables remain the execution approval gate.

Read [authority and approval](references/authority.md) whenever the discussion approaches execution or design promotion.
