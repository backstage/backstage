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
import { renderTestApp } from '@backstage/frontend-test-utils';
import { screen, waitFor, within } from '@testing-library/react';
import notificationsPlugin from './alpha';
import { notificationsApiRef } from './api';

describe('notifications (new frontend system)', () => {
  it('renders the sidebar item once the app lists its nav element', async () => {
    const notificationsApi = {
      getStatus: jest.fn().mockResolvedValue({ unread: 3, read: 0 }),
      getNotifications: jest.fn(),
    };

    renderTestApp({
      features: [notificationsPlugin],
      apis: [[notificationsApiRef, notificationsApi as any]],
      config: {
        app: {
          extensions: [
            {
              'app/nav': {
                config: { elements: { end: ['nav-element:notifications'] } },
              },
            },
          ],
        },
      },
    });

    const nav = await screen.findByRole('navigation');
    // The element renders the item with the unread count from the API.
    await waitFor(() => expect(notificationsApi.getStatus).toHaveBeenCalled());
    expect(await within(nav).findByText('3')).toBeInTheDocument();
  });
});
