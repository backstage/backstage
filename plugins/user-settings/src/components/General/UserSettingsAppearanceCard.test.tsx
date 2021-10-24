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
import { UserSettingsAppearanceCard } from './UserSettingsAppearanceCard';

// Ideally we will have a better way to reference this inner components
const APPEARANCE_CARD_INNER_TEXT = 'Appearance';
const THEME_TOGGLE_INNER_TEXT = 'Change the theme mode';
const SIDEBAR_PIN_INNER_TEXT = 'Pin Sidebar';

describe('<UserSettingsAppearanceCard />', () => {
  it('displays theme and pin toggles with default settings', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(<UserSettingsAppearanceCard />),
    );

    const userSettingsAppearanceCard = rendered.queryByText(
      APPEARANCE_CARD_INNER_TEXT,
    );
    const themeToggle = rendered.getByText(THEME_TOGGLE_INNER_TEXT);
    const pinToggle = rendered.getByText(SIDEBAR_PIN_INNER_TEXT);

    expect(userSettingsAppearanceCard).toBeInTheDocument();
    expect(themeToggle).toBeInTheDocument();
    expect(pinToggle).toBeInTheDocument();
  });

  it('returns null when theme and pin toggles disabled in settings', async () => {
    const userSettings = {
      ...DEFAULT_USER_SETTINGS,
      themeToggle: false,
      sidebarPinToggle: false,
    };

    const rendered = await renderWithEffects(
      wrapInTestApp(
        <UserSettingsContext.Provider value={userSettings}>
          <UserSettingsAppearanceCard />
        </UserSettingsContext.Provider>,
      ),
    );

    const userSettingsAppearanceCard = rendered.queryByText(
      APPEARANCE_CARD_INNER_TEXT,
    );

    expect(userSettingsAppearanceCard).not.toBeInTheDocument();
  });

  it("doesn't display theme toggle when disabled in settings", async () => {
    const userSettings = {
      ...DEFAULT_USER_SETTINGS,
      themeToggle: false,
    };

    const rendered = await renderWithEffects(
      wrapInTestApp(
        <UserSettingsContext.Provider value={userSettings}>
          <UserSettingsAppearanceCard />
        </UserSettingsContext.Provider>,
      ),
    );

    const themeToggle = rendered.queryByText(THEME_TOGGLE_INNER_TEXT);
    const pinToggle = rendered.getByText(SIDEBAR_PIN_INNER_TEXT);

    expect(themeToggle).not.toBeInTheDocument();
    expect(pinToggle).toBeInTheDocument();
  });

  it("doesn't display sidebar pin toggle when disabled in settings", async () => {
    const userSettings = {
      ...DEFAULT_USER_SETTINGS,
      sidebarPinToggle: false,
    };

    const rendered = await renderWithEffects(
      wrapInTestApp(
        <UserSettingsContext.Provider value={userSettings}>
          <UserSettingsAppearanceCard />
        </UserSettingsContext.Provider>,
      ),
    );

    const themeToggle = rendered.getByText(THEME_TOGGLE_INNER_TEXT);
    const pinToggle = rendered.queryByText(SIDEBAR_PIN_INNER_TEXT);

    expect(themeToggle).toBeInTheDocument();
    expect(pinToggle).not.toBeInTheDocument();
  });
});
