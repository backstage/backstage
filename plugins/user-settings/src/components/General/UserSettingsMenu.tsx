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

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SignOutIcon from '@material-ui/icons/MeetingRoom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  identityApiRef,
  errorApiRef,
  useApi,
} from '@backstage/core-plugin-api';

/** @public */
export const UserSettingsMenu = () => {
  const errorApi = useApi(errorApiRef);
  const identityApi = useApi(identityApiRef);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(
    undefined,
  );

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
    setOpen(false);
  };

  return (
    <>
      <IconButton
        data-testid="user-settings-menu"
        aria-label="more"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          data-testid="sign-out"
          onClick={() =>
            identityApi.signOut().catch(error => errorApi.post(error))
          }
        >
          <ListItemIcon>
            <SignOutIcon />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};
