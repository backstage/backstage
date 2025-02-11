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

import zodToJsonSchema from 'zod-to-json-schema';
import { JSONSchema7 } from 'json-schema';
import { z } from 'zod';
import {
  CustomFieldExtensionSchema,
  FieldExtensionComponentProps,
} from './extensions';

/** @public */
export function makeFieldSchema<
  TReturnType extends z.ZodType,
  TUiOptions extends z.ZodType,
>(options: {
  output: (zImpl: typeof z) => TReturnType;
  uiOptions?: (zImpl: typeof z) => TUiOptions;
}): FieldSchema<z.output<TReturnType>, z.output<TUiOptions>> {
  const { output, uiOptions } = options;
  return {
    TProps: undefined as any,
    TOutput: undefined as any,
    schema: {
      returnValue: zodToJsonSchema(output(z)) as JSONSchema7,
      uiOptions: uiOptions && (zodToJsonSchema(uiOptions(z)) as JSONSchema7),
    },

    // These will be removed - just here for backwards compat whilst we're moving across
    type: undefined as any,
    uiOptionsType: undefined as any,
  };
}

/**
 * @public
 * FieldSchema encapsulates a JSONSchema7 along with the
 * matching FieldExtensionComponentProps type for a field extension.
 */
export interface FieldSchema<TReturn, TUiOptions> {
  /** @deprecated use TProps instead */
  readonly type: FieldExtensionComponentProps<TReturn, TUiOptions>;
  /** @deprecated will be removed */
  readonly uiOptionsType: TUiOptions;

  readonly schema: CustomFieldExtensionSchema;
  readonly TProps: FieldExtensionComponentProps<TReturn, TUiOptions>;
  readonly TOutput: TReturn;
}
