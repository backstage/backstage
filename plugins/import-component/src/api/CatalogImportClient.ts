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
/*
 * Copyright 2020 Roadie AB
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

import { Octokit } from '@octokit/rest';
import { Entity } from '@backstage/catalog-model';
import { DiscoveryApi } from '@backstage/core';
import { CatalogImportApi } from './CatalogImportApi';
import { AnalyzeLocationResponse } from '@backstage/plugin-catalog-backend';
import { RecursivePartial } from '../util/types';

export const API_BASE_URL = '/api/catalog/locations';

export class CatalogImportClient implements CatalogImportApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  async generateEntityDefinitions({
    repo,
  }: {
    repo: string;
  }): Promise<RecursivePartial<Entity>[]> {
    const response = await fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/analyze-location`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          location: { type: 'github', target: repo },
        }),
      },
    );
    const payload = (await response.json()) as AnalyzeLocationResponse;
    return payload.generateEntities.map(x => x.entity);
  }

  async createRepositoryLocation({
    owner,
    repo,
  }: {
    token: string;
    owner: string;
    repo: string;
  }): Promise<{ errorMessage: string | null }> {
    await fetch(`${await this.discoveryApi.getBaseUrl('catalog')}/locations`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        type: 'github',
        target: `https://github.com/${owner}/${repo}/blob/master/catalog-info.yaml`,
        presence: 'optional',
      }),
    });
    return { errorMessage: null };
  }

  async submitPRToRepo({
    token,
    owner,
    repo,
    fileContent,
  }: {
    token: string;
    owner: string;
    repo: string;
    fileContent: string;
  }): Promise<{ errorMessage: string | null; link: string }> {
    const octo = new Octokit({
      auth: token,
    });

    const parentRef = await octo.git.getRef({
      owner,
      repo,
      ref: 'heads/master',
    });
    await octo.git.createRef({
      owner,
      repo,
      ref: 'refs/heads/backstage-integration',
      sha: parentRef.data.object.sha,
    });
    await octo.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'backstage.yaml',
      message: 'Add backstage.yaml config file',
      content: btoa(fileContent),
      branch: 'backstage-integration',
    });
    const pullRequestRespone = await octo.pulls.create({
      owner,
      repo,
      title: 'Add backstage.yaml config file',
      head: 'backstage-integration',
      base: 'master',
    });

    return { errorMessage: null, link: pullRequestRespone.data.html_url };
  }
}
