import fs from "node:fs";
import path from "node:path";
import {
  PACKAGE_ROOT,
  PACKAGE_VERSION,
  SCHEMA_VERSION,
  SKILLS,
  TOOLS,
  USER_LANGUAGES,
  WORKFLOW_VERSION,
} from "./constants.js";
import { ensureDir, hashFile, listFiles, sha256, today, writeFileAtomic } from "./files.js";

const MANAGED_FILE = ".openresearch-managed.json";

function replaceSkillName(source, targetName) {
  return source.replace(/^name:\s*[^\n]+/m, `name: ${targetName}`);
}

export function renderSkill(skill, targetName, platform, distribution = "project") {
  const sourceFile = path.join(PACKAGE_ROOT, "workflows", skill, "SKILL.md");
  const source = fs.readFileSync(sourceFile, "utf8");
  const canonicalHash = sha256(source);
  const marker =
    `<!-- generatedBy: openresearch; packageVersion: ${PACKAGE_VERSION}; ` +
    `workflowVersion: ${WORKFLOW_VERSION}; platform: ${platform}; ` +
    `distribution: ${distribution}; contentHash: ${canonicalHash} -->`;
  let rendered = replaceSkillName(source, targetName);
  const frontmatterEnd = rendered.indexOf("\n---\n", 4);
  if (frontmatterEnd < 0) throw new Error(`Invalid workflow frontmatter: ${skill}`);
  rendered = `${rendered.slice(0, frontmatterEnd + 5)}\n${marker}\n${rendered.slice(frontmatterEnd + 5)}`;

  const files = { "SKILL.md": rendered };
  const shared = path.join(PACKAGE_ROOT, "workflows", "_shared");
  for (const file of listFiles(shared)) {
    const relative = path.relative(shared, file).split(path.sep).join("/");
    files[`references/${relative}`] = fs.readFileSync(file, "utf8");
  }
  return { files, canonicalHash };
}

function verifyManagedDirectory(directory) {
  const manifestFile = path.join(directory, MANAGED_FILE);
  if (!fs.existsSync(manifestFile)) {
    throw new Error(`Refusing to overwrite unmanaged skill directory: ${directory}`);
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  } catch {
    throw new Error(`Invalid managed manifest: ${manifestFile}`);
  }
  const modified = [];
  for (const [relative, expected] of Object.entries(manifest.files ?? {})) {
    const file = path.join(directory, relative);
    if (!fs.existsSync(file) || hashFile(file) !== expected) modified.push(relative);
  }
  if (modified.length) {
    throw new Error(
      `Refusing to overwrite locally modified managed skill ${directory}: ${modified.join(", ")}`,
    );
  }
  return manifest;
}

export function writeManagedSkill(directory, rendered, metadata) {
  let prior = null;
  if (fs.existsSync(directory)) prior = verifyManagedDirectory(directory);
  ensureDir(directory);

  const nextFiles = {};
  for (const [relative, content] of Object.entries(rendered.files)) {
    const file = path.join(directory, relative);
    writeFileAtomic(file, content);
    nextFiles[relative] = hashFile(file);
  }

  for (const relative of Object.keys(prior?.files ?? {})) {
    if (nextFiles[relative] !== undefined) continue;
    const obsolete = path.join(directory, relative);
    if (fs.existsSync(obsolete)) fs.rmSync(obsolete);
  }

  const manifest = {
    generatedBy: "openresearch",
    packageVersion: PACKAGE_VERSION,
    workflowVersion: WORKFLOW_VERSION,
    canonicalContentHash: rendered.canonicalHash,
    platform: metadata.platform,
    distribution: metadata.distribution,
    skill: metadata.skill,
    ...(metadata.distribution === "project"
      ? { generatedAt: new Date().toISOString() }
      : {}),
    files: nextFiles,
  };
  writeFileAtomic(path.join(directory, MANAGED_FILE), `${JSON.stringify(manifest, null, 2)}\n`);
  return prior ? "updated" : "installed";
}

function copyTemplates(projectRoot, userLanguage) {
  const templateDirectory = userLanguage === "en" ? "openresearch" : `openresearch.${userLanguage}`;
  const sourceRoot = path.join(PACKAGE_ROOT, "templates", templateDirectory);
  const destinationRoot = path.join(projectRoot, "openresearch");
  const replacements = {
    "{{DATE}}": today(),
    "{{WORKFLOW_VERSION}}": WORKFLOW_VERSION,
  };
  const created = [];
  const preserved = [];
  for (const sourceFile of listFiles(sourceRoot)) {
    const relative = path.relative(sourceRoot, sourceFile);
    const destination = path.join(destinationRoot, relative);
    if (fs.existsSync(destination)) {
      preserved.push(path.join("openresearch", relative));
      continue;
    }
    let content = fs.readFileSync(sourceFile, "utf8");
    for (const [needle, value] of Object.entries(replacements)) {
      content = content.split(needle).join(value);
    }
    writeFileAtomic(destination, content);
    created.push(path.join("openresearch", relative));
  }
  return { created, preserved };
}

export function normalizeTools(raw) {
  if (!raw) return null;
  const values = [...new Set(raw.split(",").map((item) => item.trim()).filter(Boolean))];
  const invalid = values.filter((item) => !TOOLS[item]);
  if (invalid.length) throw new Error(`Unknown tool(s): ${invalid.join(", ")}`);
  if (!values.length) throw new Error("--tools requires codex, claude, or both");
  return values;
}

export function normalizeLanguage(raw) {
  if (!raw) return null;
  const value = raw.trim();
  const key = value.toLowerCase();
  if (["en", "en-us", "en-gb", "english"].includes(key)) return "en";
  if (["zh", "zh-cn", "zh-hans", "chinese", "中文", "简体中文"].includes(key)) return "zh-CN";
  throw new Error(`Unsupported --language ${value}; supported values: ${USER_LANGUAGES.join(", ")}`);
}

function existingProjectLanguage(projectRoot) {
  const configFile = path.join(projectRoot, "openresearch", "config.yaml");
  if (!fs.existsSync(configFile)) return null;
  const match = fs.readFileSync(configFile, "utf8").match(/^user_language:\s*(.+?)\s*$/m);
  return match ? normalizeLanguage(match[1]) : "missing";
}

export function detectTools(projectRoot) {
  const detected = [];
  if (fs.existsSync(path.join(projectRoot, ".agents"))) detected.push("codex");
  if (fs.existsSync(path.join(projectRoot, ".claude"))) detected.push("claude");
  return detected.length ? detected : ["codex", "claude"];
}

export function installProjectSkills(projectRoot, tools, mode = "init") {
  const controlFile = path.join(projectRoot, "openresearch", ".openresearch-cli.json");
  let prior = {};
  if (fs.existsSync(controlFile)) {
    try {
      prior = JSON.parse(fs.readFileSync(controlFile, "utf8"));
    } catch {
      throw new Error(`Invalid CLI control file: ${controlFile}`);
    }
  }

  for (const tool of tools) {
    const root = path.join(projectRoot, ...TOOLS[tool].projectRoot);
    for (const skill of SKILLS) {
      const directory = path.join(root, skill);
      if (fs.existsSync(directory)) verifyManagedDirectory(directory);
    }
  }

  const outcomes = [];
  for (const tool of tools) {
    const root = path.join(projectRoot, ...TOOLS[tool].projectRoot);
    for (const skill of SKILLS) {
      const rendered = renderSkill(skill, skill, tool, "project");
      const directory = path.join(root, skill);
      const action = writeManagedSkill(directory, rendered, {
        platform: tool,
        distribution: "project",
        skill,
      });
      outcomes.push({ tool, skill, action, path: path.relative(projectRoot, directory) });
    }
  }

  const installedTools = [...new Set([...(prior.installedTools ?? []), ...tools])].sort();
  writeFileAtomic(
    controlFile,
    `${JSON.stringify(
      {
        generatedBy: "openresearch",
        packageVersion: PACKAGE_VERSION,
        workflowVersion: WORKFLOW_VERSION,
        artifactSchemaVersion: SCHEMA_VERSION,
        installedTools,
        lastCommand: mode,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
  );
  return outcomes;
}

export function initProject(projectRoot, requestedTools, userLanguage) {
  if (!userLanguage) throw new Error("init requires --language en or zh-CN");
  const existingLanguage = existingProjectLanguage(projectRoot);
  if (existingLanguage === "missing") {
    throw new Error("Existing openresearch/config.yaml lacks user_language; add it before re-running init");
  }
  if (existingLanguage && existingLanguage !== userLanguage) {
    throw new Error(
      `Existing project language is ${existingLanguage}; changing it requires an explicit document migration`,
    );
  }
  ensureDir(projectRoot);
  const templates = copyTemplates(projectRoot, userLanguage);
  const tools = requestedTools ?? detectTools(projectRoot);
  const skills = installProjectSkills(projectRoot, tools, "init");
  return { projectRoot, userLanguage, tools, templates, skills };
}

export function updateProject(projectRoot, requestedTools) {
  const controlFile = path.join(projectRoot, "openresearch", ".openresearch-cli.json");
  let recorded = [];
  if (fs.existsSync(controlFile)) {
    const control = JSON.parse(fs.readFileSync(controlFile, "utf8"));
    recorded = control.installedTools ?? [];
  }
  const tools = requestedTools ?? (recorded.length ? recorded : detectInstalledTools(projectRoot));
  if (!tools.length) throw new Error("No managed OpenResearch skill installation found; run init first");
  const skills = installProjectSkills(projectRoot, tools, "update");
  return { projectRoot, tools, skills };
}

export function detectInstalledTools(projectRoot) {
  return Object.entries(TOOLS)
    .filter(([, settings]) => {
      const root = path.join(projectRoot, ...settings.projectRoot);
      return SKILLS.some((skill) => fs.existsSync(path.join(root, skill, MANAGED_FILE)));
    })
    .map(([tool]) => tool);
}

export function inspectManagedSkill(directory) {
  const manifestFile = path.join(directory, MANAGED_FILE);
  if (!fs.existsSync(directory)) return { state: "missing" };
  if (!fs.existsSync(manifestFile)) return { state: "unmanaged" };
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
    const modified = [];
    for (const [relative, expected] of Object.entries(manifest.files ?? {})) {
      const file = path.join(directory, relative);
      if (!fs.existsSync(file) || hashFile(file) !== expected) modified.push(relative);
    }
    const drift =
      manifest.packageVersion !== PACKAGE_VERSION ||
      manifest.workflowVersion !== WORKFLOW_VERSION;
    return { state: modified.length ? "modified" : drift ? "version-drift" : "healthy", manifest, modified };
  } catch (error) {
    return { state: "invalid-manifest", error: error.message };
  }
}
