#!/usr/bin/env node
/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

// Single source of truth: .allowed-licenses.json at repo root. This fallback is only for unit-test
// helpers (parseYarnLock etc.) called without loadConfig; production always uses loadConfig().
const DEFAULT_ALLOWED = (() => {
  try {
    const cfgPath = path.join(__dirname, '..', '.allowed-licenses.json');
    const raw = fs.readFileSync(cfgPath, 'utf8');
    const cfg = JSON.parse(raw);
    if (
      Array.isArray(cfg.cncfAllowedLicenses) ||
      Array.isArray(cfg.approvedLicenses)
    ) {
      const cncf = Array.isArray(cfg.cncfAllowedLicenses)
        ? cfg.cncfAllowedLicenses
        : [];
      const approved = Array.isArray(cfg.approvedLicenses)
        ? cfg.approvedLicenses.map(l => l.id || l)
        : [];
      const merged = [...cncf, ...approved];
      if (merged.length) return merged;
    }
    if (Array.isArray(cfg.allowedLicenses) && cfg.allowedLicenses.length)
      return cfg.allowedLicenses;
  } catch {}
  return [];
})();
// keep original list only for fallback if config temporarily missing (e.g. tests):
const FALLBACK_ALLOWED = [
  '0BSD',
  'BSD-2-Clause',
  'BSD-2-Clause-FreeBSD',
  'BSD-3-Clause',
  'MIT',
  'MIT-0',
  'ISC',
  'OpenSSL',
  'OpenSSL-standalone',
  'PSF-2.0',
  'Python-2.0',
  'Python-2.0.1',
  'PostgreSQL',
  'SSLeay-standalone',
  'UPL-1.0',
  'X11',
  'Zlib',
  'Apache-2.0',
];
if (DEFAULT_ALLOWED.length === 0) DEFAULT_ALLOWED.push(...FALLBACK_ALLOWED);

// ---------------------------------------------------------------------------
// Private helpers (pure, no side effects)
// ---------------------------------------------------------------------------

function normalizeResolution(resolution) {
  if (!resolution)
    return {
      name: null,
      version: null,
      raw: resolution,
      isWorkspace: false,
      isPatch: false,
    };
  if (resolution.includes('@workspace:')) {
    return {
      name: null,
      version: null,
      raw: resolution,
      isWorkspace: true,
      isPatch: false,
    };
  }
  if (resolution.includes('@patch:')) {
    // Berry patch format: "outer@patch:selector#patch::locator" where selector is like "@scope/pkg@npm%3A1.0.0"
    // Decode and extract inner npm selector for base package name/version
    try {
      const decoded = decodeURIComponent(resolution);
      const innerMatch = decoded.match(/@patch:(.+?)@npm:([^#:]+)/);
      if (innerMatch) {
        return {
          name: innerMatch[1],
          version: innerMatch[2].split('::')[0].split('#')[0],
          raw: resolution,
          isPatch: true,
          isWorkspace: false,
        };
      }
    } catch {}
    const m = resolution.match(/npm%3A([^#&:]+)/);
    if (m) {
      let version = m[1];
      try {
        version = decodeURIComponent(version);
      } catch {}
      // Fallback: try to extract scoped name from outer
      let name = resolution.split('@patch:')[0].replace(/^"/, '');
      return {
        name,
        version,
        raw: resolution,
        isPatch: true,
        isWorkspace: false,
      };
    }
    try {
      const decoded = decodeURIComponent(resolution);
      const m2 = decoded.match(/@npm:([^#\s:]+)/);
      if (m2)
        return {
          name: decoded.split('@patch:')[0],
          version: m2[1],
          raw: resolution,
          isPatch: true,
          isWorkspace: false,
        };
    } catch {}
  }
  const idx = resolution.lastIndexOf('@npm:');
  if (idx !== -1) {
    const name = resolution.slice(0, idx);
    const rest = resolution.slice(idx + 5);
    const version = rest.split(/[#:"\s]/)[0].split('::')[0];
    return {
      name,
      version,
      raw: resolution,
      isPatch: false,
      isWorkspace: false,
    };
  }
  return {
    name: null,
    version: null,
    raw: resolution,
    isPatch: false,
    isWorkspace: false,
  };
}

function parseYarnLock(content) {
  const entries = new Map();
  const descriptorMap = new Map();
  if (!content || !content.trim()) return { entries, descriptorMap };
  const lines = content.split('\n');
  let currentDescriptors = null;
  let current = null;
  let inDependencies = false;

  function flush() {
    if (current && current.resolution) {
      entries.set(current.resolution, current);
      if (currentDescriptors) {
        for (const d of currentDescriptors)
          descriptorMap.set(d, current.resolution);
      }
    }
    current = null;
    currentDescriptors = null;
    inDependencies = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.startsWith('#')) continue;
    if (line.startsWith('__metadata:')) {
      flush();
      currentDescriptors = null;
      continue;
    }
    // header: starts at column 0, ends with ':', not indented
    if (!line.startsWith(' ') && line.endsWith(':')) {
      flush();
      let header = line.slice(0, -1).trim();
      // remove surrounding quotes
      if (header.startsWith('"') && header.endsWith('"'))
        header = header.slice(1, -1);
      // split by ', ' but keep quoted commas? descriptors never contain ', ' inside, safe
      const parts = header
        .split(/,\s*/)
        .map(s => s.trim().replace(/^"|"$/g, ''));
      currentDescriptors = parts;
      current = {
        descriptors: parts,
        dependencies: {},
        version: null,
        resolution: null,
      };
      inDependencies = false;
      continue;
    }
    if (!current) continue;
    const trimmed = line.trim();
    if (trimmed.startsWith('version:')) {
      let v = trimmed.slice('version:'.length).trim().replace(/^"|"$/g, '');
      current.version = v;
      inDependencies = false;
    } else if (trimmed.startsWith('resolution:')) {
      let r = trimmed.slice('resolution:'.length).trim().replace(/^"|"$/g, '');
      current.resolution = r;
      inDependencies = false;
    } else if (trimmed.startsWith('dependencies:')) {
      inDependencies = true;
    } else if (inDependencies) {
      // Dependencies are indented 4 spaces; top-level keys (checksum, languageName, etc.) are 2 spaces
      const leading = line.match(/^(\s+)/)?.[1] || '';
      // Exit dependencies block when indentation drops to 2 (next top-level field)
      if (
        leading.length <= 2 &&
        trimmed.endsWith(':') === false &&
        !trimmed.includes('": "npm:')
      ) {
        // Check if this is a top-level field like checksum:, languageName:, linkType:, bin:, conditions:
        if (
          /^(checksum|languageName|linkType|conditions|bin|peerDependencies|resolutions):/.test(
            trimmed,
          )
        ) {
          inDependencies = false;
          continue;
        }
        if (leading.length === 2 && !trimmed.match(/^"?[^"]+"?\s*:\s*"npm:/)) {
          inDependencies = false;
          continue;
        }
      }
      if (leading.length >= 4) {
        const m = trimmed.match(/^"?([^"]+)"?\s*:\s*"?([^"]+)"?/);
        if (m) {
          current.dependencies[m[1]] = m[2];
          continue;
        }
      } else if (leading.length === 2) {
        // Could be next field, exit
        inDependencies = false;
      }
    }
  }
  flush();
  return { entries, descriptorMap };
}

function diffEntries(baseLock, headLock) {
  const baseMap = (baseLock && baseLock.entries) || new Map();
  const headMap = (headLock && headLock.entries) || new Map();
  const changed = [];
  for (const [res, entry] of headMap) {
    const norm = normalizeResolution(res);
    if (norm.isWorkspace) continue;
    const baseEntry = baseMap.get(res);
    if (!baseEntry || baseEntry.version !== entry.version) changed.push(entry);
  }
  return changed;
}

function isOverrideActive(override, now = new Date()) {
  if (!override || override._example) return false;
  if (!override.expiresOn) return true;
  const exp = new Date(override.expiresOn);
  if (Number.isNaN(exp.getTime())) return false;
  // compare as date, not applied if expired
  return exp >= new Date(now.toISOString().slice(0, 10));
}

function isAllowedLicense(licenseExpr, allowedLicenses) {
  if (!licenseExpr || typeof licenseExpr !== 'string' || !licenseExpr.trim())
    return false;
  const trimmed = licenseExpr.trim();
  if (/^(SEE LICENSE|LicenseRef|UNLICENSED|UNKNOWN)/i.test(trimmed))
    return false;
  if (/SEE LICENSE/i.test(trimmed)) return false;
  const rawAllowed = allowedLicenses || DEFAULT_ALLOWED;
  const allowedSet = new Set(rawAllowed.map(s => String(s).toLowerCase()));
  // Normalize legacy npm license strings to SPDX ids (e.g. "Apache 2.0" -> "Apache-2.0", "Apache License, Version 2.0" -> "Apache-2.0")
  const aliasMap = {
    'apache 2.0': 'apache-2.0',
    'apache license 2.0': 'apache-2.0',
    'apache license, version 2.0': 'apache-2.0',
    'apache-2.0': 'apache-2.0',
    bsd: 'bsd-3-clause',
    'bsd license': 'bsd-3-clause',
  };
  let normalized = trimmed;
  const lower = trimmed.toLowerCase();
  if (aliasMap[lower]) normalized = aliasMap[lower];
  else if (/^apache\s+2\.0/i.test(trimmed)) normalized = 'Apache-2.0';
  // strip WITH exceptions: " GPL-2.0-only WITH Classpath-exception-2.0"
  const cleaned = normalized.replace(/\s+WITH\s+[^\s()]+/gi, '');
  // try spdx-expression-parse if available
  try {
    const parse = require('spdx-expression-parse');
    const ast = parse(cleaned);
    function evalNode(node) {
      if (!node) return false;
      if (node.license) return allowedSet.has(node.license.toLowerCase());
      if (node.conjunction === 'or')
        return evalNode(node.left) || evalNode(node.right);
      if (node.conjunction === 'and')
        return evalNode(node.left) && evalNode(node.right);
      return false;
    }
    return evalNode(ast);
  } catch {}
  // fallback
  function fallback(expr) {
    expr = expr.trim();
    if (!expr) return false;
    // handle OR (case-insensitive operator already uppercase in SPDX, but be tolerant)
    if (/\sOR\s/i.test(expr)) {
      return expr.split(/\s+OR\s+/i).some(part => fallback(part));
    }
    if (/\sAND\s/i.test(expr)) {
      return expr.split(/\s+AND\s+/i).every(part => fallback(part));
    }
    expr = expr
      .replace(/^[()]+|[()]+$/g, '')
      .trim()
      .replace(/^[()]+|[()]+$/g, '')
      .trim();
    expr = expr.replace(/[()]/g, '').trim();
    if (!expr) return false;
    return allowedSet.has(expr.toLowerCase());
  }
  return fallback(cleaned);
}

function collectTransitive(changed, headLock) {
  const visited = new Set();
  const queue = changed.map(e => e.resolution);
  const headEntries = headLock.entries;
  const descMap = headLock.descriptorMap;
  const result = [];
  while (queue.length) {
    const res = queue.shift();
    if (visited.has(res)) continue;
    visited.add(res);
    const entry = headEntries.get(res);
    if (!entry) continue;
    result.push(entry);
    if (!entry.dependencies) continue;
    for (const [depName, depRange] of Object.entries(entry.dependencies)) {
      const descriptor = `${depName}@${depRange}`;
      let target = descMap.get(descriptor);
      if (!target) continue;
      const norm = normalizeResolution(target);
      if (norm.isWorkspace) continue;
      if (!visited.has(target)) queue.push(target);
    }
  }
  return result;
}

function matchesOverride(pkgName, pkgVersion, pkgLicense, override) {
  if (override.name !== pkgName) return false;
  if (
    override.versionRange &&
    override.versionRange !== '*' &&
    override.versionRange !== pkgVersion
  )
    return false;
  if (override.license && pkgLicense && override.license !== pkgLicense)
    return false;
  return true;
}

function createDefaultFetchLicense() {
  const cache = new Map();
  return async function fetchLicense(name, version) {
    const key = `${name}@${version}`;
    if (cache.has(key)) return cache.get(key);
    const url = `https://registry.npmjs.org/${encodeURIComponent(
      name,
    )}/${encodeURIComponent(version)}`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
        });
        if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
          await new Promise(r => setTimeout(r, attempt * 500));
          continue;
        }
        if (!res.ok) {
          cache.set(key, null);
          return null;
        }
        const data = await res.json();
        const lic = data.license || data.licenses || null;
        let licStr = null;
        if (typeof lic === 'string') licStr = lic;
        else if (Array.isArray(lic))
          licStr = lic
            .map(l => (typeof l === 'string' ? l : l.type || l.license || ''))
            .filter(Boolean)
            .join(' OR ');
        else if (lic && typeof lic === 'object')
          licStr = lic.type || lic.license || null;
        if (
          licStr &&
          !/^SEE LICENSE/i.test(licStr) &&
          !/^LicenseRef/i.test(licStr) &&
          licStr.trim()
        ) {
          cache.set(key, licStr);
          return licStr;
        }
        // Dynamic fallback: registry missing/SEE LICENSE -> try GitHub LICENSE via repository URL
        const repoUrl =
          typeof data.repository === 'string'
            ? data.repository
            : data.repository?.url || data.homepage || '';
        const ghMatch = repoUrl.match(
          /github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/i,
        );
        if (ghMatch) {
          const owner = ghMatch[1];
          const repo = ghMatch[2].replace(/\.git$/, '');
          try {
            const ghRes = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/license`,
              { headers: { Accept: 'application/vnd.github.v3+json' } },
            );
            if (ghRes.ok) {
              const ghData = await ghRes.json();
              const ghLicense =
                ghData.license?.spdx_id || ghData.license?.name || null;
              if (ghLicense && ghLicense !== 'NOASSERTION') {
                cache.set(key, ghLicense);
                return ghLicense;
              }
            }
          } catch {}
        }
        cache.set(key, licStr);
        return licStr;
      } catch {
        await new Promise(r => setTimeout(r, attempt * 500));
      }
    }
    cache.set(key, null);
    return null;
  };
}

// ---------------------------------------------------------------------------
// Pure module interface: single external interface
// ---------------------------------------------------------------------------

/**
 * Check licenses for changed packages and their transitive closure.
 *
 * Pure: no fs, no process.exit, no ::error, no summary. Dependencies are
 * injected via `fetchLicense`. Returns a result object for adapters to render.
 *
 * @param {object} opts
 * @param {string} opts.baseContent - yarn.lock content for base
 * @param {string} opts.headContent - yarn.lock content for head
 * @param {string[]} opts.allowedLicenses - SPDX ids (case-insensitive check inside)
 * @param {object[]} opts.overrides - entries from .allowed-licenses.json (filtered internally for _example and expiry)
 * @param {function} opts.fetchLicense - async (name, version) => licenseString | null, injected; defaults to npm registry with cache
 * @returns {Promise<{violations: Array<{name:string,version:string,license:string,resolution:string}>, checked:number, changed:number, closure:Array, warnings:Array}>}
 */
async function checkLicenses({
  baseContent = '',
  headContent = '',
  allowedLicenses,
  overrides,
  fetchLicense,
} = {}) {
  const allowed = allowedLicenses ?? DEFAULT_ALLOWED;
  const rawOverrides = overrides ?? [];
  // Filter _example and expired overrides internally; loadConfig already filters _example but we enforce here
  const activeOverrides = rawOverrides.filter(o => isOverrideActive(o));

  const baseLock = parseYarnLock(baseContent || '');
  const headLock = parseYarnLock(headContent || '');
  const changedEntries = diffEntries(baseLock, headLock);
  const closureEntries = collectTransitive(changedEntries, headLock);

  const checked = closureEntries.length;
  const changed = changedEntries.length;
  const closure = closureEntries;
  const warnings = [];

  if (closureEntries.length === 0) {
    return { violations: [], checked, changed, closure, warnings };
  }

  const fetchFn = fetchLicense ?? createDefaultFetchLicense();
  const violations = [];
  const batchSize = 20;

  for (let i = 0; i < closureEntries.length; i += batchSize) {
    const batch = closureEntries.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async entry => {
        const norm = normalizeResolution(entry.resolution);
        if (norm.isWorkspace) return null;
        if (!norm.name || !norm.version) return null;
        let license = null;
        try {
          license = await fetchFn(norm.name, norm.version);
        } catch (e) {
          warnings.push({
            name: norm.name,
            version: norm.version,
            message: `fetch failed: ${e && e.message ? e.message : String(e)}`,
          });
          license = null;
        }
        const allowedLicense = isAllowedLicense(license, allowed);
        if (allowedLicense) return null;
        for (const ov of activeOverrides) {
          if (matchesOverride(norm.name, norm.version, license, ov))
            return null;
        }
        if (!license) {
          warnings.push({
            name: norm.name,
            version: norm.version,
            message: 'missing license field from registry',
          });
        }
        return {
          name: norm.name,
          version: norm.version,
          license: license || '(missing)',
          resolution: entry.resolution,
        };
      }),
    );
    for (const r of results) if (r) violations.push(r);
  }

  return { violations, checked, changed, closure, warnings };
}

// ---------------------------------------------------------------------------
// Adapters (I/O at edges)
// ---------------------------------------------------------------------------

function loadConfig(configPath) {
  let allowedLicenses = DEFAULT_ALLOWED;
  let overrides = [];
  let cncfPolicyRev = null;
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const cfg = JSON.parse(raw);
    if (
      Array.isArray(cfg.cncfAllowedLicenses) ||
      Array.isArray(cfg.approvedLicenses)
    ) {
      const cncf = Array.isArray(cfg.cncfAllowedLicenses)
        ? cfg.cncfAllowedLicenses
        : [];
      const approvedIds = Array.isArray(cfg.approvedLicenses)
        ? cfg.approvedLicenses.map(l => l.id || l).filter(Boolean)
        : [];
      const merged = [...cncf, ...approvedIds];
      if (merged.length) allowedLicenses = merged;
    } else if (Array.isArray(cfg.allowedLicenses) && cfg.allowedLicenses.length)
      allowedLicenses = cfg.allowedLicenses;
    if (Array.isArray(cfg.overrides))
      overrides = cfg.overrides.filter(o => !o._example);
    cncfPolicyRev = cfg.cncfPolicyRev || null;
  } catch {}
  return { allowedLicenses, overrides, cncfPolicyRev };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node scripts/check-licenses.js [options]
Options:
  --base-lock <path>   Path to base yarn.lock (default: /tmp/base-yarn.lock or empty)
  --head-lock <path>   Path to head yarn.lock (default: yarn.lock)
  --config <path>      Path to .allowed-licenses.json (default: .allowed-licenses.json)
  --base-ref <ref>     Git ref for base (e.g. HEAD:yarn.lock) — extracted via git show
  --help               Show this help`);
    process.exit(0);
  }
  let baseLockPath = null;
  let headLockPath = 'yarn.lock';
  let configPath = '.allowed-licenses.json';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base-lock' && args[i + 1]) baseLockPath = args[++i];
    else if (args[i] === '--head-lock' && args[i + 1]) headLockPath = args[++i];
    else if (args[i] === '--config' && args[i + 1]) configPath = args[++i];
    else if (args[i] === '--base-ref' && args[i + 1]) {
      const ref = args[++i];
      try {
        const content = execSync(`git show ${ref}`, {
          encoding: 'utf8',
          maxBuffer: 50 * 1024 * 1024,
        });
        fs.writeFileSync('/tmp/base-yarn.lock', content, 'utf8');
        baseLockPath = '/tmp/base-yarn.lock';
      } catch {
        baseLockPath = null;
      }
    }
  }
  // default base detection for workflow
  if (!baseLockPath) {
    if (fs.existsSync('/tmp/base-yarn.lock'))
      baseLockPath = '/tmp/base-yarn.lock';
    else baseLockPath = null;
  }

  let baseContent = '';
  let headContent = '';
  try {
    if (baseLockPath && fs.existsSync(baseLockPath))
      baseContent = fs.readFileSync(baseLockPath, 'utf8');
  } catch {}
  try {
    headContent = fs.readFileSync(headLockPath, 'utf8');
  } catch (e) {
    console.error(
      `::error file=${headLockPath}::Failed to read head lockfile: ${e.message}`,
    );
    process.exit(1);
  }

  const config = loadConfig(configPath);

  const result = await checkLicenses({
    baseContent,
    headContent,
    allowedLicenses: config.allowedLicenses,
    overrides: config.overrides,
  });

  if (result.changed === 0) {
    console.log('No changed npm packages detected.');
    process.exit(0);
  }

  if (result.violations.length === 0) {
    console.log(
      `Checked ${result.checked} packages (${result.changed} changed + transitive), no violations.`,
    );
    process.exit(0);
  }

  // reporting
  for (const v of result.violations) {
    console.log(
      `::error file=yarn.lock::License violation: ${v.name}@${v.version} has license "${v.license}" not in allowlist`,
    );
  }
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  const tableHeader = '| Package | Version | License |\n|---|---|---|\n';
  const tableRows = result.violations
    .map(v => `| ${v.name} | ${v.version} | ${v.license} |`)
    .join('\n');
  const summary = `### License check violations: ${result.violations.length}\n\n${tableHeader}${tableRows}\n`;
  if (summaryPath) {
    try {
      fs.appendFileSync(summaryPath, summary, 'utf8');
    } catch {}
  } else {
    console.log('\n' + summary);
  }
  console.table(
    result.violations.map(v => ({
      package: v.name,
      version: v.version,
      license: v.license,
    })),
  );
  process.exit(1);
}

if (require.main === module) main();

// Primary export is checkLicenses (single external interface).
// Additional exports are for backward compatibility with existing tests;
// consider them an internal seam — prefer testing via checkLicenses.
module.exports = {
  checkLicenses,
  parseYarnLock,
  diffEntries,
  isAllowedLicense,
  isOverrideActive,
  normalizeResolution,
  collectTransitive,
  DEFAULT_ALLOWED,
  // internal adapters exposed for testing/compat but not part of stable API
  loadConfig,
  matchesOverride,
};
