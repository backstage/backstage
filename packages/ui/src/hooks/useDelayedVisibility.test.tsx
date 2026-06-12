/*
 * Copyright 2026 The Backstage Authors
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

import { act, renderHook } from '@testing-library/react';
import { useDelayedVisibility } from './useDelayedVisibility';

describe('useDelayedVisibility', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('delays visibility and hides immediately when visibility is removed', () => {
    const { result, rerender } = renderHook(
      ({ isVisible }) => useDelayedVisibility(isVisible, 300),
      { initialProps: { isVisible: false } },
    );

    expect(result.current).toBe(false);

    rerender({ isVisible: true });
    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe(false);

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe(true);

    rerender({ isVisible: false });
    expect(result.current).toBe(false);
  });

  it('cancels a pending visibility change', () => {
    const { result, rerender } = renderHook(
      ({ isVisible }) => useDelayedVisibility(isVisible, 300),
      { initialProps: { isVisible: true } },
    );

    act(() => jest.advanceTimersByTime(150));
    rerender({ isVisible: false });
    act(() => jest.advanceTimersByTime(150));

    expect(result.current).toBe(false);
  });
});
