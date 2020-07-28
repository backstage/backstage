import React from 'react';

import {
  extensions as catalogExtensionPoints,
  entityRoute,
} from '@backstage/plugin-catalog';
import { registerExtension, createRouteRef } from '@backstage/core';
import { WorkflowRunsTable } from '@backstage/plugin-github-actions/src/components/WorkflowRunsTable';
import {
  buildRouteRef,
  rootRouteRef,
} from '@backstage/plugin-github-actions/src/plugin';
import { WorkflowRunDetails } from '@backstage/plugin-github-actions/src/components/WorkflowRunDetails';
import { matchRoutes } from 'react-router';
import { Widget } from '@backstage/plugin-github-actions/src/components/Widget/Widget';
import { Grid } from '@material-ui/core';

const ciRoute = createRouteRef({ path: 'ci-cd', title: 'CI/CD' });
const ciInnerRoute = createRouteRef({ path: 'ci-cd/:id', title: 'CI/CD' });
const entitySupportsGithubActions = entity => {
  const annotation =
    entity?.metadata?.annotations?.['backstage.io/github-actions-id'];
  return annotation !== '' && Boolean(annotation) ? true : undefined;
};
registerExtension(
  catalogExtensionPoints.subrouteExtensionPoint,
  entity =>
    entitySupportsGithubActions(entity) && {
      route: ciRoute,
      component: WorkflowRunsTable,
    },
);
registerExtension(
  catalogExtensionPoints.subrouteExtensionPoint,
  entity =>
    entitySupportsGithubActions(entity) && {
      route: ciInnerRoute,
      component: WorkflowRunDetails,
    },
);

registerExtension(
  catalogExtensionPoints.tabsExtensionPoint,
  entity =>
    entity && {
      id: 'overview',
      label: 'Overview',
      route: createRouteRef({ path: 'overview', title: 'Overview' }),
    },
);
registerExtension(
  catalogExtensionPoints.tabsExtensionPoint,
  entity =>
    entitySupportsGithubActions(entity) && {
      id: 'ci-cd',
      label: 'CI/CD',
      route: ciRoute,
      isActive: currentLocation => {
        const routes = [
          { path: `${entityRoute.path.slice(0, -2)}/${ciInnerRoute.path}` },
          { path: `${entityRoute.path.slice(0, -2)}/${ciRoute.path}` },
        ];
        console.log({ routes, currentLocation });
        return Boolean(matchRoutes(routes, currentLocation));
      },
    },
);
rootRouteRef.override({ path: '' });
buildRouteRef.override({ path: ':id' });
registerExtension(
  catalogExtensionPoints.tabsExtensionPoint,
  entity =>
    entity && {
      id: 'settings',
      label: 'Settings',
      route: createRouteRef({ path: 'settings', title: 'Settings' }),
    },
);

registerExtension(
  catalogExtensionPoints.overviewCardExtensionPoint,
  entity =>
    entitySupportsGithubActions(entity) && {
      component: () => (
        <Grid item xs={3}>
          <Widget entity={entity} branch="master" />
        </Grid>
      ),
    },
);
