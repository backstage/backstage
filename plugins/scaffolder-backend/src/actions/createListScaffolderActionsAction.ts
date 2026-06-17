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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { ScaffolderService } from '@backstage/plugin-scaffolder-node';

export const createListScaffolderActionsAction = ({
  actionsRegistry,
  scaffolderService,
}: {
  actionsRegistry: ActionsRegistryService;
  scaffolderService: ScaffolderService;
}) => {
  actionsRegistry.register({
    name: 'list-scaffolder-actions',
    title: 'List Scaffolder Actions',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `Lists all installed Scaffolder actions.
Each action includes:
- id: The action identifier
- description: What the action does
- schema: Input and output JSON schemas
- examples: Usage examples when available`,
    schema: {
      input: z => z.object({}).describe('No input is required'),
      output: z =>
        z.object({
          actions: z.array(
            z.object({
              id: z.string(),
              description: z.string(),
              schema: z.object({
                input: z
                  .object({})
                  .passthrough()
                  .describe('JSON Schema for input of Action'),
                output: z
                  .object({})
                  .passthrough()
                  .describe('JSON Schema for output of Action'),
              }),
              examples: z.array(z.any()).optional(),
            }),
          ),
        }),
    },
    action: async ({ credentials }) => {
      const actions = await scaffolderService.listActions(undefined, {
        credentials,
      });
      const scaffolderActions = actions.map(action => ({
        id: action.id,
        description: action.description ?? '',
        schema: {
          input: { ...(action.schema?.input ?? {}) },
          output: { ...(action.schema?.output ?? {}) },
        },
        examples: action.examples ?? [],
      }));
      return {
        output: {
          actions: scaffolderActions.sort((a, b) => a.id.localeCompare(b.id)),
        },
      };
    },
  });
};
