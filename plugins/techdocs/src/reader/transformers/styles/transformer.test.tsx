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

import { renderHook } from '@testing-library/react';
import { useStylesTransformer } from './transformer';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { ReactNode } from 'react';

describe('Transformers > Styles', () => {
  it('should return a function that injects all styles into a given dom element', () => {
    const { result } = renderHook(() => useStylesTransformer());

    const dom = document.createElement('html');
    dom.innerHTML = '<head></head>';
    result.current(dom); // calling styles transformer

    const style = dom.querySelector('head > style');

    expect(style).toHaveTextContent(
      '/*================== Variables ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Reset ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Layout ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Typeset ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Animations ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Extensions ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Palette ==================*/',
    );
  });

  it('should use headers relative font-size value as the factor for the md-typeset variable', () => {
    const theme = createTheme({
      typography: {
        h1: {
          fontSize: '20rem',
        },
      },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useStylesTransformer(), { wrapper });

    const dom = document.createElement('html');
    dom.innerHTML = `<head></head>`;
    result.current(dom); // calling styles transformer

    const style = dom.querySelector('head > style');
    expect(style).not.toBeNull();

    const h1 = style!.textContent?.match(/\.md-typeset h1 {.*?}/s);
    expect(h1).toHaveLength(1);
    expect(h1![0]).toContain(
      'font-size: calc(20 * var(--md-typeset-font-size));',
    );
  });

  it('should resolve header sizes that are variables', () => {
    document.body.style.setProperty('--font-size-h1', '20rem');
    const theme = createTheme({
      typography: {
        h1: {
          fontSize: 'var(--font-size-h1)',
        },
      },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useStylesTransformer(), { wrapper });

    const dom = document.createElement('html');
    dom.innerHTML = `<head></head>`;
    result.current(dom); // calling styles transformer

    const style = dom.querySelector('head > style');
    expect(style).not.toBeNull();

    const h1 = style!.textContent?.match(/\.md-typeset h1 {.*?}/s);
    expect(h1).toHaveLength(1);
    expect(h1![0]).toContain(
      'font-size: calc(20 * var(--md-typeset-font-size));',
    );
  });

  it('should convert pixel header sizes to REM and reduce by 60%', () => {
    const theme = createTheme({
      typography: {
        htmlFontSize: 16,
        h1: {
          fontSize: 100,
        },
      },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useStylesTransformer(), { wrapper });

    const dom = document.createElement('html');
    dom.innerHTML = `<head></head>`;
    result.current(dom); // calling styles transformer

    const style = dom.querySelector('head > style');
    expect(style).not.toBeNull();

    const h1 = style!.textContent?.match(/\.md-typeset h1 {.*?}/s);
    expect(h1).toHaveLength(1);
    expect(h1![0]).toContain(
      // 100px / 16px * 0.6 = 3.75rem
      'font-size: calc(3.75 * var(--md-typeset-font-size));',
    );
  });
});
