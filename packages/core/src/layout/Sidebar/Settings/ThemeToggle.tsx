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

import React from 'react';
import { useObservable } from 'react-use';
import LightIcon from '@material-ui/icons/WbSunny';
import DarkIcon from '@material-ui/icons/Brightness2';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import { appThemeApiRef, useApi } from '@backstage/core-api';
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
  // TODO(marcuseide): can these be put on the theme itself?
  const themeIcons = {
    dark: <DarkIcon />,
    light: <LightIcon />,
  };

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
              <Tooltip
                placement="top"
                arrow
                title={`Select ${theme.variant} theme`}
              >
                {themeIcons[theme.variant]}
              </Tooltip>
            </ToggleButton>
          ))}
          <ToggleButton value="auto">
            <Tooltip placement="top" arrow title="Select auto theme">
              <AutoIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
