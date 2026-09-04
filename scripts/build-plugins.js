import fs from "node:fs";
import path from "node:path";
import { PACKAGE_ROOT, PACKAGE_VERSION, SKILLS, TOOLS } from "../src/constants.js";
import { ensureDir, writeFileAtomic } from "../src/files.js";
import { renderSkill, writeManagedSkill } from "../src/installer.js";

function reset(directory) {
  if (fs.existsSync(directory)) fs.rmSync(directory, { recursive: true, force: true });
  ensureDir(directory);
}

function buildCodex() {
  const root = path.join(PACKAGE_ROOT, "dist", "codex-plugin");
  reset(root);
  const manifest = {
    name: "openresearch",
    version: PACKAGE_VERSION,
    description: "Evidence-driven scientific research with reusable Baselines, focused Cycles, and explicit design promotion boundaries.",
    author: {
      name: "Yuan Weibin",
      url: "https://github.com/yuanweibin",
    },
    homepage: "https://github.com/yuanweibin/openresearch",
    repository: "https://github.com/yuanweibin/openresearch",
    license: "MIT",
    keywords: ["research", "science", "agent-skills"],
    skills: "./skills/",
    interface: {
      displayName: "OpenResearch",
      shortDescription: "Evidence-driven research Baselines and Cycles",
      longDescription: "Explore research ideas, build traceable literature Baselines, approve focused Cycle contracts, execute with durable Evidence, and promote only approved design deltas.",
      developerName: "Yuan Weibin",
      category: "Productivity",
      capabilities: ["Research", "Write"],
      websiteURL: "https://github.com/yuanweibin/openresearch",
      defaultPrompt: [
        "Explore whether this research idea is feasible.",
        "Build a reusable Baseline from this paper.",
        "Propose the next evidence-driven research Cycle.",
        "Summarize the active Cycle and its next decision.",
      ],
      brandColor: "#2563EB",
    },
  };
  writeFileAtomic(
    path.join(root, ".codex-plugin", "plugin.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  for (const skill of SKILLS) {
    writeManagedSkill(
      path.join(root, "skills", skill),
      renderSkill(skill, skill, "codex", "plugin"),
      { platform: "codex", distribution: "plugin", skill },
    );
  }
  fs.copyFileSync(path.join(PACKAGE_ROOT, "LICENSE"), path.join(root, "LICENSE"));
}

function buildClaude() {
  const root = path.join(PACKAGE_ROOT, "dist", "claude-plugin");
  reset(root);
  const manifest = {
    name: "openresearch",
    version: PACKAGE_VERSION,
    description: "Evidence-driven scientific research with reusable Baselines, focused Cycles, and explicit design promotion boundaries.",
    author: {
      name: "Yuan Weibin",
      url: "https://github.com/yuanweibin",
    },
    homepage: "https://github.com/yuanweibin/openresearch",
    repository: "https://github.com/yuanweibin/openresearch",
    license: "MIT",
    keywords: ["research", "science", "agent-skills"],
  };
  writeFileAtomic(
    path.join(root, ".claude-plugin", "plugin.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  for (const skill of SKILLS) {
    const targetName = TOOLS.claude.pluginNames[skill];
    writeManagedSkill(
      path.join(root, "skills", targetName),
      renderSkill(skill, targetName, "claude", "plugin"),
      { platform: "claude", distribution: "plugin", skill },
    );
  }
  fs.copyFileSync(path.join(PACKAGE_ROOT, "LICENSE"), path.join(root, "LICENSE"));
}

buildCodex();
buildClaude();
console.log("Built Codex and Claude plugin artifacts from canonical workflows.");
