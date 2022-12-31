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

import { PaletteOptions } from '@mui/material/styles';
import {
  BackstagePaletteAdditions,
  BackstageThemeAdditions,
  PageTheme,
} from '../base/types';

/**
 * A simpler configuration for creating a new theme that just tweaks some parts
 * of the backstage one.
 *
 * @public
 */
export type SimpleV5ThemeOptions = {
  palette: PaletteOptions;
  defaultPageTheme?: string;
  pageTheme?: Record<string, PageTheme>;
  fontFamily?: string;
  htmlFontSize?: number;
};

declare module '@mui/material/styles/createPalette' {
  interface Palette extends BackstagePaletteAdditions {}

  interface PaletteOptions extends BackstagePaletteAdditions {}
}

declare module '@mui/material/styles/createTheme' {
  interface Theme extends BackstageThemeAdditions {}

  interface ThemeOptions extends BackstageThemeAdditions {}
}

// This is a workaround for missing methods in React 17 that MUI v5 depends on
// See https://github.com/mui/material-ui/issues/35287
declare global {
  namespace React {
    interface DOMAttributes<T> {
      // onResize?: ReactEventHandler<T> | undefined;
      // onResizeCapture?: ReactEventHandler<T> | undefined;

      onResize?: (event: Event) => void;
      onResizeCapture?: (event: Event) => void;
      nonce?: string | undefined;
    }
  }
}
// declare global {
//   namespace React {
//     type React = typeof import('react');

//     interface DOMAttributes<T extends React.SyntheticEvent> {
//       onResize?: React.EventHandler<T> | undefined;
//       onResizeCapture?: React.EventHandler<T> | undefined;
//       nonce?: string | undefined;
//     }
//   }
// }
