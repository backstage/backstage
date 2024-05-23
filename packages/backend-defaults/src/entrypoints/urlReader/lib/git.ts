/*
 * Copyright 2024 The Backstage Authors
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

import fs from 'fs-extra';
import isomorphicGit, { ProgressCallback, AuthCallback } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Configure static credential for authentication
 *
 * @public
 */
export type StaticAuthOptions = {
  username?: string;
  password?: string;
  token?: string;
  logger?: LoggerService;
};

/**
 * Configure an authentication callback that can provide credentials on demand
 *
 * @public
 */
export type AuthCallbackOptions = {
  onAuth: AuthCallback;
  logger?: LoggerService;
};

function isAuthCallbackOptions(
  options: StaticAuthOptions | AuthCallbackOptions,
): options is AuthCallbackOptions {
  return 'onAuth' in options;
}

/*
provider          username         password
Azure             'notempty'       token
Bitbucket Cloud   'x-token-auth'   token
Bitbucket Server  username         password or token
GitHub            'x-access-token' token
GitLab            'oauth2'         token

From : https://isomorphic-git.org/docs/en/onAuth with fix for GitHub

Or token provided as `token` for Bearer auth header
instead of Basic Auth (e.g., Bitbucket Server).
*/
/**
 * A convenience wrapper around the `isomorphic-git` library.
 *
 * @public
 */
export class Git {
  private readonly headers: {
    [x: string]: string;
  };

  private constructor(
    private readonly config: {
      onAuth: AuthCallback;
      token?: string;
      logger?: LoggerService;
    },
  ) {
    this.onAuth = config.onAuth;

    this.headers = {
      'user-agent': 'git/@isomorphic-git',
      ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
    };
  }

  /** https://isomorphic-git.org/docs/en/clone */
  async clone(options: {
    url: string;
    dir: string;
    ref?: string;
    depth?: number;
    noCheckout?: boolean;
  }): Promise<void> {
    const { url, dir, ref, depth, noCheckout } = options;
    this.config.logger?.info(`Cloning repo {dir=${dir},url=${url}}`);

    try {
      return await isomorphicGit.clone({
        fs,
        http,
        url,
        dir,
        ref,
        singleBranch: true,
        depth: depth ?? 1,
        noCheckout,
        onProgress: this.onProgressHandler(),
        headers: this.headers,
        onAuth: this.onAuth,
      });
    } catch (ex) {
      this.config.logger?.error(`Failed to clone repo {dir=${dir},url=${url}}`);
      if (ex.data) {
        throw new Error(`${ex.message} {data=${JSON.stringify(ex.data)}}`);
      }
      throw ex;
    }
  }

  private onAuth: AuthCallback;

  private onProgressHandler = (): ProgressCallback => {
    let currentPhase = '';

    return event => {
      if (currentPhase !== event.phase) {
        currentPhase = event.phase;
        this.config.logger?.info(event.phase);
      }
      const total = event.total
        ? `${Math.round((event.loaded / event.total) * 100)}%`
        : event.loaded;
      this.config.logger?.debug(`status={${event.phase},total={${total}}}`);
    };
  };

  static fromAuth = (options: StaticAuthOptions | AuthCallbackOptions) => {
    if (isAuthCallbackOptions(options)) {
      const { onAuth, logger } = options;
      return new Git({ onAuth, logger });
    }

    const { username, password, token, logger } = options;
    return new Git({ onAuth: () => ({ username, password }), token, logger });
  };
}
