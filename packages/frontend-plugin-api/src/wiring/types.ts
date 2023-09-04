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

import { PortableSchema } from '../schema';
import { ExtensionDataBind } from './createExtension';
import { ExtensionDataRef } from './createExtensionDataRef';
import { BackstagePlugin } from './createPlugin';

/** @public */
export type AnyExtensionDataMap = Record<string, ExtensionDataRef<any>>;

/** @public */
export interface Extension<TConfig> {
  $$type: 'extension';
  id: string;
  at: string;
  disabled: boolean;
  inputs: Record<string, { extensionData: AnyExtensionDataMap }>;
  output: AnyExtensionDataMap;
  configSchema?: PortableSchema<TConfig>;
  factory(options: {
    source?: BackstagePlugin;
    bind: ExtensionDataBind<AnyExtensionDataMap>;
    config: TConfig;
    inputs: Record<string, Array<Record<string, unknown>>>;
  }): void;
}
