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

import { useState, useEffect } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { useApi } from '@backstage/core';

import { CardHook, ComponentConfigPromoteRc } from '../../../types/types';
import { GetLatestReleaseResult } from '../../../api/GitReleaseApiClient';
import { gitReleaseManagerApiRef } from '../../../api/serviceApiRef';
import { useProjectContext } from '../../../contexts/ProjectContext';
import { useResponseSteps } from '../../../hooks/useResponseSteps';
import { useUserContext } from '../../../contexts/UserContext';
import { TAG_OBJECT_MESSAGE } from '../../../constants/constants';
import { GitReleaseManagerError } from '../../../errors/GitReleaseManagerError';

interface PromoteRc {
  rcRelease: NonNullable<GetLatestReleaseResult>;
  releaseVersion: string;
  successCb?: ComponentConfigPromoteRc['successCb'];
}

export function usePromoteRc({
  rcRelease,
  releaseVersion,
  successCb,
}: PromoteRc): CardHook<void> {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { user } = useUserContext();
  const { project } = useProjectContext();
  const {
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
  } = useResponseSteps();

  /**
   * (1) Fetch most recent release branch commit
   */
  const [latestReleaseBranchCommitSha, run] = useAsyncFn(async () => {
    const latestCommit = await pluginApiClient
      .getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: rcRelease.targetCommitish,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Fetched most recent commit from release branch',
      secondaryMessage: `with sha "${latestCommit.sha}"`,
    });

    return {
      ...latestCommit,
    };
  });

  /**
   * (2) Create tag object for our soon-to-be-created annotated tag
   */
  const tagObjectRes = useAsync(async () => {
    abortIfError(latestReleaseBranchCommitSha.error);
    if (!latestReleaseBranchCommitSha.value) return undefined;

    const createdTagObject = await pluginApiClient
      .createTagObject({
        owner: project.owner,
        repo: project.repo,
        tag: releaseVersion,
        objectSha: latestReleaseBranchCommitSha.value.sha,
        taggerName: user.username,
        taggerEmail: user.email,
        message: TAG_OBJECT_MESSAGE,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Created Tag Object',
      secondaryMessage: `with sha "${createdTagObject.tagSha}"`,
    });

    return {
      ...createdTagObject,
    };
  }, [latestReleaseBranchCommitSha.value, latestReleaseBranchCommitSha.error]);

  /**
   * (3) Create reference for tag object
   */
  const createRcRes = useAsync(async () => {
    abortIfError(tagObjectRes.error);
    if (!tagObjectRes.value) return undefined;

    const createdRef = await pluginApiClient
      .createRef({
        owner: project.owner,
        repo: project.repo,
        ref: `refs/tags/${releaseVersion}`,
        sha: tagObjectRes.value.tagSha,
      })
      .catch(error => {
        if (error?.body?.message === 'Reference already exists') {
          throw new GitReleaseManagerError(
            `Tag reference "${releaseVersion}" already exists`,
          );
        }
        throw error;
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Create Tag Reference',
      secondaryMessage: `with ref "${createdRef.ref}"`,
    });

    return {
      ...createdRef,
    };
  }, [tagObjectRes.value, tagObjectRes.error]);

  /**
   * (4) Promote Release Candidate to Release Version
   */
  const promotedReleaseRes = useAsync(async () => {
    abortIfError(createRcRes.error);
    if (!createRcRes.value) return undefined;

    const promotedRelease = await pluginApiClient.promoteRc
      .promoteRelease({
        owner: project.owner,
        repo: project.repo,
        releaseId: rcRelease.id,
        releaseVersion,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Promoted "${promotedRelease.name}"`,
      secondaryMessage: `from "${rcRelease.tagName}" to "${promotedRelease.tagName}"`,
      link: promotedRelease.htmlUrl,
    });

    return {
      ...promotedRelease,
    };
  }, [createRcRes.value, createRcRes.error]);

  /**
   * (5) Run successCb if defined
   */
  useAsync(async () => {
    if (successCb && !!promotedReleaseRes.value) {
      abortIfError(promotedReleaseRes.error);

      try {
        await successCb?.({
          gitReleaseUrl: promotedReleaseRes.value.htmlUrl,
          gitReleaseName: promotedReleaseRes.value.name,
          previousTagUrl: rcRelease.htmlUrl,
          previousTag: rcRelease.tagName,
          updatedTagUrl: promotedReleaseRes.value.htmlUrl,
          updatedTag: promotedReleaseRes.value.tagName,
        });
      } catch (error) {
        asyncCatcher(error);
      }

      addStepToResponseSteps({
        message: 'Success callback successfully called 🚀',
        icon: 'success',
      });
    }
  }, [promotedReleaseRes.value]);

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
      promotedReleaseRes.loading ||
        promotedReleaseRes.value ||
        promotedReleaseRes.error,
    ),
  };
}
