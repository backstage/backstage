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

import { createApiRef } from '@backstage/core-plugin-api';

/**
 * A handle for an open dialog that can be used to interact with it.
 *
 * @remarks
 *
 * Dialogs can be opened using either {@link DialogApi.show} or {@link DialogApi.showModal}.
 *
 * @public
 */
export interface DialogApiDialog<TResult = unknown> {
  /**
   * Closes the dialog with that provided result.
   *
   * @remarks
   *
   * If the dialog is a modal dialog a result must always be provided. If it's a regular dialog then passing a result is optional.
   */
  close(
    ...args: undefined extends TResult ? [result?: TResult] : [result: TResult]
  ): void;

  /**
   * Replaces the content of the dialog with the provided element or component, causing it to be rerenedered.
   */
  update(
    elementOrComponent:
      | React.JSX.Element
      | ((props: { dialog: DialogApiDialog<TResult> }) => JSX.Element),
  ): void;

  /**
   * Wait until the dialog is closed and return the result.
   *
   * @remarks
   *
   * If the dialog is a modal dialog a result will always be returned. If it's a regular dialog then the result may be `undefined`.
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
   * Opens a modal dialog and returns a handle to it.
   *
   * @remarks
   *
   * This dialog can be closed by calling the `close` method on the returned handle, optionally providing a result.
   * The dialog can also be closed by the user by clicking the backdrop or pressing the escape key.
   *
   * If the dialog is closed without a result, the result will be `undefined`.
   *
   * @example
   *
   * ### Example with inline dialog content
   * ```tsx
   * const dialog = dialogApi.show<boolean>(
   *   <DialogContent>
   *     <DialogTitle>Are you sure?</DialogTitle>
   *     <DialogActions>
   *       <Button onClick={() => dialog.close(true)}>Yes</Button>
   *       <Button onClick={() => dialog.close(false)}>No</Button>
   *     </DialogActions>
   *   </DialogContent>
   * );
   * const result = await dialog.result();
   * ```
   *
   * @example
   *
   * ### Example with separate dialog component
   * ```tsx
   * function CustomDialog({ dialog }: { dialog: DialogApiDialog<boolean | undefined> }) {
   *   return (
   *     <DialogContent>
   *       <DialogTitle>Are you sure?</DialogTitle>
   *       <DialogActions>
   *         <Button onClick={() => dialog.close(true)}>Yes</Button>
   *         <Button onClick={() => dialog.close(false)}>No</Button>
   *       </DialogActions>
   *     </DialogContent>
   *   )
   * }
   * const result = await dialogApi.show(CustomDialog).result();
   * ```
   *
   * @param elementOrComponent - The element or component to render in the dialog. If a component is provided, it will be provided with a `dialog` prop that contains the dialog handle.
   * @public
   */
  show<TResult = {}>(
    elementOrComponent:
      | JSX.Element
      | ((props: {
          dialog: DialogApiDialog<TResult | undefined>;
        }) => JSX.Element),
  ): DialogApiDialog<TResult | undefined>;

  /**
   * Opens a modal dialog and returns a handle to it.
   *
   * @remarks
   *
   * This dialog can not be closed in any other way than calling the `close` method on the returned handle and providing a result.
   *
   * @example
   *
   * ### Example with inline dialog content
   * ```tsx
   * const dialog = dialogApi.showModal<boolean>(
   *   <DialogContent>
   *     <DialogTitle>Are you sure?</DialogTitle>
   *     <DialogActions>
   *       <Button onClick={() => dialog.close(true)}>Yes</Button>
   *       <Button onClick={() => dialog.close(false)}>No</Button>
   *     </DialogActions>
   *   </DialogContent>
   * );
   * const result = await dialog.result();
   * ```
   *
   * @example
   *
   * ### Example with separate dialog component
   * ```tsx
   * function CustomDialog({ dialog }: { dialog: DialogApiDialog<boolean> }) {
   *   return (
   *     <DialogContent>
   *       <DialogTitle>Are you sure?</DialogTitle>
   *       <DialogActions>
   *         <Button onClick={() => dialog.close(true)}>Yes</Button>
   *         <Button onClick={() => dialog.close(false)}>No</Button>
   *       </DialogActions>
   *     </DialogContent>
   *   )
   * }
   * const result = await dialogApi.showModal(CustomDialog).result();
   * ```
   *
   * @param elementOrComponent - The element or component to render in the dialog. If a component is provided, it will be provided with a `dialog` prop that contains the dialog handle.
   * @public
   */
  showModal<TResult = {}>(
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
export const dialogApiRef = createApiRef<DialogApi>({
  id: 'core.dialog',
});
