/*
 * Copyright 2024 The Backstage Authors
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

import { ExtensionInput } from '@backstage/frontend-plugin-api';
import { OpaqueType } from '@internal/opaque';

export type ExtensionInputContext = {
  input: string;
  kind?: string;
  name?: string;
};

export const OpaqueExtensionInput = OpaqueType.create<{
  public: ExtensionInput;
  versions: {
    readonly version: undefined;
    readonly context?: ExtensionInputContext;
    withContext?(context: ExtensionInputContext): ExtensionInput;
  };
}>({
  type: '@backstage/ExtensionInput',
  versions: [undefined],
});
