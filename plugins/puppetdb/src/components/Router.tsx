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

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { puppetDbReportRouteRef } from '../routes';
import { ANNOTATION_PUPPET_CERTNAME } from '../constants';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { ReportsPage } from './ReportsPage';
import { ReportDetailsPage } from './ReportDetailsPage';

/**
 * Checks if the entity has a puppet certname annotation.
 * @param entity - The entity to check for the puppet certname annotation.
 *
 * @public
 */
export const isPuppetDbAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ANNOTATION_PUPPET_CERTNAME]);

/** @public */
export const Router = () => {
  const { entity } = useEntity();

  if (!isPuppetDbAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState annotation={ANNOTATION_PUPPET_CERTNAME} />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<ReportsPage />} />
      <Route
        path={`${puppetDbReportRouteRef.path}`}
        element={<ReportDetailsPage />}
      />
    </Routes>
  );
};
