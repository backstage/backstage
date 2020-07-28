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

import { Entity } from '@backstage/catalog-model';
import {
  Content,
  errorApiRef,
  Header,
  HeaderLabel,
  HeaderTabs,
  Page,
  pageTheme,
  PageTheme,
  Progress,
  useApi,
  useExtension,
} from '@backstage/core';
import { SentryIssuesWidget } from '@backstage/plugin-sentry';
import { Grid, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { FC, useEffect, useState } from 'react';
import {
  useNavigate,
  useParams,
  useMatch,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../..';
import { EntityContextMenu } from '../EntityContextMenu/EntityContextMenu';
import { EntityMetadataCard } from '../EntityMetadataCard/EntityMetadataCard';
import { UnregisterEntityDialog } from '../UnregisterEntityDialog/UnregisterEntityDialog';
import { FavouriteEntity } from '../FavouriteEntity/FavouriteEntity';
import {
  tabsExtensionPoint,
  subrouteExtensionPoint,
  overviewCardExtensionPoint,
} from '../../extensions';

const REDIRECT_DELAY = 1000;
function headerProps(
  kind: string,
  namespace: string | undefined,
  name: string,
  entity: Entity | undefined,
): { headerTitle: string; headerType: string } {
  return {
    headerTitle: `${name}${namespace ? ` in ${namespace}` : ''}`,
    headerType: (() => {
      let t = kind.toLowerCase();
      if (entity && entity.spec && 'type' in entity.spec) {
        t += ' — ';
        t += (entity.spec as { type: string }).type.toLowerCase();
      }
      return t;
    })(),
  };
}

export const getPageTheme = (entity?: Entity): PageTheme => {
  const themeKey = entity?.spec?.type?.toString() ?? 'home';
  return pageTheme[themeKey] ?? pageTheme.home;
};

const EntityPageTitle: FC<{ title: string; entity: Entity | undefined }> = ({
  entity,
  title,
}) => (
  <Box display="inline-flex" alignItems="center" height="1em">
    {title}
    {entity && <FavouriteEntity entity={entity} />}
  </Box>
);

export const EntityPage: FC<{}> = () => {
  const {
    optionalNamespaceAndName,
    kind,
    '*': currentTabRoute,
  } = useParams() as {
    optionalNamespaceAndName: string;
    kind: string;
    '*': string;
  };
  const navigate = useNavigate();
  const [name, namespace] = optionalNamespaceAndName.split(':').reverse();

  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const { value: entity, error, loading } = useAsync<Entity | undefined>(
    () => catalogApi.getEntityByName({ kind, namespace, name }),
    [catalogApi, kind, namespace, name],
  );

  useEffect(() => {
    if (!error && !loading && !entity) {
      errorApi.post(new Error('Entity not found!'));
      setTimeout(() => {
        navigate('/');
      }, REDIRECT_DELAY);
    }
  }, [errorApi, navigate, error, loading, entity]);

  if (!name) {
    navigate('/catalog');
    return null;
  }

  const cleanUpAfterRemoval = async () => {
    setConfirmationDialogOpen(false);
    navigate('/');
  };

  const showRemovalDialog = () => setConfirmationDialogOpen(true);

  const tabs = useExtension(tabsExtensionPoint)
    .map(tabFactory => tabFactory(entity))
    .filter(Boolean);

  const activeTab = Math.max(
    tabs.findIndex(tab => tab?.isActive?.(location.pathname)),
    tabs.findIndex(tab => tab?.route.path === currentTabRoute),
    0,
  );
  const routes = useExtension(subrouteExtensionPoint)
    .map(routeFactory => routeFactory(entity))
    .filter(Boolean);

  const overviewCards = useExtension(overviewCardExtensionPoint)
    .map(cardFactory => cardFactory(entity))
    .filter(Boolean);

  const { headerTitle, headerType } = headerProps(
    kind,
    namespace,
    name,
    entity,
  );

  return (
    <Page theme={getPageTheme(entity)}>
      <Header
        title={<EntityPageTitle title={headerTitle} entity={entity} />}
        pageTitleOverride={headerTitle}
        type={headerType}
      >
        {entity && (
          <>
            <HeaderLabel
              label="Owner"
              value={entity.spec?.owner || 'unknown'}
            />
            <HeaderLabel
              label="Lifecycle"
              value={entity.spec?.lifecycle || 'unknown'}
            />
            <EntityContextMenu onUnregisterEntity={showRemovalDialog} />
          </>
        )}
      </Header>

      {loading && <Progress />}

      {error && (
        <Content>
          <Alert severity="error">{error.toString()}</Alert>
        </Content>
      )}

      {entity && (
        <>
          <HeaderTabs
            activeTab={activeTab}
            tabs={tabs}
            onChange={tabIndex => navigate(tabs[tabIndex]?.route.path!)}
          />

          <Content>
            <Routes>
              <Route
                path="/overview"
                element={
                  <Grid container spacing={3}>
                    <Grid item sm={4}>
                      <EntityMetadataCard entity={entity} />
                    </Grid>
                    <Grid item sm={8}>
                      <SentryIssuesWidget
                        sentryProjectId="sample-sentry-project-id"
                        statsFor="24h"
                      />
                    </Grid>
                    {overviewCards.map(({ component: Component }) => (
                      <Component />
                    ))}
                  </Grid>
                }
              />
              {routes.map(({ route, component: Component }) => (
                <Route path={route.path} element={<Component />} />
              ))}
              <Route path="*" element={<Navigate to="overview" />} />
            </Routes>
          </Content>

          <UnregisterEntityDialog
            open={confirmationDialogOpen}
            entity={entity}
            onConfirm={cleanUpAfterRemoval}
            onClose={() => setConfirmationDialogOpen(false)}
          />
        </>
      )}
    </Page>
  );
};
