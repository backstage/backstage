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

import { ComponentType, ReactElement, useMemo, useState } from 'react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import {
  Progress,
  useApi,
  appLanguageApiRef,
  errorApiRef,
  translationApiRef,
} from '@backstage/frontend-plugin-api';
import {
  AsyncEntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  type EntityContentGroupDefinitions,
  type EntityHeaderLayoutProps,
} from '@backstage/plugin-catalog-react/alpha';
import { useTranslatedTitles } from '@internal/frontend';
import { useEntityFromUrl } from '../../components/CatalogEntityPage/useEntityFromUrl';
import { EntityLayout } from './EntityLayout';
import { EntityLayoutBui } from './EntityLayout/EntityLayoutBui';
import {
  type EntityLayoutRoute,
  filterEntityLayoutRoutes,
} from './EntityLayout/entityLayoutRoutes';
import type { EntityContextMenuItemDataWithNode } from './EntityContextMenu';
import { useSelectedSubRoute } from './EntityTabs/EntityTabs';

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
  const visibleRoutes = useMemo(
    () => filterEntityLayoutRoutes(props.routes, entity),
    [props.routes, entity],
  );
  const selections = useMemo(
    () => visibleRoutes.map(route => route.titleTranslation),
    [visibleRoutes],
  );
  const titles = useTranslatedTitles({
    translationApi: useApi(translationApiRef),
    languageApi: useApi(appLanguageApiRef),
    errorApi: useApi(errorApiRef),
    selections,
  });
  const { index: activeRouteIndex } = useSelectedSubRoute(visibleRoutes);
  const activeRoute = visibleRoutes[activeRouteIndex];
  const translatedRoutes = useMemo(
    () =>
      titles &&
      new Map(
        visibleRoutes.map((route, index) => [
          route,
          {
            ...route,
            title: titles[index] ?? route.title,
          },
        ]),
      ),
    [visibleRoutes, titles],
  );
  // Keep resolved, still-visible routes mounted while a replacement group loads.
  const [previousRoutes, setPreviousRoutes] = useState(translatedRoutes);
  if (translatedRoutes && previousRoutes !== translatedRoutes) {
    setPreviousRoutes(translatedRoutes);
  }
  const routes = translatedRoutes
    ? [...translatedRoutes.values()]
    : previousRoutes &&
      visibleRoutes.flatMap(route => {
        const resolved =
          previousRoutes.get(route) ??
          (route.titleTranslation ? undefined : route);
        return resolved ? [resolved] : [];
      });
  if (
    !routes ||
    (!translatedRoutes &&
      activeRoute?.titleTranslation &&
      !previousRoutes?.has(activeRoute))
  ) {
    return <Progress />;
  }
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
        routes={routes}
        HeaderComponent={HeaderComponent}
        contextMenuItems={filteredMenuItems}
        groupDefinitions={props.groupDefinitions}
        defaultContentOrder={props.defaultContentOrder}
      />
    ) : (
      <EntityLayout
        routes={routes}
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
