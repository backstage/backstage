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

import { RouteFunc, AnyParams } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
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
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  button: {
    color: theme.page.fontColor,
  },
}));

export type ScaffolderPageContextMenuProps = {
  editor?: RouteFunc<AnyParams>;
  actions?: RouteFunc<AnyParams>;
  tasks?: RouteFunc<AnyParams>;
};

export function ScaffolderPageContextMenu(
  props: ScaffolderPageContextMenuProps,
) {
  const { editor, actions, tasks } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  const navigate = useNavigate();

  if (!editor && !actions) {
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
          {editor && (
            <MenuItem onClick={() => navigate(editor())}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Template Editor" />
            </MenuItem>
          )}
          {actions && (
            <MenuItem onClick={() => navigate(actions())}>
              <ListItemIcon>
                <Description fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Installed Actions" />
            </MenuItem>
          )}
          {tasks && (
            <MenuItem onClick={() => navigate(tasks())}>
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
