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
import React, { FC, useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import ComponentMetadataCard from '../ComponentMetadataCard/ComponentMetadataCard';
import {
  Content,
  Header,
  pageTheme,
  Page,
  useApi,
  ErrorApi,
  errorApiRef,
  HeaderTabs,
} from '@backstage/core';
import ComponentContextMenu from '../ComponentContextMenu/ComponentContextMenu';
import ComponentRemovalDialog from '../ComponentRemovalDialog/ComponentRemovalDialog';

import { SentryIssuesWidget } from '@backstage/plugin-sentry';
import { Grid } from '@material-ui/core';
import { catalogApiRef } from '../..';
import { entityToComponent } from '../../data/utils';
import { Component } from '../../data/component';
import { useParams, useNavigate } from 'react-router';

const REDIRECT_DELAY = 1000;

type ComponentPageProps = {
  match: {
    params: {
      name: string;
    };
  };
  history: {
    push: (url: string) => void;
  };
};

const ComponentPage: FC<ComponentPageProps> = () => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [removingPending, setRemovingPending] = useState(false);
  const showRemovalDialog = () => setConfirmationDialogOpen(true);
  const hideRemovalDialog = () => setConfirmationDialogOpen(false);
  const params = useParams() as { name: string };
  const componentName = params.name;
  const navigate = useNavigate();
  const errorApi = useApi<ErrorApi>(errorApiRef);

  const catalogApi = useApi(catalogApiRef);
  const { value: component, error, loading } = useAsync<Component>(async () => {
    const entity = await catalogApi.getEntityByName(params.name);
    const location = await catalogApi.getLocationByEntity(entity);
    return { ...entityToComponent(entity), location };
  });

  useEffect(() => {
    if (error) {
      errorApi.post(new Error('Component not found!'));
      setTimeout(() => {
        navigate('/');
      }, REDIRECT_DELAY);
    }
  }, [error, errorApi, navigate]);

  if (componentName === '') {
    navigate('/catalog');
    return null;
  }

  const removeComponent = async () => {
    setConfirmationDialogOpen(false);
    setRemovingPending(true);
    // await componentFactory.removeComponentByName(componentName);

    await catalogApi;
    navigate('/');
  };

  // TODO - Replace with proper tabs implementation
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
    },
    {
      id: 'ci',
      label: 'CI/CD',
    },
    {
      id: 'tests',
      label: 'Tests',
    },
    {
      id: 'api',
      label: 'API',
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
    },
    {
      id: 'quality',
      label: 'Quality',
    },
  ];

  return (
    <Page theme={pageTheme.home}>
      <Header title={component?.name || 'Catalog'}>
        <ComponentContextMenu onUnregisterComponent={showRemovalDialog} />
      </Header>
      <HeaderTabs tabs={tabs} />
      {confirmationDialogOpen && component && (
        <ComponentRemovalDialog
          component={component}
          onClose={hideRemovalDialog}
          onConfirm={removeComponent}
          onCancel={hideRemovalDialog}
        />
      )}
      <Content>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <ComponentMetadataCard
              loading={loading || removingPending}
              component={component}
            />
          </Grid>
          <Grid item>
            <SentryIssuesWidget
              sentryProjectId="sample-sentry-project-id"
              statsFor="24h"
            />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
export default ComponentPage;
