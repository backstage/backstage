/*
 * Copyright 2022 The Backstage Authors
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
import { Logger } from 'winston';
import express, { Router } from 'express';
import { Duration } from 'luxon';
import { VaultClient } from './vaultApi';
import { runPeriodically } from './runPeriodically';

export interface VaultEnvironment {
  logger: Logger;
  config: Config;
}

export type VaultBuilderReturn = Promise<{
  router: express.Router;
}>;

export class VaultBuilder {
  private vaultTokenRefreshInterval: Duration = Duration.fromObject({
    minutes: 60,
  });
  private vaultClient?: VaultClient;

  static createBuilder(env: VaultEnvironment) {
    return new VaultBuilder(env);
  }
  constructor(protected readonly env: VaultEnvironment) {}

  public async build(): VaultBuilderReturn {
    const { logger, config } = this.env;

    logger.info('Initializing Vault backend');

    if (!config.has('vault')) {
      logger.warn(
        'Failed to initialize Vault backend: vault config is missing',
      );
      return {
        router: Router(),
      };
    }

    this.vaultClient = this.vaultClient ?? new VaultClient(this.env);

    const router = this.buildRouter(this.vaultClient);

    await this.renewToken(this.vaultClient);

    return {
      router: router,
    };
  }

  public setVaultClient(vaultClient: VaultClient) {
    this.vaultClient = vaultClient;
    return this;
  }

  public setVaultTokenRefreshInterval(refreshInterval: Duration) {
    this.vaultTokenRefreshInterval = refreshInterval;
    return this;
  }

  public enableTokenRenew() {
    runPeriodically(async () => {
      this.env.logger.info('Renewing Vault token');
      const vaultClient = this.vaultClient ?? new VaultClient(this.env);
      await this.renewToken(vaultClient);
    }, this.vaultTokenRefreshInterval.toMillis());
    return this;
  }

  protected async renewToken(vaultClient: VaultClient) {
    const result = await vaultClient.renewToken();
    if (!result) {
      this.env.logger.warn('Error renewing vault token');
    } else {
      this.env.logger.info('Vault token renewed');
    }
  }

  protected buildRouter(vaultClient: VaultClient): express.Router {
    const router = Router();
    router.use(express.json());

    router.get('/v1/secrets', async (req, res) => {
      const path = req.query.path;
      if (typeof path !== 'string') {
        res
          .status(400)
          .send('Something was unexpected about the path query string');

        return;
      }

      const secrets = await vaultClient.listSecrets(path);
      res.json(secrets);
    });

    return router;
  }
}
