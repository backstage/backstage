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

import { Entity } from '@backstage/catalog-model';
import Typography from '@material-ui/core/Typography';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import {
  InfoCard,
  InfoCardVariants,
  Link,
  Progress,
  ResponseErrorPanel,
  TableColumn,
  TableOptions,
} from '@backstage/core-components';
import {
  asComponentEntities,
  asDomainEntities,
  asResourceEntities,
  asSystemEntities,
  componentEntityColumns,
  componentEntityHelpLink,
  domainEntityColumns,
  domainEntityHelpLink,
  resourceEntityColumns,
  resourceEntityHelpLink,
  systemEntityColumns,
  systemEntityHelpLink,
} from './presets';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export type RelatedEntitiesCardProps<T extends Entity> = {
  variant?: InfoCardVariants;
  title: string;
  columns: TableColumn<T>[];
  entityKind?: string;
  relationType: string;
  emptyMessage: string;
  emptyHelpLink: string;
  asRenderableEntities: (entities: Entity[]) => T[];
  tableOptions?: TableOptions;
};

/**
 * A low level card component that can be used as a building block for more
 * specific cards.
 *
 * @remarks
 *
 * You probably want to make a dedicated component for your needs, which renders
 * this card as its implementation with some of the props set to the appropriate
 * values.
 *
 * @public
 */
export const RelatedEntitiesCard = <T extends Entity>(
  props: RelatedEntitiesCardProps<T>,
) => {
  const {
    variant = 'gridItem',
    title,
    columns,
    entityKind,
    relationType,
    emptyMessage,
    emptyHelpLink,
    asRenderableEntities,
    tableOptions = {},
  } = props;
  const { t } = useTranslationRef(catalogTranslationRef);
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: relationType,
    kind: entityKind,
  });

  if (loading) {
    return (
      <InfoCard variant={variant} title={title}>
        <Progress />
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard variant={variant} title={title}>
        <ResponseErrorPanel error={error} />
      </InfoCard>
    );
  }

  return (
    <EntityTable
      title={title}
      variant={variant}
      emptyContent={
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body1">{emptyMessage}</Typography>
          <Typography variant="body2">
            <Link to={emptyHelpLink} externalLinkIcon>
              {t('relatedEntitiesCard.emptyHelpLinkTitle')}
            </Link>
          </Typography>
        </div>
      }
      columns={columns}
      entities={asRenderableEntities(entities || [])}
      tableOptions={tableOptions}
    />
  );
};

RelatedEntitiesCard.componentEntityColumns = componentEntityColumns;
RelatedEntitiesCard.componentEntityHelpLink = componentEntityHelpLink;
RelatedEntitiesCard.asComponentEntities = asComponentEntities;
RelatedEntitiesCard.resourceEntityColumns = resourceEntityColumns;
RelatedEntitiesCard.resourceEntityHelpLink = resourceEntityHelpLink;
RelatedEntitiesCard.asResourceEntities = asResourceEntities;
RelatedEntitiesCard.systemEntityColumns = systemEntityColumns;
RelatedEntitiesCard.systemEntityHelpLink = systemEntityHelpLink;
RelatedEntitiesCard.asSystemEntities = asSystemEntities;
RelatedEntitiesCard.domainEntityColums = domainEntityColumns;
RelatedEntitiesCard.domainEntityHelpLink = domainEntityHelpLink;
RelatedEntitiesCard.asDomainEntities = asDomainEntities;
