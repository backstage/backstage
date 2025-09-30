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

import { mockServices } from '@backstage/backend-test-utils';
import {
  RELATION_HAS_MEMBER,
  RELATION_OWNED_BY,
  RELATION_PARENT_OF,
} from '@backstage/catalog-model';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { DefaultNotificationRecipientResolver } from './DefaultNotificationRecipientResolver.ts';

describe('getUsersForEntityRef', () => {
  it('should resolve users without calling catalog', async () => {
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'getEntitiesByRefs');
    const resolver = new DefaultNotificationRecipientResolver(
      mockServices.auth(),
      catalog,
    );
    await expect(
      resolver.resolveNotificationRecipients({
        entityRefs: ['user:foo', 'user:ignored'],
        excludedEntityRefs: ['user:ignored'],
      }),
    ).resolves.toEqual({ userEntityRefs: ['user:foo'] });
    expect(catalog.getEntitiesByRefs).not.toHaveBeenCalled();
  });

  it('should resolve group entities to users', async () => {
    const catalog = catalogServiceMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'parent_group',
          },
          relations: [
            {
              type: RELATION_HAS_MEMBER,
              targetRef: 'user:default/foo',
            },
            {
              type: RELATION_PARENT_OF,
              targetRef: 'group:default/child_group',
            },
          ],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'child_group',
          },
          relations: [
            {
              type: RELATION_HAS_MEMBER,
              targetRef: 'user:default/bar',
            },
            {
              type: RELATION_HAS_MEMBER,
              targetRef: 'user:default/ignored',
            },
          ],
        },
      ],
    });

    const resolver = new DefaultNotificationRecipientResolver(
      mockServices.auth(),
      catalog,
    );
    await expect(
      resolver.resolveNotificationRecipients({
        entityRefs: ['group:default/parent_group'],
        excludedEntityRefs: ['user:default/ignored'],
      }),
    ).resolves.toEqual({
      userEntityRefs: ['user:default/foo', 'user:default/bar'],
    });
  });

  it('should resolve user owner of entity from entity ref', async () => {
    const catalog = catalogServiceMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test_component',
          },
          relations: [
            {
              type: RELATION_OWNED_BY,
              targetRef: 'user:default/foo',
            },
          ],
        },
      ],
    });

    const resolver = new DefaultNotificationRecipientResolver(
      mockServices.auth(),
      catalog,
    );
    await expect(
      resolver.resolveNotificationRecipients({
        entityRefs: ['component:default/test_component'],
        excludedEntityRefs: [],
      }),
    ).resolves.toEqual({ userEntityRefs: ['user:default/foo'] });
  });

  it('should resolve group owner of entity from entity ref', async () => {
    const catalog = catalogServiceMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test_component',
          },
          relations: [
            {
              type: RELATION_OWNED_BY,
              targetRef: 'group:default/owner_group',
            },
          ],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'owner_group',
          },
          relations: [
            {
              type: RELATION_HAS_MEMBER,
              targetRef: 'user:default/foo',
            },
          ],
        },
      ],
    });

    const resolver = new DefaultNotificationRecipientResolver(
      mockServices.auth(),
      catalog,
    );
    await expect(
      resolver.resolveNotificationRecipients({
        entityRefs: ['component:default/test_component'],
        excludedEntityRefs: [],
      }),
    ).resolves.toEqual({ userEntityRefs: ['user:default/foo'] });
  });

  it('should filter excluded refs after resolving', async () => {
    const catalog = catalogServiceMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test_component',
          },
          relations: [
            {
              type: RELATION_OWNED_BY,
              targetRef: 'group:default/owner_group',
            },
          ],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'owner_group',
          },
          relations: [
            {
              type: RELATION_HAS_MEMBER,
              targetRef: 'user:default/foo',
            },
          ],
        },
      ],
    });

    const resolver = new DefaultNotificationRecipientResolver(
      mockServices.auth(),
      catalog,
    );
    await expect(
      resolver.resolveNotificationRecipients({
        entityRefs: ['component:default/test_component'],
        excludedEntityRefs: ['user:default/foo'],
      }),
    ).resolves.toEqual({ userEntityRefs: [] });
  });
});
