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

import {
  ComponentEntity,
  GroupEntity,
  UserEntity,
} from '@backstage/catalog-model';
import { getDocumentText } from './util';

describe('getDocumentText', () => {
  describe('kind is not User or Group', () => {
    test('contains description if set', () => {
      const entity = createComponent();
      entity.metadata.description = 'The expected description';
      const actual = getDocumentText(entity);
      expect(actual).toContain(entity.metadata.description);
    });

    test('is empty if description is not set', () => {
      const entity = createComponent();
      const actual = getDocumentText(entity);
      expect(actual).toEqual('');
    });
  });

  describe('kind is User', () => {
    test('contains display name if set', () => {
      const entity = createUser();
      const actual = getDocumentText(entity);
      expect(actual).toContain(entity.spec.profile?.displayName);
    });

    test('contains description if set', () => {
      const entity = createUser();
      const actual = getDocumentText(entity);
      expect(actual).toContain(entity.metadata.description);
    });

    test('contains both description and display name if both are set', () => {
      const entity = createUser();
      const actual = getDocumentText(entity);
      expect(actual).toContain(entity.spec.profile?.displayName);
      expect(actual).toContain(entity.metadata.description);
    });

    test('is empty if description and display name are not set', () => {
      const entity = createUser();
      delete entity.metadata.description;
      delete entity.spec.profile?.displayName;
      const actual = getDocumentText(entity);
      expect(actual).toEqual('');
    });
  });

  describe('kind is Group', () => {
    test('contains display name if set', () => {
      const entity = createGroup();
      const actual = getDocumentText(entity);
      expect(actual).toContain(entity.spec.profile?.displayName);
    });

    test('contains description if set', () => {
      const entity = createGroup();
      const actual = getDocumentText(entity);
      expect(actual).toContain(entity.metadata.description);
    });

    test('contains both description and display name if both are set', () => {
      const entity = createGroup();
      const actual = getDocumentText(entity);
      expect(actual).toContain(entity.spec.profile?.displayName);
      expect(actual).toContain(entity.metadata.description);
    });

    test('is empty if description and display name are not set', () => {
      const entity = createGroup();
      delete entity.metadata.description;
      delete entity.spec.profile?.displayName;
      const actual = getDocumentText(entity);
      expect(actual).toEqual('');
    });
  });
});

function createGroup(): GroupEntity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: 'group-1',
      description: 'The expected description',
    },
    spec: {
      type: 'team',
      profile: {
        displayName: 'Group 1',
      },
      children: [],
    },
  };
}

function createUser(): UserEntity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: 'user-1',
      description: 'The expected description',
    },
    spec: {
      profile: {
        displayName: 'User 1',
      },
    },
  };
}

function createComponent(): ComponentEntity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
    spec: {
      lifecycle: 'experimental',
      owner: 'someone',
      type: 'service',
    },
  };
}
