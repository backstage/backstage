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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import yaml from 'yaml';
import { CatalogService } from '@backstage/plugin-catalog-node';

export const createValidateEntityAction = (options: {
  actionsRegistry: ActionsRegistryService;
  catalog: CatalogService;
}) => {
  const { actionsRegistry, catalog } = options;
  actionsRegistry.register({
    name: 'validate-entity',
    title: 'Validate Catalog Entity',
    description: `
      This action can be used to validate catalog-info.yaml file contents meant to be used with the software catalog.
      It checks both that the YAML syntax is correct, and that the entity content is valid according to the catalog's rules.
      `,
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          entity: z.string().describe('Entity YAML content to validate'),
          location: z
            .string()
            .url()
            .optional()
            .describe('Location to validate'),
        }),
      output: z =>
        z.object({
          isValid: z.boolean().describe('Whether the entity is valid'),
          isValidYaml: z.boolean().describe('Whether the YAML syntax is valid'),
          errors: z.array(z.string()).describe('Array of validation errors'),
          entity: z
            .record(z.any())
            .optional()
            .describe('Parsed entity object if valid'),
        }),
    },
    action: async ({ input, credentials }) => {
      const { entity: content, location } = input;
      try {
        let entity;
        try {
          entity = yaml.parse(content);
        } catch (yamlError) {
          return {
            output: {
              isValid: false,
              isValidYaml: false,
              errors: [`YAML parsing error: ${yamlError.message}`],
            },
          };
        }

        const resp = await catalog.validateEntity(
          entity,
          location ?? 'url:https://localhost/entity-validator',
          { credentials },
        );

        return {
          output: {
            isValid: resp.valid,
            isValidYaml: true,
            errors: resp.valid ? [] : resp.errors.map(e => e.message),
            entity: resp.valid ? entity : undefined,
          },
        };
      } catch (error) {
        return {
          output: {
            isValid: false,
            isValidYaml: false,
            errors: [`Validation error: ${error.message}`],
          },
        };
      }
    },
  });
};
