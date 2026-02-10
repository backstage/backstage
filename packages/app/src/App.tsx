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

import { createApp } from '@backstage/frontend-defaults';
import { pagesPlugin } from './examples/pagesPlugin';
import notFoundErrorPage from './examples/notFoundErrorPageExtension';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import homePlugin from '@backstage/plugin-home/alpha';

import { createFrontendModule } from '@backstage/frontend-plugin-api';
import {
  HomePageLayoutBlueprint,
  type HomePageLayoutProps,
} from '@backstage/plugin-home-react/alpha';
import { Fragment } from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import {
  CustomHomepageGrid,
  WelcomeTitle,
  HeaderWorldClock,
  type ClockConfig,
} from '@backstage/plugin-home';
import {
  techdocsPlugin,
  TechDocsIndexPage,
  TechDocsReaderPage,
  EntityTechdocsContent,
} from '@backstage/plugin-techdocs';
import appVisualizerPlugin from '@backstage/plugin-app-visualizer';
import { convertLegacyAppRoot } from '@backstage/core-compat-api';
import { FlatRoutes } from '@backstage/core-app-api';
import { Route } from 'react-router';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import { convertLegacyPlugin } from '@backstage/core-compat-api';
import { convertLegacyPageExtension } from '@backstage/core-compat-api';
import { convertLegacyEntityContentExtension } from '@backstage/plugin-catalog-react/alpha';
import { pluginInfoResolver } from './pluginInfoResolver';
import { appModuleNav } from './modules/appModuleNav';
import devtoolsPlugin from '@backstage/plugin-devtools/alpha';
import { unprocessedEntitiesDevToolsContent } from '@backstage/plugin-catalog-unprocessed-entities/alpha';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import InfoIcon from '@material-ui/icons/Info';

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

/**
 * TechDocs does support the new frontend system so this conversion is not
 * strictly necessary, but it's left here to provide a demo of the utilities for
 * converting legacy plugins.
 */
const convertedTechdocsPlugin = convertLegacyPlugin(techdocsPlugin, {
  extensions: [
    // TODO: We likely also need a way to convert an entire <Route> tree similar to collectLegacyRoutes
    convertLegacyPageExtension(TechDocsIndexPage, {
      name: 'index',
      path: '/docs',
    }),
    convertLegacyPageExtension(TechDocsReaderPage, {
      path: '/docs/:namespace/:kind/:name/*',
    }),
    convertLegacyEntityContentExtension(EntityTechdocsContent),
  ],
});

const clockConfigs: ClockConfig[] = [
  { label: 'NYC', timeZone: 'America/New_York' },
  { label: 'UTC', timeZone: 'UTC' },
  { label: 'STO', timeZone: 'Europe/Stockholm' },
  { label: 'TYO', timeZone: 'Asia/Tokyo' },
];

const customHomePageModule = createFrontendModule({
  pluginId: 'home',
  extensions: [
    HomePageLayoutBlueprint.make({
      params: {
        loader: async () =>
          function CustomHomePageLayout({ widgets }: HomePageLayoutProps) {
            return (
              <Page themeId="home">
                <Header title={<WelcomeTitle />} pageTitleOverride="Home">
                  <HeaderWorldClock clockConfigs={clockConfigs} />
                </Header>
                <Content>
                  <CustomHomepageGrid>
                    {widgets.map((widget, index) => (
                      <Fragment key={widget.name ?? index}>
                        {widget.component}
                      </Fragment>
                    ))}
                  </CustomHomepageGrid>
                </Content>
              </Page>
            );
          },
      },
    }),
  ],
});

// customize catalog example
const customizedCatalog = catalogPlugin.withOverrides({
  extensions: [
    catalogPlugin.getExtension('entity-content:catalog/overview').override({
      params: {
        icon: <InfoIcon />,
      },
    }),
  ],
});

const notFoundErrorPageModule = createFrontendModule({
  pluginId: 'app',
  extensions: [notFoundErrorPage],
});

const devtoolsPluginUnprocessed = createFrontendModule({
  pluginId: 'catalog-unprocessed-entities',
  extensions: [unprocessedEntitiesDevToolsContent],
});

const collectedLegacyPlugins = convertLegacyAppRoot(
  <FlatRoutes>
    <Route path="/catalog-import" element={<CatalogImportPage />} />
  </FlatRoutes>,
);

const app = createApp({
  features: [
    customizedCatalog,
    pagesPlugin,
    convertedTechdocsPlugin,
    userSettingsPlugin,
    homePlugin,
    appVisualizerPlugin,
    kubernetesPlugin,
    notFoundErrorPageModule,
    appModuleNav,
    customHomePageModule,
    devtoolsPlugin,
    devtoolsPluginUnprocessed,
    ...collectedLegacyPlugins,
  ],
  advanced: {
    pluginInfoResolver,
  },
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
//     <Route
//       path="/catalog"
//       element={
//        <CatalogIndexPage
//          pagination={{ mode: 'offset', limit: 20 }}
//          exportSettings={{ enableExport: true }}
//        />
//      }
//    />
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
