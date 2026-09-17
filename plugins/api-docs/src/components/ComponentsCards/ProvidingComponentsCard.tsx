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
  RELATION_API_PROVIDED_BY,
} from '@backstage/catalog-model';
import Typography from '@material-ui/core/Typography';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import {
  EntityRelationCard,
  EntityColumnConfig,
  entityColumnPresets,
} from '@backstage/plugin-catalog-react/alpha';
import {
  CodeSnippet,
  InfoCard,
  InfoCardVariants,
  Link,
  Progress,
  TableColumn,
  TableOptions,
  WarningPanel,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { apiDocsTranslationRef } from '../../translation';

/** @public */
export interface ProvidingComponentsCardProps {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}

/**
 * Props for the legacy MUI-based rendering.
 * @deprecated Use {@link ProvidingComponentsCardProps} instead.
 * @public
 */
export interface ProvidingComponentsCardLegacyProps {
  title?: string;
  /** @deprecated Use `columnConfig` instead. */
  variant?: InfoCardVariants;
  /** @deprecated Use `columnConfig` instead. */
  columns?: TableColumn<ComponentEntity>[];
  /** @deprecated Use `columnConfig` instead. */
  tableOptions?: TableOptions;
}

function isLegacyProps(
  props: ProvidingComponentsCardProps | ProvidingComponentsCardLegacyProps,
): props is ProvidingComponentsCardLegacyProps {
  return 'variant' in props || 'columns' in props || 'tableOptions' in props;
}

function ProvidingComponentsCardLegacy(
  props: ProvidingComponentsCardLegacyProps,
) {
  const { t } = useTranslationRef(apiDocsTranslationRef);
  const {
    variant = 'gridItem',
    title = t('providingComponentsCard.title'),
    columns = EntityTable.componentEntityColumns,
    tableOptions = {},
  } = props;
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_API_PROVIDED_BY,
  });

  if (loading) {
    return (
      <InfoCard variant={variant} title={title}>
        <Progress />
      </InfoCard>
    );
  }

  if (error || !entities) {
    return (
      <InfoCard variant={variant} title={title}>
        <WarningPanel
          severity="error"
          title={t('providingComponentsCard.error.title')}
          message={<CodeSnippet text={`${error}`} language="text" />}
        />
      </InfoCard>
    );
  }

  return (
    <EntityTable
      title={title}
      variant={variant}
      emptyContent={
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body1">
            {t('providingComponentsCard.emptyContent.title')}
          </Typography>
          <Typography variant="body2">
            <Link to="https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional">
              {t('apisCardHelpLinkTitle')}
            </Link>
          </Typography>
        </div>
      }
      columns={columns}
      tableOptions={tableOptions}
      entities={entities as ComponentEntity[]}
    />
  );
}

/** @public */
export const ProvidingComponentsCard = (
  props: ProvidingComponentsCardProps | ProvidingComponentsCardLegacyProps,
) => {
  const { t } = useTranslationRef(apiDocsTranslationRef);

  if (isLegacyProps(props)) {
    return <ProvidingComponentsCardLegacy {...props} />;
  }

  const {
    title = t('providingComponentsCard.title'),
    columnConfig = entityColumnPresets.component.columns,
  } = props;

  return (
    <EntityRelationCard
      title={title}
      relationType={RELATION_API_PROVIDED_BY}
      columnConfig={columnConfig}
      emptyState={{
        message: t('providingComponentsCard.emptyContent.title'),
        helpLink:
          'https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional',
      }}
    />
  );
};
