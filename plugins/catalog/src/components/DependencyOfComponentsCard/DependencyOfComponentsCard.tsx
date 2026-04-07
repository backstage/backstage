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

import {
  ComponentEntity,
  RELATION_DEPENDENCY_OF,
} from '@backstage/catalog-model';
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
  asComponentEntities,
  componentEntityColumns,
  componentEntityHelpLink as legacyHelpLink,
  RelatedEntitiesCard,
} from '../RelatedEntitiesCard';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface DependencyOfComponentsCardProps {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}

/**
 * Props for the legacy MUI-based rendering.
 * @deprecated Use {@link DependencyOfComponentsCardProps} instead.
 * @public
 */
export interface DependencyOfComponentsCardLegacyProps {
  title?: string;
  /** @deprecated Use `columnConfig` instead. */
  variant?: InfoCardVariants;
  /** @deprecated Use `columnConfig` instead. */
  columns?: TableColumn<ComponentEntity>[];
  /** @deprecated Use `columnConfig` instead. */
  tableOptions?: TableOptions;
}

function isLegacyProps(
  props:
    | DependencyOfComponentsCardProps
    | DependencyOfComponentsCardLegacyProps,
): props is DependencyOfComponentsCardLegacyProps {
  return 'variant' in props || 'columns' in props || 'tableOptions' in props;
}

export function DependencyOfComponentsCard(
  props:
    | DependencyOfComponentsCardProps
    | DependencyOfComponentsCardLegacyProps,
) {
  const { t } = useTranslationRef(catalogTranslationRef);

  if (isLegacyProps(props)) {
    const {
      variant = 'gridItem',
      title = t('dependencyOfComponentsCard.title'),
      columns = componentEntityColumns,
      tableOptions = {},
    } = props;
    return (
      <RelatedEntitiesCard
        variant={variant}
        title={title}
        entityKind="Component"
        relationType={RELATION_DEPENDENCY_OF}
        columns={columns}
        emptyMessage={t('dependencyOfComponentsCard.emptyMessage')}
        emptyHelpLink={legacyHelpLink}
        asRenderableEntities={asComponentEntities}
        tableOptions={tableOptions}
      />
    );
  }

  const {
    title = t('dependencyOfComponentsCard.title'),
    columnConfig = entityColumnPresets.component.columns,
  } = props;
  return (
    <EntityRelationCard
      title={title}
      entityKind="Component"
      relationType={RELATION_DEPENDENCY_OF}
      columnConfig={columnConfig}
      emptyState={{
        message: t('dependencyOfComponentsCard.emptyMessage'),
        helpLink: entityColumnPresets.component.helpLink,
      }}
    />
  );
}
