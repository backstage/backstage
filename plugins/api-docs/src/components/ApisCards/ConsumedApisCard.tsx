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

import { ApiEntity, RELATION_CONSUMES_API } from '@backstage/catalog-model';
import Typography from '@material-ui/core/Typography';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import {
  EntityRelationCard,
  EntityColumnConfig,
} from '@backstage/plugin-catalog-react/alpha';
import { getApiEntityColumns, getApiEntityColumnConfig } from './presets';
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
export interface ConsumedApisCardProps {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}

/**
 * Props for the legacy MUI-based rendering.
 * @deprecated Use {@link ConsumedApisCardProps} instead.
 * @public
 */
export interface ConsumedApisCardLegacyProps {
  title?: string;
  /** @deprecated Use `columnConfig` instead. */
  variant?: InfoCardVariants;
  /** @deprecated Use `columnConfig` instead. */
  columns?: TableColumn<ApiEntity>[];
  /** @deprecated Use `columnConfig` instead. */
  tableOptions?: TableOptions;
}

function isLegacyProps(
  props: ConsumedApisCardProps | ConsumedApisCardLegacyProps,
): props is ConsumedApisCardLegacyProps {
  return 'variant' in props || 'columns' in props || 'tableOptions' in props;
}

function ConsumedApisCardLegacy(props: ConsumedApisCardLegacyProps) {
  const { t } = useTranslationRef(apiDocsTranslationRef);
  const {
    variant = 'gridItem',
    title = t('consumedApisCard.title'),
    columns = getApiEntityColumns(t),
    tableOptions = {},
  } = props;
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_CONSUMES_API,
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
          title={t('consumedApisCard.error.title')}
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
            {t('consumedApisCard.emptyContent.title', {
              entity: entity.kind.toLocaleLowerCase('en-US'),
            })}
          </Typography>
          <Typography variant="body2">
            <Link
              to="https://backstage.io/docs/features/software-catalog/descriptor-format#specconsumesapis-optional"
              externalLinkIcon
            >
              {t('apisCardHelpLinkTitle')}
            </Link>
          </Typography>
        </div>
      }
      columns={columns}
      tableOptions={tableOptions}
      entities={entities as ApiEntity[]}
    />
  );
}

/**
 * @public
 */
export const ConsumedApisCard = (
  props: ConsumedApisCardProps | ConsumedApisCardLegacyProps,
) => {
  const { t } = useTranslationRef(apiDocsTranslationRef);
  const { entity } = useEntity();

  if (isLegacyProps(props)) {
    return <ConsumedApisCardLegacy {...props} />;
  }

  const {
    title = t('consumedApisCard.title'),
    columnConfig = getApiEntityColumnConfig(t),
  } = props;

  return (
    <EntityRelationCard
      title={title}
      relationType={RELATION_CONSUMES_API}
      columnConfig={columnConfig}
      emptyState={{
        message: t('consumedApisCard.emptyContent.title', {
          entity: entity.kind.toLocaleLowerCase('en-US'),
        }),
        helpLink:
          'https://backstage.io/docs/features/software-catalog/descriptor-format#specconsumesapis-optional',
      }}
    />
  );
};
