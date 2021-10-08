/*
 * Copyright 2020 The Backstage Authors
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

import { makeStyles, useMediaQuery } from '@material-ui/core';
import clsx from 'clsx';
import React, {
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from 'react';
import { sidebarConfig, SidebarContext } from './config';
import { BackstageTheme } from '@backstage/theme';
import { SidebarPinStateContext } from './Page';
import DoubleArrowRight from './icons/DoubleArrowRight';
import DoubleArrowLeft from './icons/DoubleArrowLeft';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    zIndex: 1000,
    position: 'relative',
    overflow: 'visible',
    width: theme.spacing(7) + 1,
  },
  drawer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    padding: 0,
    background: theme.palette.navigation.background,
    overflowX: 'hidden',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    width: sidebarConfig.drawerWidthClosed,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shortest,
    }),
    '& > *': {
      flexShrink: 0,
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  drawerOpen: {
    width: sidebarConfig.drawerWidthOpen,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
  expandButton: {
    background: 'none',
    border: 'none',
    color: theme.palette.navigation.color,
    width: '100%',
    cursor: 'pointer',
    position: 'relative',
    height: 48,
  },
  arrows: {
    position: 'absolute',
    right: 10,
  },
}));

export function Sidebar({ children }: PropsWithChildren<{}>) {
  const classes = useStyles();

  const { isPinned } = useContext(SidebarPinStateContext);
  const [isOpen, setIsOpen] = useState(isPinned);

  useEffect(() => {
    if (isPinned) {
      setIsOpen(true);
    }
  }, [isPinned]);

  return (
    <div className={classes.root} data-testid="sidebar-root">
      <SidebarContext.Provider
        value={{
          isOpen,
          setIsOpen,
        }}
      >
        <div
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isOpen,
          })}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    </div>
  );
}

export const SidebarExpandButton = () => {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );
  const { isPinned } = useContext(SidebarPinStateContext);
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  const openDelayMs = sidebarConfig.defaultOpenDelayMs;
  const closeDelayMs = sidebarConfig.defaultCloseDelayMs;

  const handleClick = () => {
    if (isPinned || isSmallScreen) {
      return;
    }
    const delayMs = isOpen ? openDelayMs : closeDelayMs;
    setTimeout(async () => {
      setIsOpen(!isOpen);
    }, delayMs);
  };

  if (isSmallScreen || isPinned) {
    return null;
  }

  return (
    <button onClick={handleClick} className={classes.expandButton}>
      <div className={classes.arrows}>
        {isOpen ? <DoubleArrowLeft /> : <DoubleArrowRight />}
      </div>
    </button>
  );
};
