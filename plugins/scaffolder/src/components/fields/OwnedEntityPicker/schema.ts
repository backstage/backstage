/*
 * Copyright 2021 The Backstage Authors
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
import { entityQueryFilterExpressionSchema } from '../EntityPicker/schema';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';

/**
 * @public
 */
export const OwnedEntityPickerFieldSchema = makeFieldSchema({
  output: z => z.string(),
  uiOptions: z =>
    z.object({
      allowedKinds: z
        .array(z.string())
        .optional()
        .describe(
          'DEPRECATED: Use `catalogFilter` instead. List of kinds of entities to derive options from',
        ),
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
});

/**
 * The input props that can be specified under `ui:options` for the
 * `OwnedEntityPicker` field extension.
 *
 * @public
 */
export type OwnedEntityPickerUiOptions = NonNullable<
  (typeof OwnedEntityPickerFieldSchema.TProps.uiSchema)['ui:options']
>;

export type OwnedEntityPickerProps = typeof OwnedEntityPickerFieldSchema.TProps;

export const OwnedEntityPickerSchema = OwnedEntityPickerFieldSchema.schema;
