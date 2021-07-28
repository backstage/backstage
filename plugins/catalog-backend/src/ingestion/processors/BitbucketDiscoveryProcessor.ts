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
import { Logger } from 'winston';
import { Config } from '@backstage/config';

import {
  BitbucketIntegration,
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import { LocationSpec } from '@backstage/catalog-model';
import {
  BitbucketRepositoryParser,
  BitbucketClient,
  defaultRepositoryParser,
  paginated,
  paginated20,
  BitbucketRepository,
  BitbucketRepository20,
} from './bitbucket';
import { CatalogProcessor, CatalogProcessorEmit } from './types';

const DEFAULT_BRANCH = 'master';
const DEFAULT_CATALOG_LOCATION = '/catalog-info.yaml';
const EMPTY_CATALOG_LOCATION = '/';

export class BitbucketDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly parser: BitbucketRepositoryParser;
  private readonly logger: Logger;

  static fromConfig(
    config: Config,
    options: { parser?: BitbucketRepositoryParser; logger: Logger },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new BitbucketDiscoveryProcessor({
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

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'bitbucket-discovery') {
      return false;
    }

    const integration = this.integrations.bitbucket.byUrl(location.target);
    if (!integration) {
      throw new Error(
        `There is no Bitbucket integration that matches ${location.target}. Please add a configuration entry for it under integrations.bitbucket`,
      );
    }

    const client = new BitbucketClient({
      config: integration.config,
    });
    const startTimestamp = Date.now();
    this.logger.info(`Reading Bitbucket repositories from ${location.target}`);

    const isBitbucketCloud = integration.config.host === 'bitbucket.org';

    const processOptions: ProcessOptions = {
      client,
      emit,
      integration,
      location,
    };

    const { scanned, matches } = isBitbucketCloud
      ? await this.processCloudRepositories(processOptions)
      : await this.processOrganisationRepositories(processOptions);

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${scanned} Bitbucket repositories (${matches} matching the pattern) in ${duration} seconds`,
    );

    return true;
  }

  private async processCloudRepositories(
    options: ProcessOptions,
  ): Promise<ResultSummary> {
    const { client, location, integration, emit } = options;

    const { catalogPath: requestedCatalogPath } = parseBitbucketCloudUrl(
      location.target,
    );
    const catalogPath =
      requestedCatalogPath === EMPTY_CATALOG_LOCATION
        ? DEFAULT_CATALOG_LOCATION
        : requestedCatalogPath;
    const result = await readBitbucketCloud(client, location.target);
    for (const repository of result.matches) {
      const mainbranch = repository.mainbranch?.name ?? DEFAULT_BRANCH;
      for await (const entity of this.parser({
        integration,
        target: `${repository.links.html.href}/src/${mainbranch}${catalogPath}`,
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

  private async processOrganisationRepositories(
    options: ProcessOptions,
  ): Promise<ResultSummary> {
    const { client, location, integration, emit } = options;
    const { catalogPath: requestedCatalogPath } = parseUrl(location.target);
    const catalogPath =
      requestedCatalogPath === EMPTY_CATALOG_LOCATION
        ? DEFAULT_CATALOG_LOCATION
        : requestedCatalogPath;
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
  client: BitbucketClient,
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

export async function readBitbucketCloud(
  client: BitbucketClient,
  target: string,
): Promise<Result<BitbucketRepository20>> {
  const {
    workspacePath,
    queryParam: q,
    projectSearchPath,
    repoSearchPath,
  } = parseBitbucketCloudUrl(target);

  const repositories = paginated20(
    options => client.listRepositoriesByWorkspace20(workspacePath, options),
    {
      q,
    },
  );
  const result: Result<BitbucketRepository20> = {
    scanned: 0,
    matches: [],
  };

  for await (const repository of repositories) {
    result.scanned++;
    if (
      (!projectSearchPath || projectSearchPath.test(repository.project.key)) &&
      (!repoSearchPath || repoSearchPath.test(repository.slug))
    ) {
      result.matches.push(repository);
    }
  }
  return result;
}

function parseUrl(
  urlString: string,
): { projectSearchPath: RegExp; repoSearchPath: RegExp; catalogPath: string } {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split('/');

  // /projects/backstage/repos/techdocs-*/catalog-info.yaml
  if (path.length > 3 && path[1].length && path[3].length) {
    return {
      projectSearchPath: escapeRegExp(decodeURIComponent(path[1])),
      repoSearchPath: escapeRegExp(decodeURIComponent(path[3])),
      catalogPath: `/${decodeURIComponent(path.slice(4).join('/'))}`,
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}

function readPathParameters(pathParts: string[]): Map<string, string> {
  const vals: Record<string, any> = {};
  for (let i = 0; i < pathParts.length; i += 2) {
    if (i + 1 >= pathParts.length) continue;
    vals[pathParts[i]] = decodeURIComponent(pathParts[i + 1]);
  }
  return new Map<string, string>(Object.entries(vals));
}

function parseBitbucketCloudUrl(
  urlString: string,
): {
  workspacePath: string;
  catalogPath: string;
  projectSearchPath?: RegExp;
  repoSearchPath?: RegExp;
  queryParam?: string;
} {
  const url = new URL(urlString);
  const pathMap = readPathParameters(url.pathname.substr(1).split('/'));
  const query = url.searchParams;

  if (!pathMap.has('workspaces')) {
    throw new Error(`Failed to parse workspace from ${urlString}`);
  }

  return {
    workspacePath: pathMap.get('workspaces')!,
    projectSearchPath: pathMap.has('projects')
      ? escapeRegExp(pathMap.get('projects')!)
      : undefined,
    repoSearchPath: pathMap.has('repos')
      ? escapeRegExp(pathMap.get('repos')!)
      : undefined,
    catalogPath: `/${query.get('catalogPath') || ''}`,
    queryParam: query.get('q') || undefined,
  };
}

function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}

type ProcessOptions = {
  client: BitbucketClient;
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
