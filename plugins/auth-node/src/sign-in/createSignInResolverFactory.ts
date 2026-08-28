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

import { InputError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import type {
  StandardJSONSchemaV1,
  StandardSchemaV1,
} from '@standard-schema/spec';
import { SignInResolver } from '../types';

/** @public */
export interface SignInResolverFactory<TAuthResult = any, TOptions = any> {
  (
    ...options: undefined extends TOptions
      ? [options?: TOptions]
      : [options: TOptions]
  ): SignInResolver<TAuthResult>;
  optionsJsonSchema?: JsonObject;
}

/** @public */
export interface SignInResolverFactoryOptions<
  TAuthResult,
  TSchema extends StandardSchemaV1 & StandardJSONSchemaV1 = StandardSchemaV1 &
    StandardJSONSchemaV1,
> {
  /**
   * A schema that supports synchronous Standard Schema validation and Standard
   * JSON Schema conversion.
   */
  optionsSchema?: TSchema;
  create(
    options: StandardSchemaV1.InferOutput<TSchema>,
  ): SignInResolver<TAuthResult>;
}

/**
 * Creates a configurable sign-in resolver factory.
 *
 * The options schema must validate synchronously and provide a Standard JSON
 * Schema input converter. When using Zod, pass a schema from the full Zod v4
 * package, for example `optionsSchema: z.object({ ... })` after importing
 * `z` from `zod`.
 *
 * @public
 */
export function createSignInResolverFactory<
  TAuthResult,
  TSchema extends StandardSchemaV1 & StandardJSONSchemaV1 = StandardSchemaV1 &
    StandardJSONSchemaV1,
>(
  options: SignInResolverFactoryOptions<TAuthResult, TSchema>,
): SignInResolverFactory<TAuthResult, StandardSchemaV1.InferInput<TSchema>> {
  const { optionsSchema } = options;
  if (!optionsSchema) {
    return (resolverOptions?: StandardSchemaV1.InferInput<TSchema>) => {
      if (resolverOptions) {
        throw new InputError('sign-in resolver does not accept options');
      }
      return options.create(undefined);
    };
  }
  const factory = (
    ...[resolverOptions]: undefined extends StandardSchemaV1.InferInput<TSchema>
      ? [options?: StandardSchemaV1.InferInput<TSchema>]
      : [options: StandardSchemaV1.InferInput<TSchema>]
  ) => {
    let result;
    try {
      result = optionsSchema['~standard'].validate(resolverOptions);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InputError(
        `Invalid sign-in resolver options, validation failed: ${message}`,
      );
    }

    if (result instanceof Promise) {
      result.catch(() => {});
      throw new InputError(
        'Sign-in resolver option schemas must validate synchronously; asynchronous schemas are not supported by sign-in resolver factories',
      );
    }

    if (result.issues) {
      const issues = result.issues.map(issue => {
        const path = issue.path
          ?.map(segment =>
            typeof segment === 'object' ? segment.key : segment,
          )
          .map(String)
          .join('.');
        return path ? `${issue.message} at '${path}'` : issue.message;
      });
      throw new InputError(
        `Invalid sign-in resolver options, ${issues.join('; ')}`,
      );
    }

    return options.create(result.value);
  };

  factory.optionsJsonSchema = optionsSchema['~standard'].jsonSchema.input({
    target: 'draft-07',
  }) as JsonObject;
  return factory;
}
