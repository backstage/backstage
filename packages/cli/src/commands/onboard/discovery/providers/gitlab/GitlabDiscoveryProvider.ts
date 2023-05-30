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
  DefaultGitlabCredentialsProvider,
  GitlabCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import fetch from 'node-fetch';
import { Provider } from '../types';
import { GitlabProject, ProjectResponse } from './GitlabProject';

export class GitlabDiscoveryProvider implements Provider {
  readonly #envToken: string | undefined;
  readonly #scmIntegrations: ScmIntegrations;
  readonly #credentialsProvider: GitlabCredentialsProvider;

  static fromConfig(config: Config): GitlabDiscoveryProvider {
    const envToken = process.env.GITLAB_TOKEN || undefined;
    const scmIntegrations = ScmIntegrations.fromConfig(config);
    const credentialsProvider =
      DefaultGitlabCredentialsProvider.fromIntegrations(scmIntegrations);

    return new GitlabDiscoveryProvider(
      envToken,
      scmIntegrations,
      credentialsProvider,
    );
  }

  private constructor(
    envToken: string | undefined,
    integrations: ScmIntegrations,
    credentialsProvider: GitlabCredentialsProvider,
  ) {
    this.#envToken = envToken;
    this.#scmIntegrations = integrations;
    this.#credentialsProvider = credentialsProvider;
  }

  name(): string {
    return 'GitLab';
  }

  async discover(url: string): Promise<false | GitlabProject[]> {
    const { origin, pathname } = new URL(url);
    const [, user] = pathname.split('/');

    const scmIntegration = this.#scmIntegrations.gitlab.byUrl(origin);
    if (!scmIntegration) {
      throw new Error(`No GitLab integration found for ${origin}`);
    }

    const headers = await this.#getRequestHeaders(origin);

    const response = await fetch(
      `${scmIntegration.config.apiBaseUrl}/users/${user}/projects`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const projects: ProjectResponse[] = await response.json();

    return projects.map(
      project =>
        new GitlabProject(project, scmIntegration.config.apiBaseUrl, headers),
    );
  }

  async #getRequestHeaders(url: string): Promise<Record<string, string>> {
    const credentials = await this.#credentialsProvider.getCredentials({
      url,
    });

    if (credentials.headers) {
      return credentials.headers;
    } else if (credentials.token) {
      return { authorization: `Bearer ${credentials.token}` };
    }

    if (this.#envToken) {
      return { authorization: `Bearer ${this.#envToken}` };
    }

    throw new Error(
      'No token available for GitLab, please set a GITLAB_TOKEN env variable',
    );
  }
}
