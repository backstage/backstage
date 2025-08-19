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

import { useRouteRef } from '@backstage/core-plugin-api';
import { createComponentRouteRef } from '../../routes';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogTranslationRef } from '../../alpha';
import { usePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { CreateButton, SupportButton } from '@backstage/core-components';

/** @public */
export const DefaultContentHeaderItems = () => {
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const { t } = useTranslationRef(catalogTranslationRef);
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission,
  });

  return (
    <>
      {allowed && (
        <CreateButton
          title={t('indexPage.createButtonTitle')}
          to={createComponentLink && createComponentLink()}
        />
      )}
      <SupportButton>{t('indexPage.supportButtonContent')}</SupportButton>
    </>
  );
};
