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

import type {
  RoutingLocation,
  RoutingContract,
  RoutingNavigateOptions,
} from './RoutingContract';

describe('RoutingContract types', () => {
  it('should allow creating a valid RoutingContract', () => {
    const location: RoutingLocation = {
      pathname: '/entity/foo',
      search: '?filter=active',
      hash: '#details',
      state: undefined,
    };

    const navigateOptions: RoutingNavigateOptions = {
      replace: true,
      state: { step: 1 },
      adapterState: { 'tanstack-router': { key: 'abc' } },
    };

    const contract: RoutingContract = {
      basePath: '/catalog',
      routePattern: '/catalog',
      location$: {
        subscribe: () => ({
          unsubscribe: () => {},
          get closed() {
            return false;
          },
        }),
        [Symbol.observable]() {
          return this;
        },
      },
      navigate: (_to: string, _options?: RoutingNavigateOptions) => {},
      go: (_delta: number) => {},
      canGoBack: () => false,
      canGoForward: () => false,
      historyLength: 1,
      getAdapterState: () => undefined,
      block: () => () => {},
    };

    expect(location.pathname).toBe('/entity/foo');
    expect(contract.basePath).toBe('/catalog');
    expect(navigateOptions.adapterState?.['tanstack-router']).toEqual({
      key: 'abc',
    });
  });
});
