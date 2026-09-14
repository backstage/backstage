#!/usr/bin/env node
/* eslint-disable @backstage/no-undeclared-imports */
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

const { execFile: execFileCallback } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const { promisify } = require('node:util');
const { getPackages } = require('@manypkg/get-packages');
const prettier = require('prettier');

const execFile = promisify(execFileCallback);
const bumpLevels = { patch: 1, minor: 2, major: 3 };

function isNextReleaseVersion(version) {
  return version.includes('-next.');
}

function getChangelogEntry(changelog, version) {
  const heading = `## ${version}`;
  const start = changelog.split(/\r?\n/).findIndex(line => line === heading);

  if (start === -1) {
    return undefined;
  }

  const lines = changelog.split(/\r?\n/);
  let end = lines.findIndex(
    (line, index) => index > start && /^## /.test(line),
  );
  if (end === -1) {
    end = lines.length;
  }

  const content = lines
    .slice(start + 1, end)
    .join('\n')
    .trim();
  const highestLevel = [
    ...content.matchAll(/^### (Major|Minor|Patch) Changes$/gim),
  ]
    .map(match => bumpLevels[match[1].toLowerCase()])
    .reduce((highest, level) => Math.max(highest, level), 0);

  return { content, highestLevel };
}

function sortEntries(a, b) {
  if (a.private !== b.private) {
    return a.private ? 1 : -1;
  }
  return b.highestLevel - a.highestLevel;
}

async function readVersionAtHead(rootDir, packageDir) {
  const packagePath = path
    .relative(rootDir, path.join(packageDir, 'package.json'))
    .split(path.sep)
    .join('/');
  try {
    const { stdout } = await execFile('git', ['show', `HEAD:${packagePath}`], {
      cwd: rootDir,
    });
    return JSON.parse(stdout).version;
  } catch (error) {
    if (error.stderr?.includes('exists on disk, but not in')) {
      return undefined;
    }
    throw error;
  }
}

async function createReleaseChangelog(rootDir = process.cwd()) {
  const { packages } = await getPackages(rootDir);
  const entries = [];

  for (const pkg of packages) {
    const previousVersion = await readVersionAtHead(rootDir, pkg.dir);
    if (previousVersion === pkg.packageJson.version) {
      continue;
    }

    const changelog = await fs.readFile(
      path.join(pkg.dir, 'CHANGELOG.md'),
      'utf8',
    );
    const entry = getChangelogEntry(changelog, pkg.packageJson.version);
    if (!entry) {
      throw new Error(
        `Could not find changelog entry for ${pkg.packageJson.name}@${pkg.packageJson.version}`,
      );
    }

    entries.push({
      ...entry,
      private: Boolean(pkg.packageJson.private),
      content: `## ${pkg.packageJson.name}@${pkg.packageJson.version}\n\n${entry.content}`,
    });
  }

  entries.sort(sortEntries);

  const rootPackage = JSON.parse(
    await fs.readFile(path.join(rootDir, 'package.json'), 'utf8'),
  );
  const releaseVersion = rootPackage.version;
  const changelogPath = path.join(
    rootDir,
    'docs',
    'releases',
    `v${releaseVersion}-changelog.md`,
  );
  const upgradeHelper = `https://backstage.github.io/upgrade-helper/?to=${releaseVersion}`;
  const markdown = `# Release v${releaseVersion}\n\nUpgrade Helper: [${upgradeHelper}](${upgradeHelper})\n\n${entries
    .map(entry => entry.content)
    .join('\n\n')}\n`;
  const prettierConfig = await prettier.resolveConfig(rootDir);
  const formatted = prettier.format(markdown, {
    ...prettierConfig,
    parser: 'markdown',
  });

  await fs.mkdir(path.dirname(changelogPath), { recursive: true });
  await fs.writeFile(changelogPath, formatted);
  console.log(`Created ${path.relative(rootDir, changelogPath)}`);
}

if (require.main === module) {
  createReleaseChangelog().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  createReleaseChangelog,
  getChangelogEntry,
  isNextReleaseVersion,
  sortEntries,
};
