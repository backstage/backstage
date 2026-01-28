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

import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useApplyThemeAttributes } from './useApplyThemeAttributes';

describe('useApplyThemeAttributes', () => {
  beforeEach(() => {
    document.body.removeAttribute('data-unified-theme-stack');
    document.body.removeAttribute('data-theme-mode');
    document.body.removeAttribute('data-theme-name');
  });

  it('pushes attributes on mount and pops on unmount', () => {
    const { unmount } = renderHook(() =>
      useApplyThemeAttributes('light', 'one'),
    );
    expect(document.body.getAttribute('data-theme-mode')).toBe('light');
    expect(document.body.getAttribute('data-theme-name')).toBe('one');
    expect(
      JSON.parse(document.body.getAttribute('data-unified-theme-stack') || '[]')
        .length,
    ).toBe(1);

    unmount();
    expect(document.body.getAttribute('data-theme-mode')).toBeNull();
    expect(document.body.getAttribute('data-theme-name')).toBeNull();
    expect(document.body.getAttribute('data-unified-theme-stack')).toBeNull();
  });

  it('stacks multiple mounts and applies top-most', () => {
    const r1 = renderHook(() => useApplyThemeAttributes('light', 'one'));
    const r2 = renderHook(() => useApplyThemeAttributes('dark', 'two'));

    expect(document.body.getAttribute('data-theme-mode')).toBe('dark');
    expect(document.body.getAttribute('data-theme-name')).toBe('two');

    r2.unmount();
    expect(document.body.getAttribute('data-theme-mode')).toBe('light');
    expect(document.body.getAttribute('data-theme-name')).toBe('one');

    r1.unmount();
    expect(document.body.getAttribute('data-theme-mode')).toBeNull();
    expect(document.body.getAttribute('data-theme-name')).toBeNull();
  });
});
