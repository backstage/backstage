/*
 * Copyright 2020 The Backstage Authors
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
  DomainEntity,
  GroupEntity,
  ResourceEntity,
  SystemEntity,
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
          subcomponentOf: 's',
          lifecycle: 'l',
          providesApis: ['b'],
          consumesApis: ['c'],
          dependsOn: ['Resource:r', 'Component:d'],
          dependencyOf: ['Resource:f', 'Component:g'],
          system: 's',
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledTimes(18);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'API', namespace: 'default', name: 'b' },
          type: 'apiProvidedBy',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'providesApi',
          target: { kind: 'API', namespace: 'default', name: 'b' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'API', namespace: 'default', name: 'c' },
          type: 'apiConsumedBy',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'consumesApi',
          target: { kind: 'API', namespace: 'default', name: 'c' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'dependsOn',
          target: { kind: 'Resource', namespace: 'default', name: 'r' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Resource', namespace: 'default', name: 'r' },
          type: 'dependencyOf',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'dependsOn',
          target: { kind: 'Component', namespace: 'default', name: 'd' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'd' },
          type: 'dependencyOf',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'dependencyOf',
          target: { kind: 'Resource', namespace: 'default', name: 'f' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Resource', namespace: 'default', name: 'f' },
          type: 'dependsOn',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'dependencyOf',
          target: { kind: 'Component', namespace: 'default', name: 'g' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'g' },
          type: 'dependsOn',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 's' },
          type: 'hasPart',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'partOf',
          target: { kind: 'Component', namespace: 'default', name: 's' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'System', namespace: 'default', name: 's' },
          type: 'hasPart',
          target: { kind: 'Component', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'n' },
          type: 'partOf',
          target: { kind: 'System', namespace: 'default', name: 's' },
        },
      });
    });

    it('generates an error for component entities with unspecified dependsOn entity reference kinds', async () => {
      const entity: ComponentEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'n' },
        spec: {
          type: 'service',
          owner: 'o',
          subcomponentOf: 's',
          lifecycle: 'l',
          providesApis: ['b'],
          consumesApis: ['c'],
          dependsOn: ['r'],
          system: 's',
        },
      };
      await expect(
        processor.postProcessEntity(entity, location, emit),
      ).rejects.toThrow(
        'Entity reference "r" had missing or empty kind (e.g. did not start with "component:" or similar)',
      );
    });

    it('generates an error for component entities with unspecified dependencyOf entity reference kinds', async () => {
      const entity: ComponentEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'n' },
        spec: {
          type: 'service',
          owner: 'o',
          subcomponentOf: 's',
          lifecycle: 'l',
          providesApis: ['b'],
          consumesApis: ['c'],
          dependencyOf: ['y'],
          system: 's',
        },
      };
      await expect(
        processor.postProcessEntity(entity, location, emit),
      ).rejects.toThrow(
        'Entity reference "y" had missing or empty kind (e.g. did not start with "component:" or similar)',
      );
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
          system: 's',
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledTimes(4);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'API', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'API', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'System', namespace: 'default', name: 's' },
          type: 'hasPart',
          target: { kind: 'API', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'API', namespace: 'default', name: 'n' },
          type: 'partOf',
          target: { kind: 'System', namespace: 'default', name: 's' },
        },
      });
    });

    it('generates relations for resource entities', async () => {
      const entity: ResourceEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Resource',
        metadata: { name: 'n' },
        spec: {
          type: 'database',
          owner: 'o',
          dependsOn: ['Component:c', 'Resource:r'],
          dependencyOf: ['Component:d'],
          system: 's',
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledTimes(10);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'Resource', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Resource', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });

      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Resource', namespace: 'default', name: 'n' },
          type: 'dependsOn',
          target: { kind: 'Component', namespace: 'default', name: 'c' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'c' },
          type: 'dependencyOf',
          target: { kind: 'Resource', namespace: 'default', name: 'n' },
        },
      });

      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Resource', namespace: 'default', name: 'n' },
          type: 'dependsOn',
          target: { kind: 'Resource', namespace: 'default', name: 'r' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Resource', namespace: 'default', name: 'r' },
          type: 'dependencyOf',
          target: { kind: 'Resource', namespace: 'default', name: 'n' },
        },
      });

      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'System', namespace: 'default', name: 's' },
          type: 'hasPart',
          target: { kind: 'Resource', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Resource', namespace: 'default', name: 'n' },
          type: 'partOf',
          target: { kind: 'System', namespace: 'default', name: 's' },
        },
      });

      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Resource', namespace: 'default', name: 'n' },
          type: 'dependencyOf',
          target: { kind: 'Component', namespace: 'default', name: 'd' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'd' },
          type: 'dependsOn',
          target: { kind: 'Resource', namespace: 'default', name: 'n' },
        },
      });
    });

    it('generates an error for resource entities with unspecified dependsOn entity reference kinds', async () => {
      const entity: ResourceEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Resource',
        metadata: { name: 'n' },
        spec: {
          type: 'database',
          owner: 'o',
          dependsOn: ['c'],
          system: 's',
        },
      };
      await expect(
        processor.postProcessEntity(entity, location, emit),
      ).rejects.toThrow(
        'Entity reference "c" had missing or empty kind (e.g. did not start with "component:" or similar)',
      );
    });

    it('generates relations for system entities', async () => {
      const entity: SystemEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'System',
        metadata: { name: 'n' },
        spec: {
          owner: 'o',
          domain: 'd',
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledTimes(4);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'System', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'System', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Domain', namespace: 'default', name: 'd' },
          type: 'hasPart',
          target: { kind: 'System', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'System', namespace: 'default', name: 'n' },
          type: 'partOf',
          target: { kind: 'Domain', namespace: 'default', name: 'd' },
        },
      });
    });

    it('generates relations for domain entities', async () => {
      const entity: DomainEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Domain',
        metadata: { name: 'n' },
        spec: {
          owner: 'o',
          subdomainOf: 'p',
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledTimes(4);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'Domain', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Domain', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Domain', namespace: 'default', name: 'n' },
          type: 'partOf',
          target: { kind: 'Domain', namespace: 'default', name: 'p' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Domain', namespace: 'default', name: 'p' },
          type: 'hasPart',
          target: { kind: 'Domain', namespace: 'default', name: 'n' },
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

      expect(emit).toHaveBeenCalledTimes(2);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'User', namespace: 'default', name: 'n' },
          type: 'memberOf',
          target: { kind: 'Group', namespace: 'default', name: 'g' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
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
          members: ['m'],
        },
      };

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledTimes(6);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'n' },
          type: 'childOf',
          target: { kind: 'Group', namespace: 'default', name: 'p' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'p' },
          type: 'parentOf',
          target: { kind: 'Group', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'c' },
          type: 'childOf',
          target: { kind: 'Group', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'n' },
          type: 'parentOf',
          target: { kind: 'Group', namespace: 'default', name: 'c' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'User', namespace: 'default', name: 'm' },
          type: 'memberOf',
          target: { kind: 'Group', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'n' },
          type: 'hasMember',
          target: { kind: 'User', namespace: 'default', name: 'm' },
        },
      });
    });
  });
});
