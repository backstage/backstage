/*
 * Copyright 2026 The Backstage Authors
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

import { ComponentType, ReactElement } from 'react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import {
  AsyncEntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  type EntityContentGroupDefinitions,
  type EntityHeaderLayoutProps,
} from '@backstage/plugin-catalog-react/alpha';
import { useEntityFromUrl } from '../../components/CatalogEntityPage/useEntityFromUrl';
import { EntityLayout } from './EntityLayout';
import { EntityLayoutBui } from './EntityLayout/EntityLayoutBui';
import type { EntityLayoutRoute } from './EntityLayout/entityLayoutRoutes';
import type { EntityContextMenuItemDataWithNode } from './EntityContextMenu';

export interface CatalogEntityPageProps {
  menuItems: Array<
    EntityContextMenuItemDataWithNode & { filter: (entity: Entity) => boolean }
  >;
  headerLayouts: Array<{
    Component: ComponentType<EntityHeaderLayoutProps>;
    filter: (entity: Entity) => boolean;
  }>;
  headers: Array<{
    element?: ReactElement;
    filter: (entity: Entity) => boolean;
  }>;
  routes: EntityLayoutRoute[];
  groupDefinitions: EntityContentGroupDefinitions;
  defaultContentOrder: 'title' | 'natural';
  showNavItemIcons: boolean;
}

export function CatalogEntityPage(props: CatalogEntityPageProps) {
  const routeParams = useRouteRefParams(entityRouteRef);
  const entityFromUrl = useEntityFromUrl();
  const matchesRoute =
    !!entityFromUrl.entity &&
    stringifyEntityRef(entityFromUrl.entity) ===
      stringifyEntityRef(routeParams);
  const entity = matchesRoute ? entityFromUrl.entity : undefined;
  const entityProviderProps = {
    ...entityFromUrl,
    entity,
    loading: entityFromUrl.loading || (!!entityFromUrl.entity && !matchesRoute),
  };
  const filteredMenuItems = entity
    ? props.menuItems
        .filter(item => item.filter(entity))
        .map(({ data, node }) => ({ data, node }))
    : [];

  const HeaderComponent = entity
    ? props.headerLayouts.find(layout => layout.filter(entity))?.Component
    : undefined;
  const legacyHeader = entity
    ? props.headers.find(header => header.filter(entity))?.element
    : undefined;

  const layout =
    HeaderComponent || !legacyHeader ? (
      <EntityLayoutBui
        routes={props.routes}
        HeaderComponent={HeaderComponent}
        contextMenuItems={filteredMenuItems}
        groupDefinitions={props.groupDefinitions}
        defaultContentOrder={props.defaultContentOrder}
      />
    ) : (
      <EntityLayout
        routes={props.routes}
        header={legacyHeader}
        contextMenuItems={filteredMenuItems}
        groupDefinitions={props.groupDefinitions}
        defaultContentOrder={props.defaultContentOrder}
        showNavItemIcons={props.showNavItemIcons}
      />
    );

  return (
    <AsyncEntityProvider {...entityProviderProps}>{layout}</AsyncEntityProvider>
  );
}
