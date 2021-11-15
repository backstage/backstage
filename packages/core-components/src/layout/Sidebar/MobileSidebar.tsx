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

import { useElementFilter } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import { orderBy } from 'lodash';
import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { sidebarConfig } from './config';
import { SidebarGroup } from './SidebarGroup';

type MobileSidebarContextType = {
  selectedMenuItemIndex: number;
  setSelectedMenuItemIndex: React.Dispatch<React.SetStateAction<number>>;
};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    position: 'fixed',
    backgroundColor: theme.palette.navigation.background,
    color: theme.palette.navigation.color,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    // SidebarDivider color
    borderTop: '1px solid #383838',
  },

  overlay: {
    background: theme.palette.navigation.background,
    width: '100%',
    flex: '0 1 auto',
    height: `calc(100% - ${sidebarConfig.mobileSidebarHeight}px)`,
    overflow: 'auto',
    position: 'fixed',
    zIndex: 500,
  },

  overlayHeader: {
    display: 'flex',
    color: theme.palette.bursts.fontColor,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },

  overlayHeaderClose: {
    color: theme.palette.bursts.fontColor,
  },
}));

const sortSidebarGroupsForPriority = (children: React.ReactElement[]) =>
  orderBy(
    children,
    ({ props: { priority } }) => (Number.isInteger(priority) ? priority : -1),
    'desc',
  );

const OverlayMenu = ({
  children,
  label = 'Menu',
  onClose,
}: React.PropsWithChildren<{ label?: string; onClose: () => void }>) => {
  const classes = useStyles();

  return (
    <Box className={classes.overlay}>
      <Box className={classes.overlayHeader}>
        <Typography variant="h3">{label}</Typography>
        <IconButton
          onClick={onClose}
          classes={{ root: classes.overlayHeaderClose }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export const MobileSidebarContext = createContext<MobileSidebarContextType>({
  selectedMenuItemIndex: -1,
  setSelectedMenuItemIndex: () => {},
});

export const MobileSidebar = ({ children }: React.PropsWithChildren<{}>) => {
  const classes = useStyles();
  const location = useLocation();
  const [selectedMenuItemIndex, setSelectedMenuItemIndex] =
    useState<number>(-1);

  useEffect(() => {
    setSelectedMenuItemIndex(-1);
  }, [location.pathname]);

  // Filter children for SidebarGroups
  let sidebarGroups = useElementFilter(children, elements =>
    elements
      .getElements()
      .filter(
        child => React.isValidElement(child) && child.type === SidebarGroup,
      ),
  );

  if (!children) {
    // If Sidebar has no children the MobileSidebar won't be rendered
    return null;
  } else if (!sidebarGroups.length) {
    // If Sidebar has no SidebarGroup as a children a default
    // SidebarGroup with the complete Sidebar content will be created
    sidebarGroups.push(
      <SidebarGroup icon={<MenuIcon />}>{children}</SidebarGroup>,
    );
  } else {
    // Sort SidebarGroups for the given Priority
    sidebarGroups = sortSidebarGroupsForPriority(sidebarGroups);
  }

  const shouldShowGroupChildren =
    selectedMenuItemIndex >= 0 &&
    !sidebarGroups[selectedMenuItemIndex].props.to;

  return (
    <MobileSidebarContext.Provider
      value={{ selectedMenuItemIndex, setSelectedMenuItemIndex }}
    >
      {shouldShowGroupChildren && (
        <OverlayMenu
          {...sidebarGroups[selectedMenuItemIndex].props}
          onClose={() => setSelectedMenuItemIndex(-1)}
        />
      )}
      <BottomNavigation
        className={classes.root}
        data-testid="mobile-sidebar-root"
      >
        {sidebarGroups}
      </BottomNavigation>
    </MobileSidebarContext.Provider>
  );
};
