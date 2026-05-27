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

  it('should report truncated as true when element starts overflowing', () => {
    render(<TestHarness />);

    setElementDimensions(hookResult.ref.current!, 200, 100);
    act(() => hookResult.checkTruncation());

    expect(hookResult.truncated).toBe(true);
  });

  it('should reset truncated to false when overflow is resolved', () => {
    render(<TestHarness />);

    setElementDimensions(hookResult.ref.current!, 200, 100);
    act(() => hookResult.checkTruncation());
    expect(hookResult.truncated).toBe(true);

    setElementDimensions(hookResult.ref.current!, 100, 100);
    act(() => hookResult.checkTruncation());
    expect(hookResult.truncated).toBe(false);
  });

  it('should return a stable checkTruncation callback across renders', () => {
    const { rerender } = render(<TestHarness />);
    const first = hookResult.checkTruncation;

    rerender(<TestHarness />);
    expect(hookResult.checkTruncation).toBe(first);
  });
});
