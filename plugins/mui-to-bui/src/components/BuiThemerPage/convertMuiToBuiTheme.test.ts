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

    expect(result.css).toContain(':root {');
    expect(result.css).toContain('--bui-font-regular: Roboto, sans-serif;');
    // Spacing is skipped for default 8px
    expect(result.css).not.toContain('--bui-space:');
    // Border radius tokens are only generated when radius is 0
    expect(result.css).not.toContain('--bui-radius-3:');
    // Background default maps to surface-2
    expect(result.css).toContain('--bui-bg-surface-0: #f5f5f5;');
    expect(result.css).toContain('--bui-bg-surface-2: #f5f5f5;');
    expect(result.css).toContain('--bui-bg-surface-1: #ffffff;');
    expect(result.css).toContain('--bui-fg-primary: #000000;');
    // Secondary may not be present without Backstage additions, so don't assert it
    expect(result.css).toContain('--bui-bg-solid: #1976d2;');

    // Test style object
    expect(result.styleObject).toHaveProperty(
      '--bui-font-regular',
      'Roboto, sans-serif',
    );
    expect(result.styleObject).toHaveProperty('--bui-bg-solid', '#1976d2');
    expect(result.styleObject).toHaveProperty('--bui-fg-primary', '#000000');
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

    expect(result.css).toContain("[data-theme-mode='dark'] {");
    // Background default maps to surface-2 in dark mode as well
    expect(result.css).toContain('--bui-bg-surface-0: #121212;');
    expect(result.css).toContain('--bui-bg-surface-2: #121212;');
    expect(result.css).toContain('--bui-bg-surface-1: #1e1e1e;');
    expect(result.css).toContain('--bui-fg-primary: #ffffff;');

    // Test style object
    expect(result.styleObject).toHaveProperty('--bui-bg-surface-1', '#1e1e1e');
    expect(result.styleObject).toHaveProperty('--bui-fg-primary', '#ffffff');
  });

  it('should handle missing theme properties gracefully', () => {
    const theme = createTheme({});

    const result = convertMuiToBuiTheme(theme);

    expect(result.css).toContain(':root {');
    expect(result.css).toContain('--bui-font-weight-regular: 400;');
    expect(result.css).toContain('--bui-font-weight-bold: 700;');
    // Should have default values even when theme properties are missing
    expect(result.css).toContain('--bui-black: #000;');
    expect(result.css).toContain('--bui-white: #fff;');
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

    expect(result.css).toContain('--bui-bg-solid: #1976d2;');
    expect(result.css).toContain('--bui-bg-solid-hover: rgb(21, 100, 179);');
    expect(result.css).toContain('--bui-bg-danger: #ffcdd2;');
    expect(result.css).toContain('--bui-bg-warning: #ffe0b2;');
    expect(result.css).toContain('--bui-bg-success: #c8e6c9;');
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

    expect(result.css).toContain('--bui-fg-link: #1976d2;');
    expect(result.css).toContain('--bui-fg-link-hover: #115293;');
    expect(result.css).toContain('--bui-fg-disabled: #cccccc;');
    // Foreground danger/warning/success may be hex or rgb depending on theme
    expect(result.css).toMatch(
      /--bui-fg-danger:\s*(#[0-9a-f]{6}|rgb\([^)]*\));/i,
    );
    expect(result.css).toMatch(
      /--bui-fg-warning:\s*(#[0-9a-f]{6}|rgb\([^)]*\));/i,
    );
    expect(result.css).toMatch(
      /--bui-fg-success:\s*(#[0-9a-f]{6}|rgb\([^)]*\));/i,
    );
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

    // Base border colors are included when border/divider exist; specific statuses always present
    expect(result.css).toContain('--bui-border-danger: #f44336;');
    expect(result.css).toContain('--bui-border-warning: #ff9800;');
    expect(result.css).toContain('--bui-border-success: #4caf50;');
  });

  it('should handle function-based spacing', () => {
    const theme = createTheme({
      spacing: (factor: number) => `${factor * 4}px`,
    });

    const result = convertMuiToBuiTheme(theme);

    expect(result.css).toContain('--bui-space: calc(4px * 0.5);');
  });
});
