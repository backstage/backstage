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

import { RELATION_DEPENDS_ON, ResourceEntity } from '@backstage/catalog-model';
import {
  InfoCardVariants,
  TableColumn,
  TableOptions,
} from '@backstage/core-components';
import React from 'react';
import {
  asResourceEntities,
  componentEntityHelpLink,
  RelatedEntitiesCard,
  resourceEntityColumns,
} from '../RelatedEntitiesCard';
import { catalogTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface DependsOnResourcesCardProps {
  variant?: InfoCardVariants;
  title?: string;
  columns?: TableColumn<ResourceEntity>[];
  tableOptions?: TableOptions;
}

export function DependsOnResourcesCard(props: DependsOnResourcesCardProps) {
  const { t } = useTranslationRef(catalogTranslationRef);
  const {
    variant = 'gridItem',
    title = t('dependsOnResourcesCard.title'),
    columns = resourceEntityColumns,
    tableOptions = {},
  } = props;
  return (
    <RelatedEntitiesCard
      variant={variant}
      title={title}
      entityKind="Resource"
      relationType={RELATION_DEPENDS_ON}
      columns={columns}
      emptyMessage={t('dependsOnResourcesCard.emptyMessage')}
      emptyHelpLink={componentEntityHelpLink}
      asRenderableEntities={asResourceEntities}
      tableOptions={tableOptions}
    />
  );
}
