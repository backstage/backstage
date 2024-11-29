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
import { makeFieldSchemaFromZod } from '../utils';

export const entityQueryFilterExpressionSchema = z.record(
  z
    .string()
    .or(z.object({ exists: z.boolean().optional() }))
    .or(z.array(z.string())),
);

export const MultiEntityPickerFieldSchema = makeFieldSchemaFromZod(
  z.array(z.string()),
  z.object({
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
    catalogFilter: z
      .array(entityQueryFilterExpressionSchema)
      .or(entityQueryFilterExpressionSchema)
      .optional()
      .describe('List of key-value filter expression for entities'),
  }),
);

/**
 * The input props that can be specified under `ui:options` for the
 * `EntityPicker` field extension.
 */
export type MultiEntityPickerUiOptions =
  typeof MultiEntityPickerFieldSchema.uiOptionsType;

export type MultiEntityPickerProps = typeof MultiEntityPickerFieldSchema.type;

export const MultiEntityPickerSchema = MultiEntityPickerFieldSchema.schema;

export type MultiEntityPickerFilterQuery = z.TypeOf<
  typeof entityQueryFilterExpressionSchema
>;

export type MultiEntityPickerFilterQueryValue =
  MultiEntityPickerFilterQuery[keyof MultiEntityPickerFilterQuery];
