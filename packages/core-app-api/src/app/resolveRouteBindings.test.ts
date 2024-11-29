/*
 * Copyright 2020 The Backstage Authors
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
  createExternalRouteRef,
  createPlugin,
  createRouteRef,
} from '@backstage/core-plugin-api';
import { collectRouteIds, resolveRouteBindings } from './resolveRouteBindings';
import { mockApis } from '@backstage/test-utils';

describe('resolveRouteBindings', () => {
  it('runs happy path', () => {
    const external = { myRoute: createExternalRouteRef({ id: '1' }) };
    const ref = createRouteRef({ id: 'ref-1' });
    const result = resolveRouteBindings(
      ({ bind }) => {
        bind(external, { myRoute: ref });
      },
      mockApis.config(),
      [],
    );

    expect(result.get(external.myRoute)).toBe(ref);
  });

  it('throws on unknown keys', () => {
    const external = { myRoute: createExternalRouteRef({ id: '2' }) };
    const ref = createRouteRef({ id: 'ref-2' });
    expect(() =>
      resolveRouteBindings(
        ({ bind }) => {
          bind(external, { someOtherRoute: ref } as any);
        },
        mockApis.config(),
        [],
      ),
    ).toThrow('Key someOtherRoute is not an existing external route');
  });

  it('reads bindings from config', () => {
    const mySource = createExternalRouteRef({ id: 'test' });
    const myTarget = createRouteRef({ id: 'test' });
    const result = resolveRouteBindings(
      () => {},
      mockApis.config({
        data: {
          app: { routes: { bindings: { 'test.mySource': 'test.myTarget' } } },
        },
      }),
      [
        createPlugin({
          id: 'test',
          routes: {
            myTarget,
          },
          externalRoutes: {
            mySource,
          },
        }),
      ],
    );

    expect(result.get(mySource)).toBe(myTarget);
  });

  it('prioritizes callback routes over config', () => {
    const mySource = createExternalRouteRef({ id: 'test', optional: true });
    const myTarget = createRouteRef({ id: 'test' });

    expect(
      resolveRouteBindings(
        ({ bind }) => {
          bind({ mySource }, { mySource: false });
        },
        mockApis.config({
          data: {
            app: { routes: { bindings: { 'test.mySource': 'myTarget' } } },
          },
        }),
        [
          createPlugin({
            id: 'test',
            routes: {
              myTarget,
            },
            externalRoutes: {
              mySource,
            },
          }),
        ],
      ).get(mySource),
    ).toBe(undefined);

    expect(
      resolveRouteBindings(
        ({ bind }) => {
          bind({ mySource }, { mySource: myTarget });
        },
        mockApis.config({
          data: { app: { routes: { bindings: { 'test.mySource': false } } } },
        }),
        [
          createPlugin({
            id: 'test',
            routes: {
              myTarget,
            },
            externalRoutes: {
              mySource,
            },
          }),
        ],
      ).get(mySource),
    ).toBe(myTarget);
  });

  it('throws on invalid config', () => {
    expect(() =>
      resolveRouteBindings(
        () => {},
        mockApis.config({ data: { app: { routes: { bindings: 'derp' } } } }),
        [],
      ),
    ).toThrow(
      "Invalid type in config for key 'app.routes.bindings' in 'mock-config', got string, wanted object",
    );

    expect(() =>
      resolveRouteBindings(
        () => {},
        mockApis.config({
          data: { app: { routes: { bindings: { 'test.mySource': true } } } },
        }),
        [],
      ),
    ).toThrow(
      "Invalid config at app.routes.bindings['test.mySource'], value must be a non-empty string",
    );

    expect(() =>
      resolveRouteBindings(
        () => {},
        mockApis.config({
          data: {
            app: { routes: { bindings: { 'test.mySource': 'test.myTarget' } } },
          },
        }),
        [],
      ),
    ).toThrow(
      "Invalid config at app.routes.bindings, 'test.mySource' is not a valid external route",
    );

    expect(() =>
      resolveRouteBindings(
        () => {},
        mockApis.config({
          data: {
            app: { routes: { bindings: { 'test.mySource': 'test.myTarget' } } },
          },
        }),
        [
          createPlugin({
            id: 'test',
            externalRoutes: {
              mySource: createExternalRouteRef({ id: 'test' }),
            },
          }),
        ],
      ),
    ).toThrow(
      "Invalid config at app.routes.bindings['test.mySource'], 'test.myTarget' is not a valid route",
    );
  });

  it('can have default targets, but at the lowest priority', () => {
    const source = createExternalRouteRef({
      id: 'test',
      defaultTarget: 'test.target1',
    });
    const target1 = createRouteRef({ id: 'test' });
    const target2 = createRouteRef({ id: 'test' });
    const plugin = createPlugin({
      id: 'test',
      routes: {
        target1,
        target2,
      },
      externalRoutes: {
        source,
      },
    });

    // defaultTarget wins only if no bind or config matches
    let result = resolveRouteBindings(() => {}, mockApis.config(), [plugin]);

    expect(result.get(source)).toBe(target1);

    // config wins over defaultTarget
    result = resolveRouteBindings(
      () => {},
      mockApis.config({
        data: {
          app: { routes: { bindings: { 'test.source': 'test.target2' } } },
        },
      }),
      [plugin],
    );

    expect(result.get(source)).toBe(target2);

    // bind wins over defaultTarget
    result = resolveRouteBindings(
      ({ bind }) => {
        bind(plugin.externalRoutes, { source: plugin.routes.target2 });
      },
      mockApis.config(),
      [plugin],
    );

    expect(result.get(source)).toBe(target2);
  });
});

describe('collectRouteIds', () => {
  it('should assign IDs to routes', () => {
    const ref = createRouteRef({ id: 'ignored' });
    const extRef = createExternalRouteRef({ id: 'ignored' });

    const collected = collectRouteIds([
      createPlugin({ id: 'test', routes: { ref }, externalRoutes: { extRef } }),
    ]);
    expect(Object.fromEntries(collected.routes)).toEqual({
      'test.ref': ref,
    });
    expect(Object.fromEntries(collected.externalRoutes)).toEqual({
      'test.extRef': extRef,
    });
  });

  it('can disable external routes that have defaults', () => {
    const source = createExternalRouteRef({
      id: 'test',
      defaultTarget: 'test.target1',
    });
    const target1 = createRouteRef({ id: 'test' });
    const plugin = createPlugin({
      id: 'test',
      routes: { target1 },
      externalRoutes: { source },
    });

    // resolves normally with no config
    let result = resolveRouteBindings(() => {}, mockApis.config(), [plugin]);

    expect(result.get(source)).toBe(target1);

    // can be disabled
    result = resolveRouteBindings(
      () => {},
      mockApis.config({
        data: { app: { routes: { bindings: { 'test.source': false } } } },
      }),
      [plugin],
    );

    expect(result.get(source)).toBe(undefined);
  });
});
