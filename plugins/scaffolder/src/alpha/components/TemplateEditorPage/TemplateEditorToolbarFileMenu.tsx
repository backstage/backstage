/*
 * Copyright 2024 The Backstage Authors
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

import { MouseEvent, useCallback, useState } from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useTranslationRef } from '@backstage/frontend-plugin-api';

import { scaffolderTranslationRef } from '../../../translation';

export function TemplateEditorToolbarFileMenu(props: {
  onOpenDirectory?: () => void;
  onCreateDirectory?: () => void;
  onCloseDirectory?: () => void;
}) {
  const { onOpenDirectory, onCreateDirectory, onCloseDirectory } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleOpenDirectory = useCallback(() => {
    handleCloseMenu();
    onOpenDirectory?.();
  }, [handleCloseMenu, onOpenDirectory]);

  const handleCreateDirectory = useCallback(() => {
    handleCloseMenu();
    onCreateDirectory?.();
  }, [handleCloseMenu, onCreateDirectory]);

  const handleCloseEditor = useCallback(() => {
    handleCloseMenu();
    onCloseDirectory?.();
  }, [handleCloseMenu, onCloseDirectory]);

  return (
    <>
      <Button
        aria-controls="file-menu"
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        {t('templateEditorToolbarFileMenu.button')}
      </Button>
      <Menu
        id="file-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleOpenDirectory} disabled={!onOpenDirectory}>
          {t('templateEditorToolbarFileMenu.options.openDirectory')}
        </MenuItem>
        <MenuItem
          onClick={handleCreateDirectory}
          disabled={!onCreateDirectory}
          divider
        >
          {t('templateEditorToolbarFileMenu.options.createDirectory')}
        </MenuItem>
        <MenuItem onClick={handleCloseEditor} disabled={!onCloseDirectory}>
          {t('templateEditorToolbarFileMenu.options.closeEditor')}
        </MenuItem>
      </Menu>
    </>
  );
}
