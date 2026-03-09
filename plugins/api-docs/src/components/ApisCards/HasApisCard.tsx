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

import { RELATION_HAS_PART } from '@backstage/catalog-model';
import { ColumnConfig } from '@backstage/ui';
import { EntityRelationCard, EntityRow } from '@backstage/plugin-catalog-react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { apiDocsTranslationRef } from '../../translation';
import { getHasApisColumnConfig } from './presets';

/**
 * @public
 */
export const HasApisCard = (props: {
  title?: string;
  columnConfig?: ColumnConfig<EntityRow>[];
}) => {
  const { t } = useTranslationRef(apiDocsTranslationRef);
  const {
    title = t('hasApisCard.title'),
    columnConfig = getHasApisColumnConfig(t),
  } = props;

  return (
    <EntityRelationCard
      title={title}
      entityKind="API"
      relationType={RELATION_HAS_PART}
      columnConfig={columnConfig}
      emptyState={{
        message: t('hasApisCard.emptyContent.title', {
          entity: 'system',
        }),
        helpLink:
          'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-api',
      }}
    />
  );
};
