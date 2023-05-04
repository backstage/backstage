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
import Box from '@mui/material/Box';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import React, { ReactNode, useContext, useEffect, useState } from 'react';

import {
  SidebarConfigContext,
  SidebarItemWithSubmenuContext,
  SubmenuConfig,
} from './config';
import { useSidebarOpenState } from './SidebarOpenStateContext';

const useStyles = makeStyles<{ left: number; submenuConfig: SubmenuConfig }>({
  name: 'BackstageSidebarSubmenu',
})((theme, { left, submenuConfig }) => ({
  drawer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    position: 'fixed',
    [theme.breakpoints.up('sm')]: {
      marginLeft: left,
      transition: theme.transitions.create('margin-left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shortest,
      }),
    },
    top: 0,
    bottom: 0,
    padding: 0,
    background: theme.palette.navigation.submenu?.background ?? '#404040',
    overflowX: 'hidden',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    cursor: 'default',
    width: submenuConfig.drawerWidthClosed,
    transitionDelay: `${submenuConfig.defaultOpenDelayMs}ms`,
    '& > *': {
      flexShrink: 0,
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  drawerOpen: {
    width: submenuConfig.drawerWidthOpen,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      position: 'relative',
      paddingLeft: theme.spacing(3),
      left: 0,
      top: 0,
    },
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.common.white,
    padding: theme.spacing(2.5),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

/**
 * Holds a title for text Header of a sidebar submenu and children
 * components to be rendered inside SidebarSubmenu
 *
 * @public
 */
export type SidebarSubmenuProps = {
  title?: string;
  children: ReactNode;
};

/**
 * Used inside SidebarItem to display an expandable Submenu
 *
 * @public
 */
export const SidebarSubmenu = (props: SidebarSubmenuProps) => {
  const { isOpen } = useSidebarOpenState();
  const { sidebarConfig, submenuConfig } = useContext(SidebarConfigContext);
  const left = isOpen
    ? sidebarConfig.drawerWidthOpen
    : sidebarConfig.drawerWidthClosed;
  const { classes, cx } = useStyles({ left, submenuConfig });

  const { isHoveredOn } = useContext(SidebarItemWithSubmenuContext);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  useEffect(() => {
    setIsSubmenuOpen(isHoveredOn);
  }, [isHoveredOn]);

  return (
    <Box
      className={cx(classes.drawer, {
        [classes.drawerOpen]: isSubmenuOpen,
      })}
    >
      <Typography variant="h5" className={classes.title}>
        {props.title}
      </Typography>
      {props.children}
    </Box>
  );
};
