/*
 * Copyright 2021 The Backstage Authors
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
import {
  CatalogApi,
  catalogApiRef,
  useEntity,
} from '@backstage/plugin-catalog-react';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import useAsync from 'react-use/esm/useAsync';
import Box from '@material-ui/core/Box';
import { ResponseErrorPanel } from '@backstage/core-components';
import { useApi, ApiHolder } from '@backstage/core-plugin-api';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

async function getRelationWarnings(entity: Entity, catalogApi: CatalogApi) {
  const entityRefRelations = entity.relations?.map(
    relation => relation.targetRef,
  );
  if (
    !entityRefRelations ||
    entityRefRelations?.length < 1 ||
    entityRefRelations.length > 1000
  ) {
    return [];
  }

  const relatedEntities = await catalogApi.getEntitiesByRefs({
    entityRefs: entityRefRelations,
    fields: ['kind', 'metadata.name', 'metadata.namespace'],
  });

  return entityRefRelations.filter(
    (_, index) => relatedEntities.items[index] === undefined,
  );
}

/**
 * Returns true if the given entity has relations to other entities, which
 * don't exist in the catalog
 *
 * @public
 */
export async function hasRelationWarnings(
  entity: Entity,
  context: { apis: ApiHolder },
) {
  const catalogApi = context.apis.get(catalogApiRef);
  if (!catalogApi) {
    throw new Error(`No implementation available for ${catalogApiRef}`);
  }

  const relatedEntitiesMissing = await getRelationWarnings(entity, catalogApi);
  return relatedEntitiesMissing.length > 0;
}

/**
 * Displays a warning alert if the entity has relations to other entities, which
 * don't exist in the catalog
 *
 * @public
 */
export function EntityRelationWarning() {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value } = useAsync(async () => {
    return getRelationWarnings(entity, catalogApi);
  }, [entity, catalogApi]);
  const { t } = useTranslationRef(catalogTranslationRef);

  if (error) {
    return (
      <Box mb={1}>
        <ResponseErrorPanel error={error} />
      </Box>
    );
  }

  if (loading || !value || value.length === 0) {
    return null;
  }

  return (
    <>
      <Alert severity="warning" style={{ whiteSpace: 'pre-line' }}>
        {t('entityRelationWarningDescription')} {value.join(', ')}
      </Alert>
    </>
  );
}
