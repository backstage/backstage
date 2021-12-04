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

import { alpha, makeStyles } from '@material-ui/core/styles';
import React, { useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { AnsiChunk, AnsiLine, AnsiProcessor } from './AnsiProcessor';
import startCase from 'lodash/startCase';
import * as colors from '@material-ui/core/colors';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';

const HEADER_SIZE = 40;

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

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
  },
  header: {
    height: HEADER_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  log: {
    fontFamily: '"Monaco", monospace',
    fontSize: theme.typography.fontSize,
  },
  line: {
    whiteSpace: 'pre',

    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  lineSelected: {
    background: theme.palette.action.selected,

    '&:hover': {
      background: theme.palette.action.selected,
    },
  },
  lineNumber: {
    display: 'inline-block',
    textAlign: 'end',
    width: 60,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
  },
  textHighlight: {
    background: alpha(theme.palette.primary.main, 0.3),
  },
  modifierBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  modifierItalic: {
    fontStyle: 'italic',
  },
  modifierUnderline: {
    textDecoration: 'underline',
  },
  modifierForegroundBlack: {
    color: colors.common.black,
  },
  modifierForegroundRed: {
    color: colors.red[500],
  },
  modifierForegroundGreen: {
    color: colors.green[500],
  },
  modifierForegroundYellow: {
    color: colors.yellow[500],
  },
  modifierForegroundBlue: {
    color: colors.blue[500],
  },
  modifierForegroundMagenta: {
    color: colors.purple[500],
  },
  modifierForegroundCyan: {
    color: colors.cyan[500],
  },
  modifierForegroundWhite: {
    color: colors.common.white,
  },
  modifierForegroundGrey: {
    color: colors.grey[500],
  },
  modifierBackgroundBlack: {
    background: colors.common.black,
  },
  modifierBackgroundRed: {
    background: colors.red[500],
  },
  modifierBackgroundGreen: {
    background: colors.green[500],
  },
  modifierBackgroundYellow: {
    background: colors.yellow[500],
  },
  modifierBackgroundBlue: {
    background: colors.blue[500],
  },
  modifierBackgroundMagenta: {
    background: colors.purple[500],
  },
  modifierBackgroundCyan: {
    background: colors.cyan[500],
  },
  modifierBackgroundWhite: {
    background: colors.common.white,
  },
  modifierBackgroundGrey: {
    background: colors.grey[500],
  },
}));

function getModifierClasses(
  classes: ReturnType<typeof useStyles>,
  modifiers: ChunkModifiers,
) {
  const classNames = new Array<string>();
  if (modifiers.bold) {
    classNames.push(classes.modifierBold);
  }
  if (modifiers.italic) {
    classNames.push(classes.modifierItalic);
  }
  if (modifiers.underline) {
    classNames.push(classes.modifierUnderline);
  }
  if (modifiers.foreground) {
    const key = `modifierForeground${startCase(
      modifiers.foreground,
    )}` as keyof typeof classes;
    classNames.push(classes[key]);
  }
  if (modifiers.background) {
    const key = `modifierBackground${startCase(
      modifiers.background,
    )}` as keyof typeof classes;
    classNames.push(classes[key]);
  }
  return classNames.length > 0 ? classNames.join(' ') : undefined;
}

export function LogLine({
  line,
  classes,
  searchText,
}: {
  line: AnsiLine;
  classes: ReturnType<typeof useStyles>;
  searchText: string;
}) {
  let searchResults: Array<{ start: number; end: number }> | undefined =
    undefined;
  if (searchText && line.text.includes(searchText)) {
    searchResults = [];
    let offset = 0;
    for (;;) {
      const start = line.text.indexOf(searchText, offset);
      if (start === -1) {
        break;
      }
      const end = start + searchText.length;
      searchResults.push({ start, end });
      offset = end;
    }
  }

  const output = new Array<JSX.Element>(line.chunks.length);

  let key = 0;
  let chunkOffset = 0;
  let nextResult = searchResults?.shift();
  for (const { text, modifiers } of line.chunks) {
    if (!nextResult || chunkOffset + text.length < nextResult.start) {
      output.push(
        <span key={key++} className={getModifierClasses(classes, modifiers)}>
          {text}
        </span>,
      );
      chunkOffset += text.length;
      continue;
    }

    let localOffset = 0;
    while (nextResult) {
      let localStart = nextResult.start - chunkOffset;
      if (localStart < 0) {
        localStart = 0;
      }
      const localEnd = nextResult.end - chunkOffset;
      const beforeMatch = text.slice(localOffset, localStart);
      const match = text.slice(localStart, localEnd);

      if (beforeMatch) {
        output.push(
          <span key={key++} className={getModifierClasses(classes, modifiers)}>
            {beforeMatch}
          </span>,
        );
      }
      output.push(
        <span
          key={key++}
          className={clsx(
            getModifierClasses(classes, modifiers),
            classes.textHighlight,
          )}
        >
          {match}
        </span>,
      );

      localOffset = localStart + match.length;

      if (match.length === searchText.length) {
        nextResult = searchResults?.shift();
      } else {
        break;
      }
    }

    if (localOffset < text.length) {
      output.push(
        <span key={key++} className={getModifierClasses(classes, modifiers)}>
          {text.slice(localOffset)}
        </span>,
      );
    }

    chunkOffset += text.length;
  }
  return <>{output}</>;
}

export function LogViewer(props: LogViewerProps) {
  const { noLineNumbers } = props;
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
            className={classes.log}
            height={height - HEADER_SIZE}
            width={width}
            itemData={filteredLines}
            itemSize={20}
            itemCount={filteredLines.length}
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
