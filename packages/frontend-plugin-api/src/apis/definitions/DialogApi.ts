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

import { createApiRef } from '../system';

/**
 * A handle for an open dialog that can be used to interact with it.
 *
 * @remarks
 *
 * Dialogs are opened using {@link DialogApi.open}.
 *
 * @public
 */
export interface DialogApiDialog<TResult = void> {
  /**
   * Closes the dialog with the provided result.
   *
   * @remarks
   *
   * Whether a result is required depends on the `TResult` type parameter
   * chosen when the dialog was opened. If the type includes `undefined`,
   * calling `close()` without a result is allowed.
   */
  close(
    ...args: undefined extends TResult ? [result?: TResult] : [result: TResult]
  ): void;

  /**
   * Replaces the rendered dialog with the provided element or component.
   *
   * @remarks
   *
   * Just like the element or component passed to {@link DialogApi.open}, the
   * caller is responsible for providing the full dialog including all chrome.
   */
  update(
    elementOrComponent:
      | JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): void;

  /**
   * Wait until the dialog is closed and return the result.
   */
  result(): Promise<TResult>;
}

/**
 * A Utility API for showing dialogs that render in the React tree and return a result.
 *
 * @public
 */
export interface DialogApi {
  /**
   * Opens a dialog and returns a handle to it.
   *
   * @remarks
   *
   * The provided element or component is rendered as-is in the app's React tree.
   * It is the caller's responsibility to provide all dialog chrome, such as an
   * overlay, backdrop, and dialog surface. This makes the method agnostic to the
   * design library used for the dialog.
   *
   * @example
   *
   * ### Example with inline dialog element
   * ```tsx
   * const dialog = dialogApi.open<boolean>(
   *   <Dialog isOpen onOpenChange={isOpen => !isOpen && dialog.close()}>
   *     <DialogHeader>Are you sure?</DialogHeader>
   *     <DialogBody>This action cannot be undone.</DialogBody>
   *     <DialogFooter>
   *       <Button onPress={() => dialog.close(false)}>Cancel</Button>
   *       <Button onPress={() => dialog.close(true)}>Confirm</Button>
   *     </DialogFooter>
   *   </Dialog>
   * );
   * const result = await dialog.result();
   * ```
   *
   * @example
   *
   * ### Example with a dialog component
   * ```tsx
   * function ConfirmDialog({ dialog }: { dialog: DialogApiDialog<boolean> }) {
   *   return (
   *     <Dialog isOpen onOpenChange={isOpen => !isOpen && dialog.close()}>
   *       <DialogHeader>Are you sure?</DialogHeader>
   *       <DialogBody>This action cannot be undone.</DialogBody>
   *       <DialogFooter>
   *         <Button onPress={() => dialog.close(false)}>Cancel</Button>
   *         <Button onPress={() => dialog.close(true)}>Confirm</Button>
   *       </DialogFooter>
   *     </Dialog>
   *   );
   * }
   * const result = await dialogApi.open(ConfirmDialog).result();
   * ```
   *
   * @param elementOrComponent - The element or component to render. If a component is provided, it will be provided with a `dialog` prop that contains the dialog handle.
   */
  open<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): DialogApiDialog<TResult>;

  /**
   * Opens a dialog with built-in dialog chrome and returns a handle to it.
   *
   * @deprecated Use {@link DialogApi.open} instead. The `open` method does not
   * render any dialog chrome, giving the caller full control over the dialog
   * presentation. This avoids focus trap conflicts across design libraries.
   *
   * @param elementOrComponent - The element or component to render in the dialog. If a component is provided, it will be provided with a `dialog` prop that contains the dialog handle.
   */
  show<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: {
          dialog: DialogApiDialog<TResult | undefined>;
        }) => JSX.Element),
  ): DialogApiDialog<TResult | undefined>;

  /**
   * Opens a modal dialog with built-in dialog chrome and returns a handle to it.
   *
   * @deprecated Use {@link DialogApi.open} instead. The `open` method does not
   * render any dialog chrome, giving the caller full control over the dialog
   * presentation. This avoids focus trap conflicts across design libraries.
   *
   * @param elementOrComponent - The element or component to render in the dialog. If a component is provided, it will be provided with a `dialog` prop that contains the dialog handle.
   */
  showModal<TResult = void>(
    elementOrComponent:
      | JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): DialogApiDialog<TResult>;
}

/**
 * The `ApiRef` of {@link DialogApi}.
 *
 * @public
 */
export const dialogApiRef = createApiRef<DialogApi>().with({
  id: 'core.dialog',
  pluginId: 'app',
});
