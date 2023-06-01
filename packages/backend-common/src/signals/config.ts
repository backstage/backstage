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
import { SignalsServerConfig } from './types';

/**
 * Reads {@link SignalsServerConfig} from a {@link @backstage/config#Config} object.
 *
 * @public
 * @remarks
 *
 * @example
 * ```ts
 * const opts = readEventsServerOptions(config.getConfig('backend'));
 * ```
 */
export function readEventsServerOptions(config?: Config): SignalsServerConfig {
  const ws = config?.getOptional('signals');
  if (ws === true) {
    return { enabled: true };
  }

  const eventsConfig = config?.getOptionalConfig('signals');
  return {
    enabled: eventsConfig?.getOptionalBoolean('signals') ?? false,
  };
}
