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
import { PreparerBuilder, TemplaterBase } from '../scaffolder';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';

export interface RouterOptions {
  preparers: PreparerBuilder;
  templater: TemplaterBase;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const { preparers, templater, logger: parentLogger } = options;
  const logger = parentLogger.child({ plugin: 'scaffolder' });

  router.post('/v1/jobs', async (_, res) => {
    // TODO(blam): Create a unique job here and return the ID so that
    // The end user can poll for updates on the current job
    res.status(201).json({ accepted: true });

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

    // Get the preparer for the mock entity
    const preparer = preparers.get(mockEntity);

    // Run the preparer for the mock entity to produce a temporary directory with template in
    const skeletonPath = await preparer.prepare(mockEntity);

    // Run the templater on the mock directory with values from the post body
    const templatedPath = await templater.run({
      directory: skeletonPath,
      values: { component_id: 'test' },
    });

    console.warn(templatedPath);
  });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
