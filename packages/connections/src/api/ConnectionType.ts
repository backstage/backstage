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
import type { z } from 'zod/v4';
import type { Expand, JsonObject } from '@backstage/types';

/** @public */
export type ConnectionLookupStrategy = 'host' | 'aws';

export type LookupStrategyQuery = {
  host: { url: string };
  aws: { accountId?: string; arn?: string };
};

// Field names the framework owns at the connection level. Connection-type
// authors must not declare these in their `configSchema`.
export type ReservedConnectionFields = 'type' | 'auth' | 'match' | 'title';

// Field names the framework owns at the auth method level. Connection-type
// authors must not declare these in auth method `configSchema` objects.
export type ReservedAuthMethodFields = 'method' | 'match' | 'title';

// Surfaced when a configSchema declares a reserved key — the message becomes
// part of the type error so authors see why their schema was rejected.
type ReservedFieldError<K extends string> = {
  readonly __error: `configSchema must not declare reserved field '${K}'`;
};

// Constrain a ZodObject so its inferred shape can't collide with framework
// keys. Resolves to a self-describing error type if a reserved key is present.
export type WithoutReservedFields<TSchema extends z.ZodObject> = Extract<
  keyof z.infer<TSchema>,
  ReservedConnectionFields
> extends infer K
  ? [K] extends [never]
    ? TSchema
    : ReservedFieldError<K & string>
  : never;

// Constrain a ZodObject so its inferred shape can't collide with auth method
// framework keys.
export type WithoutReservedAuthMethodFields<TSchema extends z.ZodObject> =
  Extract<keyof z.infer<TSchema>, ReservedAuthMethodFields> extends infer K
    ? [K] extends [never]
      ? TSchema
      : ReservedFieldError<K & string>
    : never;

export type WithoutReservedAuthMethods<
  TAuthMethods extends readonly {
    method: string;
    title: string;
  }[],
> = {
  [I in keyof TAuthMethods]: TAuthMethods[I] extends {
    configSchema: infer TConfigSchema extends z.ZodObject;
  }
    ? Omit<TAuthMethods[I], 'configSchema'> & {
        configSchema: WithoutReservedAuthMethodFields<TConfigSchema>;
      }
    : TAuthMethods[I];
};

/**
 * The shape of an auth entry as written in configuration: the fields declared
 * by the auth method's own schema plus the framework-managed `title` and
 * `match` fields.
 *
 * @public
 */
export type ConfiguredConnectionAuth<M> = M extends {
  method: infer TMethod extends string;
  configSchema: { parse: (...args: any[]) => infer TConfig };
}
  ? Expand<
      {
        method: TMethod;
        title?: string;
        match?: { plugins: string[] };
      } & TConfig
    >
  : never;

/**
 * A resolved auth entry as handed to plugins and `matchAuth` implementations:
 * the fields declared by the auth method's own schema plus a guaranteed
 * display title.
 *
 * @public
 */
export type ConnectionAuth<TAuthConfig extends { method: string }> =
  TAuthConfig extends any ? Expand<TAuthConfig & { title: string }> : never;

/**
 * A schema that can validate values and expose a JSON-serializable schema.
 *
 * @public
 */
export type PortableSchema<TOutput = unknown, TInput = TOutput> = {
  /** Parses an input value into the validated output type. */
  parse: (input: TInput) => TOutput;
  /** Returns a defensive copy of the JSON Schema representation. */
  schema: () => { schema: JsonObject };
};

/**
 * Describes a connection type and its portable configuration schemas.
 *
 * @public
 */
export type ConnectionTypeDefinition<
  T extends {
    type: string;
    cardinality: 'singleton' | 'multiton';
    lookupStrategy: ConnectionLookupStrategy;
    query: unknown;
    configSchema: unknown;
    auth: readonly {
      method: string;
    }[];
  } = {
    type: string;
    cardinality: 'singleton' | 'multiton';
    lookupStrategy: ConnectionLookupStrategy;
    query: unknown;
    configSchema: unknown;
    auth: readonly {
      method: string;
    }[];
  },
> = {
  type: T['type'];
  title: string;
  cardinality: T['cardinality'];
  /** Determines the query accepted by `ConnectionsService.find`. */
  lookupStrategy: T['lookupStrategy'];
  /** Schema for a complete connection configuration. */
  configSchema: PortableSchema<T['configSchema'], unknown>;
  /**
   * Supported auth methods and their method-specific configuration schemas.
   * These schemas determine the auth values returned by
   * `ConnectionsService.find`.
   */
  authMethods: readonly (T['auth'][number] extends infer TAuth
    ? TAuth extends { method: string }
      ? {
          method: TAuth['method'];
          title: string;
          configSchema: PortableSchema<Expand<Omit<TAuth, 'method'>>, unknown>;
        }
      : never
    : never)[];
};
