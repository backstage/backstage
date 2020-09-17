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

import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { Templaters, Preparers, Publishers } from '../scaffolder';
import Docker from 'dockerode';

jest.mock('dockerode');

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      preparers: new Preparers(),
      templaters: new Templaters(),
      publishers: new Publishers(),
      dockerClient: new Docker(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /v1/jobs', () => {
    const template = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Template',
      metadata: {
        description: 'Create a new CRA website project',
        name: 'create-react-app-template',
        tags: ['experimental', 'react', 'cra'],
        title: 'Create React App Template',
      },
      spec: {
        owner: 'web@example.com',
        path: '.',
        schema: {
          properties: {
            component_id: {
              description: 'Unique name of the component',
              title: 'Name',
              type: 'string',
            },
            description: {
              description: 'Description of the component',
              title: 'Description',
              type: 'string',
            },
            use_typescript: {
              default: true,
              description: 'Include typescript',
              title: 'Use Typescript',
              type: 'boolean',
            },
          },
          required: ['component_id', 'use_typescript'],
        },
        templater: 'cra',
        type: 'website',
      },
    };

    it('rejects template values which do not match the template schema definition', async () => {
      const response = await request(app).post('/v1/jobs').send({
        template,
        values: {},
      });

      expect(response.status).toEqual(400);
    });
  });
});
