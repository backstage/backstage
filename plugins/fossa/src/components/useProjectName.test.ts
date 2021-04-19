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

import { Entity } from '@backstage/catalog-model';
import { renderHook } from '@testing-library/react-hooks';
import { useProjectName } from './useProjectName';

describe('useProjectName', () => {
  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'test',
      annotations: {
        'fossa.io/project-name': 'test',
      },
    },
  };

  it('should extract the fossa project name', async () => {
    const { result } = renderHook(() => useProjectName(entity));

    expect(result.current).toBe('test');
  });
});
