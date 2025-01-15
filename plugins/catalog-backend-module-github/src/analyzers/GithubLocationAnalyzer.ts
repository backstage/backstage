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
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import { Octokit } from '@octokit/rest';
import { isEmpty, trimEnd } from 'lodash';
import parseGitUrl from 'git-url-parse';
import {
  AnalyzeOptions,
  ScmLocationAnalyzer,
} from '@backstage/plugin-catalog-node';
import {
  TokenManager,
  createLegacyAuthAdapters,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { AuthService, DiscoveryService } from '@backstage/backend-plugin-api';
import { extname } from 'path';

/** @public */
export type GithubLocationAnalyzerOptions = {
  config: Config;
  discovery: DiscoveryService;
  tokenManager?: TokenManager;
  auth?: AuthService;
  githubCredentialsProvider?: GithubCredentialsProvider;
  catalog?: CatalogApi;
};

/** @public */
export class GithubLocationAnalyzer implements ScmLocationAnalyzer {
  private readonly catalogClient: CatalogApi;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;
  private readonly integrations: ScmIntegrationRegistry;
  private readonly auth: AuthService;

  constructor(options: GithubLocationAnalyzerOptions) {
    this.catalogClient =
      options.catalog ?? new CatalogClient({ discoveryApi: options.discovery });
    this.integrations = ScmIntegrations.fromConfig(options.config);
    this.githubCredentialsProvider =
      options.githubCredentialsProvider ||
      DefaultGithubCredentialsProvider.fromIntegrations(this.integrations);

    this.auth = createLegacyAuthAdapters({
      auth: options.auth,
      discovery: options.discovery,
      tokenManager: options.tokenManager,
    }).auth;
  }

  supports(url: string) {
    const integration = this.integrations.byUrl(url);
    return integration?.type === 'github';
  }

  async analyze(options: AnalyzeOptions) {
    const { url, catalogFilename } = options;
    const { owner, name: repo } = parseGitUrl(url);

    const catalogFile = catalogFilename || 'catalog-info.yaml';
    const extension = extname(catalogFile);
    const extensionQuery = !isEmpty(extension)
      ? `extension:${extension.replace('.', '')}`
      : '';

    const query = `filename:${catalogFile} ${extensionQuery} repo:${owner}/${repo}`;

    const integration = this.integrations.github.byUrl(url);
    if (!integration) {
      throw new Error('Make sure you have a GitHub integration configured');
    }

    const { token: githubToken } =
      await this.githubCredentialsProvider.getCredentials({
        url,
      });

    const octokitClient = new Octokit({
      auth: githubToken,
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

      const { token: serviceToken } = await this.auth.getPluginRequestToken({
        onBehalfOf: await this.auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog',
      });

      const result = await Promise.all(
        searchResult.data.items
          .map(i => `${trimEnd(url, '/')}/blob/${defaultBranch}/${i.path}`)
          .map(async target => {
            const addLocationResult = await this.catalogClient.addLocation(
              {
                type: 'url',
                target,
                dryRun: true,
              },
              { token: serviceToken },
            );
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
