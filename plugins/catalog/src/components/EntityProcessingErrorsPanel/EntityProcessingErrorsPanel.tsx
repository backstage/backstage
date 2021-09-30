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
  getEntityName,
  UNSTABLE_EntityStatusItem,
} from '@backstage/catalog-model';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { Box } from '@material-ui/core';
import React from 'react';
import { ResponseErrorPanel } from '@backstage/core-components';
import { ENTITY_STATUS_CATALOG_PROCESSING_TYPE } from '@backstage/catalog-client';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';

const errorFilter = (i: UNSTABLE_EntityStatusItem) =>
  i.error &&
  i.level === 'error' &&
  i.type === ENTITY_STATUS_CATALOG_PROCESSING_TYPE;

export const hasCatalogProcessingErrors = async (entity: Entity) => {
  // go grab ancestors and check all items, not just the current entity
  return entity?.status?.items?.filter(errorFilter).length! > 0;
};

/**
 * Displays a list of errors if the entity is invalid.
 */
export const EntityProcessingErrorsPanel = () => {
  const { entity } = useEntity();
  const catalogProcessingErrors =
    (entity?.status?.items?.filter(
      errorFilter,
    ) as Required<UNSTABLE_EntityStatusItem>[]) || [];

  return catalogProcessingErrors.map(({ error }, index) => (
    <Box key={index} mb={1}>
      <ResponseErrorPanel error={error} />
    </Box>
  ));
};

/**
 * Displays a list of errors from the ancestors of the current entity.
 */
export const EntityAncestorsProcessingErrorsPanel = () => {
  // move this logic into the existing component
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);

  const { loading, value, error } = useAsync(() =>
    catalogApi.getEntityAncestors({ entityName: getEntityName(entity) }),
  );

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <Box mb={1}>
        <ResponseErrorPanel error={error} />
      </Box>
    );
  }

  const ancestorErrors =
    value?.items.flatMap(({ entity: ancestor }) =>
      ancestor?.status?.items?.filter?.(errorFilter),
    ) ?? [];

  if (ancestorErrors.length === 0) {
    return null;
  }

  const filteredAncestors = ancestorErrors.filter(
    (e): e is UNSTABLE_EntityStatusItem => Boolean(e),
  );

  return filteredAncestors.map(({ error: ancestorError }, index) => (
    <Box key={index} mb={1}>
      <ResponseErrorPanel error={ancestorError!} />
    </Box>
  ));
};
