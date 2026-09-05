/*
 * Copyright 2026 The Backstage Authors
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
export const AccordionFieldSchema = makeFieldSchema({
  output: z => z.record(z.any()),
  uiOptions: z =>
    z.object({
      accordionTitle: z
        .string()
        .optional()
        .describe(
          'The title displayed in the accordion summary bar. Defaults to the field schema title.',
        ),
      defaultExpanded: z
        .boolean()
        .optional()
        .describe(
          'Whether the accordion is expanded on initial render. Defaults to false.',
        ),
    }),
});

/**
 * The input props that can be specified under `ui:options` for the
 * `AccordionField` field extension.
 *
 * @public
 */
export type AccordionFieldUiOptions = NonNullable<
  (typeof AccordionFieldSchema.TProps.uiSchema)['ui:options']
>;

export type AccordionFieldProps = typeof AccordionFieldSchema.TProps;

export const AccordionSchema = AccordionFieldSchema.schema;
