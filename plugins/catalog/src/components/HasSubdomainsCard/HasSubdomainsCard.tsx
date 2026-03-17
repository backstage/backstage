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

import { DomainEntity, RELATION_HAS_PART } from '@backstage/catalog-model';
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
  asDomainEntities,
  domainEntityColumns,
  domainEntityHelpLink as legacyHelpLink,
  RelatedEntitiesCard,
} from '../RelatedEntitiesCard';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface HasSubdomainsCardProps {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}

/**
 * Props for the legacy MUI-based rendering.
 * @deprecated Use {@link HasSubdomainsCardProps} instead.
 * @public
 */
export interface HasSubdomainsCardLegacyProps {
  title?: string;
  /** @deprecated Use `columnConfig` instead. */
  variant?: InfoCardVariants;
  /** @deprecated Use `columnConfig` instead. */
  tableOptions?: TableOptions;
  /** @deprecated Use `columnConfig` instead. */
  columns?: TableColumn<DomainEntity>[];
}

function isLegacyProps(
  props: HasSubdomainsCardProps | HasSubdomainsCardLegacyProps,
): props is HasSubdomainsCardLegacyProps {
  return 'variant' in props || 'columns' in props || 'tableOptions' in props;
}

export function HasSubdomainsCard(
  props: HasSubdomainsCardProps | HasSubdomainsCardLegacyProps,
) {
  const { t } = useTranslationRef(catalogTranslationRef);

  if (isLegacyProps(props)) {
    const {
      variant = 'gridItem',
      title = t('hasSubdomainsCard.title'),
      columns = domainEntityColumns,
      tableOptions = {},
    } = props;
    return (
      <RelatedEntitiesCard
        variant={variant}
        title={title}
        entityKind="Domain"
        relationType={RELATION_HAS_PART}
        columns={columns}
        asRenderableEntities={asDomainEntities}
        emptyMessage={t('hasSubdomainsCard.emptyMessage')}
        emptyHelpLink={legacyHelpLink}
        tableOptions={tableOptions}
      />
    );
  }

  const {
    title = t('hasSubdomainsCard.title'),
    columnConfig = entityColumnPresets.domain.columns,
  } = props;
  return (
    <EntityRelationCard
      title={title}
      entityKind="Domain"
      relationType={RELATION_HAS_PART}
      columnConfig={columnConfig}
      emptyState={{
        message: t('hasSubdomainsCard.emptyMessage'),
        helpLink: entityColumnPresets.domain.helpLink,
      }}
    />
  );
}
