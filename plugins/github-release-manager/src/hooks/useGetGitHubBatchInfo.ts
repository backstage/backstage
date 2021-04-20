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

import { useAsync } from 'react-use';

import { IPluginApiClient } from '../api/PluginApiClient';
import { Project } from '../contexts/ProjectContext';

interface GetGitHubBatchInfo {
  project: Project;
  pluginApiClient: IPluginApiClient;
  refetchTrigger: number;
}

export const useGetGitHubBatchInfo = ({
  project,
  pluginApiClient,
  refetchTrigger,
}: GetGitHubBatchInfo) => {
  const gitHubBatchInfo = useAsync(async () => {
    const [repository, latestRelease] = await Promise.all([
      pluginApiClient.getRepository({ ...project }),
      pluginApiClient.getLatestRelease({ ...project }),
    ]);

    if (!latestRelease) {
      return {
        latestRelease,
        releaseBranch: null,
        repository,
      };
    }

    const releaseBranch = await pluginApiClient.getBranch({
      ...project,
      branchName: latestRelease.targetCommitish,
    });

    return {
      latestRelease,
      releaseBranch,
      repository,
    };
  }, [project, refetchTrigger]);

  return {
    gitHubBatchInfo,
  };
};
