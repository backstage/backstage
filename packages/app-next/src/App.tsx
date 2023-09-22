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
import graphiqlPlugin from '@backstage/plugin-graphiql/alpha';
import { ScalprumProvider } from '@scalprum/react-core';
import { AppsConfig } from '@scalprum/core';
import { PluginLoaderOptions } from '@openshift/dynamic-plugin-sdk';

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

const app = createApp({
  plugins: [graphiqlPlugin, pagesPlugin],
  // bindRoutes({ bind }) {
  //   bind(catalogPlugin.externalRoutes, {
  //     createComponent: scaffolderPlugin.routes.root,
  //   });
  //   bind(scaffolderPlugin.externalRoutes, {
  //     registerComponent: catalogImportPlugin.routes.importPage,
  //   });
  // },
});

// const legacyApp = createLegacyApp({ plugins: [legacyGraphiqlPlugin] });

const root = app.createRoot();

type ExtendedScalprumConfig = AppsConfig<{ assetsHost: string }>;
const scalprumConfig: ExtendedScalprumConfig = {
  'backstage.dynamic-frontend-plugin-sample': {
    name: 'backstage.dynamic-frontend-plugin-sample',
    /**
     * The assetsHost is not core scalprum requirement.
     * Most likely the remote assets will come from the same origin in production environments or proxy will be used.
     * It is used in this case to show the possibility of loading assets from different remote while using the
     * `auto` Webpack public pat configuration option.
     *  */
    assetsHost: 'http://localhost:8004',
    manifestLocation: 'http://localhost:8004/plugin-manifest.json',
  },
};

const pluginLoaderOptions: PluginLoaderOptions = {
  postProcessManifest(manifest) {
    return {
      ...manifest,
      loadScripts: manifest.loadScripts.map(
        // the entry script strings in manifest do not include origin/baseUrl and has to be added at runtime
        script => `${scalprumConfig[manifest.name].assetsHost}/${script}`,
      ),
    };
  },
};

const ScalprumRoot = () => {
  /**
   * Scalprum provider needs metadata about the dynamic plugins.
   * Its API is accessed during runtime to load the remote containers into the browser.
   */
  return (
    <ScalprumProvider
      pluginSDKOptions={{
        pluginLoaderOptions,
      }}
      config={scalprumConfig}
    >
      {root}
    </ScalprumProvider>
  );
};

export default <ScalprumRoot />;

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
