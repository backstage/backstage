/*
 * Copyright 2020 The Backstage Authors
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

import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import React from 'react';
import {
  UserSettingsContext,
  DEFAULT_USER_SETTINGS,
} from '../../components/UserSettingsContext';
import { UserSettingsGeneral } from './UserSettingsGeneral';

describe('<UserSettingsGeneral />', () => {
  it('displays profile and appearance cards with default settings', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(<UserSettingsGeneral />),
    );

    const profileCard = rendered.getByTestId(
      'user-settings-general-profile-container',
    );
    const appearanceCard = rendered.getByTestId(
      'user-settings-general-appearance-container',
    );

    expect(profileCard).toBeInTheDocument();
    expect(appearanceCard).toBeInTheDocument();
  });

  it('returns null when profile and appearance disabled in settings', async () => {
    const userSettings = {
      ...DEFAULT_USER_SETTINGS,
      profileCard: false,
      appearanceCard: false,
    };

    const rendered = await renderWithEffects(
      wrapInTestApp(
        <UserSettingsContext.Provider value={userSettings}>
          <UserSettingsGeneral />
        </UserSettingsContext.Provider>,
      ),
    );

    const userSettingsComponent = rendered.queryByTestId(
      'user-settings-general',
    );

    expect(userSettingsComponent).not.toBeInTheDocument();
  });

  it("doesn't display profile card when disabled in settings", async () => {
    const userSettings = { ...DEFAULT_USER_SETTINGS, profileCard: false };

    const rendered = await renderWithEffects(
      wrapInTestApp(
        <UserSettingsContext.Provider value={userSettings}>
          <UserSettingsGeneral />
        </UserSettingsContext.Provider>,
      ),
    );

    const profileCard = rendered.queryByTestId(
      'user-settings-general-profile-container',
    );
    const appearanceCard = rendered.getByTestId(
      'user-settings-general-appearance-container',
    );

    expect(profileCard).not.toBeInTheDocument();
    expect(appearanceCard).toBeInTheDocument();
  });

  it("doesn't display apperance card when disabled in settings", async () => {
    const userSettings = { ...DEFAULT_USER_SETTINGS, appearanceCard: false };

    const rendered = await renderWithEffects(
      wrapInTestApp(
        <UserSettingsContext.Provider value={userSettings}>
          <UserSettingsGeneral />
        </UserSettingsContext.Provider>,
      ),
    );

    const profileCard = rendered.getByTestId(
      'user-settings-general-profile-container',
    );
    const appearanceCard = rendered.queryByTestId(
      'user-settings-general-appearance-container',
    );

    expect(profileCard).toBeInTheDocument();
    expect(appearanceCard).not.toBeInTheDocument();
  });
});
