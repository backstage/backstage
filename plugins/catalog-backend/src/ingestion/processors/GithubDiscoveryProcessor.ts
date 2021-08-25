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
import { Config } from '@backstage/config';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { graphql } from '@octokit/graphql';
import { Logger } from 'winston';
import { getOrganizationRepositories } from './github';
import * as results from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';

/**
 * Extracts repositories out of a GitHub org.
 *
 * The following will create locations for all projects which have a catalog-info.yaml
 * on the default branch. The first is shorthand for the second.
 *
 *    target: "https://github.com/backstage"
 *    or
 *    target: https://github.com/backstage/*\/blob/-/catalog-info.yaml
 *
 * You may also explicitly specify the source branch:
 *
 *    target: https://github.com/backstage/*\/blob/main/catalog-info.yaml
 **/
export class GithubDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrations;
  private readonly logger: Logger;

  static fromConfig(config: Config, options: { logger: Logger }) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new GithubDiscoveryProcessor({
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
    if (location.type !== 'github-discovery') {
      return false;
    }

    const gitHubConfig = this.integrations.github.byUrl(
      location.target,
    )?.config;
    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub integration that matches ${location.target}. Please add a configuration entry for it under integrations.github`,
      );
    }

    const { org, repoSearchPath, catalogPath, branch, host } = parseUrl(
      location.target,
    );

    // Building the org url here so that the github creds provider doesn't need to know
    // about how to handle the wild card which is special for this processor.
    const orgUrl = `https://${host}/${org}`;

    const { headers } = await GithubCredentialsProvider.create(
      gitHubConfig,
    ).getCredentials({ url: orgUrl });

    const client = graphql.defaults({
      baseUrl: gitHubConfig.apiBaseUrl,
      headers,
    });

    // Read out all of the raw data
    const startTimestamp = Date.now();
    this.logger.info(`Reading GitHub repositories from ${location.target}`);

    const { repositories } = await getOrganizationRepositories(client, org);
    const matching = repositories.filter(
      r => !r.isArchived && repoSearchPath.test(r.name),
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${repositories.length} GitHub repositories (${matching.length} matching the pattern) in ${duration} seconds`,
    );

    for (const repository of matching) {
      const path = `/blob/${
        branch === '-' ? repository.defaultBranchRef.name : branch
      }${catalogPath}`;
      emit(
        results.location(
          {
            type: 'url',
            target: `${repository.url}${path}`,
          },
          // Not all locations may actually exist, since the user defined them as a wildcard pattern.
          // Thus, we emit them as optional and let the downstream processor find them while not outputting
          // an error if it couldn't.
          true,
        ),
      );
    }

    return true;
  }
}

/*
 * Helpers
 */

export function parseUrl(urlString: string): {
  org: string;
  repoSearchPath: RegExp;
  catalogPath: string;
  branch: string;
  host: string;
} {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split('/');

  // /backstage/techdocs-*/blob/master/catalog-info.yaml
  // can also be
  // /backstage
  if (path.length > 2 && path[0].length && path[1].length) {
    return {
      org: decodeURIComponent(path[0]),
      repoSearchPath: escapeRegExp(decodeURIComponent(path[1])),
      branch: decodeURIComponent(path[3]),
      catalogPath: `/${decodeURIComponent(path.slice(4).join('/'))}`,
      host: url.host,
    };
  } else if (path.length === 1 && path[0].length) {
    return {
      org: decodeURIComponent(path[0]),
      host: url.host,
      repoSearchPath: escapeRegExp('*'),
      catalogPath: '/catalog-info.yaml',
      branch: '-',
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}

export function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}
