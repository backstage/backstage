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
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import { orderBy } from 'lodash';
import React, { createContext, useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { SidebarOpenStateProvider } from './SidebarOpenStateContext';
import { SidebarGroup } from './SidebarGroup';
import { SidebarConfigContext, SidebarConfig } from './config';

/**
 * Type of `MobileSidebarContext`
 *
 * @internal
 */
export type MobileSidebarContextType = {
  selectedMenuItemIndex: number;
  setSelectedMenuItemIndex: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * Props of MobileSidebar
 *
 * @public
 */
export type MobileSidebarProps = {
  children?: React.ReactNode;
};

/**
 * @internal
 */
type OverlayMenuProps = {
  label?: string;
  onClose: () => void;
  open: boolean;
  children?: React.ReactNode;
};

const useStyles = makeStyles<BackstageTheme, { sidebarConfig: SidebarConfig }>(
  theme => ({
    root: {
      position: 'fixed',
      backgroundColor: theme.palette.navigation.background,
      color: theme.palette.navigation.color,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: theme.zIndex.snackbar,
      // SidebarDivider color
      borderTop: '1px solid #383838',
    },

    overlay: props => ({
      background: theme.palette.navigation.background,
      width: '100%',
      bottom: `${props.sidebarConfig.mobileSidebarHeight}px`,
      height: `calc(100% - ${props.sidebarConfig.mobileSidebarHeight}px)`,
      flex: '0 1 auto',
      overflow: 'auto',
    }),

    overlayHeader: {
      display: 'flex',
      color: theme.palette.bursts.fontColor,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 3),
    },

    overlayHeaderClose: {
      color: theme.palette.bursts.fontColor,
    },

    marginMobileSidebar: props => ({
      marginBottom: `${props.sidebarConfig.mobileSidebarHeight}px`,
    }),
  }),
);

const sortSidebarGroupsForPriority = (children: React.ReactElement[]) =>
  orderBy(
    children,
    ({ props: { priority } }) => (Number.isInteger(priority) ? priority : -1),
    'desc',
  );

const sidebarGroupType = React.createElement(SidebarGroup).type;

const OverlayMenu = ({
  children,
  label = 'Menu',
  open,
  onClose,
}: OverlayMenuProps) => {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const classes = useStyles({ sidebarConfig });

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      ModalProps={{
        BackdropProps: { classes: { root: classes.marginMobileSidebar } },
      }}
      classes={{
        root: classes.marginMobileSidebar,
        paperAnchorBottom: classes.overlay,
      }}
    >
      <Box className={classes.overlayHeader}>
        <Typography variant="h3">{label}</Typography>
        <IconButton
          onClick={onClose}
          classes={{ root: classes.overlayHeaderClose }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box component="nav">{children}</Box>
    </Drawer>
  );
};

/**
 * Context on which `SidebarGroup` is currently selected
 *
 * @internal
 */
export const MobileSidebarContext = createContext<MobileSidebarContextType>({
  selectedMenuItemIndex: -1,
  setSelectedMenuItemIndex: () => {},
});

/**
 * A navigation component for mobile screens, which sticks to the bottom.
 *
 * It alternates the normal sidebar by grouping the `SidebarItems` based on provided `SidebarGroup`s
 * either rendering them as a link or an overlay menu.
 * If no `SidebarGroup`s are provided the sidebar content is wrapped in an default overlay menu.
 *
 * @public
 */
export const MobileSidebar = (props: MobileSidebarProps) => {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const { children } = props;
  const classes = useStyles({ sidebarConfig });
  const location = useLocation();
  const [selectedMenuItemIndex, setSelectedMenuItemIndex] =
    useState<number>(-1);

  useEffect(() => {
    setSelectedMenuItemIndex(-1);
  }, [location.pathname]);

  // Filter children for SidebarGroups
  //
  // Directly comparing child.type with SidebarSubmenu will not work with in
  // combination with react-hot-loader
  //
  // https://github.com/gaearon/react-hot-loader/issues/304#issuecomment-456569720
  let sidebarGroups = useElementFilter(children, elements =>
    elements.getElements().filter(child => child.type === sidebarGroupType),
  );

  if (!children) {
    // If Sidebar has no children the MobileSidebar won't be rendered
    return null;
  } else if (!sidebarGroups.length) {
    // If Sidebar has no SidebarGroup as a children a default
    // SidebarGroup with the complete Sidebar content will be created
    sidebarGroups.push(
      <SidebarGroup key="default_menu" icon={<MenuIcon />}>
        {children}
      </SidebarGroup>,
    );
  } else {
    // Sort SidebarGroups for the given Priority
    sidebarGroups = sortSidebarGroupsForPriority(sidebarGroups);
  }

  const shouldShowGroupChildren =
    selectedMenuItemIndex >= 0 &&
    !sidebarGroups[selectedMenuItemIndex].props.to;

  return (
    <SidebarOpenStateProvider value={{ isOpen: true, setOpen: () => {} }}>
      <MobileSidebarContext.Provider
        value={{ selectedMenuItemIndex, setSelectedMenuItemIndex }}
      >
        <OverlayMenu
          label={
            sidebarGroups[selectedMenuItemIndex] &&
            (sidebarGroups[selectedMenuItemIndex]!.props.label as string)
          }
          open={shouldShowGroupChildren}
          onClose={() => setSelectedMenuItemIndex(-1)}
        >
          {sidebarGroups[selectedMenuItemIndex] &&
            (sidebarGroups[selectedMenuItemIndex].props
              .children as React.ReactChildren)}
        </OverlayMenu>
        <BottomNavigation
          className={classes.root}
          data-testid="mobile-sidebar-root"
          component="nav"
        >
          {sidebarGroups}
        </BottomNavigation>
      </MobileSidebarContext.Provider>
    </SidebarOpenStateProvider>
  );
};
