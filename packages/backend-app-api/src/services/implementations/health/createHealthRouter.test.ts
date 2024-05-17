/*
 * Copyright 2024 The Backstage Authors
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

import { mockServices } from '@backstage/backend-test-utils';
import request from 'supertest';
import { createHealthRouter } from './createHealthRouter';
import express from 'express';

describe('createHealthRouter', () => {
  describe('readiness', () => {
    it(`should return a 500 response if the server hasn't started yet`, async () => {
      const hc = createHealthRouter({
        lifecycle: mockServices.rootLifecycle.mock(),
      });
      const app = express().use(hc);

      const response = await request(app).get('/v1/readiness');
      expect(response.status).toBe(500);
    });

    it('should return 200 if the server has started', async () => {
      const lifecycle = mockServices.rootLifecycle.mock();
      let mockServerStartedFn = () => {};
      lifecycle.addStartupHook.mockImplementation(
        fn => (mockServerStartedFn = fn),
      );

      const hc = createHealthRouter({ lifecycle });
      const app = express().use(hc);

      mockServerStartedFn();
      const response = await request(app).get('/v1/readiness').expect(200);
      expect(response.body).toEqual({ status: 'ok' });
    });

    it(`should return a 500 response if the server has stopped`, async () => {
      const lifecycle = mockServices.rootLifecycle.mock();
      let mockServerStartedFn = () => {};
      let mockServerStoppedFn = () => {};
      lifecycle.addStartupHook.mockImplementation(
        fn => (mockServerStartedFn = fn),
      );
      lifecycle.addShutdownHook.mockImplementation(
        fn => (mockServerStoppedFn = fn),
      );

      const hc = createHealthRouter({ lifecycle });
      const app = express().use(hc);

      mockServerStartedFn();
      mockServerStoppedFn();
      const response = await request(app).get('/v1/readiness');
      expect(response.status).toBe(500);
    });
  });

  describe('liveness', () => {
    it('should return 200 if the server has started', async () => {
      const lifecycle = mockServices.rootLifecycle.mock();

      const hc = createHealthRouter({ lifecycle });
      const app = express().use(hc);

      const response = await request(app).get('/v1/liveness').expect(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
