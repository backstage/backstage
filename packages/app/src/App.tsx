/*
 * Copyright 2020 The Backstage Authors
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
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core-components';
import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import { CatalogEntityPage, CatalogIndexPage } from '@backstage/plugin-catalog';

import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import { HomepageCompositionRoot, VisitListener } from '@backstage/plugin-home';

import { ScaffolderPage } from '@backstage/plugin-scaffolder';
import {
  ScaffolderFieldExtensions,
  ScaffolderLayouts,
} from '@backstage/plugin-scaffolder-react';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  ExpandableNavigation,
  LightBox,
  ReportIssue,
  TextSize,
} from '@backstage/plugin-techdocs-module-addons-contrib';
import {
  SettingsLayout,
  UserSettingsPage,
} from '@backstage/plugin-user-settings';
import { AdvancedSettings } from './components/advancedSettings';
import AlarmIcon from '@material-ui/icons/Alarm';
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { homePage } from './components/home/HomePage';
import { Root } from './components/Root';
import { DelayingComponentFieldExtension } from './components/scaffolder/customScaffolderExtensions';
import { defaultPreviewTemplate } from './components/scaffolder/defaultPreviewTemplate';
import { searchPage } from './components/search/SearchPage';
import { providers } from './identityProviders';
import { SignalsDisplay } from '@backstage/plugin-signals';
import { techDocsPage } from './components/techdocs/TechDocsPage';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { TwoColumnLayout } from './components/scaffolder/customScaffolderLayouts';
import { customDevToolsPage } from './components/devtools/CustomDevToolsPage';
import { DevToolsPage } from '@backstage/plugin-devtools';
import { CatalogUnprocessedEntitiesPage } from '@backstage/plugin-catalog-unprocessed-entities';
import {
  NotificationsPage,
  UserNotificationSettingsCard,
} from '@backstage/plugin-notifications';

const app = createApp({
  apis,
  icons: {
    // Custom icon example
    alert: AlarmIcon,
  },
  featureFlags: [
    {
      name: 'scaffolder-next-preview',
      description: 'Preview the new Scaffolder Next',
      pluginId: '',
    },
  ],
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
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    {/* TODO(rubenl): Move this to / once its more mature and components exist */}
    <Route path="/home" element={<HomepageCompositionRoot />}>
      {homePage}
    </Route>
    <Route
      path="/catalog"
      element={<CatalogIndexPage pagination={{ mode: 'offset', limit: 20 }} />}
    />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route
      path="/catalog-unprocessed-entities"
      element={<CatalogUnprocessedEntitiesPage />}
    />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route
      path="/catalog-graph"
      element={
        <CatalogGraphPage
          initialState={{
            selectedKinds: ['component', 'domain', 'system', 'api', 'group'],
            selectedRelations: [
              RELATION_OWNER_OF,
              RELATION_OWNED_BY,
              RELATION_CONSUMES_API,
              RELATION_API_CONSUMED_BY,
              RELATION_PROVIDES_API,
              RELATION_API_PROVIDED_BY,
              RELATION_HAS_PART,
              RELATION_PART_OF,
              RELATION_DEPENDS_ON,
              RELATION_DEPENDENCY_OF,
            ],
          }}
        />
      }
    />
    <Route
      path="/docs"
      element={<TechDocsIndexPage pagination={{ mode: 'offset', limit: 20 }} />}
    />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      {techDocsPage}
      <TechDocsAddons>
        <ExpandableNavigation />
        <ReportIssue />
        <TextSize />
        <LightBox />
      </TechDocsAddons>
    </Route>
    <Route
      path="/create"
      element={
        <ScaffolderPage
          defaultPreviewTemplate={defaultPreviewTemplate}
          groups={[
            {
              title: 'Recommended',
              filter: entity =>
                entity?.metadata?.tags?.includes('recommended') ?? false,
            },
          ]}
        />
      }
    >
      <ScaffolderFieldExtensions>
        <DelayingComponentFieldExtension />
      </ScaffolderFieldExtensions>
      <ScaffolderLayouts>
        <TwoColumnLayout />
      </ScaffolderLayouts>
    </Route>

    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>

    <Route path="/settings" element={<UserSettingsPage />}>
      <SettingsLayout.Route path="/advanced" title="Advanced">
        <AdvancedSettings />
      </SettingsLayout.Route>
      <SettingsLayout.Route path="/notifications" title="Notifications">
        <UserNotificationSettingsCard
          originNames={{ 'plugin:scaffolder': 'Scaffolder' }}
        />
      </SettingsLayout.Route>
    </Route>
    <Route path="/devtools" element={<DevToolsPage />}>
      {customDevToolsPage}
    </Route>
    <Route path="/notifications" element={<NotificationsPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <SignalsDisplay />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
