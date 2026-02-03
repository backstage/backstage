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
import { parseEntityRef as filter } from '@backstage/catalog-model';
import { createTemplateFilter } from '@backstage/plugin-scaffolder-node/alpha';
import { examples } from './examples';

export const parseEntityRef = createTemplateFilter({
  id: 'parseEntityRef',
  description:
    'Extracts the parts of an entity reference, such as the kind, namespace, and name.',
  schema: z =>
    z
      .function()
      .args(
        z.union([
          z.string().describe('compact entity reference'),
          z
            .object({
              kind: z.string().optional(),
              namespace: z.string().optional(),
              name: z.string(),
            })
            .describe('`CompoundEntityRef`'),
        ]),
        z
          .object({
            defaultKind: z
              .string()
              .describe('The default kind, if none is given in the reference'),
            defaultNamespace: z
              .string()
              .describe(
                'The default namespace, if none is given in the reference',
              ),
          })
          .partial()
          .optional(),
      )
      .returns(
        z
          .object({
            kind: z.string(),
            namespace: z.string(),
            name: z.string(),
          })
          .describe('`CompoundEntityRef`'),
      ),
  examples,
  filter,
});
