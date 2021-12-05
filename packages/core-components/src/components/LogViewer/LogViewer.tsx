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
import { AnsiProcessor } from './AnsiProcessor';
import { HEADER_SIZE, useStyles } from './styles';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import { LogLine } from './LogLine';

export interface LogViewerProps {
  text: string;
  noLineNumbers?: boolean;
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

export function LogViewer(props: LogViewerProps) {
  const { noLineNumbers } = props;
  const listRef = useRef<FixedSizeList | null>(null);
  const classes = useStyles();
  const [selectedLine, setSelectedLine] = useState<number>();
  const [searchInput, setSearchInput] = useState('');
  const searchText = searchInput.toLocaleLowerCase('en-US');

  // The processor keeps state that optimizes appending to the text
  const processor = useMemo(() => new AnsiProcessor(), []);
  const lines = processor.process(props.text);

  const filteredLines = useMemo(() => {
    if (!searchText) {
      return lines;
    }
    const matchingLines = [];
    const searchResults = [];
    for (const line of lines) {
      if (line.text.includes(searchText)) {
        matchingLines.push(line);

        const lineResults = [];
        let offset = 0;
        for (;;) {
          const start = line.text.indexOf(searchText, offset);
          if (start === -1) {
            break;
          }
          const end = start + searchText.length;
          lineResults.push({ start, end });
          offset = end;
        }
        searchResults.push(lineResults);
      }
    }
    return lines.filter(line => line.text.includes(searchText));
  }, [lines, searchText]);

  const [foundLine] = filteredLines;
  const scrollToLineNumber = foundLine?.lineNumber;

  useEffect(() => {
    if (scrollToLineNumber !== undefined && listRef.current) {
      listRef.current.scrollToItem(scrollToLineNumber - 1, 'center');
    }
  }, [scrollToLineNumber]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ width, height }} className={classes.root}>
          <div className={classes.header}>
            <TextField
              size="small"
              variant="standard"
              placeholder="Search"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <FixedSizeList
            ref={listRef}
            className={classes.log}
            height={height - HEADER_SIZE}
            width={width}
            itemData={lines}
            itemSize={20}
            itemCount={lines.length}
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
                  {!noLineNumbers && (
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
                  )}
                  <LogLine
                    line={line}
                    classes={classes}
                    searchText={searchText}
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
