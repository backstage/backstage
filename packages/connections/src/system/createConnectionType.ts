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
import type { JsonObject } from '@backstage/types';
import type {
  ConnectionType,
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

type RootConnectionAuthFromSchema<
  TAuthMethod extends ConnectionAuthMethodSchema,
> = TAuthMethod extends ConnectionAuthMethodSchema<
  infer TMethod,
  infer TConfigSchema
>
  ? ConfigFromSchema<TConfigSchema> & {
      method: TMethod;
      title?: string;
      match?: { plugins: string[] };
    }
  : never;

type RootConnectionFromSchemas<
  TType extends string,
  TConfigSchema extends z.ZodObject,
  TAuthMethods extends readonly ConnectionAuthMethodSchema[],
> = ConfigFromSchema<TConfigSchema> & {
  type: TType;
  title?: string;
  match?: { plugins: string[] };
  auth: Array<RootConnectionAuthFromSchema<TAuthMethods[number]>>;
};

type RootConnectionAuthMethodsFromSchemas<
  TAuthMethods extends readonly ConnectionAuthMethodSchema[],
> = {
  readonly [I in keyof TAuthMethods]: RootConnectionAuthFromSchema<
    TAuthMethods[I]
  >;
};

const matchSchema = z
  .object({ plugins: z.array(z.string()) })
  .strict()
  .optional();

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
>({
  configSchema,
  type,
  title,
  authMethods,
  matchAuth,
}: {
  type: TType;
  title: string;
  configSchema: WithoutReservedFields<TConfigSchema>;
  authMethods: WithoutReservedAuthMethods<TAuthMethods>;
  matchAuth?: MatchAuth<
    RootConnectionAuthMethodsFromSchemas<TAuthMethods>[number]
  >;
}): ConnectionType<
  RootConnectionFromSchemas<TType, TConfigSchema, TAuthMethods>
> {
  const validatedAuthMethods = authMethods as TAuthMethods;
  if (validatedAuthMethods.length < 1) {
    throw new InputError(
      `Connection type "${type}" must declare at least one auth method`,
    );
  }
  const authOptions = validatedAuthMethods.map(am =>
    am.configSchema
      .extend({
        method: z.literal(am.method),
        title: z.string().min(1).optional(),
        match: matchSchema,
      })
      .strict(),
  );
  const validated = configSchema as unknown as TConfigSchema;
  const schema = validated
    .extend({
      type: z.literal(type),
      title: z.string().min(1).optional(),
      match: matchSchema,
      auth: z.array(
        authOptions.length === 1
          ? authOptions[0]
          : z.discriminatedUnion(
              'method',
              authOptions as [(typeof authOptions)[0], ...typeof authOptions],
            ),
      ),
    })
    .strict();
  const portableSchema = createPortableSchema(
    schema,
    `Invalid configuration for connection type "${type}"`,
  );
  const connectionType = {
    type,
    title,
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
    configSchema: portableSchema,
    matchAuth,
  } as unknown as ConnectionType<
    RootConnectionFromSchemas<TType, TConfigSchema, TAuthMethods>
  >;
  return connectionType;
}
