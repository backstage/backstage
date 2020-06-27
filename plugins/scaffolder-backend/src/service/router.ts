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

import { Logger } from 'winston';
import Router from 'express-promise-router';
import express from 'express';
import { PreparerBuilder, TemplaterBase, JobProcessor } from '../scaffolder';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import Docker from 'dockerode';
import {} from '@backstage/backend-common';
import { StageContext, Stage } from '../scaffolder/jobs/types';
export interface RouterOptions {
  preparers: PreparerBuilder;
  templater: TemplaterBase;
  logger: Logger;
  dockerClient: Docker;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const { preparers, templater, logger: parentLogger, dockerClient } = options;
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
        metadata: job.metadata,
        status: job.status,
        log: job.log,
        error: job.error,
      });
    })
    .post('/v1/jobs', async (_, res) => {
      // TODO(blam): Create a unique job here and return the ID so that
      // The end user can poll for updates on the current job

      // TODO(blam): Take this entity from the post body sent from the frontend
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            'backstage.io/managed-by-location':
              'github:https://github.com/benjdlambert/backstage-graphql-template/blob/master/template.yaml',
          },
          name: 'graphql-starter',
          title: 'GraphQL Service',
          description:
            'A GraphQL starter template for backstage to get you up and running\nthe best pracices with GraphQL\n',
          uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
          etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',

          generation: 1,
        },
        spec: {
          type: 'cookiecutter',
          path: './template',
        },
      };

      const job = jobProcessor.create({
        entity: mockEntity,
        values: { component_id: 'blob' },
        stages: [
          {
            name: 'Prepare the skeleton',
            handler: async ctx => {
              const preparer = preparers.get(ctx.entity);
              const skeletonDir = await preparer.prepare(ctx.entity);
              return { skeletonDir };
            },
          },
          {
            name: 'Run the templater',
            handler: async (ctx: StageContext<{ skeletonDir: string }>) => {
              const resultDir = await templater.run({
                directory: ctx.skeletonDir,
                dockerClient,
                logStream: ctx.logStream,
                values: ctx.values,
              });

              return { resultDir };
            },
          },
          {
            name: 'Create VCS Repo',
            handler: async (ctx: StageContext<{ resultDir: string }>) => {
              ctx.logger.info('Should now create the VCS repo');
            },
          },
          {
            name: 'Push to remote',
            handler: async ctx => {
              ctx.logger.info('Should now push to the remote');
            },
          },
        ],
      });
      res.status(201).json({ jobId: job.id });

      jobProcessor.process(job);
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
