import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const PACKAGE_JSON = JSON.parse(
  fs.readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf8"),
);
export const PACKAGE_VERSION = PACKAGE_JSON.version;
export const WORKFLOW_VERSION = "0.2.4";
export const SCHEMA_VERSION = "0.1.0";

export const SKILLS = [
  "openresearch-explore",
  "openresearch-build-baseline",
  "openresearch-propose-cycle",
  "openresearch-run-cycle",
  "openresearch-update-design",
];

export const TOOLS = {
  codex: {
    projectRoot: [".agents", "skills"],
    pluginNames: Object.fromEntries(SKILLS.map((name) => [name, name])),
  },
  claude: {
    projectRoot: [".claude", "skills"],
    pluginNames: {
      "openresearch-explore": "explore",
      "openresearch-build-baseline": "build-baseline",
      "openresearch-propose-cycle": "propose-cycle",
      "openresearch-run-cycle": "run-cycle",
      "openresearch-update-design": "update-design",
    },
  },
};

export const EXECUTION_STATES = new Set([
  "designed",
  "running",
  "evidence-ready",
  "diagnosed",
  "blocked",
  "complete",
]);

export const SCIENTIFIC_STATES = new Set([
  "pending",
  "supported",
  "refuted",
  "inconclusive",
  "failed-with-diagnosis",
]);

export const APPROVAL_STATES = new Set(["pending", "approved", "changes-requested"]);

export const BASELINE_STATES = new Set([
  "planned",
  "in-progress",
  "partial",
  "qualified",
  "superseded",
]);
