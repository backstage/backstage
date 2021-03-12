import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { dfdsCapabilityPluginPlugin, DfdsCapabilityPluginPage } from '../src/plugin';

createDevApp()
  .registerPlugin(dfdsCapabilityPluginPlugin)
  .addPage({
    element: <DfdsCapabilityPluginPage />,
    title: 'Root Page',
  })
  .render();
