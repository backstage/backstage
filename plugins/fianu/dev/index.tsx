import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { fianuPlugin, FianuPage } from '../src/plugin';

createDevApp()
  .registerPlugin(fianuPlugin)
  .addPage({
    element: <FianuPage />,
    title: 'Root Page',
    path: '/fianu'
  })
  .render();
