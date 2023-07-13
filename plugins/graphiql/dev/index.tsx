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

import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  githubAuthApiRef,
  errorApiRef,
  IconComponent,
} from '@backstage/core-plugin-api';
import GraphiQLIcon from '../src/assets/graphiql.icon.svg';
import {
  graphiqlPlugin,
  GraphQLEndpoints,
  graphQlBrowseApiRef,
  GraphiQLPage,
} from '../src';
// import * as orgPlugin from '@backstage/plugin-org';

// console.log(`DEBUG: orgPlugin=`, orgPlugin);

// // (process.env.EXTRA_PACKAGE_IMPORTS as string[]).map(name => require(name))
// console.log(
//   `DEBUG: process.env.EXTRA_PACKAGE_IMPORTS=`,
//   process.env.EXTRA_PACKAGE_IMPORTS,
// );

// require.ensure(process.env.EXTRA_PACKAGE_IMPORTS as string[], innerRequire => {
//   console.log(`DEBUG: innerRequire=`, innerRequire);
//   const path3 = require.resolve('@backstage/plugin-org');
//   console.log(`DEBUG: path3=`, path3);
//   const loadedModules = (process.env.EXTRA_PACKAGE_IMPORTS as string[]).map(
//     name => console.log('require', name) || require(name),
//   );
//   console.log(`DEBUG: loadedModules=`, loadedModules);
// });

console.log(process.env);
console.log(
  `DEBUG: process.env.EXTRA_PACKAGE_IMPORTS=`,
  process.env.EXTRA_PACKAGE_IMPORTS,
);
// const orgPlugin = require([
//   '@backstage/plugin-org',
//   '@backstage/plugin-todo',
// ], modules => {
//   console.log(`DEBUG: modules=`, modules);
// });
// require.ensure(
//   process.env.EXTRA_PACKAGE_IMPORTS,
//   innerRequire => {
//     console.log(
//       `DEBUG: module1=`,
//       require(process.env.EXTRA_PACKAGE_IMPORTS[0]),
//     );
//     // console.log(
//     //   `DEBUG: module2=`,
//     //   innerRequire(require.resolve('@backstage/plugin-todo')),
//     // );
//   },
//   err => console.error('ERROR CALLBACK: ', err),
// );

// console.log(`DEBUG: orgPlugin=`, orgPlugin);

// const orgPlugin2 = require(process.env.EXTRA_PACKAGE_IMPORTS, modules => {
//   console.log(`DEBUG: modules=`, modules);
// });
// console.log(`DEBUG: orgPlugin2=`, orgPlugin2);
// __webpack_require__(
//   process.env.EXTRA_PACKAGE_IMPORTS as string[],
//   loadedModules => {
//     console.log(`DEBUG: loadedModules=`, loadedModules);
//   },
// );
// require.context()

createDevApp()
  .registerPlugin(graphiqlPlugin)
  .registerApi({
    api: graphQlBrowseApiRef,
    deps: {
      errorApi: errorApiRef,
      githubAuthApi: githubAuthApiRef,
    },
    factory({ errorApi, githubAuthApi }) {
      return GraphQLEndpoints.from([
        GraphQLEndpoints.github({
          id: 'github',
          title: 'GitHub',
          errorApi,
          githubAuthApi,
        }),
        GraphQLEndpoints.create({
          id: 'gitlab',
          title: 'GitLab',
          url: 'https://gitlab.com/api/graphql',
        }),
        GraphQLEndpoints.create({
          id: 'countries',
          title: 'Countries',
          url: 'https://countries.trevorblades.com/',
        }),
      ]);
    },
  })
  .addPage({
    title: 'GraphiQL',
    icon: GraphiQLIcon as IconComponent,
    element: <GraphiQLPage />,
  })
  .render();
