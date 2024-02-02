/*
 * Copyright 2024 The Backstage Authors
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
import { Routes, Route } from 'react-router-dom';
import { GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION } from './useWorkstations';
import { GcpCloudworkstationsPage } from '../plugin';

/** @public */
export const isGCPCloudWorkstationsAvailable = (entity: Entity) =>
  Boolean(
    entity.metadata.annotations?.[GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION],
  );

/** @public */
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<GcpCloudworkstationsPage />} />
    </Routes>
  );
};
