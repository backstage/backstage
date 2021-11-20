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

import { LocationSpec } from '@backstage/catalog-model';
import fetch from 'cross-fetch';
import { Config } from '@backstage/config';
import {
  getAzureRequestOptions,
  ScmIntegrations,
} from '@backstage/integration';
import { Logger } from 'winston';
import * as results from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';

/**
 * TODO
 **/
export class AzureDevOpsDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrations;
  private readonly logger: Logger;

  static fromConfig(config: Config, options: { logger: Logger }) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new AzureDevOpsDiscoveryProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: { integrations: ScmIntegrations; logger: Logger }) {
    this.integrations = options.integrations;
    this.logger = options.logger;
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'azure-discovery') {
      return false;
    }

    const azureConfig = this.integrations.azure.byUrl(location.target)?.config;
    if (!azureConfig) {
      throw new Error(
        `There is no Azure integration that matches ${location.target}. Please add a configuration entry for it under integrations.azure`,
      );
    }

    // TODO: extract this from configured URL
    const { org, project } = { org: 'myOrg', project: 'myProject' };

    // TODO:  What's the search URL for self hosted DevOps?
    const searchUrl = `https://almsearch.dev.azure.com/${org}/${project}/_apis/search/codesearchresults?api-version=6.0-preview.1`;
    const opts = getAzureRequestOptions(azureConfig);

    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        ...opts.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchText: 'catalog-info.yaml',
        $top: 1000,
      }),
    });

    // TODO: more logging
    if (response.status === 200) {
      const responseBody: AzureDevOpsCodeSearchResults = await response.json();

      // TODO: should we support different file names?
      const matches = responseBody.results.filter(
        r => r.fileName === 'catalog-info.yaml',
      );

      for (const match of matches) {
        emit(
          results.location(
            {
              type: 'url',
              // TODO: Do we need to support non-default branches?
              target: `${location.target}/_git/${match.repository.name}?path=${match.path}`,
            },
            // Not all locations may actually exist, since the user defined them as a wildcard pattern.
            // Thus, we emit them as optional and let the downstream processor find them while not outputting
            // an error if it couldn't.
            true,
          ),
        );
      }
    }

    return true;
  }
}

interface AzureDevOpsCodeSearchResults {
  count: number;
  results: Array<{
    fileName: string;
    path: string;
    project: {
      id: string;
      name: string;
    };
    repository: {
      id: string;
      name: string;
    };
  }>;
}
