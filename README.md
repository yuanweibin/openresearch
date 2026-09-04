# OpenResearch

OpenResearch is an evidence-driven workflow for research with coding agents. It keeps a small, literature-grounded Program design above short experimental Cycles, so the agent can validate a full research chain early, diagnose the first real bottleneck, and change one main variable at a time.

It is deliberately not a renamed software specification process. A successful Cycle reduces an important uncertainty; it does not need to complete a backlog.

## Install from GitHub

No npm-registry release is required. Pin a tag or commit for reproducible projects:

```bash
npx --yes github:yuanweibin/openresearch#v0.1.0 init --tools codex,claude
```

Or install the CLI globally from GitHub:

```bash
npm install -g github:yuanweibin/openresearch#v0.1.0
openresearch init --tools codex,claude
```

During development, replace `#v0.1.0` with `#main`.

## The four skills

| Skill | Responsibility | Authority boundary |
|---|---|---|
| `openresearch-explore` | Discuss feasibility, literature, falsifiability, and a rough Program design | Does not run experiments or alter canonical design |
| `openresearch-propose-cycle` | Turn one uncertainty into a Cycle contract and user-reviewable deliverables | Stops at the approval gate |
| `openresearch-run-cycle` | Execute an approved Cycle, publish Evidence, diagnose, and draft a Design Delta Proposal | Writes Cycle artifacts, never canonical design |
| `openresearch-update-design` | Create or promote an explicitly approved Program design revision | Sole writer of `openresearch/design/` |

Codex project invocation uses `$openresearch-explore`; Claude Code project invocation uses `/openresearch-explore`. Native Claude plugin commands are namespaced, for example `/openresearch:explore`.

## CLI

```bash
openresearch init --tools codex,claude
openresearch status --json
openresearch validate --json
openresearch validate --cycle 01 --json
openresearch update
openresearch doctor
```

- `init` creates missing research templates and installs selected project skills.
- `status` reads Program and Cycle state without changing it.
- `validate` checks artifact structure, local links, state/approval invariants, and deliverable readiness.
- `update` refreshes only unmodified, CLI-managed skill adapters.
- `doctor` reports runtime, discovery-path, modification, and version-drift issues.

If no `--tools` value is given, `init` detects existing agent directories; a new project defaults to both Codex and Claude Code.

## Ownership and upgrades

Everything under `openresearch/program.md`, `openresearch/design/`, and `openresearch/cycles/` belongs to the research project. `init` and `update` never overwrite it. Generated skill directories contain a `.openresearch-managed.json` manifest. If a managed file is edited locally, update reports a conflict instead of silently replacing it.

Package version, workflow version, artifact schema version, and Program design revision are separate values.

## Native plugin artifacts

`npm run build` generates two views from the same canonical workflow source:

- `dist/codex-plugin/`
- `dist/claude-plugin/`

The CLI remains the canonical cross-agent installer. Native plugin artifacts are alternate distribution surfaces, not separate workflow implementations.

## Development

```bash
npm test
npm pack --dry-run
```

OpenResearch is licensed under the MIT License.

The protocol rationale and authority model are documented in [docs/design.md](docs/design.md).
