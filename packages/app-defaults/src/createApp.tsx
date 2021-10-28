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

import { apis, components, icons, themes } from './defaults';
import {
  AppTheme,
  BackstagePlugin,
  IconComponent,
} from '@backstage/core-plugin-api';
import {
  AppComponents,
  AppOptions,
  AppIcons,
  createSpecializedApp,
} from '@backstage/core-app-api';

/**
 * Creates a new Backstage App using a default set of components, icons and themes unless
 * they are explicitly provided.
 *
 * @public
 */
export function createApp(
  options?: Omit<AppOptions, keyof OptionalAppOptions> & OptionalAppOptions,
) {
  return createSpecializedApp({
    ...options,
    apis: options?.apis ?? [],
    bindRoutes: options?.bindRoutes,
    components: {
      ...components,
      ...options?.components,
    },
    configLoader: options?.configLoader,
    defaultApis: apis,
    icons: {
      ...icons,
      ...options?.icons,
    },
    plugins: (options?.plugins as BackstagePlugin<any, any>[]) ?? [],
    themes: options?.themes ?? themes,
  });
}

/**
 * The set of app options that {@link createApp} will provide defaults for
 * if they are not passed in explicitly.
 *
 * @public
 */
export type OptionalAppOptions = {
  /**
   * A set of icons to override the default icons with.
   *
   * The override is applied for each icon individually.
   *
   * @public
   */
  icons?: Partial<AppIcons> & {
    [key in string]: IconComponent;
  };

  /**
   * A set of themes that override all of the default app themes.
   *
   * If this option is provided none of the default themes will be used.
   *
   * @public
   */
  themes?: (Partial<AppTheme> & Omit<AppTheme, 'theme'>)[]; // TODO: simplify once AppTheme is updated

  /**
   * A set of components to override the default components with.
   *
   * The override is applied for each icon individually.
   *
   * @public
   */
  components?: Partial<AppComponents>;
};
