/*
 * Copyright 2021 The Backstage Authors
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

import React, { useState, useEffect } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { useApi } from '@backstage/core-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { bazaarApiRef } from '../../api';
import { EntityBazaarInfoContent } from '../EntityBazaarInfoContent';
import { Card } from '@material-ui/core';
import { parseBazaarResponse } from '../../util/parseMethods';

export const EntityBazaarInfoCard = () => {
  const { entity } = useEntity();
  const bazaarApi = useApi(bazaarApiRef);

  const [bazaarProject, fetchBazaarProject] = useAsyncFn(async () => {
    const response = await bazaarApi.getProjectByRef(
      stringifyEntityRef(entity),
    );

    return await parseBazaarResponse(response);
  });

  const [isBazaar, setIsBazaar] = useState(bazaarProject.value ?? false);

  useEffect(() => {
    fetchBazaarProject();
  }, [fetchBazaarProject]);

  useEffect(() => {
    const isBazaarProject = bazaarProject.value !== undefined;

    setIsBazaar(isBazaarProject);
  }, [bazaarProject.value]);

  if (isBazaar) {
    return (
      <Card>
        <EntityBazaarInfoContent
          bazaarProject={bazaarProject.value}
          fetchBazaarProject={fetchBazaarProject}
        />
      </Card>
    );
  }
  return null;
};
