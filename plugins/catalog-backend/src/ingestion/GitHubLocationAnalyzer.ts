/*
 * Copyright 2022 The Backstage Authors
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

import { CatalogClient } from '@backstage/catalog-client';
import { GitHubIntegration } from '@backstage/integration';
import { DiscoveryApi } from '@backstage/plugin-permission-common';
import { Octokit } from '@octokit/rest';
import { trimEnd } from 'lodash';
import { AnalyzeLocationExistingEntity, ScmLocationAnalyzer } from './types';

export type GitHubLocationAnalyzerOptions = {
  integration: GitHubIntegration;
  catalogFilename?: string;
  discovery: DiscoveryApi;
};
export class GitHubLocationAnalyzer implements ScmLocationAnalyzer {
  private readonly integration: GitHubIntegration;
  private readonly catalogFilename: string;
  private readonly discovery: DiscoveryApi;

  constructor(options: GitHubLocationAnalyzerOptions) {
    this.integration = options.integration;
    this.catalogFilename = options.catalogFilename || 'catalog-info.yaml';
    this.discovery = options.discovery;
  }

  async analyze(
    owner: string,
    repo: string,
    url: string,
  ): Promise<AnalyzeLocationExistingEntity[]> {
    const octo = new Octokit({
      auth: this.integration.config.token,
      baseUrl: this.integration.config.apiBaseUrl,
    });
    const query = `filename:${this.catalogFilename} repo:${owner}/${repo} `;

    const catalogClient = new CatalogClient({ discoveryApi: this.discovery });

    const searchResult = await octo.search.code({ q: query }).catch(e => {
      throw new Error(`Couldn't search repository for metadata file, ${e}`);
    });

    const exists = searchResult.data.total_count > 0;
    if (exists) {
      const repoInformation = await octo.repos.get({ owner, repo }).catch(e => {
        throw new Error(`Couldn't fetch repo data, ${e}`);
      });
      const defaultBranch = repoInformation.data.default_branch;

      const result = await Promise.all(
        searchResult.data.items
          .map(i => `${trimEnd(url, '/')}/blob/${defaultBranch}/${i.path}`)
          .map(async target => {
            const addLocationResult = await catalogClient.addLocation({
              type: 'url',
              target,
              dryRun: true,
            });
            return addLocationResult.entities.map(e => ({
              location: { type: 'url', target },
              isRegistered: !!addLocationResult.exists,
              entity: e,
            }));
          }),
      );

      return result.flat();
    }
    return [];
  }
}
