import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function hashFile(file) {
  return sha256(fs.readFileSync(file));
}

export function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

export function writeFileAtomic(file, content, mode) {
  ensureDir(path.dirname(file));
  const temporary = path.join(
    path.dirname(file),
    `.${path.basename(file)}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`,
  );
  fs.writeFileSync(temporary, content, { encoding: "utf8", mode });
  fs.renameSync(temporary, file);
  if (mode !== undefined) fs.chmodSync(file, mode);
}

export function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      output.push(...listFiles(absolute));
    } else if (entry.isFile()) {
      output.push(absolute);
    }
  }
  return output.sort();
}

export function relativeFileMap(directory) {
  const output = {};
  for (const file of listFiles(directory)) {
    output[path.relative(directory, file).split(path.sep).join("/")] = hashFile(file);
  }
  return output;
}

export function tempDirectory(prefix = "openresearch-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function parseScalar(raw) {
  const value = raw.trim();
  if (value === "null" || value === "~") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (
    (value.startsWith("[") && value.endsWith("]")) ||
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value;
}

export function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return {};
  const end = normalized.indexOf("\n---\n", 4);
  if (end < 0) return {};
  const result = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) result[match[1]] = parseScalar(match[2]);
  }
  return result;
}

export function readFrontmatter(file) {
  if (!fs.existsSync(file)) return {};
  return parseFrontmatter(fs.readFileSync(file, "utf8"));
}

export function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
