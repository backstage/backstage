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

import { ReactNode } from 'react';
import { ApiRef, createApiRef } from '../system';
import { Observable } from '@backstage/types';

/**
 * Describes a theme provided by the app.
 *
 * @public
 */
export type AppTheme = {
  /**
   * ID used to remember theme selections.
   */
  id: string;

  /**
   * Title of the theme
   */
  title: string;

  /**
   * Theme variant
   */
  variant: 'light' | 'dark';

  /**
   * An Icon for the theme mode setting.
   */
  icon?: React.ReactElement;

  Provider(props: { children: ReactNode }): JSX.Element | null;
};

/**
 * The AppThemeApi gives access to the current app theme, and allows switching
 * to other options that have been registered as a part of the App.
 *
 * @public
 */
export type AppThemeApi = {
  /**
   * Get a list of available themes.
   */
  getInstalledThemes(): AppTheme[];

  /**
   * Observe the currently selected theme. A value of undefined means no specific theme has been selected.
   */
  activeThemeId$(): Observable<string | undefined>;

  /**
   * Get the current theme ID. Returns undefined if no specific theme is selected.
   */
  getActiveThemeId(): string | undefined;

  /**
   * Set a specific theme to use in the app, overriding the default theme selection.
   *
   * Clear the selection by passing in undefined.
   */
  setActiveThemeId(themeId?: string): void;
};

/**
 * The {@link ApiRef} of {@link AppThemeApi}.
 *
 * @public
 */
export const appThemeApiRef: ApiRef<AppThemeApi> = createApiRef({
  id: 'core.apptheme',
});
