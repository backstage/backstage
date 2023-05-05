/*
 * Copyright 2023 The Backstage Authors
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
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { graphql } from '@octokit/graphql';
import {
  Repository as GraphqlRepository,
  Query as GraphqlQuery,
} from '@octokit/graphql-schema';
import parseGitUrl from 'git-url-parse';
import { Provider, Repository } from '../types';
import { GithubRepository } from './GithubRepository';

export class GithubDiscoveryProvider implements Provider {
  readonly #envToken: string | undefined;
  readonly #scmIntegrations: ScmIntegrations;
  readonly #credentialsProvider: GithubCredentialsProvider;

  static fromConfig(config: Config): GithubDiscoveryProvider {
    const envToken = process.env.GITHUB_TOKEN || undefined;
    const scmIntegrations = ScmIntegrations.fromConfig(config);
    const credentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(scmIntegrations);
    return new GithubDiscoveryProvider(
      envToken,
      scmIntegrations,
      credentialsProvider,
    );
  }

  private constructor(
    envToken: string | undefined,
    integrations: ScmIntegrations,
    credentialsProvider: GithubCredentialsProvider,
  ) {
    this.#envToken = envToken;
    this.#scmIntegrations = integrations;
    this.#credentialsProvider = credentialsProvider;
  }

  name(): string {
    return 'GitHub';
  }

  async discover(url: string): Promise<Repository[] | false> {
    if (!url.startsWith('https://github.com/')) {
      return false;
    }

    const scmIntegration = this.#scmIntegrations.github.byUrl(url);
    if (!scmIntegration) {
      throw new Error(`No GitHub integration found for ${url}`);
    }

    const parsed = parseGitUrl(url);
    const { name, organization } = parsed;
    const org = organization || name; // depends on if it's a repo url or an org url...

    const client = graphql.defaults({
      baseUrl: scmIntegration.config.apiBaseUrl,
      headers: await this.#getRequestHeaders(url),
    });

    const { repositories } = await this.#getOrganizationRepositories(
      client,
      org,
    );

    return repositories
      .filter(repo => repo.url.startsWith(url))
      .map(repo => new GithubRepository(client, repo, org));
  }

  async #getRequestHeaders(url: string): Promise<Record<string, string>> {
    const credentials = await this.#credentialsProvider.getCredentials({
      url,
    });

    if (credentials.headers) {
      return credentials.headers;
    } else if (credentials.token) {
      return { authorization: `token ${credentials.token}` };
    }

    if (this.#envToken) {
      return { authorization: `token ${this.#envToken}` };
    }

    throw new Error(
      'No token available for GitHub, please configure your integrations or set a GITHUB_TOKEN env variable',
    );
  }

  async #getOrganizationRepositories(client: typeof graphql, org: string) {
    const query = `query repositories($org: String!, $cursor: String) {
      repositoryOwner(login: $org) {
        login
        repositories(first: 100, after: $cursor) {
          nodes {
            name
            url
            description
            isArchived
            isFork
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }`;

    const result: GraphqlRepository[] = [];

    let cursor: string | undefined | null = undefined;
    let hasNextPage = true;

    while (hasNextPage) {
      const response: GraphqlQuery = await client(query, {
        org,
        cursor,
      });

      const { repositories: connection } = response.repositoryOwner ?? {};

      if (!connection) {
        throw new Error(`Found no repositories for ${org}`);
      }

      for (const repository of connection.nodes ?? []) {
        if (repository && !repository.isArchived && !repository.isFork) {
          result.push(repository);
        }
      }

      cursor = connection.pageInfo.endCursor;
      hasNextPage = connection.pageInfo.hasNextPage;
    }

    return {
      repositories: result,
    };
  }
}
