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
  createExternalRouteRef,
  createFrontendModule,
  createFrontendPlugin,
  createRouteRef,
  FrontendFeature,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { findSyncPartMismatch } from './syncPart';

const rootRouteRef = createRouteRef();
const linkRef = createExternalRouteRef();
const page = PageBlueprint.make({
  params: { path: '/test', loader: async () => <div /> },
});
const otherPage = PageBlueprint.make({
  name: 'other',
  params: { path: '/other', loader: async () => <div /> },
});
const plugin = createFrontendPlugin({
  pluginId: 'test',
  routes: { root: rootRouteRef },
  externalRoutes: { link: linkRef },
  extensions: [page, otherPage],
});

describe('findSyncPartMismatch', () => {
  it.each<[string, FrontendFeature, string | undefined]>([
    [
      'agrees',
      createFrontendPlugin({
        pluginId: 'test',
        routes: { root: rootRouteRef },
        externalRoutes: { link: linkRef },
        extensions: [page],
      }),
      undefined,
    ],
    [
      'is a module',
      createFrontendModule({ pluginId: 'test', extensions: [] }),
      'its sync export is not a frontend plugin',
    ],
    [
      'is another plugin',
      createFrontendPlugin({ pluginId: 'other', extensions: [] }),
      "its sync export is for the 'other' plugin, but the main export is for the 'test' plugin",
    ],
    [
      'has an extra extension',
      createFrontendPlugin({
        pluginId: 'test',
        extensions: [
          PageBlueprint.make({
            name: 'extra',
            params: { path: '/extra', loader: async () => <div /> },
          }),
        ],
      }),
      "the 'page:test/extra' extension of its sync export is missing from the main export",
    ],
    [
      'has a copy of an extension',
      createFrontendPlugin({
        pluginId: 'test',
        extensions: [page.override({})],
      }),
      "the 'page:test' extension is defined differently in its sync and main exports, they must use the same extension object",
    ],
    [
      'has another route ref',
      createFrontendPlugin({
        pluginId: 'test',
        routes: { root: createRouteRef() },
        extensions: [],
      }),
      "the 'root' route ref in routes of its sync export is not the same as in the main export",
    ],
    [
      'has another external route ref',
      createFrontendPlugin({
        pluginId: 'test',
        externalRoutes: { link: createExternalRouteRef() },
        extensions: [],
      }),
      "the 'link' route ref in externalRoutes of its sync export is not the same as in the main export",
    ],
  ])('should tell when the sync export %s', (_name, sync, expected) => {
    expect(findSyncPartMismatch(plugin, sync)).toBe(expected);
  });
});
