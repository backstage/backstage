import React from 'react';
import {
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SidebarPage,
  FlatRoutes,
} from '@backstage/core';
import { apis } from './apis';
import * as plugins from './plugins';
import { AppSidebar } from './sidebar';
import { Route, Navigate } from 'react-router';
import {
  catalogPlugin,
  CatalogIndexPage,
  CatalogEntityPage,
} from '@backstage/plugin-catalog';
import { TechdocsPage } from '@backstage/plugin-techdocs';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import { SearchPage } from '@backstage/plugin-search';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { ApiExplorerPage } from '@backstage/plugin-api-docs';

import { EntityPage } from './components/catalog/EntityPage';
import { scaffolderPlugin, ScaffolderPage } from '@backstage/plugin-scaffolder';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
  }
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <FlatRoutes>
          <Navigate key="/" to="/catalog" />
          <Route path="/catalog" element={<CatalogIndexPage />} />
          <Route
            path="/catalog/:namespace/:kind/:name"
            element={<CatalogEntityPage />}
          >
            <EntityPage />
          </Route>
          <Route path="/docs" element={<TechdocsPage />} />
          <Route path="/create" element={<ScaffolderPage />} />
          <Route path="/api-docs" element={<ApiExplorerPage />} />
          <Route
            path="/tech-radar"
            element={<TechRadarPage width={1500} height={800} />}
          />
          <Route path="/catalog-import" element={<CatalogImportPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
        </FlatRoutes>
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
