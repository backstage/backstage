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

/**
 * Default set of Jira fields fetched by searchIssues when the caller does not specify fields.
 * Matches the declared output schema fields. Sending an explicit list prevents Jira from
 * returning all fields (which can be several MB per response at high maxResults).
 */
const DEFAULT_JIRA_SEARCH_FIELDS = [
  'summary',
  'status',
  'issuetype',
  'assignee',
  'priority',
];

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
                'Please sign in with Atlassian via Backstage before using this action. ' +
                'Call atlassian:auth:checkSession to verify your session status.',
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

        /**
         * Handle a 401 response from Jira.
         * Does NOT delete the token on first 401 — Jira can return 401 for transient reasons
         * (scope mismatch, maintenance window, gateway errors). Token deletion happens automatically
         * via OAuthPermanentError during the next refresh cycle if the refresh token is also invalid.
         */
        async function handleUnauthorized(): Promise<never> {
          logger.warn('Atlassian token rejected (401) — may be transient', {
            providerId: 'atlassian',
          });
          throw new Error(
            'Atlassian returned 401 — your session may be invalid or the request lacks required scope. ' +
              'If this error persists, re-authenticate via Backstage.',
          );
        }

        // ──────────────────────────────────────────────────────────────────────
        // atlassian:auth:checkSession
        // ──────────────────────────────────────────────────────────────────────
        actions.register({
          name: 'atlassian:auth:checkSession',
          title: 'Check Atlassian Session',
          description:
            'Check whether the current user has an active Atlassian OAuth session stored in Backstage. ' +
            'Call this before any other Atlassian action to verify the prerequisite is met. ' +
            'Returns hasSession=false if no token is stored or if the token has expired.',
          attributes: { readOnly: true, idempotent: true },
          schema: {
            input: z => z.object({}),
            output: z =>
              z.object({
                hasSession: z
                  .boolean()
                  .describe(
                    'Whether a valid Atlassian session is currently stored',
                  ),
                expiresAt: z
                  .string()
                  .optional()
                  .describe('ISO 8601 expiry time of the current token'),
              }),
          },
          async action(ctx) {
            if (!auth.isPrincipal(ctx.credentials, 'user')) {
              throw new Error('This action requires a user principal.');
            }
            const { userEntityRef } = ctx.credentials.principal;
            const token = await tokenService.getToken(
              userEntityRef,
              'atlassian',
            );
            return {
              output: {
                hasSession: !!token,
                expiresAt: token?.expiresAt?.toISOString(),
              },
            };
          },
        });

        // ──────────────────────────────────────────────────────────────────────
        // atlassian:jira:getIssue
        // ──────────────────────────────────────────────────────────────────────
        actions.register({
          name: 'atlassian:jira:getIssue',
          title: 'Get Jira Issue',
          description:
            "Fetch a Jira issue using the caller's own Atlassian OAuth token. " +
            'The user must have signed in with Atlassian via Backstage. ' +
            'Call atlassian:auth:checkSession first to verify the session.',
          attributes: { readOnly: true, idempotent: true },
          schema: {
            input: z =>
              z.object({
                issueKey: z
                  .string()
                  .transform(k => k.toUpperCase())
                  .pipe(
                    z
                      .string()
                      .regex(
                        /^[A-Z]+-\d+$/,
                        'issueKey must match PROJECT-123 format (uppercase project key)',
                      ),
                  )
                  .describe(
                    'Issue key in PROJECT-123 format (uppercase project key). Example: MYPROJECT-42.',
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
            // issueKey is regex-validated (only [A-Z]+-\d+) and URL-encoded as defence in depth
            const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${encodeURIComponent(
              input.issueKey,
            )}`;

            const response = await jiraFetch(url, token.accessToken);

            if (response.status === 401) {
              return handleUnauthorized();
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
            'The user must have signed in with Atlassian via Backstage. ' +
            'Call atlassian:auth:checkSession first to verify the session.',
          attributes: { readOnly: true, idempotent: true },
          schema: {
            input: z =>
              z.object({
                jql: z
                  .string()
                  .max(2_000)
                  .describe(
                    'JQL query string. Key syntax rules: ' +
                      '(1) Use currentUser() for the calling user (e.g., assignee = currentUser()). ' +
                      '(2) Status names are case-sensitive and quoted if they contain spaces (e.g., status = "In Progress"). ' +
                      '(3) Project keys are uppercase (e.g., project = MYPROJECT). ' +
                      '(4) ORDER BY goes at the end (e.g., ORDER BY updated DESC). ' +
                      'Common examples: ' +
                      '"assignee = currentUser() AND status != Done ORDER BY updated DESC" — my open issues; ' +
                      '"project = MYPROJ AND issuetype = Bug AND status = Open" — open bugs in a project.',
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
                    'Issue fields to include (default: summary, status, issuetype, assignee, priority). ' +
                      'Add more fields like "labels", "description", or "comment" as needed.',
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
              // Always send an explicit fields list. When the caller omits fields,
              // use the default set to prevent Jira from returning all fields (can be MBs).
              fields: input.fields ?? DEFAULT_JIRA_SEARCH_FIELDS,
            };

            const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`;

            const response = await jiraFetch(url, token.accessToken, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(searchBody),
            });

            if (response.status === 401) {
              return handleUnauthorized();
            }

            if (!response.ok) {
              if (response.status === 400) {
                // Jira returns structured error messages on invalid JQL.
                // Surface them so agents can self-correct the query.
                const errorBody = await response.json().catch(() => null);
                const messages = [
                  ...(errorBody?.errorMessages ?? []),
                  ...(errorBody?.warningMessages ?? []),
                ].slice(0, 5);
                const detail =
                  messages.length > 0 ? `: ${messages.join('; ')}` : '';
                throw new Error(`Jira JQL query is invalid${detail}`);
              }
              throw new Error(
                `Jira search API returned ${
                  response.status
                } for JQL: ${input.jql.substring(0, 120)}`,
              );
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
            'The user must have signed in with Atlassian via Backstage. ' +
            'Call atlassian:auth:checkSession first to verify the session.',
          attributes: { readOnly: false, idempotent: false },
          schema: {
            input: z =>
              z.object({
                issueKey: z
                  .string()
                  .transform(k => k.toUpperCase())
                  .pipe(
                    z
                      .string()
                      .regex(
                        /^[A-Z]+-\d+$/,
                        'issueKey must match PROJECT-123 format (uppercase project key)',
                      ),
                  )
                  .describe(
                    'Issue key in PROJECT-123 format (uppercase project key). Example: MYPROJECT-42.',
                  ),
                body: z
                  .string()
                  .min(1)
                  .max(32_767)
                  .describe('Plain-text comment body (max 32 767 characters)'),
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
              return handleUnauthorized();
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

        // Downgraded to debug: cloudId is an infrastructure identifier that should not appear
        // in production log aggregation pipelines at info level.
        logger.debug('Atlassian actions registered', { cloudId });
      },
    });
  },
});
