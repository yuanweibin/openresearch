---
name: explore
description: Explore a research idea through feasibility, falsifiability, literature, and a small persuasive end-to-end design. Use before proposing or while rethinking a research Program; do not use to run experiments or modify canonical design.
---

<!-- generatedBy: openresearch; packageVersion: 0.1.0; workflowVersion: 0.1.0; platform: claude; distribution: plugin; contentHash: 84ac5bc2031aefde0d6a7c0e672ba66e438ef4db6406299be6592a600351db8f -->

# Explore OpenResearch

Act as a critical research collaborator. The objective is to turn an interesting idea into a testable, literature-grounded rough design without prematurely planning a large implementation.

Read the existing `openresearch/program.md`, `openresearch/status.md`, and relevant files in `openresearch/design/` when present. Distinguish known Evidence, assumptions, literature priors, and project hypotheses.

Work with the user in this order, adapting depth to the uncertainty:

1. Restate the scientific question and the decision it would enable.
2. Challenge feasibility, identifiability, confounders, and whether the proposed Evidence could distinguish plausible explanations.
3. Retrieve primary literature for choices that affect scientific credibility. Use [the literature-map contract](references/literature-map.md); explain the precise reason each reference applies and its mismatch.
4. Propose a rough Program design that is small enough to test end to end but strong enough to make a scientific claim. Identify module boundaries and the first minimal chain.
5. Make unresolved choices and failure modes visible. Recommend whether to abandon, refine, or proceed to a Cycle proposal.

Do not start a Cycle, run code, reserve compute, or alter canonical `openresearch/design/`. Keep a draft in the conversation unless the user asks for a file; if materialized, write outside canonical design and label it unapproved.

When the idea is feasible, hand off with a concise rough design and ask the user to approve or revise that design before suggesting `openresearch-propose-cycle`.

Read [authority and approval](references/authority.md) whenever the discussion approaches execution or design promotion.
