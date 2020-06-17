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

import { PreparerBase, RemoteLocation, PreparerBuilder } from './types';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';

export class Preparers implements PreparerBuilder {
  private preparerMap = new Map<RemoteLocation, PreparerBase>();

  register(key: RemoteLocation, processor: PreparerBase) {
    this.preparerMap.set(key, processor);
  }

  get(template: TemplateEntityV1alpha1): PreparerBase {
    const preparerKey = this.getPreparerKeyFromEntity(template);
    const preparer = this.preparerMap.get(preparerKey);

    if (!preparer) {
      throw new Error(`No preparer registered for type ${preparerKey}`);
    }

    return preparer;
  }

  private getPreparerKeyFromEntity(
    entity: TemplateEntityV1alpha1,
  ): RemoteLocation {
    const annotation =
      entity.metadata.annotations?.['backstage.io/managed-by-location'] ?? '';
    const [key] = annotation?.split(':');

    if (!key) {
      throw new Error('Failed to parse the location data');
    }

    return key as RemoteLocation;
  }
}
