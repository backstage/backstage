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
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { Route, Routes } from 'react-router';
import { JENKINS_ANNOTATION, LEGACY_JENKINS_ANNOTATION } from '../constants';
import { buildRouteRef, rootRouteRef } from '../plugin';
import { CITable } from './BuildsPage/lib/CITable';
import { DetailedViewPage } from './BuildWithStepsPage/';

export const isJenkinsAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[JENKINS_ANNOTATION]) ||
  Boolean(entity.metadata.annotations?.[LEGACY_JENKINS_ANNOTATION]);

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const Router = (_props: Props) => {
  const { entity } = useEntity();

  if (!isJenkinsAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={JENKINS_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path={`/${rootRouteRef.path}`} element={<CITable />} />
      <Route path={`/${buildRouteRef.path}`} element={<DetailedViewPage />} />
    </Routes>
  );
};
