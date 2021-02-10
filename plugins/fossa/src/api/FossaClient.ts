/*
 * Copyright 2020 Spotify AB
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

import { DiscoveryApi, IdentityApi } from '@backstage/core';
import fetch from 'cross-fetch';
import { FindingSummary, FossaApi } from './FossaApi';

export class FossaClient implements FossaApi {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
  organizationId?: string;

  constructor({
    discoveryApi,
    identityApi,
    organizationId,
  }: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    organizationId?: string;
  }) {
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
    this.organizationId = organizationId;
  }

  private async callApi(path: string): Promise<any> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/fossa`;
    const idToken = await this.identityApi.getIdToken();
    const response = await fetch(`${apiUrl}/${path}`, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });
    if (response.status === 200) {
      return await response.json();
    }
    return undefined;
  }

  async getFindingSummary(
    projectTitle: string,
  ): Promise<FindingSummary | undefined> {
    const project = await this.callApi(
      `projects?count=1&sort=title+&title=${projectTitle}${
        this.organizationId ? `&organizationId=${this.organizationId}` : ''
      }`,
    );

    if (!project || project.length === 0 || project[0].title !== projectTitle) {
      return undefined;
    }

    const revision = project[0].revisions[0];
    return {
      timestamp: revision.updatedAt,
      issueCount:
        revision.unresolved_licensing_issue_count ||
        revision.unresolved_issue_count,
      dependencyCount: revision.dependency_count,
      projectDefaultBranch: project[0].default_branch,
      projectUrl: `https://app.fossa.com/projects/${encodeURIComponent(
        project[0].locator,
      )}`,
    };
  }
}
