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
import {
  BackstagePaletteAdditions,
  BackstageThemeAdditions,
} from '../base/types';
// eslint-disable-next-line no-restricted-imports
import { OverridesStyleRules } from '@mui/material/styles/overrides';

declare module '@mui/material/styles' {
  interface Palette extends BackstagePaletteAdditions {}

  interface PaletteOptions extends Partial<BackstagePaletteAdditions> {}
}

declare module '@mui/material/styles' {
  interface Theme extends BackstageThemeAdditions {}

  interface ThemeOptions extends Partial<BackstageThemeAdditions> {}
}

declare module '@mui/private-theming/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

/**
 * Merge interface declarations into this type to register overrides for your components.
 *
 * @public
 * @example
 * ```ts
 * declare module '@backstage/theme' {
 *   interface OverrideComponentNameToClassKeys {
 *     MyComponent: 'root' | 'header';
 *   }
 * }
 * ```
 */
export interface OverrideComponentNameToClassKeys {}

type BackstageComponentOverrides = {
  [TName in keyof OverrideComponentNameToClassKeys]?: {
    styleOverrides?: Partial<
      OverridesStyleRules<OverrideComponentNameToClassKeys[TName], TName, Theme>
    >;
  };
};

declare module '@mui/material/styles' {
  interface Components extends BackstageComponentOverrides {}
}
