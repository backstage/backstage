/*
 * Copyright 2020 The Backstage Authors
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

/**
 * Backstage specific additions to the material-ui palette.
 *
 * @public
 */
export type BackstagePaletteAdditions = {
  status: {
    ok: string;
    warning: string;
    error: string;
    pending: string;
    running: string;
    aborted: string;
  };
  border: string;
  textContrast: string;
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
  navigation: {
    background: string;
    indicator: string;
    color: string;
    selectedColor: string;
    navItem: {
      hoverBackground: string;
    };
    submenu: {
      background: string;
      indicator: string;
      color: string;
      selectedColor: string;
    };
  };
  tabbar: {
    indicator: string;
  };
  bursts: {
    fontColor: string;
    slackChannelText: string;
    backgroundColor: {
      default: string;
    };
    gradient: {
      linear: string;
    };
  };
  pinSidebarButton: {
    icon: string;
    background: string;
  };
  banner: {
    info: string;
    error: string;
    text: string;
    link: string;
    warning: string;
  };
};

/**
 * The full Backstage palette.
 *
 * @public
 */
export type BackstagePalette = Palette & BackstagePaletteAdditions;

/**
 * The full Backstage palette options.
 *
 * @public
 */
export type BackstagePaletteOptions = PaletteOptions &
  BackstagePaletteAdditions;

/**
 * Selector for what page theme to use.
 *
 * @public
 */
export type PageThemeSelector = {
  themeId: string;
};

/**
 * A Backstage theme.
 *
 * @public
 */
export interface BackstageTheme extends Theme {
  palette: BackstagePalette;
  page: PageTheme;
  getPageTheme: (selector: PageThemeSelector) => PageTheme;
}

/**
 * Backstage theme options.
 *
 * @public
 * @remarks
 *
 * This is essentially a partial theme definition made by the user, that then
 * gets merged together with defaults and other values to form the final
 * {@link BackstageTheme}.
 *
 */
export interface BackstageThemeOptions extends ThemeOptions {
  palette: BackstagePaletteOptions;
  page: PageTheme;
  getPageTheme: (selector: PageThemeSelector) => PageTheme;
}

/**
 * A simpler configuration for creating a new theme that just tweaks some parts
 * of the backstage one.
 *
 * @public
 */
export type SimpleThemeOptions = {
  palette: BackstagePaletteOptions;
  defaultPageTheme: string;
  pageTheme?: Record<string, PageTheme>;
  fontFamily?: string;
};

/**
 * The theme definitions for a given layout page.
 *
 * @public
 */
export type PageTheme = {
  colors: string[];
  shape: string;
  backgroundImage: string;
};
