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

import { AlphaEntity, EntityStatusItem } from '@backstage/catalog-model/alpha';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityRefLink,
  useEntity,
} from '@backstage/plugin-catalog-react';
import Box from '@material-ui/core/Box';
import React from 'react';
import { ResponseErrorPanel } from '@backstage/core-components';
import {
  CatalogApi,
  ENTITY_STATUS_CATALOG_PROCESSING_TYPE,
} from '@backstage/catalog-client';
import { useApi, ApiHolder } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { SerializedError } from '@backstage/errors';
import { catalogTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const errorFilter = (i: EntityStatusItem) =>
  i.error &&
  i.level === 'error' &&
  i.type === ENTITY_STATUS_CATALOG_PROCESSING_TYPE;

interface GetOwnAndAncestorsErrorsResponse {
  items: {
    errors: SerializedError[];
    entity: Entity;
  }[];
}

async function getOwnAndAncestorsErrors(
  entityRef: string,
  catalogApi: CatalogApi,
): Promise<GetOwnAndAncestorsErrorsResponse> {
  const ancestors = await catalogApi.getEntityAncestors({ entityRef });
  const items = ancestors.items
    .map(item => {
      const statuses = (item.entity as AlphaEntity).status?.items ?? [];
      const errors = statuses
        .filter(errorFilter)
        .map(e => e.error)
        .filter((e): e is SerializedError => Boolean(e));
      return { errors: errors, entity: item.entity };
    })
    .filter(item => item.errors.length > 0);
  return { items };
}

/**
 * Returns true if the given entity has any processing errors on it.
 *
 * @public
 */
export async function hasCatalogProcessingErrors(
  entity: Entity,
  context: { apis: ApiHolder },
) {
  const catalogApi = context.apis.get(catalogApiRef);
  if (!catalogApi) {
    throw new Error(`No implementation available for ${catalogApiRef}`);
  }

  const errors = await getOwnAndAncestorsErrors(
    stringifyEntityRef(entity),
    catalogApi,
  );
  return errors.items.length > 0;
}

/**
 * Displays a list of errors from the ancestors of the current entity.
 *
 * @public
 */
export function EntityProcessingErrorsPanel() {
  const { entity } = useEntity();
  const entityRef = stringifyEntityRef(entity);
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value } = useAsync(async () => {
    return getOwnAndAncestorsErrors(entityRef, catalogApi);
  }, [entityRef, catalogApi]);
  const { t } = useTranslationRef(catalogTranslationRef);

  if (error) {
    return (
      <Box mb={1}>
        <ResponseErrorPanel error={error} />
      </Box>
    );
  }

  if (loading || !value) {
    return null;
  }

  return (
    <>
      {value.items.map((ancestorError, index) => (
        <Box key={index} mb={1}>
          {stringifyEntityRef(entity) !==
            stringifyEntityRef(ancestorError.entity) && (
            <Box p={1}>
              {t('entityProcessingErrorsDescription')}{' '}
              <EntityRefLink entityRef={ancestorError.entity} />
            </Box>
          )}
          {ancestorError.errors.map((e, i) => (
            <ResponseErrorPanel key={i} error={e} />
          ))}
        </Box>
      ))}
    </>
  );
}
