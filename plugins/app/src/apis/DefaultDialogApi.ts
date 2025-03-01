/*
 * Copyright 2025 The Backstage Authors
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

export type OnShowDialog = (options: {
  component: (props: { dialog: DialogApiDialog<any> }) => React.JSX.Element;
  modal: boolean;
}) => DialogApiDialog;

/**
 * Default implementation for the {@link DialogApi}.
 * @internal
 */
export class DefaultDialogApi implements DialogApi {
  #onShow?: OnShowDialog;

  show<TResult = {}>(
    elementOrComponent:
      | JSX.Element
      | ((props: {
          dialog: DialogApiDialog<TResult | undefined>;
        }) => JSX.Element),
  ): DialogApiDialog<TResult | undefined> {
    if (!this.#onShow) {
      throw new Error('Dialog API has not been connected');
    }
    return this.#onShow({
      component:
        typeof elementOrComponent === 'function'
          ? elementOrComponent
          : () => elementOrComponent,
      modal: false,
    }) as DialogApiDialog<TResult | undefined>;
  }

  showModal<TResult = {}>(
    elementOrComponent:
      | JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): DialogApiDialog<TResult> {
    if (!this.#onShow) {
      throw new Error('Dialog API has not been connected');
    }
    return this.#onShow({
      component:
        typeof elementOrComponent === 'function'
          ? elementOrComponent
          : () => elementOrComponent,
      modal: true,
    }) as DialogApiDialog<TResult>;
  }

  connect(onShow: OnShowDialog): void {
    this.#onShow = onShow;
  }
}
