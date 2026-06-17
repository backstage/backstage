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
import { entityRouteRef, useAsyncEntity } from '@backstage/plugin-catalog-react';
import { EntityLayoutBlueprintProps } from '@backstage/plugin-catalog-react/alpha';
import { catalogTranslationRef } from '../../translation';
import { EntityTabs } from '../EntityTabs';

export const EntityLayout = (props: EntityLayoutBlueprintProps) => {
  const {
    groupedRoutes,
    header,
    groupDefinitions,
    defaultContentOrder,
    showNavItemIcons,
  } = props;
  const { kind } = useRouteRefParams(entityRouteRef);
  const { entity, loading, error } = useAsyncEntity();
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
      {header}

      {loading && <Progress />}

      {entity && (
        <EntityTabs
          routes={groupedRoutes}
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
        </Content>
      )}
    </Page>
  );
};
