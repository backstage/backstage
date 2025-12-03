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

import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeContent } from './ThemeContent';
import { createTheme } from '@mui/material/styles';
import { renderInTestApp } from '@backstage/test-utils';

jest.mock('./convertMuiToBuiTheme', () => ({
  convertMuiToBuiTheme: () => ({
    css: ':root { --bui-color: #000; }',
    styleObject: { '--bui-color': '#000' },
  }),
}));

describe('ThemeContent', () => {
  const muiTheme = createTheme();

  it('renders title, variant and tabs', async () => {
    await renderInTestApp(
      <ThemeContent
        themeId="light"
        themeTitle="Light Theme"
        variant="light"
        muiTheme={muiTheme}
      />,
    );

    expect(screen.getByText('Light Theme')).toBeInTheDocument();
    expect(screen.getByText('light theme')).toBeInTheDocument();
    expect(screen.getByText('Generated CSS')).toBeInTheDocument();
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
    expect(
      screen.getByText(':root { --bui-color: #000; }'),
    ).toBeInTheDocument();
  });

  it('handles Copy CSS click', async () => {
    const writeText = jest.fn();
    Object.assign(window.navigator, { clipboard: { writeText } });

    await renderInTestApp(
      <ThemeContent
        themeId="light"
        themeTitle="Light Theme"
        variant="light"
        muiTheme={muiTheme}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(writeText).toHaveBeenCalledWith(':root { --bui-color: #000; }');
  });

  it('switches to Live Preview tab', async () => {
    await renderInTestApp(
      <ThemeContent
        themeId="light"
        themeTitle="Light Theme"
        variant="light"
        muiTheme={muiTheme}
      />,
    );

    fireEvent.click(screen.getByText('Live Preview'));
    // The preview renders content from BuiThemePreview; basic smoke check:
    expect(await screen.findByText('Button Variants')).toBeInTheDocument();
  });
});
