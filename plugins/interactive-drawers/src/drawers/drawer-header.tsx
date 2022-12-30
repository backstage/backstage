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

import { Fab, makeStyles, Tooltip, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { BackstageTheme, combineClasses } from '../ui/styles';

import { useDrawer } from '../contexts';
import { useDrawerTitleByPath } from '../hooks';

export interface DrawerHeaderProps {
  hide: () => void;
  path: string | undefined;
}

const useHeaderStyles = makeStyles<BackstageTheme>(theme => ({
  bar: {
    display: 'grid',
    gridTemplateColumns: '44px 1fr 44px',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.sidebarBorderColor}`,
    backgroundColor: '#ffffff80',
  },
  button: {
    margin: 4,
    width: 36,
    height: 36,
    backgroundColor: theme.sidebarSelectableBackgroundColor,
    borderRadius: 4,
    boxShadow: 'none',
  },
  title: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleForPath: {
    direction: 'rtl',
    textAlign: 'left',
  },
}));

export function DrawerHeader({ hide, path }: DrawerHeaderProps) {
  const headerStyles = useHeaderStyles();

  const { drawer } = useDrawer();
  const { title } = drawer;
  const drawerTitle = useDrawerTitleByPath(path);
  const titleText = title || drawerTitle;

  const isPath = !drawerTitle;

  const titleClasses = combineClasses(
    headerStyles.title,
    isPath ? headerStyles.titleForPath : undefined,
  );

  return (
    <div className={headerStyles.bar}>
      <div>
        <Tooltip title="Fold back this drawer">
          <Fab
            onClick={hide}
            size="small"
            color="secondary"
            aria-label="add"
            className={headerStyles.button}
          >
            <ChevronLeftIcon />
          </Fab>
        </Tooltip>
      </div>
      <Typography className={titleClasses} variant="h6">
        <Tooltip title={titleText}>
          <span>{titleText}</span>
        </Tooltip>
      </Typography>
      <div>
        {!path ? null : (
          <Tooltip title="Navigate to this page">
            <Link to={path}>
              <Fab
                size="small"
                color="secondary"
                aria-label="add"
                className={headerStyles.button}
              >
                <ExitToAppIcon />
              </Fab>
            </Link>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
