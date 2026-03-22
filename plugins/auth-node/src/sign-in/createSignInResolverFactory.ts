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

import * as z from 'zod/v4';
import { SignInResolver } from '../types';
import { JsonObject } from '@backstage/types';
import { InputError } from '@backstage/errors';

/** @public */
export interface SignInResolverFactory<
  TAuthResult = unknown,
  _TOptions = unknown,
> {
  (options?: unknown): SignInResolver<TAuthResult>;
  optionsJsonSchema?: JsonObject;
}

/** @public */
export interface SignInResolverFactoryOptions<
  TAuthResult,
  TSchema extends z.ZodType = z.ZodUndefined,
> {
  optionsSchema?: TSchema;
  create: (options: z.output<TSchema>) => SignInResolver<TAuthResult>;
}

/** @public */
export function createSignInResolverFactory<
  TAuthResult,
  TSchema extends z.ZodType = z.ZodUndefined,
>({
  optionsSchema,
  create,
}: SignInResolverFactoryOptions<TAuthResult, TSchema>): SignInResolverFactory<
  TAuthResult,
  z.input<TSchema>
> {
  const schema = (optionsSchema ?? z.undefined()) as TSchema;

  const factory = (resolverOptions?: unknown) => {
    const result = schema.safeParse(resolverOptions);
    if (!result.success) {
      throw new InputError(
        `Invalid sign-in resolver options:\n${z.prettifyError(result.error)}`,
      );
    }
    return create(result.data);
  };
  factory.optionsJsonSchema = z.toJSONSchema(schema) as JsonObject;
  return factory;
}
