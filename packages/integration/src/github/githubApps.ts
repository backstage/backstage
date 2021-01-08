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

import { GithubAppConfig, GitHubIntegrationConfig } from './config';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import gitUrlParse from 'git-url-parse';
import moment from 'moment';

type InstallationData = {
  installationId: number;
  suspended: boolean;
  repositorySelection: 'selected' | 'all';
};

// GithubAppManager issues tokens for a speicifc GitHub App
class GithubAppManager {
  private readonly appClient: Octokit;
  private readonly baseAuthConfig: { appId: number; privateKey: string };
  private readonly installationDatas = new Map<string, InstallationData>();
  private readonly tokenCache = new Map<
    string,
    { accessToken: string; exp: Date }
  >();

  private installationsEtag?: string;

  constructor(config: GithubAppConfig) {
    this.baseAuthConfig = {
      appId: config.appId,
      privateKey: config.privateKey,
    };
    this.appClient = new Octokit({
      authStrategy: createAppAuth,
      auth: this.baseAuthConfig,
    });
  }

  private lessThanOneHourAgo = (date: Date) =>
    moment(date).isAfter(moment().subtract(1, 'hours'));

  async getInstallationCredentials(
    owner: string,
    repo: string,
  ): Promise<{ accessToken: string }> {
    const {
      installationId,
      suspended,
      repositorySelection,
    } = await this.getInstallationData(owner);
    if (suspended) {
      throw new Error(`The app for ${owner}/${repo} is suspended`);
    }

    // App is installed in the entire org
    if (repositorySelection === 'all') {
      const auth = createAppAuth({ ...this.baseAuthConfig, installationId });
      const { token } = await auth({ type: 'installation' });
      return { accessToken: token };
    }

    // App is not installed org wide which requires a specific app token.
    const cacheKey = `${owner}/${repo}`;
    if (this.tokenCache.has(cacheKey)) {
      const item = this.tokenCache.get(cacheKey);
      if (this.lessThanOneHourAgo(item?.exp!)) {
        return {
          accessToken: item?.accessToken!,
        };
      }
    }

    const res = await this.appClient.apps.createInstallationAccessToken({
      installation_id: installationId,
      repositories: [repo],
    });
    this.tokenCache.set(cacheKey, {
      accessToken: res.data.token,
      exp: new Date(res.data.expires_at),
    });
    return { accessToken: res.data.token };
  }

  private async getInstallationData(owner: string): Promise<InstallationData> {
    // List all installations using the last used etag.
    // Return cached InstallationData if error with status 304 is thrown.
    try {
      const installations = await this.appClient.apps.listInstallations({
        headers: {
          'If-None-Match': this.installationsEtag,
        },
      });
      this.installationsEtag = installations.headers.etag;

      const installation = installations.data.find(
        inst => inst.account?.login === owner,
      );

      if (installation) {
        const data = {
          installationId: installation.id,
          suspended: Boolean(installation.suspended_by),
          repositorySelection: installation.repository_selection,
        };
        this.installationDatas.set(owner, data);
        return data;
      }
    } catch (error) {
      if (error.status !== 304) {
        throw error;
      }
      const data = this.installationDatas.get(owner);
      if (data) {
        return data;
      }
    }

    const notFoundError = new Error(
      `No app installation found for ${owner} in ${this.baseAuthConfig.appId}`,
    );
    notFoundError.name = 'NotFoundError';
    throw notFoundError;
  }
}

// GithubIntegration corresponds to a Github installation which internally could hold several GitHub Apps.
class GithubIntegration {
  private readonly apps: GithubAppManager[];

  constructor(config: GitHubIntegrationConfig) {
    this.apps = config.apps?.map(ac => new GithubAppManager(ac)) ?? [];
  }

  async getCredentialsForAppInstallation(
    owner: string,
    repo: string,
  ): Promise<{ accessToken: string }> {
    const results = await Promise.all(
      this.apps.map(app =>
        app.getInstallationCredentials(owner, repo).then(
          credentials => ({ credentials, error: undefined }),
          error => ({ credentials: undefined, error }),
        ),
      ),
    );
    const result = results.find(result => result.credentials);
    if (result) {
      return result.credentials!;
    }

    const errors = results.map(r => r.error);
    const notNotFoundError = errors.find(err => err.name !== 'NotFoundError');
    if (notNotFoundError) {
      throw notNotFoundError;
    }
    const notFoundError = new Error(
      `No app installation found for ${owner}/${repo}`,
    );
    notFoundError.name = 'NotFoundError';
    throw notFoundError;
  }
}

export class GithubAppAuthProvider {
  private readonly integrations: Map<string, GithubIntegration>;

  constructor(configs: GitHubIntegrationConfig[]) {
    this.integrations = new Map(
      configs.map(config => [config.host, new GithubIntegration(config)]),
    );
  }

  // getCredentials('github.com/backstage/somerepo')
  async getCredentials(url: string): Promise<{ accessToken: string }> {
    const parsed = gitUrlParse(url);

    const host = parsed.source;
    const owner = parsed.owner;
    const repo = parsed.name;

    const integration = await this.integrations.get(host);
    const credentials = await integration?.getCredentialsForAppInstallation(
      owner,
      repo,
    );
    if (!credentials) {
      throw new Error(`No app installation found for ${owner}/${repo}`);
    }
    return credentials;
  }
}
