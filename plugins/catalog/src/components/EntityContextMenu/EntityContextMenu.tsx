/*
 * Copyright 2020 Spotify AB
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

import {
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Cancel from '@material-ui/icons/Cancel';
import MoreVert from '@material-ui/icons/MoreVert';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import React, { useState } from 'react';

// TODO(freben): It should probably instead be the case that Header sets the theme text color to white inside itself unconditionally instead
const useStyles = makeStyles({
  button: {
    color: 'white',
  },
});

type Props = {
  onUnregisterEntity: () => void;
};

export const EntityContextMenu = ({ onUnregisterEntity }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const classes = useStyles();

  const onOpen = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={onOpen}
        data-testid="menu-button"
        className={classes.button}
      >
        <MoreVert />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onClose();
              onUnregisterEntity();
            }}
          >
            <ListItemIcon>
              <Cancel fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Unregister entity</Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <SwapHoriz fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Move repository</Typography>
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
};
