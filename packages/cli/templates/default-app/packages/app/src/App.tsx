import { createApp } from '@backstage/core';
import React, { FC } from 'react';
import * as plugins from './plugins';

const app = createApp({
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
