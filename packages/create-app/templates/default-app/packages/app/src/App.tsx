import React, { FC } from 'react';
import {
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SidebarPage,
} from '@backstage/core';
import { apis } from './apis';
import * as plugins from './plugins';
import { AppSidebar } from './sidebar';
import { Route, Routes, Navigate } from 'react-router';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <Routes>
          <Route
            path="/catalog/*"
            element={<CatalogRouter EntityPage={EntityPage} />}
          />
          <Route path="/docs/*" element={<DocsRouter />} />
          <Navigate key="/" to="/catalog" />
          {deprecatedAppRoutes}
        </Routes>
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
