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

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { Theme, makeStyles } from '@material-ui/core/styles';
import BugReportIcon from '@material-ui/icons/BugReport';
import MoreVert from '@material-ui/icons/MoreVert';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyTwoTone';
import React, { useEffect, useState } from 'react';
import { IconComponent } from '@backstage/core-plugin-api';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';
import { UnregisterEntity, UnregisterEntityOptions } from './UnregisterEntity';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export type EntityContextMenuClassKey = 'button';

const useStyles = makeStyles(
  (theme: Theme) => {
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
  const { t } = useTranslationRef(catalogTranslationRef);
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
  const [copyState, copyToClipboard] = useCopyToClipboard();
  useEffect(() => {
    if (!copyState.error && copyState.value) {
      alertApi.post({
        message: t('entityContextMenu.copiedMessage'),
        severity: 'info',
        display: 'transient',
      });
    }
  }, [copyState, alertApi, t]);

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
      <Tooltip title={t('entityContextMenu.moreButtonTitle')} arrow>
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
        <MenuList autoFocusItem={Boolean(anchorEl)}>
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
            <ListItemText primary={t('entityContextMenu.inspectMenuTitle')} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              onClose();
              copyToClipboard(window.location.toString());
            }}
          >
            <ListItemIcon>
              <FileCopyTwoToneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('entityContextMenu.copyURLMenuTitle')} />
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
