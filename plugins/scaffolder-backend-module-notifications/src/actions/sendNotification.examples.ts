/*
 * Copyright 2023 The Backstage Authors
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

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Sends a notification with minimal options',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'broadcast',
            title: 'Test notification',
          },
        },
      ],
    }),
  },
  {
    description: 'Sends a notification with entity recipients and link',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'entity',
            entityRefs: ['entity:component:1'],
            title: 'Security Update',
            info: 'A security update has been applied. Please review.',
            link: 'https://example.com/security/update',
            severity: 'high',
            scope: 'internal',
          },
        },
      ],
    }),
  },
  {
    description:
      'Sends a notification with entity recipients and optional flag',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'entity',
            entityRefs: ['entity:component:1'],
            title: 'Weekly Update',
            info: 'Here is your weekly update.',
            severity: 'low',
            optional: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Sends a notification with broadcast recipients and custom scope',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'broadcast',
            title: 'New Release Available',
            info: 'Version 2.0.0 is now available. Upgrade now!',
            severity: 'normal',
            scope: 'public',
          },
        },
      ],
    }),
  },
  {
    description:
      'Sends a notification with entity recipients and custom severity',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'entity',
            entityRefs: ['entity:component:1'],
            title: 'Critical Bug Found',
            info: 'A critical bug has been identified. Immediate action required.',
            severity: 'critical',
            scope: 'internal',
          },
        },
      ],
    }),
  },
  {
    description: 'Sends a notification with broadcast recipients and no link',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'broadcast',
            title: 'Server Maintenance Scheduled',
            info: 'Server maintenance will occur tonight at 11 PM.',
            severity: 'normal',
            scope: 'internal',
          },
        },
      ],
    }),
  },
  {
    description:
      'Sends a notification with broadcast recipients and optional flag',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'broadcast',
            title: 'New Feature Deployment',
            info: 'New features have been deployed. Explore them now!',
            severity: 'normal',
            optional: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Sends a notification with broadcast recipients and no description',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'broadcast',
            title: 'Holiday Office Closure',
            severity: 'low',
            scope: 'internal',
          },
        },
      ],
    }),
  },
  {
    description:
      'Sends a notification with broadcast recipients and no severity',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'broadcast',
            title: 'Reminder: Weekly Meeting Tomorrow',
            info: "Don't forget, the weekly meeting is scheduled for tomorrow.",
            scope: 'internal',
          },
        },
      ],
    }),
  },
  {
    description: 'Sends a notification with broadcast recipients and no scope',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'broadcast',
            title: 'Important Announcement',
            info: 'Please read the latest announcement regarding the upcoming changes.',
            severity: 'high',
          },
        },
      ],
    }),
  },
  {
    description: 'Sends a notification with optional parameters',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification',
          input: {
            recipients: 'broadcast',
            title: 'Broadcast Notification',
            info: 'This is a broadcast notification',
            severity: 'low',
            optional: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Sends a notification with entity recipients and optional set to false',
    example: yaml.stringify({
      steps: [
        {
          id: 'sendNotification',
          action: 'notification:send',
          name: 'Send Notification to Entity',
          input: {
            recipients: 'entity',
            entityRefs: ['entity:service1'],
            title: 'Entity Notification',
            info: 'This is a notification for entity service1',
            severity: 'normal',
            optional: false,
          },
        },
      ],
    }),
  },
];
