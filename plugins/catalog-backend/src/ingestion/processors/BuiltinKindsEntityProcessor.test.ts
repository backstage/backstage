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

import {
  ApiEntity,
  ComponentEntity,
  GroupEntity,
  UserEntity,
} from '@backstage/catalog-model';
import { BuiltinKindsEntityProcessor } from './BuiltinKindsEntityProcessor';

describe('BuiltinKindsEntityProcessor', () => {
  describe('postProcessEntity', () => {
    const processor = new BuiltinKindsEntityProcessor();
    const location = { type: 'a', target: 'b' };
    const emit = jest.fn();

    afterEach(() => jest.resetAllMocks());

    it('generates relations for component entities', async () => {
      const entity: ComponentEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'n' },
        spec: {
          type: 'service',
          owner: 'o',
          lifecycle: 'l',
          providesApis: ['b'],
          consumesApis: ['c'],
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toBeCalledTimes(6);
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'API', namespace: 'default', name: 'b' },
          type: 'apiProvidedBy',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'providesApi',
          target: { kind: 'API', namespace: 'default', name: 'b' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'API', namespace: 'default', name: 'c' },
          type: 'apiConsumedBy',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'consumesApi',
          target: { kind: 'API', namespace: 'default', name: 'c' },
        },
      });
    });

    it('generates relations for api entities', async () => {
      const entity: ApiEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: { name: 'n' },
        spec: {
          type: 'service',
          owner: 'o',
          lifecycle: 'l',
          definition: 'd',
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toBeCalledTimes(2);
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'API', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'API', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
    });

    it('generates relations for user entities', async () => {
      const entity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: { name: 'n' },
        spec: {
          memberOf: ['g'],
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toBeCalledTimes(2);
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'User', namespace: 'default', name: 'n' },
          type: 'memberOf',
          target: { kind: 'Group', namespace: 'default', name: 'g' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'g' },
          type: 'hasMember',
          target: { kind: 'User', namespace: 'default', name: 'n' },
        },
      });
    });

    it('generates relations for group entities', async () => {
      const entity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'n' },
        spec: {
          type: 't',
          parent: 'p',
          children: ['c'],
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toBeCalledTimes(4);
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'n' },
          type: 'childOf',
          target: { kind: 'Group', namespace: 'default', name: 'p' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'p' },
          type: 'parentOf',
          target: { kind: 'Group', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'c' },
          type: 'childOf',
          target: { kind: 'Group', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'n' },
          type: 'parentOf',
          target: { kind: 'Group', namespace: 'default', name: 'c' },
        },
      });
    });
  });
});
