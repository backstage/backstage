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
import { PreparerBase } from './types';
import { Entity } from '@backstage/catalog-model';
import path from 'path';
import { parseReferenceAnnotation } from './helpers';

export class DirectoryPreparer implements PreparerBase {
  prepare(entity: Entity): Promise<string> {
    const { location: managedByLocation } = parseReferenceAnnotation(
      'backstage.io/managed-by-location',
      entity,
    );
    const { location: techdocsLocation } = parseReferenceAnnotation(
      'backstage.io/techdocs-ref',
      entity,
    );

    const managedByLocationDirectory = path.dirname(managedByLocation);

    return new Promise(resolve => {
      resolve(path.resolve(managedByLocationDirectory, techdocsLocation));
    });
  }
}
