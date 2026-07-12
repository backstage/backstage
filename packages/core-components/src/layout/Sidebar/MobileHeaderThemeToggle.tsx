/*
 * Copyright 2026 The Backstage Authors
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
import LightIcon from '@material-ui/icons/WbSunny';
import DarkIcon from '@material-ui/icons/Brightness2';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import useObservable from 'react-use/esm/useObservable';

/** @public */
export function MobileHeaderThemeToggle() {
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  const handleToggle = () => {
    const themes = appThemeApi.getInstalledThemes();
    if (themes.length === 0) return;
    const currentIndex = themes.findIndex(t => t.id === themeId);
    const nextIndex = (currentIndex + 1) % themes.length;
    appThemeApi.setActiveThemeId(themes[nextIndex].id);
  };

  const activeTheme = appThemeApi
    .getInstalledThemes()
    .find(t => t.id === themeId);
  const Icon = activeTheme?.variant === 'dark' ? LightIcon : DarkIcon;

  return (
    <IconButton
      color="inherit"
      onClick={handleToggle}
      aria-label="Toggle Theme"
    >
      <Icon />
    </IconButton>
  );
}
