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
  HeaderTabs,
  Page,
  pageTheme,
  Progress,
  useApi,
} from '@backstage/core';
import { SentryIssuesWidget } from '@backstage/plugin-sentry';
import { Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { FC, useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../..';
import { ComponentContextMenu } from '../ComponentContextMenu/ComponentContextMenu';
import { ComponentMetadataCard } from '../ComponentMetadataCard/ComponentMetadataCard';
import { ComponentRemovalDialog } from '../ComponentRemovalDialog/ComponentRemovalDialog';

const REDIRECT_DELAY = 1000;

type ComponentPageProps = {
  match: {
    params: {
      optionalNamespaceAndName: string;
      kind: string;
    };
  };
  history: {
    push: (url: string) => void;
  };
};

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

export const ComponentPage: FC<ComponentPageProps> = ({ match, history }) => {
  const { optionalNamespaceAndName, kind } = match.params;
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
      errorApi.post(new Error('Component not found!'));
      setTimeout(() => {
        history.push('/');
      }, REDIRECT_DELAY);
    }
  }, [errorApi, history, error, loading, entity]);

  if (!name) {
    history.push('/catalog');
    return null;
  }

  const removeComponent = async () => {
    setConfirmationDialogOpen(false);
    // await componentFactory.removeComponentByName(componentName);
    history.push('/');
  };

  const showRemovalDialog = () => setConfirmationDialogOpen(true);
  const hideRemovalDialog = () => setConfirmationDialogOpen(false);

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

  const { headerTitle, headerType } = headerProps(
    kind,
    namespace,
    name,
    entity,
  );

  return (
    // TODO: Switch theme and type props based on component type (website, library, ...)
    <Page theme={pageTheme.service}>
      <Header title={headerTitle} type={headerType}>
        {entity && (
          <ComponentContextMenu onUnregisterComponent={showRemovalDialog} />
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
          <HeaderTabs tabs={tabs} />

          <Content>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <ComponentMetadataCard entity={entity} />
              </Grid>
              <Grid item>
                <SentryIssuesWidget
                  sentryProjectId="sample-sentry-project-id"
                  statsFor="24h"
                />
              </Grid>
            </Grid>
          </Content>

          <ComponentRemovalDialog
            open={confirmationDialogOpen}
            entity={entity}
            onClose={hideRemovalDialog}
            onConfirm={removeComponent}
          />
        </>
      )}
    </Page>
  );
};
