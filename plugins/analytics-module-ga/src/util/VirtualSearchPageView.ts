/*
 * Copyright 2022 The Backstage Authors
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

type VirtualSearchPageViewType = 'disabled' | 'only' | 'both';

export type VirtualSearchPageViewConfig = {
  mode: VirtualSearchPageViewType;
  mountPath: string;
  searchQuery: string;
  categoryQuery?: string;
};

function isVirtualSearchPageViewType(
  value: string | undefined,
): value is VirtualSearchPageViewType {
  return value === 'disabled' || value === 'only' || value === 'both';
}

export function parseVirtualSearchPageViewConfig(
  config: Config | undefined,
): VirtualSearchPageViewConfig {
  const vspvModeString = config?.getOptionalString('mode');
  return {
    mode: isVirtualSearchPageViewType(vspvModeString)
      ? vspvModeString
      : 'disabled',
    mountPath: config?.getOptionalString('mountPath') ?? '/search',
    searchQuery: config?.getOptionalString('searchQuery') ?? 'query',
    categoryQuery: config?.getOptionalString('categoryQuery'),
  };
}
