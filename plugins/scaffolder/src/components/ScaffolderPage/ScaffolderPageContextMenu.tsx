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

import { useRouteRef } from '@backstage/core-plugin-api';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import Description from '@material-ui/icons/Description';
import Edit from '@material-ui/icons/Edit';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { rootRouteRef, registerComponentRouteRef } from '../../routes';

const useStyles = makeStyles({
  button: {
    color: 'white',
  },
});

export type ScaffolderPageContextMenuProps = {
  registerNew?: boolean;
  editor?: boolean;
  actions?: boolean;
};

export function ScaffolderPageContextMenu(
  props: ScaffolderPageContextMenuProps,
) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const pageLink = useRouteRef(rootRouteRef);
  const navigate = useNavigate();

  const registerComponentLink = useRouteRef(registerComponentRouteRef);

  const showRegister = props.registerNew !== false && registerComponentLink;
  const showEditor = props.editor !== false;
  const showActions = props.actions !== false;

  if (!showEditor && !showActions) {
    return null;
  }

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
        color="inherit"
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
          {showRegister && (
            <MenuItem onClick={() => navigate(registerComponentLink())}>
              <ListItemIcon>
                <Add fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Add Template" />
            </MenuItem>
          )}
          {showEditor && (
            <MenuItem onClick={() => navigate(`${pageLink()}/edit`)}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Template Editor" />
            </MenuItem>
          )}
          {showActions && (
            <MenuItem onClick={() => navigate(`${pageLink()}/actions`)}>
              <ListItemIcon>
                <Description fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Installed Actions" />
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
