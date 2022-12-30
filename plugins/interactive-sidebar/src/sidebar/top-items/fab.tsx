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

import React from 'react';

import { Link } from '@backstage/core-components';
import {
  BackstageTheme,
  combineClasses,
} from '@backstage/plugin-interactive-drawers';

import { createStyles, makeStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

export const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    topItem: {
      marginLeft: 8,
      backgroundColor: theme.sidebarBackgroundColor,
      color: theme.sidebarTextColor,
      borderRadius: '38%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: theme.sidebarBorderColor,
      overflow: 'hidden',
      '& *': {
        // The profile picture shouldn't be round inside a non-round button
        borderRadius: 0,
      },
      '&:hover': {
        borderColor: 'transparent',
        backgroundColor: theme.sidebarSelectableBackgroundColor,
      },
      '&:not(:hover)': {
        boxShadow: 'none',
      },
    },
    topItemSelected: {
      backgroundColor: theme.sidebarTextColor,
      color: theme.sidebarBackgroundColor,
    },
    topItemTiny: {
      marginLeft: 0,
      marginRight: 8,
      width: 30,
      height: 30,
      minHeight: 30,
      borderRadius: '30%',
    },
  }),
);

export interface TopItemFabProps {
  to?: string;
  selected?: boolean;
  tiny?: boolean;
  icon: React.ReactElement;
  title?: string;
  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;
}

export const TopItemFab = ({
  to,
  selected,
  tiny,
  icon,
  title,
  onClick,
}: TopItemFabProps) => {
  const { topItem, topItemSelected, topItemTiny } = useStyles();

  const wrapLink = (children: JSX.Element) =>
    !to ? children : <Link to={to}>{children}</Link>;

  return wrapLink(
    <Tooltip title={title ?? ''}>
      <Fab
        size="small"
        className={combineClasses(
          topItem,
          tiny ? topItemTiny : '',
          selected ? topItemSelected : '',
        )}
        onClick={onClick}
      >
        {icon}
      </Fab>
    </Tooltip>,
  );
};
