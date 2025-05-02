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
  CodeSnippet,
  InfoCard,
  InfoCardVariants,
  Link,
  Progress,
  TableColumn,
  WarningPanel,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { apiDocsTranslationRef } from '../../translation';

/**
 * @public
 */
export const ConsumingComponentsCard = (props: {
  variant?: InfoCardVariants;
  columns?: TableColumn<ComponentEntity>[];
}) => {
  const { variant = 'gridItem', columns = EntityTable.componentEntityColumns } =
    props;
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_API_CONSUMED_BY,
  });
  const { t } = useTranslationRef(apiDocsTranslationRef);

  if (loading) {
    return (
      <InfoCard variant={variant} title={t('consumingComponentsCard.title')}>
        <Progress />
      </InfoCard>
    );
  }

  if (error || !entities) {
    return (
      <InfoCard variant={variant} title={t('consumingComponentsCard.title')}>
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
      title={t('consumingComponentsCard.title')}
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
      entities={entities as ComponentEntity[]}
    />
  );
};
