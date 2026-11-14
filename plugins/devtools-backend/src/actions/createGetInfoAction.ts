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
import { devToolsInfoReadPermission } from '@backstage/plugin-devtools-common';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { DevToolsBackendApi } from '../api';

export const createGetInfoAction = ({
  devToolsBackendApi,
  permissions,
  actionsRegistry,
}: {
  devToolsBackendApi: DevToolsBackendApi;
  permissions: PermissionsService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-info',
    title: 'Get Backstage Info',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `Returns details about the running Backstage backend: operating system, resource utilization, Node.js version, Backstage version, and the installed versions of Backstage packages.
Packages are matched by the "@backstage" and "@internal" prefixes, plus any prefixes listed in the "devTools.info.packagePrefixes" configuration.
Requires the "devtools.info.read" permission.`,
    schema: {
      input: z => z.object({}),
      output: z =>
        z.object({
          operatingSystem: z
            .string()
            .describe('Host name, operating system, and architecture'),
          resourceUtilization: z
            .string()
            .describe('Memory usage and system load averages'),
          nodeJsVersion: z.string().describe('The Node.js version'),
          backstageVersion: z
            .string()
            .describe('The Backstage release version from backstage.json'),
          dependencies: z
            .array(
              z.object({
                name: z.string().describe('The package name'),
                versions: z
                  .string()
                  .describe('Comma-separated list of resolved versions'),
              }),
            )
            .describe('Installed packages and their resolved versions'),
        }),
    },
    action: async ({ credentials }) => {
      const [decision] = await permissions.authorize(
        [{ permission: devToolsInfoReadPermission }],
        { credentials },
      );
      if (decision.result !== AuthorizeResult.ALLOW) {
        throw new NotAllowedError('Unauthorized');
      }

      const info = await devToolsBackendApi.listInfo();
      return { output: info };
    },
  });
};
