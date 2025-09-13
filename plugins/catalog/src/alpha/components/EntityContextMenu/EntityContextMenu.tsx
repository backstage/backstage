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
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import { JSX, SyntheticEvent, useState } from 'react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../translation.ts';
import { EntityContextMenuProvider } from '../../../context';

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

interface EntityContextMenuProps {
  contextMenuItems?: JSX.Element[];
}

export function EntityContextMenu(props: EntityContextMenuProps) {
  const { contextMenuItems } = props;
  const { t } = useTranslationRef(catalogTranslationRef);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const classes = useStyles();

  const onOpen = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

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
        PaperProps={{
          style: { minWidth: 200 },
        }}
      >
        <MenuList autoFocusItem={Boolean(anchorEl)}>
          <EntityContextMenuProvider onMenuClose={onClose}>
            {contextMenuItems}
          </EntityContextMenuProvider>
        </MenuList>
      </Popover>
    </>
  );
}
