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

import { ApiRef } from '../ApiRef';
import { BackstageTheme } from '@backstage/theme';

/**
 * Describes a theme provided by the app.
 */
export type AppTheme = {
  /**
   * Title of the theme
   */
  title: string;

  /**
   * Theme variant
   */
  variant: 'light' | 'dark';

  /**
   * The specialized MaterialUI theme instance.
   */
  theme: BackstageTheme;
};

/**
 * The AppThemeApi gives access to the current app theme, and allows switching
 * to other options that have been registered as a part of the App.
 */
export type AppThemeApi = {
  /**
   * Get a list of available themes.
   */
  getThemeOptions(): AppTheme[];

  /**
   * Get the current theme. Returns undefined if the default theme is used.
   */
  getTheme(): AppTheme | undefined;

  /**
   * Set a specific theme to use in the app, overriding the default theme selection.
   */
  setTheme(theme?: AppTheme): void;
};

export const appThemeApiRef = new ApiRef<AppThemeApi>({
  id: 'core.apptheme',
  description: 'API Used to configure the app theme, and enumerate options',
});
