/*
 * Copyright 2020 Spotify AB
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
import { AuthProviderRouteHandlers } from '../providers/types';
import { NotFoundError } from '@backstage/backend-common';

export type EnvironmentHandlers = {
  [key: string]: AuthProviderRouteHandlers;
};

export class EnvironmentHandler implements AuthProviderRouteHandlers {
  constructor(private readonly providers: EnvironmentHandlers) {}

  private getProviderForEnv(req: express.Request): AuthProviderRouteHandlers {
    const env = req.query.env?.toString();
    if (!this.providers.hasOwnProperty(env)) {
      throw new NotFoundError(
        `No environment for ${env} found in this provider`,
      );
    }
    return this.providers[env];
  }

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
    if (provider.refresh) {
      await provider.refresh(req, res);
    }
  }

  async logout(req: express.Request, res: express.Response): Promise<void> {
    const provider = this.getProviderForEnv(req);
    await provider.logout(req, res);
  }
}
