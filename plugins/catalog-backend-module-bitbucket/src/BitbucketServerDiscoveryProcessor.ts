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
  BitbucketIntegration,
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import {
  BitbucketRepository,
  BitbucketRepositoryParser,
  BitbucketServerClient,
  defaultRepositoryParser,
  paginated,
} from './lib';

const DEFAULT_CATALOG_LOCATION = '/catalog-info.yaml';

/** @public */
export class BitbucketServerDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly parser: BitbucketRepositoryParser;
  private readonly logger: Logger;

  static fromConfig(
    config: Config,
    options: {
      parser?: BitbucketRepositoryParser;
      logger: Logger;
    },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new BitbucketServerDiscoveryProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: {
    integrations: ScmIntegrationRegistry;
    parser?: BitbucketRepositoryParser;
    logger: Logger;
  }) {
    this.integrations = options.integrations;
    this.parser = options.parser || defaultRepositoryParser;
    this.logger = options.logger;
  }

  getProcessorName(): string {
    return 'BitbucketServerDiscoveryProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'bitbucket-server-discovery') {
      return false;
    }

    const integration = this.integrations.bitbucket.byUrl(location.target);
    if (!integration) {
      throw new Error(
        `There is no Bitbucket integration that matches ${location.target}. Please add a configuration entry for it under integrations.bitbucket`,
      );
    }

    const startTimestamp = Date.now();
    this.logger.info(
      `Reading ${integration.config.host} repositories from ${location.target}`,
    );

    const processOptions: ProcessOptions = {
      emit,
      integration,
      location,
    };

    const { scanned, matches } = await this.processOrganizationRepositories(
      processOptions,
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${scanned} ${integration.config.host} repositories (${matches} matching the pattern) in ${duration} seconds`,
    );

    return true;
  }

  private async processOrganizationRepositories(
    options: ProcessOptions,
  ): Promise<ResultSummary> {
    const { location, integration, emit } = options;
    const { catalogPath: requestedCatalogPath } = parseUrl(location.target);
    const catalogPath = requestedCatalogPath
      ? `/${requestedCatalogPath}`
      : DEFAULT_CATALOG_LOCATION;

    const client = new BitbucketServerClient({
      config: integration.config,
    });

    const result = await readBitbucketOrg(client, location.target);
    for (const repository of result.matches) {
      for await (const entity of this.parser({
        integration,
        target: `${repository.links.self[0].href}${catalogPath}`,
        logger: this.logger,
      })) {
        emit(entity);
      }
    }
    return {
      matches: result.matches.length,
      scanned: result.scanned,
    };
  }
}

export async function readBitbucketOrg(
  client: BitbucketServerClient,
  target: string,
): Promise<Result<BitbucketRepository>> {
  const { projectSearchPath, repoSearchPath } = parseUrl(target);
  const projects = paginated(options => client.listProjects(options));
  const result: Result<BitbucketRepository> = {
    scanned: 0,
    matches: [],
  };

  for await (const project of projects) {
    if (!projectSearchPath.test(project.key)) {
      continue;
    }
    const repositories = paginated(options =>
      client.listRepositories(project.key, options),
    );
    for await (const repository of repositories) {
      result.scanned++;
      if (repoSearchPath.test(repository.slug)) {
        result.matches.push(repository);
      }
    }
  }
  return result;
}

function parseUrl(urlString: string): {
  projectSearchPath: RegExp;
  repoSearchPath: RegExp;
  catalogPath: string;
} {
  const url = new URL(urlString);
  const indexOfProjectSegment =
    url.pathname.toLowerCase().indexOf('/projects/') + 1;
  const path = url.pathname.substr(indexOfProjectSegment).split('/');

  // /projects/backstage/repos/techdocs-*/catalog-info.yaml
  if (path.length > 3 && path[1].length && path[3].length) {
    return {
      projectSearchPath: escapeRegExp(decodeURIComponent(path[1])),
      repoSearchPath: escapeRegExp(decodeURIComponent(path[3])),
      catalogPath: decodeURIComponent(path.slice(4).join('/') + url.search),
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}

function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}

type ProcessOptions = {
  integration: BitbucketIntegration;
  location: LocationSpec;
  emit: CatalogProcessorEmit;
};

type Result<T> = {
  scanned: number;
  matches: T[];
};

type ResultSummary = {
  scanned: number;
  matches: number;
};
