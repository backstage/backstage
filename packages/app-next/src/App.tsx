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
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import homePlugin, {
  titleExtensionDataRef,
} from '@backstage/plugin-home/alpha';

import {
  coreExtensionData,
  createExtension,
  createApiExtension,
  createExtensionOverrides,
  BackstagePlugin,
} from '@backstage/frontend-plugin-api';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import { homePage } from './HomePage';
import { collectLegacyRoutes } from '@backstage/core-compat-api';
import { FlatRoutes } from '@backstage/core-app-api';
import { Route } from 'react-router';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import { createApiFactory, configApiRef } from '@backstage/core-plugin-api';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { AppsConfig } from '@scalprum/core';
import { initialize, AppsConfig, processManifest } from '@scalprum/core';
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

const homePageExtension = createExtension({
  id: 'myhomepage',
  attachTo: { id: 'home', input: 'props' },
  output: {
    children: coreExtensionData.reactElement,
    title: titleExtensionDataRef,
  },
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

type ExtendedScalprumConfig = AppsConfig<{
  assetsHost: string;
  importModule: string;
}>;
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
    importModule: 'TechRadar',
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

const scalprum = initialize({
  appsConfig: scalprumConfig,
  pluginLoaderOptions,
});

const collectedLegacyPlugins = collectLegacyRoutes(
  <FlatRoutes>
    <Route path="/catalog-import" element={<CatalogImportPage />} />
  </FlatRoutes>,
);

const app = createApp({
  featureLoader: async () => {
    const initManifest = Object.values(scalprumConfig).map(
      ({ manifestLocation, name, importModule }) =>
        processManifest(manifestLocation!, name, importModule),
    );
    await Promise.all(initManifest);
    const plugins = await Promise.all(
      Object.values(scalprumConfig).map(({ name, importModule }) =>
        scalprum.pluginStore.getExposedModule<{ default: BackstagePlugin }>(
          name,
          importModule,
        ),
      ),
    );
    return plugins.map(({ default: plugin }) => plugin);
  },
  features: [
    graphiqlPlugin,
    pagesPlugin,
    techdocsPlugin,
    userSettingsPlugin,
    homePlugin,
    ...collectedLegacyPlugins,
    createExtensionOverrides({
      extensions: [homePageExtension, scmAuthExtension, scmIntegrationApi],
    }),
  ],
  bindRoutes({ bind }) {
    bind(pagesPlugin.externalRoutes, { pageX: pagesPlugin.routes.pageX });
  },
});

// const legacyApp = createLegacyApp({ plugins: [legacyGraphiqlPlugin] });

const root = app.createRoot();

export default root;

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
