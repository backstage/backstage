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

import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import Description from '@material-ui/icons/Description';
import Edit from '@material-ui/icons/Edit';
import List from '@material-ui/icons/List';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.page.fontColor,
  },
}));

/**
 * @alpha
 */
export type ScaffolderPageContextMenuProps = {
  onEditorClicked?: () => void;
  onActionsClicked?: () => void;
  onTasksClicked?: () => void;
  onCreateClicked?: () => void;
};

/**
 * @alpha
 */
export function ScaffolderPageContextMenu(
  props: ScaffolderPageContextMenuProps,
) {
  const { onEditorClicked, onActionsClicked, onTasksClicked, onCreateClicked } =
    props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  if (!onEditorClicked && !onActionsClicked) {
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
        id="long-menu"
        aria-label="more"
        aria-controls="long-menu"
        aria-expanded={!!anchorEl}
        aria-haspopup="true"
        role="button"
        onClick={onOpen}
        data-testid="menu-button"
        color="inherit"
        className={classes.button}
      >
        <MoreVert />
      </IconButton>
      <Popover
        aria-labelledby="long-menu"
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          {onCreateClicked && (
            <MenuItem onClick={onCreateClicked}>
              <ListItemIcon>
                <CreateComponentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Create" />
            </MenuItem>
          )}
          {onEditorClicked && (
            <MenuItem onClick={onEditorClicked}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Template Editor" />
            </MenuItem>
          )}
          {onActionsClicked && (
            <MenuItem onClick={onActionsClicked}>
              <ListItemIcon>
                <Description fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Installed Actions" />
            </MenuItem>
          )}
          {onTasksClicked && (
            <MenuItem onClick={onTasksClicked}>
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
