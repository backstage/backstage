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

import React, { ComponentType } from 'react';
import { createApp } from '@backstage/frontend-app-api';
import { pagesPlugin } from './examples/pagesPlugin';
import graphiqlPlugin from '@backstage/plugin-graphiql/alpha';
import techRadarPlugin from '@backstage/plugin-tech-radar/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import homePlugin, {
  titleExtensionDataRef,
} from '@backstage/plugin-home/alpha';

import {
  coreExtensionData,
  createExtension,
  createApiExtension,
  createExtensionOverrides,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import { homePage } from './HomePage';
import { collectLegacyRoutes } from '@backstage/core-compat-api';
import { FlatRoutes } from '@backstage/core-app-api';
import { Route } from 'react-router';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import {
  createApiFactory,
  configApiRef,
  SignInPageProps,
} from '@backstage/core-plugin-api';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import Button from '@material-ui/core/Button';

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

const signInPageComponentDataRef =
  createExtensionDataRef<ComponentType<SignInPageProps>>('core.signInPage');

const signInPage = createExtension({
  id: 'signInPage',
  attachTo: { id: 'core', input: 'signInPage' },
  output: {
    component: signInPageComponentDataRef,
  },
  factory() {
    return {
      component: (props: SignInPageProps) => (
        <div>
          <h1>Sign in page</h1>
          <div>
            <Button
              onClick={() =>
                props.onSignInSuccess({
                  getProfileInfo: async () => ({
                    email: 'guest@example.com',
                    displayName: 'Guest',
                  }),
                  getBackstageIdentity: async () => ({
                    type: 'user',
                    userEntityRef: 'user:default/guest',
                    ownershipEntityRefs: ['user:default/guest'],
                  }),
                  getCredentials: async () => ({}),
                  signOut: async () => {},
                })
              }
            >
              Sign in
            </Button>
          </div>
        </div>
      ),
    };
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

const collectedLegacyPlugins = collectLegacyRoutes(
  <FlatRoutes>
    <Route path="/catalog-import" element={<CatalogImportPage />} />
  </FlatRoutes>,
);

const app = createApp({
  features: [
    graphiqlPlugin,
    pagesPlugin,
    techRadarPlugin,
    techdocsPlugin,
    userSettingsPlugin,
    homePlugin,
    ...collectedLegacyPlugins,
    createExtensionOverrides({
      extensions: [
        homePageExtension,
        scmAuthExtension,
        scmIntegrationApi,
        signInPage,
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
