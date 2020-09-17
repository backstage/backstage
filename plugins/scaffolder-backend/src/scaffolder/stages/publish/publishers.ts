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

import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { parseLocationAnnotation } from '../helpers';
import { PublisherBase, PublisherBuilder } from './types';
import { RemoteProtocol } from '../types';

export class Publishers implements PublisherBuilder {
  private publisherMap = new Map<RemoteProtocol, PublisherBase>();

  register(protocol: RemoteProtocol, publisher: PublisherBase) {
    this.publisherMap.set(protocol, publisher);
  }

  get(template: TemplateEntityV1alpha1): PublisherBase {
    const { protocol } = parseLocationAnnotation(template);
    const publisher = this.publisherMap.get(protocol);

    if (!publisher) {
      throw new Error(`No publisher registered for type: "${protocol}"`);
    }

    return publisher;
  }
}
