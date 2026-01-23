/*
 * Copyright 2024 The Backstage Authors
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

import {
  UnifiedThemeProvider,
  themes as builtinThemes,
} from '@backstage/theme';
import DarkIcon from '@material-ui/icons/Brightness2';
import LightIcon from '@material-ui/icons/WbSunny';
import {
  createExtensionInput,
  ThemeBlueprint,
  ApiBlueprint,
  appThemeApiRef,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppThemeSelector } from '../../../../packages/core-app-api/src/apis/implementations';

/**
 * Contains the themes installed into the app.
 */
export const AppThemeApi = ApiBlueprint.makeWithOverrides({
  name: 'app-theme',
  inputs: {
    themes: createExtensionInput([ThemeBlueprint.dataRefs.theme], {
      replaces: [{ id: 'app', input: 'themes' }],
    }),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory(defineParams =>
      defineParams({
        api: appThemeApiRef,
        deps: {},
        factory: () => {
          const nonAppExtensions = inputs.themes.filter(
            i => i.node.spec.plugin?.id !== 'app',
          );

          if (nonAppExtensions.length > 0) {
            const list = nonAppExtensions.map(i => i.node.spec.id).join(', ');
            // eslint-disable-next-line no-console
            console.warn(
              `DEPRECATION WARNING: Theme should only be installed as an extension in the app plugin. ` +
                `You can either use appPlugin.override(), or a module for the app plugin. The following extension will be ignored in the future: ${list}`,
            );
          }

          return AppThemeSelector.createWithStorage(
            inputs.themes.map(i => i.get(ThemeBlueprint.dataRefs.theme)),
          );
        },
      }),
    );
  },
});

export const LightTheme = ThemeBlueprint.make({
  name: 'light',
  params: {
    theme: {
      id: 'light',
      title: 'Light Theme',
      variant: 'light',
      icon: <LightIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
      ),
    },
  },
});

export const DarkTheme = ThemeBlueprint.make({
  name: 'dark',
  params: {
    theme: {
      id: 'dark',
      title: 'Dark Theme',
      variant: 'dark',
      icon: <DarkIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={builtinThemes.dark} children={children} />
      ),
    },
  },
});
