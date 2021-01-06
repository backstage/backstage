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

import { Config, JsonValue } from '@backstage/config';
import fs from 'fs-extra';
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
import { CatalogEntityClient } from '../lib/catalog';
import { validate, ValidatorResult } from 'jsonschema';

export interface RouterOptions {
  preparers: PreparerBuilder;
  templaters: TemplaterBuilder;
  publishers: PublisherBuilder;

  logger: Logger;
  config: Config;
  dockerClient: Docker;
  entityClient: CatalogEntityClient;
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
  } = options;

  const logger = parentLogger.child({ plugin: 'scaffolder' });
  const jobProcessor = new JobProcessor();

  let workingDirectory: string;
  if (config.has('backend.workingDirectory')) {
    workingDirectory = config.getString('backend.workingDirectory');
    try {
      // Check if working directory exists and is writable
      await fs.promises.access(
        workingDirectory,
        fs.constants.F_OK | fs.constants.W_OK,
      );
      logger.info(`using working directory: ${workingDirectory}`);
    } catch (err) {
      logger.error(
        `working directory ${workingDirectory} ${
          err.code === 'ENOENT' ? 'does not exist' : 'is not writable'
        }`,
      );
      throw err;
    }
  }

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
      const values: RequiredTemplateValues & Record<string, JsonValue> =
        req.body.values;

      const template = await entityClient.findTemplate(templateName);

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
            handler: async ctx => {
              const preparer = preparers.get(ctx.entity);
              const skeletonDir = await preparer.prepare(ctx.entity, {
                logger: ctx.logger,
                workingDirectory,
              });
              return { skeletonDir };
            },
          },
          {
            name: 'Run the templater',
            handler: async (ctx: StageContext<{ skeletonDir: string }>) => {
              const templater = templaters.get(ctx.entity);
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
            handler: async (ctx: StageContext<{ resultDir: string }>) => {
              const publisher = publishers.get(ctx.entity);
              ctx.logger.info('Will now store the template');
              const result = await publisher.publish({
                values: ctx.values,
                directory: ctx.resultDir,
                logger: ctx.logger,
              });
              return result;
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
