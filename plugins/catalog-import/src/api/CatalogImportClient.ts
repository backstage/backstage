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
import { DiscoveryApi, OAuthApi } from '@backstage/core';
import { CatalogImportApi } from './CatalogImportApi';
import { AnalyzeLocationResponse } from '@backstage/plugin-catalog-backend';
import { PartialEntity } from '../util/types';

export class CatalogImportClient implements CatalogImportApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly githubAuthApi: OAuthApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    githubAuthApi: OAuthApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.githubAuthApi = options.githubAuthApi;
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
          location: { type: 'github', target: repo },
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

    const payload = (await response.json()) as AnalyzeLocationResponse;
    return payload.generateEntities.map(x => x.entity);
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
          type: 'github',
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

  async submitPrToRepo({
    owner,
    repo,
    fileContent,
  }: {
    owner: string;
    repo: string;
    fileContent: string;
  }): Promise<{ link: string; location: string }> {
    const token = await this.githubAuthApi.getAccessToken(['repo']);

    const octo = new Octokit({
      auth: token,
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

    const pullRequestRespone = await octo.pulls
      .create({
        owner,
        repo,
        title: `Add ${fileName} config file`,
        head: branchName,
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
      link: pullRequestRespone.data.html_url,
      location: `https://github.com/${owner}/${repo}/blob/${repoData.data.default_branch}/${fileName}`,
    };
  }
}

function formatHttpErrorMessage(
  message: string,
  error: { status: number; message: string },
) {
  return `${message}, received http response status code ${error.status}: ${error.message}`;
}
