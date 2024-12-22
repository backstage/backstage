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

import express from 'express';
import Router from 'express-promise-router';
import { IncrementalIngestionDatabaseManager } from '../database/IncrementalIngestionDatabaseManager';
import { LoggerService } from '@backstage/backend-plugin-api';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { Config } from '@backstage/config';

export class IncrementalProviderRouter {
  private manager: IncrementalIngestionDatabaseManager;
  private logger: LoggerService;
  private config: Config;

  constructor(
    manager: IncrementalIngestionDatabaseManager,
    logger: LoggerService,
    config: Config,
  ) {
    this.manager = manager;
    this.logger = logger;
    this.config = config;
  }

  createRouter(): express.Router {
    const router = Router();
    router.use(express.json());

    // Get the overall health of all incremental providers
    router.get('/incremental/health', async (_, res) => {
      const records = await this.manager.healthcheck();
      const providers = records.map(record => record.provider_name);
      const duplicates = [
        ...new Set(providers.filter((e, i, a) => a.indexOf(e) !== i)),
      ];

      if (duplicates.length > 0) {
        res.json({ healthy: false, duplicateIngestions: duplicates });
      } else {
        res.json({ healthy: true });
      }
    });

    // Clean up and pause all providers
    router.post('/incremental/cleanup', async (_, res) => {
      const result = await this.manager.cleanupProviders();
      res.json(result);
    });

    // Get basic status of the provider
    router.get('/incremental/providers/:provider', async (req, res) => {
      const { provider } = req.params;
      const record = await this.manager.getCurrentIngestionRecord(provider);
      if (record) {
        res.json({
          success: true,
          status: {
            current_action: record.status,
            next_action_at: new Date(record.next_action_at),
          },
          last_error: record.last_error,
        });
      } else {
        const providers: string[] = await this.manager.listProviders();
        if (providers.includes(provider)) {
          res.json({
            success: true,
            status: {
              current_action: 'rest complete, waiting to start',
            },
          });
        } else {
          this.logger.error(
            `${provider} - No ingestion record found in the database!`,
          );
          res.status(404).json({
            success: false,
            status: {},
            last_error: `Provider '${provider}' not found`,
          });
        }
      }
    });

    // Trigger the provider's next action
    router.post(
      `/incremental/providers/:provider/trigger`,
      async (req, res) => {
        const { provider } = req.params;
        const record = await this.manager.getCurrentIngestionRecord(provider);
        if (record) {
          await this.manager.triggerNextProviderAction(provider);
          res.json({
            success: true,
            message: `${provider}: Next action triggered.`,
          });
        } else {
          const providers: string[] = await this.manager.listProviders();
          if (providers.includes(provider)) {
            this.logger.debug(`${provider} - Ingestion record found`);
            res.json({
              success: true,
              message: 'Unable to trigger next action (provider is restarting)',
            });
          } else {
            res.status(404).json({
              success: false,
              message: `Provider '${provider}' not found`,
            });
          }
        }
      },
    );

    // Start a brand-new ingestion cycle for the provider.
    // (Cancel's the current run if active, or marks it complete if resting)
    router.post(`/incremental/providers/:provider/start`, async (req, res) => {
      const { provider } = req.params;

      const record = await this.manager.getCurrentIngestionRecord(provider);
      if (record) {
        const ingestionId = record.id;
        if (record.status === 'resting') {
          await this.manager.setProviderComplete(ingestionId);
        } else {
          await this.manager.setProviderCanceling(ingestionId);
        }
        res.json({
          success: true,
          message: `${provider}: Next cycle triggered.`,
        });
      } else {
        const providers: string[] = await this.manager.listProviders();
        if (providers.includes(provider)) {
          this.logger.debug(`${provider} - Ingestion record found`);
          res.json({
            success: true,
            message: 'Provider is already restarting',
          });
        } else {
          res.status(404).json({
            success: false,
            message: `Provider '${provider}' not found`,
          });
        }
      }
    });

    router.get(`/incremental/providers`, async (_req, res) => {
      const providers = await this.manager.listProviders();

      res.json({
        success: true,
        providers,
      });
    });

    // Stop the provider and pause it for 24 hours
    router.post(`/incremental/providers/:provider/cancel`, async (req, res) => {
      const { provider } = req.params;
      const record = await this.manager.getCurrentIngestionRecord(provider);
      if (record) {
        const next_action_at = new Date();
        next_action_at.setTime(next_action_at.getTime() + 24 * 60 * 60 * 1000);
        await this.manager.updateByName(provider, {
          next_action: 'nothing (done)',
          ingestion_completed_at: new Date(),
          next_action_at,
          status: 'resting',
        });
        res.json({
          success: true,
          message: `${provider}: Current ingestion canceled.`,
        });
      } else {
        const providers: string[] = await this.manager.listProviders();
        if (providers.includes(provider)) {
          this.logger.debug(`${provider} - Ingestion record found`);
          res.json({
            success: true,
            message: 'Provider is currently restarting, please wait.',
          });
        } else {
          res.status(404).json({
            success: false,
            message: `Provider '${provider}' not found`,
          });
        }
      }
    });

    // Wipe out all ingestion records for the provider and pause for 24 hours
    router.delete('/incremental/providers/:provider', async (req, res) => {
      const { provider } = req.params;
      const result = await this.manager.purgeAndResetProvider(provider);
      res.json(result);
    });

    // Get the ingestion marks for the current cycle
    router.get(`/incremental/providers/:provider/marks`, async (req, res) => {
      const { provider } = req.params;
      const record = await this.manager.getCurrentIngestionRecord(provider);
      if (record) {
        const id = record.id;
        const records = await this.manager.getAllMarks(id);
        res.json({ success: true, records });
      } else {
        const providers: string[] = await this.manager.listProviders();
        if (providers.includes(provider)) {
          this.logger.debug(`${provider} - Ingestion record found`);
          res.json({
            success: true,
            message: 'No records yet (provider is restarting)',
          });
        } else {
          this.logger.error(
            `${provider} - No ingestion record found in the database!`,
          );
          res.status(404).json({
            success: false,
            status: {},
            last_error: `Provider '${provider}' not found`,
          });
        }
      }
    });

    router.delete(
      `/incremental/providers/:provider/marks`,
      async (req, res) => {
        const { provider } = req.params;
        const deletions = await this.manager.clearFinishedIngestions(provider);

        res.json({
          success: true,
          message: `Expired marks for provider '${provider}' removed.`,
          deletions,
        });
      },
    );

    const middleware = MiddlewareFactory.create({
      logger: this.logger,
      config: this.config,
    });
    router.use(middleware.error());

    return router;
  }
}
