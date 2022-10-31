/*
 * Copyright 2020 The Backstage Authors
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

import { CatalogApi } from '@backstage/catalog-client';
import {
  ConfigApi,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {
  GithubIntegrationConfig,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { ScmAuthApi } from '@backstage/integration-react';
import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';
import { AnalyzeResult, CatalogImportApi } from './CatalogImportApi';
import { getGithubIntegrationConfig } from './GitHub';
import { getBranchName, getCatalogFilename } from '../components/helpers';
import { AnalyzeLocationResponse } from '@backstage/plugin-catalog-common';
import { CompoundEntityRef } from '@backstage/catalog-model';

/**
 * The default implementation of the {@link CatalogImportApi}.
 *
 * @public
 */
export class CatalogImportClient implements CatalogImportApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly scmAuthApi: ScmAuthApi;
  private readonly scmIntegrationsApi: ScmIntegrationRegistry;
  private readonly catalogApi: CatalogApi;
  private readonly configApi: ConfigApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    scmAuthApi: ScmAuthApi;
    identityApi: IdentityApi;
    scmIntegrationsApi: ScmIntegrationRegistry;
    catalogApi: CatalogApi;
    configApi: ConfigApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.scmAuthApi = options.scmAuthApi;
    this.identityApi = options.identityApi;
    this.scmIntegrationsApi = options.scmIntegrationsApi;
    this.catalogApi = options.catalogApi;
    this.configApi = options.configApi;
  }

  async analyzeUrl(url: string): Promise<AnalyzeResult> {
    if (
      new URL(url).pathname.match(/\.ya?ml$/) ||
      new URL(url).searchParams.get('path')?.match(/.ya?ml$/)
    ) {
      const location = await this.catalogApi.addLocation({
        type: 'url',
        target: url,
        dryRun: true,
      });

      return {
        type: 'locations',
        locations: [
          {
            exists: location.exists,
            target: location.location.target,
            entities: location.entities.map(e => ({
              kind: e.kind,
              namespace: e.metadata.namespace ?? 'default',
              name: e.metadata.name,
            })),
          },
        ],
      };
    }

    const ghConfig = getGithubIntegrationConfig(this.scmIntegrationsApi, url);
    if (!ghConfig) {
      const other = this.scmIntegrationsApi.byUrl(url);
      const catalogFilename = getCatalogFilename(this.configApi);

      if (other) {
        throw new Error(
          `The ${other.title} integration only supports full URLs to ${catalogFilename} files. Did you try to pass in the URL of a directory instead?`,
        );
      }
      throw new Error(
        `This URL was not recognized as a valid GitHub URL because there was no configured integration that matched the given host name. You could try to paste the full URL to a ${catalogFilename} file instead.`,
      );
    }

    const analyzation = await this.analyzeLocation({
      repo: url,
    });

    if (analyzation.existingEntityFiles.length > 0) {
      const locations = analyzation.existingEntityFiles.reduce<
        Record<
          string,
          {
            target: string;
            exists?: boolean;
            entities: CompoundEntityRef[];
          }
        >
      >((state, curr) => {
        state[curr.location.target] = {
          target: curr.location.target,
          exists: curr.isRegistered,
          entities: [
            ...(curr.location.target in state
              ? state[curr.location.target].entities
              : []),
            {
              name: curr.entity.metadata.name,
              namespace: curr.entity.metadata.namespace ?? 'default',
              kind: curr.entity.kind,
            },
          ],
        };
        return state;
      }, {});
      return {
        type: 'locations',
        locations: Object.values(locations),
      };
    }

    return {
      type: 'repository',
      integrationType: 'github',
      url: url,
      generatedEntities: analyzation.generateEntities.map(x => x.entity),
    };
  }

  async preparePullRequest(): Promise<{
    title: string;
    body: string;
  }> {
    const appTitle =
      this.configApi.getOptionalString('app.title') ?? 'Backstage';
    const appBaseUrl = this.configApi.getString('app.baseUrl');
    const catalogFilename = getCatalogFilename(this.configApi);

    return {
      title: `Add ${catalogFilename} config file`,
      body: `This pull request adds a **Backstage entity metadata file** \
to this repository so that the component can be added to the \
[${appTitle} software catalog](${appBaseUrl}).\n\nAfter this pull request is merged, \
the component will become available.\n\nFor more information, read an \
[overview of the Backstage software catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview).`,
    };
  }

  async submitPullRequest(options: {
    repositoryUrl: string;
    fileContent: string;
    title: string;
    body: string;
  }): Promise<{ link: string; location: string }> {
    const { repositoryUrl, fileContent, title, body } = options;

    const ghConfig = getGithubIntegrationConfig(
      this.scmIntegrationsApi,
      repositoryUrl,
    );

    if (ghConfig) {
      return await this.submitGitHubPrToRepo({
        ...ghConfig,
        repositoryUrl,
        fileContent,
        title,
        body,
      });
    }

    throw new Error('unimplemented!');
  }

  // TODO: this could be part of the catalog api
  private async analyzeLocation(options: {
    repo: string;
  }): Promise<AnalyzeLocationResponse> {
    const { token } = await this.identityApi.getCredentials();
    const response = await fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/analyze-location`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        method: 'POST',
        body: JSON.stringify({
          location: { type: 'url', target: options.repo },
          ...(this.configApi.getOptionalString(
            'catalog.import.entityFilename',
          ) && {
            catalogFilename: this.configApi.getOptionalString(
              'catalog.import.entityFilename',
            ),
          }),
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
    return payload;
  }

  // TODO: extract this function and implement for non-github
  private async submitGitHubPrToRepo(options: {
    owner: string;
    repo: string;
    title: string;
    body: string;
    fileContent: string;
    repositoryUrl: string;
    githubIntegrationConfig: GithubIntegrationConfig;
  }): Promise<{ link: string; location: string }> {
    const {
      owner,
      repo,
      title,
      body,
      fileContent,
      repositoryUrl,
      githubIntegrationConfig,
    } = options;

    const { token } = await this.scmAuthApi.getCredentials({
      url: repositoryUrl,
      additionalScope: {
        repoWrite: true,
      },
    });

    const octo = new Octokit({
      auth: token,
      baseUrl: githubIntegrationConfig.apiBaseUrl,
    });

    const branchName = getBranchName(this.configApi);
    const fileName = getCatalogFilename(this.configApi);

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
        message: title,
        content: Base64.encode(fileContent),
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

    const pullRequestResponse = await octo.pulls
      .create({
        owner,
        repo,
        title,
        head: branchName,
        body,
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
