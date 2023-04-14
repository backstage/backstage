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

import { z } from 'zod';
import { makeFieldSchemaFromZod } from '../utils';
import { entityQueryFilterExpressionSchema } from '../EntityPicker/schema';

export const OwnedGroupsPickerFieldSchema = makeFieldSchemaFromZod(
  z.string(),
  z.object({
    defaultKind: z
      .string()
      .optional()
      .describe(
        'The default entity kind. Options of this kind will not be prefixed.',
      ),
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

export type OwnedGroupsPickerUiOptions =
  typeof OwnedGroupsPickerFieldSchema.uiOptionsType;
export type OwnedGroupsPickerProps = typeof OwnedGroupsPickerFieldSchema.type;
export const OwnedGroupsPickerSchema = OwnedGroupsPickerFieldSchema.schema;
