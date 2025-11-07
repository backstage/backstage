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
import '@testing-library/jest-dom';
import { BuiThemerPage } from './BuiThemerPage';
import { appThemeApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function makeAppTheme(id: string, title: string, variant: 'light' | 'dark') {
  return {
    id,
    title,
    variant,
    Provider: ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
    ),
  };
}

describe('BuiThemerPage', () => {
  it('renders empty state when no themes installed', async () => {
    const apis = [[appThemeApiRef, { getInstalledThemes: () => [] }]] as const;
    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <BuiThemerPage />
      </TestApiProvider>,
    );

    expect(
      screen.getByText(/No themes found. Please install some themes/i),
    ).toBeInTheDocument();
  });

  it('renders ThemeContent for each installed theme', async () => {
    const themes = [
      makeAppTheme('light', 'Light', 'light'),
      makeAppTheme('dark', 'Dark', 'dark'),
    ];
    const apis = [
      [appThemeApiRef, { getInstalledThemes: () => themes }],
    ] as const;

    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <BuiThemerPage />
      </TestApiProvider>,
    );

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });
});
