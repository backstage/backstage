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
import { PermissionsService } from '@backstage/backend-plugin-api';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { NotAllowedError } from '@backstage/errors';
import {
  actionExecutePermission,
  taskCreatePermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import { ScaffolderService } from '@backstage/plugin-scaffolder-node';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { JsonValue } from '@backstage/types';

export const createExecuteTemplateAction = ({
  actionsRegistry,
  scaffolderService,
  permissions,
}: {
  actionsRegistry: ActionsRegistryService;
  scaffolderService: ScaffolderService;
  permissions: PermissionsService;
}) => {
  actionsRegistry.register({
    name: 'execute-template',
    title: 'Execute Scaffolder Template',
    attributes: {
      destructive: true,
      readOnly: false,
      idempotent: false,
    },
    visibilityPermission: taskCreatePermission,
    description: `Executes a Scaffolder template with its template ref and input parameter values.
The template is run using the credentials provided to this action, and respects any RBAC permissions associated with those credentials.
Returns a taskId that can be used to track execution progress.
Use the catalog.get-catalog-entity action to fetch the Template entity and discover its parameter schema and secrets definition before calling this action.`,
    schema: {
      input: z =>
        z.object({
          templateRef: z
            .string()
            .describe(
              'The template entity reference to execute, e.g. "template:default/my-template"',
            ),
          values: z
            .record(z.unknown())
            .describe(
              'Input parameter values required by the template. Use catalog.get-catalog-entity to discover the required parameters for the template.',
            ),
          secrets: z
            .record(z.string())
            .optional()
            .describe(
              'Optional secrets to pass to the template execution. Use catalog.get-catalog-entity to discover the secrets definition on the Template entity.',
            ),
        }),
      output: z =>
        z.object({
          taskId: z
            .string()
            .describe(
              'The task ID for the scaffolder execution. Use this to track progress or retrieve logs.',
            ),
        }),
    },
    action: async ({ input, credentials }) => {
      // Check before calling the scaffolder service so that external access
      // restrictions are evaluated using the original caller credentials.
      const [executeDecision] = await permissions.authorizeConditional(
        [{ permission: actionExecutePermission }],
        { credentials },
      );
      if (executeDecision.result === AuthorizeResult.DENY) {
        throw new NotAllowedError();
      }

      const { taskId } = await scaffolderService.scaffold(
        {
          templateRef: input.templateRef,
          values: input.values as Record<string, JsonValue>,
          ...(input.secrets && { secrets: input.secrets }),
        },
        { credentials },
      );

      return { output: { taskId } };
    },
  });
};
