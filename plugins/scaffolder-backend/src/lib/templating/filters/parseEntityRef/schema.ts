/*
 * Copyright 2024 The Backstage Authors
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
import { TemplateFilterSchema } from '@backstage/plugin-scaffolder-node';

export default {
  input: z => z.string().describe('compact entity reference'),
  arguments: z => {
    const optionsType = z
      .object({
        defaultKind: z
          .string()
          .describe('The default kind, if none is given in the reference'),
        defaultNamespace: z
          .string()
          .describe('The default namespace, if none is given in the reference'),
      })
      .partial();
    return z.union([
      optionsType.required({ defaultKind: true }),
      optionsType.required({ defaultNamespace: true }),
    ]);
  },
  output: z =>
    z
      .object({
        kind: z.string(),
        namespace: z.string(),
        name: z.string(),
      })
      .describe('`CompoundEntityRef`'),
} as TemplateFilterSchema;
