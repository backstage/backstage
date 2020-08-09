import { createApp } from '@backstage/core';
import React, { FC } from 'react';
import { apis } from './apis';
import * as plugins from './plugins';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const AppRoutes = app.getRoutes();

const App: FC<{}> = () => (
  <AppProvider>
    <AppRouter>
      <AppRoutes />
    </AppRouter>
  </AppProvider>
);

export default App;
