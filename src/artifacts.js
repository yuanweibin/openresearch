import fs from "node:fs";
import path from "node:path";
import {
  APPROVAL_STATES,
  BASELINE_STATES,
  EXECUTION_STATES,
  SCHEMA_VERSION,
  SCIENTIFIC_STATES,
} from "./constants.js";
import { listFiles, readFrontmatter } from "./files.js";

const CYCLE_PATTERN = /^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BASELINE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUIRED_CYCLE_FILES = [
  "question.md",
  "experiment.md",
  "deliverables.md",
  "tasks.md",
  "status.md",
  "decisions.md",
];
const REQUIRED_BASELINE_FILES = ["README.md", "source.md", "setup.md", "runs.md", "status.md"];

export function listBaselines(projectRoot) {
  const root = path.join(projectRoot, "openresearch", "baselines");
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && BASELINE_PATTERN.test(entry.name))
    .map((entry) => {
      const directory = path.join(root, entry.name);
      const status = readFrontmatter(path.join(directory, "status.md"));
      return { id: entry.name, directory, ...status };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function listCycles(projectRoot) {
  const root = path.join(projectRoot, "openresearch", "cycles");
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && CYCLE_PATTERN.test(entry.name))
    .map((entry) => {
      const directory = path.join(root, entry.name);
      const status = readFrontmatter(path.join(directory, "status.md"));
      return { id: entry.name, directory, ...status };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function projectStatus(projectRoot) {
  const programFile = path.join(projectRoot, "openresearch", "status.md");
  const designFile = path.join(projectRoot, "openresearch", "design", "README.md");
  const program = readFrontmatter(programFile);
  const design = readFrontmatter(designFile);
  const cycles = listCycles(projectRoot).map((cycle) => ({
    id: cycle.id,
    executionState: cycle.execution_state ?? "unknown",
    scientificState: cycle.scientific_state ?? "unknown",
    approval: cycle.approval ?? "unknown",
    owner: cycle.owner ?? null,
    programDesignRevision: cycle.program_design_revision ?? null,
    mainVariable: cycle.main_variable ?? null,
    nextLegalAction: cycle.next_legal_action ?? null,
  }));
  const activeCycles = cycles.filter((cycle) => cycle.executionState !== "complete");
  const baselines = listBaselines(projectRoot).map((baseline) => ({
    id: baseline.id,
    state: baseline.state ?? "unknown",
    reference: baseline.reference ?? null,
    consumerEligibility: baseline.consumer_eligibility ?? [],
    updatedAt: baseline.updated_at ?? null,
  }));
  return {
    schemaVersion: program.schema_version ?? null,
    programDesignRevision:
      program.program_design_revision ?? design.revision ?? null,
    designApproval: design.approval ?? null,
    activeCycles,
    cycles,
    baselines,
    nextLegalAction: program.next_legal_action ?? null,
    updatedAt: program.updated_at ?? null,
  };
}

function resolveBaseline(projectRoot, requested, issues) {
  const baselines = listBaselines(projectRoot);
  if (!requested) return baselines;
  const matches = baselines.filter(
    (baseline) => baseline.id === requested || baseline.id.startsWith(`${requested}-`),
  );
  if (matches.length !== 1) {
    issues.push(
      issue(
        "error",
        matches.length ? "ambiguous-baseline" : "baseline-not-found",
        matches.length
          ? `Baseline selector ${requested} matches ${matches.map((item) => item.id).join(", ")}`
          : `Baseline not found: ${requested}`,
      ),
    );
    return [];
  }
  return matches;
}

function validateBaseline(baseline, issues) {
  const artifacts = {
    "README.md": "baseline-index",
    "source.md": "baseline-source",
    "setup.md": "baseline-setup",
    "runs.md": "baseline-runs",
    "status.md": "baseline-status",
  };
  for (const required of REQUIRED_BASELINE_FILES) {
    const file = path.join(baseline.directory, required);
    if (!fs.existsSync(file)) {
      issues.push(issue("error", "missing-baseline-artifact", `Missing ${required}`, file));
    } else {
      validateFrontmatter(file, artifacts[required], issues);
    }
  }

  const statusFile = path.join(baseline.directory, "status.md");
  const status = validateFrontmatter(statusFile, "baseline-status", issues);
  if (status.baseline !== baseline.id) {
    issues.push(
      issue("error", "baseline-id-mismatch", `Expected baseline field ${baseline.id}`, statusFile),
    );
  }
  if (!BASELINE_STATES.has(status.state)) {
    issues.push(issue("error", "baseline-state", "Unknown Baseline state", statusFile));
  }

  if (["partial", "qualified"].includes(status.state)) {
    const report = path.join(baseline.directory, "results", "report.md");
    const rawManifest = path.join(baseline.directory, "results", "raw", "manifest.json");
    const figureRoot = path.join(baseline.directory, "results", "figures");
    const figures = fs.existsSync(figureRoot)
      ? listFiles(figureRoot).filter((file) => file.toLowerCase().endsWith(".png"))
      : [];
    if (!fs.existsSync(report)) {
      issues.push(issue("error", "missing-baseline-report", "Partial or qualified Baseline requires results/report.md", report));
    }
    if (!fs.existsSync(rawManifest)) {
      issues.push(issue("error", "missing-baseline-raw", "Partial or qualified Baseline requires results/raw/manifest.json", rawManifest));
    }
    if (!figures.length) {
      issues.push(issue("error", "missing-baseline-figure", "Partial or qualified Baseline requires at least one PNG under results/figures", figureRoot));
    }
  }
  if (
    status.state === "qualified" &&
    (!Array.isArray(status.consumer_eligibility) || !status.consumer_eligibility.length)
  ) {
    issues.push(issue("error", "missing-baseline-eligibility", "Qualified Baseline requires named consumer_eligibility", statusFile));
  }
}

function issue(level, code, message, file = null) {
  return { level, code, message, ...(file ? { file } : {}) };
}

function validateFrontmatter(file, expectedArtifact, issues) {
  if (!fs.existsSync(file)) return {};
  const data = readFrontmatter(file);
  const relative = file;
  if (!Object.keys(data).length) {
    issues.push(issue("error", "missing-frontmatter", "Required YAML frontmatter is missing", relative));
    return data;
  }
  if (expectedArtifact && data.artifact !== expectedArtifact) {
    issues.push(
      issue(
        "error",
        "wrong-artifact-type",
        `Expected artifact: ${expectedArtifact}`,
        relative,
      ),
    );
  }
  if (data.schema_version !== SCHEMA_VERSION) {
    issues.push(
      issue(
        "error",
        "schema-version",
        `Expected schema_version ${SCHEMA_VERSION}`,
        relative,
      ),
    );
  }
  return data;
}

function validateMarkdownLinks(scopeRoot, issues) {
  for (const file of listFiles(scopeRoot).filter((candidate) => candidate.endsWith(".md"))) {
    const content = fs.readFileSync(file, "utf8");
    const matches = content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g);
    for (const match of matches) {
      let destination = match[1].trim();
      if (destination.startsWith("<") && destination.endsWith(">")) {
        destination = destination.slice(1, -1);
      }
      destination = destination.split("#", 1)[0];
      if (!destination || /^(?:https?:|mailto:|data:)/i.test(destination)) continue;
      let decoded;
      try {
        decoded = decodeURIComponent(destination);
      } catch {
        issues.push(issue("error", "invalid-local-link", `Invalid link encoding: ${destination}`, file));
        continue;
      }
      const target = path.isAbsolute(decoded)
        ? decoded
        : path.resolve(path.dirname(file), decoded);
      if (!fs.existsSync(target)) {
        issues.push(
          issue("error", "broken-local-link", `Local link target does not exist: ${destination}`, file),
        );
      }
    }
  }
}

function resolveCycle(projectRoot, requested, issues) {
  const cycles = listCycles(projectRoot);
  if (!requested) return cycles;
  const matches = cycles.filter(
    (cycle) => cycle.id === requested || cycle.id.startsWith(`${requested}-`),
  );
  if (matches.length !== 1) {
    issues.push(
      issue(
        "error",
        matches.length ? "ambiguous-cycle" : "cycle-not-found",
        matches.length
          ? `Cycle selector ${requested} matches ${matches.map((item) => item.id).join(", ")}`
          : `Cycle not found: ${requested}`,
      ),
    );
    return [];
  }
  return matches;
}

function validateCycle(cycle, issues) {
  for (const required of REQUIRED_CYCLE_FILES) {
    const file = path.join(cycle.directory, required);
    if (!fs.existsSync(file)) {
      issues.push(issue("error", "missing-cycle-artifact", `Missing ${required}`, file));
    }
  }
  const statusFile = path.join(cycle.directory, "status.md");
  const status = validateFrontmatter(statusFile, "cycle-status", issues);
  if (status.cycle !== cycle.id) {
    issues.push(
      issue("error", "cycle-id-mismatch", `Expected cycle field ${cycle.id}`, statusFile),
    );
  }
  if (!EXECUTION_STATES.has(status.execution_state)) {
    issues.push(issue("error", "execution-state", "Unknown execution_state", statusFile));
  }
  if (!SCIENTIFIC_STATES.has(status.scientific_state)) {
    issues.push(issue("error", "scientific-state", "Unknown scientific_state", statusFile));
  }
  if (!APPROVAL_STATES.has(status.approval)) {
    issues.push(issue("error", "approval-state", "Unknown approval state", statusFile));
  }
  const hasStarted = ["running", "evidence-ready", "diagnosed", "complete"].includes(
    status.execution_state,
  );
  if (hasStarted && status.approval !== "approved") {
    issues.push(
      issue("error", "unapproved-execution", "An executing or completed Cycle must be approved", statusFile),
    );
  }
  if (hasStarted && !status.approved_at) {
    issues.push(issue("error", "missing-approval-time", "Approved Cycle requires approved_at", statusFile));
  }
  if (hasStarted && !status.owner) {
    issues.push(issue("error", "missing-owner", "Executing Cycle requires an owner", statusFile));
  }
  if (
    ["evidence-ready", "diagnosed", "complete"].includes(status.execution_state) &&
    !fs.existsSync(path.join(cycle.directory, "results", "report.md"))
  ) {
    issues.push(
      issue(
        "error",
        "missing-results-report",
        "Evidence-ready, diagnosed, and complete Cycles require results/report.md",
        cycle.directory,
      ),
    );
  }
  if (status.execution_state === "complete" && status.scientific_state === "pending") {
    issues.push(
      issue("error", "pending-conclusion", "A complete Cycle requires a scientific conclusion", statusFile),
    );
  }
}

export function validateProject(projectRoot, requestedCycle = null, requestedBaseline = null) {
  const issues = [];
  const researchRoot = path.join(projectRoot, "openresearch");
  const requiredProgramFiles = [
    ["config.yaml", null],
    ["program.md", "research-program"],
    ["status.md", "program-status"],
    [path.join("design", "README.md"), "program-design-index"],
    [path.join("design", "decisions.md"), "program-design-decisions"],
    [path.join("design", "references.md"), "program-design-references"],
    [path.join("baselines", "README.md"), "baseline-catalog"],
    [path.join("cycles", "README.md"), null],
  ];
  for (const [relative, artifact] of requiredProgramFiles) {
    const file = path.join(researchRoot, relative);
    if (!fs.existsSync(file)) {
      issues.push(issue("error", "missing-program-artifact", `Missing ${relative}`, file));
    } else if (artifact) {
      validateFrontmatter(file, artifact, issues);
    }
  }

  const program = readFrontmatter(path.join(researchRoot, "status.md"));
  const design = readFrontmatter(path.join(researchRoot, "design", "README.md"));
  if (
    program.program_design_revision &&
    design.revision &&
    program.program_design_revision !== design.revision
  ) {
    issues.push(
      issue(
        "error",
        "design-revision-mismatch",
        `Program status has ${program.program_design_revision}; design index has ${design.revision}`,
      ),
    );
  }

  const allCycles = listCycles(projectRoot);
  const sequenceNumbers = allCycles.map((cycle) => Number(cycle.id.slice(0, 2)));
  for (let index = 1; index < sequenceNumbers.length; index += 1) {
    if (sequenceNumbers[index] === sequenceNumbers[index - 1]) {
      issues.push(issue("error", "duplicate-cycle-sequence", "Cycle sequence is duplicated"));
    }
    if (sequenceNumbers[index] > sequenceNumbers[index - 1] + 1) {
      issues.push(
        issue(
          "warning",
          "cycle-sequence-gap",
          `Cycle sequence jumps from ${sequenceNumbers[index - 1]} to ${sequenceNumbers[index]}`,
        ),
      );
    }
  }

  const selected = resolveCycle(projectRoot, requestedCycle, issues);
  for (const cycle of selected) validateCycle(cycle, issues);
  const selectedBaselines = resolveBaseline(projectRoot, requestedBaseline, issues);
  for (const baseline of selectedBaselines) validateBaseline(baseline, issues);
  if (fs.existsSync(researchRoot)) {
    const scopeRoot = requestedCycle && selected.length === 1
      ? selected[0].directory
      : requestedBaseline && selectedBaselines.length === 1
        ? selectedBaselines[0].directory
        : researchRoot;
    validateMarkdownLinks(scopeRoot, issues);
  }
  const errors = issues.filter((item) => item.level === "error");
  const warnings = issues.filter((item) => item.level === "warning");
  return {
    valid: errors.length === 0,
    scope: requestedCycle
      ? `cycle:${requestedCycle}`
      : requestedBaseline
        ? `baseline:${requestedBaseline}`
        : "program",
    errors,
    warnings,
    checkedCycles: selected.map((cycle) => cycle.id),
    checkedBaselines: selectedBaselines.map((baseline) => baseline.id),
  };
}
