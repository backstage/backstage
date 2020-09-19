/*
 * Copyright 2020 Spotify AB
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

import { RouteRefRegistry } from './RouteRefRegistry';
import { resolveRoute } from './types';

const ref1 = { [resolveRoute]: (path: string) => path };
const ref11 = { [resolveRoute]: (path: string) => path };
const ref12 = { [resolveRoute]: (path: string) => path };
const ref121 = { [resolveRoute]: (path: string) => path };
const ref2 = { [resolveRoute]: (path: string) => path };

describe('RouteRefRegistry', () => {
  it('should be constructed with a root route', () => {
    const registry = new RouteRefRegistry();
    expect(registry.resolveRoute([], [])).toBe('');
  });

  it('should register and resolve some routes', () => {
    const registry = new RouteRefRegistry();
    expect(registry.registerRoute([ref1], '1')).toBe(true);
    expect(registry.registerRoute([ref1, ref11], '11')).toBe(true);
    expect(registry.registerRoute([ref1, ref12], '12')).toBe(true);
    expect(registry.registerRoute([ref1, ref12, ref121], '121')).toBe(true);
    expect(registry.registerRoute([ref1, ref12, ref121], 'duplicate')).toBe(
      false,
    );
    expect(registry.registerRoute([ref1, ref12], 'duplicate')).toBe(false);
    expect(registry.registerRoute([ref2], '2')).toBe(true);
    expect(registry.registerRoute([ref2], 'duplicate')).toBe(false);

    expect(registry.resolveRoute([], [ref1])).toBe('/1');
    expect(registry.resolveRoute([], [ref11])).toBe(undefined);
    expect(registry.resolveRoute([], [ref1, ref11])).toBe('/1/11');
    expect(registry.resolveRoute([ref1], [ref11])).toBe('/1/11');
    expect(registry.resolveRoute([ref1], [ref2])).toBe('/2');
    expect(registry.resolveRoute([ref1, ref12, ref121], [])).toBe('/1/12/121');
    expect(registry.resolveRoute([ref1, ref12, ref121], [ref121])).toBe(
      '/1/12/121',
    );
    expect(registry.resolveRoute([ref1, ref12, ref121], [ref12, ref121])).toBe(
      '/1/12/121',
    );
    expect(registry.resolveRoute([ref1, ref12, ref121], [ref12])).toBe('/1/12');
    expect(registry.resolveRoute([ref1, ref12, ref121], [ref1])).toBe('/1');
  });

  it('should throw when registering routes incorrectly', () => {
    const registry = new RouteRefRegistry();
    expect(() => {
      registry.registerRoute([ref1, ref11], '11');
    }).toThrow('Could not find parent for new routing node');
    expect(() => {
      registry.registerRoute([], '11');
    }).toThrow('Must provide at least 1 route to add routing node');
  });
});
