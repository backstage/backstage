/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ErrorPage } from '@backstage/core';
import React from 'react';
import { Routes, Route } from 'react-router';
import {
  rootRoute as catalogRootRoute,
  CatalogPage,
  entityRoute as catalogEntityRoute,
  EntityPage,
  EntityMetadataCard,
} from '@backstage/plugin-catalog';
import {
  rootRouteRef as githubActionsRootRoute,
  projectRouteRef,
  buildRouteRef,
  WorkflowRunsPage,
  WorkflowRunDetailsPage,
  Widget as GithubActionsWidget,
} from '@backstage/plugin-github-actions';
import { ExplorePluginPage } from '@backstage/plugin-explore';
import { graphiQLRouteRef, GraphiQLPage } from '@backstage/plugin-graphiql';
import {
  rootRoute as scaffolderRootRoute,
  ScaffolderPage,
  templateRoute,
  TemplatePage,
} from '@backstage/plugin-scaffolder';
import {
  rootRouteRef as techdocsRootRoute,
  rootDocsRouteRef,
  TechDocsHome,
  Reader,
} from '@backstage/plugin-techdocs';
import {
  rootRoute as apiDocsRootRoute,
  ApiCatalogPage,
  entityRoute as apiDocsEntityRoute,
  ApiEntityPage,
} from '@backstage/plugin-api-docs';
import {
  circleCIRouteRef,
  App as CircleCiApp,
} from '@backstage/plugin-circleci';
import {
  gitOpsClusterListRoute,
  gitOpsClusterDetailsRoute,
  gitOpsClusterCreateRoute,
  ClusterList,
  ClusterPage,
  ProfileCatalog,
} from '@backstage/plugin-gitops-profiles';
import {
  DetailedViewPage,
  JenkinsBuildsWidget,
  JenkinsLastBuildWidget,
} from '@backstage/plugin-jenkins';
import {
  AuditList,
  AuditView,
  CreateAudit,
} from '@backstage/plugin-lighthouse';
import {
  rootRouteRef as newRelicRootRoute,
  NewRelicComponent,
} from '@backstage/plugin-newrelic';
import {
  rootRoute as registerComponentRootRoute,
  RegisterComponentPage,
} from '@backstage/plugin-register-component';
import {
  rootRoute as rollbarRootRoute,
  RollbarPage,
  RollbarProjectPage,
  rootProjectRoute,
} from '@backstage/plugin-rollbar';
import { SentryPluginPage, SentryIssuesWidget } from '@backstage/plugin-sentry';
import { RadarPage } from '@backstage/plugin-tech-radar';
import { WelcomePage } from '@backstage/plugin-welcome';
import { Grid } from '@material-ui/core';

export const pages = (
  <Routes>
    {/* @backstage/plugin-api-docs */}
    <Route path={apiDocsRootRoute.path} element={<ApiCatalogPage />} />
    <Route path={apiDocsEntityRoute.path} element={<ApiEntityPage />} />

    {/* @backstage/plugin-circleci */}
    <Route path={circleCIRouteRef.path} element={<CircleCiApp />} />

    {/* @backstage/plugin-gitops-profiles */}
    <Route path={gitOpsClusterListRoute.path} element={<ClusterList />} />
    <Route path={gitOpsClusterDetailsRoute.path} element={<ClusterPage />} />
    <Route path={gitOpsClusterCreateRoute.path} element={<ProfileCatalog />} />

    {/* @backstage/plugin-jenkins */}
    <Route path={buildRouteRef.path} element={<DetailedViewPage />} />

    {/* @backstage/plugin-lighthouse */}
    <Route path="/lighthouse" element={<AuditList />} />
    <Route path="/lighthouse/audit/:id" element={<AuditView />} />
    <Route path="/lighthouse/create-audit" element={<CreateAudit />} />

    {/* @backstage/plugin-newrelic */}
    <Route path={newRelicRootRoute.path} element={<NewRelicComponent />} />

    {/* @backstage/plugin-register-component */}
    <Route
      path={registerComponentRootRoute.path}
      element={<RegisterComponentPage />}
    />

    {/* @backstage/plugin-rollbar */}
    <Route path={rollbarRootRoute.path} element={<RollbarPage />} />
    <Route path={rootProjectRoute.path} element={<RollbarProjectPage />} />

    {/* @backstage/plugin-sentry */}
    <Route path="/sentry" element={<SentryPluginPage />} />

    {/* @backstage/plugin-tech-radar */}
    <Route path="/tech-radar" element={<RadarPage />} />

    {/* @backstage/plugin-welcome */}
    <Route path="/welcome" element={<WelcomePage />} />

    {/* plugins/explore/src/index.ts */}
    <Route path="/explore" element={<ExplorePluginPage />} />

    {/* plugins/github-actions/src/index.ts */}
    <Route path={githubActionsRootRoute.path} element={<WorkflowRunsPage />} />
    <Route path={projectRouteRef.path} element={<WorkflowRunsPage />} />
    <Route path={buildRouteRef.path} element={<WorkflowRunDetailsPage />} />

    {/* plugins/graphiql/src/index.ts */}
    <Route path={graphiQLRouteRef.path} element={<GraphiQLPage />} />

    {/* plugins/scaffolder/src/index.ts */}
    <Route path={scaffolderRootRoute.path} element={<ScaffolderPage />} />
    <Route path={templateRoute.path} element={<TemplatePage />} />

    {/* plugins/techdocs/src/index.ts */}
    <Route path={techdocsRootRoute.path} element={<TechDocsHome />} />
    <Route path={rootDocsRouteRef.path} element={<Reader />} />

    {/* plugins/catalog/src/index.ts */}
    <Route path={catalogRootRoute.path} element={<CatalogPage />} />
    <Route
      path={catalogEntityRoute.path}
      element={
        <EntityPage>
          {entity => (
            <Grid container spacing={3}>
              <Grid item sm={4}>
                <EntityMetadataCard entity={entity} />
              </Grid>
              {entity.metadata?.annotations?.[
                'backstage.io/jenkins-github-folder'
              ] && (
                <Grid item sm={4}>
                  <JenkinsLastBuildWidget entity={entity} branch="master" />
                </Grid>
              )}
              {entity.metadata?.annotations?.[
                'backstage.io/jenkins-github-folder'
              ] && (
                <Grid item sm={8}>
                  <JenkinsBuildsWidget entity={entity} />
                </Grid>
              )}
              {entity.metadata?.annotations?.[
                'backstage.io/github-actions-id'
              ] && (
                <Grid item sm={3}>
                  <GithubActionsWidget entity={entity} branch="master" />
                </Grid>
              )}
              <Grid item sm={8}>
                <SentryIssuesWidget
                  sentryProjectId="sample-sentry-project-id"
                  statsFor="24h"
                />
              </Grid>
            </Grid>
          )}
        </EntityPage>
      }
    />
    <Route
      element={<ErrorPage status="404" statusMessage="PAGE NOT FOUND" />}
    />
  </Routes>
);
