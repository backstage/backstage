/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import {
  EntityContextMenuItemBlueprint,
  useEntityPermission,
} from '@backstage/plugin-catalog-react/alpha';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyTwoTone';
import BugReportIcon from '@material-ui/icons/BugReport';
import CancelIcon from '@material-ui/icons/Cancel';
import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';
import { alertApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  dialogApiRef,
  useTranslationRef,
  type DialogApiDialog,
} from '@backstage/frontend-plugin-api';
import { catalogTranslationRef } from './translation';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UnregisterEntityDialog,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { rootRouteRef, unregisterRedirectRouteRef } from '../routes';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';

export const copyEntityUrlContextMenuItem = EntityContextMenuItemBlueprint.make(
  {
    name: 'copy-entity-url',
    params: {
      icon: <FileCopyTwoToneIcon fontSize="small" />,
      useTitle: () => {
        const { t } = useTranslationRef(catalogTranslationRef);
        return t('entityContextMenu.copyURLMenuTitle');
      },
      useOnClick: () => {
        const [copyState, copyToClipboard] = useCopyToClipboard();
        const alertApi = useApi(alertApiRef);
        const { t } = useTranslationRef(catalogTranslationRef);

        React.useEffect(() => {
          if (!copyState.error && copyState.value) {
            alertApi.post({
              message: t('entityContextMenu.copiedMessage'),
              severity: 'info',
              display: 'transient',
            });
          }
        }, [copyState, alertApi, t]);

        return async () => {
          copyToClipboard(window.location.toString());
        };
      },
    },
  },
);

export const inspectEntityContextMenuItem = EntityContextMenuItemBlueprint.make(
  {
    name: 'inspect-entity',
    params: {
      icon: <BugReportIcon fontSize="small" />,
      useTitle: () => {
        const { t } = useTranslationRef(catalogTranslationRef);
        return t('entityContextMenu.inspectMenuTitle');
      },
      useOnClick: () => {
        const [_, setSearchParams] = useSearchParams();

        return () => {
          setSearchParams('inspect');
        };
      },
    },
  },
);

export const unregisterEntityContextMenuItem =
  EntityContextMenuItemBlueprint.make({
    name: 'unregister-entity',
    params: {
      icon: <CancelIcon fontSize="small" />,
      useTitle: () => {
        const { t } = useTranslationRef(catalogTranslationRef);
        return t('entityContextMenu.unregisterMenuTitle');
      },
      useIsDisabled: () => {
        const unregisterPermission = useEntityPermission(
          catalogEntityDeletePermission,
        );

        return !unregisterPermission.allowed;
      },
      useOnClick: () => {
        const { entity } = useEntity();
        const dialogApi = useApi(dialogApiRef);
        const navigate = useNavigate();
        const catalogRoute = useRouteRef(rootRouteRef);
        const unregisterRedirectRoute = useRouteRef(unregisterRedirectRouteRef);

        return async () => {
          dialogApi.showModal(({ dialog }: { dialog: DialogApiDialog }) => (
            <UnregisterEntityDialog
              open
              entity={entity}
              onClose={() => dialog.close()}
              onConfirm={() => {
                dialog.close();
                navigate(
                  unregisterRedirectRoute
                    ? unregisterRedirectRoute()
                    : catalogRoute(),
                );
              }}
            />
          ));
        };
      },
    },
  });

export default [
  unregisterEntityContextMenuItem,
  inspectEntityContextMenuItem,
  copyEntityUrlContextMenuItem,
];
