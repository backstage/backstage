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
import type { ConnectionTypeKey, LookupConnectionType } from '../definitions';

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
  TAuthMethods extends readonly ConnectionAuthMethod[],
> = {
  [I in keyof TAuthMethods]: TAuthMethods[I] extends {
    configSchema: infer TConfigSchema extends z.ZodObject;
  }
    ? Omit<TAuthMethods[I], 'configSchema'> & {
        configSchema: WithoutReservedAuthMethodFields<TConfigSchema>;
      }
    : TAuthMethods[I];
};

/** @public */
export type ConnectionAuthValue<TAuthMethod extends ConnectionAuthMethod> =
  TAuthMethod extends any
    ? {
        method: TAuthMethod['method'];
        title: string;
      } & z.infer<TAuthMethod['configSchema']>
    : never;

export type MatchAuth<TAuthMethods extends readonly ConnectionAuthMethod[]> = (
  authMethods: ConnectionAuthValue<TAuthMethods[number]>[],
  query: string,
) => ConnectionAuthValue<TAuthMethods[number]> | undefined;

/** @public */
export type ConnectionType<
  TType extends string = string,
  TConfigSchema extends z.ZodObject = z.ZodObject,
  TAuthMethods extends readonly ConnectionAuthMethod[] = readonly ConnectionAuthMethod[],
> = {
  type: TType;
  title: string;
  configSchema: TConfigSchema;
  authMethods: TAuthMethods;
  schema: z.ZodType;
  // Method shorthand keeps parameter checking bivariant so a narrow
  // ConnectionType (e.g. github) is still assignable to ConnectionType<string>.
  // TODO a default match auth method so this is no longer optional
  matchAuth?(
    authMethods: ConnectionAuthValue<TAuthMethods[number]>[],
    query: string,
  ): ConnectionAuthValue<TAuthMethods[number]> | undefined;
};

/** @public */
export type ConnectionAuthMethod<
  TMethod extends string = string,
  TConfigSchema extends z.ZodObject = z.ZodObject,
> = {
  method: TMethod;
  title: string;
  configSchema: TConfigSchema;
};

/** @public */
export type ConnectionAuthMethodKey<
  T extends ConnectionType | ConnectionTypeKey,
> = LookupConnectionType<T>['authMethods'][number]['method'];
