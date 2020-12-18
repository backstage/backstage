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
import { Routes, Route } from 'react-router';
import { BuildWithStepsPage } from './BuildWithStepsPage/';
import { BuildsPage } from './BuildsPage';
import { CIRCLECI_ANNOTATION } from '../constants';
import { Entity } from '@backstage/catalog-model';
import { MissingAnnotationEmptyState } from '@backstage/core';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[CIRCLECI_ANNOTATION]);

export const Router = ({ entity }: { entity: Entity }) =>
  !isPluginApplicableToEntity(entity) ? (
    <MissingAnnotationEmptyState annotation={CIRCLECI_ANNOTATION} />
  ) : (
    <Routes>
      <Route path="/" element={<BuildsPage />} />
      <Route path="/:buildId" element={<BuildWithStepsPage />} />
    </Routes>
  );
