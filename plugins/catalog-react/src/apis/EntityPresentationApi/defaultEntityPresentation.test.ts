/*
 * Copyright 2023 The Backstage Authors
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
import { defaultEntityPresentation } from './defaultEntityPresentation';

describe('defaultEntityPresentation', () => {
  describe('entity given', () => {
    it('happy path', () => {
      expect(
        defaultEntityPresentation({
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test',
            namespace: 'default',
            description: 'desc',
          },
          spec: {
            type: 'type',
          },
        }),
      ).toEqual({
        entity: expect.anything(),
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test | type | desc',
        Icon: expect.anything(),
      });

      expect(
        defaultEntityPresentation({
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test',
            namespace: 'default',
            title: 'title',
            description: 'desc',
          },
          spec: {
            type: 'type',
          },
        }),
      ).toEqual({
        entity: expect.anything(),
        entityRef: 'component:default/test',
        primaryTitle: 'title',
        secondaryTitle: 'component:default/test | type | desc',
        Icon: expect.anything(),
      });

      expect(
        defaultEntityPresentation({
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test',
            namespace: 'default',
            title: 'title',
            description: 'desc',
          },
          spec: {
            type: 'type',
            profile: {
              displayName: 'displayName',
            },
          },
        }),
      ).toEqual({
        entity: expect.anything(),
        entityRef: 'component:default/test',
        primaryTitle: 'displayName',
        secondaryTitle: 'component:default/test | type | desc',
        Icon: expect.anything(),
      });
    });

    it('handles the absolute minimum', () => {
      expect(
        defaultEntityPresentation({
          kind: 'Component',
          metadata: { name: 'test' },
        } as Entity),
      ).toEqual({
        entity: expect.anything(),
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      });
    });

    it('fails without throwing on malformed entities', () => {
      expect(
        defaultEntityPresentation({ metadata: 7 } as unknown as Entity),
      ).toEqual({
        entity: expect.anything(),
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: expect.anything(),
      });
    });
  });

  describe('string ref given', () => {
    it('happy path', () => {
      expect(defaultEntityPresentation('component:default/test')).toEqual({
        entity: undefined,
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      });

      expect(
        defaultEntityPresentation('component:default/test', {
          defaultKind: 'X',
        }),
      ).toEqual({
        entity: undefined,
        entityRef: 'component:default/test',
        primaryTitle: 'component:test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      });

      expect(
        defaultEntityPresentation('component:default/test', {
          defaultNamespace: 'X',
        }),
      ).toEqual({
        entity: undefined,
        entityRef: 'component:default/test',
        primaryTitle: 'default/test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      });
    });

    it('works without throwing on malformed and shortened refs', () => {
      expect(defaultEntityPresentation('')).toEqual({
        entity: undefined,
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: expect.anything(),
      });

      expect(defaultEntityPresentation('name')).toEqual({
        entity: undefined,
        entityRef: 'unknown:default/name',
        primaryTitle: 'name',
        secondaryTitle: 'unknown:default/name',
        Icon: expect.anything(),
      });
    });
  });

  describe('compound ref given', () => {
    it('happy path', () => {
      expect(
        defaultEntityPresentation({
          kind: 'Component',
          namespace: 'default',
          name: 'test',
        }),
      ).toEqual({
        entity: undefined,
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      });

      expect(
        defaultEntityPresentation(
          { kind: 'component', namespace: 'default', name: 'test' },
          {
            defaultKind: 'X',
          },
        ),
      ).toEqual({
        entity: undefined,
        entityRef: 'component:default/test',
        primaryTitle: 'component:test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      });

      expect(
        defaultEntityPresentation(
          { kind: 'component', namespace: 'default', name: 'test' },
          {
            defaultNamespace: 'X',
          },
        ),
      ).toEqual({
        entity: undefined,
        entityRef: 'component:default/test',
        primaryTitle: 'default/test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      });
    });

    it('works without throwing on malformed refs', () => {
      expect(
        defaultEntityPresentation(
          { kind: 'component', name: 'test' } as CompoundEntityRef,
          {
            defaultNamespace: 'X',
          },
        ),
      ).toEqual({
        entity: undefined,
        entityRef: 'component:default/test',
        primaryTitle: 'default/test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      });

      expect(defaultEntityPresentation('')).toEqual({
        entity: undefined,
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: expect.anything(),
      });
    });
  });

  describe('entirely invalid input type given', () => {
    it('sad path', () => {
      expect(defaultEntityPresentation(null as unknown as Entity)).toEqual({
        entity: undefined,
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: expect.anything(),
      });

      expect(defaultEntityPresentation(undefined as unknown as Entity)).toEqual(
        {
          entity: undefined,
          entityRef: 'unknown:default/unknown',
          primaryTitle: 'unknown',
          secondaryTitle: 'unknown:default/unknown',
          Icon: expect.anything(),
        },
      );

      expect(
        defaultEntityPresentation(Symbol.for('Prince') as unknown as Entity),
      ).toEqual({
        entity: undefined,
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: expect.anything(),
      });
    });
  });
});
