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

import type { CatalogService } from '@backstage/plugin-catalog-node';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

export const createCatalogValidateAction = ({
  catalog,
}: {
  catalog: CatalogService;
}) =>
  createTemplateAction({
    id: 'catalog:entity:validate',
    description: 'Refresh catalog entity by reference',
    schema: {
      input: {
        entity: z => z.any().describe('Entity to validate'),
        location: z =>
          z
            .string()
            .optional()
            .describe(
              'Optional location of the entity, must start with "url:"',
            ),
      },
      output: {
        valid: z => z.boolean().describe('Indicates if the entity is valid'),
        errors: z =>
          z
            .array(z.any())
            .optional()
            .describe('List of validation errors, if any'),
      },
    },
    async handler(ctx) {
      const { entity, location = 'url:http://localhost/entity' } = ctx.input;

      const credentials = await ctx.getInitiatorCredentials();

      const resp = await catalog.validateEntity(entity, location, {
        credentials,
      });

      ctx.output('valid', resp.valid);
      if (!resp.valid) {
        ctx.output('errors', resp.errors);
      }
    },
  });
