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

import { useTechDocsReaderPage } from '@backstage/plugin-techdocs-react';
import {
  EntityRefLink,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { Card, CardBody, Text } from '@backstage/ui';
import capitalize from 'lodash/capitalize';
import styles from './TechDocsReaderEntityCard.module.css';
import { TechDocsReaderSearch } from './TechDocsReaderSearch';

export type TechDocsReaderEntityCardProps = {
  withSearch?: boolean;
};

export const TechDocsReaderEntityCard = (
  props: TechDocsReaderEntityCardProps,
) => {
  const { withSearch } = props;
  const {
    entityRef,
    entityMetadata: { value: entityMetadata, loading: entityMetadataLoading },
  } = useTechDocsReaderPage();

  if (entityMetadataLoading || !entityMetadata) return null;

  const { spec } = entityMetadata;
  const lifecycle = spec?.lifecycle;
  const ownedByRelations = getEntityRelations(
    entityMetadata,
    RELATION_OWNED_BY,
  );

  return (
    <Card className={styles.entityCard}>
      <CardBody className={styles.cardBody}>
        <dl className={styles.definitionList}>
          <div className={styles.definitionGroup}>
            <dt>
              <Text variant="body-small" weight="bold">
                {capitalize(entityMetadata.kind)}:
              </Text>
            </dt>
            <dd className={styles.definitionValue}>
              <EntityRefLink
                entityRef={entityRef}
                title={entityMetadata.metadata.title}
                defaultKind="Component"
              />
            </dd>
          </div>
          {ownedByRelations.length > 0 && (
            <div className={styles.definitionGroup}>
              <dt>
                <Text variant="body-small" weight="bold">
                  Owner:
                </Text>
              </dt>
              <dd className={styles.definitionValue}>
                <EntityRefLinks
                  entityRefs={ownedByRelations}
                  defaultKind="group"
                />
              </dd>
            </div>
          )}
          {lifecycle && (
            <div className={styles.definitionGroup}>
              <dt>
                <Text variant="body-small" weight="bold">
                  Lifecycle:
                </Text>
              </dt>
              <dd className={styles.definitionValue}>
                <Text variant="body-small">{String(lifecycle)}</Text>
              </dd>
            </div>
          )}
        </dl>
        {withSearch && (
          <div className={styles.searchWrapper}>
            <TechDocsReaderSearch entityId={entityRef} />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
