/*
 * Copyright 2022 The Backstage Authors
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

import { makeStyles } from '@material-ui/core';
import type lightHue from '@material-ui/core/colors/blueGrey';

import { BackstageTheme as CoreBackstageTheme } from '@backstage/theme';

export type BackstageTheme = CoreBackstageTheme & {
  // darkMode: boolean;
  accentColor: Record<
    Exclude<keyof typeof lightHue, 'A100' | 'A200' | 'A400' | 'A700'>,
    string
  >;
  sidebarBackgroundColor: string;
  sidebarTextColor: string;
  sidebarTextDimmedColor: string;
  sidebarSelectionBackgroundColor: string;
  sidebarSelectableBackgroundColor: string;
  // sidebarAnchorTextColor: string;
  // sidebarAnchorHoverTextColor: string;
  sidebarBorderColor: string;
  sidebarSecondSidebarBackgroundColor: string;
  sidebarSecondSidebarBackdropFilter: string;
};

const expandButtonSize = 24;

export const useStyles = makeStyles((theme: BackstageTheme) => ({
  coreItem: {
    position: 'relative',
    display: 'flex',
    fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
    fontSize: '0.875rem',
    height: 28,
    lineHeight: '28px',
    width: '100%',
    paddingRight: 12,
    userSelect: 'none',
    overflowX: 'hidden',
    letterSpacing: 0,

    // Non-selected:
    color: theme.sidebarTextDimmedColor,

    '& > :not($coreItemText)': {
      flex: '0 0 auto',
    },
    '& > $coreItemText': {
      flex: 'auto',
    },
  },
  coreItemText: {
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  itemHighlight: {
    color: theme.sidebarTextColor,
    fontWeight: 'bold',
  },
  itemSelected: {
    backgroundColor: theme.sidebarSelectionBackgroundColor,
    color: theme.sidebarBackgroundColor,
  },
  itemInDrawer: {
    '&:not($itemSelected)': {
      backgroundColor: theme.sidebarSelectableBackgroundColor,
    },
    '& > $expandButton': {
      display: 'initial',
    },
  },
  itemSelectable: {
    '&:hover': {
      backgroundColor: theme.sidebarSelectableBackgroundColor,
    },
  },
  expandButton: {
    margin: 0,
    width: expandButtonSize,
    height: expandButtonSize,
    minHeight: expandButtonSize,
    borderRadius: '30%',
    marginTop: 2,
    marginLeft: 4,
    lineHeight: 0,
    backgroundColor: theme.accentColor[300], // '#7a7a7a',
    display: 'none',
    '& svg': {
      width: expandButtonSize - 4,
      height: expandButtonSize - 4,
    },
    '&:hover': {
      backgroundColor: theme.accentColor[800],
    },
    '&:not(:hover)': {
      boxShadow: 'none',
    },
  },
  pinnedItemStyle: {
    paddingLeft: 10,
    '&:hover > $expandButton': {
      display: 'initial',
    },
  },
  pinnedItemIcon: {
    display: 'inline-block',
    width: 28,
    height: 28,
    lineHeight: '28px',
    '& > svg': {
      verticalAlign: 'sub',
    },
  },
}));

// Combine class names and allow undefined
export function combineClasses(...classes: (string | undefined)[]) {
  return classes
    .filter(v => v)
    .join(' ')
    .replace(/ +/g, ' ');
}
