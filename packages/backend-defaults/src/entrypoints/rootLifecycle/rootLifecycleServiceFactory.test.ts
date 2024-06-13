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

import { BackendLifecycleImpl } from './rootLifecycleServiceFactory';
import { mockServices } from '@backstage/backend-test-utils';

describe('lifecycleService', () => {
  it('should execute registered shutdown hook', async () => {
    const service = new BackendLifecycleImpl(mockServices.logger.mock());
    const hook = jest.fn();
    service.addShutdownHook(() => hook());
    // should not execute the hook more than once.
    await service.shutdown();
    await service.shutdown();
    await service.shutdown();
    expect(hook).toHaveBeenCalledTimes(1);
  });

  it('should not throw errors', async () => {
    const service = new BackendLifecycleImpl(mockServices.logger.mock());
    service.addShutdownHook(() => {
      throw new Error('oh no');
    });
    await expect(service.shutdown()).resolves.toBeUndefined();
  });

  it('should not throw async errors', async () => {
    const service = new BackendLifecycleImpl(mockServices.logger.mock());
    service.addShutdownHook(async () => {
      throw new Error('oh no');
    });
    await expect(service.shutdown()).resolves.toBeUndefined();
  });

  it('should reject hooks after trigger', async () => {
    const service = new BackendLifecycleImpl(mockServices.logger.mock());
    await service.startup();
    expect(() => {
      service.addStartupHook(() => {});
    }).toThrow('Attempted to add startup hook after startup');

    await service.shutdown();
    expect(() => {
      service.addShutdownHook(() => {});
    }).toThrow('Attempted to add shutdown hook after shutdown');
  });
});
