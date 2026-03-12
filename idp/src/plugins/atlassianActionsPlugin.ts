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
import {
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { providerTokenServiceRef } from '@devhub/plugin-provider-token-backend';

export const atlassianActionsPlugin = createBackendPlugin({
  pluginId: 'atlassian-actions',
  register(env) {
    env.registerInit({
      deps: {
        actions: actionsRegistryServiceRef,
        tokenService: providerTokenServiceRef,
        config: coreServices.rootConfig,
        auth: coreServices.auth,
        logger: coreServices.logger,
      },
      async init({ actions, tokenService, config, auth, logger }) {
        const cloudId = config.getString('atlassian.cloudId');

        actions.register({
          name: 'atlassian:jira:getIssue',
          title: 'Get Jira Issue',
          description:
            "Fetch a Jira issue using the caller's own Atlassian OAuth token. " +
            'The user must have signed in with Atlassian via Backstage.',
          attributes: { readOnly: true, idempotent: true },
          schema: {
            input: z =>
              z.object({
                issueKey: z
                  .string()
                  .regex(
                    /^[A-Z]+-\d+$/,
                    'issueKey must match PROJECT-123 format',
                  ),
              }),
            output: z =>
              z.object({
                issue: z.unknown(),
              }),
          },
          async action(ctx) {
            const { input, credentials } = ctx;

            if (!auth.isPrincipal(credentials, 'user')) {
              throw new Error('This action requires a user principal.');
            }
            const { userEntityRef } = credentials.principal;

            const token = await tokenService.getToken(
              userEntityRef,
              'atlassian',
            );
            if (!token) {
              // SECURITY: do not include userEntityRef in error message surfaced to MCP clients
              throw new Error(
                'No valid Atlassian session found. ' +
                  'Please sign in with Atlassian via Backstage before using this action.',
              );
            }

            // SECURITY: cloudId from config (hard-coded constant), not from user input
            // issueKey from user input is URL-encoded to prevent path traversal
            const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${encodeURIComponent(
              input.issueKey,
            )}`;

            const response = await fetch(url, {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
                Accept: 'application/json',
              },
            });

            if (response.status === 401) {
              // Token was valid in DB but rejected by Atlassian (revoked out-of-band)
              await tokenService.deleteToken(userEntityRef, 'atlassian');
              logger.warn(
                'Atlassian token rejected (401) — deleted stale token',
                {
                  providerId: 'atlassian',
                },
              );
              throw new Error(
                'Atlassian session was rejected. Please re-authenticate via Backstage.',
              );
            }

            if (!response.ok) {
              // SECURITY: do not include raw Atlassian response body in thrown errors
              throw new Error(
                `Jira API returned ${response.status} for issue ${input.issueKey}`,
              );
            }

            return { output: { issue: await response.json() } };
          },
        });

        logger.info('Atlassian actions registered', { cloudId });
      },
    });
  },
});
