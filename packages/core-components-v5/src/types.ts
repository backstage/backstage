/*
 * Copyright 2022 The Backstage Authors
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

import { Theme } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import {
  BackstagePaletteAdditions,
  BackstageThemeAdditions,
} from '@backstage/theme';

declare module '@mui/material/styles' {
  interface Palette extends BackstagePaletteAdditions {}

  interface PaletteOptions extends BackstagePaletteAdditions {}
}

declare module '@mui/material/styles' {
  interface Theme extends BackstageThemeAdditions {}

  interface ThemeOptions extends BackstageThemeAdditions {}
}

declare module '@mui/private-theming/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

// TODO: This doesn't align with @Rugvip comment in `'@backstage/core-plugin-api'` `IconComponent`
declare module '@backstage/core-plugin-api' {
  type IconComponent = IconComponent | typeof SvgIcon;
}
