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
import {
  createServiceFactory,
  ServiceFactory,
  ServiceRef,
} from '@backstage/backend-plugin-api';

/** @public */
export type ServiceMock<TService> = {
  factory: ServiceFactory<TService>;
} & {
  [Key in keyof TService]: TService[Key] extends (
    ...args: infer Args
  ) => infer Return
    ? TService[Key] & jest.MockInstance<Return, Args>
    : TService[Key];
};

/**
 * Creates a standardized Backstage service mock factory function for producing
 * mock service instances.
 *
 * @remarks
 *
 * Each method in the mock factory is a `jest.fn()`, and you can optionally pass
 * partial implementations when calling the returned function. No type
 * parameters should be provided to this function, they will be inferred from
 * the provided service reference.
 *
 * The returned mock has a `.factory` property that can be passed directly to
 * `startTestBackend` or other test utilities.
 *
 * @example
 * ```ts
 * import { createServiceMock } from '@backstage/backend-test-utils';
 *
 * const myServiceMock = createServiceMock(myServiceRef, () => ({
 *   doStuff: jest.fn(),
 *   doOtherStuff: jest.fn(),
 * }));
 *
 * // Create a mock with default behavior:
 * const mock = myServiceMock();
 *
 * // Or with a partial implementation:
 * const mock = myServiceMock({ doStuff: async () => 'test' });
 * expect(mock.doStuff).toHaveBeenCalledTimes(1);
 *
 * // It also has a `.factory` property for use with startTestBackend:
 * await startTestBackend({ features: [mock.factory] });
 * ```
 *
 * @public
 */
export function createServiceMock<TService>(
  ref: ServiceRef<TService, any>,
  mockFactory: () => jest.Mocked<TService>,
): (partialImpl?: Partial<TService>) => ServiceMock<TService> {
  return partialImpl => {
    const mock = mockFactory();
    if (partialImpl) {
      for (const [key, impl] of Object.entries(partialImpl)) {
        if (typeof impl === 'function') {
          (mock as any)[key].mockImplementation(impl);
        } else {
          (mock as any)[key] = impl;
        }
      }
    }
    return Object.assign(mock, {
      factory: createServiceFactory({
        service: ref,
        deps: {},
        factory: () => mock,
      }),
    }) as ServiceMock<TService>;
  };
}
