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
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { createWhoAmIAction } from './createWhoAmIAction';

const mockUserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'mock',
    namespace: 'default',
  },
  spec: {
    profile: {
      displayName: 'Mock User',
      email: 'mock@example.com',
    },
  },
};

describe('createWhoAmIAction', () => {
  it('should return the user entity and user info for authenticated user credentials', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createWhoAmIAction({
      auth: mockServices.auth(),
      catalog: catalogServiceMock({ entities: [mockUserEntity] }),
      userInfo: mockServices.userInfo(),
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:who-am-i',
      input: {},
      credentials: mockCredentials.user(),
    });

    expect(result.output).toEqual({
      entity: mockUserEntity,
      userInfo: {
        userEntityRef: 'user:default/mock',
        ownershipEntityRefs: ['user:default/mock'],
      },
    });
  });

  it('should throw when called with service credentials', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createWhoAmIAction({
      auth: mockServices.auth(),
      catalog: catalogServiceMock({ entities: [mockUserEntity] }),
      userInfo: mockServices.userInfo(),
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:who-am-i',
        input: {},
        credentials: mockCredentials.service(),
      }),
    ).rejects.toThrow('This action requires user credentials');
  });

  it('should throw when the user entity is not found in the catalog', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createWhoAmIAction({
      auth: mockServices.auth(),
      catalog: catalogServiceMock(),
      userInfo: mockServices.userInfo(),
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:who-am-i',
        input: {},
        credentials: mockCredentials.user(),
      }),
    ).rejects.toThrow(
      'User entity not found in the catalog for "user:default/mock"',
    );
  });
});
