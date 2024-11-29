/*
 * Copyright 2020 The Backstage Authors
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

import express from 'express';
import { Config } from '@backstage/config';
import { InputError, NotFoundError } from '@backstage/errors';
import { AuthProviderRouteHandlers } from '../types';
import { decodeOAuthState } from './state';

/** @public */
export class OAuthEnvironmentHandler implements AuthProviderRouteHandlers {
  static mapConfig(
    config: Config,
    factoryFunc: (envConfig: Config) => AuthProviderRouteHandlers,
  ) {
    const envs = config.keys();
    const handlers = new Map<string, AuthProviderRouteHandlers>();

    for (const env of envs) {
      const envConfig = config.getConfig(env);
      const handler = factoryFunc(envConfig);
      handlers.set(env, handler);
    }

    return new OAuthEnvironmentHandler(handlers);
  }

  constructor(
    private readonly handlers: Map<string, AuthProviderRouteHandlers>,
  ) {}

  async start(req: express.Request, res: express.Response): Promise<void> {
    const provider = this.getProviderForEnv(req);
    await provider.start(req, res);
  }

  async frameHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    const provider = this.getProviderForEnv(req);
    await provider.frameHandler(req, res);
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    const provider = this.getProviderForEnv(req);
    await provider.refresh?.(req, res);
  }

  async logout(req: express.Request, res: express.Response): Promise<void> {
    const provider = this.getProviderForEnv(req);
    await provider.logout?.(req, res);
  }

  private getEnvFromRequest(req: express.Request): string | undefined {
    const reqEnv = req.query.env?.toString();
    if (reqEnv) {
      return reqEnv;
    }
    const stateParams = req.query.state?.toString();
    if (!stateParams) {
      return undefined;
    }
    const { env } = decodeOAuthState(stateParams);
    return env;
  }

  private getProviderForEnv(req: express.Request): AuthProviderRouteHandlers {
    const env: string | undefined = this.getEnvFromRequest(req);

    if (!env) {
      throw new InputError(`Must specify 'env' query to select environment`);
    }

    const handler = this.handlers.get(env);
    if (!handler) {
      throw new NotFoundError(
        `No configuration available for the '${env}' environment of this provider.`,
      );
    }

    return handler;
  }
}
