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

import { Entity } from '../entity/Entity';
import { createCatalogModelKind } from './createCatalogModelKind';

describe('createCatalogModelKind', () => {
  describe('Component basics', () => {
    const componentKind = createCatalogModelKind({
      apiVersions: ['backstage.io/v1alpha1', 'backstage.io/v1beta1'],
      names: { kind: 'Component', singular: 'component', plural: 'components' },
      spec: {
        type: 'object',
        required: ['type', 'lifecycle', 'owner'],
        properties: {
          type: { type: 'string', description: 'The type of component.' },
          lifecycle: { type: 'string', description: 'The lifecycle state.' },
          owner: {
            type: 'relation',
            description: 'Owner reference.',
            relation: 'ownedBy',
            defaultKind: 'Group',
            defaultNamespace: 'inherit',
            allowedKinds: ['Group', 'User'],
          },
          system: {
            type: 'relation',
            description: 'System reference.',
            relation: 'partOf',
            defaultKind: 'System',
            defaultNamespace: 'inherit',
          },
          providesApis: {
            type: 'array',
            description: 'Provided APIs.',
            items: {
              type: 'relation',
              relation: 'providesApi',
              defaultKind: 'API',
              defaultNamespace: 'inherit',
            },
          },
        },
      },
    });

    type ComponentInput = typeof componentKind.TInput;
    type ComponentOutput = typeof componentKind.TOutput;

    interface ExpectedComponentEntity extends Entity {
      kind: 'Component';
      apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
      spec: {
        type: string;
        lifecycle: string;
        owner: string;
        system?: string;
        providesApis?: string[];
      };
    }

    // Bidirectional assignability check
    function _assertOutputAssignableToExpected(
      v: ComponentOutput,
    ): ExpectedComponentEntity {
      return v;
    }
    function _assertExpectedAssignableToOutput(
      v: ExpectedComponentEntity,
    ): ComponentOutput {
      return v;
    }
    void _assertOutputAssignableToExpected;
    void _assertExpectedAssignableToOutput;

    it('has a sensible toString value', () => {
      expect(componentKind.toString()).toBe(
        'catalogModelKind{Component, apiVersions=[backstage.io/v1alpha1,backstage.io/v1beta1]}',
      );
    });

    it('passes through names and apiVersions at runtime', () => {
      expect(componentKind.names).toEqual({
        kind: 'Component',
        singular: 'component',
        plural: 'components',
      });
      expect(componentKind.apiVersions).toEqual([
        'backstage.io/v1alpha1',
        'backstage.io/v1beta1',
      ]);
    });

    it('infers required spec properties as non-optional', () => {
      void ((e: ComponentOutput) => {
        const t: string = e.spec.type;
        const l: string = e.spec.lifecycle;
        const o: string = e.spec.owner;
        return [t, l, o];
      });
      expect(true).toBe(true);
    });

    it('infers non-required spec properties as optional', () => {
      void ((e: ComponentOutput) => {
        const s: string | undefined = e.spec.system;
        const p: string[] | undefined = e.spec.providesApis;
        return [s, p];
      });
      expect(true).toBe(true);
    });

    it('infers array relation properties as string[]', () => {
      void ((e: ComponentOutput) => {
        const apis: string[] | undefined = e.spec.providesApis;
        return apis;
      });
      expect(true).toBe(true);
    });

    it('infers kind as a string literal', () => {
      void ((e: ComponentOutput) => {
        const k: 'Component' = e.kind;
        return k;
      });
      expect(true).toBe(true);
    });

    it('infers apiVersion as a union of the provided versions', () => {
      void ((e: ComponentOutput) => {
        const v: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1' =
          e.apiVersion;
        return v;
      });
      expect(true).toBe(true);
    });

    it('excludes relations from TInput', () => {
      void ((e: ComponentInput) => {
        // @ts-expect-error - relations is a service-generated field
        e.relations = [];
      });
      expect(true).toBe(true);
    });

    it('excludes status from TInput', () => {
      void ((e: ComponentInput) => {
        // @ts-expect-error - status is a service-generated field
        e.status = {};
      });
      expect(true).toBe(true);
    });

    it('excludes metadata.uid and metadata.etag from TInput', () => {
      void ((e: ComponentInput) => {
        // uid and etag are no longer typed as string | undefined on input;
        // they fall through to JsonObject's index signature instead
        // @ts-expect-error - uid is not a known string property on input metadata
        const _uid: string | undefined = e.metadata.uid;
        // @ts-expect-error - etag is not a known string property on input metadata
        const _etag: string | undefined = e.metadata.etag;
        // name is still a known string property
        const _name: string = e.metadata.name;
        return [_uid, _etag, _name];
      });
      expect(true).toBe(true);
    });

    it('retains relations and status on TOutput', () => {
      void ((e: ComponentOutput) => {
        const r: typeof e.relations = e.relations;
        return r;
      });
      expect(true).toBe(true);
    });
  });

  describe('property types', () => {
    const typedKind = createCatalogModelKind({
      apiVersions: ['v1'],
      names: { kind: 'Typed', singular: 'typed', plural: 'typeds' },
      spec: {
        type: 'object',
        required: ['name', 'count', 'active', 'config'],
        properties: {
          name: { type: 'string' },
          count: { type: 'number' },
          active: { type: 'boolean' },
          config: {
            type: 'object',
            required: ['url'],
            properties: {
              url: { type: 'string' },
              retries: { type: 'number' },
            },
          },
          tags: { type: 'array' },
          scores: { type: 'array', items: { type: 'number' } },
          flags: { type: 'array', items: { type: 'boolean' } },
          configs: { type: 'array', items: { type: 'object', properties: {} } },
          status: {
            type: 'enum',
            values: ['active', 'inactive', 'archived'],
          },
          priority: { type: 'const', value: 'high' },
          optionalCount: { type: 'number' },
          optionalFlag: { type: 'boolean' },
        },
      },
    });

    type TypedOutput = typeof typedKind.TOutput;

    it('infers string properties', () => {
      void ((e: TypedOutput) => {
        const n: string = e.spec.name;
        return n;
      });
      expect(true).toBe(true);
    });

    it('infers number properties', () => {
      void ((e: TypedOutput) => {
        const c: number = e.spec.count;
        return c;
      });
      expect(true).toBe(true);
    });

    it('infers boolean properties', () => {
      void ((e: TypedOutput) => {
        const a: boolean = e.spec.active;
        return a;
      });
      expect(true).toBe(true);
    });

    it('infers nested object properties with typed fields', () => {
      void ((e: TypedOutput) => {
        const u: string = e.spec.config.url;
        const r: number | undefined = e.spec.config.retries;
        return [u, r];
      });
      expect(true).toBe(true);
    });

    it('infers array without items as string[]', () => {
      void ((e: TypedOutput) => {
        const t: string[] | undefined = e.spec.tags;
        return t;
      });
      expect(true).toBe(true);
    });

    it('infers array with number items as number[]', () => {
      void ((e: TypedOutput) => {
        const s: number[] | undefined = e.spec.scores;
        return s;
      });
      expect(true).toBe(true);
    });

    it('infers array with boolean items as boolean[]', () => {
      void ((e: TypedOutput) => {
        const f: boolean[] | undefined = e.spec.flags;
        return f;
      });
      expect(true).toBe(true);
    });

    it('infers array with object items as JsonObject[]', () => {
      void ((e: TypedOutput) => {
        const c: Record<string, unknown>[] | undefined = e.spec.configs;
        return c;
      });
      expect(true).toBe(true);
    });

    it('infers enum as a union of its values', () => {
      void ((e: TypedOutput) => {
        const s: 'active' | 'inactive' | 'archived' | undefined = e.spec.status;
        return s;
      });
      expect(true).toBe(true);
    });

    it('infers const as a literal type', () => {
      void ((e: TypedOutput) => {
        const p: 'high' | undefined = e.spec.priority;
        return p;
      });
      expect(true).toBe(true);
    });

    it('infers optional number properties', () => {
      void ((e: TypedOutput) => {
        const c: number | undefined = e.spec.optionalCount;
        return c;
      });
      expect(true).toBe(true);
    });

    it('infers optional boolean properties', () => {
      void ((e: TypedOutput) => {
        const f: boolean | undefined = e.spec.optionalFlag;
        return f;
      });
      expect(true).toBe(true);
    });
  });

  describe('allowAdditionalProperties', () => {
    const openKind = createCatalogModelKind({
      apiVersions: ['v1'],
      names: { kind: 'Open', singular: 'open', plural: 'opens' },
      spec: {
        type: 'object',
        allowAdditionalProperties: true,
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
    });

    const closedKind = createCatalogModelKind({
      apiVersions: ['v1'],
      names: { kind: 'Closed', singular: 'closed', plural: 'closeds' },
      spec: {
        type: 'object',
        allowAdditionalProperties: false,
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
    });

    const defaultKind = createCatalogModelKind({
      apiVersions: ['v1'],
      names: { kind: 'Default', singular: 'default', plural: 'defaults' },
      spec: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
    });

    type OpenInput = typeof openKind.TInput;
    type OpenOutput = typeof openKind.TOutput;
    type ClosedInput = typeof closedKind.TInput;
    type ClosedOutput = typeof closedKind.TOutput;
    type DefaultInput = typeof defaultKind.TInput;
    type DefaultOutput = typeof defaultKind.TOutput;

    it('allows accessing unknown spec properties on output when true', () => {
      void ((e: OpenOutput) => {
        const x: unknown = e.spec.anythingGoes;
        return x;
      });
      expect(true).toBe(true);
    });

    it('allows accessing unknown spec properties on input when true', () => {
      void ((e: OpenInput) => {
        const x: unknown = e.spec.anythingGoes;
        return x;
      });
      expect(true).toBe(true);
    });

    it('allows accessing unknown spec properties on output by default', () => {
      void ((e: DefaultOutput) => {
        const x: unknown = e.spec.anythingGoes;
        return x;
      });
      expect(true).toBe(true);
    });

    it('allows accessing unknown spec properties on input by default', () => {
      void ((e: DefaultInput) => {
        const x: unknown = e.spec.anythingGoes;
        return x;
      });
      expect(true).toBe(true);
    });

    it('disallows accessing unknown spec properties on output when false', () => {
      void ((e: ClosedOutput) => {
        // @ts-expect-error - unknown properties should not be accessible
        e.spec.anythingGoes = 1;
      });
      expect(true).toBe(true);
    });

    it('disallows accessing unknown spec properties on input when false', () => {
      void ((e: ClosedInput) => {
        // @ts-expect-error - unknown properties should not be accessible
        e.spec.anythingGoes = 1;
      });
      expect(true).toBe(true);
    });

    it('still allows accessing declared properties on output when false', () => {
      void ((e: ClosedOutput) => {
        const n: string = e.spec.name;
        return n;
      });
      expect(true).toBe(true);
    });

    it('still allows accessing declared properties on input when false', () => {
      void ((e: ClosedInput) => {
        const n: string = e.spec.name;
        return n;
      });
      expect(true).toBe(true);
    });

    it('excludes service-generated fields from input but not output', () => {
      // Output has relations
      void ((e: OpenOutput) => {
        const r: typeof e.relations = e.relations;
        return r;
      });
      // Input does not
      void ((e: OpenInput) => {
        // @ts-expect-error - relations is a service-generated field
        e.relations = [];
      });
      expect(true).toBe(true);
    });

    it('excludes metadata.uid and metadata.etag from input but not output', () => {
      // Output has uid as string | undefined
      void ((e: ClosedOutput) => {
        const u: string | undefined = e.metadata.uid;
        return u;
      });
      // Input does not have uid as a known string property
      void ((e: ClosedInput) => {
        // @ts-expect-error - uid is not a known string property on input metadata
        const _uid: string | undefined = e.metadata.uid;
        return _uid;
      });
      expect(true).toBe(true);
    });
  });
});
