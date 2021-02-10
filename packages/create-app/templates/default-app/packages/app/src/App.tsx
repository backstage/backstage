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
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';
import { SearchPage as SearchRouter } from '@backstage/plugin-search';
import { Router as SettingsRouter } from '@backstage/plugin-user-settings';

import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <FlatRoutes>
          <Navigate key="/" to="/catalog" />
          <Route
            path="/catalog"
            element={<CatalogRouter EntityPage={EntityPage} />}
          />
          <Route path="/docs" element={<DocsRouter />} />
          <Route
            path="/tech-radar"
            element={<TechRadarRouter width={1500} height={800} />}
          />
          <Route path="/catalog-import" element={<CatalogImportPage />} />
          <Route
            path="/search"
            element={<SearchRouter/>}
          />
          <Route path="/settings" element={<SettingsRouter />} />
          {deprecatedAppRoutes}
        </FlatRoutes>
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
