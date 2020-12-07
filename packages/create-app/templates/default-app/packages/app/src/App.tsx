import React from 'react';
import {
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SidebarPage,
  createRouteRef,
} from '@backstage/core';
import { apis } from './apis';
import * as plugins from './plugins';
import { AppSidebar } from './sidebar';
import { Route, Routes, Navigate } from 'react-router';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { Router as RegisterComponentRouter } from '@backstage/plugin-register-component';
import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';

import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const catalogRouteRef = createRouteRef({
  path: '/catalog',
  title: 'Service Catalog',
});


const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <Routes>
          <Navigate key="/" to="/catalog" />
          <Route
            path="/catalog/*"
            element={<CatalogRouter EntityPage={EntityPage} />}
          />
          <Route path="/docs/*" element={<DocsRouter />} />
          <Route
            path="/tech-radar"
            element={<TechRadarRouter width={1500} height={800} />}
          />
          <Route
            path="/register-component"
            element={<RegisterComponentRouter catalogRouteRef={catalogRouteRef} />}
          />
          {deprecatedAppRoutes}
        </Routes>
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
