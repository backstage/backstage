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

const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const { Octokit } = require('@octokit/rest');
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

const execFile = promisify(execFileCb);

const owner = 'backstage';
const repo = 'backstage';
const rootDir = path.resolve(__dirname, '..');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function run(command, ...args) {
  const { stdout, stderr } = await execFile(command, args, {
    cwd: rootDir,
  });

  if (stderr) {
    console.error(stderr);
  }

  return stdout.trim();
}

/**
 * Finds the current stable release version of the repo, looking at
 * the current commit and backwards, finding the first commit were a
 * stable version is present.
 */
async function findCurrentReleaseVersion() {
  const rootPkgPath = path.resolve(rootDir, 'package.json');
  const pkg = await fs.readJson(rootPkgPath);

  if (!semver.prerelease(pkg.version)) {
    return pkg.version;
  }

  const { stdout: revListStr } = await execFile('git', [
    'rev-list',
    'HEAD',
    '--',
    'package.json',
  ]);
  const revList = revListStr.trim().split(/\r?\n/);

  for (const rev of revList) {
    const { stdout: pkgJsonStr } = await execFile('git', [
      'show',
      `${rev}:package.json`,
    ]);
    if (pkgJsonStr) {
      const pkgJson = JSON.parse(pkgJsonStr);
      if (!semver.prerelease(pkgJson.version)) {
        return pkgJson.version;
      }
    }
  }

  throw new Error('No stable release found');
}

async function main(prNumberStr) {
  const prNumber = parseInt(prNumberStr, 10);
  if (!Number.isInteger(prNumber)) {
    throw new Error('Must provide a PR number as the first argument');
  }
  console.log(`PR number: ${prNumber}`);

  if (await run('git', 'status', '--porcelain')) {
    throw new Error('Cannot run with a dirty working tree');
  }

  const release = await findCurrentReleaseVersion();
  console.log(`Patching release ${release}`);

  await run('git', 'fetch');

  const patchBranch = `patch/v${release}`;
  try {
    await run('git', 'checkout', `origin/${patchBranch}`);
  } catch {
    await run('git', 'checkout', '-b', patchBranch, `v${release}`);
    await run('git', 'push', 'origin', '-u', patchBranch);
  }

  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  const headSha = data.head.sha;
  if (!headSha) {
    throw new Error('head sha not available');
  }
  const baseSha = data.base.sha;
  if (!baseSha) {
    throw new Error('base sha not available');
  }
  const mergeBaseSha = await run('git', 'merge-base', headSha, baseSha);

  // Create new branch, apply changes from all commits on PR branch, commit, push
  const branchName = `patch-release-pr-${prNumber}`;
  await run('git', 'checkout', '-b', branchName);

  const logLines = await run(
    'git',
    'log',
    `${mergeBaseSha}...${headSha}`,
    '--reverse',
    '--pretty=%H',
  );
  for (const logSha of logLines.split(/\r?\n/)) {
    await run('git', 'cherry-pick', '-n', logSha);
  }
  await run(
    'git',
    'commit',
    '--signoff',
    '--no-verify',
    '-m',
    `Patch from PR #${prNumber}`,
  );

  console.log('Running "yarn release" ...');
  await run('yarn', 'release');

  await run('git', 'add', '.');
  await run(
    'git',
    'commit',
    '--signoff',
    '--no-verify',
    '-m',
    'Generate Release',
  );

  await run('git', 'push', 'origin', '-u', branchName);

  console.log(
    `https://github.com/backstage/backstage/compare/${patchBranch}...${branchName}?expand=1&body=This%20release%20fixes%20an%20issue%20where&title=Patch%20release%20of%20%23${prNumber}`,
  );
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
