/*
 * Copyright 2025 The Backstage Authors
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

import {
  coreServices,
  createServiceFactory,
  createServiceRef,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import { durationToMilliseconds, HumanDuration } from '@backstage/types';
import { Octokit } from 'octokit';

export interface OctokitProviderService {
  getOctokit: (url: string) => Promise<Octokit>;
}

class OctokitProviderImpl implements OctokitProviderService {
  readonly #integrations: ScmIntegrationRegistry;
  readonly #githubCredentials: GithubCredentialsProvider;
  readonly #octokitCache: Map<string, Octokit>;
  readonly #octokitCacheTtl: HumanDuration;

  constructor(config: RootConfigService) {
    this.#integrations = ScmIntegrations.fromConfig(config);
    this.#githubCredentials = DefaultGithubCredentialsProvider.fromIntegrations(
      this.#integrations,
    );
    this.#octokitCache = new Map();
    this.#octokitCacheTtl = { hours: 1 };
  }

  async getOctokit(url: string): Promise<Octokit> {
    // TODO(freben): Be smart and cache these more granularly, e.g. by
    // organization or even repo.
    const integration = this.#integrations.github.byUrl(url);
    if (!integration) {
      throw new Error(`No integration found for url: ${url}`);
    }
    const key = integration.config.host;

    if (this.#octokitCache.has(key)) {
      return this.#octokitCache.get(key)!;
    }

    const { createCallbackAuth } = await import('@octokit/auth-callback');

    const octokit = new Octokit({
      baseUrl: integration.config.apiBaseUrl,
      authStrategy: createCallbackAuth,
      auth: {
        callback: async () => {
          try {
            const credentials = await this.#githubCredentials.getCredentials({
              url,
            });
            return credentials.token;
          } catch {
            return undefined;
          }
        },
      },
    });

    this.#octokitCache.set(key, octokit);
    setTimeout(() => {
      this.#octokitCache.delete(key);
    }, durationToMilliseconds(this.#octokitCacheTtl));

    return octokit;
  }
}

/**
 * This will have to live here, until we have a proper shared one in an
 * integrations layer.
 */
export const octokitProviderServiceRef =
  createServiceRef<OctokitProviderService>({
    id: 'octokitProvider',
    scope: 'root',
    defaultFactory: async service =>
      createServiceFactory({
        service,
        deps: { config: coreServices.rootConfig },
        async factory({ config }) {
          return new OctokitProviderImpl(config);
        },
      }),
  });
