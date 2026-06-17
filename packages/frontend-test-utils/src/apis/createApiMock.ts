/*
 * Copyright 2026 The Backstage Authors
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

import { ApiFactory, type ApiRef } from '@backstage/frontend-plugin-api';
import { mockApiFactorySymbol } from './MockWithApiFactory';

/**
 * Represents a mocked version of an API, where you automatically have access to
 * the mocked versions of all of its methods along with a factory that returns
 * that same mock.
 *
 * @public
 */
export type ApiMock<TApi> = {
  [mockApiFactorySymbol]: ApiFactory<TApi, TApi, {}>;
} & {
  [Key in keyof TApi]: TApi[Key] extends (...args: infer Args) => infer Return
    ? TApi[Key] & jest.MockInstance<Return, Args>
    : TApi[Key];
};

/**
 * Creates a standardized Backstage Utility API mockfactory function for
 * producing mock API instances.
 *
 * @remarks
 *
 * Each method in the mock factory is a `jest.fn()`, and you can optionally pass
 * partial implementations when calling the returned function. No type
 * parameters should be provided to this function, they will be inferred from
 * the provided API reference.
 *
 * @public
 * @example
 * ```ts
 * import { createApiMock } from '@backstage/frontend-test-utils';
 * import { myApiRef } from '../apis';
 *
 * // Set up the mock factory
 * const mock = createApiMock(myApiRef, () => ({
 *   greet: jest.fn(),
 * }));
 *
 * // Create a mock with default behavior
 * const api = mock();
 *
 * // Or with a partial implementation
 * const api = mock({ greet: async () => 'Hello!' });
 * expect(api.greet).toHaveBeenCalledTimes(1);
 * ```
 */
export function createApiMock<TApi>(
  apiRef: ApiRef<TApi>,
  mockFactory: () => jest.Mocked<TApi>,
): (partialImpl?: Partial<TApi>) => ApiMock<TApi> {
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
    (mock as any)[mockApiFactorySymbol] = {
      api: apiRef,
      deps: {},
      factory: () => mock,
    };
    return mock as unknown as ApiMock<TApi>;
  };
}
