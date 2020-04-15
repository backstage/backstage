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

import { Theme, ThemeOptions } from '@material-ui/core';
import {
  PaletteOptions,
  Palette,
} from '@material-ui/core/styles/createPalette';

export type BackstageColorScheme = {
  TEXT_COLOR: string;
  PAGE_BACKGROUND: string;
  DEFAULT_PAGE_THEME_COLOR: string;
  DEFAULT_PAGE_THEME_LIGHT_COLOR: string;
  SIDEBAR_BACKGROUND_COLOR: string;
  ERROR_BACKGROUND_COLOR: string;
  ERROR_TEXT_COLOR: string;
  INFO_TEXT_COLOR: string;
  LINK_TEXT: string;
  LINK_TEXT_HOVER: string;
  NAMED_WHITE: string;
  STATUS_OK: string;
  STATUS_WARNING: string;
  STATUS_ERROR: string;
};

type PaletteAdditions = {
  status: {
    ok: string;
    warning: string;
    error: string;
    pending: string;
    running: string;
    background: string;
  };
  border: string;
  textVerySubtle: string;
  textSubtle: string;
  highlight: string;
  errorBackground: string;
  warningBackground: string;
  infoBackground: string;
  errorText: string;
  infoText: string;
  warningText: string;
  linkHover: string;
  link: string;
  gold: string;
  sidebar: string;
  bursts: {
    fontColor: string;
    slackChannelText: string;
    backgroundColor: {
      default: string;
    };
  };
};

export type BackstagePalette = Palette & PaletteAdditions;
export type BackstagePaletteOptions = PaletteOptions & PaletteAdditions;

export interface BackstageTheme extends Theme {
  palette: BackstagePalette;
}

export interface BackstageThemeOptions extends ThemeOptions {
  palette: BackstagePaletteOptions;
}
