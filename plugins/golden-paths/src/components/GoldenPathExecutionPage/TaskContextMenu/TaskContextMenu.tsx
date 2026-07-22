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
import CancelIcon from '@material-ui/icons/Cancel';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Edit from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  taskCancelPermission,
  taskCreatePermission,
  taskReadPermission,
  TaskStatus,
} from '@backstage/plugin-golden-paths-common';

import { useCancelGoldenPath, useStartOver } from './TaskContextMenu.utils';
import DetailsDialog from './DetailsDialog';
import { useGoldenPathTaskContext } from '../useGoldenPathTaskContext';

export type TaskContextMenuProps = {
  id?: string;
  taskConfigUrl?: string;
  entityRef?: string;
  goldenPathStatus?: TaskStatus;
};

export const TaskContextMenu = ({
  id,
  taskConfigUrl,
  entityRef,
}: TaskContextMenuProps) => {
  const {
    value: { goldenPathTask: task, getGoldenPathTask },
  } = useGoldenPathTaskContext();

  const { startOverGoldenPath, startOverLoading } = useStartOver();
  const { triggerCancel, cancelLoading } = useCancelGoldenPath();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  const { allowed: canReadTasks } = usePermission({
    permission: taskReadPermission,
    resourceRef: id,
  });

  const { allowed: canCreateTask } = usePermission({
    permission: taskCreatePermission,
  });

  const { allowed: canCancelTask } = usePermission({
    permission: taskCancelPermission,
    resourceRef: id,
  });

  const canStartOver = canReadTasks && canCreateTask;

  const onOpen = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

  const configUrl = taskConfigUrl?.replaceAll('url:', '');

  const [detailsVisible, setDetailsVisible] = useState(false);

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
          {entityRef && (
            <MenuItem onClick={() => setDetailsVisible(true)}>
              <ListItemIcon>
                <ErrorIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Details" />
            </MenuItem>
          )}
          {canStartOver && id && (
            <MenuItem
              disabled={task.status !== 'cancelled' || startOverLoading}
              onClick={startOverGoldenPath}
            >
              <ListItemIcon>
                <AutorenewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Start over Golden Path" />
            </MenuItem>
          )}
          {canCancelTask && id && (
            <MenuItem
              disabled={
                task.status === 'cancelled' ||
                task.status === 'completed' ||
                cancelLoading
              }
              onClick={async () => {
                await triggerCancel(id);
                getGoldenPathTask();
              }}
            >
              <ListItemIcon>
                <CancelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Cancel Golden Path" />
            </MenuItem>
          )}
        </MenuList>
      </Popover>

      <DetailsDialog
        isOpen={detailsVisible}
        onClose={() => {
          setDetailsVisible(false);
          onClose();
        }}
        entityRef={entityRef}
      />
    </>
  );
};
