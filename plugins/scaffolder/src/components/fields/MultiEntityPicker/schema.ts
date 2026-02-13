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
import { z as zod } from 'zod';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';

export const entityQueryFilterExpressionSchema = zod.record(
  zod
    .string()
    .or(zod.object({ exists: zod.boolean().optional() }))
    .or(zod.object({ currentUser: zod.boolean().optional() }))
    .or(zod.array(zod.string())),
);

export const MultiEntityPickerFieldSchema = makeFieldSchema({
  output: z => z.array(z.string()),
  uiOptions: z =>
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
        .describe(
          'Filter expression for entities. Use { exists: true } for "field exists", { currentUser: true } for the current user (key decides: relations.ownedBy → ownership refs, e.g. spec.owner → single ref).',
        ),
    }),
});

/**
 * The input props that can be specified under `ui:options` for the
 * `EntityPicker` field extension.
 */
export type MultiEntityPickerUiOptions = NonNullable<
  (typeof MultiEntityPickerFieldSchema.TProps.uiSchema)['ui:options']
>;

export type MultiEntityPickerProps = typeof MultiEntityPickerFieldSchema.TProps;

export const MultiEntityPickerSchema = MultiEntityPickerFieldSchema.schema;

export type MultiEntityPickerFilterQuery = zod.TypeOf<
  typeof entityQueryFilterExpressionSchema
>;

export type MultiEntityPickerFilterQueryValue =
  MultiEntityPickerFilterQuery[keyof MultiEntityPickerFilterQuery];
