/*
 * Copyright 2021 Spotify AB
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

import { DateTime } from 'luxon';

import { getBumpedSemverTagParts } from './getBumpedTag';
import { GetLatestReleaseResult } from '../api/PluginApiClient';
import { getSemverTagParts } from './tagParts/getSemverTagParts';
import { Project } from '../contexts/ProjectContext';
import { SEMVER_PARTS } from '../constants/constants';

export const getReleaseCandidateGitInfo = ({
  project,
  latestRelease,
  semverBumpLevel,
  injectedDate = DateTime.now().toFormat('yyyy.MM.dd'),
}: {
  project: Project;
  latestRelease: GetLatestReleaseResult;
  semverBumpLevel: keyof typeof SEMVER_PARTS;
  injectedDate?: string;
}) => {
  if (project.versioningStrategy === 'calver') {
    return {
      rcBranch: `rc/${injectedDate}`,
      rcReleaseTag: `rc-${injectedDate}_0`,
      releaseName: `Version ${injectedDate}`,
    };
  }

  if (!latestRelease) {
    return {
      rcBranch: 'rc/0.0.1',
      rcReleaseTag: 'rc-0.0.1',
      releaseName: 'Version 0.0.1',
    };
  }

  const semverTagParts = getSemverTagParts(latestRelease.tagName);
  if (semverTagParts.error !== undefined) {
    return {
      error: semverTagParts.error,
    };
  }

  const { bumpedTagParts } = getBumpedSemverTagParts(
    semverTagParts.tagParts,
    semverBumpLevel,
  );

  const bumpedTag = `${bumpedTagParts.major}.${bumpedTagParts.minor}.${bumpedTagParts.patch}`;

  return {
    rcBranch: `rc/${bumpedTag}`,
    rcReleaseTag: `rc-${bumpedTag}`,
    releaseName: `Version ${bumpedTag}`,
  };
};
