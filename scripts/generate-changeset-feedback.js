/*
 * Copyright 2022 The Backstage Authors
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

const fs = require('fs');
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');
const {
  basename,
  resolve: resolvePath,
  relative: relativePath,
} = require('path');

const execFile = promisify(execFileCb);

// Tells whether a path relative to the package directory has an effect
// on the published package
function isPublishedPath(path) {
  if (path.startsWith('dev/')) {
    return false;
  }
  if (path.includes('__mocks__')) {
    return false;
  }
  if (path.includes('__fixtures__')) {
    return false;
  }
  // Don't count manual modifications to the changelog
  if (path === 'CHANGELOG.md') {
    return false;
  }
  // API report changes by themselves don't count
  if (path === 'api-report.md') {
    return false;
  }
  // Lint changes don't count
  if (path === '.eslintrc.js') {
    return false;
  }

  const name = basename(path);
  if (name.startsWith('setupTests.')) {
    return false;
  }
  if (name.includes('.test.')) {
    return false;
  }
  if (name.includes('.stories.')) {
    return false;
  }
  return true;
}

async function listChangedFiles(ref) {
  if (!ref) {
    throw new Error('ref is required');
  }

  const { stdout } = await execFile('git', ['diff', '--name-only', ref]);
  return stdout.trim().split(/\r?\n/);
}

async function listPackages() {
  const { stdout } = await execFile('yarn', ['-s', 'workspaces', 'info']);
  return Object.entries(JSON.parse(stdout)).map(([name, info]) => ({
    name,
    path: info.location,
  }));
}

async function loadChangesets(filePaths) {
  const changesets = [];
  for (const filePath of filePaths) {
    if (!filePath.startsWith('.changeset/') || !filePath.endsWith('.md')) {
      continue;
    }
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      let lines = content.split(/\r?\n/);

      lines = lines.slice(lines.findIndex(line => line === '---') + 1);
      lines = lines.slice(
        0,
        lines.findIndex(line => line === '---'),
      );

      const bumps = new Map();
      bumps.toJSON = () => Object.fromEntries(bumps);
      for (const line of lines) {
        const match = line.match(/^'(.*)': (patch|minor|major)$/);
        if (!match) {
          throw new Error(`Invalid changeset line: ${line}`);
        }

        bumps.set(match[1], match[2]);
      }

      changesets.push({
        filePath,
        bumps,
      });
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return changesets;
}

async function listChangedPackages(changedFiles, packages) {
  const changedPackageMap = new Map();
  for (const filePath of changedFiles) {
    for (const pkg of packages) {
      if (filePath.startsWith(`${pkg.path}/`)) {
        const pkgPath = relativePath(pkg.path, filePath);
        if (!isPublishedPath(pkgPath)) {
          break;
        }
        const entry = changedPackageMap.get(pkg.name);
        if (entry) {
          entry.files.push(pkgPath);
        } else {
          const pkgJson = require(resolvePath(pkg.path, 'package.json'));

          changedPackageMap.set(pkg.name, {
            ...pkg,
            version: pkgJson.version,
            isStable: !pkgJson.version.startsWith('0.'),
            isPrivate: Boolean(pkgJson.private),
            files: [pkgPath],
          });
        }
        break;
      }
    }
  }
  return Array.from(changedPackageMap.values());
}

function formatSection(prefix = [], generator, suffix = ['']) {
  const lines = Array.from(generator());
  if (lines.length === 0) {
    return '';
  }

  return [...[prefix].flat(), ...lines, ...[suffix].flat(), '', ''].join('\n');
}

function formatSummary(changedPackages, changesets) {
  const changedNames = new Set(changedPackages.map(pkg => pkg.name));

  let output = '';

  output += formatSection(
    `## Missing Changesets

The following package(s) are changed by this PR but do not have a changeset:
`,
    function* section() {
      for (const pkg of changedPackages) {
        if (changesets.some(c => c.bumps.get(pkg.name))) {
          continue;
        }
        if (pkg.isPrivate) {
          continue;
        }
        yield `- **${pkg.name}**`;
      }
    },
    `
See [CONTRIBUTING.md](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#creating-changesets) for more information about how to add changesets.
`,
  );

  output += formatSection(
    `## Unexpected Changesets

The following changeset(s) reference packages that have not been changed in this PR:
`,
    function* section() {
      for (const c of changesets) {
        const missing = Array.from(c.bumps.keys()).filter(
          b => !changedNames.has(b),
        );
        if (missing.length > 0) {
          yield `- **${c.filePath}**: ${missing.join(', ')}`;
        }
      }
    },
    `
Note that only changes that affect the published package require changesets, for example changes to tests and storybook stories do not require changesets.
`,
  );

  output += formatSection(
    `## Unnecessary Changesets

The following package(s) are private and do not need a changeset:
`,
    function* section() {
      for (const pkg of changedPackages) {
        if (changesets.some(c => c.bumps.get(pkg.name)) && pkg.isPrivate) {
          yield `- **${pkg.name}**`;
        }
      }
    },
  );

  output += formatSection(
    `## Changed Packages

| Package Name | Package Path | Changeset Bump | Current Version |
|:-------------|:-------------|:--------------:|:----------------|`,
    function* section() {
      const bumpMap = {
        undefined: -1,
        patch: 0,
        minor: 1,
        major: 2,
      };

      for (const pkg of changedPackages) {
        const maxBump =
          changesets
            .map(c => c.bumps.get(pkg.name))
            .reduce(
              (max, bump) => (bumpMap[bump] > bumpMap[max] ? bump : max),
              undefined,
            ) ?? 'none';
        yield `| ${pkg.name} | ${pkg.path} | **${maxBump}** | \`v${pkg.version}\` |`;
      }
    },
  );

  return output;
}

async function main() {
  const [diffRef = 'origin/master'] = process.argv.slice(2);
  const changedFiles = await listChangedFiles(diffRef);
  const packages = await listPackages();

  const changesets = await loadChangesets(changedFiles);
  const changedPackages = await listChangedPackages(changedFiles, packages);

  process.stderr.write(
    JSON.stringify(
      {
        changesets,
        changedPackages,
      },
      null,
      2,
    ),
  );

  const summary = formatSummary(changedPackages, changesets);
  process.stdout.write(summary);
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
