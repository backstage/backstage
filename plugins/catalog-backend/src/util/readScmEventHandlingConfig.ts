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

import { Config } from '@backstage/config';
import lodash from 'lodash';

export interface ScmEventHandlingConfig {
  refresh: boolean;
  unregister: boolean;
  move: boolean;
}

const disabled: ScmEventHandlingConfig = {
  refresh: false,
  unregister: false,
  move: false,
};

const defaults: ScmEventHandlingConfig = {
  refresh: true,
  unregister: true,
  move: true,
};

export function readScmEventHandlingConfig(
  config: Config,
): ScmEventHandlingConfig {
  const rootKey = 'catalog.scmEvents';

  if (!config.has(rootKey) || config.get(rootKey) === true) {
    return { ...defaults };
  } else if (config.get(rootKey) === false) {
    return { ...disabled };
  }

  const given = {
    refresh: config.getOptionalBoolean(`${rootKey}.refresh`),
    unregister: config.getOptionalBoolean(`${rootKey}.unregister`),
    move: config.getOptionalBoolean(`${rootKey}.move`),
  };

  return lodash.merge({}, defaults, given);
}
