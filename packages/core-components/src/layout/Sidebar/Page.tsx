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

import { makeStyles } from '@material-ui/core/styles';
import React, { createContext, useEffect, useState } from 'react';
import { sidebarConfig } from './config';
import { BackstageTheme } from '@backstage/theme';
import { LocalStorage } from './localStorage';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export type SidebarPageClassKey = 'root';

const useStyles = makeStyles<BackstageTheme, { isPinned: boolean }>(
  theme => ({
    root: {
      width: '100%',
      transition: 'padding-left 0.1s ease-out',
      [theme.breakpoints.up('sm')]: {
        paddingLeft: ({ isPinned }) =>
          isPinned
            ? sidebarConfig.drawerWidthOpen
            : sidebarConfig.drawerWidthClosed,
      },
      [theme.breakpoints.down('xs')]: {
        paddingBottom: sidebarConfig.mobileSidebarHeight,
      },
    },
  }),
  { name: 'BackstageSidebarPage' },
);

/**
 * Type of `SidebarPinStateContext`
 *
 * @public
 */
export type SidebarPinStateContextType = {
  isPinned: boolean;
  toggleSidebarPinState: () => any;
  isMobile?: boolean;
};

/**
 * Props for SidebarPage
 *
 * @public
 */
export type SidebarPageProps = {
  children?: React.ReactNode;
};

/**
 * Contains the state on how the `Sidebar` is rendered
 *
 * @public
 */
export const SidebarPinStateContext = createContext<SidebarPinStateContextType>(
  {
    isPinned: true,
    toggleSidebarPinState: () => {},
    isMobile: false,
  },
);

export function SidebarPage(props: SidebarPageProps) {
  const [isPinned, setIsPinned] = useState(() =>
    LocalStorage.getSidebarPinState(),
  );

  useEffect(() => {
    LocalStorage.setSidebarPinState(isPinned);
  }, [isPinned]);

  const isMobile = useMediaQuery<BackstageTheme>(
    theme => theme.breakpoints.down('xs'),
    { noSsr: true },
  );

  const toggleSidebarPinState = () => setIsPinned(!isPinned);

  const classes = useStyles({ isPinned });
  return (
    <SidebarPinStateContext.Provider
      value={{
        isPinned,
        toggleSidebarPinState,
        isMobile,
      }}
    >
      <div className={classes.root}>{props.children}</div>
    </SidebarPinStateContext.Provider>
  );
}
