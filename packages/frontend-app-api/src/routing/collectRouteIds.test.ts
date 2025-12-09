/*
 * Copyright 2023 The Backstage Authors
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
  createRouteRef,
  createExternalRouteRef,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { collectRouteIds } from './collectRouteIds';
import { createErrorCollector } from '../wiring/createErrorCollector';

const collector = createErrorCollector();

afterEach(() => {
  const errors = collector.collectErrors();
  if (errors) {
    throw new Error(
      `Unexpected errors: ${errors.map(e => e.message).join(', ')}`,
    );
  }
});

describe('collectRouteIds', () => {
  it('should assign IDs to routes', () => {
    const ref = createRouteRef();
    const extRef = createExternalRouteRef();

    expect(String(ref)).toMatch(
      /^routeRef\{id=undefined,at='.*collectRouteIds\.test\.ts.*'\}$/,
    );
    expect(String(extRef)).toMatch(
      /^externalRouteRef\{id=undefined,at='.*collectRouteIds\.test\.ts.*'\}$/,
    );

    const collected = collectRouteIds(
      [
        createFrontendPlugin({
          pluginId: 'test',
          routes: { ref },
          externalRoutes: { extRef },
        }),
      ],
      collector,
    );
    expect(Object.fromEntries(collected.routes)).toEqual({
      'test.ref': ref,
    });
    expect(Object.fromEntries(collected.externalRoutes)).toEqual({
      'test.extRef': extRef,
    });

    expect(String(ref)).toMatch(
      /^routeRef\{id=test.ref,at='.*collectRouteIds\.test\.ts.*'\}$/,
    );
    expect(String(extRef)).toMatch(
      /^externalRouteRef\{id=test.extRef,at='.*collectRouteIds\.test\.ts.*'\}$/,
    );
  });

  it('should report duplicate route IDs', () => {
    const ref = createRouteRef();
    const extRef = createExternalRouteRef();

    collectRouteIds(
      [
        createFrontendPlugin({
          pluginId: 'test',
          routes: { 'mid.ref': ref },
          externalRoutes: { 'mid.extRef': extRef },
        }),
        createFrontendPlugin({
          pluginId: 'test.mid',
          routes: { ref },
          externalRoutes: { extRef },
        }),
      ],
      collector,
    );

    expect(collector.collectErrors()).toEqual([
      {
        code: 'ROUTE_DUPLICATE',
        message:
          "Duplicate route id 'test.mid.ref' encountered while collecting routes",
        context: { routeId: 'test.mid.ref' },
      },
      {
        code: 'ROUTE_DUPLICATE',
        message:
          "Duplicate external route id 'test.mid.extRef' encountered while collecting routes",
        context: { routeId: 'test.mid.extRef' },
      },
    ]);
  });
});
