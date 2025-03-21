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

import { AppTheme, appThemeApiRef } from '@backstage/core-plugin-api';
import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { UserSettingsThemeToggle } from './UserSettingsThemeToggle';
import { ApiProvider, AppThemeSelector } from '@backstage/core-app-api';

const mockTheme: AppTheme = {
  id: 'light-theme',
  title: 'Mock Theme',
  variant: 'light',
  Provider: ({ children }) => (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};

const apiRegistry = TestApiRegistry.from([
  appThemeApiRef,
  AppThemeSelector.createWithStorage([mockTheme]),
]);

describe('<UserSettingsThemeToggle />', () => {
  it('toggles the theme select button', async () => {
    const themeApi = apiRegistry.get(appThemeApiRef);

    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <UserSettingsThemeToggle />
      </ApiProvider>,
    );

    expect(screen.getByText('Theme')).toBeInTheDocument();

    const themeButton = screen.getByText('Mock Theme');
    expect(themeApi?.getActiveThemeId()).toBe(undefined);
    fireEvent.click(themeButton);
    expect(themeApi?.getActiveThemeId()).toBe('light-theme');
  });
});
