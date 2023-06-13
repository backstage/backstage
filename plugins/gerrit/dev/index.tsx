import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { gerritPlugin, EntityGerritReviewsCard } from '../src/plugin';

createDevApp()
  .registerPlugin(gerritPlugin)
  .addPage({
    element: <EntityGerritReviewsCard />,
    title: 'Root Page',
    path: '/gerrit'
  })
  .render();
