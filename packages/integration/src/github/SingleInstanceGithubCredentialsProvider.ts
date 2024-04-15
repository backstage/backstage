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

import parseGitUrl from 'git-url-parse';
import { GithubAppConfig, GithubIntegrationConfig } from './config';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { DateTime } from 'luxon';
import {
  GithubCredentials,
  GithubCredentialsProvider,
  GithubCredentialType,
} from './types';

type InstallationData = {
  installationId: number;
  suspended: boolean;
};

type InstallationTokenData = {
  token: string;
  expiresAt: DateTime;
  repositories?: String[];
};

class Cache {
  private readonly tokenCache = new Map<string, InstallationTokenData>();

  async getOrCreateToken(
    owner: string,
    repo: string | undefined,
    supplier: () => Promise<InstallationTokenData>,
  ): Promise<{ accessToken: string }> {
    let existingInstallationData = this.tokenCache.get(owner);

    if (
      !existingInstallationData ||
      this.isExpired(existingInstallationData.expiresAt)
    ) {
      existingInstallationData = await supplier();
      // Allow 10 minutes grace to account for clock skew
      existingInstallationData.expiresAt =
        existingInstallationData.expiresAt.minus({ minutes: 10 });
      this.tokenCache.set(owner, existingInstallationData);
    }

    if (!this.appliesToRepo(existingInstallationData, repo)) {
      throw new Error(
        `The Backstage GitHub application used in the ${owner} organization does not have access to a repository with the name ${repo}`,
      );
    }

    return { accessToken: existingInstallationData.token };
  }

  private isExpired = (date: DateTime) => DateTime.local() > date;

  private appliesToRepo(tokenData: InstallationTokenData, repo?: string) {
    // If no specific repo has been requested the token is applicable
    if (repo === undefined) {
      return true;
    }
    // If the token is restricted to repositories, the token only applies if the repo is in the allow list
    if (tokenData.repositories !== undefined) {
      return tokenData.repositories.includes(repo);
    }
    // Otherwise the token is applicable
    return true;
  }
}

/**
 * This accept header is required when calling App APIs in GitHub Enterprise.
 * It has no effect on calls to github.com and can probably be removed entirely
 * once GitHub Apps is out of preview.
 */
const HEADERS = {
  Accept: 'application/vnd.github.machine-man-preview+json',
};

/**
 * GithubAppManager issues and caches tokens for a specific GitHub App.
 */
class GithubAppManager {
  private readonly appClient: Octokit;
  private readonly baseUrl?: string;
  private readonly baseAuthConfig: { appId: number; privateKey: string };
  private readonly cache = new Cache();
  private readonly allowedInstallationOwners: string[] | undefined; // undefined allows all installations

  constructor(config: GithubAppConfig, baseUrl?: string) {
    this.allowedInstallationOwners = config.allowedInstallationOwners;
    this.baseUrl = baseUrl;
    this.baseAuthConfig = {
      appId: config.appId,
      privateKey: config.privateKey.replace(/\\n/gm, '\n'),
    };
    this.appClient = new Octokit({
      baseUrl,
      headers: HEADERS,
      authStrategy: createAppAuth,
      auth: this.baseAuthConfig,
    });
  }

  async getInstallationCredentials(
    owner: string,
    repo?: string,
  ): Promise<{ accessToken: string | undefined }> {
    if (this.allowedInstallationOwners) {
      if (!this.allowedInstallationOwners?.includes(owner)) {
        return { accessToken: undefined }; // An empty token allows anonymous access to public repos
      }
    }

    // Go and grab an access token for the app scoped to a repository if provided, if not use the organisation installation.
    return this.cache.getOrCreateToken(owner, repo, async () => {
      const { installationId, suspended } =
        await this.getInstallationData(owner);
      if (suspended) {
        throw new Error(`The GitHub application for ${owner} is suspended`);
      }

      const result = await this.appClient.apps.createInstallationAccessToken({
        installation_id: installationId,
        headers: HEADERS,
      });

      let repositoryNames;

      if (result.data.repository_selection === 'selected') {
        const installationClient = new Octokit({
          baseUrl: this.baseUrl,
          auth: result.data.token,
        });
        const repos = await installationClient.paginate(
          installationClient.apps.listReposAccessibleToInstallation,
        );
        // The return type of the paginate method is incorrect.
        const repositories: RestEndpointMethodTypes['apps']['listReposAccessibleToInstallation']['response']['data']['repositories'] =
          repos.repositories ?? repos;

        repositoryNames = repositories.map(repository => repository.name);
      }
      return {
        token: result.data.token,
        expiresAt: DateTime.fromISO(result.data.expires_at),
        repositories: repositoryNames,
      };
    });
  }

  getInstallations(): Promise<
    RestEndpointMethodTypes['apps']['listInstallations']['response']['data']
  > {
    return this.appClient.paginate(this.appClient.apps.listInstallations);
  }

  private async getInstallationData(owner: string): Promise<InstallationData> {
    const allInstallations = await this.getInstallations();
    const installation = allInstallations.find(
      inst =>
        inst.account &&
        'login' in inst.account &&
        inst.account.login?.toLocaleLowerCase('en-US') ===
          owner.toLocaleLowerCase('en-US'),
    );
    if (installation) {
      return {
        installationId: installation.id,
        suspended: Boolean(installation.suspended_by),
      };
    }
    const notFoundError = new Error(
      `No app installation found for ${owner} in ${this.baseAuthConfig.appId}`,
    );
    notFoundError.name = 'NotFoundError';
    throw notFoundError;
  }
}

/**
 * Corresponds to a Github installation which internally could hold several GitHub Apps.
 *
 * @public
 */
export class GithubAppCredentialsMux {
  private readonly apps: GithubAppManager[];

  constructor(config: GithubIntegrationConfig) {
    this.apps =
      config.apps?.map(ac => new GithubAppManager(ac, config.apiBaseUrl)) ?? [];
  }

  async getAllInstallations(): Promise<
    RestEndpointMethodTypes['apps']['listInstallations']['response']['data']
  > {
    if (!this.apps.length) {
      return [];
    }

    const installs = await Promise.all(
      this.apps.map(app => app.getInstallations()),
    );

    return installs.flat();
  }

  async getAppToken(owner: string, repo?: string): Promise<string | undefined> {
    if (this.apps.length === 0) {
      return undefined;
    }

    const results = await Promise.all(
      this.apps.map(app =>
        app.getInstallationCredentials(owner, repo).then(
          credentials => ({ credentials, error: undefined }),
          error => ({ credentials: undefined, error }),
        ),
      ),
    );

    const result = results.find(
      resultItem => resultItem.credentials?.accessToken,
    );
    if (result) {
      return result.credentials!.accessToken;
    }

    const errors = results.map(r => r.error);
    const notNotFoundError = errors.find(err => err?.name !== 'NotFoundError');
    if (notNotFoundError) {
      throw notNotFoundError;
    }

    return undefined;
  }
}

/**
 * Handles the creation and caching of credentials for GitHub integrations.
 *
 * @public
 * @remarks
 *
 * TODO: Possibly move this to a backend only package so that it's not used in the frontend by mistake
 */
export class SingleInstanceGithubCredentialsProvider
  implements GithubCredentialsProvider
{
  static create: (
    config: GithubIntegrationConfig,
  ) => GithubCredentialsProvider = config => {
    return new SingleInstanceGithubCredentialsProvider(
      new GithubAppCredentialsMux(config),
      config.token,
    );
  };

  private constructor(
    private readonly githubAppCredentialsMux: GithubAppCredentialsMux,
    private readonly token?: string,
  ) {}

  /**
   * Returns {@link GithubCredentials} for a given URL.
   *
   * @remarks
   *
   * Consecutive calls to this method with the same URL will return cached
   * credentials.
   *
   * The shortest lifetime for a token returned is 10 minutes.
   *
   * @example
   * ```ts
   * const { token, headers } = await getCredentials({
   *   url: 'github.com/backstage/foobar'
   * })
   * ```
   *
   * @param opts - The organization or repository URL
   * @returns A promise of {@link GithubCredentials}.
   */
  async getCredentials(opts: { url: string }): Promise<GithubCredentials> {
    const parsed = parseGitUrl(opts.url);

    const owner = parsed.owner || parsed.name;
    const repo = parsed.owner ? parsed.name : undefined;

    let type: GithubCredentialType = 'app';
    let token = await this.githubAppCredentialsMux.getAppToken(owner, repo);
    if (!token) {
      type = 'token';
      token = this.token;
    }

    return {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      token,
      type,
    };
  }
}
