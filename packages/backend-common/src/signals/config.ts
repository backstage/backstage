/*
 * Copyright 2023 The Backstage Authors
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
import { SignalsBrokerConfig } from './types';

/**
 * Reads {@link SignalsBrokerConfig} from a {@link @backstage/config#Config} object.
 *
 * @public
 * @remarks
 *
 * @example
 * ```ts
 * const opts = readSignalsBrokerOptions(config.getConfig('backend'));
 * ```
 */
export function readSignalsBrokerOptions(config?: Config): SignalsBrokerConfig {
  const ws = config?.getOptional('signals');
  if (ws === true) {
    return { enabled: true };
  }

  const signalsConfig = config?.getOptionalConfig('signals');
  return {
    enabled: signalsConfig?.getOptionalBoolean('enabled') || false,
    adapter: signalsConfig?.getOptionalString('adapter') || 'memory',
    databaseConnection: config?.getOptional('database.connection'),
  };
}
