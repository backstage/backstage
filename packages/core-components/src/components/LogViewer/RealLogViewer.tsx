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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, VariableSizeList } from 'react-window';

import { AnsiLine, AnsiProcessor } from './AnsiProcessor';
import { LogLine } from './LogLine';
import { LogViewerControls } from './LogViewerControls';
import { HEADER_SIZE, useStyles } from './styles';
import { useLogViewerSearch } from './useLogViewerSearch';
import { useLogViewerSelection } from './useLogViewerSelection';
import Snackbar from '@material-ui/core/Snackbar';

export interface RealLogViewerProps {
  text: string;
  textWrap?: boolean;
  classes?: { root?: string };
}

export function RealLogViewer(props: RealLogViewerProps) {
  const classes = useStyles({ classes: props.classes });
  const [listInstance, setListInstance] = useState<
    VariableSizeList<AnsiLine[]> | FixedSizeList<AnsiLine[]> | null
  >(null);
  const shouldTextWrap = props.textWrap ?? false;
  const heights = useRef<{ [key: number]: number }>({});

  // The processor keeps state that optimizes appending to the text
  const processor = useMemo(() => new AnsiProcessor(), []);
  const lines = processor.process(props.text);
  const [showCopyInfo, setShowCopyInfo] = useState(false);

  const search = useLogViewerSearch(lines);
  const selection = useLogViewerSelection(lines);
  const location = useLocation();

  useEffect(() => {
    if (listInstance) {
      listInstance.scrollToItem(lines.length - 1, 'end');
    }
  }, [listInstance, lines]);

  useEffect(() => {
    if (!listInstance) {
      return;
    }
    if (search.resultLine) {
      listInstance.scrollToItem(search.resultLine - 1, 'center');
    } else {
      listInstance.scrollToItem(lines.length - 1, 'end');
    }
  }, [listInstance, search.resultLine, lines]);

  useEffect(() => {
    const hash = selection.getHash();
    if (hash.length > 0) {
      history.replaceState(null, '', hash);
    }
  }, [selection]);

  useEffect(() => {
    if (location.hash) {
      selection.selectAll(location.hash);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectLine = (
    line: number,
    event: {
      shiftKey: boolean;
      metaKey: boolean;
      ctrlKey: boolean;
      preventDefault: () => void;
    },
  ) => {
    event.preventDefault();
    selection.setSelection(
      line,
      event.shiftKey,
      event.metaKey || event.ctrlKey,
    );
  };

  const handleCopySelection = (line: number) => {
    selection.copySelection(line);
    setShowCopyInfo(true);
  };

  function setRowHeight(index: number, size: number) {
    if (shouldTextWrap && listInstance) {
      (listInstance as VariableSizeList<AnsiLine[]>).resetAfterIndex(0);
      // lineNumber is 1-based but index is 0-based
      heights.current[index - 1] = size;
    }
  }

  function getRowHeight(index: number) {
    return heights.current[index] || 20;
  }

  return (
    <>
      <AutoSizer>
        {({ height, width }: { height?: number; width?: number }) => {
          const commonProps = {
            ref: setListInstance,
            className: classes.log,
            height: (height || 480) - HEADER_SIZE,
            width: width || 640,
            itemData: search.lines,
            itemCount: search.lines.length,
          };

          const renderItem = ({
            index,
            style,
            data,
          }: {
            index: number;
            style: React.CSSProperties;
            data: AnsiLine[];
          }) => {
            const line = data[index];
            const { lineNumber } = line;
            return (
              <Box
                style={{ ...style }}
                className={classnames(classes.line, {
                  [classes.lineSelected]: selection.isSelected(lineNumber),
                })}
              >
                {selection.shouldShowCopyButton(lineNumber) && (
                  <IconButton
                    data-testid="copy-button"
                    size="small"
                    className={classes.lineCopyButton}
                    onClick={() => handleCopySelection(lineNumber)}
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
                  setRowHeight={shouldTextWrap ? setRowHeight : undefined}
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
          };

          return (
            <Box style={{ width, height }} className={classes.root}>
              <Box className={classes.header}>
                <LogViewerControls {...search} />
              </Box>
              {shouldTextWrap ? (
                <VariableSizeList<AnsiLine[]>
                  {...commonProps}
                  itemSize={getRowHeight}
                >
                  {renderItem}
                </VariableSizeList>
              ) : (
                <FixedSizeList<AnsiLine[]> {...commonProps} itemSize={20}>
                  {renderItem}
                </FixedSizeList>
              )}
            </Box>
          );
        }}
      </AutoSizer>
      <Snackbar
        open={showCopyInfo}
        autoHideDuration={3000}
        onClose={() => setShowCopyInfo(false)}
        message="Lines copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
