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

import { AppConfig } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { withDefaults } from '@backstage/core-components';
import { AppManager } from './AppManager';
import { AppComponents, AppConfigLoader, AppOptions } from './types';
import { defaultApis } from './defaultApis';
import { BackstagePlugin } from '@backstage/core-plugin-api';

const REQUIRED_APP_COMPONENTS: Array<keyof AppComponents> = [
  'Progress',
  'Router',
  'NotFoundErrorPage',
  'BootErrorPage',
  'ErrorBoundaryFallback',
];

/**
 * The default config loader, which expects that config is available at compile-time
 * in `process.env.APP_CONFIG`. APP_CONFIG should be an array of config objects as
 * returned by the config loader.
 *
 * It will also load runtime config from the __APP_INJECTED_RUNTIME_CONFIG__ string,
 * which can be rewritten at runtime to contain an additional JSON config object.
 * If runtime config is present, it will be placed first in the config array, overriding
 * other config values.
 *
 * @public
 */
export const defaultConfigLoader: AppConfigLoader = async (
  // This string may be replaced at runtime to provide additional config.
  // It should be replaced by a JSON-serialized config object.
  // It's a param so we can test it, but at runtime this will always fall back to default.
  runtimeConfigJson: string = '__APP_INJECTED_RUNTIME_CONFIG__',
) => {
  const appConfig = process.env.APP_CONFIG;
  if (!appConfig) {
    throw new Error('No static configuration provided');
  }
  if (!Array.isArray(appConfig)) {
    throw new Error('Static configuration has invalid format');
  }
  const configs = appConfig.slice() as unknown as AppConfig[];

  // Avoiding this string also being replaced at runtime
  if (
    runtimeConfigJson !==
    '__app_injected_runtime_config__'.toLocaleUpperCase('en-US')
  ) {
    try {
      const data = JSON.parse(runtimeConfigJson) as JsonObject;
      if (Array.isArray(data)) {
        configs.push(...data);
      } else {
        configs.push({ data, context: 'env' });
      }
    } catch (error) {
      throw new Error(`Failed to load runtime configuration, ${error}`);
    }
  }

  const windowAppConfig = (window as any).__APP_CONFIG__;
  if (windowAppConfig) {
    configs.push({
      context: 'window',
      data: windowAppConfig,
    });
  }
  return configs;
};

/**
 * Creates a new Backstage App.
 *
 * @public
 */
export function createApp(options?: AppOptions) {
  const optionsWithDefaults = withDefaults(options);

  const missingRequiredComponents = REQUIRED_APP_COMPONENTS.filter(
    name => !options?.components?.[name],
  );
  if (missingRequiredComponents.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      'DEPRECATION WARNING: The createApp options will soon require a minimal set of components to ' +
        'be provided. You can use the default components by using withDefaults from @backstage/core-components ' +
        'like this: createApp(withDefaults({ ... })), or you can provide the components yourself. ' +
        `The following components are missing: ${missingRequiredComponents.join(
          ', ',
        )}`,
    );
  }

  const providedIconKeys = Object.keys(options?.icons ?? {});
  const missingIconKeys = Object.keys(optionsWithDefaults.icons!).filter(
    key => !providedIconKeys.includes(key),
  );
  if (missingIconKeys.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      'DEPRECATION WARNING: The createApp options will soon require a minimal set of icons to ' +
        'be provided. You can use the default icons by using withDefaults from @backstage/core-components ' +
        'like this: createApp(withDefaults({ ... })), or you can provide the icons yourself. ' +
        `The following icons are missing: ${missingIconKeys.join(', ')}`,
    );
  }

  if (!options?.themes) {
    // eslint-disable-next-line no-console
    console.warn(
      'DEPRECATION WARNING: The createApp options will soon require the themes to be provided. ' +
        'You can use the default themes by using withDefaults from @backstage/core-components ' +
        'like this: createApp(withDefaults({ ... })), or you can provide the themes yourself. ',
    );
  }

  const { icons, themes, components } = optionsWithDefaults;

  return new AppManager({
    icons: icons!,
    themes: themes!,
    components: components! as AppComponents,
    defaultApis,
    apis: options?.apis ?? [],
    bindRoutes: options?.bindRoutes,
    plugins: (options?.plugins as BackstagePlugin<any, any>[]) ?? [],
    configLoader: options?.configLoader ?? defaultConfigLoader,
  });
}
