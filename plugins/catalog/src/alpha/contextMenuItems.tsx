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
import { useEffect } from 'react';

export const copyEntityUrlContextMenuItem = EntityContextMenuItemBlueprint.make(
  {
    name: 'copy-entity-url',
    params: {
      icon: <FileCopyTwoToneIcon fontSize="small" />,
      useProps: () => {
        const [copyState, copyToClipboard] = useCopyToClipboard();
        const alertApi = useApi(alertApiRef);
        const { t } = useTranslationRef(catalogTranslationRef);

        useEffect(() => {
          if (!copyState.error && copyState.value) {
            alertApi.post({
              message: t('entityContextMenu.copiedMessage'),
              severity: 'info',
              display: 'transient',
            });
          }
        }, [copyState, alertApi, t]);

        return {
          title: t('entityContextMenu.copyURLMenuTitle'),
          onClick: async () => {
            copyToClipboard(window.location.toString());
          },
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
      useProps: () => {
        const [_, setSearchParams] = useSearchParams();
        const { t } = useTranslationRef(catalogTranslationRef);

        return {
          title: t('entityContextMenu.inspectMenuTitle'),
          onClick: async () => {
            setSearchParams('inspect');
          },
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
      useProps: () => {
        const { entity } = useEntity();
        const dialogApi = useApi(dialogApiRef);
        const navigate = useNavigate();
        const catalogRoute = useRouteRef(rootRouteRef);

        const { t } = useTranslationRef(catalogTranslationRef);
        const unregisterRedirectRoute = useRouteRef(unregisterRedirectRouteRef);
        const unregisterPermission = useEntityPermission(
          catalogEntityDeletePermission,
        );

        return {
          title: t('entityContextMenu.unregisterMenuTitle'),
          disabled: !unregisterPermission.allowed,
          onClick: async () => {
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
          },
        };
      },
    },
  });

export default [
  unregisterEntityContextMenuItem,
  inspectEntityContextMenuItem,
  copyEntityUrlContextMenuItem,
];
