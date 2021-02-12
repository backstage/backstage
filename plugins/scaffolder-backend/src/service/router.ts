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

import { Config } from '@backstage/config';
import Docker from 'dockerode';
import express from 'express';
import { resolve as resolvePath } from 'path';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  JobProcessor,
  PreparerBuilder,
  TemplaterBuilder,
  TemplaterValues,
  PublisherBuilder,
  parseLocationAnnotation,
  joinGitUrlPath,
  FilePreparer,
} from '../scaffolder';
import { CatalogEntityClient } from '../lib/catalog';
import { validate, ValidatorResult } from 'jsonschema';
import parseGitUrl from 'git-url-parse';
import {
  DatabaseTaskStore,
  StorageTaskBroker,
  TaskWorker,
} from '../scaffolder/tasks';
import {
  TemplateActionRegistry,
  templateEntityToSpec,
} from '../scaffolder/tasks/TemplateConverter';
import { registerLegacyActions } from '../scaffolder/stages/legacy';
import { getWorkingDirectory } from './helpers';
import { PluginDatabaseManager } from '@backstage/backend-common';

export interface RouterOptions {
  preparers: PreparerBuilder;
  templaters: TemplaterBuilder;
  publishers: PublisherBuilder;

  logger: Logger;
  config: Config;
  dockerClient: Docker;
  entityClient: CatalogEntityClient;
  database: PluginDatabaseManager;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const {
    preparers,
    templaters,
    publishers,
    logger: parentLogger,
    config,
    dockerClient,
    entityClient,
    database,
  } = options;

  const logger = parentLogger.child({ plugin: 'scaffolder' });
  const workingDirectory = await getWorkingDirectory(config, logger);
  const jobProcessor = await JobProcessor.fromConfig({ config, logger });

  const databaseTaskStore = await DatabaseTaskStore.create(
    await database.getClient(),
  );
  const taskBroker = new StorageTaskBroker(databaseTaskStore, logger);
  const actionRegistry = new TemplateActionRegistry();
  const worker = new TaskWorker({
    logger,
    taskBroker,
    actionRegistry,
    workingDirectory,
  });

  registerLegacyActions(actionRegistry, {
    dockerClient,
    preparers,
    publishers,
    templaters,
  });

  worker.start();

  router
    .get('/v1/job/:jobId', ({ params }, res) => {
      const job = jobProcessor.get(params.jobId);

      if (!job) {
        res.status(404).send({ error: 'job not found' });
        return;
      }

      res.send({
        id: job.id,
        metadata: {
          ...job.context,
          logger: undefined,
          logStream: undefined,
        },
        status: job.status,
        stages: job.stages.map(stage => ({
          ...stage,
          handler: undefined,
        })),
        error: job.error,
      });
    })
    .post('/v1/jobs', async (req, res) => {
      const templateName: string = req.body.templateName;
      const values: TemplaterValues = {
        ...req.body.values,
        destination: {
          git: parseGitUrl(req.body.values.storePath),
        },
      };

      // Forward authorization from client
      const template = await entityClient.findTemplate(templateName, {
        token: getBearerToken(req.headers.authorization),
      });

      const validationResult: ValidatorResult = validate(
        values,
        template.spec.schema,
      );

      if (!validationResult.valid) {
        res.status(400).json({ errors: validationResult.errors });
        return;
      }

      const job = jobProcessor.create({
        entity: template,
        values,
        stages: [
          {
            name: 'Prepare the skeleton',
            async handler(ctx) {
              const {
                protocol,
                location: templateEntityLocation,
              } = parseLocationAnnotation(ctx.entity);

              if (protocol === 'file') {
                const preparer = new FilePreparer();

                const path = resolvePath(
                  templateEntityLocation,
                  template.spec.path || '.',
                );

                await preparer.prepare({
                  url: `file://${path}`,
                  logger: ctx.logger,
                  workspacePath: ctx.workspacePath,
                });
                return;
              }

              const preparer = preparers.get(templateEntityLocation);

              const url = joinGitUrlPath(
                templateEntityLocation,
                template.spec.path,
              );

              await preparer.prepare({
                url,
                logger: ctx.logger,
                workspacePath: ctx.workspacePath,
              });
            },
          },
          {
            name: 'Run the templater',
            async handler(ctx) {
              const templater = templaters.get(ctx.entity.spec.templater);
              await templater.run({
                workspacePath: ctx.workspacePath,
                dockerClient,
                logStream: ctx.logStream,
                values: ctx.values,
              });
            },
          },
          {
            name: 'Publish template',
            handler: async ctx => {
              const publisher = publishers.get(ctx.values.storePath);
              ctx.logger.info('Will now store the template');
              const result = await publisher.publish({
                values: ctx.values,
                workspacePath: ctx.workspacePath,
                logger: ctx.logger,
              });
              return result;
            },
          },
        ],
      });

      jobProcessor.run(job);

      res.status(201).json({ id: job.id });
    });

  // NOTE: The v2 API is unstable
  router
    .post('/v2/tasks', async (req, res) => {
      const templateName: string = req.body.templateName;
      const values: TemplaterValues = {
        ...req.body.values,
        destination: {
          git: parseGitUrl(req.body.values.storePath),
        },
      };
      const template = await entityClient.findTemplate(templateName);

      const validationResult: ValidatorResult = validate(
        values,
        template.spec.schema,
      );

      if (!validationResult.valid) {
        res.status(400).json({ errors: validationResult.errors });
        return;
      }
      const taskSpec = templateEntityToSpec(template, values);
      const result = await taskBroker.dispatch(taskSpec);

      res.status(201).json({ id: result.taskId });
    })
    .get('/v2/tasks/:taskId/eventstream', async (req, res) => {
      const { taskId } = req.params;
      const after = Number(req.query.after) || undefined;
      logger.debug(`Event stream observing taskId '${taskId}' opened`);

      // Mandatory headers and http status to keep connection open
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
      });

      // After client opens connection send all events as string
      const unsubscribe = taskBroker.observe(
        { taskId, after },
        (error, { events }) => {
          if (error) {
            logger.error(
              `Received error from event stream when observing taskId '${taskId}', ${error}`,
            );
          }

          for (const event of events) {
            res.write(
              `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
            );
            if (event.type === 'completion') {
              unsubscribe();
              // Closing the event stream here would cause the frontend
              // to automatically reconnect because it lost connection.
            }
          }
          res.flush();
        },
      );
      // When client closes connection we update the clients list
      // avoiding the disconnected one
      req.on('close', () => {
        unsubscribe();
        logger.debug(`Event stream observing taskId '${taskId}' closed`);
      });
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}

function getBearerToken(header?: string): string | undefined {
  return header?.match(/Bearer\s+(\S+)/i)?.[1];
}
