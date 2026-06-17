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
  RELATION_API_CONSUMED_BY,
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
export interface ConsumingComponentsCardProps {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}

/**
 * Props for the legacy MUI-based rendering.
 * @deprecated Use {@link ConsumingComponentsCardProps} instead.
 * @public
 */
export interface ConsumingComponentsCardLegacyProps {
  title?: string;
  /** @deprecated Use `columnConfig` instead. */
  variant?: InfoCardVariants;
  /** @deprecated Use `columnConfig` instead. */
  columns?: TableColumn<ComponentEntity>[];
  /** @deprecated Use `columnConfig` instead. */
  tableOptions?: TableOptions;
}

function isLegacyProps(
  props: ConsumingComponentsCardProps | ConsumingComponentsCardLegacyProps,
): props is ConsumingComponentsCardLegacyProps {
  return 'variant' in props || 'columns' in props || 'tableOptions' in props;
}

function ConsumingComponentsCardLegacy(
  props: ConsumingComponentsCardLegacyProps,
) {
  const { t } = useTranslationRef(apiDocsTranslationRef);
  const {
    variant = 'gridItem',
    title = t('consumingComponentsCard.title'),
    columns = EntityTable.componentEntityColumns,
    tableOptions = {},
  } = props;
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_API_CONSUMED_BY,
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
          title={t('consumingComponentsCard.error.title')}
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
            {t('consumingComponentsCard.emptyContent.title')}
          </Typography>
          <Typography variant="body2">
            <Link to="https://backstage.io/docs/features/software-catalog/descriptor-format#specconsumesapis-optional">
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

/**
 * @public
 */
export const ConsumingComponentsCard = (
  props: ConsumingComponentsCardProps | ConsumingComponentsCardLegacyProps,
) => {
  const { t } = useTranslationRef(apiDocsTranslationRef);

  if (isLegacyProps(props)) {
    return <ConsumingComponentsCardLegacy {...props} />;
  }

  const {
    title = t('consumingComponentsCard.title'),
    columnConfig = entityColumnPresets.component.columns,
  } = props;

  return (
    <EntityRelationCard
      title={title}
      relationType={RELATION_API_CONSUMED_BY}
      columnConfig={columnConfig}
      emptyState={{
        message: t('consumingComponentsCard.emptyContent.title'),
        helpLink:
          'https://backstage.io/docs/features/software-catalog/descriptor-format#specconsumesapis-optional',
      }}
    />
  );
};
