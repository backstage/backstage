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

import { makeStyles } from '@material-ui/core';

import { BackstageTheme } from '@backstage/plugin-interactive-drawers';

export const useStyles = makeStyles((theme: BackstageTheme) => ({
  drawer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: collapsed => (collapsed ? 72 : 260),
    background: theme.sidebarBackgroundColor,
    color: theme.sidebarTextColor,
    overflowY: 'hidden',
    overflowX: 'hidden',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: theme.accentColor?.[50],
    zIndex: 1001,
  },
  drawerOpened: {
    boxShadow: '1px 1px 10px #0000002c',
  },
  scrollableBookmarkList: { flexGrow: 1, overflowY: 'auto' },
  sidebarEditSection: {
    borderTop: `1px solid ${theme.sidebarBorderColor}`,
    padding: 16,
    '& > *:not(:first-child)': {
      marginLeft: 8,
    },
  },
}));
