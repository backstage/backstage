/*
 * Copyright 2025 The Backstage Authors
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

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { CatalogContentHeaderItemBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { catalogTranslationRef } from './translation';
import { createComponentRouteRef } from '../routes';
import { useRouteRef } from '@backstage/core-plugin-api';
import { usePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

const catalogSupportCatalogContentHeaderItem =
  CatalogContentHeaderItemBlueprint.make({
    name: 'support',
    params: {
      loader: async () => {
        const { SupportButton } = await import('@backstage/core-components');

        const Component = () => {
          const { t } = useTranslationRef(catalogTranslationRef);
          return (
            <SupportButton>{t('indexPage.supportButtonContent')}</SupportButton>
          );
        };

        return <Component />;
      },
    },
  });

const catalogCreateCatalogContentHeaderItem =
  CatalogContentHeaderItemBlueprint.make({
    name: 'create',
    params: {
      loader: async () => {
        const { CreateButton } = await import('@backstage/core-components');

        const Component = () => {
          const { t } = useTranslationRef(catalogTranslationRef);
          const createComponentLink = useRouteRef(createComponentRouteRef);
          const { allowed } = usePermission({
            permission: catalogEntityCreatePermission,
          });
          return (
            allowed && (
              <CreateButton
                title={t('indexPage.createButtonTitle')}
                to={createComponentLink && createComponentLink()}
              />
            )
          );
        };

        return <Component />;
      },
    },
  });

// this is the default order that the content header items will be applied in (from right to left)
export default [
  catalogSupportCatalogContentHeaderItem,
  catalogCreateCatalogContentHeaderItem,
];
