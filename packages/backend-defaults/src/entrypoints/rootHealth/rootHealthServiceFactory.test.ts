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
import { DefaultRootHealthService } from './rootHealthServiceFactory';

describe('DefaultRootHealthService', () => {
  describe('readiness', () => {
    it(`should return a 500 response if the server hasn't started yet`, async () => {
      const service = new DefaultRootHealthService({
        lifecycle: mockServices.rootLifecycle.mock(),
      });
      await expect(service.getReadiness()).resolves.toEqual({
        status: 503,
        payload: {
          message: 'Backend has not started yet',
          status: 'error',
        },
      });
    });

    it('should return 200 if the server has started', async () => {
      let mockServerStartedFn = () => {};

      const lifecycle = mockServices.rootLifecycle.mock({
        addStartupHook: jest.fn(fn => (mockServerStartedFn = fn)),
      });

      const service = new DefaultRootHealthService({
        lifecycle,
      });

      mockServerStartedFn();

      await expect(service.getReadiness()).resolves.toEqual({
        status: 200,
        payload: { status: 'ok' },
      });
    });

    it(`should return a 500 response if the server has stopped`, async () => {
      let mockServerStartedFn = () => {};
      let mockServerBeforeStoppedFn = () => {};

      const lifecycle = mockServices.rootLifecycle.mock({
        addStartupHook: jest.fn(fn => (mockServerStartedFn = fn)),
        addBeforeShutdownHook: jest.fn(fn => (mockServerBeforeStoppedFn = fn)),
      });

      const service = new DefaultRootHealthService({
        lifecycle,
      });

      mockServerStartedFn();
      mockServerBeforeStoppedFn();
      await expect(service.getReadiness()).resolves.toEqual({
        status: 503,
        payload: {
          message: 'Backend is shuttting down',
          status: 'error',
        },
      });
    });
  });

  describe('liveness', () => {
    it('should return 200 if the server has started', async () => {
      const service = new DefaultRootHealthService({
        lifecycle: mockServices.rootLifecycle.mock(),
      });

      await expect(service.getLiveness()).resolves.toEqual({
        status: 200,
        payload: { status: 'ok' },
      });
    });
  });
});
