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

type Provider = {
  api: ScmAuthApi;
  predicate: (url: URL) => boolean;
};

class OAuthApiWrapper {
  constructor(
    private readonly oauthApi: OAuthApi,
    private readonly scopeMapping: {
      [scope in keyof Required<ScmAuthTokenOptions['scope']>]: string[];
    },
  ) {}

  async getCredentials(
    options: ScmAuthTokenOptions,
  ): Promise<ScmAuthTokenResponse> {
    const scopes = Object.entries(options.scope).flatMap(
      ([scope, requested]) => {
        if (requested) {
          return this.scopeMapping[scope as keyof ScmAuthTokenOptions['scope']];
        }
        return [];
      },
    );
    const token = await this.oauthApi.getAccessToken(scopes, {
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

export class ScmAuthMux implements ScmAuthApi {
  static fromProviders(providers: Provider[]): ScmAuthMux {
    return new ScmAuthMux(providers);
  }

  static fromAuthApi(
    authApi: OAuthApi,
    options: {
      scopeMapping: {
        [scope in keyof Required<ScmAuthTokenOptions['scope']>]: string[];
      };
    },
  ): ScmAuthApi {
    return new OAuthApiWrapper(authApi, options.scopeMapping);
  }

  static providerForGithub(
    githubAuthApi: OAuthApi,
    options?: {
      hostname?: string;
    },
  ): Provider {
    const hostname = options?.hostname ?? 'github.com';
    return {
      api: this.fromAuthApi(githubAuthApi, {
        scopeMapping: {
          repoRead: ['repo'],
          repoWrite: ['repo'],
        },
      }),
      predicate: url => url.hostname === hostname,
    };
  }

  private constructor(private readonly providers: Provider[]) {}

  getCredentials(
    options: ScmAuthTokenOptions,
  ): Promise<ScmAuthTokenResponse | undefined> {
    const url = new URL(options.url);
    const provider = this.providers.find(p => p.predicate(url));
    if (!provider) {
      throw new Error(
        `No authentication provider available for SCM access to '${options.url}'`,
      );
    }

    return provider.api.getCredentials(options);
  }
}
