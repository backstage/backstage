/*
 * Copyright 2025 The Backstage Authors
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
import { mockServices } from '../../services';
import { LoggerService } from '@backstage/backend-plugin-api';
import { MockActionsRegistry } from './MockActionsRegistry';
import { createServiceMock } from '@backstage/backend-test-utils';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { actionsRegistryServiceFactory } from '@backstage/backend-defaults/alpha';

/**
 * @alpha
 */
export function actionsRegistryServiceMock(options?: {
  logger: LoggerService;
}): MockActionsRegistry {
  return MockActionsRegistry.create({
    logger: options?.logger ?? mockServices.logger.mock(),
  });
}

/**
 * @alpha
 */
export namespace actionsRegistryServiceMock {
  export const factory = () => actionsRegistryServiceFactory;

  export const mock = createServiceMock(actionsRegistryServiceRef, () => ({
    register: jest.fn(),
  }));
}
