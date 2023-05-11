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
import { z } from 'zod';
import { makeFieldSchemaFromZod } from '../utils';

/**
 * @public
 */
export const OwnedEntityPickerFieldSchema = makeFieldSchemaFromZod(
  z.string(),
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

/**
 * The input props that can be specified under `ui:options` for the
 * `OwnedEntityPicker` field extension.
 *
 * @public
 */
export type OwnedEntityPickerUiOptions =
  typeof OwnedEntityPickerFieldSchema.uiOptionsType;

export type OwnedEntityPickerProps = typeof OwnedEntityPickerFieldSchema.type;

export const OwnedEntityPickerSchema = OwnedEntityPickerFieldSchema.schema;
