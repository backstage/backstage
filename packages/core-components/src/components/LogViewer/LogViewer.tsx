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

import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { AnsiProcessor } from './AnsiProcessor';
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
    color: colors.common.black,
  },
  modifierBackgroundRed: {
    color: colors.red[500],
  },
  modifierBackgroundGreen: {
    color: colors.green[500],
  },
  modifierBackgroundYellow: {
    color: colors.yellow[500],
  },
  modifierBackgroundBlue: {
    color: colors.blue[500],
  },
  modifierBackgroundMagenta: {
    color: colors.purple[500],
  },
  modifierBackgroundCyan: {
    color: colors.cyan[500],
  },
  modifierBackgroundWhite: {
    color: colors.common.white,
  },
  modifierBackgroundGrey: {
    color: colors.grey[500],
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

export function LogViewer(props: LogViewerProps) {
  const { noLineNumbers } = props;
  const classes = useStyles();
  const [selectedLine, setSelectedLine] = useState<number>();
  const [filter, setFilter] = useState('');

  // The processor keeps state that optimizes appending to the text
  const processor = useMemo(() => new AnsiProcessor(), []);
  const lines = processor.process(props.text);

  const filteredLines = useMemo(() => {
    if (!filter) {
      return lines;
    }
    return lines.filter(line => line.text.includes(filter));
  }, [lines, filter]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ width, height }} className={classes.root}>
          <div className={classes.header}>
            <TextField
              size="small"
              variant="standard"
              placeholder="Search"
              value={filter}
              onChange={e => setFilter(e.target.value)}
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
              const { chunks, lineNumber } = data[index];
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
                  {chunks.map(({ text, modifiers }, i) => (
                    <span
                      key={i}
                      className={getModifierClasses(classes, modifiers)}
                    >
                      {text}
                    </span>
                  ))}
                </div>
              );
            }}
          </FixedSizeList>
        </div>
      )}
    </AutoSizer>
  );
}
