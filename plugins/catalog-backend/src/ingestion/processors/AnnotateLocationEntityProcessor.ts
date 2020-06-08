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

import lodash from 'lodash';
import * as result from './results';
import { LocationProcessor, LocationProcessorResult } from './types';

export class AnnotateLocationEntityProcessor implements LocationProcessor {
  async process(
    item: LocationProcessorResult,
  ): Promise<LocationProcessorResult | undefined> {
    if (item.type !== 'entity') {
      return item;
    }

    const { location, entity } = item;
    const output = lodash.merge(
      {
        metadata: {
          annotations: {
            'backstage.io/managed-by-location': `${location.type}:${location.target}`,
          },
        },
      },
      entity,
    );

    return result.entity(item.location, output);
  }
}
