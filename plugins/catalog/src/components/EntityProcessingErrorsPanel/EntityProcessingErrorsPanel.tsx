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

import { Entity, UNSTABLE_EntityStatusItem } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Box } from '@material-ui/core';
import React from 'react';
import { ResponseErrorPanel } from '@backstage/core-components';
import { ENTITY_STATUS_CATALOG_PROCESSING_TYPE } from '@backstage/catalog-client';

const errorfilter = (i: UNSTABLE_EntityStatusItem) =>
  i.error &&
  i.level === 'error' &&
  i.type === ENTITY_STATUS_CATALOG_PROCESSING_TYPE;

export const hasCatalogProcessingErrors = (entity: Entity) =>
  entity?.status?.items?.filter(errorfilter).length! > 0;

/**
 * Displays a list of errors if the entity is invalid.
 */
export const EntityProcessingErrorsPanel = () => {
  const { entity } = useEntity();
  const catalogProcessingErrors =
    (entity?.status?.items?.filter(
      errorfilter,
    ) as Required<UNSTABLE_EntityStatusItem>[]) || [];

  return (
    <>
      {catalogProcessingErrors.map(({ error }, index) => (
        <Box key={index} mb={1}>
          <ResponseErrorPanel error={error} />
        </Box>
      ))}
    </>
  );
};
