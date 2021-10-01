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

import {
  Entity,
  EntityName,
  getEntityName,
  stringifyEntityRef,
  UNSTABLE_EntityStatusItem,
} from '@backstage/catalog-model';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { Box } from '@material-ui/core';
import React from 'react';
import { ResponseErrorPanel } from '@backstage/core-components';
import {
  CatalogApi,
  ENTITY_STATUS_CATALOG_PROCESSING_TYPE,
} from '@backstage/catalog-client';
import { useApi, ApiHolder } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { SerializedError } from '@backstage/errors';

const errorFilter = (i: UNSTABLE_EntityStatusItem) =>
  i.error &&
  i.level === 'error' &&
  i.type === ENTITY_STATUS_CATALOG_PROCESSING_TYPE;

async function getOwnAndAncestorsErrors(
  entityRef: EntityName,
  catalogApi: CatalogApi,
): Promise<SerializedError[]> {
  const ancestors = await catalogApi.getEntityAncestors({ entityRef });
  return ancestors.items.flatMap(item => {
    const statuses = item.entity.status?.items ?? [];
    return statuses
      .filter(errorFilter)
      .map(e => e.error)
      .filter((e): e is SerializedError => Boolean(e));
  });
}

export const hasCatalogProcessingErrors = async (
  entity: Entity,
  context: { apis: ApiHolder },
) => {
  const catalogApi = context.apis.get(catalogApiRef);
  if (!catalogApi) {
    throw new Error(`No implementation available for ${catalogApiRef}`);
  }

  const errors = await getOwnAndAncestorsErrors(
    getEntityName(entity),
    catalogApi,
  );
  return errors.length > 0;
};

/**
 * Displays a list of errors from the ancestors of the current entity.
 */
export const EntityProcessingErrorsPanel = () => {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);

  const { loading, error, value } = useAsync(async () => {
    return getOwnAndAncestorsErrors(getEntityName(entity), catalogApi);
  }, [stringifyEntityRef(entity), catalogApi]);

  if (error) {
    return (
      <Box mb={1}>
        <ResponseErrorPanel error={error} />
      </Box>
    );
  }

  if (loading || !value?.length) {
    return null;
  }

  return (
    <>
      {value.map((ancestorError, index) => (
        <Box key={index} mb={1}>
          <ResponseErrorPanel error={ancestorError} />
        </Box>
      ))}
    </>
  );
};
