/*
 * Copyright 2023 The Backstage Authors
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
import { BackstageTheme } from '@backstage/theme';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  MenuList,
  Popover,
  useTheme,
} from '@material-ui/core';
import { useAsync } from '@react-hookz/web';
import Cancel from '@material-ui/icons/Cancel';
import Retry from '@material-ui/icons/Repeat';
import Toc from '@material-ui/icons/Toc';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';

type ContextMenuProps = {
  cancelEnabled?: boolean;
  logsVisible?: boolean;
  buttonBarVisible?: boolean;
  onStartOver?: () => void;
  onToggleLogs?: (state: boolean) => void;
  onToggleButtonBar?: (state: boolean) => void;
  taskId?: string;
};

const useStyles = makeStyles<BackstageTheme, { fontColor: string }>(() => ({
  button: {
    color: ({ fontColor }) => fontColor,
  },
}));

export const ContextMenu = (props: ContextMenuProps) => {
  const {
    cancelEnabled,
    logsVisible,
    buttonBarVisible,
    onStartOver,
    onToggleLogs,
    onToggleButtonBar,
    taskId,
  } = props;
  const { getPageTheme } = useTheme<BackstageTheme>();
  const pageTheme = getPageTheme({ themeId: 'website' });
  const classes = useStyles({ fontColor: pageTheme.fontColor });
  const scaffolderApi = useApi(scaffolderApiRef);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  const [{ status: cancelStatus }, { execute: cancel }] = useAsync(async () => {
    if (taskId) {
      await scaffolderApi.cancelTask(taskId);
    }
  });

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget);
        }}
        data-testid="menu-button"
        className={classes.button}
      >
        <MoreVert />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(undefined)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          <MenuItem onClick={() => onToggleLogs?.(!logsVisible)}>
            <ListItemIcon>
              <Toc fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={logsVisible ? 'Hide Logs' : 'Show Logs'} />
          </MenuItem>
          <MenuItem onClick={() => onToggleButtonBar?.(!buttonBarVisible)}>
            <ListItemIcon>
              <ControlPointIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={buttonBarVisible ? 'Hide Button Bar' : 'Show Button Bar'}
            />
          </MenuItem>
          <MenuItem onClick={onStartOver}>
            <ListItemIcon>
              <Retry fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Start Over" />
          </MenuItem>
          <MenuItem
            onClick={cancel}
            disabled={!cancelEnabled || cancelStatus !== 'not-executed'}
            data-testid="cancel-task"
          >
            <ListItemIcon>
              <Cancel fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Cancel" />
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
};
