/*
 * Copyright 2024 The Backstage Authors
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
import React, { lazy } from 'react';
import { RouteRef } from '../routing';
import { coreExtensionData, createExtensionBlueprint } from '../wiring';
import { ExtensionBoundary } from '../components';

/**
 * Createx extensions that are routable React page components.
 *
 * @public
 */
export const PageBlueprint = createExtensionBlueprint({
  kind: 'page',
  attachTo: { id: 'app/routes', input: 'routes' },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.routeRef.optional(),
  ],
  config: {
    schema: {
      path: z => z.string().optional(),
    },
  },
  *factory(
    {
      defaultPath,
      loader,
      routeRef,
    }: {
      defaultPath: string;
      loader: () => Promise<JSX.Element>;
      routeRef?: RouteRef;
    },
    { config, node },
  ) {
    const ExtensionComponent = lazy(() =>
      loader().then(element => ({ default: () => element })),
    );

    yield coreExtensionData.routePath(config.path ?? defaultPath);
    yield coreExtensionData.reactElement(
      <ExtensionBoundary node={node}>
        <ExtensionComponent />
      </ExtensionBoundary>,
    );

    if (routeRef) {
      yield coreExtensionData.routeRef(routeRef);
    }
  },
});

const homePage = PageBlueprint.make({
  params: {
    defaultPath: '/home',
    loader: async () => <h1>Home</h1>,
  },
});

const homePlugin = createPlugin({
  id: 'asd',
  extensions: [homePage],
});

// overrides-package locally

/* 

# TODO
- [ ] Decorate getExtension(...) extension definitions with a namespace
- [ ] Implement plugin.override([...])

*/

// import plugin from '@backstage/plugin-home';

// export const exp1 = plugin.override([
//   plugin.getExtension('page:home').override({
//     *factory(originalFactory) {
//       yield* originalFactory();
//       yield coreExtensionData.routePath('/backstage');
//       // return [...originalFactory(), coreExtensionData.routePath('/backstage')];
//       // return originalFactory({
//       //   defaultPath: '/backstage',
//       // });
//     },
//   }),
//   PageBlueprint.make({
//     name: 'home',
//     params: {
//       defaultPath: '/home',
//       loader: async () => <h1>Home</h1>,
//     },
//   })
// ]);

// // kind:namespace/name
// // entity-card:github/issues
// // entity-card:github/pull-requests
// // page:catalog

// export const exp2 = createExtensionOverrides({
//   extensions: [
//     homePlugin.getExtension('page:home').override({
//       // namespace: 'home',
//       *factory(originalFactory) {
//         yield* originalFactory();
//         yield coreExtensionData.routePath('/backstage');
//         // return [...originalFactory(), coreExtensionData.routePath('/backstage')];
//         // return originalFactory({
//         //   defaultPath: '/backstage',
//         // });
//       },
//     })
//   ]
// })
