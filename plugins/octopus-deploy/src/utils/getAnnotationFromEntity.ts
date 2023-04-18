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
import {
  OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION,
  OCTOPUS_DEPLOY_SPACE_ID_ANNOTATION,
} from '../constants';

import { Entity } from '@backstage/catalog-model';

export function getProjectIdAnnotationFromEntity(entity: Entity): string {
  const annotation =
    entity.metadata.annotations?.[OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION];
  if (!annotation) {
    throw new Error(
      `Value for annotation ${OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION} was not found`,
    );
  }

  return annotation;
}

export function getSpaceIdAnnotationFromEntity(
  entity: Entity,
): string | undefined {
  const annotation =
    entity.metadata.annotations?.[OCTOPUS_DEPLOY_SPACE_ID_ANNOTATION];

  return annotation || undefined;
}
