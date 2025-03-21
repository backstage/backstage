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
import { ConfigApi, DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  GithubIntegration,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { ScmAuthApi } from '@backstage/integration-react';
import { AnalyzeResult, CatalogImportApi } from './CatalogImportApi';
import YAML from 'yaml';
import { GitHubOptions, submitGitHubPrToRepo } from './GitHub';
import { getCatalogFilename } from '../components/helpers';
import { AnalyzeLocationResponse } from '@backstage/plugin-catalog-common';
import { CompoundEntityRef } from '@backstage/catalog-model';
import parseGitUrl from 'git-url-parse';
import { submitAzurePrToRepo } from './AzureDevops';

/**
 * The default implementation of the {@link CatalogImportApi}.
 *
 * @public
 */
export class CatalogImportClient implements CatalogImportApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly scmAuthApi: ScmAuthApi;
  private readonly scmIntegrationsApi: ScmIntegrationRegistry;
  private readonly catalogApi: CatalogApi;
  private readonly configApi: ConfigApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    scmAuthApi: ScmAuthApi;
    fetchApi: FetchApi;
    scmIntegrationsApi: ScmIntegrationRegistry;
    catalogApi: CatalogApi;
    configApi: ConfigApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.scmAuthApi = options.scmAuthApi;
    this.fetchApi = options.fetchApi;
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
    const supportedIntegrations = ['github', 'azure'];
    const foundIntegration = this.scmIntegrationsApi.byUrl(url);
    const iSupported =
      !!foundIntegration &&
      supportedIntegrations.find(it => it === foundIntegration.type);
    if (!iSupported) {
      const catalogFilename = getCatalogFilename(this.configApi);

      if (foundIntegration) {
        throw new Error(
          `The ${foundIntegration.title} integration only supports full URLs to ${catalogFilename} files. Did you try to pass in the URL of a directory instead?`,
        );
      }
      throw new Error(
        `This URL was not recognized as a valid git URL because there was no configured integration that matched the given host name. Currently GitHub and Azure DevOps are supported. You could try to paste the full URL to a ${catalogFilename} file instead.`,
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
      integrationType: foundIntegration.type,
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
[overview of the Backstage software catalog](https://backstage.io/docs/features/software-catalog/).`,
    };
  }

  async submitPullRequest(options: {
    repositoryUrl: string;
    fileContent: string;
    title: string;
    body: string;
  }): Promise<{ link: string; location: string }> {
    const { repositoryUrl, fileContent, title, body } = options;

    const parseData = YAML.parseAllDocuments(fileContent);

    for (const document of parseData) {
      const validationResponse = await this.catalogApi.validateEntity(
        document.toJS(),
        `url:${repositoryUrl}`,
      );
      if (!validationResponse.valid) {
        throw new Error(validationResponse.errors[0].message);
      }
    }

    const provider = this.scmIntegrationsApi.byUrl(repositoryUrl);

    switch (provider?.type) {
      case 'github': {
        const { config } = provider as GithubIntegration;
        const { name, owner } = parseGitUrl(repositoryUrl);
        const options2: GitHubOptions = {
          githubIntegrationConfig: config,
          repo: name,
          owner: owner,
          repositoryUrl,
          fileContent,
          title,
          body,
        };
        return submitGitHubPrToRepo(options2, this.scmAuthApi, this.configApi);
      }
      case 'azure': {
        return submitAzurePrToRepo(
          {
            repositoryUrl,
            fileContent,
            title,
            body,
          },
          this.scmAuthApi,
          this.configApi,
        );
      }
      default: {
        throw new Error('unimplemented!');
      }
    }
  }

  // TODO: this could be part of the catalog api
  private async analyzeLocation(options: {
    repo: string;
  }): Promise<AnalyzeLocationResponse> {
    const response = await this.fetchApi
      .fetch(
        `${await this.discoveryApi.getBaseUrl('catalog')}/analyze-location`,
        {
          headers: {
            'Content-Type': 'application/json',
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
      )
      .catch(e => {
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
}
