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

import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { Route, Routes } from 'react-router-dom';
import { EntityNomadAllocationListTable } from './components/EntityNomadAllocationListTable/EntityNomadAllocationListTable';

/** @public */
export const NOMAD_NAMESPACE_ANNOTATION = 'nomad.io/namespace';

/** @public */
export const NOMAD_JOB_ID_ANNOTATION = 'nomad.io/job-id';

/** @public */
export const NOMAD_GROUP_ANNOTATION = 'nomad.io/group';

/** @public */
export const isNomadJobIDAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[NOMAD_JOB_ID_ANNOTATION]);

/** @public */
export const isNomadAllocationsAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[NOMAD_JOB_ID_ANNOTATION]) ||
  Boolean(entity.metadata.annotations?.[NOMAD_GROUP_ANNOTATION]);

export const EmbeddedRouter = () => {
  const { entity } = useEntity();

  if (!isNomadAllocationsAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState
        annotation={[NOMAD_JOB_ID_ANNOTATION, NOMAD_GROUP_ANNOTATION]}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<EntityNomadAllocationListTable />} />
    </Routes>
  );
};
