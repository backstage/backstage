/*
 * Copyright 2020 The Backstage Authors
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
import { ConfigReader } from '@backstage/config';
import {
  createRouter,
  generateAirbrakePathRewrite,
  RouterOptions,
} from './router';
import { AirbrakeConfig, extractAirbrakeConfig } from '../config';
import * as winston from 'winston';

describe('createRouter', () => {
  let app: express.Express;
  let airbrakeConfig: AirbrakeConfig;
  let voidLogger: winston.Logger;

  beforeEach(async () => {
    jest.resetAllMocks();

    voidLogger = getVoidLogger();
    const config = new ConfigReader({
      airbrake: {
        apiKey: 'fakeApiKey',
      },
    });
    airbrakeConfig = extractAirbrakeConfig(config);

    const router = await createRouter({
      logger: voidLogger,
      airbrakeConfig,
    });
    app = express().use(router);
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /api', () => {
    it('appends the API Key properly with no other url parameters', () => {
      const options: RouterOptions = {
        logger: voidLogger,
        airbrakeConfig,
      };
      const pathRewrite = generateAirbrakePathRewrite(options) as (
        path: string,
      ) => string;

      expect(pathRewrite('/airbrake-backend/api/v4/random/endpoint')).toBe(
        '/v4/random/endpoint?key=fakeApiKey',
      );
    });

    it('appends the API Key properly despite there being other URL parameters', () => {
      const options: RouterOptions = {
        logger: voidLogger,
        airbrakeConfig,
      };
      const pathRewrite = generateAirbrakePathRewrite(options) as (
        path: string,
      ) => string;

      expect(
        pathRewrite(
          '/airbrake-backend/api/v4/random/endpoint?param1=123&param2=abc',
        ),
      ).toBe('/v4/random/endpoint?param1=123&param2=abc&key=fakeApiKey');
    });
  });
});
