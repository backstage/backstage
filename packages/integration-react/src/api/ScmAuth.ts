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

import {
  createApiFactory,
  githubAuthApiRef,
  gitlabAuthApiRef,
  microsoftAuthApiRef,
  OAuthApi,
} from '@backstage/core-plugin-api';
import {
  ScmAuthApi,
  scmAuthApiRef,
  ScmAuthTokenOptions,
  ScmAuthTokenResponse,
} from './ScmAuthApi';

type ScopeMapping = {
  /** The base scopes used for all requests */
  default: string[];
  /** Additional scopes added if `repoWrite` is requested */
  repoWrite: string[];
};

class ScmAuthMux implements ScmAuthApi {
  #providers = new Array<ScmAuth>();

  constructor(providers: ScmAuth[]) {
    this.#providers = providers;
  }

  async getCredentials(
    options: ScmAuthTokenOptions,
  ): Promise<ScmAuthTokenResponse> {
    const url = new URL(options.url);
    const provider = this.#providers.find(p => p.isUrlSupported(url));
    if (!provider) {
      throw new Error(
        `No authentication provider available for access to '${options.url}'`,
      );
    }

    return provider.getCredentials(options);
  }
}

/**
 * An implementation of the ScmAuthApi that merges together OAuthApi instances
 * to form a single instance that can handles authentication for multiple providers.
 */
export class ScmAuth implements ScmAuthApi {
  static createDefaultApiFactory() {
    return createApiFactory({
      api: scmAuthApiRef,
      deps: {
        github: githubAuthApiRef,
        gitlab: gitlabAuthApiRef,
        azure: microsoftAuthApiRef,
      },
      factory: ({ github, gitlab, azure }) =>
        ScmAuth.merge(
          ScmAuth.forGithub(github),
          ScmAuth.forGitlab(gitlab),
          ScmAuth.forAzure(azure),
        ),
    });
  }

  /**
   * Creates a general purpose ScmAuth instance with a custom scope mapping.
   */
  static forAuthApi(
    authApi: OAuthApi,
    options: {
      host: string;
      scopeMapping: {
        default: string[];
        repoWrite: string[];
      };
    },
  ): ScmAuth {
    return new ScmAuth(authApi, options.host, options.scopeMapping);
  }

  /**
   * Creates a new ScmAuth instance that handles authentication towards GitHub.
   *
   * The host option determines which URLs that are handled by this instance and defaults to `github.com`.
   *
   * The default scopes are:
   *
   * `repo read:org read:user`
   *
   * If the additional `repoWrite` permission is requested, these scopes are added:
   *
   * `gist`
   */
  static forGithub(
    githubAuthApi: OAuthApi,
    options?: {
      host?: string;
    },
  ): ScmAuth {
    const host = options?.host ?? 'github.com';
    return new ScmAuth(githubAuthApi, host, {
      default: ['repo', 'read:org', 'read:user'],
      repoWrite: ['gist'],
    });
  }

  /**
   * Creates a new ScmAuth instance that handles authentication towards GitLab.
   *
   * The host option determines which URLs that are handled by this instance and defaults to `gitlab.com`.
   *
   * The default scopes are:
   *
   * `read_user read_api read_repository`
   *
   * If the additional `repoWrite` permission is requested, these scopes are added:
   *
   * `write_repository api`
   */
  static forGitlab(
    gitlabAuthApi: OAuthApi,
    options?: {
      host?: string;
    },
  ): ScmAuth {
    const host = options?.host ?? 'gitlab.com';
    return new ScmAuth(gitlabAuthApi, host, {
      default: ['read_user', 'read_api', 'read_repository'],
      repoWrite: ['write_repository', 'api'],
    });
  }

  /**
   * Creates a new ScmAuth instance that handles authentication towards Azure.
   *
   * The host option determines which URLs that are handled by this instance and defaults to `dev.azure.com`.
   *
   * The default scopes are:
   *
   * `vso.build vso.code vso.graph vso.project vso.profile`
   *
   * If the additional `repoWrite` permission is requested, these scopes are added:
   *
   * `vso.code_manage`
   */
  static forAzure(
    microsoftAuthApi: OAuthApi,
    options?: {
      host?: string;
    },
  ): ScmAuth {
    const host = options?.host ?? 'dev.azure.com';
    return new ScmAuth(microsoftAuthApi, host, {
      default: [
        'vso.build',
        'vso.code',
        'vso.graph',
        'vso.project',
        'vso.profile',
      ],
      repoWrite: ['vso.code_manage'],
    });
  }

  /**
   * Creates a new ScmAuth instance that handles authentication towards Bitbucket.
   *
   * The host option determines which URLs that are handled by this instance and defaults to `bitbucket.org`.
   *
   * The default scopes are:
   *
   * `account team pullrequest snippet issue`
   *
   * If the additional `repoWrite` permission is requested, these scopes are added:
   *
   * `pullrequest:write snippet:write issue:write`
   */
  static forBitbucket(
    bitbucketAuthApi: OAuthApi,
    options?: {
      host?: string;
    },
  ): ScmAuth {
    const host = options?.host ?? 'bitbucket.org';
    return new ScmAuth(bitbucketAuthApi, host, {
      default: ['account', 'team', 'pullrequest', 'snippet', 'issue'],
      repoWrite: ['pullrequest:write', 'snippet:write', 'issue:write'],
    });
  }

  /**
   * Merges together multiple ScmAuth instances into one that
   * routes requests to the correct instance based on the URL.
   */
  static merge(...providers: ScmAuth[]): ScmAuthApi {
    return new ScmAuthMux(providers);
  }

  #api: OAuthApi;
  #host: string;
  #scopeMapping: ScopeMapping;

  private constructor(api: OAuthApi, host: string, scopeMapping: ScopeMapping) {
    this.#api = api;
    this.#host = host;
    this.#scopeMapping = scopeMapping;
  }

  /**
   * Checks whether the implementation is able to provide authentication for the given URL.
   */
  isUrlSupported(url: URL): boolean {
    return url.host === this.#host;
  }

  async getCredentials(
    options: ScmAuthTokenOptions,
  ): Promise<ScmAuthTokenResponse> {
    const { url, additionalScope, ...restOptions } = options;

    const scopes = this.#scopeMapping.default.slice();
    if (additionalScope?.repoWrite) {
      scopes.push(...this.#scopeMapping.repoWrite);
    }

    const token = await this.#api.getAccessToken(scopes, restOptions);
    return {
      token,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
