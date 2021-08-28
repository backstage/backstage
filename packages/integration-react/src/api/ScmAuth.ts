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

import { OAuthApi } from '@backstage/core-plugin-api';
import {
  ScmAuthApi,
  ScmAuthTokenOptions,
  ScmAuthTokenResponse,
} from './ScmAuthApi';

type ScopeMapping = {
  default: string[];
  repoWrite: string[];
};

class ScmAuthMux implements ScmAuthApi {
  #providers = new Array<ScmAuth>();

  constructor(providers: ScmAuth[]) {
    this.#providers = providers;
  }

  getCredentials(
    options: ScmAuthTokenOptions,
  ): Promise<ScmAuthTokenResponse | undefined> {
    const url = new URL(options.url);
    const provider = this.#providers.find(p => p.isUrlSupported(url));
    if (!provider) {
      throw new Error(
        `No authentication provider available for SCM access to '${options.url}'`,
      );
    }

    return provider.getCredentials(options);
  }
}

export class ScmAuth implements ScmAuthApi {
  static forAuthApi(
    authApi: OAuthApi,
    options: {
      hostname: string;
      scopeMapping: {
        default: string[];
        repoWrite: string[];
      };
    },
  ): ScmAuthApi {
    return new ScmAuth(authApi, options.hostname, options.scopeMapping);
  }

  static forGithub(
    githubAuthApi: OAuthApi,
    options?: {
      hostname?: string;
    },
  ): ScmAuth {
    const hostname = options?.hostname ?? 'github.com';
    return new ScmAuth(githubAuthApi, hostname, {
      default: ['repo', 'read:org', 'read:user'],
      repoWrite: ['repo', 'read:org', 'read:user', 'gist'],
    });
  }

  static forGitlab(
    gitlabAuthApi: OAuthApi,
    options?: {
      hostname?: string;
    },
  ): ScmAuth {
    const hostname = options?.hostname ?? 'gitlab.com';
    return new ScmAuth(gitlabAuthApi, hostname, {
      default: ['read_user', 'read_api', 'read_repository'],
      repoWrite: ['read_user', 'read_api', 'write_repository', 'api'],
    });
  }

  static forAzure(
    microsoftAuthApiRef: OAuthApi,
    options?: {
      hostname?: string;
    },
  ): ScmAuth {
    const hostname = options?.hostname ?? 'dev.azure.com';
    return new ScmAuth(microsoftAuthApiRef, hostname, {
      default: [
        'vso.build',
        'vso.code',
        'vso.graph',
        'vso.project',
        'vso.profile',
      ],
      repoWrite: [
        'vso.build',
        'vso.code_manage',
        'vso.graph',
        'vso.project',
        'vso.profile',
      ],
    });
  }

  static forBitbucket(
    bitbucketAuthApi: OAuthApi,
    options?: {
      hostname?: string;
    },
  ): ScmAuth {
    const hostname = options?.hostname ?? 'bitbucket.org';
    return new ScmAuth(bitbucketAuthApi, hostname, {
      default: ['account', 'team', 'pullrequest', 'snippet', 'issue'],
      repoWrite: [
        'account',
        'team',
        'pullrequest:write',
        'snippet:write',
        'issue:write',
      ],
    });
  }

  static mux(...providers: ScmAuth[]): ScmAuthApi {
    return new ScmAuthMux(providers);
  }

  #api: OAuthApi;
  #hostname: string;
  #scopeMapping: ScopeMapping;

  private constructor(
    api: OAuthApi,
    hostname: string,
    scopeMapping: ScopeMapping,
  ) {
    this.#api = api;
    this.#hostname = hostname;
    this.#scopeMapping = scopeMapping;
  }

  /**
   * Checks whether the implementation is able to provide authentication for the given URL.
   */
  isUrlSupported(url: URL): boolean {
    return url.hostname === this.#hostname;
  }

  async getCredentials(
    options: ScmAuthTokenOptions,
  ): Promise<ScmAuthTokenResponse> {
    const scopes = options.additionalScope?.repoWrite
      ? this.#scopeMapping.repoWrite
      : this.#scopeMapping.default;

    const token = await this.#api.getAccessToken(scopes, {
      instantPopup: options.instantPopup,
      optional: options.optional,
    });
    return {
      token,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
