import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("plugin builds expose platform-appropriate skill names", () => {
  const codexSkill = path.join(
    repository,
    "dist",
    "codex-plugin",
    "skills",
    "openresearch-explore",
    "SKILL.md",
  );
  const claudeSkill = path.join(
    repository,
    "dist",
    "claude-plugin",
    "skills",
    "explore",
    "SKILL.md",
  );
  assert.equal(fs.existsSync(codexSkill), true);
  assert.equal(fs.existsSync(claudeSkill), true);
  assert.match(fs.readFileSync(codexSkill, "utf8"), /^---\nname: openresearch-explore\n/);
  assert.match(fs.readFileSync(claudeSkill, "utf8"), /^---\nname: explore\n/);

  const codexBaselineSkill = path.join(
    repository,
    "dist",
    "codex-plugin",
    "skills",
    "openresearch-build-baseline",
    "SKILL.md",
  );
  const claudeBaselineSkill = path.join(
    repository,
    "dist",
    "claude-plugin",
    "skills",
    "build-baseline",
    "SKILL.md",
  );
  assert.equal(fs.existsSync(codexBaselineSkill), true);
  assert.equal(fs.existsSync(claudeBaselineSkill), true);
});

test("native manifests point at the shared generated skill views", () => {
  const codex = JSON.parse(
    fs.readFileSync(
      path.join(repository, "dist", "codex-plugin", ".codex-plugin", "plugin.json"),
      "utf8",
    ),
  );
  const claude = JSON.parse(
    fs.readFileSync(
      path.join(repository, "dist", "claude-plugin", ".claude-plugin", "plugin.json"),
      "utf8",
    ),
  );
  assert.equal(codex.name, "openresearch");
  assert.equal(codex.skills, "./skills/");
  assert.equal(claude.name, "openresearch");
  assert.equal(codex.version, claude.version);
});
