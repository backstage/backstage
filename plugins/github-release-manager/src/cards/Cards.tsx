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

import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { ErrorBoundary } from '@backstage/core';
import { Alert } from '@material-ui/lab';

import { CenteredCircularProgress } from '../components/CenteredCircularProgress';
import { CreateRc } from './createRc/CreateRc';
import { getGitHubBatchInfo } from '../sideEffects/getGitHubBatchInfo';
import { GitHubReleaseManagerProps } from '../GitHubReleaseManager';
import { Info } from './info/Info';
import { Patch } from './patchRc/Patch';
import { PromoteRc } from './promoteRc/PromoteRc';
import { RefetchContext } from '../contexts/RefetchContext';
import { usePluginApiClientContext } from '../contexts/PluginApiClientContext';
import { useProjectContext } from '../contexts/ProjectContext';
import { useVersioningStrategyMatchesRepoTags } from '../hooks/useVersioningStrategyMatchesRepoTags';

export function Cards({
  components,
}: {
  components: GitHubReleaseManagerProps['components'];
}) {
  const pluginApiClient = usePluginApiClientContext();
  const project = useProjectContext();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const gitHubBatchInfo = useAsync(
    getGitHubBatchInfo({ project, pluginApiClient }),
    [project, refetchTrigger],
  );

  const { versioningStrategyMatches } = useVersioningStrategyMatchesRepoTags({
    latestReleaseTagName: gitHubBatchInfo.value?.latestRelease?.tagName,
    project,
    repositoryName: gitHubBatchInfo.value?.repository.name,
  });

  if (gitHubBatchInfo.error) {
    return (
      <Alert severity="error">
        Error occured while fetching information for "{project.owner}/
        {project.repo}" ({gitHubBatchInfo.error.message})
      </Alert>
    );
  }

  if (gitHubBatchInfo.loading) {
    return <CenteredCircularProgress />;
  }

  if (gitHubBatchInfo.value === undefined) {
    return (
      <Alert severity="error">Failed to fetch latest GitHub release</Alert>
    );
  }

  if (!gitHubBatchInfo.value.repository.pushPermissions) {
    return (
      <Alert severity="error">
        You lack push permissions for repository "{project.owner}/{project.repo}
        "
      </Alert>
    );
  }

  return (
    <RefetchContext.Provider value={{ refetchTrigger, setRefetchTrigger }}>
      <ErrorBoundary>
        {gitHubBatchInfo.value.latestRelease && !versioningStrategyMatches && (
          <Alert severity="warning" style={{ marginBottom: 20 }}>
            Versioning mismatch, expected {project.versioningStrategy} version,
            got "{gitHubBatchInfo.value.latestRelease.tagName}"
          </Alert>
        )}

        {!gitHubBatchInfo.value.latestRelease && (
          <Alert severity="info" style={{ marginBottom: 20 }}>
            This repository has not releases yet
          </Alert>
        )}

        <Info
          latestRelease={gitHubBatchInfo.value.latestRelease}
          releaseBranch={gitHubBatchInfo.value.releaseBranch}
        />

        {components?.default?.createRc?.omit !== true && (
          <CreateRc
            latestRelease={gitHubBatchInfo.value.latestRelease}
            releaseBranch={gitHubBatchInfo.value.releaseBranch}
            defaultBranch={gitHubBatchInfo.value.repository.defaultBranch}
            successCb={components?.default?.createRc?.successCb}
          />
        )}

        {components?.default?.promoteRc?.omit !== true && (
          <PromoteRc
            latestRelease={gitHubBatchInfo.value.latestRelease}
            successCb={components?.default?.promoteRc?.successCb}
          />
        )}

        {components?.default?.patch?.omit !== true && (
          <Patch
            latestRelease={gitHubBatchInfo.value.latestRelease}
            releaseBranch={gitHubBatchInfo.value.releaseBranch}
            successCb={components?.default?.patch?.successCb}
          />
        )}
      </ErrorBoundary>
    </RefetchContext.Provider>
  );
}
