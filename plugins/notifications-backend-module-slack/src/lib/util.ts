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

import {
  NotificationPayload,
  NotificationSeverity,
} from '@backstage/plugin-notifications-common';
import {
  ChatPostMessageArguments,
  KnownBlock,
  WebClient,
} from '@slack/web-api';

export function toChatPostMessageArgs(options: {
  channel: string;
  payload: NotificationPayload;
}): ChatPostMessageArguments {
  const { channel, payload } = options;

  const args: ChatPostMessageArguments = {
    channel,
    text: payload.title,
    attachments: [
      {
        color: getColor(payload.severity),
        blocks: toSlackBlockKit(payload),
        fallback: payload.title,
      },
    ],
  };

  return args;
}

export function toSlackBlockKit(payload: NotificationPayload): KnownBlock[] {
  const { description, link, severity, topic } = payload;
  return [
    {
      type: 'section',
      ...(description && {
        text: {
          type: 'mrkdwn',
          text: description ?? 'No description provided',
        },
      }),
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View More',
        },
        ...(link && { url: link }),
        action_id: 'button-action',
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: `Severity: ${severity ?? 'normal'}`,
          emoji: true,
        },
        {
          type: 'plain_text',
          text: `Topic: ${topic ?? 'N/A'}`,
          emoji: true,
        },
      ],
    },
  ];
}

function getColor(severity: NotificationSeverity | undefined) {
  switch (severity) {
    case 'critical':
      return '#FF0000'; // Red
    case 'high':
      return '#FFA500'; // Orange
    case 'low':
    case 'normal':
    default:
      return '#00A699'; // Neutral color
  }
}

/**
 * Utility to replace Slack user IDs in a string with their display names
 * @param text - The text containing Slack user IDs (e.g. "Hello <@U12345678>!")
 * @param slackClient - Slack Web API client
 * @returns Promise<string> - Text with user IDs replaced by display names
 */
export async function replaceSlackUserIds(
  text: string,
  slackClient: WebClient,
): Promise<string> {
  // Regex that matches Slack user mentions (<@U12345678>)
  const userIdRegex = /<@([A-Z0-9]+)>/g;
  const userIds = [...text.matchAll(userIdRegex)].map(match => match[1]);
  const uniqueUserIds = new Set(userIds);

  const displayNamesMap = new Map<string, string>();

  for (const userId of uniqueUserIds) {
    try {
      const result = await slackClient.users.info({ user: userId });
      const displayName = result?.user?.profile?.display_name || userId;
      displayNamesMap.set(userId, displayName);
    } catch (error) {
      console.error(`Error fetching user info for ${userId}:`, error);
      displayNamesMap.set(userId, userId);
    }
  }

  return text.replace(userIdRegex, (_, userId) => {
    return displayNamesMap.get(userId) ?? userId;
  });
}
