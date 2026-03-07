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

import { JsonObject } from '@backstage/types';
import { Entity } from '../entity/Entity';
import type {
  CatalogModelSchemaAnyItemType,
  CatalogModelSchemaObjectType,
  CatalogModelSchemaPropertyDefinition,
} from './catalogModelSchema.types';

/**
 * The definition of a catalog model kind, roughly resembling a JSON Schema.
 *
 * @alpha
 */
export interface CatalogModelKindDefinition {
  /**
   * The API version(s) of the kind that this schema applies to, e.g.
   * "backstage.io/v1alpha1".
   *
   * @remarks
   *
   * Note that it is expected that as you add API versions to this array, you
   * can only make backwards compatible changes to the schema. For example,
   * adding optional fields is allowed, but removing required fields is not.
   */
  apiVersions: readonly string[];

  /**
   * The names used for this kind.
   */
  names: {
    /**
     * The name of the kind with proper casing, e.g. "Component".
     */
    kind: string;

    /**
     * The singular form of the kind name, e.g. "component".
     */
    singular: string;

    /**
     * The plural form of the kind name, e.g. "components".
     */
    plural: string;
  };

  /**
   * The spec schema of the kind.
   */
  spec: CatalogModelSchemaObjectType;
}

export interface CatalogModelKind<
  TInput extends object = Entity,
  TOutput extends Entity = Entity,
> {
  /**
   * The API version(s) of the kind that this schema applies to, e.g.
   * "backstage.io/v1alpha1".
   */
  apiVersions: string[];

  /**
   * The names used for this kind.
   */
  names: {
    /**
     * The name of the kind with proper casing, e.g. "Component".
     */
    kind: string;

    /**
     * The singular form of the kind name, e.g. "component".
     */
    singular: string;

    /**
     * The plural form of the kind name, e.g. "components".
     */
    plural: string;
  };

  /**
   * The spec schema of the kind.
   */
  spec: CatalogModelSchemaObjectType;

  /**
   * Utility for getting the input type of the kind, using `typeof kind.TInput`.
   * This excludes service-generated fields such as `relations` and `status`.
   * Attempting to actually read this value will result in an exception.
   */
  TInput: TInput;

  /**
   * Utility for getting the output type of the kind, using `typeof kind.TOutput`.
   * Attempting to actually read this value will result in an exception.
   */
  TOutput: TOutput;
}

/**
 * Type-level helpers for resolving catalog model kind definitions into
 * entity types.
 *
 * @alpha
 */
export namespace CreateCatalogModelKindInternals {
  /** Forces TypeScript to flatten intersections and computed types into a plain object. */
  type Simplify<T> = { [K in keyof T]: T[K] } & {};

  /** Applies Simplify recursively to an object and its `spec` and `metadata` fields. */
  type SimplifyEntity<T> = Simplify<
    Omit<T, 'spec' | 'metadata'> &
      ('spec' extends keyof T ? { spec: Simplify<T['spec']> } : {}) &
      ('metadata' extends keyof T ? { metadata: Simplify<T['metadata']> } : {})
  >;

  /** Extracts the required property keys from an object definition. */
  type RequiredKeysOf<TObj extends CatalogModelSchemaObjectType> =
    TObj extends { required: readonly (infer R)[] } ? R & string : never;

  /** Resolves an object definition into a TypeScript object type. */
  type ResolveObject<TObj extends CatalogModelSchemaObjectType> = Simplify<
    {
      [K in keyof TObj['properties'] &
        RequiredKeysOf<TObj>]: ResolvePropertyType<TObj['properties'][K]>;
    } & {
      [K in Exclude<
        keyof TObj['properties'],
        RequiredKeysOf<TObj>
      >]?: ResolvePropertyType<TObj['properties'][K]>;
    } & (TObj extends { allowAdditionalProperties: false } ? {} : JsonObject)
  >;

  /** Maps a scalar type definition to its TypeScript type. */
  type ResolveScalarType<T extends CatalogModelSchemaAnyItemType> = T extends {
    type: 'string' | 'relation';
  }
    ? string
    : T extends { type: 'number' | 'integer' }
    ? number
    : T extends { type: 'boolean' }
    ? boolean
    : T extends { type: 'enum'; values: readonly (infer V)[] }
    ? V
    : T extends { type: 'const'; value: infer V }
    ? V
    : T extends CatalogModelSchemaObjectType
    ? ResolveObject<T>
    : never;

  /** Maps a property definition to its TypeScript type. */
  type ResolvePropertyType<T extends CatalogModelSchemaPropertyDefinition> =
    T extends {
      type: 'array';
      items: infer I extends CatalogModelSchemaAnyItemType;
    }
      ? ResolveScalarType<I>[]
      : T extends { type: 'array' }
      ? string[]
      : T extends CatalogModelSchemaAnyItemType
      ? ResolveScalarType<T>
      : never;

  /** Strips index signatures, keeping only explicitly declared keys. */
  type RemoveIndexSignature<T> = {
    [K in keyof T as string extends K
      ? never
      : number extends K
      ? never
      : K]: T[K];
  };

  /** Converts mutable arrays to readonly arrays in an object type. */
  type ReadonlyArrays<T> = {
    [K in keyof T]: T[K] extends (infer U)[] | undefined
      ? readonly U[] | Extract<T[K], undefined>
      : T[K];
  };

  /** Resolves the full output entity type from a kind definition. */
  export type ResolvedOutputEntity<TDef extends CatalogModelKindDefinition> =
    SimplifyEntity<
      Omit<Entity, 'spec'> & {
        kind: TDef['names']['kind'];
        apiVersion: TDef['apiVersions'][number];
        spec: ResolveObject<TDef['spec']>;
      }
    >;

  /** Resolves the input entity type, excluding service-generated fields. */
  export type ResolvedInputEntity<TDef extends CatalogModelKindDefinition> =
    SimplifyEntity<
      Omit<
        ResolvedOutputEntity<TDef>,
        'relations' | 'status' | 'metadata' | 'spec'
      > & {
        metadata: Omit<
          RemoveIndexSignature<ResolvedOutputEntity<TDef>['metadata']>,
          'uid' | 'etag'
        > &
          JsonObject;
        spec: ReadonlyArrays<ResolvedOutputEntity<TDef>['spec']>;
      }
    >;
}

/**
 * Defines a new, complete catalog model kind.
 *
 * @alpha
 */
export function createCatalogModelKind<
  const TDef extends CatalogModelKindDefinition,
>(
  options: TDef,
): CatalogModelKind<
  CreateCatalogModelKindInternals.ResolvedInputEntity<TDef>,
  CreateCatalogModelKindInternals.ResolvedOutputEntity<TDef>
> {
  const apiVersions = [...options.apiVersions];
  const names = { ...options.names };
  const str = () =>
    `catalogModelKind{${names.kind}, apiVersions=[${apiVersions.join(',')}]}`;

  const spec = options.spec;

  return Object.defineProperties(
    {
      apiVersions,
      names,
      spec,
      get TInput() {
        if (process.env.NODE_ENV === 'test') {
          // Avoid throwing errors so tests asserting extensions' properties cannot be easily broken
          return null as any;
        }
        throw new Error(`tried to read CatalogModelKind.TInput of ${this}`);
      },
      get TOutput() {
        if (process.env.NODE_ENV === 'test') {
          // Avoid throwing errors so tests asserting extensions' properties cannot be easily broken
          return null as any;
        }
        throw new Error(`tried to read CatalogModelKind.TOutput of ${this}`);
      },
    },
    {
      toString: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: str,
      },
    },
  );
}
