import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { dashboardPlugin, DashboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(dashboardPlugin)
  .addPage({
    element: <DashboardPage />,
    title: 'Root Page',
    path: '/dashboard'
  })
  .render();
