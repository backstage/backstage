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
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  JobProcessor,
  PreparerBuilder,
  StageContext,
  TemplaterBuilder,
  TemplaterValues,
  PublisherBuilder,
  parseLocationAnnotation,
  FilePreparer,
} from '../scaffolder';
import { CatalogEntityClient } from '../lib/catalog';
import { validate, ValidatorResult } from 'jsonschema';
import parseGitUrl from 'git-url-parse';
import { PreparerBase } from '../scaffolder/stages/prepare';

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
  const jobProcessor = await JobProcessor.fromConfig({ config, logger });

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
            async handler(ctx) {
              const {
                protocol,
                location: templateEntityLocation,
              } = parseLocationAnnotation(ctx.entity);

              if (protocol === 'file') {
                const preparer: PreparerBase =
                  protocol === 'file'
                    ? new FilePreparer()
                    : preparers.get(templateEntityLocation);

                const url = new URL(
                  template.spec.path || '.',
                  templateEntityLocation,
                )
                  .toString()
                  .replace(/\/$/, '');

                await preparer.prepare({
                  url,
                  logger: ctx.logger,
                  workspacePath: ctx.workspacePath,
                });
                return;
              }

              const preparer: PreparerBase =
                protocol === 'file'
                  ? new FilePreparer()
                  : preparers.get(templateEntityLocation);

              const url = new URL(
                template.spec.path || '.',
                templateEntityLocation,
              )
                .toString()
                .replace(/\/$/, '');

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

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
