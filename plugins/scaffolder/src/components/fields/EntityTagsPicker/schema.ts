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
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';

/**
 * @public
 */
export const EntityTagsPickerFieldSchema = makeFieldSchema({
  output: z => z.array(z.string()),
  uiOptions: z =>
    z.object({
      kinds: z
        .array(z.string())
        .optional()
        .describe('List of kinds of entities to derive tags from'),
      showCounts: z
        .boolean()
        .optional()
        .describe('Whether to show usage counts per tag'),
      helperText: z
        .string()
        .optional()
        .describe(
          'Helper text to display; DEPRECATED, simply use ui:description',
        ),
    }),
});

export const EntityTagsPickerSchema = EntityTagsPickerFieldSchema.schema;

export type EntityTagsPickerProps = typeof EntityTagsPickerFieldSchema.TProps;

/**
 * The input props that can be specified under `ui:options` for the
 * `EntityTagsPicker` field extension.
 * @public
 */
export type EntityTagsPickerUiOptions = NonNullable<
  (typeof EntityTagsPickerFieldSchema.TProps.uiSchema)['ui:options']
>;
