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

const { spawnSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { isAbsolute, join, relative, resolve, sep } = require('node:path');
const { getPackagesSync } = require('@manypkg/get-packages');
const YAML = require('yaml');
const {
  OXLINT_PACKAGE_LINT_SCRIPT,
} = require('../packages/cli-module-oxlint/config/lintScripts');

function contains(directory, file) {
  const path = relative(directory, file);
  return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function main(files) {
  if (files.length === 0) {
    return;
  }

  const { root, packages } = getPackagesSync(process.cwd());
  const { yarnPath } = YAML.parse(
    readFileSync(join(root.dir, '.yarnrc.yml'), 'utf8'),
  );
  if (typeof yarnPath !== 'string') {
    throw new Error('Staged linting requires yarnPath in .yarnrc.yml');
  }

  packages.sort((a, b) => b.dir.length - a.dir.length);
  // Files in packages that lint through the Backstage CLI are fixed with a
  // single ESLint run from the root; other packages use their own lint script
  const eslintFiles = [];
  const scriptGroups = new Map();
  for (const file of files) {
    const absolutePath = resolve(file);
    if (!contains(root.dir, absolutePath)) {
      throw new Error(`Staged file is outside the repository: ${file}`);
    }
    const pkg = packages.find(candidate =>
      contains(candidate.dir, absolutePath),
    );
    const lintScript = pkg?.packageJson.scripts?.lint;
    // Packages that lint through the Backstage CLI are fixed with a single
    // ESLint run from the root; the Oxlint module and any other package with
    // its own lint script is fixed through that script.
    const usesOwnLintScript =
      lintScript?.startsWith(OXLINT_PACKAGE_LINT_SCRIPT) ||
      (Boolean(lintScript) && !lintScript.startsWith('backstage-cli '));
    if (!pkg || !lintScript || !usesOwnLintScript) {
      eslintFiles.push(absolutePath);
      continue;
    }
    if (!scriptGroups.has(pkg)) {
      scriptGroups.set(pkg, new Set());
    }
    // Prefix paths so filenames starting with "-" cannot become lint flags.
    scriptGroups
      .get(pkg)
      .add(`./${relative(pkg.dir, absolutePath).split(sep).join('/')}`);
  }

  const runs = [];
  if (eslintFiles.length > 0) {
    runs.push({
      cwd: root.dir,
      args: ['eslint', '--fix', '--', ...eslintFiles],
    });
  }
  for (const [pkg, paths] of scriptGroups) {
    runs.push({ cwd: pkg.dir, args: ['run', 'lint', '--fix', ...paths] });
  }

  // Every group runs even if an earlier one fails, so all files get fixed
  for (const { cwd, args } of runs) {
    // Run the pinned Yarn entry through Node; no shell or Windows .cmd handling.
    const result = spawnSync(
      process.execPath,
      [resolve(root.dir, yarnPath), ...args],
      { cwd, stdio: 'inherit' },
    );
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      process.exitCode = result.status ?? 1;
    }
  }
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
