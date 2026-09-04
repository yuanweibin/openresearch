import fs from "node:fs";
import path from "node:path";
import { PACKAGE_VERSION, SKILLS, TOOLS, WORKFLOW_VERSION } from "./constants.js";
import { inspectManagedSkill, renderSkill } from "./installer.js";

export function doctor(projectRoot) {
  const checks = [];
  const major = Number(process.versions.node.split(".")[0]);
  checks.push({
    name: "node-version",
    status: major >= 20 ? "pass" : "fail",
    detail: `Node ${process.versions.node}; requires >=20`,
  });
  checks.push({
    name: "research-root",
    status: fs.existsSync(path.join(projectRoot, "openresearch")) ? "pass" : "fail",
    detail: path.join(projectRoot, "openresearch"),
  });

  for (const [tool, settings] of Object.entries(TOOLS)) {
    const root = path.join(projectRoot, ...settings.projectRoot);
    const hasInstallation = SKILLS.some(
      (skill) => inspectManagedSkill(path.join(root, skill)).state !== "missing",
    );
    if (!hasInstallation) continue;
    for (const skill of SKILLS) {
      const directory = path.join(root, skill);
      const inspected = inspectManagedSkill(directory);
      let state = inspected.state;
      let detail;
      if (
        state === "healthy" &&
        inspected.manifest.canonicalContentHash !==
          renderSkill(skill, skill, tool, "project").canonicalHash
      ) {
        state = "version-drift";
      }
      if (state === "healthy") detail = `managed workflow ${WORKFLOW_VERSION}`;
      else if (state === "modified") detail = `managed files modified: ${inspected.modified.join(", ")}`;
      else detail = state;
      checks.push({
        name: `${tool}:${skill}`,
        status: state === "healthy" ? "pass" : "fail",
        detail,
      });
    }
  }

  for (const legacy of [path.join(projectRoot, ".codex", "skills"), path.join(projectRoot, ".claude", "commands")]) {
    if (fs.existsSync(legacy)) {
      const names = SKILLS.filter((skill) => fs.existsSync(path.join(legacy, skill)));
      if (names.length) {
        checks.push({
          name: "duplicate-or-legacy-installation",
          status: "warn",
          detail: `${legacy}: ${names.join(", ")}`,
        });
      }
    }
  }

  const discovered = checks.filter((item) => /^(codex|claude):/.test(item.name));
  if (!discovered.length) {
    checks.push({
      name: "skill-discovery",
      status: "fail",
      detail: "No managed Codex or Claude OpenResearch skills found",
    });
  }
  return {
    healthy: !checks.some((item) => item.status === "fail"),
    packageVersion: PACKAGE_VERSION,
    workflowVersion: WORKFLOW_VERSION,
    projectRoot,
    checks,
  };
}
