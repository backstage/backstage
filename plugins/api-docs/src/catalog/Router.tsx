/*
 * Copyright 2020 Spotify AB
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
import { Entity } from '@backstage/catalog-model';
import { Route, Routes } from 'react-router';
import { WarningPanel } from '@backstage/core';
import { catalogRoute } from '../routes';
import { EntityPageApi } from './EntityPageApi';

const isPluginApplicableToEntity = (entity: Entity) => {
  return ((entity.spec?.implementsApis as string[]) || []).length > 0;
};

export const Router = ({ entity }: { entity: Entity }) =>
  // TODO(shmidt-i): move warning to a separate standardized component
  !isPluginApplicableToEntity(entity) ? (
    <WarningPanel title="API Docs plugin:">
      The entity doesn't implement any APIs.
    </WarningPanel>
  ) : (
    <Routes>
      <Route
        path={`/${catalogRoute.path}`}
        element={<EntityPageApi entity={entity} />}
      />
      )
    </Routes>
  );
