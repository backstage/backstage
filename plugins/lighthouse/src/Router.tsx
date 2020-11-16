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
import { Route, Routes } from 'react-router-dom';
import { createAuditRouteRef, rootRouteRef, viewAuditRouteRef } from './plugin';
import AuditList from './components/AuditList';
import AuditView, { AuditViewContent } from './components/AuditView';
import CreateAudit, { CreateAuditContent } from './components/CreateAudit';
import { Entity } from '@backstage/catalog-model';
import { LIGHTHOUSE_WEBSITE_URL_ANNOTATION } from '../constants';
import { AuditListForEntity } from './components/AuditList/AuditListForEntity';
import { MissingAnnotationEmptyState } from '@backstage/core';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[LIGHTHOUSE_WEBSITE_URL_ANNOTATION]);

export const Router = () => (
  <Routes>
    <Route path={`/${rootRouteRef.path}`} element={<AuditList />} />
    <Route path={`/${viewAuditRouteRef.path}`} element={<AuditView />} />
    <Route path={`/${createAuditRouteRef.path}`} element={<CreateAudit />} />
  </Routes>
);

export const EmbeddedRouter = ({ entity }: { entity: Entity }) =>
  !isPluginApplicableToEntity(entity) ? (
    <MissingAnnotationEmptyState
      annotation={LIGHTHOUSE_WEBSITE_URL_ANNOTATION}
    />
  ) : (
    <Routes>
      <Route path={`/${rootRouteRef.path}`} element={<AuditListForEntity />} />
      <Route
        path={`/${viewAuditRouteRef.path}`}
        element={<AuditViewContent />}
      />
      <Route
        path={`/${createAuditRouteRef.path}`}
        element={<CreateAuditContent />}
      />
    </Routes>
  );
