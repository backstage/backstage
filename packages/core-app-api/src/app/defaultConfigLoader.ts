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
import { AppConfigLoader } from './types';

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
export const defaultConfigLoader: AppConfigLoader = async () =>
  defaultConfigLoaderSync();

/** @internal */
export function defaultConfigLoaderSync(
  // This string may be replaced at runtime to provide additional config.
  // It should be replaced by a JSON-serialized config object.
  // It's a param so we can test it, but at runtime this will always fall back to default.
  runtimeConfigJson: string = '__APP_INJECTED_RUNTIME_CONFIG__',
) {
  const appConfig = process.env.APP_CONFIG;
  if (!appConfig) {
    throw new Error('No static configuration provided');
  }
  if (!Array.isArray(appConfig)) {
    throw new Error('Static configuration has invalid format');
  }
  const configs = appConfig.slice() as unknown as AppConfig[];

  // Check if we have any config script tags, otherwise fall back to injected config
  const configScripts = document.querySelectorAll(
    'script[type="backstage.io/config"]',
  );
  if (configScripts.length > 0) {
    for (const el of configScripts) {
      try {
        const content = el.textContent;
        if (!content) {
          throw new Error('tag is empty');
        }
        let data;
        try {
          data = JSON.parse(content);
        } catch (error) {
          throw new Error(`failed to parse config; ${error}`);
        }
        if (!Array.isArray(data)) {
          throw new Error('data is not an array');
        }
        configs.push(...data);
      } catch (error) {
        throw new Error(
          `Failed to load config from script tag, ${error.message}`,
        );
      }
    }
  } else if (
    runtimeConfigJson !==
    // Avoiding this string also being replaced at runtime
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
}
