import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { cortexPlugin, CortexPage } from '../src/plugin';

createDevApp()
  .registerPlugin(cortexPlugin)
  .addPage({
    element: <CortexPage />,
    title: 'Root Page',
    path: '/cortex'
  })
  .render();
