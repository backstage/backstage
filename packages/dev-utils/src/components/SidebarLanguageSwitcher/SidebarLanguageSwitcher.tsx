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

import { MouseEvent, useState } from 'react';
import { appLanguageApiRef } from '@backstage/core-plugin-api/alpha';
import TranslateIcon from '@material-ui/icons/Translate';
import ListItemText from '@material-ui/core/ListItemText';
import { useApi } from '@backstage/core-plugin-api';
import useObservable from 'react-use/esm/useObservable';
import { SidebarItem } from '@backstage/core-components';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

/** @public */
export const SidebarLanguageSwitcher = () => {
  const languageApi = useApi(appLanguageApiRef);

  const [languageObservable] = useState(() => languageApi.language$());
  const { language: currentLanguage } = useObservable(
    languageObservable,
    languageApi.getLanguage(),
  );
  const [anchorEl, setAnchorEl] = useState<Element | undefined>();

  const { languages } = languageApi.getAvailableLanguages();

  if (languages.length <= 1) {
    return null;
  }

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const handleOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSetLanguage = (newLanguage: string | undefined) => {
    languageApi.setLanguage(newLanguage);
    setAnchorEl(undefined);
  };

  const getLanguageDisplayName = (language: string) => {
    try {
      const names = new Intl.DisplayNames([language], {
        type: 'language',
      });
      return names.of(language) || language;
    } catch (err) {
      return language;
    }
  };

  return (
    <>
      <SidebarItem
        icon={TranslateIcon}
        text="Language"
        id="language-button"
        aria-haspopup="listbox"
        aria-controls="language-menu"
        aria-label="switch language"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
      />
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
          role: 'listbox',
        }}
      >
        <MenuItem disabled>Choose language</MenuItem>
        {languages.map(lang => {
          const active = currentLanguage === lang;
          return (
            <MenuItem
              key={lang}
              selected={active}
              aria-selected={active}
              onClick={() => handleSetLanguage(lang)}
            >
              <ListItemText>{getLanguageDisplayName(lang)}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
