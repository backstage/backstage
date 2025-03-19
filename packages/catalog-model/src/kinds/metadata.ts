import { z } from 'zod';

/*
 * Copyright 2025 The Backstage Authors
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

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const defaultEntityMetadataSchema: z.ZodObject<any, any> = z
  .object({
    uid: z
      .string()
      .min(1)
      .describe('A globally unique ID for the entity.')
      .optional(),
    etag: z
      .string()
      .min(1)
      .describe(
        'An opaque string that changes for each update operation to any part of the entity.',
      )
      .optional(),
    name: z.string().min(1).describe('The name of the entity.'),
    namespace: z
      .string()
      .min(1)
      .describe('The namespace that the entity belongs to.')
      .optional(),
    labels: z
      .record(z.string(), z.string())
      .describe(
        'Labels are key-value pairs that can be used to categorize entities.',
      )
      .optional(),
    annotations: z
      .record(z.string(), z.string())
      .describe(
        'Annotations are key-value pairs that can be used to add additional information to entities.',
      )
      .optional(),
    tags: z
      .array(z.string())
      .describe(
        'A list of single-valued strings, to for example classify catalog entities in various ways.',
      )
      .optional(),
    links: z
      .array(
        z.object({
          url: z.string().min(1).describe('A url in a standard uri format.'),
          title: z
            .string()
            .min(1)
            .describe('A user friendly display name for the link.')
            .optional(),
          icon: z
            .string()
            .min(1)
            .describe(
              'A key representing a visual icon to be displayed in the UI.',
            )
            .optional(),
          type: z
            .string()
            .min(1)
            .describe(
              'An optional value to categorize links into specific groups',
            )
            .optional(),
        }),
      )
      .describe(
        'A list of external hyperlinks related to the entity. Links can provide additional contextual information that may be located outside of Backstage itself. For example, an admin dashboard or external CMS page.',
      )
      .optional(),
  })
  .passthrough();
