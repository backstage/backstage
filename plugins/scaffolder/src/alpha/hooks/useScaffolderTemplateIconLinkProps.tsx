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

import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { useApp, useRouteRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';

import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { taskCreatePermission } from '@backstage/plugin-scaffolder-common/alpha';
import { usePermission } from '@backstage/plugin-permission-react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { scaffolderTranslationRef } from '../../translation';
import { selectedTemplateRouteRef } from '../../routes';

// Note: If you update this hook, please also update the "useScaffolderTemplateIconLinkProps" hook
// in the "plugins/catalog/src/components/AboutCard/AboutCard.tsx" file
/** @alpha */
export function useScaffolderTemplateIconLinkProps() {
  const app = useApp();
  const { entity } = useEntity();
  const templateRoute = useRouteRef(selectedTemplateRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const Icon = app.getSystemIcon('scaffolder') ?? CreateComponentIcon;
  const { allowed: canCreateTemplateTask } = usePermission({
    permission: taskCreatePermission,
  });

  return {
    label: t('aboutCard.launchTemplate'),
    icon: <Icon />,
    disabled: !templateRoute || !canCreateTemplateTask,
    href:
      templateRoute &&
      templateRoute({
        templateName: entity.metadata.name,
        namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
      }),
  };
}
