/*
 * Copyright 2020 Spotify AB
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

import { ApiEntity, Entity, LocationSpec } from '@backstage/catalog-model';
import {
  LocationProcessor,
  LocationProcessorEmit,
  LocationProcessorRead,
} from './types';

const DEFINITION_AT_LOCATION_ANNOTATION = 'backstage.io/definition-at-location';

export class ApiDefinitionAtLocationProcessor implements LocationProcessor {
  async processEntity(
    entity: Entity,
    _location: LocationSpec,
    _emit: LocationProcessorEmit,
    read: LocationProcessorRead,
  ): Promise<Entity> {
    if (
      entity.kind !== 'API' ||
      !entity.metadata.annotations ||
      !entity.metadata.annotations[DEFINITION_AT_LOCATION_ANNOTATION]
    ) {
      return entity;
    }

    const reference =
      entity.metadata.annotations[DEFINITION_AT_LOCATION_ANNOTATION];
    const { type, target } = extractReference(reference);
    const result = await read({ type, target });

    if (result.type === 'error') {
      throw new Error(`Failed to read location: ${result.error.message}`);
    }

    if (result.type !== 'data') {
      throw new Error(
        `Only supports location processor results of type 'data', but got '${result.type}'`,
      );
    }

    const definition = result.data.toString();
    const apiEntity = entity as ApiEntity;
    apiEntity.spec.definition = definition;

    return entity;
  }
}

function extractReference(reference: string): { type: string; target: string } {
  const delimiterIndex = reference.indexOf(':');
  const type = reference.slice(0, delimiterIndex);
  const target = reference.slice(delimiterIndex + 1);

  return { type, target };
}
