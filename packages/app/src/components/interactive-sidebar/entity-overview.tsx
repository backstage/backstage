/*
 * Copyright 2022 The Backstage Authors
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

import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

import { useAsync } from 'react-use';

import { useApi, useApp } from '@backstage/core-plugin-api';
import { EntityAboutCard } from '@backstage/plugin-catalog';
import { stringifyEntityRef } from '@backstage/catalog-model';

import {
  EntityProvider,
  catalogApiRef,
  useEntity,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';

import {
  drawerStore,
  InteractiveLink,
} from '@backstage/plugin-interactive-drawers';
import { componentPageSwitch } from '../catalog/EntityPage';
import {
  DrawerWrapperComponentProps,
  useDrawer,
} from '@backstage/plugin-interactive-drawers';

const useStyles = makeStyles(() => ({
  cardWrapper: {
    padding: 8,
  },
}));

export function registerEntityOverview() {
  drawerStore.registerWrapper(entityRouteRef, EntityWrapper);

  drawerStore.registerRouteRef(entityRouteRef, { content: OverviewPage });
}

function EntityWrapper({
  params,
  children,
}: DrawerWrapperComponentProps<{
  namespace: string;
  kind: string;
  name: string;
}>) {
  const catalogApi = useApi(catalogApiRef);
  const { Progress } = useApp().getComponents();

  const stringifiedEntity = stringifyEntityRef(params);

  const asyncEntity = useAsync(
    () => catalogApi.getEntityByRef(stringifiedEntity),
    [stringifiedEntity],
  );

  if (asyncEntity.loading) return <Progress />;
  else if (asyncEntity.error)
    return <div>error: {asyncEntity.error?.message}</div>;

  return (
    <EntityProvider entity={asyncEntity.value!}>{children}</EntityProvider>
  );
}

function OverviewPage(props: { path: string }) {
  const { cardWrapper } = useStyles();

  const drawer = useDrawer();

  const { entity } = useEntity();

  useEffect(() => {
    drawer.setTitle(entity.metadata.name);
  }, [entity, drawer]);

  const pathTo = (to: string) => `${props.path}${to}`;

  const switchMatch = componentPageSwitch.find(
    switchCase => !switchCase.if || switchCase.if(entity),
  );
  // These correspond to the tabs in the entity page
  const pageEntries = switchMatch?.entries ?? [];

  return (
    <div>
      <div className={cardWrapper}>
        <EntityAboutCard variant="gridItem" />
      </div>

      {pageEntries
        .filter(entry => !entry.if || entry.if(entity))
        .map(({ path, title }) => (
          <InteractiveLink
            key={`${path}$$${title}`}
            title={title}
            to={pathTo(path)}
          />
        ))}
    </div>
  );
}
