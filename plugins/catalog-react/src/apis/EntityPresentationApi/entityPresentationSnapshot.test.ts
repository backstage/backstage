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

import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { entityPresentationSnapshot } from './entityPresentationSnapshot';
import {
  EntityPresentationApi,
  EntityRefPresentation,
  EntityRefPresentationSnapshot,
} from './EntityPresentationApi';

function createMockApi(): EntityPresentationApi & {
  calls: Array<{ entityOrRef: Entity | string; context?: object }>;
} {
  const calls: Array<{ entityOrRef: Entity | string; context?: object }> = [];
  return {
    calls,
    forEntity(entityOrRef, context) {
      calls.push({ entityOrRef, context });
      const snapshot: EntityRefPresentationSnapshot = {
        entityRef: typeof entityOrRef === 'string' ? entityOrRef : 'mock-ref',
        primaryTitle: 'from-api',
        secondaryTitle: undefined,
        Icon: undefined,
      };
      return {
        snapshot,
        promise: Promise.resolve(snapshot),
      } as EntityRefPresentation;
    },
  };
}

describe('entityPresentationSnapshot', () => {
  describe('with EntityPresentationApi', () => {
    it('passes Entity directly to forEntity', () => {
      const api = createMockApi();
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'test', namespace: 'default' },
      };

      const result = entityPresentationSnapshot(entity, undefined, api);

      expect(result.primaryTitle).toBe('from-api');
      expect(api.calls).toHaveLength(1);
      expect(api.calls[0].entityOrRef).toBe(entity);
    });

    it('stringifies CompoundEntityRef before passing to forEntity', () => {
      const api = createMockApi();
      const ref: CompoundEntityRef = {
        kind: 'group',
        namespace: 'default',
        name: 'my-team',
      };

      const result = entityPresentationSnapshot(ref, undefined, api);

      expect(result.primaryTitle).toBe('from-api');
      expect(api.calls).toHaveLength(1);
      expect(api.calls[0].entityOrRef).toBe('group:default/my-team');
      expect(typeof api.calls[0].entityOrRef).toBe('string');
    });

    it('passes string ref directly to forEntity', () => {
      const api = createMockApi();

      const result = entityPresentationSnapshot(
        'component:default/test',
        undefined,
        api,
      );

      expect(result.primaryTitle).toBe('from-api');
      expect(api.calls).toHaveLength(1);
      expect(api.calls[0].entityOrRef).toBe('component:default/test');
    });

    it('forwards context to forEntity', () => {
      const api = createMockApi();
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'test', namespace: 'default' },
      };

      entityPresentationSnapshot(
        entity,
        { defaultKind: 'component', defaultNamespace: 'custom' },
        api,
      );

      expect(api.calls[0].context).toEqual({
        defaultKind: 'component',
        defaultNamespace: 'custom',
      });
    });
  });

  describe('without EntityPresentationApi', () => {
    it('falls back to defaultEntityPresentation for Entity', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          namespace: 'default',
          title: 'My Component',
        },
      };

      const result = entityPresentationSnapshot(entity);

      expect(result).toEqual({
        entityRef: 'component:default/test',
        primaryTitle: 'My Component',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });
    });

    it('falls back to defaultEntityPresentation for CompoundEntityRef', () => {
      const ref: CompoundEntityRef = {
        kind: 'group',
        namespace: 'default',
        name: 'my-team',
      };

      const result = entityPresentationSnapshot(ref);

      expect(result).toEqual({
        entityRef: 'group:default/my-team',
        primaryTitle: 'my-team',
        secondaryTitle: 'group:default/my-team',
        Icon: undefined,
      });
    });

    it('falls back to defaultEntityPresentation for string ref', () => {
      const result = entityPresentationSnapshot('component:default/test');

      expect(result).toEqual({
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });
    });

    it('forwards context to defaultEntityPresentation', () => {
      const result = entityPresentationSnapshot('component:default/test', {
        defaultKind: 'component',
      });

      expect(result.primaryTitle).toBe('test');
    });
  });
});
