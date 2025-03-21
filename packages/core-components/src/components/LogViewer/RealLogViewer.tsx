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

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopy';
import classnames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';

import { AnsiLine, AnsiProcessor } from './AnsiProcessor';
import { LogLine } from './LogLine';
import { LogViewerControls } from './LogViewerControls';
import { HEADER_SIZE, useStyles } from './styles';
import { useLogViewerSearch } from './useLogViewerSearch';
import { useLogViewerSelection } from './useLogViewerSelection';

export interface RealLogViewerProps {
  text: string;
  classes?: { root?: string };
}

export function RealLogViewer(props: RealLogViewerProps) {
  const classes = useStyles({ classes: props.classes });
  const [fixedListInstance, setFixedListInstance] = useState<FixedSizeList<
    AnsiLine[]
  > | null>(null);

  // The processor keeps state that optimizes appending to the text
  const processor = useMemo(() => new AnsiProcessor(), []);
  const lines = processor.process(props.text);

  const search = useLogViewerSearch(lines);
  const selection = useLogViewerSelection(lines);
  const location = useLocation();

  useEffect(() => {
    if (fixedListInstance) {
      fixedListInstance.scrollToItem(lines.length - 1, 'end');
    }
  }, [fixedListInstance, lines]);

  useEffect(() => {
    if (!fixedListInstance) {
      return;
    }
    if (search.resultLine) {
      fixedListInstance.scrollToItem(search.resultLine - 1, 'center');
    } else {
      fixedListInstance.scrollToItem(lines.length - 1, 'end');
    }
  }, [fixedListInstance, search.resultLine, lines]);

  useEffect(() => {
    if (location.hash) {
      // #line-6 -> 6
      const line = parseInt(location.hash.replace(/\D/g, ''), 10);
      selection.setSelection(line, false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectLine = (
    line: number,
    event: { shiftKey: boolean; preventDefault: () => void },
  ) => {
    selection.setSelection(line, event.shiftKey);
  };

  return (
    <AutoSizer>
      {({ height, width }: { height?: number; width?: number }) => (
        <Box style={{ width, height }} className={classes.root}>
          <Box className={classes.header}>
            <LogViewerControls {...search} />
          </Box>
          <FixedSizeList
            ref={(instance: FixedSizeList<AnsiLine[]>) => {
              setFixedListInstance(instance);
            }}
            className={classes.log}
            height={(height || 480) - HEADER_SIZE}
            width={width || 640}
            itemData={search.lines}
            itemSize={20}
            itemCount={search.lines.length}
          >
            {({ index, style, data }) => {
              const line = data[index];
              const { lineNumber } = line;
              return (
                <Box
                  style={{ ...style }}
                  className={classnames(classes.line, {
                    [classes.lineSelected]: selection.isSelected(lineNumber),
                  })}
                >
                  {selection.shouldShowButton(lineNumber) && (
                    <IconButton
                      data-testid="copy-button"
                      size="small"
                      className={classes.lineCopyButton}
                      onClick={() => selection.copySelection()}
                    >
                      <CopyIcon fontSize="inherit" />
                    </IconButton>
                  )}
                  <a
                    role="row"
                    target="_self"
                    href={`#line-${lineNumber}`}
                    className={classes.lineNumber}
                    onClick={event => handleSelectLine(lineNumber, event)}
                    onKeyPress={event => handleSelectLine(lineNumber, event)}
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
                </Box>
              );
            }}
          </FixedSizeList>
        </Box>
      )}
    </AutoSizer>
  );
}
