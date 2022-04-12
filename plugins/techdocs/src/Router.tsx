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

import React, { PropsWithChildren } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Entity } from '@backstage/catalog-model';
import { FlatRoutes } from '@backstage/core-app-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

import { EntityPageDocs } from './EntityPageDocs';
import { TechDocsIndexPage } from './home/components/TechDocsIndexPage';
import { TechDocsReaderPage } from './reader/components/TechDocsReaderPage';

const TECHDOCS_ANNOTATION = 'backstage.io/techdocs-ref';

/**
 * Helper that takes in entity and returns true/false if TechDocs is available for the entity
 *
 * @public
 */
export const isTechDocsAvailable = (entity: Entity) =>
  Boolean(entity?.metadata?.annotations?.[TECHDOCS_ANNOTATION]);

/**
 * Responsible for registering routes for TechDocs, TechDocs Homepage and separate TechDocs page
 *
 * @public
 */
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TechDocsIndexPage />} />
      <Route
        path="/:namespace/:kind/:name/*"
        element={<TechDocsReaderPage />}
      />
    </Routes>
  );
};

/**
 * Responsible for registering route to view docs on Entity page
 *
 * @public
 */
export const EmbeddedDocsRouter = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  const { entity } = useEntity();

  const projectId = entity.metadata.annotations?.[TECHDOCS_ANNOTATION];

  if (!projectId) {
    return <MissingAnnotationEmptyState annotation={TECHDOCS_ANNOTATION} />;
  }

  return (
    <FlatRoutes>
      <Route path="/*" element={<EntityPageDocs entity={entity} />}>
        {children}
      </Route>
    </FlatRoutes>
  );
};
