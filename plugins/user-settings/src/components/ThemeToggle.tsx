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

export const ThemeToggle = () => {
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

  // ToggleButtonGroup uses React.children.map instead of context
  // so wrapping with Tooltip breaks ToggleButton functionality.
  const TooltipToggleButton = ({
    children,
    title,
    value,
    ...props
  }: {
    children: JSX.Element;
    title: string;
    value: string;
  }) => (
    <Tooltip placement="top" arrow title={title}>
      <ToggleButton value={value} {...props}>
        {children}
      </ToggleButton>
    </Tooltip>
  );

  const ThemeIcon = ({ theme }: { theme: AppTheme }) => {
    const themeIcon = themeIds.find(t => t.id === theme.id)?.icon;
    return themeIcon ? (
      cloneElement(themeIcon, {
        color: themeId === theme.id ? 'primary' : undefined,
      })
    ) : (
      <AutoIcon color={themeId === theme.id ? 'primary' : undefined} />
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
            <TooltipToggleButton
              key={theme.id}
              title={`Select ${theme.title}`}
              value={theme.variant}
            >
              <ThemeIcon theme={theme} />
            </TooltipToggleButton>
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
