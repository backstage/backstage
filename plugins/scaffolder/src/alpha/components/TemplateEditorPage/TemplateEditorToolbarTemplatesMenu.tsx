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

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { Entity } from '@backstage/catalog-model';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { scaffolderTranslationRef } from '../../../translation';

const ITEM_HEIGHT = 48;

const useStyles = makeStyles({
  menu: {
    maxHeight: ITEM_HEIGHT * 5,
  },
});

export type TemplateOption = {
  label: string;
  value: Entity;
};

export function TemplateEditorToolbarTemplatesMenu(props: {
  options: TemplateOption[];
  selectedOption?: TemplateOption;
  onSelectOption: (option: TemplateOption) => void;
}) {
  const { options, selectedOption, onSelectOption } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const isSelectedOption = useCallback(
    (option: TemplateOption) => {
      return !!selectedOption && selectedOption.value === option.value;
    },
    [selectedOption],
  );

  const handleOpenMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleSelectOption = useCallback(
    (option: TemplateOption) => {
      handleCloseMenu();
      onSelectOption(option);
    },
    [handleCloseMenu, onSelectOption],
  );

  return (
    <>
      <Button
        aria-controls="templates-menu"
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        {t('templateEditorToolbarTemplatesMenu.button')}
      </Button>
      <Menu
        id="templates-menu"
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
        PaperProps={{
          className: classes.menu,
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            selected={isSelectedOption(option)}
            aria-selected={isSelectedOption(option)}
            onClick={() => handleSelectOption(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
