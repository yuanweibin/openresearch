# OpenResearch design

## Why a research protocol is different

Software delivery usually asks whether specified behavior was implemented. Research asks whether an important uncertainty was reduced by interpretable Evidence. OpenResearch therefore uses different core objects:

| Software workflow | OpenResearch |
|---|---|
| requirement | research question or hypothesis |
| implementation task | experiment or diagnostic |
| acceptance test | pre-registered Evidence criterion |
| pass/fail | supported, refuted, inconclusive, or failed-with-diagnosis |
| completed change | enough uncertainty reduction to choose the next variable |

The default strategy is to build a small but scientifically persuasive end-to-end chain, inspect its failure, and deepen only the first evidence-supported bottleneck. It is not to productionize every module before observing the complete chain.

## Research objects

- **Program** holds the long-lived question, intended contribution, module boundaries, and overall conclusion standard.
- **Program design** is the current cross-Cycle contract: numerical choices, data strategy, model representation, objectives, and other frozen defaults. Every consequential design item includes a literature map explaining why a source applies and where it does not.
- **Cycle** reduces one primary uncertainty while changing one main variable.
- **Experiment** is a reproducible run with configuration, inputs, code identity, resources, and output manifest.
- **Evidence** is an observation capable of changing a research decision, including negative and failed outcomes.
- **Decision** explains the next action and why competing actions were not selected.

## Approval loop

```text
user idea
  -> critical exploration + literature
  -> rough Program design
  -> user approval
  -> Cycle contract + deliverables
  -> user approval
  -> execution + live Evidence + diagnosis
  -> Design Delta Proposal
  -> user approval
  -> canonical Program design revision
```

An agent may make the smallest literature-supported Cycle-local exploratory choice when a required detail is missing. It must record the choice as an override and preserve rollback. If the result is stable and non-anomalous, the Cycle proposes a design delta; it never promotes the delta itself.

## Control plane and execution plane

The main user conversation is the research control plane. On hosts with subagent support, an approved Cycle is delegated to one execution owner, who maintains the live task ledger and artifacts. The main conversation reports milestones, explains scientific implications, and retains authority over changes to the main variable, thresholds, data, case, or resource scope.

This is a semantic capability rule, not a dependency on one vendor's subagent API. A host without delegation support may execute in a declared degraded mode while preserving the same approval and artifact boundaries.

## Write authority

| Workflow | May write | May not write |
|---|---|---|
| Explore | unapproved drafts when requested | Cycle execution or canonical design |
| Propose Cycle | coherent Cycle contract and deliverables | running state or Evidence |
| Run Cycle | approved Cycle artifacts and results | canonical Program design |
| Update Design | approved canonical design revision | experiment outputs or reinterpretation |

## Literature traceability

Each consequential design choice stores:

- relation: `adopted`, `adapted`, `motivation-only`, or `project-hypothesis`;
- stable reference;
- exact element borrowed;
- conditions that match;
- material deviations and claims the source cannot support;
- local Cycle Evidence that supports or revises the choice.

This prevents “the same Reynolds number” or “a similar architecture” from being overstated as full validation by a paper.

## Evidence and media

Evidence is qualified for named consumers such as `training-eligible`, `soft-ad-eligible`, or `external-replay-eligible`; a generic producer-side pass is insufficient. Failure artifacts remain serializable and published. Long runs distinguish smoke eligibility, completed trajectory, and scientific qualification.

Decision-bearing figures are embedded in Markdown and retained in a scalable format. Videos are used only for genuine evolution, carry a shared visual contract and frame manifest, and do not replace quantitative time-history plots.

## Distribution architecture

Canonical workflow text lives once under `workflows/`. The build renders agent-specific views:

```text
workflows/                       canonical source
  -> .agents/skills/...          Codex project adapter
  -> .claude/skills/...          Claude Code project adapter
  -> dist/codex-plugin/...       native Codex plugin
  -> dist/claude-plugin/...      native Claude plugin
```

Generated project skills carry a content hash and management manifest. Updates preflight all installed skills, refuse modified or unmanaged destinations, and never rewrite researcher-owned Program, design, Cycle, or Evidence files.

Four version axes remain independent:

- package version: CLI distribution;
- workflow version: skill behavior contract;
- artifact schema version: machine-readable artifact shape;
- Program design revision: the individual research project's scientific defaults.
