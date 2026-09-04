# Literature map

Literature is part of the design rationale, not a bibliography appended after decisions are made.

For each design item that affects scientific interpretation, numerical comparability, model capability, or an Evidence threshold, record:

| Field | Meaning |
|---|---|
| `relation` | `adopted`, `adapted`, `motivation-only`, or `project-hypothesis` |
| `reference` | Stable citation key plus DOI, arXiv identifier, or durable public URL |
| `borrowed` | The exact case, numerical choice, metric, architecture, or observation borrowed |
| `match` | Conditions genuinely shared with this project |
| `deviation` | Material differences and what the paper therefore cannot establish here |
| `local_evidence` | Cycle Evidence that supports, narrows, or contradicts the borrowing |

Use `adopted` only inside the conditions that actually match. Use `adapted` when the method is modified. Use `motivation-only` when a paper supports pursuing the direction but not the chosen implementation. Use `project-hypothesis` when the project is making its own proposal; identify the closest analogy and the break in the analogy.

Prefer primary literature and official benchmark definitions. Preserve enough citation detail for another agent to retrieve the source. Never turn a contextual similarity such as the same Reynolds number or architecture family into a claim that the complete setup is literature-validated.
