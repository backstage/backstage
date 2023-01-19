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
  HttpRouterService,
  ServiceFactory,
} from '@backstage/backend-plugin-api';
import { httpRouterFactory } from './httpRouterFactory';

describe('httpRouterFactory', () => {
  it('should register plugin paths', async () => {
    const rootHttpRouter = { use: jest.fn() };
    const factory = httpRouterFactory() as Exclude<
      ServiceFactory<HttpRouterService>,
      { scope: 'root' }
    >;

    const handler1 = () => {};
    const router1 = await factory.factory(
      {
        rootHttpRouter,
        plugin: { getId: () => 'test1' },
      },
      undefined,
    );
    router1.use(handler1);
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(1);
    expect(rootHttpRouter.use).toHaveBeenCalledWith('/api/test1', handler1);

    const handler2 = () => {};
    const router2 = await factory.factory(
      {
        rootHttpRouter,
        plugin: { getId: () => 'test2' },
      },
      undefined,
    );
    router2.use(handler2);
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(2);
    expect(rootHttpRouter.use).toHaveBeenCalledWith('/api/test2', handler2);
  });

  it('should use custom path generator', async () => {
    const rootHttpRouter = { use: jest.fn() };
    const factory = httpRouterFactory({
      getPath: id => `/some/${id}/path`,
    }) as Exclude<ServiceFactory<HttpRouterService>, { scope: 'root' }>;

    const handler1 = () => {};
    const router1 = await factory.factory(
      {
        rootHttpRouter,
        plugin: { getId: () => 'test1' },
      },
      undefined,
    );
    router1.use(handler1);
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(1);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/some/test1/path',
      handler1,
    );

    const handler2 = () => {};
    const router2 = await factory.factory(
      {
        rootHttpRouter,
        plugin: { getId: () => 'test2' },
      },
      undefined,
    );
    router2.use(handler2);
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(2);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/some/test2/path',
      handler2,
    );
  });
});
