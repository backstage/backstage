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

import { useEffect, useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';

import {
  GetLatestReleaseResult,
  GetRepositoryResult,
  IPluginApiClient,
} from '../../../api/PluginApiClient';
import { CardHook, ComponentConfigCreateRc } from '../../../types/types';
import { getRcGitHubInfo } from '../helpers/getRcGitHubInfo';
import { GitHubReleaseManagerError } from '../../../errors/GitHubReleaseManagerError';
import { Project } from '../../../contexts/ProjectContext';
import { useResponseSteps } from '../../../hooks/useResponseSteps';

interface CreateRC {
  defaultBranch: GetRepositoryResult['defaultBranch'];
  latestRelease: GetLatestReleaseResult;
  nextGitHubInfo: ReturnType<typeof getRcGitHubInfo>;
  pluginApiClient: IPluginApiClient;
  project: Project;
  successCb?: ComponentConfigCreateRc['successCb'];
}

export function useCreateRc({
  defaultBranch,
  latestRelease,
  nextGitHubInfo,
  pluginApiClient,
  project,
  successCb,
}: CreateRC): CardHook<void> {
  const {
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
  } = useResponseSteps();

  /**
   * (1) Get the default branch's most recent commit
   */
  const [latestCommitRes, run] = useAsyncFn(async () => {
    const latestCommit = await pluginApiClient
      .getLatestCommit({
        owner: project.owner,
        repo: project.repo,
        defaultBranch,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Fetched latest commit from "${defaultBranch}"`,
      secondaryMessage: `with message "${latestCommit.commit.message}"`,
      link: latestCommit.htmlUrl,
    });

    return {
      latestCommit,
    };
  });

  /**
   * (2) Create a new ref based on the default branch's most recent sha
   */
  const createRcRes = useAsync(async () => {
    abortIfError(latestCommitRes.error);
    if (!latestCommitRes.value) return undefined;

    const createdRef = await pluginApiClient.createRc
      .createRef({
        owner: project.owner,
        repo: project.repo,
        mostRecentSha: latestCommitRes.value.latestCommit.sha,
        targetBranch: nextGitHubInfo.rcBranch,
      })
      .catch(error => {
        if (error?.body?.message === 'Reference already exists') {
          throw new GitHubReleaseManagerError(
            `Branch "${nextGitHubInfo.rcBranch}" already exists: .../tree/${nextGitHubInfo.rcBranch}`,
          );
        }
        throw error;
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Cut Release Branch',
      secondaryMessage: `with ref "${createdRef.ref}"`,
    });

    return {
      ...createdRef,
    };
  }, [latestCommitRes.value, latestCommitRes.error]);

  /**
   * (3) Compose a body for the release
   */
  const getComparisonRes = useAsync(async () => {
    abortIfError(createRcRes.error);
    if (!createRcRes.value) return undefined;

    const previousReleaseBranch = latestRelease
      ? latestRelease.targetCommitish
      : defaultBranch;
    const nextReleaseBranch = nextGitHubInfo.rcBranch;
    const comparison = await pluginApiClient.createRc
      .getComparison({
        owner: project.owner,
        repo: project.repo,
        previousReleaseBranch,
        nextReleaseBranch,
      })
      .catch(asyncCatcher);

    const releaseBody = `**Compare** ${comparison.htmlUrl}

**Ahead by** ${comparison.aheadBy} commits

**Release branch** ${createRcRes.value.ref}

---

`;

    addStepToResponseSteps({
      message: 'Fetched commit comparison',
      secondaryMessage: `${previousReleaseBranch}...${nextReleaseBranch}`,
      link: comparison.htmlUrl,
    });

    return {
      ...comparison,
      releaseBody,
    };
  }, [createRcRes.value, createRcRes.error]);

  /**
   * (4) Creates the release itself in GitHub
   */
  const createReleaseRes = useAsync(async () => {
    abortIfError(getComparisonRes.error);
    if (!getComparisonRes.value) return undefined;

    const createReleaseResult = await pluginApiClient.createRc
      .createRelease({
        owner: project.owner,
        repo: project.repo,
        nextGitHubInfo: nextGitHubInfo,
        releaseBody: getComparisonRes.value.releaseBody,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Created Release Candidate "${createReleaseResult.name}"`,
      secondaryMessage: `with tag "${nextGitHubInfo.rcReleaseTag}"`,
      link: createReleaseResult.htmlUrl,
    });

    return {
      ...createReleaseResult,
    };
  }, [getComparisonRes.value, getComparisonRes.error]);

  /**
   * (5) Run successCb if defined
   */
  useAsync(async () => {
    if (successCb && !!createReleaseRes.value && !!getComparisonRes.value) {
      abortIfError(createReleaseRes.error);

      try {
        await successCb({
          comparisonUrl: getComparisonRes.value.htmlUrl,
          createdTag: createReleaseRes.value.tagName,
          gitHubReleaseName: createReleaseRes.value.name,
          gitHubReleaseUrl: createReleaseRes.value.htmlUrl,
          previousTag: latestRelease?.tagName,
        });
      } catch (error) {
        asyncCatcher(error);
      }

      addStepToResponseSteps({
        message: 'Success callback successfully called 🚀',
        icon: 'success',
      });
    }
  }, [createReleaseRes.value]);

  const TOTAL_STEPS = 4 + (!!successCb ? 1 : 0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress((responseSteps.length / TOTAL_STEPS) * 100);
  }, [TOTAL_STEPS, responseSteps.length]);

  return {
    progress,
    responseSteps,
    run,
    runInvoked: Boolean(
      latestCommitRes.loading || latestCommitRes.value || latestCommitRes.error,
    ),
  };
}
