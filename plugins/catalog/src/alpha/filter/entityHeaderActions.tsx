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

import React from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { EntityHeaderActionBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { useEntityFromUrl } from '../../components/CatalogEntityPage/useEntityFromUrl';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

function useContext() {
  const alertApi = useApi(alertApiRef);
  const entity = useEntityFromUrl();
  return { ...entity, alertApi };
}

const copyToClipboardHeaderAction = EntityHeaderActionBlueprint.make({
  name: 'copy-to-clipboard',
  disabled: true,
  params: {
    tooltip: 'Copy to clipboard',
    getContext: useContext,
    onClick: function onClick(context) {
      const { entity, alertApi } = context as ReturnType<typeof useContext>;
      window.navigator.clipboard.writeText(entity?.metadata?.name ?? '');
      alertApi.post({
        message: 'Copied to clipboard',
        severity: 'success',
      });
    },
    icon: function Icon() {
      return <FileCopyIcon htmlColor="#fff" />;
    },
  },
});

export default [copyToClipboardHeaderAction];
