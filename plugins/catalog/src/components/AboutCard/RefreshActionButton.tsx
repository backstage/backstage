/*
 * Copyright 2022 The Backstage Authors
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
  ANNOTATION_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { alertApiRef, errorApiRef, useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { IconButton } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import React, { useCallback } from 'react';

export function RefreshActionButton() {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const errorApi = useApi(errorApiRef);

  const entityLocation = entity.metadata.annotations?.[ANNOTATION_LOCATION];
  // Limiting the ability to manually refresh to the less expensive locations
  const allowRefresh =
    entityLocation?.startsWith('url:') || entityLocation?.startsWith('file:');
  const refreshEntity = useCallback(async () => {
    try {
      await catalogApi.refreshEntity(stringifyEntityRef(entity));
      alertApi.post({ message: 'Refresh scheduled', severity: 'info' });
    } catch (e) {
      errorApi.post(e);
    }
  }, [catalogApi, alertApi, errorApi, entity]);

  return (
    <>
      {allowRefresh && (
        <IconButton
          aria-label="Refresh"
          title="Schedule entity refresh"
          onClick={refreshEntity}
        >
          <CachedIcon />
        </IconButton>
      )}
    </>
  );
}
