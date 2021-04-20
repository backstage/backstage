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

import { useAsync, useAsyncFn } from 'react-use';

import { getRcGitHubInfo } from '../getRcGitHubInfo';
import { ComponentConfigCreateRc, ResponseStep } from '../../../types/types';
import {
  GetLatestReleaseResult,
  GetRepositoryResult,
  IPluginApiClient,
} from '../../../api/PluginApiClient';
import { Project } from '../../../contexts/ProjectContext';
import { GitHubReleaseManagerError } from '../../../errors/GitHubReleaseManagerError';
import { useResponseSteps } from '../../../hooks/useResponseSteps';
import { useEffect, useState } from 'react';

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
}: CreateRC) {
  const {
    responseSteps,
    setResponseSteps,
    asyncCatcher,
    abortIfError: skipIfError,
  } = useResponseSteps();

  /**
   * (1) Get the default branch's most recent commit
   */
  const getLatestCommit = async () => {
    const latestCommit = await pluginApiClient.getLatestCommit({
      owner: project.owner,
      repo: project.repo,
      defaultBranch,
    });

    const responseStep: ResponseStep = {
      message: `Fetched latest commit from "${defaultBranch}"`,
      secondaryMessage: `with message "${latestCommit.commit.message}"`,
      link: latestCommit.htmlUrl,
    };
    setResponseSteps([...responseSteps, responseStep]);

    return { latestCommit };
  };

  const [latestCommitRes, run] = useAsyncFn(async () =>
    getLatestCommit().catch(asyncCatcher),
  );

  /**
   * (2) Create a new ref based on the default branch's most recent sha
   */
  const createRcFromDefaultBranch = async (latestCommitSha: string) => {
    const createdRef = await pluginApiClient.createRc
      .createRef({
        owner: project.owner,
        repo: project.repo,
        mostRecentSha: latestCommitSha,
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

    const responseStep: ResponseStep = {
      message: 'Cut Release Branch',
      secondaryMessage: `with ref "${createdRef.ref}"`,
    };
    setResponseSteps([...responseSteps, responseStep]);

    return { ...createdRef };
  };

  const createRcRes = useAsync(async () => {
    skipIfError(latestCommitRes.error);

    if (latestCommitRes.value) {
      return createRcFromDefaultBranch(
        latestCommitRes.value.latestCommit.sha,
      ).catch(asyncCatcher);
    }

    return undefined;
  }, [latestCommitRes.value, latestCommitRes.error]);

  /**
   * (3) Compose a body for the release
   */
  const getComparison = async (createdRefRef: string) => {
    const previousReleaseBranch = latestRelease
      ? latestRelease.targetCommitish
      : defaultBranch;
    const nextReleaseBranch = nextGitHubInfo.rcBranch;
    const comparison = await pluginApiClient.createRc.getComparison({
      owner: project.owner,
      repo: project.repo,
      previousReleaseBranch,
      nextReleaseBranch,
    });
    const releaseBody = `**Compare** ${comparison.htmlUrl}

**Ahead by** ${comparison.aheadBy} commits

**Release branch** ${createdRefRef}

---

`;

    const responseStep: ResponseStep = {
      message: 'Fetched commit comparison',
      secondaryMessage: `${previousReleaseBranch}...${nextReleaseBranch}`,
      link: comparison.htmlUrl,
    };
    setResponseSteps([...responseSteps, responseStep]);

    return { ...comparison, releaseBody };
  };

  const getComparisonRes = useAsync(async () => {
    skipIfError(createRcRes.error);

    if (createRcRes.value) {
      return getComparison(createRcRes.value.ref).catch(asyncCatcher);
    }

    return undefined;
  }, [createRcRes.value, createRcRes.error]);

  /**
   * (4) Creates the release itself in GitHub
   */
  const createRelease = async (releaseBody: string) => {
    const createReleaseResult = await pluginApiClient.createRc.createRelease({
      owner: project.owner,
      repo: project.repo,
      nextGitHubInfo: nextGitHubInfo,
      releaseBody,
    });

    const responseStep: ResponseStep = {
      message: `Created Release Candidate "${createReleaseResult.name}"`,
      secondaryMessage: `with tag "${nextGitHubInfo.rcReleaseTag}"`,
      link: createReleaseResult.htmlUrl,
    };
    setResponseSteps([...responseSteps, responseStep]);

    return { ...createReleaseResult };
  };

  const createReleaseRes = useAsync(async () => {
    skipIfError(getComparisonRes.error);

    if (getComparisonRes.value) {
      return createRelease(getComparisonRes.value.releaseBody).catch(
        asyncCatcher,
      );
    }

    return undefined;
  }, [getComparisonRes.value, getComparisonRes.error]);

  /**
   * (5) Run successCb if defined
   */
  useAsync(async () => {
    if (successCb && !!createReleaseRes.value && !!getComparisonRes.value) {
      skipIfError(createReleaseRes.error);

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

      const responseStep: ResponseStep = {
        message: 'Success callback successfully called 🚀',
        icon: 'success',
      };
      setResponseSteps([...responseSteps, responseStep]);
    }
  }, [createReleaseRes.value]);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress((responseSteps.length / (4 + (!!successCb ? 1 : 0))) * 100);
  }, [responseSteps.length, successCb]);

  return {
    run,
    responseSteps,
    progress,
  };
}
