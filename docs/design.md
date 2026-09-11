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

The default strategy is to run a small but scientifically real end-to-end case, inspect its output or
failure, and deepen only the first evidence-supported bottleneck. It is not to validate or
productionize every module before observing the actual research path.

## Research objects

- **Program** holds the long-lived question, intended contribution, module boundaries, and overall conclusion standard.
- **Program design** is the current cross-Cycle contract: numerical choices, data strategy, model representation, objectives, and other frozen defaults. Every consequential design item includes a literature map explaining why a source applies and where it does not.
- **Baseline** is a reusable comparison coordinate that keeps the authoritative source setup,
  paper-reported or digitized data, project solver reproduction, and clearly labelled setup
  extensions. It always publishes raw numeric output together with inspectable figures.
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
  -> one claim-bearing Baseline slice when needed
  -> Cycle contract + deliverables
  -> user approval
  -> execution + live Evidence + diagnosis
  -> Design Delta Proposal
  -> user approval
  -> canonical Program design revision
```

An agent may make the smallest literature-supported Cycle-local exploratory choice when a required detail is missing. It must record the choice as an override and preserve rollback. If the result is stable and non-anomalous, the Cycle proposes a design delta; it never promotes the delta itself.

Before writing a Cycle contract, the proposing agent compares only the settings its real case relies
on or changes with relevant frozen items in the approved Program design. A clearly labelled deviation
in the proposed contract becomes Cycle-local when the user approves that complete contract. Ask a
separate scope question only when the user may intend a new cross-Cycle default or canonical design
files conflict. Canonical promotion still uses the Update Design approval gate.

## Control plane and execution plane

The main user conversation is the research control plane. Every approved Cycle has one execution owner, who maintains Cycle state and artifacts. Delegate only when long-running or parallel work materially benefits. The main conversation reports milestones, explains scientific implications, and retains authority over changes to the main variable, thresholds, data, case, or resource scope.

Execution records are transition-based rather than activity-based. Scripts and manifests retain routine
commands, retries, and engineering failures. Human-readable Cycle files change only when task state,
the safe resume boundary, scientific interpretation, Evidence eligibility, or the next legal action
changes. Scouting and feasibility work use this lightweight default; expensive or claim-bearing runs
may require stricter provenance.

## Validation economy

Validation is not a mandatory stage before research execution. The default is a bounded real vertical
slice through the actual data, code, model, service, and metric path. Cheap assertions run inside that
case; observed failures motivate targeted checks and repairs in the same path.

A standalone mock, dry run, probe, synthetic case, or environment audit is justified only when it is
substantially cheaper and exercises the same likely failure, or when it protects against irreversible
effects, material cost, credential exposure, unsafe execution, source-rights violations, or held-out
leakage. If validation costs about as much as the real slice or exercises a different path, run the
real slice.

User time is part of the experimental resource budget, but script count is not the optimization
target. Local work and remote systems available through API or SSH may use any useful number of
agent-orchestrated modules and jobs. When the user must operate a remote system, the agent batches work
into the fewest scientifically valid phases and prepares each phase before requesting action. Bulk data
access and reduction stay near the data; compact outputs move to the environment where downstream
analysis can iterate fastest. Approval, resource limits, and held-out isolation may require separate
phases. Optional documentation is completed while remote work runs or waits in a queue.

This is a semantic capability rule, not a dependency on one vendor's subagent API. A host without delegation support follows the same approval and Evidence boundaries without treating ordinary single-agent execution as degraded.

## Write authority

| Workflow | May write | May not write |
|---|---|---|
| Explore | unapproved drafts when requested | Cycle execution or canonical design |
| Build Baseline | one approved reusable Baseline, raw outputs, and figures | Cycle Evidence or canonical design |
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

Evidence is qualified for named consumers such as `training-eligible`, `soft-ad-eligible`, or `external-replay-eligible`; a generic producer-side pass is insufficient. Decision-bearing failure artifacts remain serializable and published. Long runs distinguish a bounded real slice, completed trajectory, and scientific qualification.

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
