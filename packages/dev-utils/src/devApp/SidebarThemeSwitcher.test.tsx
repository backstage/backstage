/*
 * Copyright 2021 The Backstage Authors
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
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { AppThemeApi, appThemeApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp } from '@backstage/test-utils';
import { BackstageTheme } from '@backstage/theme';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ObservableImpl from 'zen-observable';
import { SidebarThemeSwitcher } from './SidebarThemeSwitcher';

describe('SidebarThemeSwitcher', () => {
  let appThemeApi: jest.Mocked<AppThemeApi>;
  let apiRegistry: ApiRegistry;

  beforeEach(() => {
    appThemeApi = {
      activeThemeId$: jest.fn(),
      getActiveThemeId: jest.fn(),
      getInstalledThemes: jest.fn(),
      setActiveThemeId: jest.fn(),
    };

    appThemeApi.activeThemeId$.mockReturnValue(
      ObservableImpl.of<string | undefined>('dark'),
    );
    appThemeApi.getInstalledThemes.mockReturnValue([
      {
        id: 'dark',
        title: 'Dark Theme',
        variant: 'dark',
        theme: {} as unknown as BackstageTheme,
      },
      {
        id: 'light',
        title: 'Light Theme',
        variant: 'light',
        theme: {} as unknown as BackstageTheme,
      },
    ]);

    apiRegistry = ApiRegistry.with(appThemeApiRef, appThemeApi);
  });

  it('should display current theme', async () => {
    const { getByLabelText, getByRole, getByText } = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SidebarThemeSwitcher />
      </ApiProvider>,
    );

    const button = getByLabelText('Switch Theme');
    expect(button).toBeInTheDocument();

    userEvent.click(button);

    expect(getByRole('listbox')).toBeInTheDocument();
    expect(getByText('Dark Theme')).toBeInTheDocument();
    expect(
      getByText('Dark Theme').parentElement?.parentElement,
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('should select different theme', async () => {
    const { getByLabelText, getByRole, getByText } = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SidebarThemeSwitcher />
      </ApiProvider>,
    );

    const button = getByLabelText('Switch Theme');
    expect(button).toBeInTheDocument();

    userEvent.click(button);

    expect(getByRole('listbox')).toBeInTheDocument();

    userEvent.click(getByText('Light Theme'));

    expect(appThemeApi.setActiveThemeId).toHaveBeenCalledWith('light');
  });
});
