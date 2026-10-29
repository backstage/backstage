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

import {
  extensionFragmentsApiRef,
  type ExtensionFragmentsApi,
} from '@backstage/frontend-plugin-api/alpha';
import { JSX } from 'react';
import {
  attachMockApiFactory,
  type MockWithApiFactory,
} from './apis/MockWithApiFactory';
import { createApiMock } from './apis/createApiMock';

/**
 * Test helpers for alpha Utility APIs.
 *
 * @alpha
 */
export namespace mockApis {
  /**
   * Creates a fragment registry, empty by default. Keys are fragment IDs
   * without the `fragment:` kind, for example `deployments/summary`.
   *
   * @alpha
   */
  export function extensionFragments(
    fragments: Record<string, JSX.Element> = {},
  ): MockWithApiFactory<ExtensionFragmentsApi> {
    const fragmentsById = new Map(
      Object.entries(fragments).map(([id, element]) => [
        `fragment:${id}`,
        element,
      ]),
    );
    return attachMockApiFactory<ExtensionFragmentsApi>(
      extensionFragmentsApiRef,
      {
        getFragment: extensionId => fragmentsById.get(extensionId),
      },
    );
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api/alpha#ExtensionFragmentsApi}.
   *
   * @alpha
   */
  export namespace extensionFragments {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @alpha
     */
    export const mock = createApiMock(extensionFragmentsApiRef, () => ({
      getFragment: jest.fn(),
    }));
  }
}
