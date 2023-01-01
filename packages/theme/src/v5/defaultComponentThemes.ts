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

import { darken, lighten, ThemeOptions } from '@mui/material/styles';

/**
 * A helper for creating theme overrides.
 *
 * @public
 */
export const defaultComponentThemes: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: theme => ({
      html: {
        height: '100%',
        fontFamily: theme.typography.fontFamily,
      },
      body: {
        height: '100%',
        fontFamily: theme.typography.fontFamily,
        overscrollBehaviorY: 'none',
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
    }),
  },
  MuiGrid: {
    defaultProps: {
      spacing: 2,
    },
  },
  MuiSwitch: {
    defaultProps: {
      color: 'primary',
    },
  },
  MuiTableRow: {
    styleOverrides: {
      // Alternating row backgrounds
      root: ({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      }),
      // Use pointer for hoverable rows
      hover: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      // Alternating head backgrounds
      head: ({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.paper,
        },
      }),
    },
  },
  // Tables are more dense than default mui tables
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        wordBreak: 'break-word',
        overflow: 'hidden',
        verticalAlign: 'middle',
        lineHeight: '1',
        margin: 0,
        padding: theme.spacing(3, 2, 3, 2.5),
        borderBottom: 0,
      }),
      sizeSmall: ({ theme }) => ({
        padding: theme.spacing(1.5, 2, 1.5, 2.5),
      }),
      head: ({ theme }) => ({
        wordBreak: 'break-word',
        overflow: 'hidden',
        color: theme.palette.textSubtle,
        fontWeight: 'normal',
        lineHeight: '1',
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      // Tabs are smaller than default mui tab rows
      root: {
        minHeight: 24,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      // Tabs are smaller and have a hover background
      root: ({ theme }) => ({
        color: theme.palette.link,
        minHeight: 24,
        textTransform: 'initial',
        letterSpacing: '0.07em',
        '&:hover': {
          color: darken(theme.palette.link, 0.3),
          background: lighten(theme.palette.link, 0.95),
        },
        [theme.breakpoints.up('md')]: {
          minWidth: 120,
          fontSize: theme.typography.pxToRem(14),
          fontWeight: 500,
        },
      }),
      textColorPrimary: ({ theme }) => ({
        color: theme.palette.link,
      }),
    },
  },
  MuiTableSortLabel: {
    styleOverrides: {
      // No color change on hover, just rely on the arrow showing up instead.
      root: {
        color: 'inherit',
        '&:hover': {
          color: 'inherit',
        },
        '&:focus': {
          color: 'inherit',
        },
        // Bold font for highlighting selected column
        '&.Mui-active': {
          fontWeight: 'bold',
          color: 'inherit',
        },
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      dense: {
        // Default dense list items to adding ellipsis for really long str...
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      text: {
        // Text buttons have less padding by default, but we want to keep the original padding
        padding: undefined,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#D9D9D9',
        // By default there's no margin, but it's usually wanted, so we add some trailing margin
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        color: theme.palette.grey[900],
      }),
      outlined: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
      label: ({ theme }) => ({
        lineHeight: theme.spacing(2.5),
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.spacing(1.75),
      }),
      labelSmall: ({ theme }) => ({
        fontSize: theme.spacing(1.5),
      }),
      deleteIcon: ({ theme }) => ({
        color: theme.palette.grey[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
        margin: `0 ${theme.spacing(0.75)}px 0 -${theme.spacing(0.75)}`,
      }),
      deleteIconSmall: ({ theme }) => ({
        width: theme.spacing(2),
        height: theme.spacing(2),
        margin: `0 ${theme.spacing(0.5)}px 0 -${theme.spacing(0.5)}`,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        // When cards have a forced size, such as when they are arranged in a
        // CSS grid, the content needs to flex such that the actions (buttons
        // etc) end up at the bottom of the card instead of just below the body
        // contents.
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        // Reduce padding between header and content
        paddingBottom: 0,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        // When cards have a forced size, such as when they are arranged in a
        // CSS grid, the content needs to flex such that the actions (buttons
        // etc) end up at the bottom of the card instead of just below the body
        // contents.
        flexGrow: 1,
        '&:last-child': {
          paddingBottom: undefined,
        },
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        // We default to putting the card actions at the end
        justifyContent: 'flex-end',
      },
    },
  },
};
