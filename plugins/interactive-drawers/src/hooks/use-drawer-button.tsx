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

import React from 'react';

import { createStyles, makeStyles, Button } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {
  useDrawerInteractivity,
  UseDrawerInteractivityOptions,
} from './use-drawer-interactivity';

const useStyles = makeStyles(theme =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      minWidth: 32,
      padding: '6px 6px',
    },
    buttonIcon: {
      paddingRight: theme.spacing(0),
    },
  }),
);

export function useDrawerButton(
  path: string | undefined,
  options?: UseDrawerInteractivityOptions,
) {
  const { button, buttonIcon } = useStyles();

  const { drawerIsOpen, supportsDrawer, toggleDrawer } = useDrawerInteractivity(
    path,
    options,
  );

  const DrawerButtonIcon = drawerIsOpen ? ChevronLeftIcon : ChevronRightIcon;

  const DrawerButton = () => (
    <Button
      className={button}
      onClick={toggleDrawer}
      variant={drawerIsOpen ? 'contained' : 'text'}
    >
      <span>
        <DrawerButtonIcon className={buttonIcon} />
      </span>
    </Button>
  );

  return {
    drawerIsOpen,
    supportsDrawer,
    toggleDrawer,
    DrawerButtonIcon,
    DrawerButton,
  };
}
