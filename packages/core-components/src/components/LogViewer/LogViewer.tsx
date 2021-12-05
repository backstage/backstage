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
import { LogLine } from './LogLine';
import { LogViewerControls } from './LogViewerControls';
import { useLogViewerSearch } from './useLogViewerSearch';

export interface LogViewerProps {
  text: string;
}

export function LogViewer(props: LogViewerProps) {
  const classes = useStyles();
  const listRef = useRef<FixedSizeList | null>(null);
  const [selectedLine, setSelectedLine] = useState<number>();

  // The processor keeps state that optimizes appending to the text
  const processor = useMemo(() => new AnsiProcessor(), []);
  const lines = processor.process(props.text);

  const search = useLogViewerSearch(lines);

  useEffect(() => {
    if (search.resultLine !== undefined && listRef.current) {
      listRef.current.scrollToItem(search.resultLine - 1, 'center');
    }
  }, [search.resultLine]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ width, height }} className={classes.root}>
          <div className={classes.header}>
            <LogViewerControls {...search} />
          </div>
          <FixedSizeList
            ref={listRef}
            className={classes.log}
            height={height - HEADER_SIZE}
            width={width}
            itemData={search.lines}
            itemSize={20}
            itemCount={search.lines.length}
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
                    searchText={search.searchText}
                    highlightResultIndex={
                      search.resultLine === lineNumber
                        ? search.resultLineIndex
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
