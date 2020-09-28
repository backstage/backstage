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

import { Catalog } from './TreeProcessing';
import {
  DummyLabelProcessor,
  LocationProcessor,
  StaticLocationProcessor,
} from './processing';
import { MockDataReader, MOCK_LOCATION_ENTITIES } from './mock-data';

describe('FluidProcessing', () => {
  it('should process the catalog', () => {
    const catalog = new Catalog({
      processors: [
        new StaticLocationProcessor(MOCK_LOCATION_ENTITIES),
        new DummyLabelProcessor(),
        new LocationProcessor(),
      ],
      reader: new MockDataReader(),
    });

    const allEntities = Array.from(catalog.getEntities());
    expect(allEntities).toEqual([]);

    catalog.process({});

    const newEntities = Array.from(catalog.getEntities());
    expect(newEntities.length).toBeGreaterThan(1);
    console.log(JSON.stringify(newEntities, null, 2));
  });
});
