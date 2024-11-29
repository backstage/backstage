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
import * as colors from '@material-ui/core/colors';

export const HEADER_SIZE = 40;

/** @public Class keys for overriding LogViewer styles */
export type LogViewerClassKey =
  | 'root'
  | 'header'
  | 'log'
  | 'line'
  | 'lineSelected'
  | 'lineCopyButton'
  | 'lineNumber'
  | 'textHighlight'
  | 'textSelectedHighlight'
  | 'modifierBold'
  | 'modifierItalic'
  | 'modifierUnderline'
  | 'modifierForegroundBlack'
  | 'modifierForegroundRed'
  | 'modifierForegroundGreen'
  | 'modifierForegroundYellow'
  | 'modifierForegroundBlue'
  | 'modifierForegroundMagenta'
  | 'modifierForegroundCyan'
  | 'modifierForegroundWhite'
  | 'modifierForegroundGrey'
  | 'modifierBackgroundBlack'
  | 'modifierBackgroundRed'
  | 'modifierBackgroundGreen'
  | 'modifierBackgroundYellow'
  | 'modifierBackgroundBlue'
  | 'modifierBackgroundMagenta'
  | 'modifierBackgroundCyan'
  | 'modifierBackgroundWhite'
  | 'modifierBackgroundGrey';

export const useStyles = makeStyles(
  theme => ({
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
      fontSize: theme.typography.pxToRem(12),
    },
    line: {
      position: 'relative',
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
    lineCopyButton: {
      position: 'absolute',
      paddingTop: 0,
      paddingBottom: 0,
    },
    lineNumber: {
      display: 'inline-block',
      textAlign: 'end',
      width: 60,
      marginRight: theme.spacing(1),
      cursor: 'pointer',
    },
    textHighlight: {
      background: alpha(theme.palette.info.main, 0.15),
    },
    textSelectedHighlight: {
      background: alpha(theme.palette.info.main, 0.4),
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
  }),
  { name: 'BackstageLogViewer' },
);
