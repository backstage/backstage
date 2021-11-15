/*
 * Copyright 2021 The Backstage Authors
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
import { SidebarItem } from '@backstage/core-components';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import React, { cloneElement, useCallback, useState } from 'react';
import { useObservable } from 'react-use';

type ThemeIconProps = {
  active?: boolean;
  icon: JSX.Element | undefined;
};

const ThemeIcon = ({ active, icon }: ThemeIconProps) =>
  icon ? (
    cloneElement(icon, {
      color: active ? 'primary' : undefined,
    })
  ) : (
    <AutoIcon color={active ? 'primary' : undefined} />
  );

export const SidebarThemeSwitcher = () => {
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );
  const themeIds = appThemeApi.getInstalledThemes();
  const activeTheme = themeIds.find(t => t.id === themeId);

  const [anchorEl, setAnchorEl] = useState<Element | undefined>();
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectTheme = (newThemeId: string | undefined) => {
    if (themeIds.some(t => t.id === newThemeId)) {
      appThemeApi.setActiveThemeId(newThemeId);
    } else {
      appThemeApi.setActiveThemeId(undefined);
    }

    setAnchorEl(undefined);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const ActiveIcon = useCallback(
    () => <ThemeIcon icon={activeTheme?.icon} />,
    [activeTheme],
  );

  return (
    <>
      <SidebarItem
        icon={ActiveIcon}
        text="Switch Theme"
        id="theme-button"
        aria-haspopup="listbox"
        aria-controls="theme-menu"
        aria-label="switch theme"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
      />

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'theme-button',
          role: 'listbox',
        }}
      >
        <MenuItem disabled>Choose a theme</MenuItem>
        <MenuItem
          selected={themeId === undefined}
          onClick={() => handleSelectTheme(undefined)}
        >
          <ListItemIcon>
            <ThemeIcon icon={undefined} active={themeId === undefined} />
          </ListItemIcon>
          <ListItemText>Auto</ListItemText>
        </MenuItem>

        {themeIds.map(theme => {
          const active = theme.id === themeId;
          return (
            <MenuItem
              key={theme.id}
              selected={active}
              aria-selected={active}
              onClick={() => handleSelectTheme(theme.id)}
            >
              <ListItemIcon>
                <ThemeIcon icon={theme.icon} active={active} />
              </ListItemIcon>
              <ListItemText>{theme.title}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
