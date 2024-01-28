/*
 * Copyright 2022 The Backstage Authors
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

import {
  ServiceFactoryTester,
  mockServices,
} from '@backstage/backend-test-utils';
import { httpRouterServiceFactory } from './httpRouterServiceFactory';
import { HttpRouterService } from '@backstage/backend-plugin-api';

describe('httpRouterFactory', () => {
  let tester: ServiceFactoryTester<HttpRouterService, 'plugin'>;
  let rootHttpRouter: ReturnType<typeof mockServices.rootHttpRouter.mock>;

  beforeEach(() => {
    rootHttpRouter = mockServices.rootHttpRouter.mock();
    tester = ServiceFactoryTester.from(httpRouterServiceFactory, {
      dependencies: [
        rootHttpRouter.factory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              baseUrl: 'http://localhost:3000',
            },
          },
        }),
      ],
    });
  });
  it('should register plugin paths', async () => {
    const router1 = await tester.get('test1');
    router1.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(1);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/api/test1',
      expect.any(Function),
    );

    const router2 = await tester.get('test2');
    router2.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(2);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/api/test2',
      expect.any(Function),
    );
  });

  it('should use custom path generator', async () => {
    tester = ServiceFactoryTester.from(
      httpRouterServiceFactory({
        getPath: id => `/some/${id}/path`,
      }),
      {
        dependencies: [
          rootHttpRouter.factory,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                baseUrl: 'http://localhost:3000',
              },
            },
          }),
        ],
      },
    );

    const router1 = await tester.get('test1');
    router1.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(1);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/some/test1/path',
      expect.any(Function),
    );

    const router2 = await tester.get('test2');
    router2.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(2);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/some/test2/path',
      expect.any(Function),
    );
  });
});
