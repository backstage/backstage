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

import React from 'react';

import {
  coreExtensionData,
  createExtensionDataRef,
  createExtensionInput,
  createPageExtension,
  createPlugin,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import { compatWrapper } from '@backstage/core-compat-api';
import {
  PageExtensionBlueprint,
  createNewPageExtension,
} from '@backstage/frontend-plugin-api/src/extensions/createPageExtension';

const rootRouteRef = createRouteRef();

/**
 * @alpha
 */
export const titleExtensionDataRef = createExtensionDataRef<string>().with({
  id: 'title',
});

const homePage = createNewPageExtension({
  defaultPath: '/home',
  routeRef: rootRouteRef,
  inputs: {
    props: createExtensionInput(
      [
        coreExtensionData.reactElement.optional(),
        titleExtensionDataRef.optional(),
      ],

      {
        singleton: true,
        optional: true,
      },
    ),
  },
  loader: ({ inputs }) =>
    import('./components/').then(m =>
      compatWrapper(
        <m.HomepageCompositionRoot
          children={inputs.props?.get(coreExtensionData.reactElement)}
          title={inputs.props?.get(titleExtensionDataRef)}
        />,
      ),
    ),
});

// const homePage2 = PageExtensionBlueprint.make({
//   inputs: {
//     props: createExtensionInput(
//       [
//         coreExtensionData.reactElement.optional(),
//         titleExtensionDataRef.optional(),
//       ],
//       {
//         singleton: true,
//         optional: true,
//       },
//     ),
//   },
//   factory(origFactory, { config, inputs, node }) {
//     return origFactory({
//       defaultPath: '/home',
//       routeRef: rootRouteRef,
//       loader: () =>
//         import('./components/').then(m =>
//           compatWrapper(
//             <m.HomepageCompositionRoot
//               children={inputs.props?.[0].get(coreExtensionData.reactElement)}
//               title={inputs.props?.[0].get(coreExtensionData.reactElement}
//             />,
//           ),
//   },
// });

/**
 * @alpha
 * This will not be the way to export extensions eventually,
 * will be something like `homePlugin.extensions.homePage` or `homePlugin.extensions.get('page')`
 * Just haven't worked out a nice way to fix the types yet
 */
export const extensions = { homePage };

/**
 * @alpha
 */
export default createPlugin({
  id: 'home',
  extensions: [homePage],
});
