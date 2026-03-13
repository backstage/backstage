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
import { providerTokenServiceRef } from '@devhub/plugin-provider-token-node';

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

        /** Resolve a user token or throw a user-facing error. */
        async function getAtlassianToken(userEntityRef: string) {
          const token = await tokenService.getToken(userEntityRef, 'atlassian');
          if (!token) {
            // SECURITY: do not include userEntityRef in error message surfaced to MCP clients
            throw new Error(
              'No valid Atlassian session found. ' +
                'Please sign in with Atlassian via Backstage before using this action.',
            );
          }
          return token;
        }

        /** Make an authenticated Jira API request with a 15 s timeout. */
        async function jiraFetch(
          url: string,
          accessToken: string,
          options?: RequestInit,
        ): Promise<Response> {
          return fetch(url, {
            ...options,
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
              ...options?.headers,
            },
            signal: AbortSignal.timeout(15_000),
          });
        }

        /** Handle a 401 response: delete stale token and throw. */
        async function handleUnauthorized(
          userEntityRef: string,
        ): Promise<never> {
          await tokenService.deleteToken(userEntityRef, 'atlassian');
          logger.warn('Atlassian token rejected (401) — deleted stale token', {
            providerId: 'atlassian',
          });
          throw new Error(
            'Atlassian session was rejected. Please re-authenticate via Backstage.',
          );
        }

        // ──────────────────────────────────────────────────────────────────────
        // atlassian:jira:getIssue
        // ──────────────────────────────────────────────────────────────────────
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
                issue: z
                  .object({
                    id: z.string(),
                    key: z.string(),
                    self: z.string(),
                    fields: z
                      .object({
                        summary: z.string(),
                        status: z.object({ name: z.string() }).passthrough(),
                        issuetype: z.object({ name: z.string() }).passthrough(),
                        assignee: z
                          .object({ displayName: z.string() })
                          .passthrough()
                          .nullable()
                          .optional(),
                        priority: z
                          .object({ name: z.string() })
                          .passthrough()
                          .optional(),
                        description: z.unknown().optional(),
                      })
                      .passthrough(),
                  })
                  .passthrough(),
              }),
          },
          async action(ctx) {
            const { input, credentials } = ctx;

            if (!auth.isPrincipal(credentials, 'user')) {
              throw new Error('This action requires a user principal.');
            }
            const { userEntityRef } = credentials.principal;

            const token = await getAtlassianToken(userEntityRef);

            // SECURITY: cloudId from config (hard-coded constant), not from user input
            // issueKey from user input is URL-encoded to prevent path traversal
            const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${encodeURIComponent(
              input.issueKey,
            )}`;

            const response = await jiraFetch(url, token.accessToken);

            if (response.status === 401) {
              return handleUnauthorized(userEntityRef);
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

        // ──────────────────────────────────────────────────────────────────────
        // atlassian:jira:searchIssues
        // ──────────────────────────────────────────────────────────────────────
        actions.register({
          name: 'atlassian:jira:searchIssues',
          title: 'Search Jira Issues',
          description:
            "Search Jira issues using JQL with the caller's own Atlassian OAuth token. " +
            'The user must have signed in with Atlassian via Backstage.',
          attributes: { readOnly: true, idempotent: true },
          schema: {
            input: z =>
              z.object({
                jql: z
                  .string()
                  .describe(
                    'JQL query string, e.g. "project = MYPROJ AND status = Open"',
                  ),
                maxResults: z
                  .number()
                  .int()
                  .min(1)
                  .max(100)
                  .optional()
                  .default(20)
                  .describe(
                    'Maximum number of results to return (1–100, default 20)',
                  ),
                startAt: z
                  .number()
                  .int()
                  .min(0)
                  .optional()
                  .default(0)
                  .describe(
                    'Zero-based index of the first result (for pagination)',
                  ),
                fields: z
                  .array(z.string())
                  .optional()
                  .describe(
                    'Issue fields to include, e.g. ["summary","status","assignee"]. Defaults to a standard set.',
                  ),
              }),
            output: z =>
              z.object({
                total: z
                  .number()
                  .describe('Total number of issues matching the JQL query'),
                startAt: z.number(),
                maxResults: z.number(),
                issues: z
                  .array(
                    z
                      .object({
                        id: z.string(),
                        key: z.string(),
                        self: z.string(),
                        fields: z
                          .object({
                            summary: z.string(),
                            status: z
                              .object({ name: z.string() })
                              .passthrough(),
                            issuetype: z
                              .object({ name: z.string() })
                              .passthrough(),
                            assignee: z
                              .object({ displayName: z.string() })
                              .passthrough()
                              .nullable()
                              .optional(),
                            priority: z
                              .object({ name: z.string() })
                              .passthrough()
                              .optional(),
                          })
                          .passthrough(),
                      })
                      .passthrough(),
                  )
                  .describe('Matching issues'),
              }),
          },
          async action(ctx) {
            const { input, credentials } = ctx;

            if (!auth.isPrincipal(credentials, 'user')) {
              throw new Error('This action requires a user principal.');
            }
            const { userEntityRef } = credentials.principal;

            const token = await getAtlassianToken(userEntityRef);

            const searchBody: Record<string, unknown> = {
              jql: input.jql,
              maxResults: input.maxResults,
              startAt: input.startAt,
            };
            if (input.fields) {
              searchBody.fields = input.fields;
            }

            const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`;

            const response = await jiraFetch(url, token.accessToken, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(searchBody),
            });

            if (response.status === 401) {
              return handleUnauthorized(userEntityRef);
            }

            if (!response.ok) {
              throw new Error(`Jira search API returned ${response.status}`);
            }

            const data = await response.json();
            return {
              output: {
                total: data.total,
                startAt: data.startAt,
                maxResults: data.maxResults,
                issues: data.issues ?? [],
              },
            };
          },
        });

        // ──────────────────────────────────────────────────────────────────────
        // atlassian:jira:addComment
        // ──────────────────────────────────────────────────────────────────────
        actions.register({
          name: 'atlassian:jira:addComment',
          title: 'Add Jira Comment',
          description:
            "Add a comment to a Jira issue using the caller's own Atlassian OAuth token. " +
            'The user must have signed in with Atlassian via Backstage.',
          attributes: { readOnly: false, idempotent: false },
          schema: {
            input: z =>
              z.object({
                issueKey: z
                  .string()
                  .regex(
                    /^[A-Z]+-\d+$/,
                    'issueKey must match PROJECT-123 format',
                  ),
                body: z.string().min(1).describe('Plain-text comment body'),
              }),
            output: z =>
              z.object({
                commentId: z.string().describe('ID of the created comment'),
                self: z.string().describe('Self URL of the created comment'),
              }),
          },
          async action(ctx) {
            const { input, credentials } = ctx;

            if (!auth.isPrincipal(credentials, 'user')) {
              throw new Error('This action requires a user principal.');
            }
            const { userEntityRef } = credentials.principal;

            const token = await getAtlassianToken(userEntityRef);

            // Wrap plain-text body in Jira's Atlassian Document Format (ADF)
            const adfBody = {
              version: 1,
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: input.body }],
                },
              ],
            };

            const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${encodeURIComponent(
              input.issueKey,
            )}/comment`;

            const response = await jiraFetch(url, token.accessToken, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ body: adfBody }),
            });

            if (response.status === 401) {
              return handleUnauthorized(userEntityRef);
            }

            if (!response.ok) {
              throw new Error(
                `Jira comment API returned ${response.status} for issue ${input.issueKey}`,
              );
            }

            const data = await response.json();
            return {
              output: {
                commentId: data.id,
                self: data.self,
              },
            };
          },
        });

        logger.info('Atlassian actions registered', { cloudId });
      },
    });
  },
});
