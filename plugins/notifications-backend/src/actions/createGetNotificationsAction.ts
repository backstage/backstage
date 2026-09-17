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
import { AuthService } from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { NotificationsStore } from '../database';

export const createGetNotificationsAction = ({
  store,
  auth,
  actionsRegistry,
}: {
  store: NotificationsStore;
  auth: AuthService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-notifications',
    title: 'Get Notifications',
    description: `
Fetches notifications for the currently authenticated user from the Backstage notifications system.

Each notification has an \`id\`, \`origin\` (the plugin or service that sent it), a \`payload\` with
\`title\`, optional \`description\`, optional \`link\`, \`severity\` (one of "critical", "high", "normal", "low"),
and optional \`topic\`. Notifications also carry \`created\` and optionally \`read\`, \`saved\`, and \`updated\` timestamps.

## Filters

Use the \`view\` field to control which notifications are returned:
- \`"unread"\` (default) — only notifications the user has not yet read. Use this to surface new, actionable items.
- \`"read"\` — only notifications the user has already read.
- \`"saved"\` — only notifications the user has explicitly saved/bookmarked.
- \`"all"\` — all notifications regardless of read or saved status.

Additional filters can be combined with \`view\`:
- \`search\` — free-text search across notification titles and descriptions.
- \`topic\` — filter to a specific topic string, e.g. "ci/cd" or "deployment".
- \`minimumSeverity\` — minimum severity level; returns this severity and anything more severe ("critical" > "high" > "normal" > "low").
- \`createdAfter\` — ISO 8601 datetime string; only return notifications created after this time.

## Pagination

Use \`offset\` and \`limit\` to paginate. The response includes \`totalCount\` so you can calculate further pages.

## Examples

- Get my unread notifications: use default values (no input required).
- Get all notifications from the past week: set \`view: "all"\` and \`createdAfter\` to 7 days ago.
- Get high-priority unread alerts: set \`minimumSeverity: "high"\` (view defaults to "unread").
    `,
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    schema: {
      input: z =>
        z.object({
          view: z
            .enum(['unread', 'read', 'saved', 'all'])
            .optional()
            .describe(
              'Which notifications to return. Defaults to "unread". "unread" returns only unread notifications, "read" returns only read notifications, "saved" returns bookmarked notifications, "all" returns everything.',
            ),
          search: z
            .string()
            .optional()
            .describe(
              'Free-text search string to filter notifications by title or description.',
            ),
          topic: z
            .string()
            .optional()
            .describe(
              'Filter to notifications with this specific topic, e.g. "ci/cd".',
            ),
          minimumSeverity: z
            .enum(['critical', 'high', 'normal', 'low'])
            .optional()
            .describe(
              'Minimum severity to include. "critical" is most severe, "low" is least. For example, "high" returns "critical" and "high" notifications only.',
            ),
          createdAfter: z
            .string()
            .optional()
            .describe(
              'ISO 8601 datetime string. Only return notifications created after this time, e.g. "2025-01-01T00:00:00Z".',
            ),
          offset: z
            .number()
            .int()
            .min(0)
            .optional()
            .describe(
              'Number of notifications to skip for pagination. Defaults to 0.',
            ),
          limit: z
            .number()
            .int()
            .min(1)
            .max(100)
            .optional()
            .describe(
              'Maximum number of notifications to return (1–100). Defaults to 10.',
            ),
        }),
      output: z =>
        z.object({
          notifications: z
            .array(z.object({}).passthrough())
            .describe('List of notifications matching the filters.'),
          totalCount: z
            .number()
            .describe(
              'Total number of notifications matching the filters, useful for pagination.',
            ),
        }),
    },
    examples: [
      {
        title: 'Get my unread notifications',
        description: 'Returns up to 10 unread notifications (the default).',
        input: {},
        output: {
          notifications: [
            {
              id: 'abc123',
              origin: 'catalog',
              created: '2025-04-01T10:00:00.000Z',
              payload: {
                title: 'Component entity missing owner',
                severity: 'high',
                link: '/catalog/default/component/my-service',
              },
            },
          ],
          totalCount: 1,
        },
      },
      {
        title: 'Get all notifications from the past week',
        input: {
          view: 'all',
          createdAfter: '2025-04-03T00:00:00Z',
          limit: 25,
        },
      },
      {
        title: 'Get high-priority unread alerts',
        input: { minimumSeverity: 'high' },
      },
    ],
    action: async ({ input, credentials, logger }) => {
      if (!auth.isPrincipal(credentials, 'user')) {
        throw new NotAllowedError('This action requires user credentials');
      }

      const { userEntityRef } = credentials.principal;

      logger.info(
        `Fetching notifications for user "${userEntityRef}" (view=${
          input.view ?? 'unread'
        })`,
      );

      let read: boolean | undefined;
      if (input.view === 'unread' || input.view === undefined) {
        read = false;
      } else if (input.view === 'read') {
        read = true;
      }

      const opts = {
        user: userEntityRef,
        offset: input.offset ?? 0,
        limit: input.limit ?? 10,
        search: input.search,
        topic: input.topic,
        minimumSeverity: input.minimumSeverity,
        createdAfter: input.createdAfter
          ? new Date(input.createdAfter)
          : undefined,
        read,
        saved: input.view === 'saved' ? true : undefined,
      };

      const [notifications, totalCount] = await Promise.all([
        store.getNotifications(opts),
        store.getNotificationsCount(opts),
      ]);

      return {
        output: {
          notifications,
          totalCount,
        },
      };
    },
  });
};
