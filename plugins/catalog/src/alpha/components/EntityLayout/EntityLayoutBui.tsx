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

import { ReactElement, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import Alert from '@material-ui/lab/Alert';

import {
  useElementFilter,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  Content,
  Link,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { Container } from '@backstage/ui';
import { Entity } from '@backstage/catalog-model';
import {
  entityRouteRef,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';
import { EntityContentGroupDefinitions } from '@backstage/plugin-catalog-react/alpha';

import { catalogTranslationRef } from '../../translation';
import { EntityHeaderBui } from '../EntityHeader/EntityHeaderBui';
import { useSelectedSubRoute } from '../EntityTabs/EntityTabs';

type EntityLayoutBuiRouteProps = {
  path: string;
  title: string;
  group?: string;
  icon?: string | ReactElement;
  children: JSX.Element;
  if?: (entity: Entity) => boolean;
};

const dataKey = 'plugin.catalog.entityLayoutRoute';

/** @alpha */
export interface EntityLayoutBuiProps {
  children?: ReactNode;
  NotFoundComponent?: ReactNode;
  groupDefinitions: EntityContentGroupDefinitions;
  defaultContentOrder?: 'title' | 'natural';
  contextMenuItems?: ReactNode[];
}

/**
 * BUI-based entity layout. Renders title, actions, and grouped tabs in a
 * `Header` from `@backstage/ui`, with the matching tab content below.
 *
 * @alpha
 */
export const EntityLayoutBui = (props: EntityLayoutBuiProps) => {
  const {
    children,
    NotFoundComponent,
    groupDefinitions,
    defaultContentOrder,
    contextMenuItems,
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
            'Child of EntityLayoutBui must be an EntityLayout.Route',
        })
        .getElements<EntityLayoutBuiRouteProps>()
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
              icon: elementProps.icon,
            },
          ];
        }),
    [entity],
  );

  const { route, element } = useSelectedSubRoute(routes);

  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <main>
      <EntityHeaderBui
        routes={routes}
        groupDefinitions={groupDefinitions}
        defaultContentOrder={defaultContentOrder}
        contextMenuItems={contextMenuItems}
      />

      {loading && <Progress />}

      {entity && (
        <Container>
          <Helmet title={route?.title} />
          {element}
        </Container>
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
    </main>
  );
};
