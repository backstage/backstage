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

import { createLifecycleMiddleware } from './createLifecycleMiddleware';
import { BackendLifecycleImpl } from '../rootLifecycle/rootLifecycleServiceFactory';
import { mockServices } from '@backstage/backend-test-utils';
import { ServiceUnavailableError } from '@backstage/errors';

describe('createLifecycleMiddleware', () => {
  it('should pause requests when plugin is not ready', async () => {
    const lifecycle = new BackendLifecycleImpl(mockServices.rootLogger());

    const middleware = createLifecycleMiddleware({ lifecycle });

    const next = jest.fn();
    middleware({} as any, {} as any, next);
    expect(next).not.toHaveBeenCalled();
    await lifecycle.startup();

    // pending call
    expect(next).toHaveBeenCalledWith();

    // new call
    const next2 = jest.fn();
    middleware({} as any, {} as any, next2);
    expect(next2).toHaveBeenCalledWith();
  });

  it('should throw ServiceUnavailableError after shutdown', async () => {
    const lifecycle = new BackendLifecycleImpl(mockServices.rootLogger());
    const middleware = createLifecycleMiddleware({ lifecycle });

    const next = jest.fn();
    middleware({} as any, {} as any, next);
    expect(next).not.toHaveBeenCalled();
    await lifecycle.shutdown();

    // pending call
    expect(next).toHaveBeenCalledWith(
      new ServiceUnavailableError('Service is shutting down'),
    );

    // new call
    const next2 = jest.fn();
    middleware({} as any, {} as any, next2);
    expect(next2).toHaveBeenCalledWith(
      new ServiceUnavailableError('Service is shutting down'),
    );
  });

  it('should throw ServiceUnavailableError after timeout', async () => {
    const lifecycle = new BackendLifecycleImpl(mockServices.rootLogger());
    const middleware = createLifecycleMiddleware({
      lifecycle,
      startupRequestPauseTimeout: { milliseconds: 1 },
    });

    const next = jest.fn();
    middleware({} as any, {} as any, next);
    expect(next).not.toHaveBeenCalled();

    await new Promise(r => setTimeout(r, 2));

    expect(next).toHaveBeenCalledWith(
      new ServiceUnavailableError('Service has not started up yet'),
    );
  });
});
