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
import Dialog from '@material-ui/core/Dialog';

export type OnOpenDialog = (options: {
  component: (props: { dialog: DialogApiDialog<any> }) => JSX.Element;
}) => DialogApiDialog<unknown>;

/**
 * Default implementation for the {@link DialogApi}.
 * @internal
 */
export class DefaultDialogApi implements DialogApi {
  #onOpen?: OnOpenDialog;

  open<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): DialogApiDialog<TResult> {
    if (!this.#onOpen) {
      throw new Error('Dialog API has not been connected');
    }
    return this.#onOpen({
      component:
        typeof elementOrComponent === 'function'
          ? elementOrComponent
          : () => elementOrComponent,
    }) as DialogApiDialog<TResult>;
  }

  /** @deprecated Use {@link DefaultDialogApi.open} instead */
  show<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: {
          dialog: DialogApiDialog<TResult | undefined>;
        }) => JSX.Element),
  ): DialogApiDialog<TResult | undefined> {
    // eslint-disable-next-line no-console
    console.warn(
      'DialogApi.show() is deprecated and will be removed in a future release. Use DialogApi.open() instead.',
    );
    const innerDialog = this.open<TResult | undefined>(({ dialog }) => (
      <DeprecatedMuiDialogWrapper
        dialog={dialog}
        content={elementOrComponent}
        modal={false}
      />
    ));
    return wrapDialogHandle(innerDialog, false);
  }

  /** @deprecated Use {@link DefaultDialogApi.open} instead */
  showModal<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): DialogApiDialog<TResult> {
    // eslint-disable-next-line no-console
    console.warn(
      'DialogApi.showModal() is deprecated and will be removed in a future release. Use DialogApi.open() instead.',
    );
    const innerDialog = this.open<TResult>(({ dialog }) => (
      <DeprecatedMuiDialogWrapper
        dialog={dialog}
        content={elementOrComponent}
        modal
      />
    ));
    return wrapDialogHandle(innerDialog, true);
  }

  connect(onOpen: OnOpenDialog): void {
    this.#onOpen = onOpen;
  }
}

function DeprecatedMuiDialogWrapper({
  dialog,
  content,
  modal,
}: {
  dialog: DialogApiDialog<any>;
  content:
    | JSX.Element
    | ((props: { dialog: DialogApiDialog<any> }) => JSX.Element);
  modal: boolean;
}) {
  if (typeof content === 'function') {
    const Content = content;
    return (
      <Dialog open onClose={modal ? undefined : () => dialog.close()}>
        <Content dialog={dialog} />
      </Dialog>
    );
  }
  return (
    <Dialog open onClose={modal ? undefined : () => dialog.close()}>
      {content}
    </Dialog>
  );
}

function wrapDialogHandle<TResult>(
  innerDialog: DialogApiDialog<TResult>,
  modal: boolean,
): DialogApiDialog<TResult> {
  return {
    close(...args: any[]) {
      (innerDialog.close as any)(...args);
    },
    result() {
      return innerDialog.result();
    },
    update(newContent: any) {
      innerDialog.update(({ dialog }: { dialog: DialogApiDialog<TResult> }) => (
        <DeprecatedMuiDialogWrapper
          dialog={dialog}
          content={newContent}
          modal={modal}
        />
      ));
    },
  };
}
