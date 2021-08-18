/* eslint-disable @typescript-eslint/no-shadow */
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

import { BackstageTheme } from '@backstage/theme';
import {
  BottomNavigationAction,
  BottomNavigationActionProps,
  makeStyles,
} from '@material-ui/core';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '../../components';
import { MobileSidebarContext } from './MobileSidebar';

interface SidebarGroupProps extends BottomNavigationActionProps {
  to?: string;
}

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    color: theme.palette.navigation.color,
  },

  selected: {
    color: `${theme.palette.navigation.selectedColor}!important`,
  },

  label: {
    display: 'none',
  },
}));

/**
 * If the page is mobile it should be BottomNavigationAction - otherwise just a fragment
 * Links to page, which will be displayed
 * - If 'to' Prop is not defined it will render a Menu page out of the children (if children given)
 */
export const SidebarGroup = ({
  to,
  label,
  icon,
  value,
}: React.PropsWithChildren<SidebarGroupProps>) => {
  const classes = useStyles();
  const location = useLocation();
  const { selectedMenuItemIndex, setSelectedMenuItemIndex } =
    useContext(MobileSidebarContext);

  const onChange = (_, value) => {
    if (value === selectedMenuItemIndex && to !== location.pathname) {
      setSelectedMenuItemIndex(-1);
    } else if (value !== selectedMenuItemIndex) {
      setSelectedMenuItemIndex(value);
    }
  };

  const selected =
    value === selectedMenuItemIndex ||
    (selectedMenuItemIndex >= 0 && to === location.pathname);

  return (
    // @ts-ignore Material UI issue: https://github.com/mui-org/material-ui/issues/27820
    <BottomNavigationAction
      label={label}
      icon={icon}
      component={Link}
      to={to ? to : location.pathname}
      onChange={onChange}
      value={value}
      selected={selected}
      classes={classes}
    />
  );
};
