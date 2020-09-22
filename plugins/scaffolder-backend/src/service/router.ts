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

import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/config';
import Docker from 'dockerode';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  JobProcessor,
  PreparerBuilder,
  RequiredTemplateValues,
  StageContext,
  TemplaterBuilder,
  PublisherBuilder,
} from '../scaffolder';

export interface RouterOptions {
  preparers: PreparerBuilder;
  templaters: TemplaterBuilder;
  publishers: PublisherBuilder;

  logger: Logger;
  dockerClient: Docker;
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
    dockerClient,
  } = options;

  const logger = parentLogger.child({ plugin: 'scaffolder' });
  const jobProcessor = new JobProcessor();

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
      const template: TemplateEntityV1alpha1 = req.body.template;
      const values: RequiredTemplateValues & Record<string, JsonValue> =
        req.body.values;

      const token: string = req.body.token;
      const job = jobProcessor.create({
        token: token,
        entity: template,
        values,
        stages: [
          {
            name: 'Prepare the skeleton',
            handler: async (ctx: StageContext<{ token: string }>) => {
              const preparer = preparers.get(ctx.entity);
              ctx.logger.info('Will now prepare the skeleton');
              ctx.logger.info(`Token Prepare: ${token}`);
              const skeletonDir = await preparer.prepare(ctx.entity, token, {
                logger: ctx.logger,
              });
              return { skeletonDir };
            },
          },
          {
            name: 'Run the templater',
            handler: async (
              ctx: StageContext<{ skeletonDir: string; token: string }>,
            ) => {
              const templater = templaters.get(ctx.entity);
              ctx.logger.info('Will now run the template');
              ctx.logger.info(`Token run templater: ${token}`);
              const { resultDir } = await templater.run({
                directory: ctx.skeletonDir,
                dockerClient,
                logStream: ctx.logStream,
                values: ctx.values,
              });

              return { resultDir };
            },
          },
          {
            name: 'Publish template',
            handler: async (
              ctx: StageContext<{ resultDir: string; token: string }>,
            ) => {
              const publisher = publishers.get(ctx.entity);
              ctx.logger.info('Will now store the template');
              ctx.logger.info(`Token publish: ${token}`);
              const { remoteUrl } = await publisher.publish({
                entity: ctx.entity,
                values: ctx.values,
                directory: ctx.resultDir,
                token: token,
              });
              ctx.logger.info('Remote URL:');
              ctx.logger.info(remoteUrl);
              return { remoteUrl };
            },
          },
        ],
      });

      res.status(201).json({ id: job.id });

      jobProcessor.run(job);
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
