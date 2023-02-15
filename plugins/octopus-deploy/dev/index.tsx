import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { octopusDeployPlugin, OctopusDeployPage } from '../src/plugin';

createDevApp()
  .registerPlugin(octopusDeployPlugin)
  .addPage({
    element: <OctopusDeployPage />,
    title: 'Root Page',
    path: '/octopus-deploy'
  })
  .render();
