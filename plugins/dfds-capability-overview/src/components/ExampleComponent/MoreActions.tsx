/*
 * Copyright 2021 Spotify AB
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
import { Tooltip, IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const PopOverContext = React.createContext<any>(null);

export const PopOverProvider: React.FC = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <PopOverContext.Provider value={{ anchorEl, handleClick, handleClose }}>
      {children}
    </PopOverContext.Provider>
  );
};

const usePopOverContext = () => {
  const context = React.useContext(PopOverContext);
  return context;
};

export const MenuActions = () => {
  const { handleClose } = usePopOverContext();
  return (
    <>
      <MenuItem onClick={handleClose}>Edit</MenuItem>
      <MenuItem onClick={handleClose}>Delete</MenuItem>
    </>
  );
};

export const MoreActions = ({ size, children, icon }: any) => {
  const { anchorEl, handleClose, handleClick } = usePopOverContext();
  return (
    <>
      <Tooltip title="More settings">
        <IconButton
          size={size || 'small'}
          onClick={handleClick}
          aria-controls="simple-menu"
          aria-haspopup="true"
        >
          {icon || <MoreVertIcon />}
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </>
  );
};
