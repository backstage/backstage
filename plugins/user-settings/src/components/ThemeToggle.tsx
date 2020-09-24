/*
 * Copyright 2020 Spotify AB
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

import React, { cloneElement } from 'react';
import { useObservable } from 'react-use';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import { AppTheme, appThemeApiRef, useApi } from '@backstage/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from '@material-ui/core';

export const SidebarThemeToggle = () => {
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  const themeIds = appThemeApi.getInstalledThemes();

  const handleSetTheme = (
    _event: React.MouseEvent<HTMLElement>,
    newThemeId: string | undefined,
  ) => {
    if (themeIds.some(t => t.id === newThemeId)) {
      appThemeApi.setActiveThemeId(newThemeId);
    } else {
      appThemeApi.setActiveThemeId(undefined);
    }
  };

  const ThemeIcon = ({ theme }: { theme: AppTheme }) => {
    const themeIcon = themeIds.find(t => t.id === theme.id)?.icon;
    const icon = themeIcon ? (
      cloneElement(themeIcon, {
        color: themeId === theme.id ? 'primary' : undefined,
      })
    ) : (
      <AutoIcon color={themeId === theme.id ? 'primary' : undefined} />
    );

    return (
      <Tooltip placement="top" arrow title={`Select ${theme.variant} theme`}>
        {icon}
      </Tooltip>
    );
  };

  return (
    <ListItem>
      <ListItemText primary="Theme" secondary="Change the theme mode" />
      <ListItemSecondaryAction>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={themeId ?? 'auto'}
          onChange={handleSetTheme}
        >
          {themeIds.map(theme => (
            <ToggleButton key={theme.id} value={theme.variant}>
              <ThemeIcon theme={theme} />
            </ToggleButton>
          ))}
          <ToggleButton value="auto">
            <Tooltip placement="top" arrow title="Select auto theme">
              <AutoIcon color={themeId === undefined ? 'primary' : undefined} />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
