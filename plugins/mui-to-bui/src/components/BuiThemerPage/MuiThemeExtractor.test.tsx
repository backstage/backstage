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

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MuiThemeExtractor } from './MuiThemeExtractor';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockAppTheme = {
  id: 'mock',
  title: 'Mock',
  variant: 'light' as const,
  Provider: ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
  ),
};

describe('MuiThemeExtractor', () => {
  it('invokes render prop with extracted theme', async () => {
    render(
      <MuiThemeExtractor appTheme={mockAppTheme}>
        {theme => <div>theme-palette-mode-{theme.palette.mode}</div>}
      </MuiThemeExtractor>,
    );

    expect(screen.getByText('theme-palette-mode-light')).toBeInTheDocument();
  });
});
