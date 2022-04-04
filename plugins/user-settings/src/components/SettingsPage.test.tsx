/*
 * Copyright 2022 The Backstage Authors
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

import React from 'react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { SettingsPage } from './SettingsPage';
import { UserSettingsTab } from './UserSettingsTab';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useOutlet: jest.fn().mockReturnValue(undefined),
}));

import { useOutlet } from 'react-router';

describe('<SettingsPage />', () => {
  beforeEach(() => {
    (useOutlet as jest.Mock).mockReset();
  });

  it('should render the settings page with 3 tabs', async () => {
    const { container } = await renderWithEffects(
      wrapInTestApp(<SettingsPage />),
    );

    const tabs = container.querySelectorAll('[class*=MuiTabs-root] button');
    expect(tabs).toHaveLength(3);
  });

  it('should render the settings page with 4 tabs when extra tabs are provided', async () => {
    const advancedTabRoute = (
      <UserSettingsTab path="/advanced" title="Advanced">
        <div>Advanced settings</div>
      </UserSettingsTab>
    );
    (useOutlet as jest.Mock).mockReturnValue(advancedTabRoute);
    const { container } = await renderWithEffects(
      wrapInTestApp(<SettingsPage />),
    );

    const tabs = container.querySelectorAll('[class*=MuiTabs-root] button');
    expect(tabs).toHaveLength(4);
    expect(tabs[3].textContent).toEqual('Advanced');
  });
});
