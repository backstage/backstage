/*
 * Copyright 2026 The Backstage Authors
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

import { AppConfig, Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import set from 'lodash/set';
import unset from 'lodash/unset';

/** @internal */
export function filterPublicConfig(
  appConfigs: AppConfig[],
  config: Config,
): AppConfig[] {
  const publicConfig = config.getOptionalConfig('app.publicConfig');
  if (!publicConfig) {
    return appConfigs;
  }

  const allowedConfig =
    publicConfig.getOptionalStringArray('allowedConfig') ?? [];
  const allowedExtensions =
    publicConfig.getOptionalStringArray('allowedExtensions') ?? [];

  return appConfigs.map(appConfig => {
    const source = cloneDeep(appConfig.data);
    const extensions = source.app && (source.app as JsonObject).extensions;
    // Remove extensions before picking so parent and descendant paths cannot bypass the allowlist.
    unset(source, 'app.extensions');
    const data = pick(source, allowedConfig);

    if (Array.isArray(extensions)) {
      set(
        data,
        'app.extensions',
        extensions.filter(extension => {
          if (typeof extension === 'string') {
            return allowedExtensions.includes(extension);
          }
          if (
            extension &&
            typeof extension === 'object' &&
            !Array.isArray(extension)
          ) {
            const ids = Object.keys(extension);
            return ids.length === 1 && allowedExtensions.includes(ids[0]);
          }
          return false;
        }),
      );
    }

    return { ...appConfig, data };
  });
}
