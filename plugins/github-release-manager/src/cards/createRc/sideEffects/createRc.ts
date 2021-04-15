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

import { getRcGitHubInfo } from '../getRcGitHubInfo';
import {
  ComponentConfigCreateRc,
  GhGetRepositoryResponse,
  ResponseStep,
} from '../../../types/types';
import {
  ApiMethodRetval,
  IPluginApiClient,
} from '../../../api/PluginApiClient';
import { GitHubReleaseManagerError } from '../../../errors/GitHubReleaseManagerError';
import { Project } from '../../../contexts/ProjectContext';

interface CreateRC {
  defaultBranch: GhGetRepositoryResponse['default_branch'];
  latestRelease: ApiMethodRetval<
    IPluginApiClient['getLatestRelease']
  >['latestRelease'];
  nextGitHubInfo: ReturnType<typeof getRcGitHubInfo>;
  pluginApiClient: IPluginApiClient;
  project: Project;
  successCb?: ComponentConfigCreateRc['successCb'];
}

export async function createRc({
  defaultBranch,
  latestRelease,
  nextGitHubInfo,
  pluginApiClient,
  project,
  successCb,
}: CreateRC) {
  const responseSteps: ResponseStep[] = [];

  /**
   * 1. Get the default branch's most recent commit
   */
  const latestCommit = await pluginApiClient.getLatestCommit({
    ...project,
    defaultBranch,
  });
  responseSteps.push({
    message: `Fetched latest commit from "${defaultBranch}"`,
    secondaryMessage: `with message "${latestCommit.commit.message}"`,
    link: latestCommit.htmlUrl,
  });

  /**
   * 2. Create a new ref based on the default branch's most recent sha
   */
  const mostRecentSha = latestCommit.sha;
  const createdRef = await pluginApiClient.createRc
    .createRef({
      ...project,
      mostRecentSha,
      targetBranch: nextGitHubInfo.rcBranch,
    })
    .catch(error => {
      if (error?.body?.message === 'Reference already exists') {
        throw new GitHubReleaseManagerError(
          `Branch "${nextGitHubInfo.rcBranch}" already exists: .../tree/${nextGitHubInfo.rcBranch}`,
        );
      }
      throw error;
    });
  responseSteps.push({
    message: 'Cut Release Branch',
    secondaryMessage: `with ref "${createdRef.ref}"`,
  });

  /**
   * 3. Compose a body for the release
   */
  const previousReleaseBranch = latestRelease
    ? latestRelease.targetCommitish
    : defaultBranch;
  const nextReleaseBranch = nextGitHubInfo.rcBranch;
  const comparison = await pluginApiClient.createRc.getComparison({
    ...project,
    previousReleaseBranch,
    nextReleaseBranch,
  });
  const releaseBody = `**Compare** ${comparison.htmlUrl}

**Ahead by** ${comparison.aheadBy} commits

**Release branch** ${createdRef.ref}

---

`;
  responseSteps.push({
    message: 'Fetched commit comparison',
    secondaryMessage: `${previousReleaseBranch}...${nextReleaseBranch}`,
    link: comparison.htmlUrl,
  });

  /**
   * 4. Creates the release itself in GitHub
   */
  const {
    createReleaseResponse,
  } = await pluginApiClient.createRc.createRelease({
    ...project,
    nextGitHubInfo: nextGitHubInfo,
    releaseBody,
  });
  responseSteps.push({
    message: `Created Release Candidate "${createReleaseResponse.name}"`,
    secondaryMessage: `with tag "${nextGitHubInfo.rcReleaseTag}"`,
    link: createReleaseResponse.htmlUrl,
  });

  await successCb?.({
    gitHubReleaseUrl: createReleaseResponse.htmlUrl,
    gitHubReleaseName: createReleaseResponse.name,
    comparisonUrl: comparison.htmlUrl,
    previousTag: latestRelease?.tagName,
    createdTag: createReleaseResponse.tagName,
  });

  return responseSteps;
}
