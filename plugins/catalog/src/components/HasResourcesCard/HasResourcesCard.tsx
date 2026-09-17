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

import { RELATION_HAS_PART, ResourceEntity } from '@backstage/catalog-model';
import {
  InfoCardVariants,
  TableColumn,
  TableOptions,
} from '@backstage/core-components';
import {
  EntityRelationCard,
  EntityColumnConfig,
  entityColumnPresets,
} from '@backstage/plugin-catalog-react/alpha';
import {
  asResourceEntities,
  resourceEntityColumns,
  resourceEntityHelpLink as legacyHelpLink,
  RelatedEntitiesCard,
} from '../RelatedEntitiesCard';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface HasResourcesCardProps {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}

/**
 * Props for the legacy MUI-based rendering.
 * @deprecated Use {@link HasResourcesCardProps} instead.
 * @public
 */
export interface HasResourcesCardLegacyProps {
  title?: string;
  /** @deprecated Use `columnConfig` instead. */
  variant?: InfoCardVariants;
  /** @deprecated Use `columnConfig` instead. */
  columns?: TableColumn<ResourceEntity>[];
  /** @deprecated Use `columnConfig` instead. */
  tableOptions?: TableOptions;
}

function isLegacyProps(
  props: HasResourcesCardProps | HasResourcesCardLegacyProps,
): props is HasResourcesCardLegacyProps {
  return 'variant' in props || 'columns' in props || 'tableOptions' in props;
}

export function HasResourcesCard(
  props: HasResourcesCardProps | HasResourcesCardLegacyProps,
) {
  const { t } = useTranslationRef(catalogTranslationRef);

  if (isLegacyProps(props)) {
    const {
      variant = 'gridItem',
      title = t('hasResourcesCard.title'),
      columns = resourceEntityColumns,
      tableOptions = {},
    } = props;
    return (
      <RelatedEntitiesCard
        variant={variant}
        title={title}
        entityKind="Resource"
        relationType={RELATION_HAS_PART}
        columns={columns}
        emptyMessage={t('hasResourcesCard.emptyMessage')}
        emptyHelpLink={legacyHelpLink}
        asRenderableEntities={asResourceEntities}
        tableOptions={tableOptions}
      />
    );
  }

  const {
    title = t('hasResourcesCard.title'),
    columnConfig = entityColumnPresets.resource.columns,
  } = props;
  return (
    <EntityRelationCard
      title={title}
      entityKind="Resource"
      relationType={RELATION_HAS_PART}
      columnConfig={columnConfig}
      emptyState={{
        message: t('hasResourcesCard.emptyMessage'),
        helpLink: entityColumnPresets.resource.helpLink,
      }}
    />
  );
}
