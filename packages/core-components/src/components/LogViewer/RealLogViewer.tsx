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

import { Copy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, VariableSizeList } from 'react-window';

import { AnsiLine, AnsiProcessor } from './AnsiProcessor';
import { LogLine } from './LogLine';
import { LogViewerControls } from './LogViewerControls';
import { HEADER_SIZE, logViewerStyles } from './styles';
import { useLogViewerSearch } from './useLogViewerSearch';
import { useLogViewerSelection } from './useLogViewerSelection';

export interface RealLogViewerProps {
  text: string;
  textWrap?: boolean;
  classes?: { root?: string };
}

export function RealLogViewer(props: RealLogViewerProps) {
  // Merge base Tailwind styles with any custom root class override using cn()
  const classes = useMemo(
    () => ({
      ...logViewerStyles,
      ...(props.classes?.root
        ? { root: cn(logViewerStyles.root, props.classes.root) }
        : {}),
    }),
    [props.classes],
  );
  const [listInstance, setListInstance] = useState<
    VariableSizeList<AnsiLine[]> | FixedSizeList<AnsiLine[]> | null
  >(null);
  const shouldTextWrap = props.textWrap ?? false;
  const heights = useRef<{ [key: number]: number }>({});

  // The processor keeps state that optimizes appending to the text
  const processor = useMemo(() => new AnsiProcessor(), []);
  const lines = processor.process(props.text);
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
    toast('Lines copied to clipboard', { duration: 3000 });
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
            <div
              style={{ ...style }}
              className={cn(
                classes.line,
                selection.isSelected(lineNumber) && classes.lineSelected,
              )}
            >
              {selection.shouldShowCopyButton(lineNumber) && (
                <Button
                  data-testid="copy-button"
                  variant="ghost"
                  size="icon"
                  className={cn('h-5 w-5', classes.lineCopyButton)}
                  onClick={() => handleCopySelection(lineNumber)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
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
            </div>
          );
        };

        return (
          <div style={{ width, height }} className={classes.root}>
            <div className={classes.header}>
              <LogViewerControls {...search} />
            </div>
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
          </div>
        );
      }}
    </AutoSizer>
  );
}
