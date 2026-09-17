/*
 * Copyright 2026 The Backstage Authors
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

import { Alert, Link, Text } from '@backstage/ui';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { EntityInfoCard } from '../EntityInfoCard';
import { EntityDataTable } from '../EntityDataTable';
import { EntityColumnConfig } from '../EntityDataTable/columnFactories';
import { useEntity, useRelatedEntities } from '../../hooks';
import { catalogReactTranslationRef } from '../../translation';

/** @public */
export interface EntityRelationCardProps {
  title: string;
  relationType: string;
  entityKind?: string;
  columnConfig: EntityColumnConfig[];
  emptyState?: {
    message: string;
    helpLink?: string;
  };
  className?: string;
}

/** @public */
export function EntityRelationCard(props: EntityRelationCardProps) {
  const {
    title,
    relationType,
    entityKind,
    columnConfig,
    emptyState,
    className,
  } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: relationType,
    kind: entityKind,
  });

  return (
    <EntityInfoCard title={title} className={className}>
      {error ? (
        <Alert status="warning" icon title={error.message} role="status" />
      ) : (
        <EntityDataTable
          columnConfig={columnConfig}
          data={entities ?? []}
          loading={loading}
          emptyState={
            emptyState && (
              <Text as="p">
                {emptyState.message}{' '}
                {emptyState.helpLink && (
                  <Link
                    href={emptyState.helpLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body-medium"
                  >
                    {t('entityRelationCard.emptyHelpLinkTitle')}
                  </Link>
                )}
              </Text>
            )
          }
        />
      )}
    </EntityInfoCard>
  );
}
