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
import { Route, Routes } from 'react-router';
import { buildRouteRef, rootRouteRef } from '../plugin';
import { DetailedViewPage } from './BuildWithStepsPage/';
import { JENKINS_ANNOTATION } from '../constants';
import { Entity } from '@backstage/catalog-model';
import { MissingAnnotationEmptyState } from '@backstage/core';
import { CITable } from './BuildsPage/lib/CITable';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[JENKINS_ANNOTATION]);

export const Router = ({ entity }: { entity: Entity }) => {
  return !isPluginApplicableToEntity(entity) ? (
    <MissingAnnotationEmptyState annotation={JENKINS_ANNOTATION} />
  ) : (
    <Routes>
      <Route path={`/${rootRouteRef.path}`} element={<CITable />} />
      <Route path={`/${buildRouteRef.path}`} element={<DetailedViewPage />} />
    </Routes>
  );
};
