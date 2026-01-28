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
const path = require('node:path');
const semver = require('semver');
const { Octokit } = require('@octokit/rest');
const { execFile: execFileCb } = require('node:child_process');
const { promisify, parseArgs } = require('node:util');

const execFile = promisify(execFileCb);

const owner = 'backstage';
const repo = 'backstage';
const rootDir = path.resolve(__dirname, '..');
const PATCH_FILE_PATTERN = /^pr-(\d+)\.txt$/;

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

/**
 * Parses command-line arguments and determines which patches to use.
 * Returns an object with prNumbers and descriptions, or null if should exit early.
 */
async function parsePatchArguments(args) {
  const { values, positionals } = parseArgs({
    args,
    options: {
      'from-dir': {
        type: 'boolean',
        short: 'd',
      },
    },
    allowPositionals: true,
  });

  const useDirectory = values['from-dir'] === true;

  let prNumbers;
  let descriptions;

  if (useDirectory) {
    // Read patches from directory
    const patchesFromDir = await readPatchesFromDirectory();

    if (patchesFromDir) {
      // Use patches from directory
      prNumbers = patchesFromDir.map(p => p.prNumber);
      descriptions = patchesFromDir.map(p => p.description);
      console.log(`Reading patches from .patches/ directory`);
      console.log(`PR number(s): ${prNumbers.join(', ')}`);
      return { prNumbers, descriptions };
    }
    // No patches found in directory - exit early
    return null;
  } else if (positionals.length > 0) {
    // Use command-line arguments
    prNumbers = positionals.map(s => {
      const num = parseInt(s, 10);
      if (!Number.isInteger(num)) {
        throw new Error(`Must provide valid PR number arguments, got ${s}`);
      }
      return num;
    });
    console.log(`Using command-line arguments`);
    console.log(`PR number(s): ${prNumbers.join(', ')}`);
    return { prNumbers, descriptions: undefined };
  }
  // No patches found and no command-line args - exit early
  return null;
}

/**
 * Reads patch files from .patches/ directory and returns PR numbers with descriptions.
 * Returns null if directory doesn't exist or contains no matching files.
 */
async function readPatchesFromDirectory() {
  const patchesDir = path.resolve(rootDir, '.patches');

  try {
    const exists = await fs.pathExists(patchesDir);
    if (!exists) {
      return null;
    }

    const files = await fs.readdir(patchesDir);
    const patchFiles = files.filter(file => PATCH_FILE_PATTERN.test(file));

    if (patchFiles.length === 0) {
      return null;
    }

    const patches = [];
    for (const file of patchFiles) {
      const match = file.match(PATCH_FILE_PATTERN);
      const prNumber = parseInt(match[1], 10);
      const filePath = path.resolve(patchesDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const description = content.trim() || '<empty>';
      patches.push({ prNumber, description });
    }

    // Sort by PR number for consistent ordering
    patches.sort((a, b) => a.prNumber - b.prNumber);

    return patches;
  } catch {
    // If there's an error reading the directory, return null to fall back to CLI args
    return null;
  }
}

async function ensureCommitExists(sha) {
  try {
    await run('git', 'cat-file', '-e', sha);
  } catch {
    console.log(`Commit ${sha} not found locally, fetching...`);

    try {
      await run('git', 'fetch', 'origin', sha);
    } catch (error) {
      throw new Error(`Failed to fetch commit ${sha}: ${error}`);
    }
  }
}

async function main(args) {
  const patchInfo = await parsePatchArguments(args);
  if (!patchInfo) {
    // No patches found and no command-line args - exit early
    return;
  }

  const { prNumbers, descriptions } = patchInfo;

  if (await run('git', 'status', '--porcelain')) {
    throw new Error('Cannot run with a dirty working tree');
  }

  const release = await findCurrentReleaseVersion();
  console.log(`Patching release ${release}`);

  await run('git', 'fetch');

  const patchBranch = `patch/v${release}`;

  // Output patch branch for CI workflows to capture
  if (process.env.PATCH_RELEASE_BRANCH && process.env.GITHUB_OUTPUT) {
    // Use native fs for appendFileSync (fs-extra doesn't have sync version)
    const nativeFs = require('node:fs');
    nativeFs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `patch_branch=${patchBranch}\n`,
    );
  }
  try {
    await run('git', 'checkout', `origin/${patchBranch}`);
  } catch {
    await run('git', 'checkout', '-b', patchBranch, `v${release}`);
    await run('git', 'push', 'origin', '-u', patchBranch);
  }

  // Create new branch, apply changes from all commits on PR branch, commit, push
  // Allow fixed branch name via environment variable for CI workflows
  const branchName =
    process.env.PATCH_RELEASE_BRANCH ||
    `patch-release-pr-${prNumbers.join('-')}`;

  // Check if branch already exists (for CI workflows using fixed branch name)
  try {
    await run(
      'git',
      'show-ref',
      '--verify',
      '--quiet',
      `refs/heads/${branchName}`,
    );
    await run('git', 'checkout', branchName);
  } catch {
    await run('git', 'checkout', '-b', branchName);
  }

  const appliedPrNumbers = [];

  for (const prNumber of prNumbers) {
    console.log(`Processing PR #${prNumber}...`);

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

    await ensureCommitExists(headSha);

    const mergeBaseSha = await run('git', 'merge-base', headSha, baseSha);

    const logLines = await run(
      'git',
      'log',
      `${mergeBaseSha}...${headSha}`,
      '--reverse',
      '--pretty=%H',
    );

    const commitMessage = `Patch from PR #${prNumber}`;

    // Check if this patch has already been applied by looking for the commit message
    try {
      const existingCommit = await run(
        'git',
        'log',
        '--grep',
        commitMessage,
        '--format=%H',
        '-1',
      );

      if (existingCommit) {
        console.log(
          `Patch from PR #${prNumber} has already been applied, skipping...`,
        );
        continue;
      }
    } catch {
      // No existing commit found, proceed with cherry-pick
    }

    let hasChanges = false;
    for (const logSha of logLines.split(/\r?\n/)) {
      try {
        await run('git', 'cherry-pick', '-n', logSha);
        hasChanges = true;
      } catch (error) {
        // Check if the cherry-pick failed because changes are already applied
        const status = await run('git', 'status', '--porcelain');
        if (!status) {
          console.log(
            `Commit ${logSha} appears to be already applied, skipping...`,
          );
          continue;
        }
        throw error;
      }
    }

    if (!hasChanges) {
      console.log(
        `All commits from PR #${prNumber} are already applied, skipping...`,
      );
      continue;
    }

    await run('git', 'commit', '--signoff', '--no-verify', '-m', commitMessage);

    appliedPrNumbers.push(prNumber);
  }

  if (appliedPrNumbers.length === 0) {
    console.log('All patches have already been applied, nothing to do.');
    return;
  }

  console.log(
    `Applied ${appliedPrNumbers.length} patch(es): ${appliedPrNumbers.join(
      ', ',
    )}`,
  );

  console.log('Running "yarn install" ...');
  await run('yarn', 'install');

  console.log('Running "yarn release" ...');
  await run('yarn', 'release');

  // Note: Patch files are not deleted here because this script runs in the patch
  // release branch, not master. The cleanup_patch-files.yml workflow handles
  // deletion from master after the patch release PR is merged.

  await run('git', 'add', '.');
  await run(
    'git',
    'commit',
    '--signoff',
    '--no-verify',
    '-m',
    'Generate Release',
  );

  // Use force push if using a specific branch name (for CI workflows)
  if (process.env.PATCH_RELEASE_BRANCH) {
    await run('git', 'push', 'origin', '-u', '--force-with-lease', branchName);
  } else {
    await run('git', 'push', 'origin', '-u', branchName);
  }

  // Generate PR body using only applied patches
  let body;
  if (descriptions) {
    // Filter descriptions to only include applied patches
    const appliedDescriptions = descriptions.filter((_, index) =>
      appliedPrNumbers.includes(prNumbers[index]),
    );

    const descriptionList = appliedDescriptions
      .map((desc, index) => {
        const prNumber = appliedPrNumbers[index];
        const prLink = `https://github.com/${owner}/${repo}/pull/${prNumber}`;
        return `- ${desc} ([#${prNumber}](${prLink}))`;
      })
      .join('\n');
    body = `This patch release includes the following fixes:\n\n${descriptionList}`;
  } else {
    body = 'This release fixes an issue where';
  }

  const params = new URLSearchParams({
    expand: 1,
    body: body,
    title: `Patch release of ${appliedPrNumbers
      .map(nr => `#${nr}`)
      .join(', ')}`,
  });

  const url = `https://github.com/backstage/backstage/compare/${patchBranch}...${branchName}?${params}`;
  console.log(`PR URL: ${url}`);

  // Only open URL if not in CI (no PATCH_RELEASE_BRANCH env var means manual run)
  if (!process.env.PATCH_RELEASE_BRANCH) {
    await run('open', url);
  }
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
