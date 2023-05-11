/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROLLBAR_ANNOTATION } from '../constants';
import { EntityPageRollbar } from './EntityPageRollbar/EntityPageRollbar';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

/** @public */
export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ROLLBAR_ANNOTATION]);

/** @public */
export const Router = () => {
  const { entity } = useEntity();

  if (!isPluginApplicableToEntity(entity)) {
    <MissingAnnotationEmptyState annotation={ROLLBAR_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path="/" element={<EntityPageRollbar />} />
    </Routes>
  );
};
