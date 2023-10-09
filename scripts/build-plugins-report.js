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
const open = require('open');
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

function generateHtmlReport(rows) {
  const thead = `<tr>${rows[0].map(cell => `<th>${cell}</th>`).join('')}</tr>`;

  const tbody = rows
    .slice(1)
    .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');

  return `
    <html lang="en">
      <head>
        <title>Backstage Plugins Report</title>
        <style>
          * {font-family:sans-serif;}
          table {width:100%; border-collapse: collapse;}
          table,td,th {border:1px solid;}
        </style>
      </head>
      <body>
        <table>
          <thead>${thead}</thead>
          <tbody>${tbody}</tbody>
        </table>
      </body>
    </html>
  `;
}

const PLUGIN_ROLES = ['frontend-plugin', 'backend-plugin'];

async function main() {
  const pluginsDirectory = path.resolve(rootDirectory, 'plugins');

  const directoryNames = fs
    .readdirSync(pluginsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const tableRows = [['Plugin', 'Author', 'Message', 'Date']];

  for (const directoryName of directoryNames) {
    console.log(`🔎 Reading data for ${directoryName}`);

    const directoryPath = path.resolve(pluginsDirectory, directoryName);

    const packageJson = await fs.readJson(
      path.resolve(directoryPath, 'package.json'),
    );

    const plugin = PLUGIN_ROLES.includes(packageJson?.backstage?.role ?? '');

    if (!plugin) continue;

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
        '--format=%an;%s;%as',
        directoryPath,
      );

      data = output.split('\n').find(commit => {
        // exclude merge commits
        if (commit.includes('Merge pull request #')) {
          return false;
        }

        // exclude commits authored by a bot
        if (
          commit.startsWith('renovate[bot]') ||
          commit.startsWith('github-actions[bot]')
        ) {
          return false;
        }

        return true;
      });

      skip += 10;
    }

    if (data) {
      tableRows.push([directoryName, ...data.split(';')]);
    } else {
      console.log(`⚠️ No data found for ${directoryName}`);
    }
  }

  const file = 'plugins-report.html';

  console.log(`📊 Generating plugins report...`);

  fs.writeFile(file, generateHtmlReport(tableRows), err => {
    if (err) throw err;
  });

  console.log(`📄 Opening ${file} file...`);

  open(file);
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
