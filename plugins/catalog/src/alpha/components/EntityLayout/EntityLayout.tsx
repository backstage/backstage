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

import { ComponentProps, ReactNode } from 'react';

import Alert from '@material-ui/lab/Alert';

import { useRouteRefParams } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  Content,
  Link,
  Page,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import {
  entityRouteRef,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';

import { catalogTranslationRef } from '../../translation';
import { EntityHeader } from '../EntityHeader';
import { EntityTabs } from '../EntityTabs';
import { EntityContentGroupDefinitions } from '@backstage/plugin-catalog-react/alpha';
import {
  EntityLayoutRoute,
  filterEntityLayoutRoutes,
} from './entityLayoutRoutes';

interface EntityLayoutProps {
  UNSTABLE_extraContextMenuItems?: ComponentProps<
    typeof EntityHeader
  >['UNSTABLE_extraContextMenuItems'];
  contextMenuItems?: ComponentProps<typeof EntityHeader>['contextMenuItems'];
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
  groupDefinitions: EntityContentGroupDefinitions;
  defaultContentOrder?: 'title' | 'natural';
  showNavItemIcons?: boolean;
  routes: EntityLayoutRoute[];
}

export function EntityLayout(props: EntityLayoutProps) {
  const {
    UNSTABLE_extraContextMenuItems,
    contextMenuItems,
    header,
    NotFoundComponent,
    parentEntityRelations,
    groupDefinitions,
    defaultContentOrder,
    showNavItemIcons,
    routes,
  } = props;
  const { kind } = useRouteRefParams(entityRouteRef);
  const { entity, loading, error } = useAsyncEntity();

  const visibleRoutes = filterEntityLayoutRoutes(routes, entity);

  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
      {header ?? (
        <EntityHeader
          parentEntityRelations={parentEntityRelations}
          UNSTABLE_extraContextMenuItems={UNSTABLE_extraContextMenuItems}
          contextMenuItems={contextMenuItems}
        />
      )}

      {loading && <Progress />}

      {entity && (
        <EntityTabs
          routes={visibleRoutes}
          groupDefinitions={groupDefinitions}
          defaultContentOrder={defaultContentOrder}
          showIcons={showNavItemIcons}
        />
      )}

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
              {t('entityPage.notFoundMessage', {
                kind,
                link: (
                  <Link to="https://backstage.io/docs/features/software-catalog/references">
                    {t('entityPage.notFoundLinkText')}
                  </Link>
                ),
              })}
            </WarningPanel>
          )}
        </Content>
      )}
    </Page>
  );
}
