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

import { RELATION_DEPENDS_ON } from '@backstage/catalog-model';
import { ColumnConfig } from '@backstage/ui';
import {
  EntityRelationCard,
  EntityRow,
  resourceColumnConfig,
  componentEntityHelpLink,
} from '@backstage/plugin-catalog-react';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface DependsOnResourcesCardProps {
  title?: string;
  columnConfig?: ColumnConfig<EntityRow>[];
}

export function DependsOnResourcesCard(props: DependsOnResourcesCardProps) {
  const { t } = useTranslationRef(catalogTranslationRef);
  const {
    title = t('dependsOnResourcesCard.title'),
    columnConfig = resourceColumnConfig,
  } = props;
  return (
    <EntityRelationCard
      title={title}
      entityKind="Resource"
      relationType={RELATION_DEPENDS_ON}
      columnConfig={columnConfig}
      emptyState={{
        message: t('dependsOnResourcesCard.emptyMessage'),
        helpLink: componentEntityHelpLink,
      }}
    />
  );
}
