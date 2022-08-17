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

import { Config } from '@backstage/config';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { codeSearch } from '../lib';

/**
 * Extracts repositories out of an Azure DevOps org.
 *
 * The following will create locations for all projects which have a catalog-info.yaml
 * on the default branch. The first is shorthand for the second.
 *
 *    target: "https://dev.azure.com/org/project"
 *    or
 *    target: https://dev.azure.com/org/project?path=/catalog-info.yaml
 *
 * You may also explicitly specify a single repo:
 *
 *    target: https://dev.azure.com/org/project/_git/repo
 *
 * @public
 **/
export class AzureDevOpsDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly logger: Logger;

  static fromConfig(config: Config, options: { logger: Logger }) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new AzureDevOpsDiscoveryProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: {
    integrations: ScmIntegrationRegistry;
    logger: Logger;
  }) {
    this.integrations = options.integrations;
    this.logger = options.logger;
  }

  getProcessorName(): string {
    return 'AzureDevOpsDiscoveryProcessor';
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

    const { baseUrl, org, project, repo, catalogPath } = parseUrl(
      location.target,
    );
    this.logger.info(
      `Reading Azure DevOps repositories from ${location.target}`,
    );

    const files = await codeSearch(
      azureConfig,
      org,
      project,
      repo,
      catalogPath,
    );

    this.logger.debug(
      `Found ${files.length} files in Azure DevOps from ${location.target}.`,
    );

    for (const file of files) {
      emit(
        processingResult.location({
          type: 'url',
          target: `${baseUrl}/${org}/${project}/_git/${file.repository.name}?path=${file.path}`,
          // Not all locations may actually exist, since the user defined them as a wildcard pattern.
          // Thus, we emit them as optional and let the downstream processor find them while not outputting
          // an error if it couldn't.
          presence: 'optional',
        }),
      );
    }

    return true;
  }
}

/**
 * parseUrl extracts segments from the Azure DevOps URL.
 **/
export function parseUrl(urlString: string): {
  baseUrl: string;
  org: string;
  project: string;
  repo: string;
  catalogPath: string;
} {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split('/');

  const catalogPath = url.searchParams.get('path') || '/catalog-info.yaml';

  if (path.length === 2 && path[0].length && path[1].length) {
    return {
      baseUrl: url.origin,
      org: decodeURIComponent(path[0]),
      project: decodeURIComponent(path[1]),
      repo: '',
      catalogPath,
    };
  } else if (
    path.length === 4 &&
    path[0].length &&
    path[1].length &&
    path[2].length &&
    path[3].length
  ) {
    return {
      baseUrl: url.origin,
      org: decodeURIComponent(path[0]),
      project: decodeURIComponent(path[1]),
      repo: decodeURIComponent(path[3]),
      catalogPath,
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}
