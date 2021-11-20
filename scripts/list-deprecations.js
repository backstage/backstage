#!/usr/bin/env node
/*
 * Copyright 2021 The Backstage Authors
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

/* eslint-disable import/no-extraneous-dependencies */

const _ = require('lodash');
const fs = require('fs-extra');
const globby = require('globby');
const { resolve: resolvePath, relative: relativePath } = require('path');
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

const execFile = promisify(execFileCb);

const WORKER_COUNT = 16;

const deprecatedPattern = /@deprecated|DEPRECATION/;

class ReleaseProvider {
  cache = new Map();

  async lookup(commitSha) {
    if (this.cache.has(commitSha)) {
      return this.cache.get(commitSha);
    }

    const { stdout: tagOutput } = await execFile(
      'git',
      ['tag', '--contains', commitSha],
      { shell: true },
    );

    const [release] = tagOutput
      .split('\n')
      .filter(l => l.startsWith('release-'));

    this.cache.set(commitSha, release);
    return release;
  }
}

async function main() {
  const rootPath = resolvePath(__dirname, '..');
  const packageDirQueue = await Promise.all([
    fs.readdir(resolvePath(rootPath, 'packages')),
    fs.readdir(resolvePath(rootPath, 'plugins')),
  ]).then(([packages, plugins]) => [
    ...packages.map(dir => `packages/${dir}`),
    ...plugins.map(dir => `plugins/${dir}`),
  ]);

  const fileQueue = [];
  const deprecationQueue = [];
  const releaseProvider = new ReleaseProvider();
  const deprecations = [];

  await Promise.all(
    Array(WORKER_COUNT)
      .fill()
      .map(async () => {
        // Find all files we want to scan
        while (packageDirQueue.length) {
          const packageDir = packageDirQueue.pop();
          const srcDir = resolvePath(rootPath, packageDir, 'src');

          if (await fs.pathExists(srcDir)) {
            const files = await globby(['**/*.{js,jsx,ts,tsx}'], {
              cwd: srcDir,
            });
            fileQueue.push(...files.map(file => resolvePath(srcDir, file)));
          }
        }

        // Parse files and search for deprecations
        while (fileQueue.length) {
          const file = fileQueue.pop();
          const content = await fs.readFile(file, 'utf8');
          if (!deprecatedPattern.test(content)) {
            continue;
          }

          const lines = content.split('\n');
          for (const [index, line] of lines.entries()) {
            if (deprecatedPattern.test(line)) {
              deprecationQueue.push({
                file,
                lineNumber: index + 1,
                lineContent: line,
              });
            }
          }
        }

        // Lookup git information for each deprecation
        while (deprecationQueue.length) {
          const deprecation = deprecationQueue.pop();

          const { file, lineNumber: n, lineContent } = deprecation;
          const { stdout: blameOutput } = await execFile(
            'git',
            ['blame', '--porcelain', `-L ${n},${n}`, file],
            { shell: true },
          );

          const blameInfo = Object.fromEntries(
            blameOutput
              .split('\n')
              .slice(1, -2)
              .map(line => {
                const [key] = line.split(' ', 1);
                return [key, line.slice(key.length + 1)];
              }),
          );
          const [commit] = blameOutput.split(' ', 1);
          const { author, ['author-time']: authorTime } = blameInfo;

          const release = await releaseProvider.lookup(commit);

          deprecations.push({
            file: relativePath(rootPath, file),
            release,
            commit,
            author,
            authorTime: new Date(authorTime * 1000),
            lineContent,
            lineNumber: n,
          });
        }
      }),
  );

  const maxAuthor = Math.max(...deprecations.map(d => d.author.length)) + 1;

  // Group and sort by release
  const sortedByRelease = _.sortBy(
    Object.entries(_.groupBy(deprecations, 'release')),
    ([release]) => release,
  );

  for (const [release, ds] of sortedByRelease) {
    console.log(`\n### ${release === 'undefined' ? 'Not released' : release}`);
    for (const d of _.sortBy(ds, 'authorTime', 'file', 'lineNumber')) {
      console.log(
        [
          d.commit.slice(0, 8),
          d.authorTime.toLocaleDateString().padEnd('00/00/0000'.length + 1),
          d.author.padEnd(maxAuthor + 1),
          `${d.file}:${d.lineNumber}`,
        ].join(' '),
      );
    }
  }
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
