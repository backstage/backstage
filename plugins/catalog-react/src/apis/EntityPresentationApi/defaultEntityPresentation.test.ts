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
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test | type | desc',
        Icon: undefined,
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
        entityRef: 'component:default/test',
        primaryTitle: 'title',
        secondaryTitle: 'component:default/test | type | desc',
        Icon: undefined,
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
        entityRef: 'component:default/test',
        primaryTitle: 'displayName',
        secondaryTitle: 'component:default/test | type | desc',
        Icon: undefined,
      });
    });

    it('handles the absolute minimum', () => {
      expect(
        defaultEntityPresentation({
          kind: 'Component',
          metadata: { name: 'test' },
        } as Entity),
      ).toEqual({
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });
    });

    it('fails without throwing on malformed entities', () => {
      expect(
        defaultEntityPresentation({ metadata: 7 } as unknown as Entity),
      ).toEqual({
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: undefined,
      });
    });
  });

  describe('string ref given', () => {
    it('happy path', () => {
      expect(defaultEntityPresentation('component:default/test')).toEqual({
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });

      expect(
        defaultEntityPresentation('component:default/test', {
          defaultKind: 'X',
        }),
      ).toEqual({
        entityRef: 'component:default/test',
        primaryTitle: 'component:test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });

      expect(
        defaultEntityPresentation('component:default/test', {
          defaultNamespace: 'X',
        }),
      ).toEqual({
        entityRef: 'component:default/test',
        primaryTitle: 'default/test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });
    });

    it('works without throwing on malformed and shortened refs', () => {
      expect(defaultEntityPresentation('')).toEqual({
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: undefined,
      });

      expect(defaultEntityPresentation('name')).toEqual({
        entityRef: 'unknown:default/name',
        primaryTitle: 'name',
        secondaryTitle: 'unknown:default/name',
        Icon: undefined,
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
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });

      expect(
        defaultEntityPresentation(
          { kind: 'component', namespace: 'default', name: 'test' },
          {
            defaultKind: 'X',
          },
        ),
      ).toEqual({
        entityRef: 'component:default/test',
        primaryTitle: 'component:test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });

      expect(
        defaultEntityPresentation(
          { kind: 'component', namespace: 'default', name: 'test' },
          {
            defaultNamespace: 'X',
          },
        ),
      ).toEqual({
        entityRef: 'component:default/test',
        primaryTitle: 'default/test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
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
        entityRef: 'component:default/test',
        primaryTitle: 'default/test',
        secondaryTitle: 'component:default/test',
        Icon: undefined,
      });

      expect(defaultEntityPresentation('')).toEqual({
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: undefined,
      });
    });
  });

  describe('entirely invalid input type given', () => {
    it('sad path', () => {
      expect(defaultEntityPresentation(null as unknown as Entity)).toEqual({
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: undefined,
      });

      expect(defaultEntityPresentation(undefined as unknown as Entity)).toEqual(
        {
          entityRef: 'unknown:default/unknown',
          primaryTitle: 'unknown',
          secondaryTitle: 'unknown:default/unknown',
          Icon: undefined,
        },
      );

      expect(
        defaultEntityPresentation(Symbol.for('Prince') as unknown as Entity),
      ).toEqual({
        entityRef: 'unknown:default/unknown',
        primaryTitle: 'unknown',
        secondaryTitle: 'unknown:default/unknown',
        Icon: undefined,
      });
    });
  });
});
