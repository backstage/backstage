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
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { UserNotificationSettingsPanel } from './UserNotificationSettingsPanel';
import { NotificationFormatProvider } from './UserNotificationSettingsCard.tsx';

describe('UserNotificationSettingsPanel', () => {
  it('renders each origin only once even if present in multiple channels', async () => {
    const settings = {
      channels: [
        {
          id: 'email',
          origins: [
            {
              id: 'origin-1',
              enabled: true,
              topics: [],
            },
          ],
        },
        {
          id: 'slack',
          origins: [
            {
              id: 'origin-1',
              enabled: false,
              topics: [],
            },
          ],
        },
      ],
    };
    await renderInTestApp(
      <NotificationFormatProvider originMap={{}} topicMap={{}}>
        <UserNotificationSettingsPanel
          settings={settings}
          onChange={() => {}}
        />
      </NotificationFormatProvider>,
    );

    const originRows = screen.getAllByText('Origin 1');
    expect(originRows).toHaveLength(1);
  });
});
