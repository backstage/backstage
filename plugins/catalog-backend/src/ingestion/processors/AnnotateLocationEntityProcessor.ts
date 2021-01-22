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

import {
  Entity,
  LOCATION_ANNOTATION,
  LocationSpec,
  ORIGIN_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import lodash from 'lodash';
import { CatalogProcessor, CatalogProcessorEmit } from './types';

export class AnnotateLocationEntityProcessor implements CatalogProcessor {
  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
    _: CatalogProcessorEmit,
    originLocation: LocationSpec,
  ): Promise<Entity> {
    return lodash.merge(
      {
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]: `${location.type}:${location.target}`,
            [ORIGIN_LOCATION_ANNOTATION]: `${originLocation.type}:${originLocation.target}`,
          },
        },
      },
      entity,
    );
  }
}
