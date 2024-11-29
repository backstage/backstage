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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.page.fontColor,
  },
}));

export type TemplateWizardPageContextMenuProps = {
  editUrl?: string;
};

export function TemplateWizardPageContextMenu(
  props: TemplateWizardPageContextMenuProps,
) {
  const { editUrl } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  if (!editUrl) {
    return null;
  }

  const onOpen = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

  return (
    <>
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
        className={classes.button}
      >
        <MoreVert />
      </IconButton>
      <Popover
        aria-labelledby="long-menu"
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          <MenuItem onClick={() => window.open(editUrl, '_blank')}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t(
                'templateWizardPage.pageContextMenu.editConfigurationTitle',
              )}
            />
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
