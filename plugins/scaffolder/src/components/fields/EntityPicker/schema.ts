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
import { z } from 'zod';
import { makeJsonSchemaFromZod } from '../utils';

/**
 * @public
 */
export const EntityPickerUiOptionsSchema = makeJsonSchemaFromZod(
  z.object({
    allowedKinds: z
      .array(z.string())
      .optional()
      .describe('List of kinds of entities to derive options from'),
    defaultKind: z
      .string()
      .optional()
      .describe(
        'The default entity kind. Options of this kind will not be prefixed.',
      ),
    allowArbitraryValues: z
      .boolean()
      .optional()
      .describe('Whether to allow arbitrary user input. Defaults to true'),
    defaultNamespace: z
      .union([z.string(), z.literal(false)])
      .optional()
      .describe(
        'The default namespace. Options with this namespace will not be prefixed.',
      ),
  }),
);

const EntityPickerReturnValueSchema = makeJsonSchemaFromZod(z.string());

/**
 * The input props that can be specified under `ui:options` for the
 * `EntityPicker` field extension.
 *
 * @public
 */
export type EntityPickerUiOptions = typeof EntityPickerUiOptionsSchema.type;

export type EntityPickerReturnValue = typeof EntityPickerReturnValueSchema.type;

export const EntityPickerSchema = {
  uiOptions: EntityPickerUiOptionsSchema.schema,
  returnValue: EntityPickerReturnValueSchema.schema,
};
