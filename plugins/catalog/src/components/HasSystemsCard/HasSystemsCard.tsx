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

import { RELATION_HAS_PART, SystemEntity } from '@backstage/catalog-model';
import {
  InfoCardVariants,
  TableColumn,
  TableOptions,
} from '@backstage/core-components';
import {
  EntityRelationCard,
  EntityColumnConfig,
  systemColumnConfig,
  systemEntityHelpLink,
} from '@backstage/plugin-catalog-react';
import {
  asSystemEntities,
  systemEntityColumns,
  systemEntityHelpLink as legacyHelpLink,
  RelatedEntitiesCard,
} from '../RelatedEntitiesCard';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface HasSystemsCardBaseProps {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}

/**
 * Props for the legacy MUI-based rendering.
 * @deprecated Use {@link HasSystemsCardBaseProps} instead.
 * @public
 */
export interface HasSystemsCardLegacyProps {
  title?: string;
  /** @deprecated Use `columnConfig` instead. */
  variant?: InfoCardVariants;
  /** @deprecated Use `columnConfig` instead. */
  columns?: TableColumn<SystemEntity>[];
  /** @deprecated Use `columnConfig` instead. */
  tableOptions?: TableOptions;
}

/** @public */
export type HasSystemsCardProps =
  | HasSystemsCardBaseProps
  | HasSystemsCardLegacyProps;

function isLegacyProps(
  props: HasSystemsCardProps,
): props is HasSystemsCardLegacyProps {
  return 'variant' in props || 'columns' in props || 'tableOptions' in props;
}

export function HasSystemsCard(props: HasSystemsCardProps) {
  const { t } = useTranslationRef(catalogTranslationRef);

  if (isLegacyProps(props)) {
    const {
      variant = 'gridItem',
      title = t('hasSystemsCard.title'),
      columns = systemEntityColumns,
      tableOptions = {},
    } = props;
    return (
      <RelatedEntitiesCard
        variant={variant}
        title={title}
        entityKind="System"
        relationType={RELATION_HAS_PART}
        columns={columns}
        asRenderableEntities={asSystemEntities}
        emptyMessage={t('hasSystemsCard.emptyMessage')}
        emptyHelpLink={legacyHelpLink}
        tableOptions={tableOptions}
      />
    );
  }

  const {
    title = t('hasSystemsCard.title'),
    columnConfig = systemColumnConfig,
  } = props;
  return (
    <EntityRelationCard
      title={title}
      entityKind="System"
      relationType={RELATION_HAS_PART}
      columnConfig={columnConfig}
      emptyState={{
        message: t('hasSystemsCard.emptyMessage'),
        helpLink: systemEntityHelpLink,
      }}
    />
  );
}
