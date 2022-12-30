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

import { createStyles, makeStyles } from '@material-ui/core';

import { BackstageTheme } from '../ui/styles';

export const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    extraDrawerHolder: {
      position: 'absolute',
      left: 260,
      top: 0,
      width: 0,
      height: '100vh',
    },
    extraDrawerSticky: {
      position: 'sticky',
      top: 16,
      bottom: 16,
      zIndex: 1000,
    },
    extraDrawer: {
      position: 'absolute',
      left: 0,
      width: 400,
      height: 'calc(100vh - 32px)',
      overflowX: 'hidden',
      overflowY: 'auto',
      boxShadow: '1px 1px 25px #0000006c',
      // borderBottomRightRadius: 6,
      // borderTopRightRadius: 6,
      backgroundColor: theme.sidebarSecondSidebarBackgroundColor,
      backdropFilter: theme.sidebarSecondSidebarBackdropFilter,
      zIndex: 1000,
      animation: `$expandExtraSidebar 120ms ${theme.transitions.easing.easeInOut}`,
      '& > div': {
        width: '100%',
        height: '100%',
      },
    },
    extraDrawerHiding: {
      animation: `$expandExtraSidebarHide 180ms ${theme.transitions.easing.easeIn}`,
      transform: 'translateX(-100%)',
      opacity: 0,
    },
    '@keyframes expandExtraSidebar': {
      '0%': {
        transform: 'translateX(-100%)',
        // opacity: 0,
      },
      '100%': {
        transform: 'translateX(0)',
        // opacity: 1,
      },
    },
    '@keyframes expandExtraSidebarHide': {
      '0%': {
        transform: 'translateX(0)',
        opacity: 1,
      },
      '99%': {
        transform: 'translateX(-99%)',
        opacity: 1,
      },
      '100%': {
        transform: 'translateX(-100%)',
        opacity: 0,
      },
    },
  }),
);
