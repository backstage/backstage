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
import { SidebarItem } from '@backstage/core';
import { ThemeContext } from '../../ThemeContext';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
const ToggleThemeSidebarItem: FC<{}> = () => {
  return (
    <ThemeContext.Consumer>
      {themeContext => {
        let text = 'Auto';
        let icon = ToggleOnIcon;
        switch (themeContext.theme) {
          case 'dark':
            text = 'Dark mode';
            icon = Brightness2Icon;
            break;
          case 'light':
            text = 'Light mode';
            icon = WbSunnyIcon;
            break;
          default:
            text = 'Auto';
            icon = ToggleOnIcon;
            break;
        }

        return (
          <SidebarItem
            text={text}
            onClick={themeContext.toggleTheme}
            icon={icon}
          />
        );
      }}
    </ThemeContext.Consumer>
  );
};

export default ToggleThemeSidebarItem;
