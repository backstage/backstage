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

import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import { ScmIntegrations } from '@backstage/integration';
import { Octokit } from '@octokit/rest';
import { trimEnd } from 'lodash';
import parseGitUrl from 'git-url-parse';
import {
  AnalyzeOptions,
  ScmLocationAnalyzer,
} from '@backstage/plugin-catalog-backend';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Config } from '@backstage/config';

/** @public */
export type GitHubLocationAnalyzerOptions = {
  config: Config;
  discovery: PluginEndpointDiscovery;
};
/** @public */
export class GitHubLocationAnalyzer implements ScmLocationAnalyzer {
  private readonly catalogClient: CatalogApi;
  private readonly config: Config;

  constructor(options: GitHubLocationAnalyzerOptions) {
    this.config = options.config;
    this.catalogClient = new CatalogClient({ discoveryApi: options.discovery });
  }
  supports(url: string) {
    const integrations = ScmIntegrations.fromConfig(this.config);
    const integration = integrations.byUrl(url);
    return integration?.type === 'github';
  }
  async analyze({ url, catalogFilename }: AnalyzeOptions) {
    const { owner, name: repo } = parseGitUrl(url);

    const catalogFile = catalogFilename || 'catalog-info.yaml';

    const query = `filename:${catalogFile} repo:${owner}/${repo}`;

    const integration = ScmIntegrations.fromConfig(this.config).github.byUrl(
      url,
    );
    if (!integration) {
      throw new Error('Make sure you have a GitHub integration configured');
    }

    const octokitClient = new Octokit({
      auth: integration.config.token,
      baseUrl: integration.config.apiBaseUrl,
    });

    const searchResult = await octokitClient.search
      .code({ q: query })
      .catch(e => {
        throw new Error(`Couldn't search repository for metadata file, ${e}`);
      });

    const exists = searchResult.data.total_count > 0;
    if (exists) {
      const repoInformation = await octokitClient.repos
        .get({ owner, repo })
        .catch(e => {
          throw new Error(`Couldn't fetch repo data, ${e}`);
        });
      const defaultBranch = repoInformation.data.default_branch;

      const result = await Promise.all(
        searchResult.data.items
          .map(i => `${trimEnd(url, '/')}/blob/${defaultBranch}/${i.path}`)
          .map(async target => {
            const addLocationResult = await this.catalogClient.addLocation({
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

      return { existing: result.flat() };
    }
    return { existing: [] };
  }
}
