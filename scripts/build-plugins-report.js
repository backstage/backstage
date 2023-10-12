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
const pluginsDirectory = path.resolve(rootDirectory, 'plugins');

async function run(command, ...args) {
  const { stdout, stderr } = await execFile(command, args, {
    cwd: rootDirectory,
  });

  if (stderr) {
    console.error(stderr);
  }

  return stdout.trim();
}

function findLatestValidCommit(commits, directoryPath) {
  return commits.find(commit => {
    const { author, message, files } = commit;

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
        'ben@blam.sh',
        'freben@gmail.com',
        'poldsberg@gmail.com',
        'johan.haals@gmail.com',
      ].some(email => author.includes(email))
    ) {
      return false;
    }

    // ignore multiple plugins changes
    if (
      files.some(file => {
        const fileFullPath = path.resolve(rootDirectory, file);
        if (!fileFullPath.startsWith(pluginsDirectory)) {
          return false;
        }
        const pluginBasePath = directoryPath.replace(
          /-(backend|common|react|node).*$/,
          '',
        );
        return !fileFullPath.startsWith(pluginBasePath);
      })
    ) {
      return false;
    }

    return true;
  });
}

async function getPluginDirectory(directoryName) {
  const directoryPath = path.resolve(pluginsDirectory, directoryName);
  const packageJson = await fs.readJson(
    path.resolve(directoryPath, 'package.json'),
  );
  return { directoryName, directoryPath, packageJson };
}

function parseCommitsLog(log) {
  const lines = log.split('\n');
  return lines.reduce((commits, line) => {
    if (!line) return commits;
    if (line.includes(';')) {
      const [author, message, date] = line.split(';');
      return [...commits, { author, message, date, files: [] }];
    }
    const { files, ...commit } = commits.pop();
    return [...commits, { ...commit, files: [...files, line] }];
  }, []);
}

async function readDirectoryCommits(directoryName) {
  const maxCount = 100;
  const directoryPath = path.resolve(pluginsDirectory, directoryName);

  const logOutput = await run(
    'git',
    'log',
    'origin/master',
    '--name-only',
    `--max-count=${maxCount}`,
    '--pretty=format:%an <%ae>;%s;%as',
    '--',
    // ignore changes on README and package.json files
    path.posix.resolve(directoryPath, 'src'),
    `:(exclude)${path.posix.resolve(directoryPath, 'src', '**', '*.test.*')}`,
  );

  return parseCommitsLog(logOutput);
}

async function getLatestDirectoryCommit({ directoryName, directoryPath }) {
  console.log(`🔎 Reading data for ${directoryName}`);

  const commits = await readDirectoryCommits(directoryName);

  const commit = findLatestValidCommit(commits, directoryPath) ?? {
    author: '-',
    message: '-',
    date: '-',
  };

  return { plugin: directoryName, ...commit };
}

function isValidDirectory({ packageJson }) {
  const roles = [
    'frontend-plugin',
    'frontend-plugin-module',
    'backend-plugin',
    'backend-plugin-module',
  ];
  return roles.includes(packageJson?.backstage?.role ?? '');
}

async function main() {
  const directoryNames = fs
    .readdirSync(pluginsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const directories = await Promise.all(directoryNames.map(getPluginDirectory));

  const commits = await Promise.all(
    directories.filter(isValidDirectory).map(getLatestDirectoryCommit),
  );

  const fileName = 'plugins-report.csv';

  const fileContent = [
    'Plugin;Author;Message;Date',
    ...commits.map(c => `${c.plugin};${c.author};${c.message};${c.date}`),
  ];

  console.log(`📊 Generating plugins report...`);

  fs.writeFile(fileName, fileContent.join('\n'), err => {
    if (err) throw err;
  });

  console.log(`📄 Report generated at ${fileName}`);
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
