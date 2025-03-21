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
  entityEnvelopeSchemaValidator,
  entitySchemaValidator,
  LocationEntity,
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { JsonObject, JsonValue } from '@backstage/types';
import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import path from 'path';
import { LocationSpec } from '@backstage/plugin-catalog-common';

export function isLocationEntity(entity: Entity): entity is LocationEntity {
  return entity.kind === 'Location';
}

export function getEntityLocationRef(entity: Entity): string {
  const ref = entity.metadata.annotations?.[ANNOTATION_LOCATION];
  if (!ref) {
    const entityRef = stringifyEntityRef(entity);
    throw new InputError(
      `Entity '${entityRef}' does not have the annotation ${ANNOTATION_LOCATION}`,
    );
  }
  return ref;
}

export function getEntityOriginLocationRef(entity: Entity): string {
  const ref = entity.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION];
  if (!ref) {
    const entityRef = stringifyEntityRef(entity);
    throw new InputError(
      `Entity '${entityRef}' does not have the annotation ${ANNOTATION_ORIGIN_LOCATION}`,
    );
  }
  return ref;
}

export function toAbsoluteUrl(
  integrations: ScmIntegrationRegistry,
  base: LocationSpec,
  type: string,
  target: string,
): string {
  if (base.type !== type) {
    return target;
  }
  try {
    if (type === 'file') {
      if (target.startsWith('.')) {
        return path.join(path.dirname(base.target), target);
      }
      return target;
    } else if (type === 'url') {
      return integrations.resolveUrl({ url: target, base: base.target });
    }
    return target;
  } catch (e) {
    return target;
  }
}

export function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export const validateEntity = entitySchemaValidator();

export const validateEntityEnvelope = entityEnvelopeSchemaValidator();
