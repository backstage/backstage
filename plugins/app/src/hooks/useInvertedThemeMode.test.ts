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

import { renderHook, act } from '@testing-library/react';
import { useInvertedThemeMode } from './useInvertedThemeMode';

describe('useInvertedThemeMode', () => {
  const originalBodyTheme = document.body.getAttribute('data-theme-mode');
  const originalHtmlTheme =
    document.documentElement.getAttribute('data-theme-mode');

  afterEach(() => {
    // Restore original attributes
    if (originalBodyTheme) {
      document.body.setAttribute('data-theme-mode', originalBodyTheme);
    } else {
      document.body.removeAttribute('data-theme-mode');
    }
    if (originalHtmlTheme) {
      document.documentElement.setAttribute(
        'data-theme-mode',
        originalHtmlTheme,
      );
    } else {
      document.documentElement.removeAttribute('data-theme-mode');
    }
  });

  it('should return dark when no theme is set', () => {
    document.body.removeAttribute('data-theme-mode');
    document.documentElement.removeAttribute('data-theme-mode');

    const { result } = renderHook(() => useInvertedThemeMode());

    expect(result.current).toBe('dark');
  });

  it('should return light when body theme is dark', () => {
    document.body.setAttribute('data-theme-mode', 'dark');

    const { result } = renderHook(() => useInvertedThemeMode());

    expect(result.current).toBe('light');
  });

  it('should return dark when body theme is light', () => {
    document.body.setAttribute('data-theme-mode', 'light');

    const { result } = renderHook(() => useInvertedThemeMode());

    expect(result.current).toBe('dark');
  });

  it('should prefer body theme over html theme', () => {
    document.documentElement.setAttribute('data-theme-mode', 'light');
    document.body.setAttribute('data-theme-mode', 'dark');

    const { result } = renderHook(() => useInvertedThemeMode());

    // Body is dark, so inverted should be light
    expect(result.current).toBe('light');
  });

  it('should fall back to html theme when body has no theme', () => {
    document.body.removeAttribute('data-theme-mode');
    document.documentElement.setAttribute('data-theme-mode', 'dark');

    const { result } = renderHook(() => useInvertedThemeMode());

    expect(result.current).toBe('light');
  });

  it('should update when body theme changes', async () => {
    document.body.setAttribute('data-theme-mode', 'light');

    const { result } = renderHook(() => useInvertedThemeMode());

    expect(result.current).toBe('dark');

    // Change theme
    await act(async () => {
      document.body.setAttribute('data-theme-mode', 'dark');
      // Wait for MutationObserver to fire
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toBe('light');
  });

  it('should update when html theme changes', async () => {
    document.body.removeAttribute('data-theme-mode');
    document.documentElement.setAttribute('data-theme-mode', 'light');

    const { result } = renderHook(() => useInvertedThemeMode());

    expect(result.current).toBe('dark');

    // Change theme
    await act(async () => {
      document.documentElement.setAttribute('data-theme-mode', 'dark');
      // Wait for MutationObserver to fire
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toBe('light');
  });

  it('should clean up observer on unmount', () => {
    const disconnectSpy = jest.spyOn(MutationObserver.prototype, 'disconnect');

    const { unmount } = renderHook(() => useInvertedThemeMode());

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
    disconnectSpy.mockRestore();
  });
});
