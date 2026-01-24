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

import DocsIcon from '@material-ui/icons/Description';

import { useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
} from '@backstage/plugin-techdocs-common';
import { buildTechDocsURL } from '@backstage/plugin-techdocs-react';

import { useEntity } from '@backstage/plugin-catalog-react';

import { techdocsTranslationRef } from '../../translation';
import { rootDocsRouteRef } from '../../routes';

// Note: If you update this hook, please also update the "useTechdocsReaderIconLinkProps" hook
// in the "plugins/catalog/src/components/AboutCard/AboutCard.tsx" file
/** @alpha */
export function useTechdocsReaderIconLinkProps() {
  const { entity } = useEntity();
  const viewTechdocLink = useRouteRef(rootDocsRouteRef);
  const { t } = useTranslationRef(techdocsTranslationRef);

  return {
    label: t('aboutCard.viewTechdocs'),
    disabled:
      !(
        entity.metadata.annotations?.[TECHDOCS_ANNOTATION] ||
        entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]
      ) || !viewTechdocLink,
    icon: <DocsIcon />,
    href: buildTechDocsURL(entity, viewTechdocLink),
  };
}
