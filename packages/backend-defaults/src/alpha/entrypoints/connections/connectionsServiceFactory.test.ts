/*
 * Copyright 2026 The Backstage Authors
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

import { connectionsServiceRef } from '@backstage/backend-plugin-api/alpha';
import {
  mockServices,
  ServiceFactoryTester,
} from '@backstage/backend-test-utils';
import { defaultServiceFactories } from '../../../CreateBackend';
import { connectionsServiceFactory } from './connectionsServiceFactory';

describe('connectionsServiceFactory', () => {
  it('is installed by default and resolves plugin-scoped credentials', async () => {
    expect(defaultServiceFactories).toContain(connectionsServiceFactory);
    expect(connectionsServiceFactory.service).toBe(connectionsServiceRef);

    const tester = ServiceFactoryTester.from(connectionsServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({
          data: {
            connections: [
              {
                type: 'github',
                host: 'github.com',
                auth: [
                  {
                    method: 'token',
                    token: 'catalog-token',
                    match: { plugins: ['catalog'] },
                  },
                  { method: 'token', token: 'default-token' },
                ],
              },
            ],
          },
        }),
      ],
    });
    const catalog = await tester.getSubject('catalog');
    const scaffolder = await tester.getSubject('scaffolder');

    await expect(
      catalog.find({
        type: 'github',
        query: { url: 'https://github.com/example/repo' },
        authMethods: ['token'],
      }),
    ).resolves.toMatchObject({
      host: 'github.com',
      auth: { method: 'token', token: 'catalog-token' },
    });
    await expect(
      scaffolder.find({
        type: 'github',
        query: { url: 'https://github.com/example/repo' },
        authMethods: ['token'],
      }),
    ).resolves.toMatchObject({
      auth: { method: 'token', token: 'default-token' },
    });
    const metadata = await catalog.find({
      type: 'github',
      query: { url: 'https://github.com/example/repo' },
    });
    expect(metadata).not.toHaveProperty('auth');
  });
});
