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
import { InputError } from '@backstage/errors';
import { Logger } from 'winston';
import express, { Router } from 'express';
import { VaultClient } from './vaultApi';
import { TaskRunner, PluginTaskScheduler } from '@backstage/backend-tasks';

/**
 * Environment values needed by the VaultBuilder
 * @public
 */
export interface VaultEnvironment {
  logger: Logger;
  config: Config;
  scheduler: PluginTaskScheduler;
}

/**
 * The object returned by the VaultBuilder.build() function
 * @public
 */
export type VaultBuilderReturn = {
  router: express.Router;
};

/**
 * Implementation for Vault. It creates the routing and initializes the backend
 * to allow the use of the Vault's frontend plugin.
 * @public
 */
export class VaultBuilder {
  private vaultClient?: VaultClient;

  /**
   * Creates a new instance of the VaultBuilder.
   *
   * @param env - The backstage environment
   * @returns A new instance of the VaultBuilder
   */
  static createBuilder(env: VaultEnvironment) {
    return new VaultBuilder(env);
  }
  constructor(protected readonly env: VaultEnvironment) {}

  /**
   * Builds the routes for Vault.
   *
   * @returns The router configured for Vault
   */
  public build(): VaultBuilderReturn {
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

    return {
      router: router,
    };
  }

  /**
   * Overwrites the current vault client.
   *
   * @param vaultClient - The new Vault client
   * @returns
   */
  public setVaultClient(vaultClient: VaultClient) {
    this.vaultClient = vaultClient;
    return this;
  }

  /**
   * Enables the token renewal for Vault.
   *
   * @param schedule - The TaskRunner used to schedule the renewal, if not set, renewing hourly
   * @returns
   */
  public async enableTokenRenew(schedule?: TaskRunner) {
    const taskRunner = schedule
      ? schedule
      : this.env.scheduler.createScheduledTaskRunner({
          frequency: { hours: 1 },
          timeout: { hours: 1 },
        });
    await taskRunner.run({
      id: 'refresh-vault-token',
      fn: async () => {
        this.env.logger.info('Renewing Vault token');
        const vaultClient = this.vaultClient ?? new VaultClient(this.env);
        await vaultClient.renewToken();
      },
    });
    return this;
  }

  /**
   * Builds the backend routes for Vault.
   *
   * @param vaultClient - The Vault client used to list the secrets.
   * @returns The generated backend router
   */
  protected buildRouter(vaultClient: VaultClient): express.Router {
    const router = Router();
    router.use(express.json());

    router.get('/health', (_, res) => {
      res.json({ status: 'ok' });
    });

    router.get('/v1/secrets/:path', async (req, res) => {
      const { path } = req.params;
      if (typeof path !== 'string') {
        throw new InputError(`Invalid path: ${path}`);
      }

      const secrets = await vaultClient.listSecrets(path);
      res.json({ items: secrets });
    });

    return router;
  }
}
