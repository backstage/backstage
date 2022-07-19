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
import Description from '@material-ui/icons/Description';
import Edit from '@material-ui/icons/Edit';
import List from '@material-ui/icons/List';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  actionsRouteRef,
  editRouteRef,
  scaffolderListTaskRouteRef,
} from '../../routes';

const useStyles = makeStyles({
  button: {
    color: 'white',
  },
});

export type ScaffolderPageContextMenuProps = {
  editor?: boolean;
  actions?: boolean;
  tasks?: boolean;
};

export function ScaffolderPageContextMenu(
  props: ScaffolderPageContextMenuProps,
) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const editLink = useRouteRef(editRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);

  const navigate = useNavigate();

  const showEditor = props.editor !== false;
  const showActions = props.actions !== false;
  const showTasks = props.tasks !== false;

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
          {showEditor && (
            <MenuItem onClick={() => navigate(editLink())}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Template Editor" />
            </MenuItem>
          )}
          {showActions && (
            <MenuItem onClick={() => navigate(actionsLink())}>
              <ListItemIcon>
                <Description fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Installed Actions" />
            </MenuItem>
          )}
          {showTasks && (
            <MenuItem onClick={() => navigate(tasksLink())}>
              <ListItemIcon>
                <List fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Task List" />
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
