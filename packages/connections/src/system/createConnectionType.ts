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
import { z } from 'zod/v4';
import { InputError } from '@backstage/errors';
import type { Expand, JsonObject } from '@backstage/types';
import type {
  ConnectionAuthMatch,
  ConnectionType,
  LookupStrategy,
  LookupStrategyQuery,
  MatchAuth,
  PortableSchema,
  WithoutReservedAuthMethods,
  WithoutReservedFields,
} from '../api/ConnectionType';

type ConnectionAuthMethodSchema<
  TMethod extends string = string,
  TConfigSchema extends z.ZodObject = z.ZodObject,
> = {
  method: TMethod;
  title: string;
  configSchema: TConfigSchema;
};

type ConfigFromSchema<TConfigSchema extends z.ZodObject> =
  z.infer<TConfigSchema> extends Record<string, never>
    ? Record<never, never>
    : z.infer<TConfigSchema>;

// Expand flattens the intersection into a single object literal so that
// editor tooltips show each auth method variant as a readable flat shape
// rather than a chain of truncated intersections.
type RootConnectionAuthFromSchema<
  TAuthMethod extends ConnectionAuthMethodSchema,
> = TAuthMethod extends ConnectionAuthMethodSchema<
  infer TMethod,
  infer TConfigSchema
>
  ? Expand<{ method: TMethod } & ConfigFromSchema<TConfigSchema>>
  : never;

function createPortableSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  errorMessage: string,
): PortableSchema<z.infer<TSchema>, unknown> {
  let cachedJsonSchema: JsonObject | undefined;
  return {
    parse(input: unknown) {
      try {
        return schema.parse(input);
      } catch (cause) {
        if (cause instanceof z.ZodError) {
          throw new InputError(errorMessage, cause);
        }
        throw cause;
      }
    },
    schema() {
      if (!cachedJsonSchema) {
        cachedJsonSchema = schema.toJSONSchema({
          target: 'draft-07',
          io: 'input',
        }) as JsonObject;
      }
      return { schema: structuredClone(cachedJsonSchema) };
    },
  };
}

export function createConnectionType<
  TType extends string,
  TConfigSchema extends z.ZodObject,
  const TAuthMethods extends readonly ConnectionAuthMethodSchema[],
  TLookupStrategy extends LookupStrategy = 'host',
>({
  configSchema,
  type,
  title,
  lookupStrategy,
  authMethods,
  matchAuth,
  validate,
}: {
  type: TType;
  title: string;
  lookupStrategy?: TLookupStrategy;
  configSchema: WithoutReservedFields<TConfigSchema>;
  authMethods: WithoutReservedAuthMethods<TAuthMethods>;
  matchAuth?: MatchAuth<
    RootConnectionAuthFromSchema<TAuthMethods[number]>,
    LookupStrategyQuery[TLookupStrategy]
  >;
  // Checks the connection as a whole once every schema has accepted its own
  // part — for rules like "only one entry may be the fallback" that no
  // single entry can verify. Entries include their plugin `match` so that
  // rules can take scoping into account. Throwing rejects the connection.
  validate?: (connection: {
    config: ConfigFromSchema<TConfigSchema>;
    auth: readonly Expand<
      RootConnectionAuthFromSchema<TAuthMethods[number]> & {
        match?: ConnectionAuthMatch;
      }
    >[];
  }) => void;
}): ConnectionType<{
  type: TType;
  lookupStrategy: TLookupStrategy;
  query: LookupStrategyQuery[TLookupStrategy];
  configSchema: ConfigFromSchema<TConfigSchema>;
  auth: readonly RootConnectionAuthFromSchema<TAuthMethods[number]>[];
}> {
  const validatedAuthMethods = authMethods as TAuthMethods;
  if (validatedAuthMethods.length < 1) {
    throw new InputError(
      `Connection type "${type}" must declare at least one auth method`,
    );
  }
  const portableConfigSchema = createPortableSchema(
    (configSchema as unknown as TConfigSchema).strict(),
    `Invalid configuration for connection type "${type}"`,
  );

  return {
    type,
    title,
    lookupStrategy: lookupStrategy ?? 'host',
    authMethods: validatedAuthMethods.map(
      ({ method, title: authTitle, configSchema: authConfigSchema }) => ({
        method,
        title: authTitle,
        configSchema: createPortableSchema(
          authConfigSchema,
          `Invalid configuration for auth method "${method}" of connection type "${type}"`,
        ),
      }),
    ),
    configSchema: portableConfigSchema,
    matchAuth,
    validate,
  } as unknown as ConnectionType<{
    type: TType;
    lookupStrategy: TLookupStrategy;
    query: LookupStrategyQuery[TLookupStrategy];
    configSchema: ConfigFromSchema<TConfigSchema>;
    auth: readonly RootConnectionAuthFromSchema<TAuthMethods[number]>[];
  }>;
}
