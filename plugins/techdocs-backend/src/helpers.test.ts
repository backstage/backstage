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

import { Readable } from 'stream';
import { getDocFilesFromRepository } from './helpers';
import { UrlReader, ReadTreeResponse } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';

describe('getDocFilesFromRepository', () => {
  it('should read a remote directory using UrlReader.readTree', async () => {
    class MockUrlReader implements UrlReader {
      async read() {
        return Buffer.from('mock');
      }

      async readTree(): Promise<ReadTreeResponse> {
        return {
          dir: async () => {
            return '/tmp/testfolder';
          },
          files: async () => {
            return [];
          },
          archive: async () => {
            return Readable.from('');
          },
        };
      }
    }

    const mockEntity: Entity = {
      metadata: {
        namespace: 'default',
        annotations: {
          'backstage.io/techdocs-ref':
            'url:https://github.com/backstage/backstage/blob/master/subfolder/',
        },
        name: 'mytestcomponent',
        description: 'A component for testing',
      },
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      spec: {
        type: 'documentation',
        lifecycle: 'experimental',
        owner: 'testuser',
      },
    };

    const output = await getDocFilesFromRepository(
      new MockUrlReader(),
      mockEntity,
    );

    expect(output).toBe('/tmp/testfolder');
  });
});
