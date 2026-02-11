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
import { InputError } from '@backstage/errors';
import { TemplateActionRegistry } from '../scaffolder/actions/TemplateActionRegistry';

export const createListScaffolderActionsAction = ({
  actionsRegistry,
  templateActionRegistry,
}: {
  actionsRegistry: ActionsRegistryService;
  templateActionRegistry: TemplateActionRegistry;
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
- examples: Usage examples (if available)`,
    schema: {
      input: z => z.object({}),
      output: z => `z.object({}).passthrough(),`,
    },
    action: async ({ credentials }) => {
      let actionsList: Array<{
        id: string;
        description: string;
        schema: any;
        examples?: any[];
      }> = [];

      // Use the TemplateActionRegistry to get all template actions
      if (templateActionRegistry) {
        const actionsMap = await templateActionRegistry.list({ credentials });
        actionsList = Array.from(actionsMap.values()).map(action => ({
          id: action.id,
          description: action.description || '',
          schema: action.schema || { input: {}, output: {} },
          examples: action.examples || [],
        }));
      } else {
        throw new InputError('templateActionRegistry must be provided');
      }

      // Sort by id for consistency with /api/scaffolder/v2/actions
      actionsList.sort((a, b) => a.id.localeCompare(b.id));

      return {
        output: {
          actions: actionsList,
        },
      };
    },
  });
};
