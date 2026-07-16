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

import { compatWrapper } from '@backstage/core-compat-api';
import {
  HomePageWidgetBlueprint,
  type RendererProps,
} from '@backstage/plugin-home-react/alpha';

const defaultCardLayout = {
  width: {
    minColumns: 4,
    maxColumns: 12,
    defaultColumns: 6,
  },
  height: {
    minRows: 5,
    maxRows: 14,
    defaultRows: 10,
  },
} as const;

function BorderlessHomeWidgetRenderer({ Content }: RendererProps) {
  return compatWrapper(<Content />);
}

/**
 * NFS home page widget for unread notifications.
 *
 * @alpha
 */
export const unreadNotificationsHomeWidget = HomePageWidgetBlueprint.make({
  name: 'unread-notifications',
  params: {
    name: 'UnreadNotifications',
    description: 'Shows the latest unread notifications',
    layout: defaultCardLayout,
    componentProps: {
      Renderer: BorderlessHomeWidgetRenderer,
    },
    components: () =>
      import('../../components/UnreadNotificationsCard').then(m => ({
        Content: m.UnreadNotificationsCardWithProvider,
      })),
    settings: {
      schema: {
        title: 'Unread notifications',
        type: 'object',
        properties: {
          maxMessages: {
            title: 'Maximum messages',
            type: 'number',
            default: 5,
            minimum: 1,
            maximum: 20,
          },
          charLimit: {
            title: 'Title character limit',
            type: 'number',
            default: 80,
            minimum: 20,
            maximum: 200,
          },
        },
      },
    },
  },
});
