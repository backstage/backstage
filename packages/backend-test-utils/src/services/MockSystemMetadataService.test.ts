/*
 * Copyright 2025 The Backstage Authors
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

import { BackstageInstance } from '@backstage/backend-plugin-api';
import { MockSystemMetadataService } from './MockSystemMetadataService';

describe('MockSystemMetadataService', () => {
  it('should return the passed in instances', () => {
    expect.assertions(1);
    const instances: BackstageInstance[] = [
      { internalUrl: 'localhost:7007', externalUrl: 'external.url' },
      { internalUrl: 'localhost:7008', externalUrl: 'other.external.url' },
    ];
    const service = MockSystemMetadataService.create({ instances });
    service.instances().subscribe({
      next: value => {
        expect(value).toEqual(instances);
      },
    });
  });
});
