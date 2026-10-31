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
  DialogApi,
  DialogApiDialog,
  IconComponent,
  IconsApi,
} from '@backstage/frontend-plugin-api';
import { createApiRef } from '@backstage/frontend-plugin-api';

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

export const legacyDialogApiRef = createApiRef<LegacyDialogApi>().with({
  id: 'core.dialog',
  pluginId: 'app',
});
export const legacyIconsApiRef = createApiRef<LegacyIconsApi>().with({
  id: 'core.icons',
  pluginId: 'app',
});
