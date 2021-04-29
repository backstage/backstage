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
import { GetLatestReleaseResult } from '../../../api/PluginApiClient';
import { githubReleaseManagerApiRef } from '../../../api/serviceApiRef';
import { useProjectContext } from '../../../contexts/ProjectContext';
import { useResponseSteps } from '../../../hooks/useResponseSteps';

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
  const pluginApiClient = useApi(githubReleaseManagerApiRef);
  const { project } = useProjectContext();
  const {
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
  } = useResponseSteps();

  /**
   * (1) Promote Release Candidate to Release Version
   */
  const [promotedReleaseRes, run] = useAsyncFn(async () => {
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
  });

  /**
   * (2) Run successCb if defined
   */
  useAsync(async () => {
    if (successCb && !!promotedReleaseRes.value) {
      abortIfError(promotedReleaseRes.error);

      try {
        await successCb?.({
          gitHubReleaseUrl: promotedReleaseRes.value.htmlUrl,
          gitHubReleaseName: promotedReleaseRes.value.name,
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

  const TOTAL_STEPS = 1 + (!!successCb ? 1 : 0);
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
