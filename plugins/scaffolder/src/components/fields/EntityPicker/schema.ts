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

export const createEntityQueryFilterExpressionSchema = (z: typeof zod) =>
  z.record(
    z
      .string()
      .or(z.object({ exists: z.boolean().optional() }))
      .or(z.object({ currentUser: z.boolean().optional() }))
      .or(z.array(z.string())),
  );

/**
 * @public
 */
export const EntityPickerFieldSchema = makeFieldSchema({
  output: z => z.string(),
  uiOptions: z =>
    z.object({
      /**
       * @deprecated Use `catalogFilter` instead.
       */
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
      catalogFilter: (t => t.or(t.array()))(
        createEntityQueryFilterExpressionSchema(z),
      )
        .optional()
        .describe(
          'List of key-value filter expression for entities. Use { exists: true } for "field exists", { currentUser: true } for the current user (key decides: relations.ownedBy → ownership refs, e.g. spec.owner → single ref).',
        ),
      autoSelect: z
        .boolean()
        .optional()
        .describe(
          'Whether to automatically select an option on blur. Defaults to true.'
        ),
    }),
});

/**
 * The input props that can be specified under `ui:options` for the
 * `EntityPicker` field extension.
 *
 * @public
 */
export type EntityPickerUiOptions = NonNullable<
  (typeof EntityPickerFieldSchema.TProps.uiSchema)['ui:options']
>;

export type EntityPickerProps = typeof EntityPickerFieldSchema.TProps;

export const EntityPickerSchema = EntityPickerFieldSchema.schema;

export type EntityPickerFilterQuery = zod.TypeOf<
  ReturnType<typeof createEntityQueryFilterExpressionSchema>
>;

export type EntityPickerFilterQueryValue =
  EntityPickerFilterQuery[keyof EntityPickerFilterQuery];
