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
import { makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { PropsWithChildren, ReactNode, useContext } from 'react';
import {
  ItemWithSubmenuContext,
  sidebarConfig,
  SidebarContext,
  submenuConfig,
} from './config';
import { BackstageTheme } from '@backstage/theme';

const useStyles = (props: { left: number }) =>
  makeStyles<BackstageTheme>(theme => ({
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
      left: props.left,
      top: 0,
      bottom: 0,
      padding: 0,
      background: theme.palette.navigation.submenu.background,
      overflowX: 'hidden',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      cursor: 'default',
      width: submenuConfig.drawerWidthClosed,
      borderRight: `1px solid #383838`,
      '& > *': {
        flexShrink: 0,
      },
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    drawerOpen: {
      width: submenuConfig.drawerWidthOpen,
    },
    title: {
      fontSize: 24,
      fontWeight: 500,
      color: '#FFF',
      padding: 20,
    },
  }));

type SubmenuProps = {
  title?: string;
  children: ReactNode;
};
export const Submenu = ({
  title,
  children,
}: PropsWithChildren<SubmenuProps>) => {
  const { isOpen } = useContext(SidebarContext);
  const left = isOpen
    ? sidebarConfig.drawerWidthOpen
    : sidebarConfig.drawerWidthClosed;
  const props = { left: left };
  const classes = useStyles(props)();

  const { isHoveredOn } = useContext(ItemWithSubmenuContext);
  return (
    <div
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: isHoveredOn,
      })}
    >
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      {children}
    </div>
  );
};
