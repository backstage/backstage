/*
 * Copyright 2022 The Backstage Authors
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
import { JSONSchema7 } from 'json-schema';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { FieldSchema as FieldSchemaType } from '@backstage/plugin-scaffolder-react';

/**
 * @public
 * @deprecated - import from {@link @backstage/plugin-scaffolder-react#FieldSchema} instead
 */
export interface FieldSchema<T, P> extends FieldSchemaType<T, P> {}

/**
 * @public
 * @deprecated use `makeFieldSchema` instead
 * Utility function to convert zod return and UI options schemas to a
 * CustomFieldExtensionSchema with FieldExtensionComponentProps type inference
 */

export function makeFieldSchemaFromZod<
  TReturnSchema extends z.ZodType,
  TUiOptionsSchema extends z.ZodType = z.ZodType<any, any, {}>,
>(
  returnSchema: TReturnSchema,
  uiOptionsSchema?: TUiOptionsSchema,
): FieldSchema<
  TReturnSchema extends z.ZodType<any, any, infer IReturn> ? IReturn : never,
  TUiOptionsSchema extends z.ZodType<any, any, infer IUiOptions>
    ? IUiOptions
    : never
> {
  return {
    schema: {
      returnValue: zodToJsonSchema(returnSchema) as JSONSchema7,
      uiOptions: uiOptionsSchema
        ? (zodToJsonSchema(uiOptionsSchema) as JSONSchema7)
        : undefined,
    },
    type: null as any,
    uiOptionsType: null as any,
    TProps: undefined as any,
    TOutput: undefined as any,
  };
}
