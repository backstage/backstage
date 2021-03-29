/*
 * Copyright 2021 Spotify AB
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

import { ScmIntegrations } from '@backstage/integration';
import { LocationSpec } from '@backstage/catalog-model';
import { BitbucketClient, pageIterator } from './bitbucket';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import { results } from './index';

export class BitbucketDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrations;
  private readonly logger: Logger;

  static fromConfig(config: Config, options: { logger: Logger }) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new BitbucketDiscoveryProcessor({
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
    if (location.type !== 'bitbucket-discovery') {
      return false;
    }

    const bitbucketConfig = this.integrations.bitbucket.byUrl(location.target)
      ?.config;
    if (!bitbucketConfig) {
      throw new Error(
        `There is no Bitbucket integration that matches ${location.target}. Please add a configuration entry for it under integrations.bitbucket`,
      );
    } else if (bitbucketConfig.host === 'bitbucket.org') {
      throw new Error(
        `Component discovery for Bitbucket Cloud is not yet supported`,
      );
    }

    const client = new BitbucketClient({
      config: bitbucketConfig,
    });
    const startTimestamp = Date.now();
    this.logger.info(`Reading Bitbucket repositories from ${location.target}`);

    const repositories = await readBitbucketOrg(client, location.target);

    for (const repository of repositories) {
      emit(
        results.location(
          repository,
          // Not all locations may actually exist, since the user defined them as a wildcard pattern.
          // Thus, we emit them as optional and let the downstream processor find them while not outputting
          // an error if it couldn't.
          true,
        ),
      );
    }

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.info(
      `Read ${repositories.length} Bitbucket repositories in ${duration} seconds`,
    );

    return true;
  }
}

export async function readBitbucketOrg(
  client: BitbucketClient,
  target: string,
): Promise<LocationSpec[]> {
  const { projectSearchPath, repoSearchPath, catalogPath } = parseUrl(target);
  const projectIterator = pageIterator(options => client.listProjects(options));
  let result: LocationSpec[] = [];

  for await (const page of projectIterator) {
    for (const project of page.values) {
      if (!projectSearchPath.test(project.key)) {
        continue;
      }
      const repoIterator = pageIterator(options =>
        client.listRepositories(project.key, options),
      );
      for await (const repoPage of repoIterator) {
        result = result.concat(
          repoPage.values
            .filter(v => repoSearchPath.test(v.slug))
            .map(repo => {
              return {
                type: 'url',
                target: `${repo.links.self[0].href}${catalogPath}`,
              };
            }),
        );
      }
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

function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}
