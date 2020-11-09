// @ts-nocheck
/* eslint-disable react/jsx-no-undef */
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

import {
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
  createRouteRef,
} from '@backstage/core';
import React, { FC } from 'react';
import Root from './components/Root';
import * as plugins from './plugins';
import { apis } from './apis';
import { hot } from 'react-hot-loader/root';
import { providers } from './identityProviders';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { Router as GraphiQLRouter } from '@backstage/plugin-graphiql';
import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';
import { Router as LighthouseRouter } from '@backstage/plugin-lighthouse';
import { Router as RegisterComponentRouter } from '@backstage/plugin-register-component';
import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
import { Route, Routes, Navigate } from 'react-router';

import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
  routeBindings: [
    {
      routeRef: graphiQLRouteRef,
      path: '/graphiql-derp',
    },
    {
      routeRef: cicdRouteRef,
      component: () => <CiCdSwitcher />,
      // path: '/cicd',
    },
  ],
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const catalogRouteRef = createRouteRef({
  path: '/catalog',
  title: 'Service Catalog',
});

const AppRoutes = () => (
  <Routes>
    <Navigate key="/" to="/catalog" />
    <Route
      path={`${catalogRouteRef.path}/*`}
      element={<CatalogRouter EntityPage={EntityPage} />}
    />
    <Route path="/docs/*" element={<DocsRouter />} />
    <Route
      path="/tech-radar"
      element={<TechRadarRouter width={1500} height={800} />}
    />
    <Route path="/graphiql" element={<GraphiQLRouter />} />
    <Route path="/lighthouse/*" element={<LighthouseRouter />} />
    <Route
      path="/register-component"
      element={<RegisterComponentRouter catalogRouteRef={catalogRouteRef} />}
    />
    <Route path="/settings" element={<SettingsRouter />} />
    {...deprecatedAppRoutes}
  </Routes>
);

const linkToGraphiQLPlugin = useLink(
  entityRouteRef.link({
    kind: 'component',
    name: 'backstage',
    namespace: 'default',
  }),
  buildsRouteRef.link(),
);

export const GraphiQLRouter = plugin.anchorComponent({
  routeRef: graphiQLRouteRef,
  component: GraphiQLRouter,
});

// in the catalog plug

const CatalogPage = () => <div></div>;

export const CatalogRoute = plugin.anchorComponent({
  path: '/catalog',
  component: CatalogPage,
});

const CatalogPluginPage = () => {
  return (
    <Route
      path={`${catalogRouteRef.path}/*`}
      element={<CatalogRouter EntityPage={EntityPage} />}
    />
  );
};

// not in the catalog plugin

const StandardizedRoutingApp = () => (
  <Routes>
    <Plugin plugin={catalogPlugin} route="/catalog" />
    <CatalogPluginPage EntityPage={EntityPage} />
    <DocsPluginPage />
    <TechRadarPluginPage width={1500} height={800} />
    <GraphiQLPluginPage />
    <LighthousePluginPage />
    <RegisterComponentPluginPage catalogRouteRef={catalogRouteRef} />
    <SettingsPluginPage />

    <Navigate key="/" to="/catalog" />
    {...deprecatedAppRoutes}
  </Routes>
);

const RouteRefApp = () => (
  <Routes>
    <Plugin
      path="/catalog"
      plugin={catalogPlugin}
      page={CatalogPluginPage}
      EntityPage={EntityPage}
    />
    <Plugin path="/docs" plugin={DocsPluginPage} />
    <Plugin
      path="/tech-radar"
      plugin={TechRadarPluginPage}
      width={1500}
      height={800}
    />
    <Plugin path="/graphiql" plugin={GraphiQLPluginPage} />
    <Plugin path="/lighthouse" plugin={LighthousePluginPage} />
    <Plugin
      path="/register-component"
      plugin={RegisterComponentPluginPage}
      catalogRouteRef={catalogRouteRef}
    />
    <Plugin path="/settings" plugin={SettingsPluginPage} />



    {/* /entities/:kind/:namespace/:name */}
    <EntityRoute path="/entities">
      <EntityFilter filter={isKind("component")}>

        <EntityFilter filter={isType('service')}>
          <EntityPageLayout>
            <EntityTab path="/" title="Overview" element={<OverviewContent />} />
            <EntityTab path="/ci-cd" title="CI/CD" element={<CICDSwitcher />} />
            <EntityTab path="/sentry" title="Sentry" element={<SentryRouter />} />
            <EntityTab path="/api" title="API" element={<ApiDocsRouter />} />
            <EntityTab path="/docs" title="Docs" element={<DocsRouter />} />
            <EntityTab path="/kubernetes" title="Kubernetes" element={<KubernetesRouter />} />
            <EntityTab path="/pull-requests" title="Pull Requests" element={<PullRequestsRouter />} />
            <EntityTab path="/code-insights" title="Code Insights" element={<GitHubInsightsRouter />} />
          </EntityPageLayout>
        </EntityFilter>

        <EntityFilter filter={isType('website')}>
          <EntityPageLayout>
            <EntityTab path="/" title="Overview" element={<OverviewContent />} />
            <EntityTab path="/ci-cd" title="CI/CD" element={<CICDSwitcher />} />
            <EntityTab path="/sentry" title="Sentry" element={<SentryRouter />} />
            <EntityTab path="/api" title="API" element={<ApiDocsRouter />} />
            <EntityTab path="/docs" title="Docs" element={<DocsRouter />} />
            <EntityTab path="/kubernetes" title="Kubernetes" element={<KubernetesRouter />} />
            <EntityTab path="/pull-requests" title="Pull Requests" element={<PullRequestsRouter />} />
            <EntityTab path="/code-insights" title="Code Insights" element={<GitHubInsightsRouter />} />
          </EntityPageLayout>
        </EntityFilter>

        <EntityFilter filter={isType('service')}>
        </EntityFilter>
      <EntityFilter>

      <EntityFilter filter={isKind("component")}>
      </EntityFilter>
      <EntityFilter kind="api">
      <EntityFilter>

      <EntityFilter kinds={["user", "group"]}>
      <EntityFilter>

      <EntityConditionalPage filter={isKind('component')}>
      <EntityConditionalPage>
    </EntityRoute>






    <CatalogPluginPage path="/catalog" EntityPage={EntityPage} />
    <CatalogPluginPage path="/api-docs" EntityPage={EntityPage} />
    <DocsPluginPage path="/docs" />
    <TechRadarPluginPage path="/tech-radar" width={1500} height={800} />
    <GraphiQLPluginPage path="/graphiql" />
    <LighthousePluginPage path="/lighthouse" />
    <RegisterComponentPluginPage
      path="/register-component"
      catalogRouteRef={catalogRouteRef}
    />
    <Plugin path="/docs" plugin={DocsPluginPage} />
    <Plugin
      path="/tech-radar"
      plugin={TechRadarPluginPage}
      width={1500}
      height={800}
    />
    <Plugin path="/graphiql" plugin={GraphiQLPluginPage} />
    <Plugin path="/lighthouse" plugin={LighthousePluginPage} />
    <Plugin
      path="/register-component"
      plugin={RegisterComponentPluginPage}
      catalogRouteRef={catalogRouteRef}
    />
    <Plugin path="/settings" plugin={SettingsPluginPage} />

    <CatalogPluginPage path="/catalog" EntityPage={EntityPage} />
    <DocsPluginPage path="/docs" />
    <TechRadarPluginPage path="/tech-radar" width={1500} height={800} />
    <GraphiQLPluginPage path="/graphiql" />
    <LighthousePluginPage path="/lighthouse" />
    <RegisterComponentPluginPage
      path="/register-component"
      catalogRouteRef={catalogRouteRef}
    />
    <SettingsPluginPage path="/settings" />

    <Navigate key="/" to="/catalog" />
    {...deprecatedAppRoutes}
  </Routes>
);

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>
        <AppRoutes />
      </Root>
    </AppRouter>
  </AppProvider>
);

export default hot(App);
