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

import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BugReportIcon from '@material-ui/icons/BugReport';
import MoreVert from '@material-ui/icons/MoreVert';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyTwoTone';
import React, { useCallback, useState } from 'react';
import { IconComponent } from '@backstage/core-plugin-api';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';
import { BackstageTheme } from '@backstage/theme';
import { UnregisterEntity, UnregisterEntityOptions } from './UnregisterEntity';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';

/** @public */
export type EntityContextMenuClassKey = 'button';

const useStyles = makeStyles(
  (theme: BackstageTheme) => {
    return {
      button: {
        color: theme.page.fontColor,
      },
    };
  },
  { name: 'PluginCatalogEntityContextMenu' },
);

// NOTE(freben): Intentionally not exported at this point, since it's part of
// the unstable extra context menu items concept below
interface ExtraContextMenuItem {
  title: string;
  Icon: IconComponent;
  onClick: () => void;
}

interface EntityContextMenuProps {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  UNSTABLE_contextMenuOptions?: UnregisterEntityOptions;
  onUnregisterEntity: () => void;
  onInspectEntity: () => void;
}

export function EntityContextMenu(props: EntityContextMenuProps) {
  const {
    UNSTABLE_extraContextMenuItems,
    UNSTABLE_contextMenuOptions,
    onUnregisterEntity,
    onInspectEntity,
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const classes = useStyles();
  const unregisterPermission = useEntityPermission(
    catalogEntityDeletePermission,
  );
  const isAllowed = unregisterPermission.allowed;

  const onOpen = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

  const alertApi = useApi(alertApiRef);

  const copyToClipboard = useCallback(() => {
    window.navigator.clipboard
      .writeText(window.location.toString())
      .then(() => alertApi.post({ message: 'Copied!', severity: 'info' }));
  }, [alertApi]);

  const extraItems = UNSTABLE_extraContextMenuItems && [
    ...UNSTABLE_extraContextMenuItems.map(item => (
      <MenuItem
        key={item.title}
        onClick={() => {
          onClose();
          item.onClick();
        }}
      >
        <ListItemIcon>
          <item.Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </MenuItem>
    )),
    <Divider key="the divider is here!" />,
  ];

  return (
    <>
      <Tooltip title="More" arrow>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          aria-expanded={!!anchorEl}
          role="button"
          onClick={onOpen}
          data-testid="menu-button"
          className={classes.button}
          id="long-menu"
        >
          <MoreVert />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        aria-labelledby="long-menu"
      >
        <MenuList>
          {extraItems}
          <UnregisterEntity
            unregisterEntityOptions={UNSTABLE_contextMenuOptions}
            isUnregisterAllowed={isAllowed}
            onUnregisterEntity={onUnregisterEntity}
            onClose={onClose}
          />
          <MenuItem
            onClick={() => {
              onClose();
              onInspectEntity();
            }}
          >
            <ListItemIcon>
              <BugReportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Inspect entity" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              onClose();
              copyToClipboard();
            }}
          >
            <ListItemIcon>
              <FileCopyTwoToneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Copy entity URL" />
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
