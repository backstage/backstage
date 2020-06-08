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
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import MoreVert from '@material-ui/icons/MoreVert';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  menu: {
    marginTop: 52,
  },
});

type ComponentContextMenuProps = {
  onUnregisterComponent: () => void;
};

const ComponentContextMenu: FC<ComponentContextMenuProps> = ({
  onUnregisterComponent,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnchor = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  useEffect(() => {
    const globalCloseHandler = (event: any) => {
      const menu = menuAnchor.current;
      if (menu !== null && !menu.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('click', globalCloseHandler);
    return () => window.removeEventListener('click', globalCloseHandler);
  }, [menuOpen]);

  return (
    <div ref={menuAnchor}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={() => setMenuOpen(!menuOpen)}
        data-testid="menu-button"
      >
        <MoreVert />
      </IconButton>
      <Menu
        open={menuOpen}
        anchorEl={menuAnchor.current}
        className={classes.menu}
      >
        <MenuItem onClick={onUnregisterComponent}>
          <ListItemIcon>
            <Cancel fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Unregister component</Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SwapHoriz fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Move repository</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};
export default ComponentContextMenu;
