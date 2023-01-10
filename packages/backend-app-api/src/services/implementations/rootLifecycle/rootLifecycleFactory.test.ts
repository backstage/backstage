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

import { getVoidLogger } from '@backstage/backend-common';
import { BackendLifecycleImpl } from './rootLifecycleFactory';

describe('lifecycleService', () => {
  it('should execute registered shutdown hook', async () => {
    const service = new BackendLifecycleImpl(getVoidLogger());
    const hook = jest.fn();
    service.addShutdownHook({
      fn: async () => {
        hook();
      },
    });
    // should not execute the hook more than once.
    await service.shutdown();
    await service.shutdown();
    await service.shutdown();
    expect(hook).toHaveBeenCalledTimes(1);
  });

  it('should not throw errors', async () => {
    const service = new BackendLifecycleImpl(getVoidLogger());
    service.addShutdownHook({
      fn: async () => {
        throw new Error('oh no');
      },
    });
    await expect(service.shutdown()).resolves.toBeUndefined();
  });
});
