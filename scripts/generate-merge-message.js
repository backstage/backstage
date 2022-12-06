#!/usr/bin/env node
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

const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');
const { resolve: resolvePath } = require('path');

const execFile = promisify(execFileCb);

async function hasNewChangesets(baseRef, headRef) {
  if (!baseRef) {
    throw new Error('baseRef is required');
  }
  if (!headRef) {
    throw new Error('headRef is required');
  }

  const { stdout } = await execFile('git', [
    'diff',
    '--compact-summary',
    baseRef,
    headRef,
    '--',
    '.changeset/*.md',
    ':(exclude).changeset/create-app-*.md',
  ]);
  return stdout.includes('(new)');
}

function getReleaseOfMonth(year, month) {
  const base = new Date(Date.UTC(year, month));
  const wednesdayOffset =
    base.getUTCDay() > 3 ? 10 - base.getUTCDay() : 3 - base.getUTCDay();
  const thirdWednesdayOffset = wednesdayOffset + 7 * 2;
  const releaseOffset = thirdWednesdayOffset - 1;
  const releaseDay = new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), releaseOffset + 1),
  );
  return releaseDay;
}

function getReleaseSchedule() {
  const firstReleaseYear = 2022;
  const firstReleaseMonth = 2;

  return Array(100)
    .fill(0)
    .map((_, i) => {
      const date = getReleaseOfMonth(firstReleaseYear, firstReleaseMonth + i);
      return { version: `1.${i}.0`, date };
    });
}

function getCurrentRelease() {
  const { version: releaseVersion } = require(resolvePath('package.json'));

  const match = releaseVersion.match(/^(\d+\.\d+\.\d+)/);
  if (!match) {
    throw new Error(`Failed to parse release version, '${releaseVersion}'`);
  }
  const [versionStr] = match;
  if (versionStr === releaseVersion) {
    return releaseVersion;
  }
  const [major, minor] = versionStr.split('.').map(Number);
  return `${major}.${minor - 1}.0`;
}

function findNextRelease(currentRelease, releaseSchedule) {
  const currentIndex = releaseSchedule.findIndex(
    r => r.version === currentRelease,
  );
  if (currentIndex === -1) {
    throw new Error(
      `Failed to find current release '${currentRelease}' in release schedule`,
    );
  }

  return releaseSchedule[currentIndex + 1];
}

async function main() {
  const [diffBaseRefRef = 'origin/master', diffHeadRef = 'HEAD'] =
    process.argv.slice(2);
  const needsMessage = await hasNewChangesets(diffBaseRefRef, diffHeadRef);
  if (!needsMessage) {
    return;
  }

  const currentRelease = getCurrentRelease();
  const releaseSchedule = getReleaseSchedule();
  const nextRelease = findNextRelease(currentRelease, releaseSchedule);

  const scheduledDate = nextRelease.date
    .toUTCString()
    .replace(/\s*\d+:\d+:\d+.*/, '');
  process.stdout.write(
    [
      'Thank you for contributing to Backstage! The changes in this pull request will be part',
      `of the \`${nextRelease.version}\` release, scheduled for ${scheduledDate}.`,
    ].join(' '),
  );
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
