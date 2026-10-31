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

import { DialogApi, DialogApiDialog } from '@backstage/frontend-plugin-api';
import type { LegacyDialogApi as LegacyDialogApiContract } from './legacyApiRefs';

export class LegacyDialogApi implements LegacyDialogApiContract {
  constructor(private readonly dialogApi: DialogApi) {}

  open<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): DialogApiDialog<TResult> {
    return this.dialogApi.open(elementOrComponent);
  }

  show(): never {
    throw new Error(
      'DialogApi.show is no longer supported. Use DialogApi.open with explicit dialog presentation instead.',
    );
  }

  showModal(): never {
    throw new Error(
      'DialogApi.showModal is no longer supported. Use DialogApi.open with explicit dialog presentation instead.',
    );
  }
}
