/*
 * Copyright 2024 The Backstage Authors
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

import {
  ServiceFactoryTester,
  mockServices,
} from '@backstage/backend-test-utils';
import {
  InternalBackstageServiceCredentials,
  InternalBackstageUserCredentials,
  authServiceFactory,
} from './authServiceFactory';
import { decodeJwt } from 'jose';
import { discoveryServiceFactory } from '../discovery';

// TODO: Ship discovery mock service in the service factory tester
const mockDeps = [
  discoveryServiceFactory(),
  mockServices.rootConfig.factory({
    data: {
      backend: {
        baseUrl: 'http://localhost',
        auth: { keys: [{ secret: 'abc' }] },
      },
    },
  }),
];

describe('authServiceFactory', () => {
  it('should authenticate issued tokens', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const searchAuth = await tester.get('search');
    const catalogAuth = await tester.get('catalog');

    const { token: searchToken } = await searchAuth.issueServiceToken();

    await expect(searchAuth.authenticate(searchToken)).resolves.toEqual(
      expect.objectContaining({
        type: 'service',
        subject: 'external:backstage-plugin',
      }),
    );
    await expect(catalogAuth.authenticate(searchToken)).resolves.toEqual(
      expect.objectContaining({
        type: 'service',
        subject: 'external:backstage-plugin',
      }),
    );
  });

  it('should forward user tokens', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.get('catalog');

    await expect(
      catalogAuth.issueServiceToken({
        forward: {
          $$type: '@backstage/BackstageCredentials',
          version: 'v1',
          type: 'user',
          userEntityRef: 'user:default/alice',
          token: 'alice-token',
        } as InternalBackstageUserCredentials,
      }),
    ).resolves.toEqual({ token: 'alice-token' });
  });

  it('should not forward service tokens', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.get('catalog');

    const { token } = await catalogAuth.issueServiceToken({
      forward: {
        $$type: '@backstage/BackstageCredentials',
        version: 'v1',
        type: 'service',
        subject: 'external:backstage-plugin',
        token: 'some-upstream-service-token',
      } as InternalBackstageServiceCredentials,
    });

    expect(decodeJwt(token)).toEqual(
      expect.objectContaining({
        sub: 'backstage-server',
      }),
    );
  });
});
