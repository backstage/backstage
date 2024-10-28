/*
 * Copyright 2024 The Backstage Authors
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
import { AnyApiRef } from '@backstage/core-plugin-api';
import { JsonValue } from '@backstage/types';
import { z } from 'zod';

/** @alpha */
export type ScaffolderFormDecoratorContext<TInput> = {
  input: TInput;
  formState: Record<string, JsonValue>;

  setFormState: (
    fn: (currentState: Record<string, JsonValue>) => Record<string, JsonValue>,
  ) => void;
  setSecrets: (
    fn: (currentState: Record<string, string>) => Record<string, string>,
  ) => void;
};

/** @alpha */
export type ScaffolderFormDecorator<
  TInputSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType } = {},
  TDeps extends { [key in string]: AnyApiRef } = { [key in string]: AnyApiRef },
  TInput extends {} = {
    [key in keyof TInputSchema]: z.infer<ReturnType<TInputSchema[key]>>;
  },
> = {
  version: 'v1';
  id: string;
  schema?: {
    input?: TInputSchema;
  };
  deps?: TDeps;
  fn: (
    ctx: ScaffolderFormDecoratorContext<TInput>,
    deps: TDeps extends { [key in string]: AnyApiRef }
      ? { [key in keyof TDeps]: TDeps[key]['T'] }
      : never,
  ) => Promise<void>;
};

/**
 * Method for creating decorators which can be used to collect
 * secrets from the user before submitting to the backend.
 * @alpha
 */
export function createScaffolderFormDecorator<
  TDeps extends { [key in string]: AnyApiRef },
  TInputSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  TInput extends {} = {
    [key in keyof TInputSchema]: z.infer<ReturnType<TInputSchema[key]>>;
  },
>(options: {
  id: string;
  schema?: {
    input?: TInputSchema;
  };
  deps?: TDeps;
  fn: (
    ctx: ScaffolderFormDecoratorContext<TInput>,
    deps: TDeps extends { [key in string]: AnyApiRef }
      ? { [key in keyof TDeps]: TDeps[key]['T'] }
      : never,
  ) => Promise<void>;
}): ScaffolderFormDecorator<TInputSchema, TDeps, TInput> {
  return {
    ...options,
    version: 'v1',
  };
}
