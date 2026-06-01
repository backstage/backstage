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

import { Fragment, useEffect, useState } from 'react';
import {
  AppRootElementBlueprint,
  DialogApi,
  DialogApiDialog,
  dialogApiRef,
} from '@backstage/frontend-plugin-api';
import { createDeferred } from '@backstage/types';
import { OnOpenDialog } from '../apis/DefaultDialogApi';

let dialogId = 0;
function getDialogId() {
  dialogId += 1;
  return dialogId.toString(36);
}

type DialogState = DialogApiDialog<unknown> & {
  id: string;
};

/**
 * The other half of the default implementation of the {@link DialogApi}.
 *
 * This component is responsible for rendering the dialogs in the React tree
 * and managing a stack of dialogs. It renders only the most recently opened
 * dialog, without any dialog chrome — the caller is expected to provide their
 * own dialog component (overlay, backdrop, surface, etc.).
 *
 * It expects the implementation of the {@link DialogApi} to be the
 * `DefaultDialogApi`. If one is replaced the other must be too.
 *
 * @internal
 */
function DialogDisplay({
  dialogApi,
}: {
  dialogApi: DialogApi & { connect(onOpen: OnOpenDialog): void };
}) {
  const [dialogs, setDialogs] = useState<
    { dialog: DialogState; element: React.JSX.Element }[]
  >([]);

  useEffect(() => {
    dialogApi.connect(options => {
      const id = getDialogId();
      const deferred = createDeferred<unknown>();
      const dialog: DialogState = {
        id,
        close(result) {
          deferred.resolve(result);
          setDialogs(ds => ds.filter(d => d.dialog.id !== id));
        },
        update(ElementOrComponent) {
          const element =
            typeof ElementOrComponent === 'function' ? (
              <ElementOrComponent dialog={dialog} />
            ) : (
              ElementOrComponent
            );
          setDialogs(ds =>
            ds.map(d => (d.dialog.id === id ? { dialog, element } : d)),
          );
        },
        async result() {
          return deferred;
        },
      };
      const element = <options.component dialog={dialog} />;
      setDialogs(ds => [...ds, { dialog, element }]);
      return dialog;
    });
  }, [dialogApi]);

  if (dialogs.length > 0) {
    return dialogs[dialogs.length - 1].element;
  }

  return null;
}

export const dialogDisplayAppRootElement =
  AppRootElementBlueprint.makeWithOverrides({
    name: 'dialog-display',
    factory(originalFactory, { apis }) {
      const dialogApi = apis.get(dialogApiRef);
      if (!isInternalDialogApi(dialogApi)) {
        return originalFactory({
          element: <Fragment />,
        });
      }
      return originalFactory({
        element: <DialogDisplay dialogApi={dialogApi} />,
      });
    },
  });

function isInternalDialogApi(
  dialogApi?: DialogApi,
): dialogApi is DialogApi & { connect(onOpen: OnOpenDialog): void } {
  if (!dialogApi) {
    return false;
  }
  return 'connect' in dialogApi;
}
