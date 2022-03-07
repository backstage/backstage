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

import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { TestApiProvider, MockErrorApi } from '@backstage/test-utils';
import { errorApiRef } from '@backstage/core-plugin-api';
import { AnsiLine } from './AnsiProcessor';
import { useLogViewerSelection } from './useLogViewerSelection';
// eslint-disable-next-line import/no-extraneous-dependencies
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
];

describe('useLogViewerSelection', () => {
  it('should manage a selection', () => {
    const rendered = renderHook(() => useLogViewerSelection(lines), {
      wrapper: ({ children }) => (
        <TestApiProvider apis={[[errorApiRef, new MockErrorApi()]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expect(rendered.result.current.isSelected(1)).toBe(false);
    expect(rendered.result.current.isSelected(2)).toBe(false);
    expect(rendered.result.current.isSelected(3)).toBe(false);

    expect(rendered.result.current.shouldShowButton(1)).toBe(false);
    expect(rendered.result.current.shouldShowButton(2)).toBe(false);
    expect(rendered.result.current.shouldShowButton(3)).toBe(false);

    act(() => rendered.result.current.setSelection(2, false));

    expect(rendered.result.current.isSelected(1)).toBe(false);
    expect(rendered.result.current.isSelected(2)).toBe(true);
    expect(rendered.result.current.isSelected(3)).toBe(false);

    expect(rendered.result.current.shouldShowButton(1)).toBe(false);
    expect(rendered.result.current.shouldShowButton(2)).toBe(true);
    expect(rendered.result.current.shouldShowButton(3)).toBe(false);

    act(() => rendered.result.current.setSelection(3, false));

    expect(rendered.result.current.isSelected(1)).toBe(false);
    expect(rendered.result.current.isSelected(2)).toBe(false);
    expect(rendered.result.current.isSelected(3)).toBe(true);
    expect(rendered.result.current.isSelected(4)).toBe(false);

    expect(rendered.result.current.shouldShowButton(1)).toBe(false);
    expect(rendered.result.current.shouldShowButton(2)).toBe(false);
    expect(rendered.result.current.shouldShowButton(3)).toBe(true);
    expect(rendered.result.current.shouldShowButton(4)).toBe(false);

    act(() => rendered.result.current.setSelection(1, true));

    expect(rendered.result.current.isSelected(1)).toBe(true);
    expect(rendered.result.current.isSelected(2)).toBe(true);
    expect(rendered.result.current.isSelected(3)).toBe(true);
    expect(rendered.result.current.isSelected(4)).toBe(false);

    expect(rendered.result.current.shouldShowButton(1)).toBe(true);
    expect(rendered.result.current.shouldShowButton(2)).toBe(false);
    expect(rendered.result.current.shouldShowButton(3)).toBe(true);
    expect(rendered.result.current.shouldShowButton(4)).toBe(false);

    act(() => rendered.result.current.setSelection(4, true));

    expect(rendered.result.current.isSelected(1)).toBe(false);
    expect(rendered.result.current.isSelected(2)).toBe(false);
    expect(rendered.result.current.isSelected(3)).toBe(true);
    expect(rendered.result.current.isSelected(4)).toBe(true);
    expect(rendered.result.current.isSelected(5)).toBe(false);

    expect(rendered.result.current.shouldShowButton(1)).toBe(false);
    expect(rendered.result.current.shouldShowButton(2)).toBe(false);
    expect(rendered.result.current.shouldShowButton(3)).toBe(true);
    expect(rendered.result.current.shouldShowButton(4)).toBe(true);
    expect(rendered.result.current.shouldShowButton(5)).toBe(false);

    expect(copyToClipboard).not.toHaveBeenCalled();
    act(() => rendered.result.current.copySelection());
    expect(copyToClipboard).toHaveBeenLastCalledWith('3\n4');

    act(() => rendered.result.current.setSelection(2, true));
    act(() => rendered.result.current.setSelection(4, true));

    act(() => rendered.result.current.copySelection());
    expect(copyToClipboard).toHaveBeenCalledWith('2\n3\n4');

    act(() => rendered.result.current.setSelection(2, false));
    act(() => rendered.result.current.setSelection(4, false));
    act(() => rendered.result.current.setSelection(4, false));
    act(() => rendered.result.current.setSelection(5, true));
    act(() => rendered.result.current.copySelection());
    expect(copyToClipboard).toHaveBeenCalledWith('5');
  });
});
