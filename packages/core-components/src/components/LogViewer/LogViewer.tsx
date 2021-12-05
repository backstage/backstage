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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { AnsiLine, AnsiProcessor } from './AnsiProcessor';
import { HEADER_SIZE, useStyles } from './styles';
import clsx from 'clsx';
import { LogLine } from './LogLine';
import { LogViewerControls } from './LogViewerControls';
import { useToggle } from 'react-use';

export interface LogViewerProps {
  text: string;
}

export type AnsiColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'grey';

export interface ChunkModifiers {
  foreground?: AnsiColor;
  background?: AnsiColor;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

function applySearchFilter(lines: AnsiLine[], searchText: string) {
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

export function LogViewer(props: LogViewerProps) {
  const classes = useStyles();
  const listRef = useRef<FixedSizeList | null>(null);
  const [selectedLine, setSelectedLine] = useState<number>();
  const [resultIndex, setResultIndex] = useState<number | undefined>();
  const [shouldFilter, toggleShouldFilter] = useToggle(false);
  const [searchInput, setSearchInput] = useState('');
  const searchText = searchInput.toLocaleLowerCase('en-US');

  // The processor keeps state that optimizes appending to the text
  const processor = useMemo(() => new AnsiProcessor(), []);
  const lines = processor.process(props.text);

  const filter = useMemo(
    () => applySearchFilter(lines, searchText),
    [lines, searchText],
  );

  const searchResult = filter.results?.[resultIndex ?? 0];
  const searchResultLine = searchResult?.lineNumber;

  const displayLines = shouldFilter ? filter.lines : lines;

  useEffect(() => {
    if (searchResultLine !== undefined && listRef.current) {
      listRef.current.scrollToItem(searchResultLine - 1, 'center');
    }
  }, [searchResultLine]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ width, height }} className={classes.root}>
          <div className={classes.header}>
            <LogViewerControls
              search={searchInput}
              onSearchChange={setSearchInput}
              resultIndex={resultIndex}
              resultCount={filter.results?.length}
              onResultIndexChange={setResultIndex}
              shouldFilter={shouldFilter}
              onToggleShouldFilter={toggleShouldFilter}
            />
          </div>
          <FixedSizeList
            ref={listRef}
            className={classes.log}
            height={height - HEADER_SIZE}
            width={width}
            itemData={displayLines}
            itemSize={20}
            itemCount={displayLines.length}
          >
            {({ index, style, data }) => {
              const line = data[index];
              const { lineNumber } = line;
              return (
                <div
                  style={{ ...style }}
                  className={clsx(classes.line, {
                    [classes.lineSelected]: selectedLine === lineNumber,
                  })}
                >
                  <a
                    role="row"
                    target="_self"
                    href={`#line-${lineNumber}`}
                    className={classes.lineNumber}
                    onClick={() => setSelectedLine(lineNumber)}
                    onKeyPress={() => setSelectedLine(lineNumber)}
                  >
                    {lineNumber}
                  </a>
                  <LogLine
                    line={line}
                    classes={classes}
                    searchText={searchText}
                    highlightResultIndex={
                      searchResultLine === lineNumber
                        ? searchResult!.lineIndex
                        : undefined
                    }
                  />
                </div>
              );
            }}
          </FixedSizeList>
        </div>
      )}
    </AutoSizer>
  );
}
