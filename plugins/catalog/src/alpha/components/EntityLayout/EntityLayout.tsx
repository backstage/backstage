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
import { EntityTabs } from '../EntityTabs';
import { JSX } from 'react';

export type EntityLayoutRouteProps = {
  path: string;
  title: string;
  group: string;
  children: JSX.Element;
};

/** @public */
export interface EntityLayoutProps {
  groupedRoutes: Array<EntityLayoutRouteProps>;
  header: JSX.Element;
}

export const EntityLayout = (props: EntityLayoutProps) => {
  const { groupedRoutes, header } = props;
  const { kind } = useRouteRefParams(entityRouteRef);
  const { entity, loading, error } = useAsyncEntity();
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
      {!loading && header}

      {loading && <Progress />}

      {entity && <EntityTabs routes={groupedRoutes} />}

      {error && (
        <Content>
          <Alert severity="error">{error.toString()}</Alert>
        </Content>
      )}

      {!loading && !error && !entity && (
        <Content>
          <WarningPanel title={t('entityLabels.warningPanelTitle')}>
            There is no {kind} with the requested{' '}
            <Link to="https://backstage.io/docs/features/software-catalog/references">
              kind, namespace, and name
            </Link>
            .
          </WarningPanel>
        </Content>
      )}
    </Page>
  );
};
