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
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import { resolveRouteBindings } from './resolveRouteBindings';
import { ConfigReader } from '@backstage/config';

const emptyIds = { routes: new Map(), externalRoutes: new Map() };

describe('resolveRouteBindings', () => {
  it('runs happy path', () => {
    const external = { myRoute: createExternalRouteRef() };
    const ref = createRouteRef();
    const result = resolveRouteBindings(
      ({ bind }) => {
        bind(external, { myRoute: ref });
      },
      new ConfigReader({}),
      emptyIds,
    );

    expect(result.get(external.myRoute)).toBe(ref);
  });

  it('throws on unknown keys', () => {
    const external = { myRoute: createExternalRouteRef() };
    const ref = createRouteRef();
    expect(() =>
      resolveRouteBindings(
        ({ bind }) => {
          bind(external, { someOtherRoute: ref } as any);
        },
        new ConfigReader({}),
        emptyIds,
      ),
    ).toThrow('Key someOtherRoute is not an existing external route');
  });

  it('reads bindings from config', () => {
    const mySource = createExternalRouteRef();
    const myTarget = createRouteRef();
    const result = resolveRouteBindings(
      () => {},
      new ConfigReader({
        app: { routes: { bindings: { mySource: 'myTarget' } } },
      }),
      {
        routes: new Map([['myTarget', myTarget]]),
        externalRoutes: new Map([['mySource', mySource]]),
      },
    );

    expect(result.get(mySource)).toBe(myTarget);
  });

  it('throws on invalid config', () => {
    expect(() =>
      resolveRouteBindings(
        () => {},
        new ConfigReader({ app: { routes: { bindings: 'derp' } } }),
        emptyIds,
      ),
    ).toThrow(
      "Invalid type in config for key 'app.routes.bindings' in 'mock-config', got string, wanted object",
    );

    expect(() =>
      resolveRouteBindings(
        () => {},
        new ConfigReader({ app: { routes: { bindings: { mySource: true } } } }),
        emptyIds,
      ),
    ).toThrow(
      "Invalid config at app.routes.bindings['mySource'], value must be a non-empty string",
    );

    expect(() =>
      resolveRouteBindings(
        () => {},
        new ConfigReader({
          app: { routes: { bindings: { mySource: 'myTarget' } } },
        }),
        emptyIds,
      ),
    ).toThrow(
      "Invalid config at app.routes.bindings, 'mySource' is not a valid external route",
    );

    expect(() =>
      resolveRouteBindings(
        () => {},
        new ConfigReader({
          app: { routes: { bindings: { mySource: 'myTarget' } } },
        }),
        {
          ...emptyIds,
          externalRoutes: new Map([['mySource', createExternalRouteRef()]]),
        },
      ),
    ).toThrow(
      "Invalid config at app.routes.bindings['mySource'], 'myTarget' is not a valid route",
    );
  });

  it('can have default targets, but at the lowest priority', () => {
    const source = createExternalRouteRef({ defaultTarget: 'target1' });
    const target1 = createRouteRef();
    const target2 = createRouteRef();
    const routesById = {
      routes: new Map([
        ['target1', target1],
        ['target2', target2],
      ]),
      externalRoutes: new Map([['source', source]]),
    };

    // defaultTarget wins only if no bind or config matches
    let result = resolveRouteBindings(
      () => {},
      new ConfigReader({}),
      routesById,
    );

    expect(result.get(source)).toBe(target1);

    // config wins over defaultTarget
    result = resolveRouteBindings(
      () => {},
      new ConfigReader({
        app: { routes: { bindings: { source: 'target2' } } },
      }),
      routesById,
    );

    expect(result.get(source)).toBe(target2);

    // bind wins over defaultTarget
    result = resolveRouteBindings(
      ({ bind }) => {
        bind({ a: source }, { a: target2 });
      },
      new ConfigReader({}),
      routesById,
    );

    expect(result.get(source)).toBe(target2);
  });
});
