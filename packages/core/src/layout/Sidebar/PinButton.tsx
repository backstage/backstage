/*
 * Copyright 2020 Spotify AB
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

import React, { FC, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { SidebarContext } from './config';
import { BackstageTheme } from '@backstage/theme';
import { SidebarPinStateContext } from './Page';

const ARROW_BUTTON_SIZE = 20;
const useStyles = makeStyles<BackstageTheme, { isPinned: boolean }>(theme => {
  return {
    root: {
      position: 'relative',
      alignSelf: 'stretch',
    },
    arrowButtonWrapper: {
      position: 'absolute',
      right: 0,
      width: ARROW_BUTTON_SIZE,
      height: ARROW_BUTTON_SIZE,
      top: -(theme.spacing(6) + ARROW_BUTTON_SIZE) / 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '2px 0px 0px 2px',
      background: theme.palette.pinSidebarButton.background,
      color: theme.palette.pinSidebarButton.icon,
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
    },
    arrowButtonIcon: {
      transform: ({ isPinned }) => (isPinned ? 'rotate(180deg)' : 'none'),
    },
  };
});

export const SidebarPinButton: FC<{}> = () => {
  const { isOpen } = useContext(SidebarContext);
  const { isPinned, toggleSidebarPinState } = useContext(
    SidebarPinStateContext,
  );
  const classes = useStyles({ isPinned });

  return (
    <div className={classes.root}>
      {isOpen && (
        <button
          className={classes.arrowButtonWrapper}
          onClick={toggleSidebarPinState}
        >
          <DoubleArrowIcon
            className={classes.arrowButtonIcon}
            style={{ fontSize: 14 }}
          />
        </button>
      )}
    </div>
  );
};
