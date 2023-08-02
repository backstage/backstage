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

import { ZodSchema, ZodTypeDef } from 'zod';
import { SignInResolver } from '../types';
import zodToJsonSchema from 'zod-to-json-schema';
import { JsonObject } from '@backstage/types';

export interface SignInResolverFactory<TAuthResult, TOptions> {
  (
    ...options: undefined extends TOptions
      ? [options?: TOptions]
      : [options: TOptions]
  ): SignInResolver<TAuthResult>;
  optionsJsonSchema?: JsonObject;
}

export interface SignInResolverFactoryOptions<
  TAuthResult,
  TOptionsOutput,
  TOptionsInput,
> {
  optionsSchema?: ZodSchema<TOptionsOutput, ZodTypeDef, TOptionsInput>;
  create(options: TOptionsOutput): SignInResolver<TAuthResult>;
}

export function createSignInResolverFactory<
  TAuthResult,
  TOptionsOutput,
  TOptionsInput,
>(
  options: SignInResolverFactoryOptions<
    TAuthResult,
    TOptionsOutput,
    TOptionsInput
  >,
): SignInResolverFactory<TAuthResult, TOptionsInput> {
  const { optionsSchema } = options;
  if (!optionsSchema) {
    return (resolverOptions?: TOptionsInput) => {
      if (resolverOptions) {
        throw new Error('sign-in resolver does not accept options');
      }
      return options.create(undefined as TOptionsOutput);
    };
  }
  const factory = (
    ...[resolverOptions]: undefined extends TOptionsInput
      ? [options?: TOptionsInput]
      : [options: TOptionsInput]
  ) => {
    const parsedOptions = optionsSchema.parse(resolverOptions);
    return options.create(parsedOptions);
  };

  factory.optionsJsonSchema = zodToJsonSchema(optionsSchema) as JsonObject;
  return factory;
}
