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

import { createMetadataRef } from '@backstage/core-plugin-api';
import { MetadataAggregator } from './MetadataAggregator';
import { MetadataRegistry } from './MetadataRegistry';

describe('MetadataAggregator', () => {
  const apiARef = createMetadataRef<number>({ id: '1' });
  const apiBRef = createMetadataRef<number>({ id: '2' });

  it('should forward implementations', () => {
    const holder1 = new MetadataRegistry();
    holder1.register(apiARef.id, { label: 'label 1' });
    const holder2 = new MetadataRegistry();
    holder2.register(apiBRef.id, { label: 'label 2' });

    const agg = new MetadataAggregator(holder1, holder2);
    expect(agg.get(apiARef)).toEqual({ label: 'label 1' });
    expect(agg.get(apiBRef)).toEqual({ label: 'label 2' });
  });

  it('should return the first implementation', () => {
    const holder1 = new MetadataRegistry();
    holder1.register(apiARef.id, { label: 'label 1' });
    const holder2 = new MetadataRegistry();
    holder2.register(apiARef.id, { label: 'label 2' });

    const agg = new MetadataAggregator(holder1, holder2);
    expect(agg.get(apiARef)).toEqual({ label: 'label 1' });
  });
});
