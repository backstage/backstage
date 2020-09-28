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

import { LocationEntity } from '@backstage/catalog-model';

export const MOCK_DATA = {
  locations: {
    'service-x/catalog-info.yaml': {
      kind: 'component',
      metadata: {
        name: 'x',
        annotations: {
          'acme.org/tier': '1',
        },
      },
    },
    'service-y/catalog-info.yaml': {
      kind: 'component',
      metadata: {
        name: 'y',
        labels: {
          lifecycle: 'production',
        },
      },
    },
    'location-z/catalog-info.yaml': {
      kind: 'Location',
      metadata: {
        name: 'loc-z',
      },
      spec: {
        type: 'file',
        target: 'service-z/catalog-info.yaml',
      },
    },
    'service-z/catalog-info.yaml': {
      kind: 'component',
      metadata: {
        name: 'z',
      },
    },
  } as { [key: string]: unknown },
};

export const MOCK_LOCATION_ENTITIES: LocationEntity[] = [
  'service-x/catalog-info.yaml',
  'service-y/catalog-info.yaml',
  'location-z/catalog-info.yaml',
].map((target, index) => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Location',
  metadata: {
    name: `mock-loc-${index}`,
  },
  spec: { type: 'url', target },
}));

export class MockDataReader {
  read(location: string): Buffer {
    if (location in MOCK_DATA.locations) {
      const data = MOCK_DATA.locations[location];
      return Buffer.from(JSON.stringify(data), 'utf8');
    }
    throw new Error(`Not found, ${location}`);
  }
}
