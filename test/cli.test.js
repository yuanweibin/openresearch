import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(repository, "bin", "openresearch.js");

function workspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "openresearch-test-"));
}

function run(root, ...args) {
  return spawnSync(process.execPath, [cli, ...args, "--root", root], {
    encoding: "utf8",
  });
}

function assertSkill(root, toolDirectory, name) {
  const directory = path.join(root, toolDirectory, "skills", name);
  assert.equal(fs.existsSync(path.join(directory, "SKILL.md")), true);
  assert.equal(fs.existsSync(path.join(directory, ".openresearch-managed.json")), true);
  assert.match(fs.readFileSync(path.join(directory, "SKILL.md"), "utf8"), /generatedBy: openresearch/);
}

test("Codex-only init installs five project skills and validates", () => {
  const root = workspace();
  const initialized = run(root, "init", "--tools", "codex", "--json");
  assert.equal(initialized.status, 0, initialized.stderr);
  for (const name of [
    "openresearch-explore",
    "openresearch-build-baseline",
    "openresearch-propose-cycle",
    "openresearch-run-cycle",
    "openresearch-update-design",
  ]) {
    assertSkill(root, ".agents", name);
  }
  assert.equal(fs.existsSync(path.join(root, ".claude")), false);
  assert.equal(fs.existsSync(path.join(root, "openresearch", "baselines", "README.md")), true);
  const validated = run(root, "validate", "--json");
  assert.equal(validated.status, 0, validated.stdout + validated.stderr);
  assert.equal(JSON.parse(validated.stdout).valid, true);
});

test("Claude-only and dual init use the expected discovery paths", () => {
  const claude = workspace();
  assert.equal(run(claude, "init", "--tools", "claude").status, 0);
  assertSkill(claude, ".claude", "openresearch-explore");
  assert.equal(fs.existsSync(path.join(claude, ".agents")), false);

  const dual = workspace();
  assert.equal(run(dual, "init", "--tools", "codex,claude").status, 0);
  assertSkill(dual, ".agents", "openresearch-run-cycle");
  assertSkill(dual, ".claude", "openresearch-run-cycle");
});

test("repeated init preserves researcher-owned artifacts", () => {
  const root = workspace();
  assert.equal(run(root, "init", "--tools", "codex,claude").status, 0);
  const program = path.join(root, "openresearch", "program.md");
  const custom = `${fs.readFileSync(program, "utf8")}\nResearcher-owned sentinel.\n`;
  fs.writeFileSync(program, custom);
  const design = path.join(root, "openresearch", "design", "decoder.md");
  fs.writeFileSync(design, "researcher design sentinel\n");
  const cycle = path.join(root, "openresearch", "cycles", "01-sentinel");
  fs.mkdirSync(path.join(cycle, "results"), { recursive: true });
  const evidence = path.join(cycle, "results", "evidence.txt");
  fs.writeFileSync(evidence, "researcher evidence sentinel\n");

  const repeated = run(root, "init", "--tools", "codex,claude", "--json");
  assert.equal(repeated.status, 0, repeated.stderr);
  assert.equal(fs.readFileSync(program, "utf8"), custom);
  assert.equal(fs.readFileSync(design, "utf8"), "researcher design sentinel\n");
  assert.equal(fs.readFileSync(evidence, "utf8"), "researcher evidence sentinel\n");
  const payload = JSON.parse(repeated.stdout);
  assert.equal(payload.templates.created.length, 0);
  assert.ok(payload.templates.preserved.length >= 7);

  const updated = run(root, "update", "--json");
  assert.equal(updated.status, 0, updated.stderr);
  assert.equal(fs.readFileSync(design, "utf8"), "researcher design sentinel\n");
  assert.equal(fs.readFileSync(evidence, "utf8"), "researcher evidence sentinel\n");
});

test("update refuses to overwrite a locally modified managed skill", () => {
  const root = workspace();
  assert.equal(run(root, "init", "--tools", "codex").status, 0);
  const skill = path.join(
    root,
    ".agents",
    "skills",
    "openresearch-explore",
    "SKILL.md",
  );
  fs.appendFileSync(skill, "\nlocal edit\n");
  const updated = run(root, "update");
  assert.notEqual(updated.status, 0);
  assert.match(updated.stderr, /Refusing to overwrite locally modified managed skill/);
  assert.match(fs.readFileSync(skill, "utf8"), /local edit/);
});

test("status reports a valid empty Program", () => {
  const root = workspace();
  assert.equal(run(root, "init", "--tools", "codex").status, 0);
  const status = run(root, "status", "--json");
  assert.equal(status.status, 0, status.stderr);
  const payload = JSON.parse(status.stdout);
  assert.equal(payload.activeCycles.length, 0);
  assert.equal(payload.baselines.length, 0);
  assert.match(payload.programDesignRevision, /^OR-\d{4}-\d{2}-\d{2}\.0$/);
  assert.equal(payload.designApproval, "pending");
});

test("partial Baseline requires raw data and a PNG figure", () => {
  const root = workspace();
  assert.equal(run(root, "init", "--tools", "codex").status, 0);
  const baseline = path.join(root, "openresearch", "baselines", "tgv-example-2021");
  fs.mkdirSync(path.join(baseline, "results", "raw"), { recursive: true });
  fs.mkdirSync(path.join(baseline, "results", "figures"), { recursive: true });
  const artifacts = {
    "README.md": "baseline-index",
    "source.md": "baseline-source",
    "setup.md": "baseline-setup",
    "runs.md": "baseline-runs",
  };
  for (const [file, artifact] of Object.entries(artifacts)) {
    fs.writeFileSync(
      path.join(baseline, file),
      `---\nartifact: ${artifact}\nschema_version: 0.1.0\n---\n\n# ${artifact}\n`,
    );
  }
  fs.writeFileSync(
    path.join(baseline, "status.md"),
    "---\nartifact: baseline-status\nschema_version: 0.1.0\nbaseline: tgv-example-2021\nstate: partial\nreference: Example2021\nconsumer_eligibility: [contextual-comparison]\nupdated_at: 2026-09-04\n---\n",
  );
  fs.mkdirSync(path.join(baseline, "results"), { recursive: true });
  fs.writeFileSync(path.join(baseline, "results", "report.md"), "# Report\n");

  const missing = run(root, "validate", "--baseline", "tgv-example-2021", "--json");
  assert.notEqual(missing.status, 0);
  assert.match(missing.stdout, /missing-baseline-raw/);
  assert.match(missing.stdout, /missing-baseline-figure/);

  fs.writeFileSync(path.join(baseline, "results", "raw", "manifest.json"), "{}\n");
  fs.writeFileSync(path.join(baseline, "results", "figures", "comparison.png"), "png-placeholder\n");
  const valid = run(root, "validate", "--baseline", "tgv-example-2021", "--json");
  assert.equal(valid.status, 0, valid.stdout + valid.stderr);
});
