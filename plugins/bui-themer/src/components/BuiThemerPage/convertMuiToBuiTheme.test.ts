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

import { createTheme } from '@mui/material/styles';
import { convertMuiToBuiTheme } from './convertMuiToBuiTheme';

describe('convertMuiToBuiTheme', () => {
  it('should generate CSS for light theme', () => {
    const theme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          dark: '#115293',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#000000',
          secondary: '#666666',
        },
      },
      typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
          fontSize: '2.5rem',
        },
        body1: {
          fontSize: '1rem',
        },
      },
      spacing: 8,
      shape: {
        borderRadius: 4,
      },
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain(':root {');
    expect(result).toContain('--bui-font-regular: Roboto, sans-serif;');
    expect(result).toContain('--bui-space: 8px;');
    expect(result).toContain('--bui-radius-3: 4px;');
    expect(result).toContain('--bui-bg: #f5f5f5;');
    expect(result).toContain('--bui-bg-surface-1: #ffffff;');
    expect(result).toContain('--bui-fg-primary: #000000;');
    expect(result).toContain('--bui-fg-secondary: #666666;');
    expect(result).toContain('--bui-bg-solid: #1976d2;');
  });

  it('should generate CSS for dark theme', () => {
    const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#90caf9',
          dark: '#42a5f5',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
        },
      },
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain("[data-theme-mode='dark'] {");
    expect(result).toContain('--bui-bg: #121212;');
    expect(result).toContain('--bui-bg-surface-1: #1e1e1e;');
    expect(result).toContain('--bui-fg-primary: #ffffff;');
    expect(result).toContain('--bui-fg-secondary: #b3b3b3;');
  });

  it('should include theme ID scoping when requested', () => {
    const theme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
        },
      },
    });

    const result = convertMuiToBuiTheme(theme, {
      themeId: 'my-theme',
      includeThemeId: true,
    });

    expect(result).toContain("[data-app-theme='my-theme'] :root {");
  });

  it('should handle missing theme properties gracefully', () => {
    const theme = createTheme({});

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain(':root {');
    expect(result).toContain('--bui-font-weight-regular: 400;');
    expect(result).toContain('--bui-font-weight-bold: 700;');
    // Should have default values even when theme properties are missing
    expect(result).toContain('--bui-black: #000;');
    expect(result).toContain('--bui-white: #fff;');
  });

  it('should generate proper gray scale for light theme', () => {
    const theme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
        },
      },
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain('--bui-gray-1: #f8f8f8;');
    expect(result).toContain('--bui-gray-8: #595959;');
  });

  it('should generate proper gray scale for dark theme', () => {
    const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#90caf9',
        },
      },
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain('--bui-gray-1: #191919;');
    expect(result).toContain('--bui-gray-8: #b4b4b4;');
  });

  it('should generate surface colors correctly', () => {
    const theme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          dark: '#115293',
        },
        error: {
          main: '#f44336',
          light: '#ffcdd2',
        },
        warning: {
          main: '#ff9800',
          light: '#ffe0b2',
        },
        success: {
          main: '#4caf50',
          light: '#c8e6c9',
        },
      },
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain('--bui-bg-solid: #1976d2;');
    expect(result).toContain('--bui-bg-solid-hover: #115293;');
    expect(result).toContain('--bui-bg-danger: #ffcdd2;');
    expect(result).toContain('--bui-bg-warning: #ffe0b2;');
    expect(result).toContain('--bui-bg-success: #c8e6c9;');
  });

  it('should generate foreground colors correctly', () => {
    const theme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          dark: '#115293',
        },
        error: {
          main: '#f44336',
        },
        warning: {
          main: '#ff9800',
        },
        success: {
          main: '#4caf50',
        },
        text: {
          disabled: '#cccccc',
        },
      },
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain('--bui-fg-link: #1976d2;');
    expect(result).toContain('--bui-fg-link-hover: #115293;');
    expect(result).toContain('--bui-fg-disabled: #cccccc;');
    expect(result).toContain('--bui-fg-danger: #f44336;');
    expect(result).toContain('--bui-fg-warning: #ff9800;');
    expect(result).toContain('--bui-fg-success: #4caf50;');
  });

  it('should generate border colors correctly', () => {
    const theme = createTheme({
      palette: {
        mode: 'light',
        error: {
          main: '#f44336',
        },
        warning: {
          main: '#ff9800',
        },
        success: {
          main: '#4caf50',
        },
      },
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain('--bui-border: rgba(0, 0, 0, 0.1);');
    expect(result).toContain('--bui-border-hover: rgba(0, 0, 0, 0.2);');
    expect(result).toContain('--bui-border-danger: #f44336;');
    expect(result).toContain('--bui-border-warning: #ff9800;');
    expect(result).toContain('--bui-border-success: #4caf50;');
  });

  it('should handle function-based spacing', () => {
    const theme = createTheme({
      spacing: (factor: number) => `${factor * 4}px`,
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain('--bui-space: 4px;');
  });

  it('should handle string-based spacing', () => {
    const theme = createTheme({
      spacing: '8px',
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain('--bui-space: calc(1 * 8px);');
  });

  it('should handle string-based border radius', () => {
    const theme = createTheme({
      shape: {
        borderRadius: '8px',
      },
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result).toContain('--bui-radius-3: 8px;');
  });
});
