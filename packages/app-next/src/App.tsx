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
import { createApp } from '@backstage/frontend-app-api';
import { pagesPlugin } from './examples/pagesPlugin';
import notFoundErrorPage from './examples/notFoundErrorPageExtension';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import homePlugin, {
  extensions,
  titleExtensionDataRef,
} from '@backstage/plugin-home/alpha';

import {
  coreExtensionData,
  createExtension,
  createApiExtension,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import appVisualizerPlugin from '@backstage/plugin-app-visualizer';
import { homePage } from './HomePage';
import { convertLegacyApp } from '@backstage/core-compat-api';
import { FlatRoutes } from '@backstage/core-app-api';
import { Route } from 'react-router';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import { createApiFactory, configApiRef } from '@backstage/core-plugin-api';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import { signInPageOverrides } from './overrides/SignInPage';

/*

# Notes

TODO:
 - proper createApp
 - connect extensions and plugins, provide method?
 - higher level API for creating standard extensions + higher order framework API for creating those?
 - extension config schema + validation
 - figure out how to resolve configured extension ref to runtime value, e.g. '@backstage/plugin-graphiql#GraphiqlPage'
 - make sure all shorthands work + tests
 - figure out package structure / how to ship, frontend-plugin-api/frontend-app-api
 - figure out routing, useRouteRef in the new system
 - Legacy plugins / interop
 - dynamic updates, runtime API

*/

/* core */

// const discoverPackages = async () => {
//   // stub for now, deferring package discovery til later
//   return ['@backstage/plugin-graphiql'];
// };

/* graphiql package */

/* app.tsx */

// const homePageExtension = createExtension({
//   name: 'myhomepage',
//   attachTo: { id: 'page:home', input: 'props' },
//   output: {
//     children: coreExtensionData.reactElement,
//     title: titleExtensionDataRef,
//   },
//   factory() {
//     return { children: homePage, title: 'just a title' };
//   },
// });

// const homePage = createPageExtension({
//   defaultPath: '/home',
//   routeRef: rootRouteRef,
//   inputs: {
//     props: createExtensionInput(
//       {
//         children: coreExtensionData.reactElement.optional(),
//         title: titleExtensionDataRef.optional(),
//       },

//       {
//         singleton: true,
//         optional: true,
//       },
//     ),
//   },
//   loader: ({ inputs }) =>
//     import('./components/').then(m =>
//       compatWrapper(
//         <m.HomepageCompositionRoot
//           children={inputs.props?.output.children}
//           title={inputs.props?.output.title}
//         />,
//       ),
//     ),
// });

const homePageExtension = extensions.homePage.override({
  factory() {
    return { children: homePage, title: 'just a title' };
  },
});

const scmAuthExtension = createApiExtension({
  factory: ScmAuth.createDefaultApiFactory(),
});

const scmIntegrationApi = createApiExtension({
  factory: createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
});

const collectedLegacyPlugins = convertLegacyApp(
  <FlatRoutes>
    <Route path="/catalog-import" element={<CatalogImportPage />} />
  </FlatRoutes>,
);

const app = createApp({
  features: [
    pagesPlugin,
    techdocsPlugin,
    userSettingsPlugin,
    homePlugin,
    appVisualizerPlugin,
    kubernetesPlugin,
    signInPageOverrides,
    ...collectedLegacyPlugins,
    createExtensionOverrides({
      extensions: [
        homePageExtension,
        scmAuthExtension,
        scmIntegrationApi,
        notFoundErrorPage,
      ],
    }),
  ],
  /* Handled through config instead */
  // bindRoutes({ bind }) {
  //   bind(pagesPlugin.externalRoutes, { pageX: pagesPlugin.routes.pageX });
  // },
});

// const legacyApp = createLegacyApp({ plugins: [legacyGraphiqlPlugin] });

export default app.createRoot();

// const routes = (
//   <FlatRoutes>
//     {/* <Route path="/" element={<Navigate to="catalog" />} />
//     <Route path="/catalog" element={<CatalogIndexPage />} />
//     <Route
//       path="/catalog/:namespace/:kind/:name"
//       element={<CatalogEntityPage />}
//     >
//       <EntityLayout>
//         <EntityLayout.Route path="/" title="Overview">
//           <Grid container spacing={3} alignItems="stretch">
//             <Grid item md={6} xs={12}>
//               <EntityAboutCard variant="gridItem" />
//             </Grid>

//             <Grid item md={4} xs={12}>
//               <EntityLinksCard />
//             </Grid>
//           </Grid>
//         </EntityLayout.Route>

//         <EntityLayout.Route path="/todos" title="TODOs">
//           <EntityTodoContent />
//         </EntityLayout.Route>
//       </EntityLayout>
//     </Route>
//     <Route
//       path="/catalog-import"
//       element={
//           <CatalogImportPage />
//       }
//     /> */}
//     {/* <Route
//       path="/tech-radar"
//       element={<TechRadarPage width={1500} height={800} />}
//     /> */}
//     <Route path="/graphiql" element={<GraphiQLPage />} />
//   </FlatRoutes>
// );

// export default app.createRoot(
//   <>
//     {/* <AlertDisplay transientTimeoutMs={2500} />
//     <OAuthRequestDialog /> */}
//     <AppRouter>{routes}</AppRouter>
//   </>,
// );
