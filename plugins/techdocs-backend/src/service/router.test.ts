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
import { Preparers, LocalPublish, Generators } from '../techdocs';
import { ConfigReader } from '@backstage/config';
import Docker from 'dockerode';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;
  const logger = getVoidLogger();

  beforeAll(async () => {
    const router = await createRouter({
      preparers: new Preparers(),
      generators: new Generators(),
      publisher: new LocalPublish(logger),
      logger: getVoidLogger(),
      dockerClient: new Docker(),
      config: ConfigReader.fromConfigs([]),
    });
    app = express().use(router);
  });

  describe('GET /', () => {
    it('does not explode', async () => {
      const response = await request(app).get('/');

      expect(response.status).toEqual(200);
      expect(response.text).toEqual('Hello TechDocs Backend');
    });
  });
});
