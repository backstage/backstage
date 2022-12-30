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

import React, { PropsWithChildren } from 'react';

import { makeStyles } from '@material-ui/core';

import {
  Drawers,
  RoutedDrawersProvider,
} from '@backstage/plugin-interactive-drawers';

import {
  Sidebar,
  SidebarProps,
  ThemedSidebarProvider,
} from './sidebar/sidebar';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    gridTemplateRows: '1fr',
    width: '100%',
    height: '100vh',
  },
  mainContentArea: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  mainContent: {
    height: '100%',
  },
});

export function InteractiveSidebarRoot({
  children,
  LoggedIn,
  MoreMenu,
}: PropsWithChildren<SidebarProps>) {
  const classes = useStyles();

  return (
    <RoutedDrawersProvider>
      <div className={classes.root}>
        <ThemedSidebarProvider>
          <Sidebar MoreMenu={MoreMenu} LoggedIn={LoggedIn} />
          <Drawers />
        </ThemedSidebarProvider>
        <div className={classes.mainContentArea}>{children}</div>
      </div>
    </RoutedDrawersProvider>
  );
}
