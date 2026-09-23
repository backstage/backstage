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

import { render, act } from '@testing-library/react';
import { useIsTruncated } from './useIsTruncated';

let hookResult: ReturnType<typeof useIsTruncated>;

function TestHarness() {
  hookResult = useIsTruncated();
  return <span ref={hookResult.ref}>truncatable text</span>;
}

function setElementDimensions(
  el: HTMLElement,
  scrollWidth: number,
  clientWidth: number,
) {
  Object.defineProperty(el, 'scrollWidth', {
    value: scrollWidth,
    configurable: true,
  });
  Object.defineProperty(el, 'clientWidth', {
    value: clientWidth,
    configurable: true,
  });
}

let resizeCallback: ResizeObserverCallback;
const originalResizeObserver = global.ResizeObserver;

beforeEach(() => {
  jest.useFakeTimers();

  global.ResizeObserver = jest.fn(cb => {
    resizeCallback = cb;
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
  }) as unknown as typeof ResizeObserver;
});

afterEach(() => {
  jest.useRealTimers();
  global.ResizeObserver = originalResizeObserver;
});

describe('useIsTruncated', () => {
  it('should detect initial overflow on mount', () => {
    const scrollWidthSpy = jest
      .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
      .mockReturnValue(200);
    const clientWidthSpy = jest
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockReturnValue(100);

    render(<TestHarness />);

    expect(hookResult.truncated).toBe(true);

    scrollWidthSpy.mockRestore();
    clientWidthSpy.mockRestore();
  });

  it('should report truncated as false when element is not overflowing', () => {
    render(<TestHarness />);

    expect(hookResult.truncated).toBe(false);
    expect(hookResult.ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('should update truncated when the element resizes after debounce', () => {
    render(<TestHarness />);
    expect(hookResult.truncated).toBe(false);

    setElementDimensions(hookResult.ref.current!, 200, 100);
    act(() => resizeCallback([], {} as ResizeObserver));
    expect(hookResult.truncated).toBe(false);

    act(() => jest.advanceTimersByTime(150));
    expect(hookResult.truncated).toBe(true);
  });

  it('should debounce rapid resize callbacks', () => {
    render(<TestHarness />);

    const el = hookResult.ref.current!;
    setElementDimensions(el, 200, 100);
    let checkCount = 0;
    Object.defineProperty(el, 'scrollWidth', {
      get: () => {
        checkCount++;
        return 200;
      },
      configurable: true,
    });

    act(() => {
      resizeCallback([], {} as ResizeObserver);
      jest.advanceTimersByTime(50);
      resizeCallback([], {} as ResizeObserver);
      jest.advanceTimersByTime(50);
      resizeCallback([], {} as ResizeObserver);
    });
    expect(hookResult.truncated).toBe(false);
    expect(checkCount).toBe(0);

    act(() => jest.advanceTimersByTime(150));
    expect(hookResult.truncated).toBe(true);
    // 1 from the debounced resize callback + 1 from the every-render layout effect
    expect(checkCount).toBe(2);
  });

  it('should reset truncated to false when overflow is resolved after resize', () => {
    const scrollWidthSpy = jest
      .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
      .mockReturnValue(200);
    const clientWidthSpy = jest
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockReturnValue(100);

    render(<TestHarness />);
    expect(hookResult.truncated).toBe(true);

    scrollWidthSpy.mockRestore();
    clientWidthSpy.mockRestore();

    setElementDimensions(hookResult.ref.current!, 100, 100);
    act(() => {
      resizeCallback([], {} as ResizeObserver);
      jest.advanceTimersByTime(150);
    });
    expect(hookResult.truncated).toBe(false);
  });

  it('should re-check truncation on rerender when content changes', () => {
    const { rerender } = render(<TestHarness />);
    expect(hookResult.truncated).toBe(false);

    setElementDimensions(hookResult.ref.current!, 200, 100);

    rerender(<TestHarness />);
    expect(hookResult.truncated).toBe(true);
  });

  it('should disconnect the observer on unmount', () => {
    const { unmount } = render(<TestHarness />);
    const instance = (ResizeObserver as jest.Mock).mock.results.at(-1)!.value;

    unmount();

    expect(instance.disconnect).toHaveBeenCalled();
  });
});
