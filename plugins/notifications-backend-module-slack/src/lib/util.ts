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
import { ChatPostMessageArguments, KnownBlock } from '@slack/web-api';

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
