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

import { Entity } from '@backstage/catalog-model';
import {
  MissingAnnotationEmptyState,
  createRoutableExtension,
} from '@backstage/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { EntityPageDocs } from './EntityPageDocs';
import {
  plugin,
  rootCatalogDocsRouteRef,
  rootDocsRouteRef,
  rootRouteRef,
} from './plugin';
import { TechDocsHome } from './reader/components/TechDocsHome';
import { TechDocsPage } from './reader/components/TechDocsPage';

const TECHDOCS_ANNOTATION = 'backstage.io/techdocs-ref';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TechDocsHome />} />
      <Route path={`/${rootDocsRouteRef.path}`} element={<TechDocsPage />} />
    </Routes>
  );
};

export const EmbeddedDocsRouter = ({ entity }: { entity: Entity }) => {
  const projectId = entity.metadata.annotations?.[TECHDOCS_ANNOTATION];

  if (!projectId) {
    return <MissingAnnotationEmptyState annotation={TECHDOCS_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route
        path={`/${rootCatalogDocsRouteRef.path}`}
        element={<EntityPageDocs entity={entity} />}
      />
    </Routes>
  );
};

export const TechdocsHomePage = plugin.provide(
  createRoutableExtension({
    component: Router,
    mountPoint: rootRouteRef,
  }),
);
