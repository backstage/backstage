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

import { Octokit } from '@octokit/rest';
import { DiscoveryApi, OAuthApi, ConfigApi } from '@backstage/core';
import { CatalogImportApi } from './CatalogImportApi';
import { PartialEntity } from '../util/types';
import { GitHubIntegrationConfig } from '@backstage/integration';

export class CatalogImportClient implements CatalogImportApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly githubAuthApi: OAuthApi;
  private readonly configApi: ConfigApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    githubAuthApi: OAuthApi;
    configApi: ConfigApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.githubAuthApi = options.githubAuthApi;
    this.configApi = options.configApi;
  }

  async generateEntityDefinitions({
    repo,
  }: {
    repo: string;
  }): Promise<PartialEntity[]> {
    const response = await fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/analyze-location`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          location: { type: 'url', target: repo },
        }),
      },
    ).catch(e => {
      throw new Error(`Failed to generate entity definitions, ${e.message}`);
    });
    if (!response.ok) {
      throw new Error(
        `Failed to generate entity definitions. Received http response ${response.status}: ${response.statusText}`,
      );
    }

    const payload = await response.json();
    return payload.generateEntities.map((x: any) => x.entity);
  }

  async createRepositoryLocation({
    location,
  }: {
    location: string;
  }): Promise<void> {
    const response = await fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/locations`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          type: 'url',
          target: location,
          presence: 'optional',
        }),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Received http response ${response.status}: ${response.statusText}`,
      );
    }
  }

  async checkForExistingCatalogInfo({
    owner,
    repo,
    githubIntegrationConfig,
  }: {
    owner: string;
    repo: string;
    githubIntegrationConfig: GitHubIntegrationConfig;
  }): Promise<{ exists: boolean; url?: string }> {
    const token = await this.githubAuthApi.getAccessToken(['repo']);
    const octo = new Octokit({
      auth: token,
      baseUrl: githubIntegrationConfig.apiBaseUrl,
    });
    const catalogFileName = 'catalog-info.yaml';
    const query = `repo:${owner}/${repo}+filename:${catalogFileName}`;

    const searchResult = await octo.search.code({ q: query }).catch(e => {
      throw new Error(
        formatHttpErrorMessage(
          "Couldn't search repository for metadata file.",
          e,
        ),
      );
    });
    const exists = searchResult.data.total_count > 0;
    if (exists) {
      const repoInformation = await octo.repos.get({ owner, repo }).catch(e => {
        throw new Error(formatHttpErrorMessage("Couldn't fetch repo data", e));
      });
      const defaultBranch = repoInformation.data.default_branch;

      // Github search sorts returned values with 'best match' using 'multiple factors to boost the most relevant item',
      // aka magic.
      // Sorting to use the shortest item, closest to the repository root.
      const catalogInfoItem = searchResult.data.items
        .map(it => it.path)
        .sort((a, b) => a.length - b.length)[0];
      return {
        url: `blob/${defaultBranch}/${catalogInfoItem}`,
        exists,
      };
    }
    return { exists };
  }

  async submitPrToRepo({
    owner,
    repo,
    fileContent,
    githubIntegrationConfig,
  }: {
    owner: string;
    repo: string;
    fileContent: string;
    githubIntegrationConfig: GitHubIntegrationConfig;
  }): Promise<{ link: string; location: string }> {
    const token = await this.githubAuthApi.getAccessToken(['repo']);

    const octo = new Octokit({
      auth: token,
      baseUrl: githubIntegrationConfig.apiBaseUrl,
    });

    const branchName = 'backstage-integration';
    const fileName = 'catalog-info.yaml';

    const repoData = await octo.repos
      .get({
        owner,
        repo,
      })
      .catch(e => {
        throw new Error(formatHttpErrorMessage("Couldn't fetch repo data", e));
      });

    const parentRef = await octo.git
      .getRef({
        owner,
        repo,
        ref: `heads/${repoData.data.default_branch}`,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage("Couldn't fetch default branch data", e),
        );
      });

    await octo.git
      .createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: parentRef.data.object.sha,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a new branch with name '${branchName}'`,
            e,
          ),
        );
      });

    await octo.repos
      .createOrUpdateFileContents({
        owner,
        repo,
        path: fileName,
        message: `Add ${fileName} config file`,
        content: btoa(fileContent),
        branch: branchName,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a commit with ${fileName} file added`,
            e,
          ),
        );
      });

    const appTitle =
      this.configApi.getOptionalString('app.title') ?? 'Backstage';
    const appBaseUrl = this.configApi.getString('app.baseUrl');

    const prBody = `This pull request adds a **Backstage entity metadata file** \
to this repository so that the component can be added to the \
[${appTitle} software catalog](${appBaseUrl}).\n\nAfter this pull request is merged, \
the component will become available.\n\nFor more information, read an \
[overview of the Backstage software catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview).`;

    const pullRequestResponse = await octo.pulls
      .create({
        owner,
        repo,
        title: `Add ${fileName} config file`,
        head: branchName,
        body: prBody,
        base: repoData.data.default_branch,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a pull request for ${branchName} branch`,
            e,
          ),
        );
      });

    return {
      link: pullRequestResponse.data.html_url,
      location: `https://${githubIntegrationConfig.host}/${owner}/${repo}/blob/${repoData.data.default_branch}/${fileName}`,
    };
  }
}

function formatHttpErrorMessage(
  message: string,
  error: { status: number; message: string },
) {
  return `${message}, received http response status code ${error.status}: ${error.message}`;
}
