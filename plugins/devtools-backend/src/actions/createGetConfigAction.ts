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
import { NotAllowedError, NotFoundError } from '@backstage/errors';
import { devToolsConfigReadPermission } from '@backstage/plugin-devtools-common';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { JsonValue } from '@backstage/types';
import get from 'lodash/get';
import { DevToolsBackendApi } from '../api';

export const createGetConfigAction = ({
  devToolsBackendApi,
  permissions,
  actionsRegistry,
}: {
  devToolsBackendApi: DevToolsBackendApi;
  permissions: PermissionsService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-config',
    title: 'Get Backstage Configuration',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `Returns the configuration that the Backstage backend is currently running with.
Values marked as secret in the configuration schema are replaced with "<secret>".
Use the optional "path" input to return only part of the configuration, which keeps the response small.
If the configuration fails schema validation, it is still returned along with details of the validation error.
Requires the "devtools.config.read" permission.`,
    schema: {
      input: z =>
        z.object({
          path: z
            .string()
            .optional()
            .describe(
              'A dot-separated configuration path to return, e.g. "catalog.locations". Returns the full configuration if omitted.',
            ),
        }),
      output: z =>
        z.object({
          config: z
            .unknown()
            .optional()
            .describe(
              'The sanitized backend configuration, or the value at the requested path',
            ),
          error: z
            .object({
              name: z.string(),
              message: z.string(),
              messages: z.array(z.string()).optional(),
              stack: z.string().optional(),
            })
            .optional()
            .describe('Present if the configuration failed schema validation'),
        }),
    },
    action: async ({ input, credentials }) => {
      const [decision] = await permissions.authorize(
        [{ permission: devToolsConfigReadPermission }],
        { credentials },
      );
      if (decision.result !== AuthorizeResult.ALLOW) {
        throw new NotAllowedError('Unauthorized');
      }

      const { config, error } = await devToolsBackendApi.listConfig();
      if (!input.path) {
        return { output: { config, error } };
      }

      const value: JsonValue | undefined = get(config, input.path.split('.'));
      if (value === undefined) {
        throw new NotFoundError(
          `No configuration found at path "${input.path}"`,
        );
      }
      return { output: { config: value, error } };
    },
  });
};
