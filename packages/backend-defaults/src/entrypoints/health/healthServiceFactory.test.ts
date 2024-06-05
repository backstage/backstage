import { mockServices } from '@backstage/backend-test-utils';
import { DefaultHealthService } from './healthServiceFactory';

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
describe('DefaultHealthService', () => {
  describe('readiness', () => {
    it(`should return a 500 response if the server hasn't started yet`, async () => {
      const service = new DefaultHealthService({
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
      const lifecycle = mockServices.rootLifecycle.mock();
      let mockServerStartedFn = () => {};
      lifecycle.addStartupHook.mockImplementation(
        fn => (mockServerStartedFn = fn),
      );

      const service = new DefaultHealthService({
        lifecycle,
      });

      mockServerStartedFn();

      await expect(service.getReadiness()).resolves.toEqual({
        status: 200,
        payload: { status: 'ok' },
      });
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

      const service = new DefaultHealthService({
        lifecycle: mockServices.rootLifecycle.mock(),
      });

      mockServerStartedFn();
      mockServerStoppedFn();
      await expect(service.getReadiness()).resolves.toEqual({
        status: 503,
        payload: {
          message: 'Backend has not started yet',
          status: 'error',
        },
      });
    });
  });

  describe('liveness', () => {
    it('should return 200 if the server has started', async () => {
      const service = new DefaultHealthService({
        lifecycle: mockServices.rootLifecycle.mock(),
      });

      await expect(service.getLiveness()).resolves.toEqual({
        status: 200,
        payload: { status: 'ok' },
      });
    });
  });
});
