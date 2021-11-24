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

import {
  PullRequest,
  PullRequestOptions,
  RepoBuild,
  RepoBuildOptions,
} from '@backstage/plugin-azure-devops-common';

import { createApiRef } from '@backstage/core-plugin-api';

export const azureDevOpsApiRef = createApiRef<AzureDevOpsApi>({
  id: 'plugin.azure-devops.service',
  description:
    'Used by the Azure DevOps plugin to make requests to accompanying backend',
});

export interface AzureDevOpsApi {
  getRepoBuilds(
    projectName: string,
    repoName: string,
    options?: RepoBuildOptions,
  ): Promise<{ items: RepoBuild[] }>;

  getPullRequests(
    projectName: string,
    repoName: string,
    options?: PullRequestOptions,
  ): Promise<{ items: PullRequest[] }>;
}
