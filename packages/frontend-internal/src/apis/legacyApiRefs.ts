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

import type {
  ApiRef,
  DialogApi,
  DialogApiDialog,
  IconComponent,
  IconsApi,
} from '@backstage/frontend-plugin-api';
import { OpaqueApiRef } from './OpaqueApiRef';

export interface LegacyDialogApi extends DialogApi {
  show<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: {
          dialog: DialogApiDialog<TResult | undefined>;
        }) => JSX.Element),
  ): DialogApiDialog<TResult | undefined>;

  showModal<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): DialogApiDialog<TResult>;
}

export interface LegacyIconsApi extends IconsApi {
  getIcon(key: string): IconComponent | undefined;
}

// These contracts remain available to plugins compiled against the original API IDs.
// Use the opaque constructor to avoid initializing frontend-plugin-api in a cycle.
function createLegacyApiRef<T>(id: string): ApiRef<T> {
  return OpaqueApiRef.createInstance('v1', {
    id,
    pluginId: 'app',
    T: null as unknown as T,
    toString() {
      return `apiRef{${id}}`;
    },
  }) as ApiRef<T>;
}

export const legacyDialogApiRef =
  createLegacyApiRef<LegacyDialogApi>('core.dialog');
export const legacyIconsApiRef =
  createLegacyApiRef<LegacyIconsApi>('core.icons');
