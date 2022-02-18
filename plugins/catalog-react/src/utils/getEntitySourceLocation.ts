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

import {
  ANNOTATION_SOURCE_LOCATION,
  Entity,
  parseLocationRef,
} from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';

/** @public */
export type EntitySourceLocation = {
  locationTargetUrl: string;
  integrationType?: string;
};

/** @public */
export function getEntitySourceLocation(
  entity: Entity,
  scmIntegrationsApi: ScmIntegrationRegistry,
): EntitySourceLocation | undefined {
  const sourceLocation =
    entity.metadata.annotations?.[ANNOTATION_SOURCE_LOCATION];

  if (!sourceLocation) {
    return undefined;
  }

  try {
    const sourceLocationRef = parseLocationRef(sourceLocation);
    const integration = scmIntegrationsApi.byUrl(sourceLocationRef.target);
    return {
      locationTargetUrl: sourceLocationRef.target,
      integrationType: integration?.type,
    };
  } catch {
    return undefined;
  }
}
