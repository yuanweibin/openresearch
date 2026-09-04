import path from "node:path";
import { projectStatus, validateProject } from "./artifacts.js";
import { doctor } from "./doctor.js";
import { initProject, normalizeTools, updateProject } from "./installer.js";

const HELP = `OpenResearch — evidence-driven research cycles

Usage:
  openresearch init [--tools codex,claude] [--root PATH] [--json]
  openresearch status [--root PATH] [--json]
  openresearch validate [--cycle ID] [--root PATH] [--json]
  openresearch update [--tools codex,claude] [--root PATH] [--json]
  openresearch doctor [--root PATH] [--json]
  openresearch --version
`;

function parseArguments(argv) {
  const options = { json: false, root: process.cwd(), tools: null, cycle: null };
  let command = null;
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--help" || value === "-h") return { command: "help", options };
    if (value === "--version" || value === "-v") return { command: "version", options };
    if (value === "--json") {
      options.json = true;
    } else if (value === "--root" || value === "--tools" || value === "--cycle") {
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) throw new Error(`${value} requires a value`);
      options[value.slice(2)] = next;
      index += 1;
    } else if (value.startsWith("--root=")) {
      options.root = value.slice("--root=".length);
    } else if (value.startsWith("--tools=")) {
      options.tools = value.slice("--tools=".length);
    } else if (value.startsWith("--cycle=")) {
      options.cycle = value.slice("--cycle=".length);
    } else if (value.startsWith("-")) {
      throw new Error(`Unknown option: ${value}`);
    } else if (!command) {
      command = value;
    } else {
      throw new Error(`Unexpected argument: ${value}`);
    }
  }
  options.root = path.resolve(options.root);
  options.tools = normalizeTools(options.tools);
  return { command: command ?? "help", options };
}

function emit(payload, json, human) {
  if (json) console.log(JSON.stringify(payload, null, 2));
  else console.log(human(payload));
}

function humanInit(result) {
  const installed = result.skills.filter((item) => item.action === "installed").length;
  const updated = result.skills.filter((item) => item.action === "updated").length;
  return [
    `OpenResearch initialized in ${result.projectRoot}`,
    `Tools: ${result.tools.join(", ")}`,
    `Research templates: ${result.templates.created.length} created, ${result.templates.preserved.length} preserved`,
    `Skills: ${installed} installed, ${updated} refreshed`,
    "Next: use openresearch-explore to discuss and approve a rough Program design.",
  ].join("\n");
}

function humanUpdate(result) {
  return [
    `OpenResearch skills updated in ${result.projectRoot}`,
    `Tools: ${result.tools.join(", ")}`,
    `Managed skills refreshed: ${result.skills.length}`,
    "Research Program, design, Cycles, and Evidence were not modified.",
  ].join("\n");
}

function humanStatus(result) {
  const lines = [
    `Program design: ${result.programDesignRevision ?? "unknown"} (${result.designApproval ?? "unknown"})`,
    `Active Cycles: ${result.activeCycles.length}`,
  ];
  for (const cycle of result.activeCycles) {
    lines.push(
      `- ${cycle.id}: ${cycle.executionState}/${cycle.scientificState}; approval=${cycle.approval}; owner=${cycle.owner ?? "unassigned"}`,
    );
  }
  lines.push(`Next legal action: ${result.nextLegalAction ?? "not recorded"}`);
  return lines.join("\n");
}

function humanValidation(result) {
  const lines = [
    result.valid ? "OpenResearch artifacts are valid." : "OpenResearch artifact validation failed.",
    `Scope: ${result.scope}`,
    `Errors: ${result.errors.length}; warnings: ${result.warnings.length}`,
  ];
  for (const item of [...result.errors, ...result.warnings]) {
    lines.push(`- ${item.level.toUpperCase()} ${item.code}: ${item.message}${item.file ? ` (${item.file})` : ""}`);
  }
  return lines.join("\n");
}

function humanDoctor(result) {
  const lines = [result.healthy ? "OpenResearch doctor: healthy" : "OpenResearch doctor: issues found"];
  for (const check of result.checks) {
    lines.push(`- ${check.status.toUpperCase()} ${check.name}: ${check.detail}`);
  }
  return lines.join("\n");
}

export async function main(argv) {
  const { command, options } = parseArguments(argv);
  if (command === "help") {
    console.log(HELP.trimEnd());
    return;
  }
  if (command === "version") {
    const { PACKAGE_VERSION } = await import("./constants.js");
    console.log(PACKAGE_VERSION);
    return;
  }
  if (command === "init") {
    const result = initProject(options.root, options.tools);
    emit(result, options.json, humanInit);
    return;
  }
  if (command === "update") {
    const result = updateProject(options.root, options.tools);
    emit(result, options.json, humanUpdate);
    return;
  }
  if (command === "status") {
    const result = projectStatus(options.root);
    emit(result, options.json, humanStatus);
    return;
  }
  if (command === "validate") {
    const result = validateProject(options.root, options.cycle);
    emit(result, options.json, humanValidation);
    if (!result.valid) process.exitCode = 1;
    return;
  }
  if (command === "doctor") {
    const result = doctor(options.root);
    emit(result, options.json, humanDoctor);
    if (!result.healthy) process.exitCode = 1;
    return;
  }
  throw new Error(`Unknown command: ${command}\n\n${HELP}`);
}
