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
import { DirectoryPreparer } from './dir';

const createMockEntity = (annotations: {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'testName',
      annotations: {
        ...annotations,
      },
    },
  };
};

describe('directory preparer', () => {
  it('should merge managed-by-location and techdocs-ref when techdocs-ref is relative', async () => {
    const directoryPreparer = new DirectoryPreparer();

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'file:/directory/documented-component.yaml',
      'backstage.io/techdocs-ref': 'dir:./our-documentation',
    });

    expect(await directoryPreparer.prepare(mockEntity)).toEqual(
      '/directory/our-documentation',
    );
  });

  it('should merge managed-by-location and techdocs-ref when techdocs-ref is absolute', async () => {
    const directoryPreparer = new DirectoryPreparer();

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'file:/directory/documented-component.yaml',
      'backstage.io/techdocs-ref': 'dir:/our-documentation/techdocs',
    });

    expect(await directoryPreparer.prepare(mockEntity)).toEqual(
      '/our-documentation/techdocs',
    );
  });
});
