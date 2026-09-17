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
import { TestApiProvider } from '@backstage/test-utils';
import { appThemeApiRef, AppThemeApi } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';
import { createElement, type ReactNode } from 'react';
import { useInvertedThemeMode } from './useInvertedThemeMode';

// Helper to create a mock AppThemeApi
function createMockAppThemeApi(opts?: {
  activeThemeId?: string;
  themes?: Array<{ id: string; variant: 'light' | 'dark'; title: string }>;
}): AppThemeApi & { setActiveThemeId: (id?: string) => void } {
  const themes = opts?.themes ?? [
    { id: 'light', variant: 'light' as const, title: 'Light' },
    { id: 'dark', variant: 'dark' as const, title: 'Dark' },
  ];
  let activeId = opts?.activeThemeId;
  const subscribers = new Set<
    ZenObservable.SubscriptionObserver<string | undefined>
  >();

  return {
    getInstalledThemes: () =>
      themes.map(t => ({
        ...t,
        Provider: ({ children }: { children?: ReactNode }) => children,
      })) as ReturnType<AppThemeApi['getInstalledThemes']>,
    getActiveThemeId: () => activeId,
    activeThemeId$: () =>
      new ObservableImpl<string | undefined>(subscriber => {
        subscribers.add(subscriber);
        subscriber.next(activeId);
        return () => {
          subscribers.delete(subscriber);
        };
      }) as Observable<string | undefined>,
    setActiveThemeId: (id?: string) => {
      activeId = id;
      subscribers.forEach(s => s.next(id));
    },
  };
}

// Creates a wrapper that provides the AppThemeApi via TestApiProvider
function createWrapper(appThemeApi: AppThemeApi) {
  return ({ children }: { children: ReactNode }) =>
    createElement(
      TestApiProvider as any,
      { apis: [[appThemeApiRef, appThemeApi]] },
      children,
    );
}

describe('useInvertedThemeMode', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return dark when active theme is light', () => {
    const appThemeApi = createMockAppThemeApi({ activeThemeId: 'light' });
    const { result } = renderHook(() => useInvertedThemeMode(), {
      wrapper: createWrapper(appThemeApi),
    });
    expect(result.current).toBe('dark');
  });

  it('should return light when active theme is dark', () => {
    const appThemeApi = createMockAppThemeApi({ activeThemeId: 'dark' });
    const { result } = renderHook(() => useInvertedThemeMode(), {
      wrapper: createWrapper(appThemeApi),
    });
    expect(result.current).toBe('light');
  });

  it('should use system preference when no theme is selected (auto mode, prefers dark)', () => {
    const appThemeApi = createMockAppThemeApi({ activeThemeId: undefined });
    const { result } = renderHook(() => useInvertedThemeMode(), {
      wrapper: createWrapper(appThemeApi),
    });
    // matchMedia is unavailable in jsdom → prefersDark defaults to false
    // → picks light theme → inverted is dark
    expect(result.current).toBe('dark');
  });

  it('should update when active theme changes', async () => {
    const appThemeApi = createMockAppThemeApi({ activeThemeId: 'light' });
    const { result } = renderHook(() => useInvertedThemeMode(), {
      wrapper: createWrapper(appThemeApi),
    });
    expect(result.current).toBe('dark');

    await act(async () => {
      appThemeApi.setActiveThemeId('dark');
    });

    expect(result.current).toBe('light');
  });

  it('should fall back to first installed theme when no match', () => {
    const appThemeApi = createMockAppThemeApi({
      activeThemeId: undefined,
      themes: [{ id: 'custom', variant: 'dark', title: 'Custom' }],
    });
    const { result } = renderHook(() => useInvertedThemeMode(), {
      wrapper: createWrapper(appThemeApi),
    });
    // Only dark theme, system prefers light (default) but no light theme
    // → falls back to first theme (dark) → inverted is light
    expect(result.current).toBe('light');
  });

  it('should default to dark when no themes are installed', () => {
    const appThemeApi = createMockAppThemeApi({
      activeThemeId: undefined,
      themes: [],
    });
    const { result } = renderHook(() => useInvertedThemeMode(), {
      wrapper: createWrapper(appThemeApi),
    });
    // No themes → can't determine variant → defaults to 'dark'
    expect(result.current).toBe('dark');
  });

  it('should handle matchMedia being unavailable gracefully', () => {
    const appThemeApi = createMockAppThemeApi({ activeThemeId: undefined });
    const { result } = renderHook(() => useInvertedThemeMode(), {
      wrapper: createWrapper(appThemeApi),
    });
    // matchMedia is not available in jsdom → prefersDark defaults to false
    // → picks light variant → inverted is dark
    expect(result.current).toBe('dark');
  });
});
