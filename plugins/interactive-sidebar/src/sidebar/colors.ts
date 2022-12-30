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

import { BackstageTheme } from '@backstage/plugin-interactive-drawers';
import { lightTheme, darkTheme } from '@backstage/theme';

import lightHue from '@material-ui/core/colors/blueGrey';
import darkHue from '@material-ui/core/colors/brown';

// TODO: Move this into core backstage theme

// Invert keys to make light<-->dark numbers opposite to match dark-mode
const darkAccent = Object.fromEntries(
  Object.keys(darkHue)
    .filter(key => key.match(/^\d+$/))
    .map(key => [
      // eslint-disable-next-line no-nested-ternary
      parseInt(key, 10) === 50
        ? 900
        : parseInt(key, 10) === 900
        ? 50
        : 900 - parseInt(key, 10),
      darkHue[key as keyof typeof darkHue],
    ]),
) as typeof darkHue;

export const colors = {
  dark: {
    accent: darkAccent,
    backgroundColor: '#3c3c3c',
    textColor: 'white',
    textColorDimmed: '#d5d5d5',
    selectionBackgroundColor: '#86afe3',
    selectableBackgroundColor: '#ffffff18',
    borderColor: '#262626',
    secondBackgroundColor: '#323232',
  },
  light: {
    accent: lightHue,
    backgroundColor: 'white',
    textColor: lightHue.A700,
    textColorDimmed: lightHue[500],
    selectionBackgroundColor: lightHue[500],
    selectableBackgroundColor: `${lightHue[300]}40`,
    borderColor: lightHue[50],
    secondBackgroundColor: '#ffffff',
  },
} as const;

export const getTheme = (darkMode = false): Partial<BackstageTheme> => {
  const colorTypes = darkMode ? colors.dark : colors.light;
  return {
    ...(darkMode ? darkTheme : lightTheme),
    accentColor: colorTypes.accent,
    sidebarBackgroundColor: colorTypes.backgroundColor,
    sidebarTextColor: colorTypes.textColor,
    sidebarTextDimmedColor: colorTypes.textColorDimmed,
    sidebarSelectionBackgroundColor: colorTypes.selectionBackgroundColor,
    sidebarSelectableBackgroundColor: colorTypes.selectableBackgroundColor,
    sidebarBorderColor: colorTypes.borderColor,
    sidebarSecondSidebarBackgroundColor: `${colorTypes.secondBackgroundColor}D0`,
    sidebarSecondSidebarBackdropFilter: 'blur(25px)',
  };
};
