/*
 * Copyright 2021 The Backstage Authors
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

import { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react';
import { MockErrorApi, TestApiProvider } from '@backstage/test-utils';
import { errorApiRef } from '@backstage/core-plugin-api';
import { AnsiLine } from './AnsiProcessor';
import { useLogViewerSelection } from './useLogViewerSelection';
// eslint-disable-next-line @backstage/no-undeclared-imports
import copyToClipboard from 'copy-to-clipboard';

// Used by useCopyToClipboard
jest.mock('copy-to-clipboard', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const lines = [
  new AnsiLine(1, [{ text: '1', modifiers: {} }]),
  new AnsiLine(2, [{ text: '2', modifiers: {} }]),
  new AnsiLine(3, [{ text: '3', modifiers: {} }]),
  new AnsiLine(4, [{ text: '4', modifiers: {} }]),
  new AnsiLine(5, [{ text: '5', modifiers: {} }]),
  new AnsiLine(6, [{ text: '6', modifiers: {} }]),
  new AnsiLine(7, [{ text: '7', modifiers: {} }]),
];

const expectSelectedLines = (rendered: any, selectedLines: number[]) => {
  expect(rendered.result.current.isSelected(1)).toBe(selectedLines.includes(1));
  expect(rendered.result.current.isSelected(2)).toBe(selectedLines.includes(2));
  expect(rendered.result.current.isSelected(3)).toBe(selectedLines.includes(3));
  expect(rendered.result.current.isSelected(4)).toBe(selectedLines.includes(4));
  expect(rendered.result.current.isSelected(5)).toBe(selectedLines.includes(5));
  expect(rendered.result.current.isSelected(6)).toBe(selectedLines.includes(6));
  expect(rendered.result.current.isSelected(7)).toBe(selectedLines.includes(7));
};

describe('useLogViewerSelection', () => {
  beforeEach(() => {
    (copyToClipboard as jest.Mock).mockClear();
  });

  it('should select a new line when clicked', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(5, false, false));
    expectSelectedLines(rendered, [5]);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, [2]);
  });

  it('should deselect a selected line when clicked', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, []);
  });

  it('should select a new line on shift+click if nothing is selected', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, true, false));
    expectSelectedLines(rendered, [2]);
  });

  it('should deselect a single line on shift+click', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, true, false));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(2, true, false));
    expectSelectedLines(rendered, []);
  });

  it('should select a range below on shift+click', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, true, false));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(5, true, false));
    expectSelectedLines(rendered, [2, 3, 4, 5]);
  });

  it('should select a range above on shift+click', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(5, true, false));
    expectSelectedLines(rendered, [5]);
    act(() => rendered.result.current.setSelection(2, true, false));
    expectSelectedLines(rendered, [2, 3, 4, 5]);
  });

  it('should reduce a selection on shift+click', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, true, false));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(7, true, false));
    expectSelectedLines(rendered, [2, 3, 4, 5, 6, 7]);
    act(() => rendered.result.current.setSelection(4, true, false));
    expectSelectedLines(rendered, [2, 3, 4]);
    act(() => rendered.result.current.setSelection(2, true, false));
    expectSelectedLines(rendered, [2]);
  });

  it('should add a new selection on cmd/ctrl+click', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, false, true));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(5, false, true));
    expectSelectedLines(rendered, [2, 5]);
  });

  it('should merge selections on cmd/ctrl+click', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(1, false, true));
    expectSelectedLines(rendered, [1]);
    act(() => rendered.result.current.setSelection(3, true, false));
    expectSelectedLines(rendered, [1, 2, 3]);
    act(() => rendered.result.current.setSelection(5, false, true));
    expectSelectedLines(rendered, [1, 2, 3, 5]);
    act(() => rendered.result.current.setSelection(7, true, false));
    expectSelectedLines(rendered, [1, 2, 3, 5, 6, 7]);
    act(() => rendered.result.current.setSelection(4, false, true));
    expectSelectedLines(rendered, [1, 2, 3, 4, 5, 6, 7]);
  });

  it('should split a selection on cmd/ctrl+click', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(1, false, true));
    expectSelectedLines(rendered, [1]);
    act(() => rendered.result.current.setSelection(5, true, false));
    expectSelectedLines(rendered, [1, 2, 3, 4, 5]);
    act(() => rendered.result.current.setSelection(3, false, true));
    expectSelectedLines(rendered, [1, 2, 4, 5]);
  });

  it('should copy a selected line', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, [2]);

    expect(copyToClipboard).not.toHaveBeenCalled();
    act(() => rendered.result.current.copySelection(2));
    expect(copyToClipboard).toHaveBeenLastCalledWith('2');
  });

  it('should copy a selected range', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });
    rendered.rerender();

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(5, true, false));
    expectSelectedLines(rendered, [2, 3, 4, 5]);

    expect(copyToClipboard).not.toHaveBeenCalled();
    act(() => rendered.result.current.copySelection(2));
    expect(copyToClipboard).toHaveBeenCalledWith('2\n3\n4\n5');
  });

  it('should copy the correct selection', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });
    rendered.rerender();

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(5, true, false));
    expectSelectedLines(rendered, [2, 3, 4, 5]);

    act(() => rendered.result.current.setSelection(7, false, true));
    expectSelectedLines(rendered, [2, 3, 4, 5, 7]);

    expect(copyToClipboard).not.toHaveBeenCalled();
    act(() => rendered.result.current.copySelection(2));
    expect(copyToClipboard).toHaveBeenCalledWith('2\n3\n4\n5');
    act(() => rendered.result.current.copySelection(7));
    expect(copyToClipboard).toHaveBeenCalledWith('7');
  });

  it('should add a single line selection to the hash', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });
    rendered.rerender();

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, [2]);

    expect(rendered.result.current.getHash()).toBe('#lines-2');
  });

  it('should add a range selection to the hash', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });
    rendered.rerender();

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(2, false, false));
    expectSelectedLines(rendered, [2]);
    act(() => rendered.result.current.setSelection(5, true, false));
    expectSelectedLines(rendered, [2, 3, 4, 5]);

    expect(rendered.result.current.getHash()).toBe('#lines-2-5');
  });

  it('should add multiple selections to the hash', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });
    rendered.rerender();

    expectSelectedLines(rendered, []);
    act(() => rendered.result.current.setSelection(3, false, false));
    expectSelectedLines(rendered, [3]);
    act(() => rendered.result.current.setSelection(5, true, false));
    expectSelectedLines(rendered, [3, 4, 5]);
    act(() => rendered.result.current.setSelection(1, false, true));
    expectSelectedLines(rendered, [1, 3, 4, 5]);
    act(() => rendered.result.current.setSelection(7, false, true));
    expectSelectedLines(rendered, [1, 3, 4, 5, 7]);

    expect(rendered.result.current.getHash()).toBe('#lines-3-5,1,7');
  });
});
