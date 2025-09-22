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

import { ApiEntity, RELATION_HAS_PART } from '@backstage/catalog-model';
import Typography from '@material-ui/core/Typography';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import { useMemo } from 'react';
import { createSpecApiTypeColumn } from './presets';
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

/**
 * @public
 */
export const HasApisCard = (props: {
  variant?: InfoCardVariants;
  title?: string;
  columns?: TableColumn<ApiEntity>[];
  tableOptions?: TableOptions;
}) => {
  const { t } = useTranslationRef(apiDocsTranslationRef);
  const presetColumns: TableColumn<ApiEntity>[] = useMemo(() => {
    return [
      EntityTable.columns.createEntityRefColumn({ defaultKind: 'API' }),
      EntityTable.columns.createOwnerColumn(),
      createSpecApiTypeColumn(t),
      EntityTable.columns.createSpecLifecycleColumn(),
      EntityTable.columns.createMetadataDescriptionColumn(),
    ];
  }, [t]);
  const {
    variant = 'gridItem',
    title = t('hasApisCard.title'),
    columns = presetColumns,
    tableOptions = {},
  } = props;
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_HAS_PART,
    kind: 'API',
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
          title={t('hasApisCard.error.title')}
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
            {t('hasApisCard.emptyContent.title', {
              entity: entity.kind.toLocaleLowerCase('en-US'),
            })}
          </Typography>
          <Typography variant="body2">
            <Link to="https://backstage.io/docs/features/software-catalog/descriptor-format#kind-api">
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
};
