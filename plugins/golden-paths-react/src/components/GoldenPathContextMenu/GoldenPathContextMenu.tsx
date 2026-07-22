/*
 * Copyright 2026 The Backstage Authors
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
import { SyntheticEvent, useState } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Edit from '@material-ui/icons/Edit';

export type GoldenPathContextMenuProps = {
  taskConfigUrl: string | undefined;
};

export const GoldenPathContextMenu = ({
  taskConfigUrl,
}: GoldenPathContextMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  const onOpen = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

  const configUrl = taskConfigUrl?.replaceAll('url:', '');

  return (
    <>
      <Tooltip title="More" arrow>
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
        >
          <MoreVert />
        </IconButton>
      </Tooltip>
      <Popover
        aria-labelledby="long-menu"
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          {taskConfigUrl && (
            <MenuItem onClick={() => window.open(configUrl, '_blank')}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit Configuration" />
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
};
