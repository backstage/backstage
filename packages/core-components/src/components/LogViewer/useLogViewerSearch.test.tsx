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

import { act, renderHook } from '@testing-library/react-hooks';
import { applySearchFilter, useLogViewerSearch } from './useLogViewerSearch';
import { AnsiLine } from './AnsiProcessor';

const lines = [
  new AnsiLine(1, [{ text: 'FooBar', modifiers: {} }]),
  new AnsiLine(2, [{ text: 'Baz', modifiers: {} }]),
  new AnsiLine(3, [{ text: 'FooBarFoo', modifiers: {} }]),
  new AnsiLine(4, [{ text: 'Baz', modifiers: {} }]),
  new AnsiLine(5, [{ text: 'BazFoo', modifiers: {} }]),
  new AnsiLine(6, [{ text: 'FooFooFoo', modifiers: {} }]),
  new AnsiLine(7, [{ text: '', modifiers: {} }]),
  new AnsiLine(8, [{ text: 'Bar', modifiers: {} }]),
];

describe('applySearchFilter', () => {
  it('should find search results', () => {
    expect(applySearchFilter(lines, '')).toEqual({
      lines: lines,
      results: undefined,
    });
    expect(applySearchFilter(lines, 'foo')).toEqual({
      lines: [lines[0], lines[2], lines[4], lines[5]],
      results: [
        { lineNumber: 1, lineIndex: 0 },
        { lineNumber: 3, lineIndex: 0 },
        { lineNumber: 3, lineIndex: 1 },
        { lineNumber: 5, lineIndex: 0 },
        { lineNumber: 6, lineIndex: 0 },
        { lineNumber: 6, lineIndex: 1 },
        { lineNumber: 6, lineIndex: 2 },
      ],
    });
    expect(applySearchFilter(lines, 'bar')).toEqual({
      lines: [lines[0], lines[2], lines[7]],
      results: [
        { lineNumber: 1, lineIndex: 0 },
        { lineNumber: 3, lineIndex: 0 },
        { lineNumber: 8, lineIndex: 0 },
      ],
    });
    expect(applySearchFilter(lines, 'baz')).toEqual({
      lines: [lines[1], lines[3], lines[4]],
      results: [
        { lineNumber: 2, lineIndex: 0 },
        { lineNumber: 4, lineIndex: 0 },
        { lineNumber: 5, lineIndex: 0 },
      ],
    });
  });
});

describe('useLogViewerSearch', () => {
  it('should provide search state', () => {
    const rendered = renderHook(() => useLogViewerSearch(lines));
    expect(rendered.result.current).toMatchObject({
      lines,
      searchText: '',
      shouldFilter: false,
      resultCount: undefined,
      resultIndex: 0,
      resultLine: undefined,
      resultLineIndex: undefined,
    });

    rendered.result.current.resultIndexStep();
    expect(rendered.result.current).toMatchObject({
      lines,
      searchText: '',
      shouldFilter: false,
      resultCount: undefined,
      resultIndex: 0,
      resultLine: undefined,
      resultLineIndex: undefined,
    });

    act(() => rendered.result.current.toggleShouldFilter());
    expect(rendered.result.current).toMatchObject({
      lines,
      searchText: '',
      shouldFilter: true,
      resultCount: undefined,
      resultIndex: 0,
      resultLine: undefined,
      resultLineIndex: undefined,
    });

    act(() => rendered.result.current.setSearchInput('BAR'));
    expect(rendered.result.current).toMatchObject({
      lines: [lines[0], lines[2], lines[7]],
      searchInput: 'BAR',
      searchText: 'bar',
      shouldFilter: true,
      resultCount: 3,
      resultIndex: 0,
      resultLine: 1,
      resultLineIndex: 0,
    });

    act(() => rendered.result.current.resultIndexStep());
    expect(rendered.result.current).toMatchObject({
      lines: [lines[0], lines[2], lines[7]],
      resultIndex: 1,
      resultLine: 3,
      resultLineIndex: 0,
    });

    act(() => rendered.result.current.resultIndexStep());
    expect(rendered.result.current).toMatchObject({
      lines: [lines[0], lines[2], lines[7]],
      resultIndex: 2,
      resultLine: 8,
      resultLineIndex: 0,
    });

    act(() => rendered.result.current.resultIndexStep());
    expect(rendered.result.current).toMatchObject({
      lines: [lines[0], lines[2], lines[7]],
      resultIndex: 0,
      resultLine: 1,
      resultLineIndex: 0,
    });

    act(() => rendered.result.current.resultIndexStep(true));
    expect(rendered.result.current).toMatchObject({
      lines: [lines[0], lines[2], lines[7]],
      resultIndex: 2,
      resultLine: 8,
      resultLineIndex: 0,
    });

    act(() => rendered.result.current.setSearchInput('FOO'));
    expect(rendered.result.current).toMatchObject({
      lines: [lines[0], lines[2], lines[4], lines[5]],
      searchInput: 'FOO',
      searchText: 'foo',
      shouldFilter: true,
      resultCount: 7,
      resultIndex: 2,
      resultLine: 3,
      resultLineIndex: 1,
    });

    act(() => rendered.result.current.toggleShouldFilter());
    expect(rendered.result.current).toMatchObject({
      lines,
      shouldFilter: false,
      resultCount: 7,
      resultIndex: 2,
      resultLine: 3,
      resultLineIndex: 1,
    });

    act(() => rendered.result.current.resultIndexStep());
    expect(rendered.result.current).toMatchObject({
      lines,
      searchInput: 'FOO',
      searchText: 'foo',
      shouldFilter: false,
      resultCount: 7,
      resultIndex: 3,
      resultLine: 5,
      resultLineIndex: 0,
    });

    act(() => rendered.result.current.resultIndexStep());
    expect(rendered.result.current).toMatchObject({
      resultIndex: 4,
      resultLine: 6,
      resultLineIndex: 0,
    });

    act(() => rendered.result.current.resultIndexStep());
    expect(rendered.result.current).toMatchObject({
      resultIndex: 5,
      resultLine: 6,
      resultLineIndex: 1,
    });

    act(() => rendered.result.current.resultIndexStep());
    expect(rendered.result.current).toMatchObject({
      resultIndex: 6,
      resultLine: 6,
      resultLineIndex: 2,
    });

    act(() => rendered.result.current.setSearchInput('BAR'));
    expect(rendered.result.current).toMatchObject({
      searchText: 'bar',
      resultCount: 3,
      resultIndex: 6,
      resultLine: 8,
      resultLineIndex: 0,
    });

    act(() => rendered.result.current.resultIndexStep(true));
    expect(rendered.result.current).toMatchObject({
      searchText: 'bar',
      resultCount: 3,
      resultIndex: 1,
      resultLine: 3,
      resultLineIndex: 0,
    });
  });
});
