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
import { createRouteRef } from './RouteRef';

const dummyConfig = { path: '/', icon: () => null, title: 'my-title' };
const ref1 = createRouteRef(dummyConfig);
const ref11 = createRouteRef(dummyConfig);
const ref12 = createRouteRef(dummyConfig);
const ref121 = createRouteRef(dummyConfig);
const ref2 = createRouteRef(dummyConfig);
const ref2a = ref2.createSubRoute({ path: '/a' });
const ref2b = ref2.createSubRoute<{ id: string }>({ path: '/b/:id' });

describe('RouteRefRegistry', () => {
  it('should be constructed with a root route', () => {
    const registry = new RouteRefRegistry();
    expect(registry.resolveRoute([], [])).toBe('');
  });

  it('should register and resolve some absolute routes', () => {
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
    expect(registry.registerRoute([ref2], '2')).toBe(true);

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

  it('should register and resolve with sub routes', () => {
    const registry = new RouteRefRegistry();
    expect(registry.registerRoute([ref1], '1')).toBe(true);
    expect(registry.registerRoute([ref2], '2')).toBe(true);
    expect(registry.registerRoute([ref2a], '2')).toBe(true);
    expect(registry.registerRoute([ref2a, ref1], '1')).toBe(true);
    expect(registry.registerRoute([ref2a, ref2], '2')).toBe(true);
    expect(registry.registerRoute([ref2b], '2')).toBe(true);
    expect(registry.registerRoute([ref2b, ref1], '1')).toBe(true);
    expect(registry.registerRoute([ref2b, ref2], '2')).toBe(true);

    expect(registry.resolveRoute([], [ref1])).toBe('/1');
    expect(registry.resolveRoute([], [ref2])).toBe('/2');
    expect(registry.resolveRoute([], [ref2a.link(), ref1])).toBe('/2/a/1');
    expect(registry.resolveRoute([], [ref2a.link(), ref2])).toBe('/2/a/2');
    expect(registry.resolveRoute([ref2a.link()], [ref2])).toBe('/2/a/2');
    expect(registry.resolveRoute([ref2a.link(), ref1], [ref2])).toBe('/2/a/2');
    expect(registry.resolveRoute([], [ref2b.link({ id: 'abc' }), ref1])).toBe(
      '/2/b/abc/1',
    );
    expect(registry.resolveRoute([], [ref2b.link({ id: 'xyz' }), ref2])).toBe(
      '/2/b/xyz/2',
    );
    expect(registry.resolveRoute([ref2b.link({ id: 'abc' })], [ref2])).toBe(
      '/2/b/abc/2',
    );
    expect(
      registry.resolveRoute([ref2b.link({ id: 'abc' }), ref1], [ref2]),
    ).toBe('/2/b/abc/2');
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
