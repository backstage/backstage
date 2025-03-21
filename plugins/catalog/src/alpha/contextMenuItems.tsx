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
import { EntityContextMenuItemBlueprint } from '@backstage/plugin-catalog-react/alpha';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyTwoTone';
import BugReportIcon from '@material-ui/icons/BugReport';
import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogTranslationRef } from './translation';
import { useSearchParams } from 'react-router-dom';

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

export default [inspectEntityContextMenuItem, copyEntityUrlContextMenuItem];
