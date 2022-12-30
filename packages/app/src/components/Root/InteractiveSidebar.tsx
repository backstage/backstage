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
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import { Drawers } from '@backstage/plugin-interactive-drawers';
import {
  Sidebar as InteractiveSidebar,
  ThemedSidebarProvider,
} from '@backstage/plugin-interactive-sidebar';

import { registerPluginsDrawers } from '../interactive-sidebar/register';

registerPluginsDrawers();

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

function MoreMenu({ children }: PropsWithChildren<{}>) {
  return <>{children}</>;
}

export const InteractiveSidebarWrapper = ({
  children,
}: PropsWithChildren<{}>) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ThemedSidebarProvider>
        <InteractiveSidebar
          MoreMenu={MoreMenu}
          LoggedIn={({ WrapperComponent }) => (
            <WrapperComponent
              icon={<PersonOutlineIcon />}
              onClick={() => {}}
              title="Logged in"
            />
          )}
        />
        <Drawers />
      </ThemedSidebarProvider>
      <div className={classes.mainContentArea}>{children}</div>
    </div>
  );
};
