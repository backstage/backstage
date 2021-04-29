/*
 * Copyright 2021 Spotify AB
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

import { ConfigLocationProvider } from './ConfigLocationProvider';
import { EntityProviderConnection } from './types';
import { ConfigReader } from '@backstage/config';
import { resolvePackagePath } from '@backstage/backend-common';
import path from 'path';

describe('Config Location Provider', () => {
  it('should apply mutation with the correct paths in the config', async () => {
    const mockConfig = new ConfigReader({
      catalog: {
        locations: [
          { type: 'file', target: './lols.yaml' },
          { type: 'url', target: 'https://github.com/backstage/backstage' },
        ],
      },
    });

    const mockConnection = ({
      applyMutation: jest.fn(),
    } as unknown) as EntityProviderConnection;
    const locationProvider = new ConfigLocationProvider(mockConfig);

    await locationProvider.connect(mockConnection);

    expect(mockConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expect.arrayContaining([
        expect.objectContaining({
          spec: {
            target: path.join(
              resolvePackagePath('@backstage/plugin-catalog-backend'),
              './lols.yaml',
            ),
            type: 'file',
          },
        }),
      ]),
    });
    expect(mockConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expect.arrayContaining([
        expect.objectContaining({
          spec: {
            target: 'https://github.com/backstage/backstage',
            type: 'url',
          },
        }),
      ]),
    });
  });
});
