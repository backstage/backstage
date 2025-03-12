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

import React, { ComponentProps, ReactNode } from 'react';

import Alert from '@material-ui/lab/Alert';

import {
  attachComponentData,
  useElementFilter,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  Content,
  Link,
  Page,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import {
  entityRouteRef,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';

import { catalogTranslationRef } from '../../translation';
import { EntityHeader } from '../EntityHeader';
import { EntityTabs } from '../EntityTabs';

export type EntityLayoutRouteProps = {
  path: string;
  title: string;
  group: string;
  children: JSX.Element;
  if?: (entity: Entity) => boolean;
};

const dataKey = 'plugin.catalog.entityLayoutRoute';
const Route: (props: EntityLayoutRouteProps) => null = () => null;
attachComponentData(Route, dataKey, true);
attachComponentData(Route, 'core.gatherMountPoints', true); // This causes all mount points that are discovered within this route to use the path of the route itself

/** @public */
export interface EntityLayoutProps {
  UNSTABLE_contextMenuOptions?: ComponentProps<
    typeof EntityHeader
  >['UNSTABLE_contextMenuOptions'];
  UNSTABLE_extraContextMenuItems?: ComponentProps<
    typeof EntityHeader
  >['UNSTABLE_extraContextMenuItems'];
  children?: ReactNode;
  header?: JSX.Element;
  NotFoundComponent?: ReactNode;
  /**
   * An array of relation types used to determine the parent entities in the hierarchy.
   * These relations are prioritized in the order provided, allowing for flexible
   * navigation through entity relationships.
   *
   * For example, use relation types like `["partOf", "memberOf", "ownedBy"]` to define how the entity is related to
   * its parents in the Entity Catalog.
   *
   * It adds breadcrumbs in the Entity page to enhance user navigation and context awareness.
   */
  parentEntityRelations?: string[];
}

/**
 * EntityLayout is a compound component, which allows you to define a layout for
 * entities using a sub-navigation mechanism.
 *
 * Consists of two parts: EntityLayout and EntityLayout.Route
 *
 * @example
 * ```jsx
 * <EntityLayout>
 *   <EntityLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </EntityLayout.Route>
 * </EntityLayout>
 * ```
 *
 * @public
 */
export const EntityLayout = (props: EntityLayoutProps) => {
  const {
    UNSTABLE_extraContextMenuItems,
    UNSTABLE_contextMenuOptions,
    children,
    header,
    NotFoundComponent,
    parentEntityRelations,
  } = props;
  const { kind } = useRouteRefParams(entityRouteRef);
  const { entity, loading, error } = useAsyncEntity();

  const routes = useElementFilter(
    children,
    elements =>
      elements
        .selectByComponentData({
          key: dataKey,
          withStrictError:
            'Child of EntityLayout must be an EntityLayout.Route',
        })
        .getElements<EntityLayoutRouteProps>() // all nodes, element data, maintain structure or not?
        .flatMap(({ props: elementProps }) => {
          if (!entity) {
            return [];
          }
          if (elementProps.if && !elementProps.if(entity)) {
            return [];
          }
          return [
            {
              path: elementProps.path,
              title: elementProps.title,
              group: elementProps.group,
              children: elementProps.children,
            },
          ];
        }),
    [entity],
  );

  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
      {header ?? (
        <EntityHeader
          parentEntityRelations={parentEntityRelations}
          UNSTABLE_contextMenuOptions={UNSTABLE_contextMenuOptions}
          UNSTABLE_extraContextMenuItems={UNSTABLE_extraContextMenuItems}
        />
      )}

      {loading && <Progress />}

      {entity && <EntityTabs routes={routes} />}

      {error && (
        <Content>
          <Alert severity="error">{error.toString()}</Alert>
        </Content>
      )}

      {!loading && !error && !entity && (
        <Content>
          {NotFoundComponent ? (
            NotFoundComponent
          ) : (
            <WarningPanel title={t('entityLabels.warningPanelTitle')}>
              There is no {kind} with the requested{' '}
              <Link to="https://backstage.io/docs/features/software-catalog/references">
                kind, namespace, and name
              </Link>
              .
            </WarningPanel>
          )}
        </Content>
      )}
    </Page>
  );
};

EntityLayout.Route = Route;
