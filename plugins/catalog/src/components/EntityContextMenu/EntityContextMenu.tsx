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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import BugReportIcon from '@material-ui/icons/BugReport';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react';
import { IconComponent } from '@backstage/core-plugin-api';
import { useEntityPermission } from '@backstage/plugin-catalog-react';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common';
import { BackstageTheme } from '@backstage/theme';

/** @public */
export type EntityContextMenuClassKey = 'button';

const useStyles = makeStyles(
  (theme: BackstageTheme) => {
    return {
      button: {
        color: theme.palette.bursts.fontColor,
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

// unstable context menu option, eg: disable the unregister entity menu
interface contextMenuOptions {
  disableUnregister: boolean;
}

interface EntityContextMenuProps {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  UNSTABLE_contextMenuOptions?: contextMenuOptions;
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

  const onOpen = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

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

  const disableUnregister =
    (!unregisterPermission.allowed ||
      UNSTABLE_contextMenuOptions?.disableUnregister) ??
    false;

  return (
    <>
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
          <MenuItem
            onClick={() => {
              onClose();
              onUnregisterEntity();
            }}
            disabled={disableUnregister}
          >
            <ListItemIcon>
              <CancelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Unregister entity" />
          </MenuItem>
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
        </MenuList>
      </Popover>
    </>
  );
}
