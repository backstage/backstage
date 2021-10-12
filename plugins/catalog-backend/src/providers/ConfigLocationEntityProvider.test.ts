/*
 * Copyright 2021 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import path from 'path';
import { ConfigLocationEntityProvider } from './ConfigLocationEntityProvider';
import { EntityProviderConnection } from '../next/types';

describe('ConfigLocationEntityProvider', () => {
  it('should apply mutation with the correct paths in the config', async () => {
    const mockConfig = new ConfigReader({
      catalog: {
        locations: [
          { type: 'file', target: './lols.yaml' },
          { type: 'url', target: 'https://github.com/backstage/backstage' },
        ],
      },
    });

    const mockConnection = {
      applyMutation: jest.fn(),
    } as unknown as EntityProviderConnection;
    const locationProvider = new ConfigLocationEntityProvider(mockConfig);

    await locationProvider.connect(mockConnection);

    expect(mockConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expect.arrayContaining([
        {
          entity: expect.objectContaining({
            spec: {
              target: path.join(process.cwd(), 'lols.yaml'),
              type: 'file',
            },
          }),
          locationKey: expect.stringMatching(/lols\.yaml$/),
        },
      ]),
    });
    expect(mockConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expect.arrayContaining([
        {
          entity: expect.objectContaining({
            spec: {
              target: 'https://github.com/backstage/backstage',
              type: 'url',
            },
          }),
          locationKey: 'url:https://github.com/backstage/backstage',
        },
      ]),
    });
  });

  it('should be able to observe the config', async () => {
    // Grab the subscriber function and use mutable config data to mock a config file change
    let subscriber: () => void;
    const mutableConfigData = {
      catalog: {
        locations: [{ type: 'url', target: 'https://github.com/a/a' }],
      },
    };

    const mockConfig = Object.assign(new ConfigReader(mutableConfigData), {
      subscribe: (s: () => void) => {
        subscriber = s;
        return { unsubscribe: () => {} };
      },
    });

    const mockConnection = {
      applyMutation: jest.fn(),
    } as unknown as EntityProviderConnection;
    const locationProvider = new ConfigLocationEntityProvider(mockConfig);

    await locationProvider.connect(mockConnection);

    expect(mockConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        {
          entity: expect.objectContaining({
            spec: {
              target: 'https://github.com/a/a',
              type: 'url',
            },
          }),
          locationKey: 'url:https://github.com/a/a',
        },
      ],
    });

    mutableConfigData.catalog.locations[0].target = 'https://github.com/b/b';
    subscriber!();

    expect(mockConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        {
          entity: expect.objectContaining({
            spec: {
              target: 'https://github.com/b/b',
              type: 'url',
            },
          }),
          locationKey: 'url:https://github.com/b/b',
        },
      ],
    });
  });
});
