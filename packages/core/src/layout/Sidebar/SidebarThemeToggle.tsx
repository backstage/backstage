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

import React, { FC } from 'react';
import { useObservable } from 'react-use';
import LightIcon from '@material-ui/icons/WbSunny';
import DarkIcon from '@material-ui/icons/Brightness2';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import { appThemeApiRef, useApi } from '@backstage/core-api';
import { SidebarItem } from './Items';

export const SidebarThemeToggle: FC<{}> = () => {
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  let text = 'Auto';
  let icon = AutoIcon;
  switch (themeId) {
    case 'dark':
      text = 'Dark mode';
      icon = DarkIcon;
      break;
    case 'light':
      text = 'Light mode';
      icon = LightIcon;
      break;
    default:
      break;
  }

  const handleToggle = () => {
    if (!themeId) {
      appThemeApi.setActiveThemeId('light');
    } else if (themeId === 'light') {
      appThemeApi.setActiveThemeId('dark');
    } else {
      appThemeApi.setActiveThemeId(undefined);
    }
  };

  return <SidebarItem text={text} onClick={handleToggle} icon={icon} />;
};
