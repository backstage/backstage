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

import { renderInTestApp } from '@backstage/frontend-test-utils';
import React, { act, useEffect } from 'react';
import {
  AppRootElementBlueprint,
  DialogApi,
  DialogApiDialog,
  dialogApiRef,
} from '@backstage/frontend-plugin-api';
import { createDeferred } from '@backstage/types';
import userEvent from '@testing-library/user-event';

async function withDialogApi<T>(
  callback: (dialogApi: DialogApi) => Promise<T>,
) {
  const deferred = createDeferred<DialogApi>();
  await renderInTestApp(<div />, {
    extensions: [
      AppRootElementBlueprint.makeWithOverrides({
        name: 'derp',
        factory(originalFactory, { apis }) {
          function TestComponent() {
            useEffect(() => {
              deferred.resolve(apis.get(dialogApiRef)!);
            }, []);
            return <div />;
          }
          return originalFactory({ element: <TestComponent /> });
        },
      }),
    ],
  });
  return await callback(await deferred);
}

describe('DialogDisplay', () => {
  function AutoDialog({
    dialog,
    result,
  }: {
    dialog: DialogApiDialog<string | undefined>;
    result?: string;
  }) {
    useEffect(() => {
      if (result) {
        dialog.close(result);
      }
    }, [dialog, result]);
    return <div />;
  }

  it('should render a simple dialog', async () => {
    const result = await withDialogApi(async dialogApi => {
      const dialog = await act(() => dialogApi.show<string>(<div>Test</div>));
      dialog.close('test');
      return dialog.result();
    });
    expect(result).toBe('test');
  });

  it('should allow dialog to be updated', async () => {
    const result = await withDialogApi(async dialogApi => {
      const dialog = await act(() => dialogApi.show(AutoDialog));

      setTimeout(async () => {
        await act(async () => {
          dialog.update(props => <AutoDialog {...props} result="test2" />);
        });
      }, 100);

      return dialog.result();
    });

    expect(result).toBe('test2');
  });

  it('should allow dialog to be closed by pressing escape', async () => {
    const result = await withDialogApi(async dialogApi => {
      const dialog = await act(() => dialogApi.show(AutoDialog));

      setTimeout(async () => {
        await userEvent.keyboard('{Escape}');
      }, 100);

      return dialog.result();
    });

    expect(result).toBe(undefined);
  });

  it('should allow a stack of dialogs', async () => {
    const result = await withDialogApi(async dialogApi => {
      const dialog1 = await act(() => dialogApi.show(AutoDialog));
      const dialog2 = await act(() => dialogApi.show(AutoDialog));
      const dialog3 = await act(() => dialogApi.show(AutoDialog));

      setTimeout(async () => {
        await act(async () => {
          dialog3.close('test3');
          dialog1.close('test1');
          dialog2.close('test2');
        });
      }, 100);

      return Promise.all([
        dialog1.result(),
        dialog2.result(),
        dialog3.result(),
      ]);
    });

    expect(result).toEqual(['test1', 'test2', 'test3']);
  });

  it('should only cancel one dialog at a time', async () => {
    const result = await withDialogApi(async dialogApi => {
      const dialog1 = await act(() => dialogApi.show(AutoDialog));
      const dialog2 = await act(() => dialogApi.show(AutoDialog));
      const dialog3 = await act(() => dialogApi.show(AutoDialog));

      setTimeout(async () => {
        await userEvent.keyboard('{Escape}');

        await act(async () => {
          dialog1.close('test1');
          dialog2.close('test2');
          dialog3.close('test3');
        });
      }, 100);

      return Promise.all([
        dialog1.result(),
        dialog2.result(),
        dialog3.result(),
      ]);
    });

    expect(result).toEqual(['test1', 'test2', undefined]);
  });

  it('should not allow modal dialog to be closed by pressing escape', async () => {
    const result = await withDialogApi(async dialogApi => {
      const dialog = await act(() => dialogApi.showModal(AutoDialog));

      setTimeout(async () => {
        await userEvent.keyboard('{Escape}');

        setTimeout(async () => {
          await act(async () => {
            dialog.close('test');
          });
        }, 100);
      }, 100);

      return dialog.result();
    });

    expect(result).toBe('test');
  });
});
