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

import { useMemo, useState } from 'react';
import { useToggle } from '@react-hookz/web';
import { AnsiLine } from './AnsiProcessor';

export function applySearchFilter(lines: AnsiLine[], searchText: string) {
  if (!searchText) {
    return { lines };
  }

  const matchingLines = [];
  const searchResults = [];
  for (const line of lines) {
    if (line.text.includes(searchText)) {
      matchingLines.push(line);

      let offset = 0;
      let lineResultIndex = 0;
      for (;;) {
        const start = line.text.indexOf(searchText, offset);
        if (start === -1) {
          break;
        }
        searchResults.push({
          lineNumber: line.lineNumber,
          lineIndex: lineResultIndex++,
        });
        offset = start + searchText.length;
      }
    }
  }

  return {
    lines: matchingLines,
    results: searchResults,
  };
}

export interface LogViewerSearch {
  lines: AnsiLine[];

  searchText: string;
  searchInput: string;
  setSearchInput: (searchInput: string) => void;

  shouldFilter: boolean;
  toggleShouldFilter: () => void;

  resultCount: number | undefined;
  resultIndex: number | undefined;
  resultIndexStep: (decrement?: boolean) => void;

  resultLine: number | undefined;
  resultLineIndex: number | undefined;
}

export function useLogViewerSearch(lines: AnsiLine[]): LogViewerSearch {
  const [searchInput, setSearchInput] = useState('');
  const searchText = searchInput.toLocaleLowerCase('en-US');

  const [resultIndex, setResultIndex] = useState<number>(0);

  const [shouldFilter, toggleShouldFilter] = useToggle(false);

  const filter = useMemo(
    () => applySearchFilter(lines, searchText),
    [lines, searchText],
  );

  const searchResult = filter.results
    ? filter.results[Math.min(resultIndex, filter.results.length - 1)]
    : undefined;
  const resultCount = filter.results?.length;

  const resultIndexStep = (decrement?: boolean) => {
    if (decrement) {
      if (resultCount !== undefined) {
        const next = Math.min(resultIndex - 1, resultCount - 2);
        setResultIndex(next < 0 ? resultCount - 1 : next);
      }
    } else {
      if (resultCount !== undefined) {
        const next = resultIndex + 1;
        setResultIndex(next >= resultCount ? 0 : next);
      }
    }
  };

  return {
    lines: shouldFilter ? filter.lines : lines,
    searchText,
    searchInput,
    setSearchInput,
    shouldFilter,
    toggleShouldFilter,
    resultCount,
    resultIndex,
    resultIndexStep,
    resultLine: searchResult?.lineNumber,
    resultLineIndex: searchResult?.lineIndex,
  };
}
