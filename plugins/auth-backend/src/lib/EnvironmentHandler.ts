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

export type EnvironmentHandlers = {
  [key: string]: AuthProviderRouteHandlers;
};

export class EnvironmentHandler implements AuthProviderRouteHandlers {
  constructor(
    private readonly providerId: string,
    private readonly providers: EnvironmentHandlers,
    private readonly envIdentifier: (req: express.Request) => string,
  ) {}

  private getProviderForEnv(
    req: express.Request,
    res: express.Response,
  ): AuthProviderRouteHandlers | undefined {
    const env: string = this.envIdentifier(req);

    if (env && this.providers.hasOwnProperty(env)) {
      return this.providers[env];
    }

    res.status(404).send(
      `Missing configuration.
<br>
<br>
For this flow to work you need to supply a valid configuration for the "${env}" environment of the "${this.providerId}" provider.`,
    );
    return undefined;
  }

  async start(req: express.Request, res: express.Response): Promise<void> {
    const provider = this.getProviderForEnv(req, res);
    await provider?.start(req, res);
  }

  async frameHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    const provider = this.getProviderForEnv(req, res);
    await provider?.frameHandler(req, res);
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    const provider = this.getProviderForEnv(req, res);
    await provider?.refresh?.(req, res);
  }

  async logout(req: express.Request, res: express.Response): Promise<void> {
    const provider = this.getProviderForEnv(req, res);
    await provider?.logout?.(req, res);
  }
}
