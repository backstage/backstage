/*
 * Copyright 2022 The Backstage Authors
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

import { DefaultCatalogCollatorEntityTransformer } from './DefaultCatalogCollatorEntityTransformer';

const entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    title: 'Test Entity',
    name: 'test-entity',
    description: 'The expected description',
    namespace: 'namespace',
  },
  spec: {
    type: 'some-type',
    lifecycle: 'experimental',
    owner: 'someone',
  },
};

const userEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'test-user-entity',
    description: 'The expected user description',
  },
  spec: {
    profile: {
      displayName: 'User 1',
    },
  },
};

const locationTemplate = '/catalog/:namespace/:kind/:name';

describe('DefaultCatalogCollatorEntityTransformer', () => {
  const entityTransformer = new DefaultCatalogCollatorEntityTransformer();

  describe('transform', () => {
    it('maps a returned entity', async () => {
      const document = entityTransformer.transform(entity, locationTemplate);

      expect(document).toMatchObject({
        title: entity.metadata.title,
        location: '/catalog/namespace/component/test-entity',
        text: entity.metadata.description,
        namespace: entity.metadata.namespace,
        componentType: entity.spec.type,
        lifecycle: entity.spec.lifecycle,
        owner: entity.spec.owner,
        authorization: {
          resourceRef: 'component:namespace/test-entity',
        },
      });
    });

    it('maps a returned entity with default fallback', async () => {
      const entityWithoutTitle = {
        ...entity,
        metadata: {
          ...entity.metadata,
          title: undefined,
          namespace: undefined,
        },
        spec: {
          type: undefined,
          lifecycle: undefined,
          owner: undefined,
        },
      };

      const document = entityTransformer.transform(
        entityWithoutTitle,
        locationTemplate,
      );

      expect(document).toMatchObject({
        title: entity.metadata.name,
        location: '/catalog/default/component/test-entity',
        text: entity.metadata.description,
        namespace: 'default',
        componentType: 'other',
        lifecycle: '',
        owner: '',
        authorization: {
          resourceRef: 'component:default/test-entity',
        },
      });
    });

    it('maps a returned entity with custom locationTemplate', async () => {
      const document = entityTransformer.transform(entity, '/catalog/:name');

      expect(document).toMatchObject({
        title: entity.metadata.title,
        location: '/catalog/test-entity',
        text: entity.metadata.description,
        namespace: entity.metadata.namespace,
        componentType: entity.spec.type,
        lifecycle: entity.spec.lifecycle,
        owner: entity.spec.owner,
        authorization: {
          resourceRef: 'component:namespace/test-entity',
        },
      });
    });

    it('maps a returned user entity', async () => {
      const document = entityTransformer.transform(
        userEntity,
        locationTemplate,
      );

      expect(document).toMatchObject({
        title: userEntity.metadata.name,
        location: '/catalog/default/user/test-user-entity',
        text: `${userEntity.metadata.description} : ${userEntity.spec.profile.displayName}`,
        namespace: 'default',
        componentType: 'other',
        lifecycle: '',
        owner: '',
        authorization: {
          resourceRef: 'user:default/test-user-entity',
        },
      });
    });

    it('maps a returned user entity without display name', async () => {
      const testEntity = {
        ...userEntity,
        spec: undefined,
      };

      const document = entityTransformer.transform(
        testEntity,
        locationTemplate,
      );

      expect(document).toMatchObject({
        title: userEntity.metadata.name,
        location: '/catalog/default/user/test-user-entity',
        text: userEntity.metadata.description,
        namespace: 'default',
        componentType: 'other',
        lifecycle: '',
        owner: '',
        authorization: {
          resourceRef: 'user:default/test-user-entity',
        },
      });
    });

    it('maps a returned group entity', async () => {
      const groupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'test-group-entity',
          description: 'The expected group description',
        },
        spec: {
          profile: {
            displayName: 'Group 1',
          },
        },
      };

      const document = entityTransformer.transform(
        groupEntity,
        locationTemplate,
      );

      expect(document).toMatchObject({
        title: groupEntity.metadata.name,
        location: '/catalog/default/group/test-group-entity',
        text: `${groupEntity.metadata.description} : ${groupEntity.spec.profile.displayName}`,
        namespace: 'default',
        componentType: 'other',
        lifecycle: '',
        owner: '',
        authorization: {
          resourceRef: 'group:default/test-group-entity',
        },
      });
    });
  });
});
