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

import { BottomNavigation, Box, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { SidebarGroup } from './Group';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

const OverlayMenu = ({ children }: React.PropsWithChildren<{}>) => (
  <Box
    style={{
      background: 'black',
      width: '100%',
      height: '100%',
      position: 'fixed',
      zIndex: 500,
    }}
  >
    {children}
  </Box>
);

let currentLocation: string;

/**
 * Filters for sidebar groups and reorders them to create a custom BottomNavigation
 */
export const MobileSidebar = ({ children }: React.PropsWithChildren<{}>) => {
  const classes = useStyles();
  const [value, setValue] = useState<number | undefined>();
  const [menu, setMenu] = useState<React.ReactNode | undefined>();
  const location = useLocation();

  useEffect(() => {
    if (menu && currentLocation !== location.pathname) {
      setMenu(undefined);
      setValue(undefined);
    }
    currentLocation = location.pathname;
  }, [location, menu]);

  return (
    <React.Fragment>
      {value && menu && <OverlayMenu children={menu} />}
      <BottomNavigation className={classes.root}>
        {React.Children.map(children, (child, index) => {
          if (
            React.isValidElement(child) &&
            (child as React.ReactElement).type === SidebarGroup
          ) {
            if (index === value && !menu && !child.props.to) {
              setMenu(child.props.children);
            }
            return React.cloneElement(child, {
              injectedSelected: value
                ? index === value
                : location.pathname === child.props.to,
              onClick: () => {
                if (index === value && menu) {
                  setValue(undefined);
                  setMenu(undefined);
                } else {
                  setValue(index);
                }
              },
            });
          }
          return null;
        })}
      </BottomNavigation>
    </React.Fragment>
  );
};
