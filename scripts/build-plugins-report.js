#!/usr/bin/env node
/*
 * Copyright 2023 The Backstage Authors
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

const fs = require('fs-extra');
const path = require('path');
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

const execFile = promisify(execFileCb);

const rootDirectory = path.resolve(__dirname, '..');

async function run(command, ...args) {
  const { stdout, stderr } = await execFile(command, args, {
    cwd: rootDirectory,
  });

  if (stderr) {
    console.error(stderr);
  }

  return stdout.trim();
}

const PLUGIN_AND_MODULE_ROLES = [
  'frontend-plugin',
  'backend-plugin',
  'frontend-plugin-module',
  'frontend-plugin-module',
];

async function main() {
  const pluginsDirectory = path.resolve(rootDirectory, 'plugins');

  const directoryNames = fs
    .readdirSync(pluginsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const content = ['Plugin;Author;Message;Hash;Date'];

  for (const directoryName of directoryNames) {
    console.log(`🔎 Reading data for ${directoryName}`);

    const directoryPath = path.resolve(pluginsDirectory, directoryName);

    const packageJson = await fs.readJson(
      path.resolve(directoryPath, 'package.json'),
    );

    const isPluginOrModule = PLUGIN_AND_MODULE_ROLES.includes(
      packageJson?.backstage?.role ?? '',
    );

    if (!isPluginOrModule) continue;

    let data;
    let skip = 0;
    const maxCount = 10;
    while (!data && skip <= 100) {
      const output = await run(
        'git',
        'log',
        'origin/master',
        `--skip=${skip}`,
        `--max-count=${maxCount}`,
        '--format=%an <%ae>;%s;%h;%as',
        '--',
        // ignore changes on README and package.json files
        path.resolve(directoryPath, 'src', '**', '*.ts'),
        path.resolve(directoryPath, 'src', '**', '*.tsx'),
      );

      data = output
        .trim()
        .split('\n')
        .find(commit => {
          if (!commit) return false;

          const [author, message] = commit.split(';');

          // exclude merge commits
          if (message.startsWith('Merge pull request #')) {
            return false;
          }

          // exclude commits authored by a bot
          if (author.includes('[bot]')) {
            return false;
          }

          // exclude core maintainers' commits
          if (
            [
              'Johan Haals <johan.haals@gmail.com>',
              'Patrik Oldsberg <poldsberg@gmail.com>',
              'Fredrik Adelöw <freben@gmail.com>',
              'blam <ben@blam.sh>',
            ].includes(author)
          ) {
            return false;
          }

          return true;
        });

      skip += maxCount;
    }

    if (data) {
      content.push(`${directoryName};${data}`);
    } else {
      console.log(` 🚩 No data found for ${directoryName}`);
    }
  }

  const file = 'plugins-report.csv';

  console.log(`📊 Generating plugins report...`);

  fs.writeFile(file, content.join('\n'), err => {
    if (err) throw err;
  });

  console.log(`📄 Report generated at ${file}`);
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
