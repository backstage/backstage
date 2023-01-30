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

import { defaultCatalogCollatorEntityTransformer } from './defaultCatalogCollatorEntityTransformer';

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

describe('DefaultCatalogCollatorEntityTransformer', () => {
  describe('transform', () => {
    it('maps a returned entity', async () => {
      const document = defaultCatalogCollatorEntityTransformer(entity);

      expect(document).toMatchObject({
        title: entity.metadata.title,
        text: entity.metadata.description,
        namespace: entity.metadata.namespace,
        componentType: entity.spec.type,
        lifecycle: entity.spec.lifecycle,
        owner: entity.spec.owner,
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

      const document =
        defaultCatalogCollatorEntityTransformer(entityWithoutTitle);

      expect(document).toMatchObject({
        title: entity.metadata.name,
        text: entity.metadata.description,
        namespace: 'default',
        componentType: 'other',
        lifecycle: '',
        owner: '',
      });
    });

    it('maps a returned user entity', async () => {
      const document = defaultCatalogCollatorEntityTransformer(userEntity);

      expect(document).toMatchObject({
        title: userEntity.metadata.name,
        text: `${userEntity.metadata.description} : ${userEntity.spec.profile.displayName}`,
        namespace: 'default',
        componentType: 'other',
        lifecycle: '',
        owner: '',
      });
    });

    it('maps a returned user entity without display name', async () => {
      const testEntity = {
        ...userEntity,
        spec: undefined,
      };

      const document = defaultCatalogCollatorEntityTransformer(testEntity);

      expect(document).toMatchObject({
        title: userEntity.metadata.name,
        text: userEntity.metadata.description,
        namespace: 'default',
        componentType: 'other',
        lifecycle: '',
        owner: '',
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

      const document = defaultCatalogCollatorEntityTransformer(groupEntity);

      expect(document).toMatchObject({
        title: groupEntity.metadata.name,
        text: `${groupEntity.metadata.description} : ${groupEntity.spec.profile.displayName}`,
        namespace: 'default',
        componentType: 'other',
        lifecycle: '',
        owner: '',
      });
    });
  });
});
