/*
 * Copyright 2021 The Backstage Authors
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

import { AppTheme, IconComponent } from '@backstage/core-plugin-api';
// This is a bit of a hack that we use to avoid having to redeclare these types
// within this package or have an explicit dependency on core-app-api.
// These types end up being inlined and duplicated into this package at build time.
// eslint-disable-next-line no-restricted-imports
import {
  AppIcons,
  AppComponents,
  AppOptions,
} from '../../../core-app-api/src/app';
import { defaultAppComponents } from './defaultAppComponents';
import { defaultAppIcons } from './defaultAppIcons';
import { defaultAppThemes } from './defaultAppThemes';

interface OptionalAppOptions {
  icons?: Partial<AppIcons> & {
    [key in string]: IconComponent;
  };
  themes?: (Partial<AppTheme> & Omit<AppTheme, 'theme'>)[];
  components?: Partial<AppComponents>;
}

/**
 * The options required by {@link @backstage/core-app-api#createApp}, but with
 * many of the fields being optional
 *
 * @public
 */
type DefaultAppOptions = Omit<AppOptions, keyof OptionalAppOptions> &
  OptionalAppOptions;

/**
 * Provides a set of default App options with the ability to override specific options.
 *
 * These options populate the theme, icons and components options of {@link @backstage/core-app-api#AppOptions}.
 *
 * @public
 */
export function withDefaults(options?: DefaultAppOptions): AppOptions {
  const { themes, icons, components } = options ?? {};

  return {
    ...options,
    themes: themes ?? defaultAppThemes(),
    icons: { ...defaultAppIcons(), ...icons },
    components: { ...defaultAppComponents(), ...components },
  };
}
