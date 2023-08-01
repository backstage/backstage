/*
 * Copyright 2023 The Backstage Authors
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
