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

import { ComponentProps, ComponentType, ReactNode, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Alert, Container } from '@backstage/ui';
import {
  configApiRef,
  useApi,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { Link, Progress } from '@backstage/core-components';
import { NotFoundErrorPage } from '@backstage/frontend-plugin-api';
import {
  entityRouteRef,
  InspectEntityDialog,
  useAsyncEntity,
  useEntityPresentation,
} from '@backstage/plugin-catalog-react';
import {
  type EntityContentGroupDefinitions,
  type EntityHeaderLayoutProps,
} from '@backstage/plugin-catalog-react/alpha';
import { catalogTranslationRef } from '../../translation';
import { EntityHeaderBui } from '../EntityHeader/EntityHeaderBui';
import { useEntityTabs } from '../EntityTabs/useEntityTabs';
import {
  EntityLayoutRoute,
  filterEntityLayoutRoutes,
} from './entityLayoutRoutes';

function EntityDocumentTitle(props: { activeContentTitle?: string }) {
  const configApi = useApi(configApiRef);
  const routeParams = useRouteRefParams(entityRouteRef);
  const { entity } = useAsyncEntity();
  const presentation = useEntityPresentation(entity ?? routeParams);
  const appTitle = configApi.getOptionalString('app.title') || 'Backstage';
  return (
    <>
      <Helmet
        titleTemplate={`${presentation.primaryTitle} | %s | ${appTitle}`}
        defaultTitle={`${presentation.primaryTitle} | ${appTitle}`}
      />
      {props.activeContentTitle && <Helmet title={props.activeContentTitle} />}
    </>
  );
}

function InspectEntityDialogHost() {
  const { entity } = useAsyncEntity();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get('inspect');
  const setSelectedTab = useCallback(
    (tab: string) =>
      setSearchParams(params => {
        const next = new URLSearchParams(params);
        next.set('inspect', tab);
        return next;
      }),
    [setSearchParams],
  );
  const close = useCallback(
    () =>
      setSearchParams(params => {
        const next = new URLSearchParams(params);
        next.delete('inspect');
        return next;
      }),
    [setSearchParams],
  );
  if (!entity) return null;
  return (
    <InspectEntityDialog
      entity={entity}
      initialTab={
        (selectedTab as ComponentProps<
          typeof InspectEntityDialog
        >['initialTab']) || undefined
      }
      open={typeof selectedTab === 'string'}
      onClose={close}
      onSelect={setSelectedTab}
    />
  );
}

function EntityLayoutContent(props: {
  content?: React.JSX.Element;
  NotFoundComponent?: ReactNode;
}) {
  const { kind } = useRouteRefParams(entityRouteRef);
  const { entity, loading, error } = useAsyncEntity();
  const { t } = useTranslationRef(catalogTranslationRef);

  let content: ReactNode;
  if (error) {
    content = (
      <Container>
        <Alert status="danger" title={error.toString()} />
      </Container>
    );
  } else if (entity) {
    content = <Container>{props.content ?? <NotFoundErrorPage />}</Container>;
  } else if (!loading) {
    content = (
      <Container>
        {props.NotFoundComponent ?? (
          <Alert
            status="warning"
            title={t('entityLabels.warningPanelTitle')}
            description={t('entityPage.notFoundMessage', {
              kind,
              link: (
                <Link to="https://backstage.io/docs/features/software-catalog/references">
                  {t('entityPage.notFoundLinkText')}
                </Link>
              ),
            })}
          />
        )}
      </Container>
    );
  }

  return (
    <>
      {loading && <Progress />}
      {content}
    </>
  );
}

export function EntityLayoutBui(props: {
  routes: EntityLayoutRoute[];
  NotFoundComponent?: ReactNode;
  groupDefinitions: EntityContentGroupDefinitions;
  defaultContentOrder: 'title' | 'natural';
  contextMenuItems?: ComponentProps<typeof EntityHeaderBui>['contextMenuItems'];
  HeaderComponent?: ComponentType<EntityHeaderLayoutProps>;
}) {
  const {
    routes,
    NotFoundComponent,
    groupDefinitions,
    defaultContentOrder,
    contextMenuItems,
    HeaderComponent,
  } = props;
  const { entity } = useAsyncEntity();
  const visibleRoutes = filterEntityLayoutRoutes(routes, entity);
  const tabs = useEntityTabs({
    routes: visibleRoutes,
    groupDefinitions,
    defaultContentOrder,
  });

  return (
    <main>
      <EntityDocumentTitle activeContentTitle={tabs.title} />
      {HeaderComponent ? (
        <HeaderComponent tabs={tabs.tabs} activeTabId={tabs.activeTabId} />
      ) : (
        <EntityHeaderBui
          tabs={tabs.tabs}
          activeTabId={tabs.activeTabId}
          contextMenuItems={contextMenuItems}
        />
      )}
      <EntityLayoutContent
        content={tabs.content}
        NotFoundComponent={NotFoundComponent}
      />
      <InspectEntityDialogHost />
    </main>
  );
}
